export type ButtonStyleKey = 'solid' | 'outline' | 'soft' | 'pill';
export type CardStyleKey = 'elevated' | 'bordered' | 'flat' | 'minimal';
export type HeroStyleKey = 'fullbleed' | 'split' | 'minimal' | 'banner';
export type FooterLayoutKey = 'default' | 'compact' | 'links_only';

export type StoreAppearance = {
  buttonStyle: ButtonStyleKey;
  cardStyle: CardStyleKey;
  heroStyle: HeroStyleKey;
  heroCtaLabel: string;
  heroShowBenefits: boolean;
  headerBgColor: string;
  headerTextColor: string;
  headerShowLogo: boolean;
  headerShowNav: boolean;
  headerShowSearch: boolean;
  headerShowWishlist: boolean;
  headerShowCart: boolean;
  headerPromoEnabled: boolean;
  headerPromoText: string;
  /** Fond du bandeau promo fixe (vide = dégradé thème). */
  headerPromoBgColor: string;
  /** Texte du bandeau promo fixe (vide = texte thème). */
  headerPromoTextColor: string;
  headerLabelHome: string;
  headerLabelShop: string;
  headerLabelSurMesure: string;
  headerLabelDevis: string;
  headerLabelContact: string;
  /** Lien custom (vide = chemin système). Chemin `/…` ou URL http(s). */
  headerHrefHome: string;
  headerHrefShop: string;
  headerHrefSurMesure: string;
  headerHrefDevis: string;
  headerHrefContact: string;
  /** Afficher / masquer chaque bouton de navigation. */
  headerShowHome: boolean;
  headerShowShop: boolean;
  headerShowSurMesure: boolean;
  headerShowDevis: boolean;
  headerShowContact: boolean;
  pageBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerShowBrand: boolean;
  footerShowNewsletter: boolean;
  footerShowSocials: boolean;
  footerLayout: FooterLayoutKey;
};

export const DEFAULT_APPEARANCE: StoreAppearance = {
  buttonStyle: 'solid',
  cardStyle: 'elevated',
  heroStyle: 'fullbleed',
  heroCtaLabel: 'Voir la boutique',
  heroShowBenefits: true,
  headerBgColor: '',
  headerTextColor: '',
  headerShowLogo: true,
  headerShowNav: true,
  headerShowSearch: true,
  headerShowWishlist: true,
  headerShowCart: true,
  headerPromoEnabled: false,
  headerPromoText: 'Livraison gratuite dès 500 DH',
  headerPromoBgColor: '',
  headerPromoTextColor: '',
  headerLabelHome: 'Accueil',
  headerLabelShop: 'Boutique',
  headerLabelSurMesure: 'Sur-mesure',
  headerLabelDevis: 'Devis',
  headerLabelContact: 'Contact',
  headerHrefHome: '',
  headerHrefShop: '',
  headerHrefSurMesure: '',
  headerHrefDevis: '',
  headerHrefContact: '',
  headerShowHome: true,
  headerShowShop: true,
  headerShowSurMesure: true,
  headerShowDevis: true,
  headerShowContact: true,
  pageBgColor: '',
  footerBgColor: '',
  footerTextColor: '',
  footerShowBrand: true,
  footerShowNewsletter: false,
  footerShowSocials: true,
  footerLayout: 'default',
};

export const BUTTON_STYLES: { key: ButtonStyleKey; label: string; description: string }[] = [
  { key: 'solid', label: 'Plein', description: 'Fond primaire, fort contraste.' },
  { key: 'outline', label: 'Contour', description: 'Bordure, fond transparent.' },
  { key: 'soft', label: 'Doux', description: 'Fond teinté léger.' },
  { key: 'pill', label: 'Pilule', description: 'Plein, très arrondi.' },
];

export const CARD_STYLES: { key: CardStyleKey; label: string; description: string }[] = [
  { key: 'elevated', label: 'Relief', description: 'Ombre douce, carte classique.' },
  { key: 'bordered', label: 'Bordure', description: 'Contour net, sans ombre.' },
  { key: 'flat', label: 'Plat', description: 'Fond discret, minimaliste.' },
  { key: 'minimal', label: 'Minimal', description: 'Presque sans chrome.' },
];

export const HERO_STYLES: { key: HeroStyleKey; label: string; description: string }[] = [
  { key: 'fullbleed', label: 'Plein écran', description: 'Image dominante edge-to-edge.' },
  { key: 'split', label: 'Split', description: 'Texte + image côte à côte.' },
  { key: 'minimal', label: 'Minimal', description: 'Titre centré, peu d’ornement.' },
  { key: 'banner', label: 'Bannière', description: 'Bandeau compact sous le header.' },
];

export const FOOTER_LAYOUTS: { key: FooterLayoutKey; label: string; description: string }[] = [
  { key: 'default', label: 'Complet', description: 'Brand + colonnes + bas de page.' },
  { key: 'compact', label: 'Compact', description: 'Moins d’espace, grille serrée.' },
  { key: 'links_only', label: 'Liens seuls', description: 'Colonnes de liens, brand réduit.' },
];

function asBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (v == null) return fallback;
  return Boolean(v);
}

function asEnum<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  const s = String(v ?? '').trim().toLowerCase();
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

function asHexColor(v: unknown, fallback = ''): string {
  const s = String(v ?? '').trim();
  if (!s) return fallback;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s)) return s;
  return fallback;
}

function asLabel(v: unknown, fallback: string, max = 40): string {
  const s = String(v ?? '').trim();
  if (!s) return fallback;
  return s.slice(0, max);
}

/** Lien nav header : vide = défaut système ; sinon chemin ou URL absolue. */
export function normalizeNavHref(raw: unknown, max = 300): string {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  if (/^(javascript|data|vbscript):/i.test(s)) return '';
  if (/^https?:\/\//i.test(s)) return s.slice(0, max);
  const path = s.startsWith('/') ? s : `/${s}`;
  return path.slice(0, max);
}

export const HEADER_NAV_ITEMS = [
  {
    labelKey: 'headerLabelHome',
    hrefKey: 'headerHrefHome',
    enabledKey: 'headerShowHome',
    title: 'Accueil',
    defaultPath: '/',
  },
  {
    labelKey: 'headerLabelShop',
    hrefKey: 'headerHrefShop',
    enabledKey: 'headerShowShop',
    title: 'Boutique',
    defaultPath: '/boutique',
  },
  {
    labelKey: 'headerLabelSurMesure',
    hrefKey: 'headerHrefSurMesure',
    enabledKey: 'headerShowSurMesure',
    title: 'Sur-mesure',
    defaultPath: '/sur-mesure',
  },
  {
    labelKey: 'headerLabelDevis',
    hrefKey: 'headerHrefDevis',
    enabledKey: 'headerShowDevis',
    title: 'Devis',
    defaultPath: '/devis',
  },
  {
    labelKey: 'headerLabelContact',
    hrefKey: 'headerHrefContact',
    enabledKey: 'headerShowContact',
    title: 'Contact',
    defaultPath: '/contact',
  },
] as const;

export type HeaderNavLabelKey = (typeof HEADER_NAV_ITEMS)[number]['labelKey'];
export type HeaderNavHrefKey = (typeof HEADER_NAV_ITEMS)[number]['hrefKey'];
export type HeaderNavEnabledKey = (typeof HEADER_NAV_ITEMS)[number]['enabledKey'];

export function normalizeAppearance(raw?: Partial<StoreAppearance> | Record<string, unknown> | null): StoreAppearance {
  const src = (raw ?? {}) as Record<string, unknown>;
  const cta = String(src.heroCtaLabel ?? DEFAULT_APPEARANCE.heroCtaLabel).trim();
  const promo = String(src.headerPromoText ?? DEFAULT_APPEARANCE.headerPromoText).trim();
  return {
    buttonStyle: asEnum(src.buttonStyle, ['solid', 'outline', 'soft', 'pill'] as const, 'solid'),
    cardStyle: asEnum(src.cardStyle, ['elevated', 'bordered', 'flat', 'minimal'] as const, 'elevated'),
    heroStyle: asEnum(src.heroStyle, ['fullbleed', 'split', 'minimal', 'banner'] as const, 'fullbleed'),
    heroCtaLabel: (cta || DEFAULT_APPEARANCE.heroCtaLabel).slice(0, 80),
    heroShowBenefits: asBool(src.heroShowBenefits, true),
    headerBgColor: asHexColor(src.headerBgColor, ''),
    headerTextColor: asHexColor(src.headerTextColor, ''),
    headerShowLogo: asBool(src.headerShowLogo, true),
    headerShowNav: asBool(src.headerShowNav, true),
    headerShowSearch: asBool(src.headerShowSearch, true),
    headerShowWishlist: asBool(src.headerShowWishlist, true),
    headerShowCart: asBool(src.headerShowCart, true),
    headerPromoEnabled: asBool(src.headerPromoEnabled, false),
    headerPromoText: (promo || DEFAULT_APPEARANCE.headerPromoText).slice(0, 160),
    headerPromoBgColor: asHexColor(src.headerPromoBgColor, ''),
    headerPromoTextColor: asHexColor(src.headerPromoTextColor, ''),
    headerLabelHome: asLabel(src.headerLabelHome, DEFAULT_APPEARANCE.headerLabelHome),
    headerLabelShop: asLabel(src.headerLabelShop, DEFAULT_APPEARANCE.headerLabelShop),
    headerLabelSurMesure: asLabel(src.headerLabelSurMesure, DEFAULT_APPEARANCE.headerLabelSurMesure),
    headerLabelDevis: asLabel(src.headerLabelDevis, DEFAULT_APPEARANCE.headerLabelDevis),
    headerLabelContact: asLabel(src.headerLabelContact, DEFAULT_APPEARANCE.headerLabelContact),
    headerHrefHome: normalizeNavHref(src.headerHrefHome),
    headerHrefShop: normalizeNavHref(src.headerHrefShop),
    headerHrefSurMesure: normalizeNavHref(src.headerHrefSurMesure),
    headerHrefDevis: normalizeNavHref(src.headerHrefDevis),
    headerHrefContact: normalizeNavHref(src.headerHrefContact),
    headerShowHome: asBool(src.headerShowHome, true),
    headerShowShop: asBool(src.headerShowShop, true),
    headerShowSurMesure: asBool(src.headerShowSurMesure, true),
    headerShowDevis: asBool(src.headerShowDevis, true),
    headerShowContact: asBool(src.headerShowContact, true),
    pageBgColor: asHexColor(src.pageBgColor, ''),
    footerBgColor: asHexColor(src.footerBgColor, ''),
    footerTextColor: asHexColor(src.footerTextColor, ''),
    footerShowBrand: asBool(src.footerShowBrand, true),
    footerShowNewsletter: asBool(src.footerShowNewsletter, false),
    footerShowSocials: asBool(src.footerShowSocials, true),
    footerLayout: asEnum(src.footerLayout, ['default', 'compact', 'links_only'] as const, 'default'),
  };
}

/** Classes Tailwind pour aperçu / CTA vitrine. */
export function appearanceButtonClass(style: ButtonStyleKey, extra?: string): string {
  const base =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition sf-btn';
  const map: Record<ButtonStyleKey, string> = {
    solid: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
    outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5',
    soft: 'bg-primary/15 text-primary hover:bg-primary/25',
    pill: 'bg-primary text-primary-foreground shadow-soft rounded-full hover:bg-primary/90',
  };
  return [base, map[style], extra].filter(Boolean).join(' ');
}

export function appearanceCardClass(style: CardStyleKey, extra?: string): string {
  const map: Record<CardStyleKey, string> = {
    elevated: 'border border-border/70 bg-card shadow-soft',
    bordered: 'border-2 border-border bg-card shadow-none',
    flat: 'border-0 bg-muted/40 shadow-none',
    minimal: 'border-0 bg-transparent shadow-none p-0',
  };
  return ['sf-card', map[style], extra].filter(Boolean).join(' ');
}
