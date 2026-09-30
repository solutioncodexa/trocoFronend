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
        configAr: {
          headline: 'مرحبًا بكم في متجرنا',
          subtext: 'اكتشف تشكيلة مختارة بعناية، مع التوصيل في كل أنحاء المغرب.',
          ctaLabel: 'عرض المتجر',
        },
      },
      {
        type: 'categories',
        sortOrder: 1,
        config: { title: 'Catégories' },
        configAr: { title: 'الفئات' },
      },
      {
        type: 'products',
        sortOrder: 2,
        config: { title: 'Sélection', limit: 8 },
        configAr: { title: 'مختارات' },
      },
      {
        type: 'cta',
        sortOrder: 3,
        config: {
          title: 'Une question ?',
          body: 'Écrivez-nous, nous vous répondons sous 24 h.',
          ctaLabel: 'Nous contacter',
          ctaHref: '/contact',
        },
        configAr: {
          title: 'هل لديك سؤال؟',
          body: 'راسلنا وسنرد عليك خلال 24 ساعة.',
          ctaLabel: 'تواصل معنا',
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
            { q: 'Comment suivre ma commande ?', a: 'Vous recevez un numéro de suivi dès l’expédition de votre colis.' },
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
  {
    key: 'home-complete',
    label: 'Accueil complet',
    description: 'Hero, avantages, catégories, produits, histoire, avis, blog et newsletter — accueil prêt à lancer.',
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
        configAr: {
          headline: 'مرحبًا بكم في متجرنا',
          subtext: 'اكتشف تشكيلة مختارة بعناية، مع التوصيل في كل أنحاء المغرب.',
          ctaLabel: 'عرض المتجر',
        },
      },
      {
        type: 'features',
        sortOrder: 1,
        config: {
          title: '',
          columns: 4,
          align: 'center',
          items: [
            { icon: 'truck', title: 'Livraison rapide', text: 'Partout au Maroc' },
            { icon: 'shield', title: 'Paiement sécurisé', text: 'Payez à la livraison ou en ligne' },
            { icon: 'refresh', title: 'Retours faciles', text: 'Échange simple' },
            { icon: 'headset', title: 'Service client', text: 'À votre écoute 6j/7' },
          ],
        },
        configAr: { title: '' },
      },
      {
        type: 'categories',
        sortOrder: 2,
        config: { title: 'Catégories' },
        configAr: { title: 'الفئات' },
      },
      {
        type: 'products',
        sortOrder: 3,
        config: { title: 'Nos best-sellers', limit: 8 },
        configAr: { title: 'الأكثر مبيعًا' },
      },
      {
        type: 'split',
        sortOrder: 4,
        config: {
          title: 'Notre histoire',
          body: 'Présentez ici votre marque, votre savoir-faire et ce qui rend vos produits uniques.',
          imageUrl: '',
          imagePosition: 'left',
          ctaLabel: 'En savoir plus',
          ctaHref: '/contact',
        },
        configAr: { title: 'قصتنا', ctaLabel: 'اعرف المزيد' },
      },
      {
        type: 'testimonials',
        sortOrder: 5,
        config: {
          title: 'Ils nous font confiance',
          items: [
            { name: 'Sara B.', text: 'Livraison rapide et produits magnifiques.', role: 'Casablanca' },
            { name: 'Youssef K.', text: 'Service client au top.', role: 'Rabat' },
          ],
        },
        configAr: { title: 'عملاؤنا يثقون بنا' },
      },
      {
        type: 'blog_posts',
        sortOrder: 6,
        config: { title: 'Du côté du blog', limit: 3 },
        configAr: { title: 'من المدونة' },
      },
      {
        type: 'newsletter',
        sortOrder: 7,
        config: { title: 'Restez informé', body: 'Recevez nos nouveautés et offres exclusives.' },
        configAr: { title: 'ابق على اطلاع', body: 'توصل بأحدث منتجاتنا وعروضنا الحصرية.' },
      },
    ],
  },
  {
    key: 'notre-histoire',
    label: 'Notre histoire',
    description: 'Page de marque : récit, valeurs en icônes, galerie photo et contact.',
    meta: {
      title: 'Notre histoire',
      slug: 'notre-histoire',
      isHome: false,
      showInNav: true,
      published: true,
    },
    blocks: [
      {
        type: 'split',
        sortOrder: 0,
        config: {
          title: 'Qui sommes-nous ?',
          body: 'Racontez comment tout a commencé, ce qui vous anime et ce que vos clients peuvent attendre de vous.',
          imageUrl: '',
          imagePosition: 'right',
        },
        configAr: { title: 'من نحن؟' },
      },
      {
        type: 'features',
        sortOrder: 1,
        config: {
          title: 'Nos engagements',
          columns: 3,
          align: 'center',
          items: [
            { icon: 'sparkles', title: 'Qualité', text: 'Des produits sélectionnés avec soin' },
            { icon: 'heart', title: 'Proximité', text: 'Une relation client sincère' },
            { icon: 'gift', title: 'Plaisir d’offrir', text: 'Des emballages soignés' },
          ],
        },
        configAr: { title: 'التزاماتنا' },
      },
      {
        type: 'gallery',
        sortOrder: 2,
        config: { title: 'En images', columns: 3, images: ['', '', ''] },
        configAr: { title: 'بالصور' },
      },
      {
        type: 'contact',
        sortOrder: 3,
        config: { title: 'Contactez-nous', body: 'Une question ? Écrivez-nous.', leadType: 'lead' },
        configAr: { title: 'اتصل بنا', body: 'هل لديك سؤال؟ راسلنا.' },
      },
    ],
  },
  {
    key: 'landing-offre',
    label: 'Landing offre',
    description: 'Page de conversion : hero, avantages, produits, compte à rebours, FAQ et newsletter.',
    meta: {
      title: 'Offre du moment',
      slug: 'offre-du-moment',
      isHome: false,
      showInNav: false,
      published: true,
    },
    blocks: [
      {
        type: 'hero',
        sortOrder: 0,
        config: {
          headline: 'L’offre à ne pas manquer',
          subtext: 'Profitez de nos produits phares à prix réduit, pour une durée limitée.',
          ctaLabel: 'J’en profite',
          ctaHref: '/boutique',
          imageUrl: '',
        },
        configAr: { headline: 'العرض الذي لا يفوّت', ctaLabel: 'أستفيد منه' },
      },
      {
        type: 'features',
        sortOrder: 1,
        config: {
          title: '',
          columns: 3,
          align: 'center',
          items: [
            { icon: 'clock', title: 'Livraison express', text: '24 à 72 h selon la ville' },
            { icon: 'shield', title: 'Paiement à la livraison', text: 'Vous payez à la réception' },
            { icon: 'refresh', title: 'Satisfait ou échangé', text: 'Échange simple' },
          ],
        },
        configAr: { title: '' },
      },
      {
        type: 'products',
        sortOrder: 2,
        config: { title: 'Produits en promotion', limit: 4, columns: 4 },
        configAr: { title: 'منتجات معروضة' },
      },
      {
        type: 'countdown',
        sortOrder: 3,
        config: {
          title: 'Offre limitée',
          subtitle: 'Plus que…',
          endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
          ctaLabel: 'Commander maintenant',
          ctaHref: '/boutique',
        },
        configAr: { title: 'عرض محدود' },
      },
      {
        type: 'faq',
        sortOrder: 4,
        config: {
          title: 'Questions fréquentes',
          items: [
            { q: 'Quels sont les délais de livraison ?', a: '24 à 72 h selon votre ville.' },
            { q: 'Puis-je payer à la livraison ?', a: 'Oui, le paiement à la livraison est disponible.' },
            { q: 'Comment suivre ma commande ?', a: 'Vous recevez un numéro de suivi dès l’expédition.' },
          ],
        },
      },
      {
        type: 'newsletter',
        sortOrder: 5,
        config: { title: 'Ne ratez aucune offre', body: 'Inscrivez-vous pour être prévenu en premier.' },
        configAr: { title: 'لا تفوّت أي عرض' },
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
