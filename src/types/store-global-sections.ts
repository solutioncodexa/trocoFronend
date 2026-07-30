export type GlobalSectionKey = 'mega_menu' | 'footer_links' | 'sticky_cta' | 'app_bar';

export type AppBarConfig = {
  bgColor: string;
  textColor: string;
  topBarEnabled: boolean;
  topBarText: string;
  topBarBg: string;
  topBarTextColor: string;
  showSearch: boolean;
  showWishlist: boolean;
  showCart: boolean;
  navLabels: string[];
  logoHeight: 'sm' | 'md' | 'lg';
  sticky: boolean;
};

export const DEFAULT_APP_BAR: AppBarConfig = {
  bgColor: '',
  textColor: '',
  topBarEnabled: false,
  topBarText: 'Livraison gratuite dès 500 DH',
  topBarBg: '#0F766E',
  topBarTextColor: '#FFFFFF',
  showSearch: true,
  showWishlist: true,
  showCart: true,
  navLabels: ['Boutique', 'Sur-mesure', 'Contact'],
  logoHeight: 'md',
  sticky: true,
};

export type MegaMenuChildLink = {
  label: string;
  href: string;
};

export type MegaMenuItem = {
  label: string;
  href: string;
  children?: MegaMenuChildLink[];
};

export type MegaMenuConfig = {
  items: MegaMenuItem[];
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinksColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterLinksConfig = {
  columns: FooterLinksColumn[];
};

export type StickyCtaStyle = 'bar' | 'pill' | 'floating';
export type StickyCtaPosition = 'bottom' | 'bottom-right';

export type StickyCtaConfig = {
  text: string;
  ctaLabel: string;
  ctaHref: string;
  dismissible?: boolean;
  style?: StickyCtaStyle;
  position?: StickyCtaPosition;
};

export type StoreGlobalSection = {
  id: number;
  sectionKey: GlobalSectionKey | string;
  enabled: boolean;
  config: Record<string, unknown>;
};

export type UpsertGlobalSectionPayload = {
  sectionKey: GlobalSectionKey | string;
  enabled?: boolean;
  config?: Record<string, unknown>;
};

export function parseMegaMenuConfig(config: Record<string, unknown> | undefined): MegaMenuConfig {
  const raw = config?.items;
  if (!Array.isArray(raw)) return { items: [] };
  const items: MegaMenuItem[] = raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
    .map((item) => {
      const childrenRaw = item.children;
      const children = Array.isArray(childrenRaw)
        ? childrenRaw
            .filter((c): c is Record<string, unknown> => c != null && typeof c === 'object')
            .map((c) => ({
              label: String(c.label ?? ''),
              href: String(c.href ?? ''),
            }))
            .filter((c) => c.label && c.href)
        : undefined;
      return {
        label: String(item.label ?? ''),
        href: String(item.href ?? ''),
        children: children?.length ? children : undefined,
      };
    })
    .filter((i) => i.label && i.href);
  return { items };
}

export function parseFooterLinksConfig(config: Record<string, unknown> | undefined): FooterLinksConfig {
  const raw = config?.columns;
  if (!Array.isArray(raw)) return { columns: [] };
  const columns: FooterLinksColumn[] = raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
    .map((col) => {
      const linksRaw = col.links;
      const links = Array.isArray(linksRaw)
        ? linksRaw
            .filter((l): l is Record<string, unknown> => l != null && typeof l === 'object')
            .map((l) => ({
              label: String(l.label ?? ''),
              href: String(l.href ?? ''),
            }))
            .filter((l) => l.label && l.href)
        : [];
      return {
        title: String(col.title ?? ''),
        links,
      };
    })
    .filter((c) => c.title);
  return { columns };
}

export function parseStickyCtaConfig(config: Record<string, unknown> | undefined): StickyCtaConfig | null {
  if (!config) return null;
  const text = String(config.text ?? '').trim();
  const ctaLabel = String(config.ctaLabel ?? '').trim();
  const ctaHref = String(config.ctaHref ?? '').trim();
  if (!text || !ctaLabel || !ctaHref) return null;
  const styleRaw = String(config.style ?? 'bar');
  const style = (['bar', 'pill', 'floating'].includes(styleRaw)
    ? styleRaw
    : 'bar') as StickyCtaStyle;
  const positionRaw = String(config.position ?? 'bottom');
  const position = (['bottom', 'bottom-right'].includes(positionRaw)
    ? positionRaw
    : 'bottom') as StickyCtaPosition;
  return {
    text,
    ctaLabel,
    ctaHref,
    dismissible: config.dismissible !== false,
    style,
    position,
  };
}

export function parseAppBarConfig(config: Record<string, unknown> | undefined): AppBarConfig {
  const base = { ...DEFAULT_APP_BAR };
  if (!config) return base;
  const navRaw = config.navLabels;
  const navLabels = Array.isArray(navRaw)
    ? navRaw.map((x) => String(x ?? '').trim()).filter(Boolean).slice(0, 6)
    : base.navLabels;
  const logo = String(config.logoHeight ?? base.logoHeight);
  return {
    bgColor: String(config.bgColor ?? ''),
    textColor: String(config.textColor ?? ''),
    topBarEnabled: config.topBarEnabled === true,
    topBarText: String(config.topBarText ?? base.topBarText),
    topBarBg: String(config.topBarBg ?? base.topBarBg),
    topBarTextColor: String(config.topBarTextColor ?? base.topBarTextColor),
    showSearch: config.showSearch !== false,
    showWishlist: config.showWishlist !== false,
    showCart: config.showCart !== false,
    navLabels: navLabels.length ? navLabels : base.navLabels,
    logoHeight: (['sm', 'md', 'lg'].includes(logo) ? logo : 'md') as AppBarConfig['logoHeight'],
    sticky: config.sticky !== false,
  };
}
