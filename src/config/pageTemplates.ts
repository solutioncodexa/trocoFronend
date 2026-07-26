import type { StorePageBlock, UpsertStorePagePayload } from '@/types/store-pages';

export type PageTemplate = {
  key: string;
  label: string;
  description: string;
  meta: UpsertStorePagePayload;
  blocks: StorePageBlock[];
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: 'home-boutique',
    label: 'Accueil boutique',
    description: 'Hero, catégories, produits et CTA — idéal pour remplacer l’accueil.',
    meta: {
      title: 'Accueil boutique',
      slug: 'accueil-boutique',
      isHome: true,
      showInNav: false,
      published: true,
    },
    blocks: [
      {
        type: 'hero',
        sortOrder: 0,
        config: {
          headline: 'Bienvenue dans notre boutique',
          subtext: 'Découvrez une sélection soignée, livrée partout au Maroc.',
          ctaLabel: 'Voir la boutique',
          ctaHref: '/boutique',
          imageUrl: '',
        },
      },
      {
        type: 'categories',
        sortOrder: 1,
        config: { title: 'Catégories' },
      },
      {
        type: 'products',
        sortOrder: 2,
        config: { title: 'Sélection', limit: 8 },
      },
      {
        type: 'cta',
        sortOrder: 3,
        config: {
          title: 'Un projet sur-mesure ?',
          body: 'Décrivez votre besoin, nous vous répondons sous 24 h.',
          ctaLabel: 'Demander un devis',
          ctaHref: '/sur-mesure',
        },
      },
    ],
  },
  {
    key: 'a-propos',
    label: 'À propos',
    description: 'Histoire de marque + image + contact. Remplace Contact si slug = contact.',
    meta: {
      title: 'À propos',
      slug: 'a-propos',
      isHome: false,
      showInNav: true,
      published: true,
    },
    blocks: [
      {
        type: 'hero',
        sortOrder: 0,
        config: {
          headline: 'Notre histoire',
          subtext: 'Une marque engagée, des pièces choisies avec soin.',
          ctaLabel: 'Nous contacter',
          ctaHref: '/contact',
          imageUrl: '',
        },
      },
      {
        type: 'rich_text',
        sortOrder: 1,
        config: {
          title: 'Qui sommes-nous ?',
          body: 'Depuis nos débuts, nous sélectionnons des produits authentiques et durables. Chaque pièce raconte une histoire — la vôtre commence ici.',
        },
      },
      {
        type: 'image',
        sortOrder: 2,
        config: {
          imageUrl: '',
          alt: 'Notre atelier',
          caption: 'L’équipe au quotidien',
        },
      },
      {
        type: 'faq',
        sortOrder: 3,
        config: {
          title: 'Questions fréquentes',
          items: [
            { q: 'Où êtes-vous basés ?', a: 'Au Maroc — livraison nationale.' },
            { q: 'Faites-vous du sur-mesure ?', a: 'Oui, via la page Sur-mesure.' },
          ],
        },
      },
      {
        type: 'contact',
        sortOrder: 4,
        config: {
          title: 'Écrivez-nous',
          body: 'Une question sur la marque ? On vous répond vite.',
        },
      },
    ],
  },
  {
    key: 'lookbook',
    label: 'Lookbook',
    description: 'Mise en avant visuelle type magazine + grille produits.',
    meta: {
      title: 'Lookbook',
      slug: 'lookbook',
      isHome: false,
      showInNav: true,
      published: true,
    },
    blocks: [
      {
        type: 'hero',
        sortOrder: 0,
        config: {
          headline: 'Lookbook',
          subtext: 'Inspiration, matières et pièces du moment.',
          ctaLabel: 'Shopper la sélection',
          ctaHref: '/boutique',
          imageUrl: '',
        },
      },
      {
        type: 'spacer',
        sortOrder: 1,
        config: { size: 'sm' },
      },
      {
        type: 'rich_text',
        sortOrder: 2,
        config: {
          title: 'La collection',
          body: 'Des silhouettes claires, des textures naturelles, une palette douce.',
        },
      },
      {
        type: 'products',
        sortOrder: 3,
        config: { title: 'Pièces phares', limit: 6 },
      },
      {
        type: 'image',
        sortOrder: 4,
        config: {
          imageUrl: '',
          alt: 'Lookbook',
          caption: 'Détail matière',
        },
      },
      {
        type: 'cta',
        sortOrder: 5,
        config: {
          title: 'Envie de composer votre look ?',
          body: 'Parcourez toute la boutique.',
          ctaLabel: 'Voir tout',
          ctaHref: '/boutique',
        },
      },
    ],
  },
];

/** Slugs qui remplacent une entrée du menu système. */
export const SYSTEM_NAV_REPLACEMENTS = [
  'contact',
  'sur-mesure',
  'devis',
  'faq',
  'livraison-retours',
  'codes-promo',
] as const;

export type SystemNavSlug = (typeof SYSTEM_NAV_REPLACEMENTS)[number];
