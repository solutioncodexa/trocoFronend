import { useRef, type ReactNode } from 'react';
import { categoriesApi } from '@/services/api/categories';
import { productsApi } from '@/services/api/products';
import { parseAmount, type ManageWidget } from '@/config/assistantFlow';
import {
  MAX_CHOICES,
  hasRealVariants,
  keepOriginalPrice,
  matchItems,
  parseStockCount,
  validCategoryName,
  type ManageKind,
} from '@/config/manageFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { CategoryDTO } from '@/types/api';
import type { ProductDetailDTO } from '@/types/product-dtos';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';
import { ChipsWidget } from './AssistantDesignWidgets';
import { SummaryWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  invalidate: () => void;
};

type Item = { id: string; label: string };
type Selected = { kind: ManageKind; id: string; label: string };

const RECENT = 6;
const categoryLabel = (c: CategoryDTO) => (c.parentName ? `${c.parentName} › ${c.name}` : c.name);

/**
 * Conversation « modifier ou supprimer l'existant ». Prix, stock, nom et visibilité s'appliquent tout de suite
 * (et se rechangent de la même façon) ; la suppression demande toujours une confirmation. Les produits à variantes
 * restent à l'écran Produits pour ne rien perdre.
 */
export function useManageFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, invalidate } = ctx;
  const kind = useRef<ManageKind>('product');
  const choices = useRef<Item[]>([]);
  const categories = useRef<CategoryDTO[]>([]);
  const selected = useRef<Selected | null>(null);
  const field = useRef<'price' | 'stock' | 'name'>('price');
  const detail = useRef<ProductDetailDTO | null>(null);

  const say = (content: string, widget?: ManageWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.manage.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const askType = () => {
    setStep('manageType');
    say(t('assistant.manage.type'), { kind: 'xpick', id: 'type' });
  };

  const start = () => {
    clearWidgets();
    echo(t('assistant.manage.start'));
    askType();
  };

  // ───────────── Recherche ─────────────

  const recentItems = async (): Promise<Item[]> => {
    if (kind.current === 'product') {
      const page = await productsApi.getAllProducts({ size: RECENT });
      return page.content.map((p) => ({ id: p.id, label: p.name }));
    }
    categories.current = await categoriesApi.getAllCategories();
    return categories.current.slice(0, RECENT).map((c) => ({ id: String(c.id), label: categoryLabel(c) }));
  };

  const onType = (id: string) => {
    if (id !== 'product' && id !== 'category') return;
    kind.current = id;
    void act(async () => {
      const recent = await recentItems();
      clearWidgets();
      echo(t(`assistant.manage.type.${id}`));
      if (recent.length === 0) {
        say(t(`assistant.manage.empty.${id}`));
        return setStep(null);
      }
      choices.current = recent;
      setStep('manageSearch');
      say(t(`assistant.manage.search.${id}`), { kind: 'xfield', field: 'search' });
    });
  };

  const choose = (item: Item) => {
    selected.current = { kind: kind.current, ...item };
    clearWidgets();
    echo(item.label);
    setStep('manageAction');
    say(t('assistant.manage.action', { name: item.label }), { kind: 'xpick', id: 'action' });
  };

  const onSearch = (query: string) =>
    act(async () => {
      let found: Item[];
      if (kind.current === 'product') {
        const page = await productsApi.getAllProducts({ size: 30, keyword: query });
        found = matchItems(
          page.content.map((p) => ({ id: p.id, label: p.name })),
          query,
        );
      } else {
        found = matchItems(
          categories.current.map((c) => ({ id: String(c.id), label: categoryLabel(c) })),
          query,
        );
      }
      if (found.length === 0) {
        echo(query);
        return void say(t('assistant.manage.notfound', { q: query }), { kind: 'xfield', field: 'search' });
      }
      if (found.length === 1) return choose(found[0]);
      choices.current = found.slice(0, MAX_CHOICES);
      clearWidgets();
      echo(query);
      say(t('assistant.manage.choose'), { kind: 'xpick', id: 'choose' });
    });

  // ───────────── Actions ─────────────

  const current = () => selected.current as Selected;
  const category = () => categories.current.find((c) => String(c.id) === current().id);

  const askAgain = () => {
    setStep('manageAgain');
    say(t('assistant.manage.again'), { kind: 'xyesno' });
  };

  const loadProduct = async () => {
    const d = await productsApi.getProductById(current().id);
    detail.current = d;
    return d;
  };

  const saveProduct = (d: ProductDetailDTO, patch: { price?: number; stockQuantity?: number }) => {
    const price = patch.price ?? d.price;
    return productsApi.updateProduct(String(d.id), {
      name: d.name,
      description: d.description,
      shortDescription: d.shortDescription,
      price,
      originalPrice: keepOriginalPrice(d.originalPrice, price),
      category: d.category,
      sku: d.sku,
      stockQuantity: patch.stockQuantity ?? d.stockQuantity,
      badges: d.badges,
      marque: d.marque,
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
      availableSizes: d.availableSizes,
      weight: d.weight,
      marginGain: d.marginGain,
      customizable: d.customizable,
      variants: [],
    });
  };

  const onAction = (id: string) => {
    const sel = current();
    if (id === 'delete') {
      clearWidgets();
      echo(t('assistant.manage.action.delete'));
      setStep('manageConfirm');
      return void act(async () => {
        if (sel.kind === 'product') await loadProduct();
        say(t(`assistant.manage.delete.${sel.kind}`), { kind: 'xconfirm' });
      });
    }
    if (sel.kind === 'category' && (id === 'hide' || id === 'show')) {
      return void act(async () => {
        await categoriesApi.bulkSetActive([Number(sel.id)], id === 'show');
        invalidate();
        clearWidgets();
        echo(t(`assistant.manage.action.${id}`));
        say(t(`assistant.manage.${id}.done`, { name: sel.label }));
        askAgain();
      });
    }
    if (id !== 'price' && id !== 'stock' && id !== 'name') return;
    void act(async () => {
      let currentValue: string | number = '';
      if (sel.kind === 'product') {
        const d = await loadProduct();
        if (hasRealVariants(d.variants)) {
          clearWidgets();
          echo(t(`assistant.manage.action.${id}`));
          say(t('assistant.manage.variants', { name: sel.label }));
          return askAgain();
        }
        currentValue = id === 'price' ? d.price : (d.stockQuantity ?? 0);
      } else {
        currentValue = category()?.name ?? '';
      }
      field.current = id;
      clearWidgets();
      echo(t(`assistant.manage.action.${id}`));
      setStep(`manage${id.charAt(0).toUpperCase()}${id.slice(1)}`);
      say(t(`assistant.manage.${id}.ask`, { name: sel.label, current: currentValue }), { kind: 'xfield', field: id });
    });
  };

  const onValue = (value: string) => {
    const sel = current();
    const f = field.current;
    const invalid = () => say(t('assistant.flow.invalid'), { kind: 'xfield', field: f });
    if (f === 'price') {
      const price = parseAmount(value);
      if (price === null) return invalid();
      return void act(async () => {
        const d = detail.current as ProductDetailDTO;
        await saveProduct(d, { price });
        invalidate();
        clearWidgets();
        echo(`${price} MAD`);
        say(t('assistant.manage.price.done', { name: sel.label, from: d.price, to: price }));
        askAgain();
      });
    }
    if (f === 'stock') {
      const stock = parseStockCount(value);
      if (stock === null) return invalid();
      return void act(async () => {
        const d = detail.current as ProductDetailDTO;
        await saveProduct(d, { stockQuantity: stock });
        invalidate();
        clearWidgets();
        echo(String(stock));
        say(t('assistant.manage.stock.done', { name: sel.label, from: d.stockQuantity ?? 0, to: stock }));
        askAgain();
      });
    }
    if (!validCategoryName(value)) return invalid();
    void act(async () => {
      const c = category();
      if (!c) return;
      const name = value.trim();
      await categoriesApi.updateCategory(c.id, {
        name,
        slug: c.slug,
        description: c.description,
        seoTitle: c.seoTitle,
        seoDescription: c.seoDescription,
        parentId: c.parentId ?? undefined,
      });
      invalidate();
      clearWidgets();
      echo(name);
      say(t('assistant.manage.name.done', { from: c.name, to: name }));
      askAgain();
    });
  };

  const confirmDelete = () =>
    act(async () => {
      const sel = current();
      if (sel.kind === 'product') await productsApi.deleteProduct(sel.id);
      else await categoriesApi.deleteCategory(Number(sel.id));
      invalidate();
      clearWidgets();
      echo(t('assistant.manage.delete.confirm'));
      say(t('assistant.manage.delete.done', { name: sel.label }));
      askAgain();
    });

  const cancel = () => {
    clearWidgets();
    echo(t('assistant.catalog.product.cancel'));
    askAgain();
  };

  const onAgain = (yes: boolean) => {
    clearWidgets();
    if (!yes) {
      echo(t('assistant.flow.no'));
      setStep(null);
      return say(t('assistant.manage.done'));
    }
    echo(t('assistant.flow.yes'));
    askType();
  };

  const actionOptions = () => {
    const sel = selected.current;
    if (!sel) return [];
    const ids =
      sel.kind === 'product'
        ? ['price', 'stock', 'delete']
        : ['name', category()?.active === false ? 'show' : 'hide', 'delete'];
    return ids.map((id) => ({ id, label: t(`assistant.manage.action.${id}` as AdminMessageKey) }));
  };

  const renderWidget = (w: ManageWidget): ReactNode => {
    switch (w.kind) {
      case 'xyesno':
        return <YesNoWidget busy={busy} onYes={() => onAgain(true)} onNo={() => onAgain(false)} />;
      case 'xpick':
        if (w.id === 'type') {
          return (
            <ChipsWidget
              busy={busy}
              onPick={onType}
              options={(['product', 'category'] as const).map((k) => ({ id: k, label: t(`assistant.manage.type.${k}`) }))}
            />
          );
        }
        if (w.id === 'choose') {
          return (
            <ChipsWidget
              busy={busy}
              options={choices.current.map((c) => ({ id: c.id, label: c.label }))}
              onPick={(id) => {
                const item = choices.current.find((c) => c.id === id);
                if (item) choose(item);
              }}
            />
          );
        }
        return <ChipsWidget busy={busy} options={actionOptions()} onPick={onAction} />;
      case 'xfield':
        return (
          <FieldWidget
            key={w.field}
            busy={busy}
            inputMode={w.field === 'price' ? 'decimal' : w.field === 'stock' ? 'numeric' : 'text'}
            placeholder={w.field === 'search' ? t('assistant.manage.search.placeholder') : undefined}
            suggestions={w.field === 'search' ? choices.current.map((c) => c.label) : undefined}
            onSubmit={(v) => (w.field === 'search' ? void onSearch(v) : onValue(v))}
          />
        );
      case 'xconfirm': {
        const sel = current();
        const rows = [{ label: t('assistant.manage.summary.item'), value: sel.label }];
        if (sel.kind === 'product' && detail.current) {
          rows.push({ label: t('assistant.manage.summary.price'), value: `${detail.current.price} MAD` });
        }
        if (sel.kind === 'category') {
          const n = category()?.productCount;
          if (n !== undefined) rows.push({ label: t('assistant.manage.summary.products'), value: String(n) });
        }
        return (
          <SummaryWidget
            busy={busy}
            confirmLabel={t('assistant.manage.delete.confirm')}
            cancelLabel={t('assistant.catalog.product.cancel')}
            onConfirm={() => void confirmDelete()}
            onCancel={cancel}
            rows={rows}
          />
        );
      }
    }
  };

  return { start, renderWidget };
}
