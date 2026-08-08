import type { CSSProperties } from 'react';
import { hexToHslComponents } from '@/utils/color';
import { setActiveStoreBrand } from '@/lib/activeStoreBrand';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import { fontPairVars, normalizeFontPair, normalizeRadiusPreset, radiusPresetVars } from '@/config/storefrontTheme';

export type StoreThemeInput = {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontPair?: string | null;
  radiusPreset?: string | null;
};

const ROOT_THEME_VARS = [
  '--store-primary',
  '--store-secondary',
  '--store-primary-soft',
  '--store-secondary-soft',
  '--primary',
  '--ring',
  '--gold',
  '--gold-light',
  '--gold-dark',
  '--sidebar-primary',
  '--sidebar-ring',
  '--gradient-gold',
  '--gradient-hero',
  '--shadow-gold',
  '--sky',
  '--sky-light',
  '--sky-dark',
  '--accent',
  '--accent-foreground',
] as const;

/** Ajuste L d’une composante `H S% L%`. */
function adjustLightness(hsl: string, delta: number): string {
  const m = hsl.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/);
  if (!m) return hsl;
  const h = m[1];
  const s = m[2];
  const l = Math.max(0, Math.min(100, Number(m[3]) + delta));
  return `${h} ${s}% ${l}%`;
}

/**
 * Efface toute fuite de couleurs boutique sur `:root`
 * (admin / landing Matjarona / autres tenants).
 */
export function clearRootStoreTheme() {
  const root = document.documentElement.style;
  for (const name of ROOT_THEME_VARS) {
    root.removeProperty(name);
  }
}

/**
 * Variables CSS scopées (héritées par les enfants).
 * À poser sur un wrapper vitrine — jamais sur documentElement.
 */
export function storeThemeStyleVars(store: StoreThemeInput | null | undefined): CSSProperties {
  if (!store) return {};

  const vars: Record<string, string> = {};
  const primaryHsl = store.primaryColor ? hexToHslComponents(store.primaryColor) : null;
  const secondaryHsl = store.secondaryColor ? hexToHslComponents(store.secondaryColor) : null;

  if (store.primaryColor) vars['--store-primary'] = store.primaryColor;
  if (primaryHsl) {
    const light = adjustLightness(primaryHsl, 14);
    const dark = adjustLightness(primaryHsl, -12);
    const soft = adjustLightness(primaryHsl, 28);
    vars['--primary'] = primaryHsl;
    vars['--ring'] = primaryHsl;
    vars['--gold'] = primaryHsl;
    vars['--gold-light'] = light;
    vars['--gold-dark'] = dark;
    vars['--sidebar-primary'] = primaryHsl;
    vars['--sidebar-ring'] = primaryHsl;
    vars['--store-primary-soft'] = soft;
    vars['--gradient-gold'] =
      `linear-gradient(135deg, hsl(${dark}) 0%, hsl(${primaryHsl}) 45%, hsl(${light}) 100%)`;
    vars['--gradient-hero'] =
      `linear-gradient(135deg, hsl(${dark}) 0%, hsl(${primaryHsl}) 42%, hsl(${secondaryHsl || light}) 100%)`;
    vars['--shadow-gold'] = `0 8px 24px -6px hsl(${primaryHsl} / 0.28)`;
  }

  if (store.secondaryColor) vars['--store-secondary'] = store.secondaryColor;
  if (secondaryHsl) {
    const skyLight = adjustLightness(secondaryHsl, 40);
    const skyDark = adjustLightness(secondaryHsl, -8);
    vars['--sky'] = secondaryHsl;
    vars['--sky-light'] = skyLight;
    vars['--sky-dark'] = skyDark;
    vars['--accent'] = skyLight;
    vars['--accent-foreground'] = skyDark;
    vars['--store-secondary-soft'] = adjustLightness(secondaryHsl, 45);
  }

  const fontVars = fontPairVars(normalizeFontPair(store.fontPair));
  const radiusVars = radiusPresetVars(normalizeRadiusPreset(store.radiusPreset));
  Object.assign(vars, fontVars, radiusVars);

  return vars as CSSProperties;
}

/** @deprecated préférer storeThemeStyleVars — ne plus peindre `:root`. */
export function applyStoreTheme(store: StoreThemeInput | null) {
  clearRootStoreTheme();
  if (!store) return;
  // no-op on :root — les couleurs vivent sur le wrapper vitrine
}

const STORE_FAVICON_ATTR = 'data-store-favicon';
const DISABLED_ICON_ATTR = 'data-icon-disabled-by-store';

function defaultIconLinks(): NodeListOf<HTMLLinkElement> {
  return document.querySelectorAll<HTMLLinkElement>(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']",
  );
}

/** Les favicons Matjarona/Troco dans index.html passent avant un link ajouté en fin de head. */
function disableDefaultFavicons() {
  defaultIconLinks().forEach((el) => {
    if (el.getAttribute(STORE_FAVICON_ATTR) === '1') return;
    if (el.hasAttribute(DISABLED_ICON_ATTR)) return;
    el.setAttribute(DISABLED_ICON_ATTR, '1');
    el.setAttribute('data-prev-href', el.getAttribute('href') || '');
    el.removeAttribute('href');
  });
}

function restoreDefaultFavicons() {
  document
    .querySelectorAll<HTMLLinkElement>(`link[${DISABLED_ICON_ATTR}]`)
    .forEach((el) => {
      const prev = el.getAttribute('data-prev-href');
      if (prev) el.setAttribute('href', prev);
      el.removeAttribute('data-prev-href');
      el.removeAttribute(DISABLED_ICON_ATTR);
    });
  document
    .querySelectorAll(`link[${STORE_FAVICON_ATTR}='1']`)
    .forEach((el) => el.remove());
}

function faviconMime(url: string): string | null {
  if (/\.svg(\?|#|$)/i.test(url)) return 'image/svg+xml';
  if (/\.ico(\?|#|$)/i.test(url)) return 'image/x-icon';
  if (/\.png(\?|#|$)/i.test(url)) return 'image/png';
  if (/\.jpe?g(\?|#|$)/i.test(url)) return 'image/jpeg';
  if (/\.webp(\?|#|$)/i.test(url)) return 'image/webp';
  if (/\.gif(\?|#|$)/i.test(url)) return 'image/gif';
  return null;
}

function applyStoreFavicon(rawUrl: string) {
  const resolved = resolvePublicImageUrl(rawUrl);
  if (!resolved) return;
  disableDefaultFavicons();
  const bust = `_sf=${Date.now()}`;
  const href = resolved.includes('?') ? `${resolved}&${bust}` : `${resolved}?${bust}`;
  const mime = faviconMime(resolved);

  const ensureLink = (rel: string, sizes?: string) => {
    let link: HTMLLinkElement | null = null;
    document.querySelectorAll<HTMLLinkElement>(`link[${STORE_FAVICON_ATTR}='1']`).forEach((el) => {
      if (el.rel === rel && (sizes ? el.getAttribute('sizes') === sizes : !el.getAttribute('sizes'))) {
        link = el;
      }
    });
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (sizes) link.setAttribute('sizes', sizes);
      link.setAttribute(STORE_FAVICON_ATTR, '1');
      document.head.prepend(link);
    }
    if (mime) link.type = mime;
    else link.removeAttribute('type');
    link.href = href;
  };

  ensureLink('icon');
  ensureLink('shortcut icon');
  ensureLink('apple-touch-icon');
}

export function applyDocumentBrand(store: StoreThemeInput | null) {
  if (!store) {
    setActiveStoreBrand(null);
    restoreDefaultFavicons();
    return;
  }
  const siteName = store.siteName?.trim() || 'Boutique';
  const tagline = store.tagline?.trim();
  document.title = tagline ? `${siteName} — ${tagline}` : siteName;

  const favicon = store.faviconUrl?.trim() || store.logoUrl?.trim();
  if (favicon) {
    applyStoreFavicon(favicon);
  } else {
    restoreDefaultFavicons();
  }

  setActiveStoreBrand({
    siteName,
    tagline,
    logoUrl: store.logoUrl ? resolvePublicImageUrl(store.logoUrl) : null,
  });
}

export function applyStoreBranding(store: StoreThemeInput | null) {
  clearRootStoreTheme();
  applyDocumentBrand(store);
}
