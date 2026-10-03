import { useRef, type ReactNode } from 'react';
import { categoriesApi } from '@/services/api/categories';
import { platformApi } from '@/services/api/platform';
import { promoCodesApi } from '@/services/api/promoCodes';
import { storePagesApi } from '@/services/api/storePages';
import { parseAmount, type MarketingWidget } from '@/config/assistantFlow';
import {
  PROMO_CODE_SUGGESTIONS,
  buildMarketingFlow,
  isMetaPixel,
  isTikTokPixel,
  missingPixels,
  needsSeo,
  normalizePromoCode,
  parsePercent,
  parseGoogleId,
  parseUses,
  pixelSlotAvailable,
  pixelSlotsUsed,
  seoForCategory,
  seoForStore,
  validPromoCode,
  type MarketingStepId,
  type PixelKind,
} from '@/config/marketingFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { CategoryDTO, StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { DiscountType } from '@/types/promo-codes';
import type { StorePage } from '@/types/store-pages';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';
import { ChipsWidget } from './AssistantDesignWidgets';
import { SummaryWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  lang: 'fr' | 'en' | 'ar';
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  saveSettings: (payload: UpdateStoreSettingsRequest) => Promise<StoreSettingsDTO>;
  invalidate: () => void;
};

type PromoDraft = { code: string; kind: DiscountType; value: number; maxUses?: number };

const MAX_BATCH = 30;
const blank = (v?: string | null) => !v || !v.trim();

/**
 * Conversation « marketing et référencement » : pixels (dans la limite du plan), titre et description Google de
 * l'accueil et des catégories, premier code promo. Les enregistrements passent par l'API existante.
 */
export function useMarketingFlow(ctx: Ctx) {
  const { t, lang, busy, setBusy, push, clearWidgets, setStep, saveSettings, invalidate } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const planInfo = useRef<{ name: string; maxPixels: number | null }>({ name: '', maxPixels: null });
  const queue = useRef<MarketingStepId[]>([]);
  const pixelQueue = useRef<PixelKind[]>([]);
  const homePage = useRef<StorePage | null>(null);
  const seoCats = useRef<CategoryDTO[]>([]);
  const promo = useRef<PromoDraft>({ code: '', kind: 'percentage', value: 0 });

  const say = (content: string, widget?: MarketingWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });
  const storeName = () => settings.current?.siteName?.trim() || '';

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.mkt.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const save = async (payload: UpdateStoreSettingsRequest) => {
    const updated = await saveSettings(payload);
    settings.current = updated;
    invalidate();
    return updated;
  };

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setStep(null);
      say(t('assistant.mkt.done'));
      return;
    }
    setStep(`marketing${next.charAt(0).toUpperCase()}${next.slice(1)}`);
    if (next === 'pixels') {
      pixelQueue.current = settings.current ? missingPixels(settings.current) : [];
      const max = planInfo.current.maxPixels;
      const used = settings.current ? pixelSlotsUsed(settings.current) : 0;
      return say(
        max == null ? t('assistant.mkt.pixels.askUnlimited') : t('assistant.mkt.pixels.ask', { max, used }),
        { kind: 'myesno', id: 'pixels' },
      );
    }
    if (next === 'homeSeo') return say(t('assistant.mkt.homeSeo.ask'), { kind: 'mseo' });
    if (next === 'catSeo') return say(t('assistant.mkt.catSeo.ask', { n: seoCats.current.length }), { kind: 'myesno', id: 'catSeo' });
    return say(t('assistant.mkt.promo.ask'), { kind: 'myesno', id: 'promo' });
  };

  const start = () =>
    act(async () => {
      const [current, plans, pages, cats, promos] = await Promise.all([
        platformApi.getMyStoreSettings(),
        platformApi.getPlans(),
        storePagesApi.list(),
        categoriesApi.getAllCategories(),
        promoCodesApi.getAll({ size: 1 }),
      ]);
      settings.current = current;
      const plan = plans.find((p) => p.code.toLowerCase() === (current.planCode ?? '').toLowerCase());
      planInfo.current = { name: plan?.name ?? current.planCode ?? '', maxPixels: plan?.maxPixels ?? null };

      const home = pages.find((p) => p.isHome);
      homePage.current = home ? await storePagesApi.get(home.id) : null;
      seoCats.current = cats.filter(needsSeo).slice(0, MAX_BATCH);

      queue.current = buildMarketingFlow({
        ...current,
        maxPixels: planInfo.current.maxPixels,
        homeNeedsSeo: Boolean(homePage.current && (blank(homePage.current.seoTitle) || blank(homePage.current.seoDescription))),
        categoriesNeedingSeo: seoCats.current.length,
        promoCount: promos.totalElements ?? 0,
      });

      echo(t('assistant.mkt.start'));
      if (queue.current.length === 0) return void say(t('assistant.mkt.nothing'));
      say(t('assistant.mkt.intro'));
      askNext();
    });

  const skip = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askNext();
  };

  // ───────────── Pixels ─────────────

  const askPixel = () => {
    const next = pixelQueue.current.shift();
    if (!next) return askNext();
    const used = settings.current ? pixelSlotsUsed(settings.current) : 0;
    if (!pixelSlotAvailable(used, planInfo.current.maxPixels)) {
      pixelQueue.current = [];
      say(t('assistant.mkt.pixels.limit', { plan: planInfo.current.name, max: planInfo.current.maxPixels ?? 0 }));
      return askNext();
    }
    say(t(`assistant.mkt.pixels.${next}`), { kind: 'mfield', field: next });
  };

  const skipPixel = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askPixel();
  };

  const onPixel = (field: PixelKind, value: string) => {
    const invalid = () => say(t('assistant.flow.invalid'));
    let payload: UpdateStoreSettingsRequest;
    let shown = value.trim();
    if (field === 'meta') {
      if (!isMetaPixel(value)) return invalid();
      payload = { metaPixelId: value.trim() };
    } else if (field === 'tiktok') {
      if (!isTikTokPixel(value)) return invalid();
      shown = value.trim().toUpperCase();
      payload = { tiktokPixelId: shown };
    } else {
      const g = parseGoogleId(value);
      if (!g) return invalid();
      shown = g.id;
      payload = g.kind === 'analytics' ? { googleAnalyticsId: g.id } : { googleAdsId: g.id };
    }
    void act(async () => {
      await save(payload);
      clearWidgets();
      echo(shown);
      say(t('assistant.mkt.pixels.saved'));
      askPixel();
    });
  };

  // ───────────── SEO ─────────────

  const applyHomeSeo = () =>
    act(async () => {
      const page = homePage.current;
      if (!page) return askNext();
      const seo = seoForStore(lang, storeName() || page.title, settings.current?.tagline);
      await storePagesApi.update(page.id, {
        title: page.title,
        titleAr: page.titleAr ?? undefined,
        slug: page.slug,
        isHome: page.isHome,
        showInNav: page.showInNav,
        published: page.published,
        sortOrder: page.sortOrder,
        seoTitle: blank(page.seoTitle) ? seo.title : (page.seoTitle ?? undefined),
        seoDescription: blank(page.seoDescription) ? seo.description : (page.seoDescription ?? undefined),
        ogImageUrl: page.ogImageUrl ?? undefined,
        seoTitleAr: page.seoTitleAr ?? undefined,
        seoDescriptionAr: page.seoDescriptionAr ?? undefined,
        publishAt: page.publishAt ?? null,
        unpublishAt: page.unpublishAt ?? null,
        abVariant: page.abVariant ?? null,
      });
      invalidate();
      clearWidgets();
      echo(t('assistant.mkt.homeSeo.apply'));
      say(t('assistant.mkt.homeSeo.done'));
      askNext();
    });

  const generateCategorySeo = () =>
    act(async () => {
      let n = 0;
      for (const c of seoCats.current) {
        const seo = seoForCategory(lang, c.name, storeName() || c.name);
        await categoriesApi.updateCategory(c.id, {
          name: c.name,
          slug: c.slug,
          description: c.description,
          seoTitle: blank(c.seoTitle) ? seo.title : c.seoTitle,
          seoDescription: blank(c.seoDescription) ? seo.description : c.seoDescription,
          parentId: c.parentId ?? undefined,
        });
        n += 1;
      }
      invalidate();
      clearWidgets();
      echo(t('assistant.flow.yes'));
      say(t('assistant.mkt.catSeo.done', { n }));
      askNext();
    });

  // ───────────── Code promo ─────────────

  const onPromoField = (field: 'promoCode' | 'promoValue' | 'promoUses', value: string) => {
    const invalid = () => say(t('assistant.flow.invalid'));
    if (field === 'promoCode') {
      if (!validPromoCode(value)) return invalid();
      promo.current = { code: normalizePromoCode(value), kind: 'percentage', value: 0 };
      clearWidgets();
      echo(promo.current.code);
      return say(t('assistant.mkt.promo.kind'), { kind: 'mkind' });
    }
    if (field === 'promoValue') {
      const v = promo.current.kind === 'percentage' ? parsePercent(value) : parseAmount(value);
      if (v === null) return invalid();
      promo.current.value = v;
      clearWidgets();
      echo(promo.current.kind === 'percentage' ? `${v} %` : `${v} MAD`);
      return say(t('assistant.mkt.promo.uses'), { kind: 'mfield', field: 'promoUses' });
    }
    const uses = parseUses(value);
    if (uses === null) return invalid();
    promo.current.maxUses = uses;
    clearWidgets();
    echo(String(uses));
    say(t('assistant.mkt.promo.confirm'), { kind: 'mconfirm' });
  };

  const onPromoKind = (id: string) => {
    if (id !== 'percentage' && id !== 'fixed') return;
    promo.current.kind = id;
    clearWidgets();
    echo(t(`assistant.mkt.promo.kind.${id}`));
    say(t(`assistant.mkt.promo.value.${id}`), { kind: 'mfield', field: 'promoValue' });
  };

  const skipUses = () => {
    promo.current.maxUses = undefined;
    clearWidgets();
    echo(t('assistant.flow.skip'));
    say(t('assistant.mkt.promo.confirm'), { kind: 'mconfirm' });
  };

  const createPromo = () =>
    act(async () => {
      const d = promo.current;
      await promoCodesApi.create({
        code: d.code,
        type: 'reusable',
        discountType: d.kind,
        discountValue: d.value,
        maxUses: d.maxUses,
        isActive: true,
      });
      invalidate();
      clearWidgets();
      echo(t('assistant.mkt.promo.create'));
      say(t('assistant.mkt.promo.done', { code: d.code }));
      askNext();
    });

  const onYesNo = (id: 'pixels' | 'catSeo' | 'promo' | 'another', yes: boolean) => {
    if (!yes) return skip();
    clearWidgets();
    echo(t('assistant.flow.yes'));
    if (id === 'pixels') return askPixel();
    if (id === 'catSeo') return void generateCategorySeo();
    if (id === 'promo') {
      return say(t('assistant.mkt.promo.code'), { kind: 'mfield', field: 'promoCode' });
    }
    askNext();
  };

  const renderWidget = (w: MarketingWidget): ReactNode => {
    switch (w.kind) {
      case 'myesno':
        return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
      case 'mseo': {
        const seo = seoForStore(lang, storeName() || homePage.current?.title || '', settings.current?.tagline);
        return (
          <SummaryWidget
            busy={busy}
            confirmLabel={t('assistant.mkt.homeSeo.apply')}
            cancelLabel={t('assistant.flow.skip')}
            onConfirm={() => void applyHomeSeo()}
            onCancel={skip}
            rows={[
              { label: t('assistant.mkt.homeSeo.title'), value: seo.title },
              { label: t('assistant.mkt.homeSeo.description'), value: seo.description },
            ]}
          />
        );
      }
      case 'mkind':
        return (
          <ChipsWidget
            busy={busy}
            options={(['percentage', 'fixed'] as const).map((k) => ({ id: k, label: t(`assistant.mkt.promo.kind.${k}`) }))}
            onPick={onPromoKind}
          />
        );
      case 'mconfirm': {
        const d = promo.current;
        return (
          <SummaryWidget
            busy={busy}
            confirmLabel={t('assistant.mkt.promo.create')}
            cancelLabel={t('assistant.catalog.product.cancel')}
            onConfirm={() => void createPromo()}
            onCancel={skip}
            rows={[
              { label: t('assistant.mkt.promo.summary.code'), value: d.code },
              { label: t('assistant.mkt.promo.summary.discount'), value: d.kind === 'percentage' ? `${d.value} %` : `${d.value} MAD` },
              { label: t('assistant.mkt.promo.summary.uses'), value: d.maxUses ? String(d.maxUses) : t('assistant.mkt.promo.summary.unlimited') },
            ]}
          />
        );
      }
      case 'mfield': {
        const isPixel = w.field === 'meta' || w.field === 'tiktok' || w.field === 'ga';
        return (
          <FieldWidget
            key={w.field}
            busy={busy}
            inputMode={w.field === 'promoValue' || w.field === 'promoUses' ? 'decimal' : 'text'}
            onSubmit={(value) => (isPixel ? onPixel(w.field as PixelKind, value) : onPromoField(w.field as 'promoCode' | 'promoValue' | 'promoUses', value))}
            onSkip={isPixel ? skipPixel : w.field === 'promoUses' ? skipUses : undefined}
            suggestions={
              w.field === 'promoCode'
                ? [...PROMO_CODE_SUGGESTIONS]
                : w.field === 'promoValue'
                  ? promo.current.kind === 'percentage'
                    ? ['5', '10', '15', '20']
                    : ['20', '50', '100']
                  : w.field === 'promoUses'
                    ? ['50', '100', '500']
                    : undefined
            }
            placeholder={
              w.field === 'meta'
                ? t('assistant.mkt.pixels.placeholder.meta')
                : w.field === 'tiktok'
                  ? t('assistant.mkt.pixels.placeholder.tiktok')
                  : w.field === 'ga'
                    ? t('assistant.mkt.pixels.placeholder.ga')
                    : w.field === 'promoCode'
                      ? t('assistant.mkt.promo.code.placeholder')
                      : t('assistant.mkt.promo.value.placeholder')
            }
          />
        );
      }
    }
  };

  return { start, renderWidget };
}
