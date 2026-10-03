/**
 * Marketing et référencement guidés : pixels publicitaires (dans la limite du plan), titres et descriptions pour
 * Google, premier code promo. Logique pure, sans réseau.
 */
export type PixelKind = 'meta' | 'tiktok' | 'ga';

type PixelSettings = {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAnalyticsId?: string | null;
  googleAdsId?: string | null;
};

const blank = (v?: string | null) => !v || !v.trim();

/** Pixel Meta (Facebook / Instagram) : identifiant numérique de 15 ou 16 chiffres. */
export const isMetaPixel = (v: string) => /^\d{15,16}$/.test(v.trim());

/** Pixel TikTok : identifiant alphanumérique en majuscules. */
export const isTikTokPixel = (v: string) => /^[A-Z0-9]{15,30}$/.test(v.trim().toUpperCase());

/** Identifiant Google : GA4 (« G-XXXXXXXXXX ») ou Google Ads (« AW-123456789 »). */
export function parseGoogleId(v: string): { kind: 'analytics' | 'ads'; id: string } | null {
  const id = v.trim().toUpperCase();
  if (/^G-[A-Z0-9]{6,12}$/.test(id)) return { kind: 'analytics', id };
  if (/^AW-\d{6,12}$/.test(id)) return { kind: 'ads', id };
  return null;
}

/**
 * Nombre de pixels comptés pour le plan : Meta, TikTok, et Google (Analytics ou Ads) pour un seul.
 * Même règle que le serveur.
 */
export function pixelSlotsUsed(s: PixelSettings): number {
  return (
    (blank(s.metaPixelId) ? 0 : 1) +
    (blank(s.tiktokPixelId) ? 0 : 1) +
    (blank(s.googleAnalyticsId) && blank(s.googleAdsId) ? 0 : 1)
  );
}

/** `max` absent ou nul : illimité. */
export const pixelSlotAvailable = (used: number, max?: number | null) => max == null || used < max;

/** Pixels qu'il reste à proposer : ceux qui ne sont pas encore renseignés. */
export function missingPixels(s: PixelSettings): PixelKind[] {
  const out: PixelKind[] = [];
  if (blank(s.metaPixelId)) out.push('meta');
  if (blank(s.tiktokPixelId)) out.push('tiktok');
  if (blank(s.googleAnalyticsId) && blank(s.googleAdsId)) out.push('ga');
  return out;
}

export type MarketingStepId = 'pixels' | 'homeSeo' | 'catSeo' | 'promo';

type FlowInput = PixelSettings & {
  maxPixels?: number | null;
  homeNeedsSeo: boolean;
  categoriesNeedingSeo: number;
  promoCount: number;
};

export function buildMarketingFlow(i: FlowInput): MarketingStepId[] {
  const steps: MarketingStepId[] = [];
  if (missingPixels(i).length > 0 && pixelSlotAvailable(pixelSlotsUsed(i), i.maxPixels)) steps.push('pixels');
  if (i.homeNeedsSeo) steps.push('homeSeo');
  if (i.categoriesNeedingSeo > 0) steps.push('catSeo');
  if (i.promoCount === 0) steps.push('promo');
  return steps;
}

/** Une catégorie active sans titre ou sans description pour Google. */
export const needsSeo = (c: { seoTitle?: string | null; seoDescription?: string | null; active?: boolean }) =>
  c.active !== false && (blank(c.seoTitle) || blank(c.seoDescription));

/** Limites de longueur recommandées pour les résultats Google. */
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 155;

// ───────────── Code promo ─────────────

export const PROMO_CODE_SUGGESTIONS = ['BIENVENUE10', 'PREMIERE', 'MERCI'] as const;

export const normalizePromoCode = (v: string) => v.trim().toUpperCase().replace(/\s+/g, '');
export const validPromoCode = (v: string) => /^[A-Z0-9_-]{3,20}$/.test(normalizePromoCode(v));

/** Pourcentage de réduction : entier de 1 à 90. */
export function parsePercent(v: string): number | null {
  const t = v.trim().replace('%', '');
  if (!/^\d{1,2}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= 90 ? n : null;
}

/** Nombre d'utilisations maximum : entier de 1 à 1 000 000. */
export function parseUses(v: string): number | null {
  const t = v.trim();
  if (!/^\d{1,7}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= 1_000_000 ? n : null;
}

// ───────────── Textes pour Google (titre / description) ─────────────

type SeoLang = 'fr' | 'en' | 'ar';

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`);

/** Titre (60 car.) et description (155 car.) proposés pour la page d'accueil, dans la langue de l'interface. */
export function seoForStore(lang: SeoLang, siteName: string, tagline?: string | null) {
  const name = siteName.trim();
  const tag = (tagline ?? '').trim();
  const sentence = {
    fr: `Découvrez ${name}${tag ? ` : ${tag}` : ''}. Commandez en ligne, livraison partout au Maroc.`,
    en: `Discover ${name}${tag ? `: ${tag}` : ''}. Order online, delivery across Morocco.`,
    ar: `اكتشف ${name}${tag ? `: ${tag}` : ''}. اطلب عبر الإنترنت مع التوصيل إلى كل أنحاء المغرب.`,
  }[lang];
  return {
    title: clip(tag ? `${name} — ${tag}` : name, SEO_TITLE_MAX),
    description: clip(sentence, SEO_DESCRIPTION_MAX),
  };
}

/** Titre et description proposés pour une catégorie. */
export function seoForCategory(lang: SeoLang, category: string, store: string) {
  const cat = category.trim();
  const shop = store.trim();
  const sentence = {
    fr: `Découvrez notre sélection ${cat} chez ${shop}. Livraison partout au Maroc.`,
    en: `Discover our ${cat} selection at ${shop}. Delivery across Morocco.`,
    ar: `اكتشف تشكيلتنا من ${cat} لدى ${shop}. التوصيل إلى كل أنحاء المغرب.`,
  }[lang];
  return { title: clip(`${cat} | ${shop}`, SEO_TITLE_MAX), description: clip(sentence, SEO_DESCRIPTION_MAX) };
}
