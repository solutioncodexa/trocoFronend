import { useRef, type ReactNode } from 'react';
import { proposeCopy } from '@/config/copyProposal';
import { categoriesApi } from '@/services/api/categories';
import { productsApi } from '@/services/api/products';
import { compressImageWithReport } from '@/utils/compressImage';
import { parseAmount, type CatalogWidget } from '@/config/assistantFlow';
import {
  categoryOptions,
  checkPhotos,
  localizeTree,
  parseStock,
  planCategoryCreation,
  validDescription,
  validProductName,
  type ActivityId,
  type Lang,
  type SelectedCat,
} from '@/config/catalogTemplates';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { CategoryDTO } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import {
  ActivityWidget,
  CatTreeWidget,
  CategoryPickWidget,
  ConfirmProductWidget,
  FieldWidget,
  PhotosWidget,
} from './AssistantCatalogWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  lang: Lang;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  /** Étape en cours, transmise au modèle pour qu'il reste dans le contexte (lettres uniquement). */
  setStep: (step: string | null) => void;
  storeName?: string;
  /** Rafraîchit les listes de catégories / produits déjà affichées dans l'admin. */
  invalidate: () => void;
};

type Draft = {
  categorySlug: string;
  categoryLabel: string;
  name: string;
  price: number;
  files: File[];
  description: string;
  stock?: number;
};

const emptyDraft = (): Draft => ({ categorySlug: '', categoryLabel: '', name: '', price: 0, files: [], description: '' });

const PRICE_SUGGESTIONS = ['50', '100', '200', '500'];
const STOCK_SUGGESTIONS = ['5', '10', '20', '50'];

/**
 * Conversation « catalogue » : l'assistant pose les questions (activité, catégories, article…), propose des
 * suggestions et enregistre via l'API existante. Le modèle n'écrit jamais en base.
 */
export function useCatalogFlow(ctx: Ctx) {
  const { t, lang, busy, setBusy, push, clearWidgets, setStep, storeName, invalidate } = ctx;
  const cats = useRef<CategoryDTO[]>([]);
  const draft = useRef<Draft>(emptyDraft());

  const say = (content: string, widget?: CatalogWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  /** Exécute une action ; en cas d'échec le widget reste affiché pour réessayer. */
  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.catalog.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const askActivity = () => {
    setStep('catalogCategories');
    say(t('assistant.catalog.activity.ask'), { kind: 'activity' });
  };

  const askProduct = () => {
    setStep('catalogProduct');
    say(t('assistant.catalog.product.ask'), { kind: 'cyesno', id: 'addProduct' });
  };

  const startProduct = () => {
    setStep('catalogProduct');
    if (cats.current.length === 0) {
      say(t('assistant.catalog.product.noCats'));
      askActivity();
      return;
    }
    draft.current = emptyDraft();
    say(t('assistant.catalog.product.category'), { kind: 'catPick' });
  };

  const finish = () => {
    setStep(null);
    say(t('assistant.catalog.done'));
  };

  const start = () =>
    act(async () => {
      cats.current = await categoriesApi.getAllCategories();
      echo(t('assistant.catalog.start'));
      say(t('assistant.catalog.intro'));
      if (cats.current.length === 0) askActivity();
      else say(t('assistant.catalog.haveCats', { n: cats.current.length }), { kind: 'cyesno', id: 'moreCats' });
    });

  const onYesNo = (id: 'moreCats' | 'addProduct' | 'another', yes: boolean) => {
    clearWidgets();
    echo(t(yes ? 'assistant.flow.yes' : 'assistant.flow.no'));
    if (id === 'moreCats') return yes ? askActivity() : askProduct();
    return yes ? startProduct() : finish();
  };

  const onActivity = (id: ActivityId) => {
    clearWidgets();
    echo(t(`assistant.catalog.activity.${id}`));
    say(t('assistant.catalog.tree.ask'), { kind: 'catTree', activity: id });
  };

  const onCustomActivity = (text: string) => {
    clearWidgets();
    echo(text);
    say(t('assistant.catalog.tree.custom'), { kind: 'catTree', activity: null });
  };

  const onTreeConfirm = (selected: SelectedCat[]) =>
    act(async () => {
      const plan = planCategoryCreation(selected, cats.current);
      const idByKey: Record<string, number> = { ...plan.reuse };
      for (const c of plan.toCreate) {
        const parentId = c.parentKey ? idByKey[c.parentKey] : undefined;
        const created = await categoriesApi.createCategory({ name: c.name, slug: c.slug, parentId });
        idByKey[c.key] = created.id;
        cats.current = [...cats.current, created];
      }
      invalidate();
      clearWidgets();
      echo(selected.filter((s) => !s.parentKey).map((s) => s.name).join(', '));
      say(plan.toCreate.length ? t('assistant.catalog.tree.done', { n: plan.toCreate.length }) : t('assistant.catalog.tree.nothingNew'));
      askProduct();
    });

  const onCategory = (slug: string, label: string) => {
    draft.current.categorySlug = slug;
    draft.current.categoryLabel = label;
    clearWidgets();
    echo(label);
    say(t('assistant.catalog.product.name'), { kind: 'cfield', field: 'name' });
  };

  const askDescription = (files: File[]) =>
    act(async () => {
      draft.current.files = files;
      clearWidgets();
      // Proposition de texte : l'utilisateur la reprend d'un clic ou écrit la sienne.
      const proposal =
        (await proposeCopy('product_description', draft.current.name, { storeName, locale: lang })) ?? undefined;
      say(t('assistant.catalog.product.desc'), { kind: 'cfield', field: 'desc', proposal });
    });

  const onPhotos = (files: File[]) => {
    if (!checkPhotos(files)) {
      say(t('assistant.catalog.product.photosInvalid'));
      return;
    }
    void act(async () => {
      const prepared = await Promise.all(
        files.map(async (f) => {
          try {
            return (await compressImageWithReport(f, { log: false })).file;
          } catch {
            return f;
          }
        }),
      );
      echo(t('assistant.catalog.product.photosCount', { n: prepared.length }));
      await askDescription(prepared);
    });
  };

  const skipPhotos = () => {
    echo(t('assistant.flow.skip'));
    void askDescription([]);
  };

  const askStock = () => say(t('assistant.catalog.product.stock'), { kind: 'cfield', field: 'stock' });

  const askConfirm = () => say(t('assistant.catalog.product.confirm'), { kind: 'cconfirm' });

  const onField = (field: 'name' | 'price' | 'desc' | 'stock', value: string) => {
    const invalid = () => say(t('assistant.flow.invalid'));
    switch (field) {
      case 'name':
        if (!validProductName(value)) return invalid();
        draft.current.name = value.trim();
        clearWidgets();
        echo(value);
        return say(t('assistant.catalog.product.price'), { kind: 'cfield', field: 'price' });
      case 'price': {
        const price = parseAmount(value);
        if (price === null) return invalid();
        draft.current.price = price;
        clearWidgets();
        echo(`${price} MAD`);
        return say(t('assistant.catalog.product.photos'), { kind: 'photos' });
      }
      case 'desc':
        if (!validDescription(value)) return invalid();
        draft.current.description = value.trim();
        clearWidgets();
        echo(value.length > 80 ? `${value.slice(0, 80)}…` : value);
        return askStock();
      case 'stock': {
        const stock = parseStock(value);
        if (stock === null) return invalid();
        draft.current.stock = stock;
        clearWidgets();
        echo(String(stock));
        return askConfirm();
      }
    }
  };

  const skipStock = () => {
    draft.current.stock = undefined;
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askConfirm();
  };

  const createProduct = () =>
    act(async () => {
      const d = draft.current;
      await productsApi.createProduct(
        {
          name: d.name,
          description: d.description,
          price: d.price,
          category: d.categorySlug,
          stockQuantity: d.stock,
        },
        d.files,
      );
      invalidate();
      clearWidgets();
      echo(t('assistant.catalog.product.create'));
      say(`${t('assistant.catalog.product.created', { name: d.name })}\n${t('assistant.catalog.product.view')} : /admin/produits`);
      say(t('assistant.catalog.product.another'), { kind: 'cyesno', id: 'another' });
    });

  const cancelProduct = () => {
    clearWidgets();
    echo(t('assistant.catalog.product.cancel'));
    say(t('assistant.catalog.product.cancelled'));
    say(t('assistant.catalog.product.another'), { kind: 'cyesno', id: 'another' });
  };

  const renderWidget = (w: CatalogWidget): ReactNode => {
    switch (w.kind) {
      case 'cyesno':
        return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
      case 'activity':
        return <ActivityWidget busy={busy} onPick={onActivity} onCustom={onCustomActivity} />;
      case 'catTree':
        return (
          <CatTreeWidget
            busy={busy}
            nodes={w.activity ? localizeTree(w.activity, lang) : []}
            onConfirm={(selected) => void onTreeConfirm(selected)}
          />
        );
      case 'catPick':
        return <CategoryPickWidget busy={busy} options={categoryOptions(cats.current)} onPick={onCategory} />;
      case 'cfield':
        return (
          <FieldWidget
            busy={busy}
            multiline={w.field === 'desc'}
            proposal={w.proposal}
            inputMode={w.field === 'price' ? 'decimal' : w.field === 'stock' ? 'numeric' : 'text'}
            suggestions={w.field === 'price' ? PRICE_SUGGESTIONS : w.field === 'stock' ? STOCK_SUGGESTIONS : undefined}
            placeholder={t(
              w.field === 'name'
                ? 'assistant.catalog.product.namePlaceholder'
                : w.field === 'price'
                  ? 'assistant.catalog.product.pricePlaceholder'
                  : w.field === 'stock'
                    ? 'assistant.catalog.product.stockPlaceholder'
                    : 'assistant.catalog.product.descPlaceholder',
            )}
            onSubmit={(value) => onField(w.field, value)}
            onSkip={w.field === 'stock' ? skipStock : undefined}
          />
        );
      case 'photos':
        return <PhotosWidget busy={busy} onConfirm={onPhotos} onSkip={skipPhotos} />;
      case 'cconfirm': {
        const d = draft.current;
        return (
          <ConfirmProductWidget
            busy={busy}
            rows={[
              { label: t('assistant.catalog.summary.name'), value: d.name },
              { label: t('assistant.catalog.summary.price'), value: `${d.price} MAD` },
              { label: t('assistant.catalog.summary.category'), value: d.categoryLabel },
              { label: t('assistant.catalog.summary.stock'), value: d.stock === undefined ? '—' : String(d.stock) },
              { label: t('assistant.catalog.summary.photos'), value: String(d.files.length) },
            ]}
            onCreate={() => void createProduct()}
            onCancel={cancelProduct}
          />
        );
      }
    }
  };

  return { start, renderWidget };
}
