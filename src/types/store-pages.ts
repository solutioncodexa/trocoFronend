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

/** Liste admin — sans blocs (GET /store-pages). */
export type StorePageListItem = {
  id: number;
  title: string;
  titleAr?: string | null;
  slug: string;
  isHome: boolean;
  showInNav: boolean;
  published: boolean;
  abVariant?: StorePageAbVariant;
  sortOrder: number;
  currentlyLive?: boolean;
  publishAt?: string | null;
  unpublishAt?: string | null;
  blockCount: number;
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
  /** Libellé vendeur (sans jargon technique). */
  label: string;
  description: string;
  defaults: Record<string, unknown>;
}[] = [
  {
    type: 'hero',
    label: 'Grande bannière',
    description: 'Photo pleine largeur avec titre et bouton',
    defaults: {
      headline: 'Bienvenue',
      subtext: 'Votre accroche ici',
      ctaLabel: 'Voir la boutique',
      ctaHref: '/boutique',
      imageUrl: '',
      layout: 'overlay',
      buttonSize: 'lg',
      align: 'left',
      vAlign: 'center',
      paddingY: 'lg',
      maxWidth: 'lg',
      overlay: 'medium',
      heroHeight: 'lg',
      bgColor: '',
      textColor: '',
      buttonColor: '',
    },
  },
  {
    type: 'rich_text',
    label: 'Texte',
    description: 'Titre et paragraphe pour raconter votre histoire',
    defaults: {
      title: 'À propos',
      body: 'Racontez votre histoire…',
      align: 'left',
      paddingY: 'md',
      maxWidth: 'md',
    },
  },
  {
    type: 'products',
    label: 'Vos produits',
    description: 'Affiche automatiquement les produits de la boutique',
    defaults: {
      title: 'Nos produits',
      limit: 8,
      columns: 4,
      imageAspect: 'portrait',
      cardDensity: 'comfortable',
      mediaRadius: 'xl',
      align: 'left',
      paddingY: 'md',
      maxWidth: 'lg',
    },
  },
  {
    type: 'categories',
    label: 'Vos catégories',
    description: 'Grille des catégories de la boutique',
    defaults: {
      title: 'Catégories',
      columns: 4,
      imageAspect: 'portrait',
      cardDensity: 'comfortable',
      mediaRadius: 'xl',
      align: 'left',
      paddingY: 'md',
      maxWidth: 'lg',
    },
  },
  {
    type: 'cta',
    label: 'Bandeau bouton',
    description: 'Message fort avec un bouton d’action',
    defaults: {
      title: 'Envie d’un projet sur-mesure ?',
      body: 'Contactez-nous, réponse sous 24 h.',
      ctaLabel: 'Nous écrire',
      ctaHref: '/contact',
      ctaLayout: 'inline',
      buttonSize: 'lg',
      align: 'left',
      paddingY: 'md',
      maxWidth: 'md',
      bgColor: '',
      textColor: '',
      buttonColor: '',
    },
  },
  {
    type: 'image',
    label: 'Grande image',
    description: 'Une image mise en avant',
    defaults: { imageUrl: '', alt: '', caption: '', mediaRadius: 'xl' },
  },
  {
    type: 'faq',
    label: 'Questions fréquentes',
    description: 'Liste de questions / réponses',
    defaults: {
      title: 'Questions fréquentes',
      faqStyle: 'accordion',
      items: [
        { q: 'Quels délais de livraison ?', a: '24–48 h à Casablanca, 2–4 jours ailleurs.' },
        { q: 'Puis-je retourner un article ?', a: 'Oui, sous 14 jours.' },
      ],
    },
  },
  {
    type: 'spacer',
    label: 'Espace vide',
    description: 'Ajoute de l’air entre deux sections',
    defaults: { size: 'md' },
  },
  {
    type: 'contact',
    label: 'Formulaire contact',
    description: 'Les visiteurs peuvent vous écrire',
    defaults: { title: 'Contactez-nous', body: 'Une question ? Écrivez-nous.', leadType: 'lead' },
  },
  {
    type: 'video',
    label: 'Vidéo',
    description: 'Intégrez une vidéo YouTube, Vimeo ou MP4',
    defaults: {
      title: 'En vidéo',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      mediaRadius: 'xl',
    },
  },
  {
    type: 'testimonials',
    label: 'Avis clients',
    description: 'Mettez en avant les retours de vos clients',
    defaults: {
      title: 'Ils nous font confiance',
      testimonialLayout: 'grid2',
      items: [
        { name: 'Sara B.', text: 'Livraison rapide et produits magnifiques.', role: 'Casablanca' },
        { name: 'Youssef K.', text: 'Service client au top.', role: 'Rabat' },
      ],
    },
  },
  {
    type: 'countdown',
    label: 'Offre limitée',
    description: 'Compte à rebours jusqu’à la fin de la promo',
    defaults: {
      title: 'Offre limitée',
      subtitle: 'Plus que…',
      endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      ctaLabel: 'J’en profite',
      ctaHref: '/boutique',
      buttonSize: 'md',
    },
  },
  {
    type: 'instagram',
    label: 'Photos Instagram',
    description: 'Grille de photos style Instagram',
    defaults: {
      title: '@votre_boutique',
      handle: 'matjarona',
      columns: 3,
      cardDensity: 'compact',
      mediaRadius: 'md',
      images: ['', '', '', '', '', ''],
    },
  },
];
