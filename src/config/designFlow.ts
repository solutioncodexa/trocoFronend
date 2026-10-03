import { DEFAULT_APPEARANCE, normalizeAppearance, type HeaderLayoutKey } from '@/config/storeAppearance';
import { isThemeAllowed } from '@/config/planGates';
import {
  STORE_THEMES,
  THEME_LOOK_DEFAULTS,
  normalizeThemeKey,
  themeAppearanceDefaults,
  type StoreThemeKey,
} from '@/config/storeThemes';
import {
  MENTIONS_PAGE_SLUG,
  PRIVACY_PAGE_SLUG,
  RETURNS_PAGE_SLUG,
  TERMS_PAGE_SLUG,
} from '@/config/legalPages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';

/**
 * Personnalisation guidée (thème, en-tête, pages, réseaux sociaux) : logique pure, sans réseau.
 * Les enregistrements réels passent par l'API existante ; le plan de la boutique est respecté.
 */
export type DesignStepId =
  | 'theme'
  | 'layout'
  | 'search'
  | 'promo'
  | 'home'
  | 'about'
  | 'legal'
  | 'instagram'
  | 'facebook'
  | 'tiktok';

export const ABOUT_PAGE_SLUG = 'a-propos';
export const LEGAL_SLUGS = [MENTIONS_PAGE_SLUG, PRIVACY_PAGE_SLUG, TERMS_PAGE_SLUG, RETURNS_PAGE_SLUG] as const;

type PageLike = { slug?: string | null; isHome?: boolean };
type DesignSettings = Pick<StoreSettingsDTO, 'instagramUrl' | 'facebookUrl' | 'tiktokUrl' | 'appearance'>;

const blank = (v?: string | null) => !v || !v.trim();

/** Étapes à poser : l'apparence est toujours proposée, les pages et liens seulement s'ils manquent. */
export function buildDesignFlow(settings: DesignSettings, pages: PageLike[]): DesignStepId[] {
  const slugs = new Set(pages.map((p) => (p.slug || '').toLowerCase()));
  const appearance = normalizeAppearance(settings.appearance);
  const steps: DesignStepId[] = ['theme', 'layout', 'search'];
  if (!appearance.headerPromoEnabled) steps.push('promo');
  // Une page d'accueil existante n'est jamais écrasée par l'assistant.
  if (!pages.some((p) => p.isHome)) steps.push('home');
  if (!slugs.has(ABOUT_PAGE_SLUG)) steps.push('about');
  if (LEGAL_SLUGS.some((s) => !slugs.has(s))) steps.push('legal');
  if (blank(settings.instagramUrl)) steps.push('instagram');
  if (blank(settings.facebookUrl)) steps.push('facebook');
  if (blank(settings.tiktokUrl)) steps.push('tiktok');
  return steps;
}

export type ThemeOption = { key: StoreThemeKey; locked: boolean; active: boolean; primary: string; secondary: string };

/** Les quatre thèmes ; ceux que le plan n'inclut pas sont marqués verrouillés (Basic : Classique et Minimal). */
export function themeOptions(planCode: string | null | undefined, currentKey?: string | null): ThemeOption[] {
  const current = normalizeThemeKey(currentKey);
  return STORE_THEMES.map((t) => ({
    key: t.key,
    locked: !isThemeAllowed(planCode, t.key),
    active: t.key === current,
    primary: t.demoPrimary,
    secondary: t.demoSecondary,
  }));
}

/**
 * Charge utile d'application d'un thème, identique à celle de la page Réglages : un thème déjà utilisé
 * est restauré tel quel, un nouveau thème reçoit ses couleurs, polices et apparence par défaut.
 */
export function buildThemePayload(themeKey: StoreThemeKey, hadPreset: boolean): UpdateStoreSettingsRequest {
  if (hadPreset) return { themeKey };
  const look = THEME_LOOK_DEFAULTS[themeKey];
  return {
    themeKey,
    primaryColor: look.primaryColor,
    secondaryColor: look.secondaryColor,
    fontPair: look.fontPair,
    radiusPreset: look.radiusPreset,
    appearance: normalizeAppearance({ ...DEFAULT_APPEARANCE, ...themeAppearanceDefaults(themeKey) }),
  };
}

/** Fusionne un changement d'en-tête dans l'apparence actuelle, sans rien perdre du reste. */
export function patchAppearance(
  current: StoreSettingsDTO['appearance'],
  patch: Partial<{
    headerLayout: HeaderLayoutKey;
    headerShowSearch: boolean;
    headerPromoEnabled: boolean;
    headerPromoText: string;
  }>,
) {
  return normalizeAppearance({ ...normalizeAppearance(current), ...patch });
}

export const HEADER_LAYOUTS: readonly HeaderLayoutKey[] = ['inline', 'centered', 'stacked'];

export type SocialKind = 'instagram' | 'facebook' | 'tiktok';

const SOCIAL_HOSTS: Record<SocialKind, RegExp> = {
  instagram: /^(www\.)?instagram\.com$/i,
  facebook: /^((www|m|web)\.)?(facebook\.com|fb\.com)$/i,
  tiktok: /^((www|m)\.)?tiktok\.com$/i,
};

/** Lien de réseau social : https obligatoire (ajouté si absent), domaine du bon réseau, 512 caractères max. */
export function normalizeSocialUrl(kind: SocialKind, raw: string): string | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!SOCIAL_HOSTS[kind].test(url.hostname)) return null;
    const out = `https://${url.hostname}${url.pathname}${url.search}`.replace(/\/$/, '');
    return out.length <= 512 ? out : null;
  } catch {
    return null;
  }
}

/** Pas d'espace ni de balise dans un message d'annonce ; 100 caractères max. */
export const validPromoText = (v: string) => {
  const t = v.trim();
  return t.length >= 3 && t.length <= 100 && !/[<>]/.test(t);
};
