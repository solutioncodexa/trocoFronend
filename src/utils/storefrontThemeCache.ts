import type { TenantStoreDTO } from '@/types/api';

const CACHE_PREFIX = 'troco:storefront-theme:v1:';

/** Champs nécessaires pour peindre la vitrine sans FOUC (avant /platform/store). */
export type StorefrontThemeCache = Pick<
  TenantStoreDTO,
  | 'fournisseurId'
  | 'slug'
  | 'siteName'
  | 'tagline'
  | 'aboutText'
  | 'logoUrl'
  | 'faviconUrl'
  | 'primaryColor'
  | 'secondaryColor'
  | 'themeKey'
  | 'fontPair'
  | 'radiusPreset'
  | 'appearance'
  | 'heroEnabled'
  | 'categoriesEnabled'
  | 'surMesureEnabled'
  | 'contactEmail'
  | 'contactPhone'
  | 'contactWhatsapp'
  | 'contactCity'
  | 'facebookUrl'
  | 'instagramUrl'
  | 'tiktokUrl'
  | 'metaPixelId'
  | 'tiktokPixelId'
  | 'googleAdsId'
  | 'googleAnalyticsId'
  | 'cookieConsentRequired'
  | 'privacyPolicyUrl'
  | 'defaultLocale'
  | 'supportedLocales'
  | 'currency'
  | 'whatsappOrderTemplate'
  | 'freeShippingThreshold'
>;

function cacheKey(slug: string): string {
  return `${CACHE_PREFIX}${slug.trim().toLowerCase()}`;
}

export function readStorefrontThemeCache(slug: string | null | undefined): TenantStoreDTO | null {
  if (!slug || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorefrontThemeCache;
    if (!parsed || typeof parsed !== 'object' || !parsed.slug) return null;
    return {
      ...parsed,
      fournisseurId: Number(parsed.fournisseurId) || 0,
      siteName: parsed.siteName || parsed.slug,
      heroEnabled: parsed.heroEnabled !== false,
      categoriesEnabled: parsed.categoriesEnabled !== false,
      surMesureEnabled: parsed.surMesureEnabled !== false,
    };
  } catch {
    return null;
  }
}

export function writeStorefrontThemeCache(slug: string, store: TenantStoreDTO): void {
  if (!slug || typeof window === 'undefined') return;
  try {
    const payload: StorefrontThemeCache = {
      fournisseurId: store.fournisseurId,
      slug: store.slug || slug,
      siteName: store.siteName,
      tagline: store.tagline,
      aboutText: store.aboutText,
      logoUrl: store.logoUrl,
      faviconUrl: store.faviconUrl,
      primaryColor: store.primaryColor,
      secondaryColor: store.secondaryColor,
      themeKey: store.themeKey,
      fontPair: store.fontPair,
      radiusPreset: store.radiusPreset,
      appearance: store.appearance,
      heroEnabled: store.heroEnabled,
      categoriesEnabled: store.categoriesEnabled,
      surMesureEnabled: store.surMesureEnabled,
      contactEmail: store.contactEmail,
      contactPhone: store.contactPhone,
      contactWhatsapp: store.contactWhatsapp,
      contactCity: store.contactCity,
      facebookUrl: store.facebookUrl,
      instagramUrl: store.instagramUrl,
      tiktokUrl: store.tiktokUrl,
      metaPixelId: store.metaPixelId,
      tiktokPixelId: store.tiktokPixelId,
      googleAdsId: store.googleAdsId,
      googleAnalyticsId: store.googleAnalyticsId,
      cookieConsentRequired: store.cookieConsentRequired,
      privacyPolicyUrl: store.privacyPolicyUrl,
      defaultLocale: store.defaultLocale,
      supportedLocales: store.supportedLocales,
      currency: store.currency,
      whatsappOrderTemplate: store.whatsappOrderTemplate,
      freeShippingThreshold: store.freeShippingThreshold,
    };
    window.localStorage.setItem(cacheKey(slug), JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function clearStorefrontThemeCache(slug?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (slug) {
      window.localStorage.removeItem(cacheKey(slug));
      return;
    }
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
