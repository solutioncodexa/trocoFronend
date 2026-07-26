import type { CSSProperties } from 'react';
import { hexToHslComponents } from '@/utils/color';
import { setActiveStoreBrand } from '@/lib/activeStoreBrand';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

export type StoreThemeInput = {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
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

  return vars as CSSProperties;
}

/** @deprecated préférer storeThemeStyleVars — ne plus peindre `:root`. */
export function applyStoreTheme(store: StoreThemeInput | null) {
  clearRootStoreTheme();
  if (!store) return;
  // no-op on :root — les couleurs vivent sur le wrapper vitrine
}

export function applyDocumentBrand(store: StoreThemeInput | null) {
  if (!store) {
    setActiveStoreBrand(null);
    return;
  }
  const siteName = store.siteName?.trim() || 'Boutique';
  const tagline = store.tagline?.trim();
  document.title = tagline ? `${siteName} — ${tagline}` : siteName;

  const favicon = store.faviconUrl || store.logoUrl;
  if (favicon) {
    const href = resolvePublicImageUrl(favicon);
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon'][data-store-favicon='1']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.setAttribute('data-store-favicon', '1');
      document.head.appendChild(link);
    }
    link.href = href;
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
