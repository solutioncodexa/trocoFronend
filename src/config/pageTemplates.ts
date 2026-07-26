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
  {
    key: 'promo-flash',
    label: 'Promo flash',
    description: 'Compte à rebours, produits et FAQ — parfait pour une soldes.',
    meta: {
      title: 'Offre limitée',
      slug: 'offre-limitee',
      isHome: false,
      showInNav: true,
      published: true,
    },
    blocks: [
      {
        type: 'countdown',
        sortOrder: 0,
        config: {
          title: 'Soldes privées',
          subtitle: 'Plus que quelques heures…',
          endsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 16),
          ctaLabel: 'J’en profite',
          ctaHref: '/boutique',
          bgColor: '#0F172A',
          textColor: '#F8FAFC',
          buttonColor: '#F59E0B',
          align: 'center',
        },
      },
      {
        type: 'products',
        sortOrder: 1,
        config: { title: 'Pièces en promo', limit: 8, columns: 4, align: 'left' },
      },
      {
        type: 'faq',
        sortOrder: 2,
        config: {
          title: 'Avant de commander',
          items: [
            { q: 'Les stocks sont-ils limités ?', a: 'Oui, jusqu’à épuisement.' },
            { q: 'Puis-je cumuler un code promo ?', a: 'Non pendant cette opération.' },
          ],
        },
      },
      {
        type: 'cta',
        sortOrder: 3,
        config: {
          title: 'Besoin d’aide pour choisir ?',
          body: 'Notre équipe vous guide.',
          ctaLabel: 'Nous écrire',
          ctaHref: '/contact',
          bgColor: '#0F766E',
          textColor: '#FFFFFF',
          buttonColor: '#FFFFFF',
        },
      },
    ],
  },
  {
    key: 'landing-leads',
    label: 'Capture leads',
    description: 'Hero + témoignages + formulaire — pour collecter des contacts.',
    meta: {
      title: 'Restons en contact',
      slug: 'newsletter',
      isHome: false,
      showInNav: true,
      published: true,
    },
    blocks: [
      {
        type: 'hero',
        sortOrder: 0,
        config: {
          headline: 'Recevez nos nouveautés',
          subtext: 'Conseils, coulisses et avant-premières — zéro spam.',
          ctaLabel: 'S’inscrire',
          ctaHref: '#contact',
          align: 'center',
          vAlign: 'center',
          overlay: 'dark',
          heroHeight: 'md',
        },
      },
      {
        type: 'testimonials',
        sortOrder: 1,
        config: {
          title: 'Ils nous suivent déjà',
          align: 'center',
          items: [
            { name: 'Nadia M.', text: 'Les newsletters sont vraiment utiles.', role: 'Marrakech' },
            { name: 'Karim T.', text: 'J’ai découvert les soldes en premier.', role: 'Fès' },
          ],
        },
      },
      {
        type: 'contact',
        sortOrder: 2,
        config: {
          title: 'Votre e-mail',
          body: 'Un mail de bienvenue et les prochaines sorties.',
          leadType: 'newsletter',
          align: 'center',
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
