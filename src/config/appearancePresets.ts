/**
 * Choix rapides type Shopify (schémas de couleurs, chrome header, fonds).
 * N’écrase que les champs listés — le reste de l’apparence reste intact.
 */

import type { StoreAppearance } from '@/config/storeAppearance';

export type ColorSchemePreset = {
  key: string;
  label: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
};

export const COLOR_SCHEMES: ColorSchemePreset[] = [
  {
    key: 'teal',
    label: 'Océan',
    description: 'Teal + bleu, e-commerce classique.',
    primaryColor: '#0F766E',
    secondaryColor: '#0369A1',
  },
  {
    key: 'ink',
    label: 'Encre',
    description: 'Noir & gris, look minimal.',
    primaryColor: '#171717',
    secondaryColor: '#737373',
  },
  {
    key: 'pulse',
    label: 'Pulse',
    description: 'Rose + orange, flash sale.',
    primaryColor: '#E11D48',
    secondaryColor: '#F97316',
  },
  {
    key: 'violet',
    label: 'Violet',
    description: 'Pourpre doux, boutique premium.',
    primaryColor: '#7851A9',
    secondaryColor: '#A78BFA',
  },
  {
    key: 'forest',
    label: 'Forêt',
    description: 'Vert olive + ambre.',
    primaryColor: '#3F6212',
    secondaryColor: '#B45309',
  },
  {
    key: 'sand',
    label: 'Sable',
    description: 'Brun chaud + terracotta.',
    primaryColor: '#9A3412',
    secondaryColor: '#A8A29E',
  },
  {
    key: 'sky',
    label: 'Ciel',
    description: 'Bleu clair + indigo.',
    primaryColor: '#0284C7',
    secondaryColor: '#4F46E5',
  },
  {
    key: 'rose',
    label: 'Rose',
    description: 'Rose poudré + prune.',
    primaryColor: '#DB2777',
    secondaryColor: '#7C3AED',
  },
  {
    key: 'copper',
    label: 'Cuivre',
    description: 'Cuivre + anthracite.',
    primaryColor: '#C2410C',
    secondaryColor: '#292524',
  },
  {
    key: 'mint',
    label: 'Menthe',
    description: 'Menthe + slate.',
    primaryColor: '#0D9488',
    secondaryColor: '#475569',
  },
];

export type HeaderChromePreset = {
  key: string;
  label: string;
  description: string;
  headerBgColor: string;
  headerTextColor: string;
};

/** Chaîne vide = Auto (hérite du thème). */
export const HEADER_CHROME_PRESETS: HeaderChromePreset[] = [
  {
    key: 'auto',
    label: 'Auto',
    description: 'Couleurs du thème.',
    headerBgColor: '',
    headerTextColor: '',
  },
  {
    key: 'light',
    label: 'Clair',
    description: 'Fond blanc, texte sombre.',
    headerBgColor: '#FFFFFF',
    headerTextColor: '#171717',
  },
  {
    key: 'dark',
    label: 'Contraste',
    description: 'Fond sombre, texte blanc.',
    headerBgColor: '#0F0C0C',
    headerTextColor: '#FFFFFF',
  },
  {
    key: 'brand',
    label: 'Marque',
    description: 'Fond primaire (aperçu via Auto + primaire).',
    headerBgColor: '',
    headerTextColor: '#FFFFFF',
  },
];

export type SurfacePreset = {
  key: string;
  label: string;
  description: string;
  pageBgColor: string;
  headerBgColor: string;
  footerBgColor: string;
  headerTextColor: string;
  footerTextColor: string;
};

export const SURFACE_PRESETS: SurfacePreset[] = [
  {
    key: 'auto',
    label: 'Auto',
    description: 'Tout hérite du thème.',
    pageBgColor: '',
    headerBgColor: '',
    footerBgColor: '',
    headerTextColor: '',
    footerTextColor: '',
  },
  {
    key: 'paper',
    label: 'Papier',
    description: 'Page claire, chrome sombre.',
    pageBgColor: '#FAFAF9',
    headerBgColor: '#171717',
    footerBgColor: '#171717',
    headerTextColor: '#FFFFFF',
    footerTextColor: '#F5F5F4',
  },
  {
    key: 'gallery',
    label: 'Galerie',
    description: 'Tout clair, discret.',
    pageBgColor: '#FFFFFF',
    headerBgColor: '#FFFFFF',
    footerBgColor: '#F5F5F4',
    headerTextColor: '#171717',
    footerTextColor: '#171717',
  },
  {
    key: 'night',
    label: 'Nuit',
    description: 'Ambiance sombre homogène.',
    pageBgColor: '#0C0A09',
    headerBgColor: '#0C0A09',
    footerBgColor: '#1C1917',
    headerTextColor: '#FAFAF9',
    footerTextColor: '#E7E5E4',
  },
];

/** Packs look & feel complets (1 clic) — n’écrase que les clés listées. */
export type AppearanceLookPreset = {
  key: string;
  label: string;
  description: string;
  primaryColor?: string;
  secondaryColor?: string;
  appearance: Partial<StoreAppearance>;
};

export const APPEARANCE_LOOK_PRESETS: AppearanceLookPreset[] = [
  {
    key: 'editorial',
    label: 'Éditorial',
    description: 'Aéré, 2 colonnes, galerie premium.',
    primaryColor: '#171717',
    secondaryColor: '#737373',
    appearance: {
      buttonStyle: 'outline',
      cardStyle: 'minimal',
      cardImageRatio: 'portrait',
      cardInfoAlign: 'left',
      cardHoverEffect: 'zoom',
      heroStyle: 'minimal',
      headerLayout: 'centered',
      footerLayout: 'centered',
      shopGridColumns: '2',
      shopDensity: 'spacious',
      shopFilterLayout: 'top',
      productGalleryLayout: 'stacked',
      productInfoPosition: 'below',
      cartDensity: 'spacious',
      checkoutDensity: 'spacious',
      homeDensity: 'spacious',
      headerSticky: true,
    },
  },
  {
    key: 'dense',
    label: 'Dense',
    description: 'Max produits, filtres sidebar, checkout compact.',
    primaryColor: '#0F766E',
    secondaryColor: '#0369A1',
    appearance: {
      buttonStyle: 'solid',
      cardStyle: 'bordered',
      cardImageRatio: 'square',
      cardInfoAlign: 'center',
      cardHoverEffect: 'lift',
      heroStyle: 'banner',
      headerLayout: 'inline',
      footerLayout: 'compact',
      shopGridColumns: '4',
      shopDensity: 'compact',
      shopFilterLayout: 'sidebar',
      productGalleryLayout: 'left_thumbs',
      productInfoPosition: 'right',
      cartDensity: 'compact',
      checkoutDensity: 'compact',
      checkoutLayout: 'single',
      homeDensity: 'compact',
      headerSticky: true,
    },
  },
  {
    key: 'boutique',
    label: 'Boutique',
    description: 'Équilibre confort, cards relief, CTA fort.',
    primaryColor: '#0D9488',
    secondaryColor: '#475569',
    appearance: {
      buttonStyle: 'solid',
      cardStyle: 'elevated',
      cardImageRatio: 'portrait',
      cardInfoAlign: 'center',
      cardHoverEffect: 'lift',
      heroStyle: 'fullbleed',
      headerLayout: 'inline',
      footerLayout: 'default',
      shopGridColumns: '3',
      shopDensity: 'comfortable',
      shopFilterLayout: 'sidebar',
      productGalleryLayout: 'left_thumbs',
      productStickyBuyBox: true,
      cartDensity: 'comfortable',
      checkoutLayout: 'steps',
      checkoutStickySummary: true,
      homeDensity: 'comfortable',
      headerSticky: true,
    },
  },
  {
    key: 'bold-sale',
    label: 'Flash',
    description: 'Contraste fort, pilules, checkout une page.',
    primaryColor: '#E11D48',
    secondaryColor: '#F97316',
    appearance: {
      buttonStyle: 'pill',
      cardStyle: 'lifted',
      cardImageRatio: 'landscape',
      cardShowBadges: true,
      cardHoverEffect: 'lift',
      heroStyle: 'overlay',
      headerLayout: 'stacked',
      footerLayout: 'links_only',
      shopGridColumns: '4',
      shopDensity: 'compact',
      shopFilterLayout: 'drawer',
      productCtaLabel: 'Acheter maintenant',
      checkoutCtaEmphasis: 'bold',
      checkoutLayout: 'single',
      homeDensity: 'compact',
      headerSticky: true,
    },
  },
];
