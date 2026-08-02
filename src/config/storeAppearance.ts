export type ButtonStyleKey =
  | 'solid'
  | 'outline'
  | 'soft'
  | 'pill'
  | 'ghost'
  | 'gradient'
  | 'inverse';
export type CardStyleKey =
  | 'elevated'
  | 'bordered'
  | 'flat'
  | 'minimal'
  | 'glass'
  | 'lifted'
  | 'soft';
export type HeroStyleKey =
  | 'fullbleed'
  | 'split'
  | 'minimal'
  | 'banner'
  | 'stacked'
  | 'overlay'
  | 'asymmetric';
export type FooterLayoutKey =
  | 'default'
  | 'compact'
  | 'links_only'
  | 'centered'
  | 'stacked';
export type HeaderLayoutKey = 'inline' | 'centered' | 'stacked';
export type CartDensityKey = 'compact' | 'comfortable' | 'spacious';
export type CartEmptyStyleKey = 'simple' | 'illustrated' | 'branded';
export type CheckoutLayoutKey = 'single' | 'steps';
export type CheckoutCtaEmphasisKey = 'default' | 'bold' | 'soft' | 'pill';
export type CheckoutSummaryPositionKey = 'right' | 'left' | 'bottom';
export type CheckoutDensityKey = 'compact' | 'comfortable' | 'spacious';
export type CheckoutFormStyleKey = 'card' | 'flat' | 'bordered';
export type CheckoutPaymentStyleKey = 'cards' | 'list' | 'compact';
export type CheckoutHeadingAlignKey = 'left' | 'center';
export type ShopFilterLayoutKey = 'sidebar' | 'drawer' | 'top';
export type ShopGridColumnsKey = '2' | '3' | '4';
export type ShopDensityKey = 'compact' | 'comfortable' | 'spacious';
export type ShopEmptyStyleKey = 'simple' | 'illustrated' | 'branded';
export type ShopFilterMobileKey = 'drawer' | 'top' | 'sheet';
export type ProductGalleryMobileKey = 'bottom_thumbs' | 'stacked' | 'swipe';
export type HomeDensityKey = 'compact' | 'comfortable' | 'spacious';
export type ProductGalleryLayoutKey = 'left_thumbs' | 'bottom_thumbs' | 'stacked';
export type ProductInfoPositionKey = 'right' | 'below';
export type CardImageRatioKey = 'square' | 'portrait' | 'landscape';
export type CardInfoAlignKey = 'left' | 'center';
export type CardHoverEffectKey = 'none' | 'lift' | 'zoom';
export type WishlistEmptyStyleKey = 'simple' | 'illustrated' | 'branded';
export type WishlistGridColumnsKey = '2' | '3' | '4';
export type FormsLayoutKey = 'split' | 'centered' | 'stacked';
export type FormsStyleKey = 'card' | 'flat' | 'bordered';

export const BUTTON_STYLE_KEYS = [
  'solid',
  'outline',
  'soft',
  'pill',
  'ghost',
  'gradient',
  'inverse',
] as const satisfies readonly ButtonStyleKey[];

export const CARD_STYLE_KEYS = [
  'elevated',
  'bordered',
  'flat',
  'minimal',
  'glass',
  'lifted',
  'soft',
] as const satisfies readonly CardStyleKey[];

export const HERO_STYLE_KEYS = [
  'fullbleed',
  'split',
  'minimal',
  'banner',
  'stacked',
  'overlay',
  'asymmetric',
] as const satisfies readonly HeroStyleKey[];

export const FOOTER_LAYOUT_KEYS = [
  'default',
  'compact',
  'links_only',
  'centered',
  'stacked',
] as const satisfies readonly FooterLayoutKey[];

export const HEADER_LAYOUT_KEYS = [
  'inline',
  'centered',
  'stacked',
] as const satisfies readonly HeaderLayoutKey[];

export const CART_DENSITY_KEYS = [
  'compact',
  'comfortable',
  'spacious',
] as const satisfies readonly CartDensityKey[];

export const CART_EMPTY_STYLE_KEYS = [
  'simple',
  'illustrated',
  'branded',
] as const satisfies readonly CartEmptyStyleKey[];

export const CHECKOUT_LAYOUT_KEYS = [
  'single',
  'steps',
] as const satisfies readonly CheckoutLayoutKey[];

export const CHECKOUT_CTA_EMPHASIS_KEYS = [
  'default',
  'bold',
  'soft',
  'pill',
] as const satisfies readonly CheckoutCtaEmphasisKey[];

export const CHECKOUT_SUMMARY_POSITION_KEYS = [
  'right',
  'left',
  'bottom',
] as const satisfies readonly CheckoutSummaryPositionKey[];

export const CHECKOUT_DENSITY_KEYS = [
  'compact',
  'comfortable',
  'spacious',
] as const satisfies readonly CheckoutDensityKey[];

export const CHECKOUT_FORM_STYLE_KEYS = [
  'card',
  'flat',
  'bordered',
] as const satisfies readonly CheckoutFormStyleKey[];

export const CHECKOUT_PAYMENT_STYLE_KEYS = [
  'cards',
  'list',
  'compact',
] as const satisfies readonly CheckoutPaymentStyleKey[];

export const CHECKOUT_HEADING_ALIGN_KEYS = [
  'left',
  'center',
] as const satisfies readonly CheckoutHeadingAlignKey[];

export const SHOP_FILTER_LAYOUT_KEYS = [
  'sidebar',
  'drawer',
  'top',
] as const satisfies readonly ShopFilterLayoutKey[];

export const SHOP_GRID_COLUMNS_KEYS = ['2', '3', '4'] as const satisfies readonly ShopGridColumnsKey[];

export const SHOP_DENSITY_KEYS = [
  'compact',
  'comfortable',
  'spacious',
] as const satisfies readonly ShopDensityKey[];

export const SHOP_EMPTY_STYLE_KEYS = [
  'simple',
  'illustrated',
  'branded',
] as const satisfies readonly ShopEmptyStyleKey[];

export const SHOP_FILTER_MOBILE_KEYS = [
  'drawer',
  'top',
  'sheet',
] as const satisfies readonly ShopFilterMobileKey[];

export const PRODUCT_GALLERY_MOBILE_KEYS = [
  'bottom_thumbs',
  'stacked',
  'swipe',
] as const satisfies readonly ProductGalleryMobileKey[];

export const HOME_DENSITY_KEYS = [
  'compact',
  'comfortable',
  'spacious',
] as const satisfies readonly HomeDensityKey[];

export const PRODUCT_GALLERY_LAYOUT_KEYS = [
  'left_thumbs',
  'bottom_thumbs',
  'stacked',
] as const satisfies readonly ProductGalleryLayoutKey[];

export const PRODUCT_INFO_POSITION_KEYS = [
  'right',
  'below',
] as const satisfies readonly ProductInfoPositionKey[];

export const CARD_IMAGE_RATIO_KEYS = [
  'square',
  'portrait',
  'landscape',
] as const satisfies readonly CardImageRatioKey[];

export const CARD_INFO_ALIGN_KEYS = ['left', 'center'] as const satisfies readonly CardInfoAlignKey[];

export const CARD_HOVER_EFFECT_KEYS = [
  'none',
  'lift',
  'zoom',
] as const satisfies readonly CardHoverEffectKey[];

export const WISHLIST_EMPTY_STYLE_KEYS = [
  'simple',
  'illustrated',
  'branded',
] as const satisfies readonly WishlistEmptyStyleKey[];

export const WISHLIST_GRID_COLUMNS_KEYS = [
  '2',
  '3',
  '4',
] as const satisfies readonly WishlistGridColumnsKey[];

export const FORMS_LAYOUT_KEYS = [
  'split',
  'centered',
  'stacked',
] as const satisfies readonly FormsLayoutKey[];

export const FORMS_STYLE_KEYS = [
  'card',
  'flat',
  'bordered',
] as const satisfies readonly FormsStyleKey[];

export type StoreAppearance = {
  buttonStyle: ButtonStyleKey;
  cardStyle: CardStyleKey;
  heroStyle: HeroStyleKey;
  heroCtaLabel: string;
  heroShowBenefits: boolean;
  headerLayout: HeaderLayoutKey;
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
  /** Piste scrollbar (vide = thème). */
  scrollbarTrackColor: string;
  /** Curseur scrollbar (vide = primary thème). */
  scrollbarThumbColor: string;
  footerShowBrand: boolean;
  footerShowNewsletter: boolean;
  footerShowSocials: boolean;
  footerLayout: FooterLayoutKey;
  /** Densité page panier. */
  cartDensity: CartDensityKey;
  /** Style état panier vide. */
  cartEmptyStyle: CartEmptyStyleKey;
  cartShowCrossSell: boolean;
  cartCtaLabel: string;
  /** Checkout une page ou en étapes. */
  checkoutLayout: CheckoutLayoutKey;
  checkoutStickySummary: boolean;
  checkoutCtaEmphasis: CheckoutCtaEmphasisKey;
  checkoutShowTrustBadges: boolean;
  checkoutCtaLabel: string;
  checkoutSummaryPosition: CheckoutSummaryPositionKey;
  checkoutDensity: CheckoutDensityKey;
  checkoutFormStyle: CheckoutFormStyleKey;
  checkoutPaymentStyle: CheckoutPaymentStyleKey;
  checkoutHeadingAlign: CheckoutHeadingAlignKey;
  checkoutShowPromoField: boolean;
  checkoutShowNotes: boolean;
  /** Boutique — disposition filtres. */
  shopFilterLayout: ShopFilterLayoutKey;
  shopGridColumns: ShopGridColumnsKey;
  shopShowSort: boolean;
  shopShowFilters: boolean;
  shopDensity: ShopDensityKey;
  shopEmptyStyle: ShopEmptyStyleKey;
  shopTitle: string;
  shopSubtitle: string;
  shopEmptyTitle: string;
  shopEmptyDescription: string;
  shopEmptyCtaLabel: string;
  shopFilterMobile: ShopFilterMobileKey;
  /** Fiche produit. */
  productGalleryLayout: ProductGalleryLayoutKey;
  productGalleryMobile: ProductGalleryMobileKey;
  productInfoPosition: ProductInfoPositionKey;
  productStickyBuyBox: boolean;
  productShowRelated: boolean;
  productCtaLabel: string;
  productShowTrust: boolean;
  /** Header sticky. */
  headerSticky: boolean;
  /** Densité sections accueil (thèmes classiques). */
  homeDensity: HomeDensityKey;
  /** Cards produit (enrichissement). */
  cardImageRatio: CardImageRatioKey;
  cardShowQuickAdd: boolean;
  cardShowWishlist: boolean;
  cardShowBadges: boolean;
  cardInfoAlign: CardInfoAlignKey;
  cardHoverEffect: CardHoverEffectKey;
  /** Favoris. */
  wishlistEmptyStyle: WishlistEmptyStyleKey;
  wishlistEmptyTitle: string;
  wishlistEmptyCtaLabel: string;
  wishlistGridColumns: WishlistGridColumnsKey;
  /** Formulaires Contact / Sur-mesure / Devis. */
  formsLayout: FormsLayoutKey;
  formsStyle: FormsStyleKey;
  formsShowHero: boolean;
  formsCtaLabel: string;
  formsShowSidebar: boolean;
  /** Page 404. */
  notFoundTitle: string;
  notFoundMessage: string;
  notFoundCtaLabel: string;
  notFoundCtaHref: string;
};

export const DEFAULT_APPEARANCE: StoreAppearance = {
  buttonStyle: 'solid',
  cardStyle: 'elevated',
  heroStyle: 'fullbleed',
  heroCtaLabel: 'Voir la boutique',
  heroShowBenefits: true,
  headerLayout: 'inline',
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
  scrollbarTrackColor: '',
  scrollbarThumbColor: '',
  footerShowBrand: true,
  footerShowNewsletter: false,
  footerShowSocials: true,
  footerLayout: 'default',
  cartDensity: 'comfortable',
  cartEmptyStyle: 'simple',
  cartShowCrossSell: true,
  cartCtaLabel: 'Passer la commande',
  checkoutLayout: 'single',
  checkoutStickySummary: true,
  checkoutCtaEmphasis: 'default',
  checkoutShowTrustBadges: true,
  checkoutCtaLabel: '',
  checkoutSummaryPosition: 'right',
  checkoutDensity: 'comfortable',
  checkoutFormStyle: 'card',
  checkoutPaymentStyle: 'cards',
  checkoutHeadingAlign: 'left',
  checkoutShowPromoField: true,
  checkoutShowNotes: true,
  shopFilterLayout: 'sidebar',
  shopGridColumns: '4',
  shopShowSort: true,
  shopShowFilters: true,
  shopDensity: 'comfortable',
  shopEmptyStyle: 'simple',
  shopTitle: "Solutions d'emballage",
  shopSubtitle: 'Sachets, cartons, protections et consommables pour vos envois e-commerce.',
  shopEmptyTitle: 'Catalogue en préparation',
  shopEmptyDescription: 'Les produits de cette boutique seront bientôt disponibles.',
  shopEmptyCtaLabel: 'Nous contacter',
  shopFilterMobile: 'drawer',
  productGalleryLayout: 'left_thumbs',
  productGalleryMobile: 'bottom_thumbs',
  productInfoPosition: 'right',
  productStickyBuyBox: true,
  productShowRelated: true,
  productCtaLabel: 'Commander',
  productShowTrust: true,
  headerSticky: true,
  homeDensity: 'comfortable',
  cardImageRatio: 'portrait',
  cardShowQuickAdd: true,
  cardShowWishlist: true,
  cardShowBadges: true,
  cardInfoAlign: 'center',
  cardHoverEffect: 'lift',
  wishlistEmptyStyle: 'simple',
  wishlistEmptyTitle: 'Votre liste est vide pour le moment.',
  wishlistEmptyCtaLabel: 'Parcourir la boutique',
  wishlistGridColumns: '4',
  formsLayout: 'split',
  formsStyle: 'card',
  formsShowHero: true,
  formsCtaLabel: '',
  formsShowSidebar: true,
  notFoundTitle: 'Page non trouvée',
  notFoundMessage: "La page que vous recherchez n'existe pas ou a été déplacée.",
  notFoundCtaLabel: "Retour à l'accueil",
  notFoundCtaHref: '/',
};

export const HEADER_LAYOUTS: { key: HeaderLayoutKey; label: string; description: string }[] = [
  { key: 'inline', label: 'Ligne', description: 'Logo + nav + icônes sur une rangée.' },
  { key: 'centered', label: 'Centré', description: 'Logo au centre, nav dessous.' },
  { key: 'stacked', label: 'Empilé', description: 'Logo puis nav pleine largeur.' },
];

export const CART_DENSITIES: { key: CartDensityKey; label: string; description: string }[] = [
  { key: 'compact', label: 'Compact', description: 'Moins d’espace, plus d’articles visibles.' },
  { key: 'comfortable', label: 'Confort', description: 'Équilibre classique.' },
  { key: 'spacious', label: 'Aéré', description: 'Grands espacements, look premium.' },
];

export const CART_EMPTY_STYLES: { key: CartEmptyStyleKey; label: string; description: string }[] = [
  { key: 'simple', label: 'Simple', description: 'Icône + texte + CTA.' },
  { key: 'illustrated', label: 'Illustré', description: 'Zone visuelle + message accueillant.' },
  { key: 'branded', label: 'Marque', description: 'Fond teinté aux couleurs de la boutique.' },
];

export const CHECKOUT_LAYOUTS: { key: CheckoutLayoutKey; label: string; description: string }[] = [
  { key: 'single', label: 'Une page', description: 'Tout le formulaire sur un écran.' },
  { key: 'steps', label: 'Étapes', description: 'Livraison puis paiement.' },
];

export const CHECKOUT_CTA_EMPHASIS: {
  key: CheckoutCtaEmphasisKey;
  label: string;
  description: string;
}[] = [
  { key: 'default', label: 'Standard', description: 'CTA primaire classique.' },
  { key: 'bold', label: 'Fort', description: 'Plus grand, ombre marquée.' },
  { key: 'soft', label: 'Doux', description: 'Teinte légère, moins agressif.' },
  { key: 'pill', label: 'Pilule', description: 'Bouton très arrondi.' },
];

export const CHECKOUT_SUMMARY_POSITIONS: {
  key: CheckoutSummaryPositionKey;
  label: string;
  description: string;
}[] = [
  { key: 'right', label: 'À droite', description: 'Récap à droite du formulaire.' },
  { key: 'left', label: 'À gauche', description: 'Récap avant le formulaire.' },
  { key: 'bottom', label: 'En bas', description: 'Récap sous le formulaire.' },
];

export const CHECKOUT_DENSITIES: {
  key: CheckoutDensityKey;
  label: string;
  description: string;
}[] = [
  { key: 'compact', label: 'Compact', description: 'Moins d’espace, formulaire dense.' },
  { key: 'comfortable', label: 'Confort', description: 'Équilibre classique.' },
  { key: 'spacious', label: 'Aéré', description: 'Grands espacements premium.' },
];

export const CHECKOUT_FORM_STYLES: {
  key: CheckoutFormStyleKey;
  label: string;
  description: string;
}[] = [
  { key: 'card', label: 'Carte', description: 'Fond carte + ombre douce.' },
  { key: 'flat', label: 'Plat', description: 'Sans chrome, fond page.' },
  { key: 'bordered', label: 'Bordure', description: 'Contour net, sans ombre.' },
];

export const CHECKOUT_PAYMENT_STYLES: {
  key: CheckoutPaymentStyleKey;
  label: string;
  description: string;
}[] = [
  { key: 'cards', label: 'Cartes', description: 'Grandes options avec icônes.' },
  { key: 'list', label: 'Liste', description: 'Rangées compactes alignées.' },
  { key: 'compact', label: 'Puces', description: 'Choix en pastilles serrées.' },
];

export const CHECKOUT_HEADING_ALIGNS: {
  key: CheckoutHeadingAlignKey;
  label: string;
  description: string;
}[] = [
  { key: 'left', label: 'Gauche', description: 'Titre aligné à gauche (desktop).' },
  { key: 'center', label: 'Centré', description: 'Titre centré sur toute largeur.' },
];

export const SHOP_FILTER_LAYOUTS: {
  key: ShopFilterLayoutKey;
  label: string;
  description: string;
}[] = [
  { key: 'sidebar', label: 'Sidebar', description: 'Filtres à gauche (desktop).' },
  { key: 'drawer', label: 'Tiroir', description: 'Filtres via bouton / panneau.' },
  { key: 'top', label: 'Haut', description: 'Filtres au-dessus de la grille.' },
];

export const SHOP_GRID_COLUMNS: {
  key: ShopGridColumnsKey;
  label: string;
  description: string;
}[] = [
  { key: '2', label: '2 colonnes', description: 'Grands produits, look éditorial.' },
  { key: '3', label: '3 colonnes', description: 'Équilibre catalogue.' },
  { key: '4', label: '4 colonnes', description: 'Densité maximale.' },
];

export const SHOP_DENSITIES: {
  key: ShopDensityKey;
  label: string;
  description: string;
}[] = [
  { key: 'compact', label: 'Compact', description: 'Grille serrée.' },
  { key: 'comfortable', label: 'Confort', description: 'Espacement classique.' },
  { key: 'spacious', label: 'Aéré', description: 'Look premium aéré.' },
];

export const SHOP_EMPTY_STYLES: {
  key: ShopEmptyStyleKey;
  label: string;
  description: string;
}[] = [
  { key: 'simple', label: 'Simple', description: 'Icône + texte + CTA.' },
  { key: 'illustrated', label: 'Illustré', description: 'Zone visuelle accueillante.' },
  { key: 'branded', label: 'Marque', description: 'Fond teinté boutique.' },
];

export const SHOP_FILTER_MOBILES: {
  key: ShopFilterMobileKey;
  label: string;
  description: string;
}[] = [
  { key: 'drawer', label: 'Tiroir', description: 'Bouton Filtres → panneau latéral.' },
  { key: 'sheet', label: 'Feuille', description: 'Panneau plein écran mobile.' },
  { key: 'top', label: 'Haut', description: 'Filtres déroulés au-dessus.' },
];

export const PRODUCT_GALLERY_MOBILES: {
  key: ProductGalleryMobileKey;
  label: string;
  description: string;
}[] = [
  { key: 'bottom_thumbs', label: 'Miniatures', description: 'Bandeau sous l’image.' },
  { key: 'stacked', label: 'Empilé', description: 'Toutes les images en colonne.' },
  { key: 'swipe', label: 'Swipe', description: 'Image + flèches, sans thumbs.' },
];

export const HOME_DENSITIES: {
  key: HomeDensityKey;
  label: string;
  description: string;
}[] = [
  { key: 'compact', label: 'Compact', description: 'Sections plus serrées.' },
  { key: 'comfortable', label: 'Confort', description: 'Espacement classique.' },
  { key: 'spacious', label: 'Aéré', description: 'Plus d’air entre blocs.' },
];

export const PRODUCT_GALLERY_LAYOUTS: {
  key: ProductGalleryLayoutKey;
  label: string;
  description: string;
}[] = [
  { key: 'left_thumbs', label: 'Miniatures gauche', description: 'Thumbs verticaux + image.' },
  { key: 'bottom_thumbs', label: 'Miniatures bas', description: 'Image puis bandeau thumbs.' },
  { key: 'stacked', label: 'Empilé', description: 'Images en colonne verticale.' },
];

export const PRODUCT_INFO_POSITIONS: {
  key: ProductInfoPositionKey;
  label: string;
  description: string;
}[] = [
  { key: 'right', label: 'À droite', description: 'Infos à côté de la galerie.' },
  { key: 'below', label: 'En dessous', description: 'Infos sous la galerie.' },
];

export const CARD_IMAGE_RATIOS: {
  key: CardImageRatioKey;
  label: string;
  description: string;
}[] = [
  { key: 'square', label: 'Carré', description: '1:1, look catalogue.' },
  { key: 'portrait', label: 'Portrait', description: '4:5, mode / packaging.' },
  { key: 'landscape', label: 'Paysage', description: '4:3, plus large.' },
];

export const CARD_INFO_ALIGNS: {
  key: CardInfoAlignKey;
  label: string;
  description: string;
}[] = [
  { key: 'left', label: 'Gauche', description: 'Texte aligné à gauche.' },
  { key: 'center', label: 'Centré', description: 'Titre et prix centrés.' },
];

export const CARD_HOVER_EFFECTS: {
  key: CardHoverEffectKey;
  label: string;
  description: string;
}[] = [
  { key: 'none', label: 'Aucun', description: 'Pas de mouvement au survol.' },
  { key: 'lift', label: 'Relief', description: 'Carte qui se soulève.' },
  { key: 'zoom', label: 'Zoom', description: 'Image qui zoome.' },
];

export const WISHLIST_EMPTY_STYLES: {
  key: WishlistEmptyStyleKey;
  label: string;
  description: string;
}[] = [
  { key: 'simple', label: 'Simple', description: 'Icône + texte + CTA.' },
  { key: 'illustrated', label: 'Illustré', description: 'Zone visuelle douce.' },
  { key: 'branded', label: 'Marque', description: 'Fond teinté boutique.' },
];

export const WISHLIST_GRID_COLUMNS: {
  key: WishlistGridColumnsKey;
  label: string;
  description: string;
}[] = [
  { key: '2', label: '2 colonnes', description: 'Grands favoris.' },
  { key: '3', label: '3 colonnes', description: 'Équilibre.' },
  { key: '4', label: '4 colonnes', description: 'Densité max.' },
];

export const FORMS_LAYOUTS: {
  key: FormsLayoutKey;
  label: string;
  description: string;
}[] = [
  { key: 'split', label: 'Split', description: 'Formulaire + infos côte à côte.' },
  { key: 'centered', label: 'Centré', description: 'Formulaire seul, centré.' },
  { key: 'stacked', label: 'Empilé', description: 'Infos puis formulaire.' },
];

export const FORMS_STYLES: {
  key: FormsStyleKey;
  label: string;
  description: string;
}[] = [
  { key: 'card', label: 'Carte', description: 'Fond carte + ombre.' },
  { key: 'flat', label: 'Plat', description: 'Sans chrome.' },
  { key: 'bordered', label: 'Bordure', description: 'Contour net.' },
];

export const BUTTON_STYLES: { key: ButtonStyleKey; label: string; description: string }[] = [
  { key: 'solid', label: 'Plein', description: 'Fond primaire, fort contraste.' },
  { key: 'outline', label: 'Contour', description: 'Bordure, fond transparent.' },
  { key: 'soft', label: 'Doux', description: 'Fond teinté léger.' },
  { key: 'pill', label: 'Pilule', description: 'Plein, très arrondi.' },
  { key: 'ghost', label: 'Fantôme', description: 'Texte seul, hover discret.' },
  { key: 'gradient', label: 'Dégradé', description: 'Primaire → secondaire.' },
  { key: 'inverse', label: 'Inverse', description: 'Fond sombre, texte clair.' },
];

export const CARD_STYLES: { key: CardStyleKey; label: string; description: string }[] = [
  { key: 'elevated', label: 'Relief', description: 'Ombre douce, carte classique.' },
  { key: 'bordered', label: 'Bordure', description: 'Contour net, sans ombre.' },
  { key: 'flat', label: 'Plat', description: 'Fond discret, minimaliste.' },
  { key: 'minimal', label: 'Minimal', description: 'Presque sans chrome.' },
  { key: 'glass', label: 'Verre', description: 'Fond translucide flouté.' },
  { key: 'lifted', label: 'Flottant', description: 'Ombre forte, carte mise en avant.' },
  { key: 'soft', label: 'Velours', description: 'Fond teinté doux, sans bordure.' },
];

export const HERO_STYLES: { key: HeroStyleKey; label: string; description: string }[] = [
  { key: 'fullbleed', label: 'Plein écran', description: 'Image dominante edge-to-edge.' },
  { key: 'split', label: 'Split', description: 'Texte + image côte à côte.' },
  { key: 'minimal', label: 'Minimal', description: 'Titre centré, peu d’ornement.' },
  { key: 'banner', label: 'Bannière', description: 'Bandeau compact sous le header.' },
  { key: 'stacked', label: 'Empilé', description: 'Image au-dessus, texte en dessous.' },
  { key: 'overlay', label: 'Overlay', description: 'Texte centré sur l’image.' },
  { key: 'asymmetric', label: 'Asymétrique', description: 'Mise en page magazine décalée.' },
];

export const FOOTER_LAYOUTS: { key: FooterLayoutKey; label: string; description: string }[] = [
  { key: 'default', label: 'Complet', description: 'Brand + colonnes + bas de page.' },
  { key: 'compact', label: 'Compact', description: 'Moins d’espace, grille serrée.' },
  { key: 'links_only', label: 'Liens seuls', description: 'Colonnes de liens, brand réduit.' },
  { key: 'centered', label: 'Centré', description: 'Brand et liens centrés.' },
  { key: 'stacked', label: 'Empilé', description: 'Brand puis liens en colonnes verticales.' },
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
    buttonStyle: asEnum(src.buttonStyle, BUTTON_STYLE_KEYS, 'solid'),
    cardStyle: asEnum(src.cardStyle, CARD_STYLE_KEYS, 'elevated'),
    heroStyle: asEnum(src.heroStyle, HERO_STYLE_KEYS, 'fullbleed'),
    heroCtaLabel: (cta || DEFAULT_APPEARANCE.heroCtaLabel).slice(0, 80),
    heroShowBenefits: asBool(src.heroShowBenefits, true),
    headerLayout: asEnum(src.headerLayout, HEADER_LAYOUT_KEYS, 'inline'),
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
    scrollbarTrackColor: asHexColor(src.scrollbarTrackColor, ''),
    scrollbarThumbColor: asHexColor(src.scrollbarThumbColor, ''),
    footerShowBrand: asBool(src.footerShowBrand, true),
    footerShowNewsletter: asBool(src.footerShowNewsletter, false),
    footerShowSocials: asBool(src.footerShowSocials, true),
    footerLayout: asEnum(src.footerLayout, FOOTER_LAYOUT_KEYS, 'default'),
    cartDensity: asEnum(src.cartDensity, CART_DENSITY_KEYS, 'comfortable'),
    cartEmptyStyle: asEnum(src.cartEmptyStyle, CART_EMPTY_STYLE_KEYS, 'simple'),
    cartShowCrossSell: asBool(src.cartShowCrossSell, true),
    cartCtaLabel: asLabel(src.cartCtaLabel, DEFAULT_APPEARANCE.cartCtaLabel, 80),
    checkoutLayout: asEnum(src.checkoutLayout, CHECKOUT_LAYOUT_KEYS, 'single'),
    checkoutStickySummary: asBool(src.checkoutStickySummary, true),
    checkoutCtaEmphasis: asEnum(src.checkoutCtaEmphasis, CHECKOUT_CTA_EMPHASIS_KEYS, 'default'),
    checkoutShowTrustBadges: asBool(src.checkoutShowTrustBadges, true),
    checkoutCtaLabel: (() => {
      const s = String(src.checkoutCtaLabel ?? '').trim();
      return s.slice(0, 80);
    })(),
    checkoutSummaryPosition: asEnum(
      src.checkoutSummaryPosition,
      CHECKOUT_SUMMARY_POSITION_KEYS,
      'right',
    ),
    checkoutDensity: asEnum(src.checkoutDensity, CHECKOUT_DENSITY_KEYS, 'comfortable'),
    checkoutFormStyle: asEnum(src.checkoutFormStyle, CHECKOUT_FORM_STYLE_KEYS, 'card'),
    checkoutPaymentStyle: asEnum(src.checkoutPaymentStyle, CHECKOUT_PAYMENT_STYLE_KEYS, 'cards'),
    checkoutHeadingAlign: asEnum(src.checkoutHeadingAlign, CHECKOUT_HEADING_ALIGN_KEYS, 'left'),
    checkoutShowPromoField: asBool(src.checkoutShowPromoField, true),
    checkoutShowNotes: asBool(src.checkoutShowNotes, true),
    shopFilterLayout: asEnum(src.shopFilterLayout, SHOP_FILTER_LAYOUT_KEYS, 'sidebar'),
    shopGridColumns: asEnum(src.shopGridColumns, SHOP_GRID_COLUMNS_KEYS, '4'),
    shopShowSort: asBool(src.shopShowSort, true),
    shopShowFilters: asBool(src.shopShowFilters, true),
    shopDensity: asEnum(src.shopDensity, SHOP_DENSITY_KEYS, 'comfortable'),
    shopEmptyStyle: asEnum(src.shopEmptyStyle, SHOP_EMPTY_STYLE_KEYS, 'simple'),
    shopTitle: asLabel(src.shopTitle, DEFAULT_APPEARANCE.shopTitle, 80),
    shopSubtitle: asLabel(src.shopSubtitle, DEFAULT_APPEARANCE.shopSubtitle, 200),
    shopEmptyTitle: asLabel(src.shopEmptyTitle, DEFAULT_APPEARANCE.shopEmptyTitle, 80),
    shopEmptyDescription: asLabel(
      src.shopEmptyDescription,
      DEFAULT_APPEARANCE.shopEmptyDescription,
      200,
    ),
    shopEmptyCtaLabel: asLabel(src.shopEmptyCtaLabel, DEFAULT_APPEARANCE.shopEmptyCtaLabel, 80),
    shopFilterMobile: asEnum(src.shopFilterMobile, SHOP_FILTER_MOBILE_KEYS, 'drawer'),
    productGalleryLayout: asEnum(src.productGalleryLayout, PRODUCT_GALLERY_LAYOUT_KEYS, 'left_thumbs'),
    productGalleryMobile: asEnum(src.productGalleryMobile, PRODUCT_GALLERY_MOBILE_KEYS, 'bottom_thumbs'),
    productInfoPosition: asEnum(src.productInfoPosition, PRODUCT_INFO_POSITION_KEYS, 'right'),
    productStickyBuyBox: asBool(src.productStickyBuyBox, true),
    productShowRelated: asBool(src.productShowRelated, true),
    productCtaLabel: asLabel(src.productCtaLabel, DEFAULT_APPEARANCE.productCtaLabel, 80),
    productShowTrust: asBool(src.productShowTrust, true),
    headerSticky: asBool(src.headerSticky, true),
    homeDensity: asEnum(src.homeDensity, HOME_DENSITY_KEYS, 'comfortable'),
    cardImageRatio: asEnum(src.cardImageRatio, CARD_IMAGE_RATIO_KEYS, 'portrait'),
    cardShowQuickAdd: asBool(src.cardShowQuickAdd, true),
    cardShowWishlist: asBool(src.cardShowWishlist, true),
    cardShowBadges: asBool(src.cardShowBadges, true),
    cardInfoAlign: asEnum(src.cardInfoAlign, CARD_INFO_ALIGN_KEYS, 'center'),
    cardHoverEffect: asEnum(src.cardHoverEffect, CARD_HOVER_EFFECT_KEYS, 'lift'),
    wishlistEmptyStyle: asEnum(src.wishlistEmptyStyle, WISHLIST_EMPTY_STYLE_KEYS, 'simple'),
    wishlistEmptyTitle: asLabel(
      src.wishlistEmptyTitle,
      DEFAULT_APPEARANCE.wishlistEmptyTitle,
      120,
    ),
    wishlistEmptyCtaLabel: asLabel(
      src.wishlistEmptyCtaLabel,
      DEFAULT_APPEARANCE.wishlistEmptyCtaLabel,
      80,
    ),
    wishlistGridColumns: asEnum(src.wishlistGridColumns, WISHLIST_GRID_COLUMNS_KEYS, '4'),
    formsLayout: asEnum(src.formsLayout, FORMS_LAYOUT_KEYS, 'split'),
    formsStyle: asEnum(src.formsStyle, FORMS_STYLE_KEYS, 'card'),
    formsShowHero: asBool(src.formsShowHero, true),
    formsCtaLabel: (() => {
      const s = String(src.formsCtaLabel ?? '').trim();
      return s.slice(0, 80);
    })(),
    formsShowSidebar: asBool(src.formsShowSidebar, true),
    notFoundTitle: asLabel(src.notFoundTitle, DEFAULT_APPEARANCE.notFoundTitle, 80),
    notFoundMessage: asLabel(src.notFoundMessage, DEFAULT_APPEARANCE.notFoundMessage, 200),
    notFoundCtaLabel: asLabel(src.notFoundCtaLabel, DEFAULT_APPEARANCE.notFoundCtaLabel, 80),
    notFoundCtaHref: normalizeNavHref(src.notFoundCtaHref) || '/',
  };
}

/** Classes grille boutique selon colonnes + densité. */
export function shopGridClass(columns: ShopGridColumnsKey, density: ShopDensityKey): string {
  const gap =
    density === 'compact'
      ? 'gap-x-4 gap-y-6'
      : density === 'spacious'
        ? 'gap-x-10 gap-y-14'
        : 'gap-x-8 gap-y-12';
  const cols =
    columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === '3'
        ? 'grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 lg:grid-cols-4';
  return `${cols} ${gap}`;
}

export function wishlistGridClass(columns: WishlistGridColumnsKey): string {
  if (columns === '2') return 'grid-cols-1 md:grid-cols-2 gap-8';
  if (columns === '3') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
}

export function cardImageRatioClass(ratio: CardImageRatioKey): string {
  if (ratio === 'square') return 'aspect-square';
  if (ratio === 'landscape') return 'aspect-[4/3]';
  return 'aspect-[4/5]';
}

export function formsPanelClass(style: FormsStyleKey): string {
  if (style === 'flat') return 'bg-transparent border-0 shadow-none';
  if (style === 'bordered') return 'bg-card border border-border shadow-none';
  return 'bg-card border border-border shadow-card';
}

export function checkoutCtaClass(emphasis: CheckoutCtaEmphasisKey, extra?: string): string {
  const base =
    'w-full !h-auto min-h-[3.25rem] px-4 py-3.5 text-xs sm:text-sm uppercase font-bold tracking-[0.12em] sm:tracking-[0.2em] transition-all grid grid-cols-[auto_1fr] items-center gap-2.5 sm:gap-3 sm:px-6 whitespace-normal leading-snug sm:min-h-[3.5rem] sm:py-4 sf-btn';
  const map: Record<CheckoutCtaEmphasisKey, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-card',
    bold: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl text-sm sm:text-base min-h-[3.75rem]',
    soft: 'bg-primary/15 text-primary hover:bg-primary/25 shadow-none',
    pill: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-card rounded-full',
  };
  return [base, map[emphasis], extra].filter(Boolean).join(' ');
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
    ghost: 'bg-transparent text-primary hover:bg-primary/10 shadow-none',
    gradient:
      'text-primary-foreground shadow-soft bg-gradient-to-r from-primary to-secondary hover:opacity-95',
    inverse: 'bg-foreground text-background shadow-soft hover:bg-foreground/90',
  };
  return [base, map[style], extra].filter(Boolean).join(' ');
}

export function appearanceCardClass(style: CardStyleKey, extra?: string): string {
  const map: Record<CardStyleKey, string> = {
    elevated: 'border border-border/70 bg-card shadow-soft',
    bordered: 'border-2 border-border bg-card shadow-none',
    flat: 'border-0 bg-muted/40 shadow-none',
    minimal: 'border-0 bg-transparent shadow-none p-0',
    glass: 'border border-white/40 bg-white/50 shadow-soft backdrop-blur-md',
    lifted: 'border border-border/40 bg-card shadow-xl shadow-black/15',
    soft: 'border-0 bg-primary/5 shadow-none',
  };
  return ['sf-card', map[style], extra].filter(Boolean).join(' ');
}
