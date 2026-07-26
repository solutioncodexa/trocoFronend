export type StorePageBlockType =
  | 'hero'
  | 'rich_text'
  | 'products'
  | 'categories'
  | 'cta'
  | 'image'
  | 'faq'
  | 'spacer'
  | 'contact'
  | 'video'
  | 'testimonials'
  | 'countdown'
  | 'instagram';

export type StorePageBlock = {
  id?: number | null;
  type: StorePageBlockType | string;
  sortOrder?: number;
  config: Record<string, unknown>;
  configAr?: Record<string, unknown>;
  visibleMobile?: boolean;
  visibleDesktop?: boolean;
};

export type StorePageAbVariant = 'A' | 'B' | null;

export type StorePage = {
  id: number;
  title: string;
  titleAr?: string | null;
  slug: string;
  isHome: boolean;
  showInNav: boolean;
  published: boolean;
  abVariant?: StorePageAbVariant;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionAr?: string | null;
  publishAt?: string | null;
  unpublishAt?: string | null;
  currentlyLive?: boolean;
  blocks: StorePageBlock[];
  previewToken?: string | null;
};

export type StorePagePreviewLink = {
  token: string;
  path: string;
};

export type StorePageNavItem = {
  id: number;
  title: string;
  titleAr?: string | null;
  slug: string;
  isHome: boolean;
};

export type StorePageVersion = {
  id: number;
  pageId: number;
  label: string;
  createdAt: string;
};

export type StorePageAnalyticsSummary = {
  pageId: number;
  pageTitle: string;
  pageSlug: string;
  abVariant?: string | null;
  views: number;
  ctaClicks: number;
};

export type StorePageExportPayload = {
  format: string;
  exportedAt: string;
  page: StorePage;
};

export type UpsertStorePagePayload = {
  title: string;
  titleAr?: string;
  slug?: string;
  isHome?: boolean;
  showInNav?: boolean;
  published?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  seoTitleAr?: string;
  seoDescriptionAr?: string;
  publishAt?: string | null;
  unpublishAt?: string | null;
  clearPublishAt?: boolean;
  clearUnpublishAt?: boolean;
  abVariant?: StorePageAbVariant | string | null;
};

export const BLOCK_CATALOG: {
  type: StorePageBlockType;
  label: string;
  description: string;
  defaults: Record<string, unknown>;
}[] = [
  {
    type: 'hero',
    label: 'Hero / Bannière',
    description: 'Grande bannière avec titre et bouton',
    defaults: {
      headline: 'Bienvenue',
      subtext: 'Votre accroche ici',
      ctaLabel: 'Voir la boutique',
      ctaHref: '/boutique',
      imageUrl: '',
    },
  },
  {
    type: 'rich_text',
    label: 'Texte',
    description: 'Titre + paragraphe',
    defaults: { title: 'À propos', body: 'Racontez votre histoire…' },
  },
  {
    type: 'products',
    label: 'Grille produits',
    description: 'Affiche des produits de la boutique',
    defaults: { title: 'Nos produits', limit: 8 },
  },
  {
    type: 'categories',
    label: 'Catégories',
    description: 'Grille des catégories',
    defaults: { title: 'Catégories' },
  },
  {
    type: 'cta',
    label: 'Appel à l’action',
    description: 'Bandeau avec bouton',
    defaults: {
      title: 'Envie d’un projet sur-mesure ?',
      body: 'Contactez-nous, réponse sous 24 h.',
      ctaLabel: 'Nous écrire',
      ctaHref: '/contact',
    },
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Image pleine largeur',
    defaults: { imageUrl: '', alt: '', caption: '' },
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Questions / réponses',
    defaults: {
      title: 'FAQ',
      items: [
        { q: 'Quels délais de livraison ?', a: '24–48 h à Casablanca, 2–4 jours ailleurs.' },
        { q: 'Puis-je retourner un article ?', a: 'Oui, sous 14 jours.' },
      ],
    },
  },
  {
    type: 'spacer',
    label: 'Espace',
    description: 'Marge verticale',
    defaults: { size: 'md' },
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Formulaire de contact simplifié',
    defaults: { title: 'Contactez-nous', body: 'Une question ? Écrivez-nous.', leadType: 'lead' },
  },
  {
    type: 'video',
    label: 'Vidéo',
    description: 'Vidéo YouTube / Vimeo / MP4',
    defaults: {
      title: 'En vidéo',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
  {
    type: 'testimonials',
    label: 'Témoignages',
    description: 'Avis clients',
    defaults: {
      title: 'Ils nous font confiance',
      items: [
        { name: 'Sara B.', text: 'Livraison rapide et produits magnifiques.', role: 'Casablanca' },
        { name: 'Youssef K.', text: 'Service client au top.', role: 'Rabat' },
      ],
    },
  },
  {
    type: 'countdown',
    label: 'Compteur promo',
    description: 'Compte à rebours jusqu’à une date',
    defaults: {
      title: 'Offre limitée',
      subtitle: 'Plus que…',
      endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      ctaLabel: 'J’en profite',
      ctaHref: '/boutique',
    },
  },
  {
    type: 'instagram',
    label: 'Grille Instagram',
    description: 'Grille d’images style Instagram',
    defaults: {
      title: '@votre_boutique',
      handle: 'matjarona',
      images: ['', '', '', '', '', ''],
    },
  },
];
