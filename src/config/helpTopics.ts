/**
 * Aides contextuelles (icône « ? ») : un sujet = une fenêtre qui explique à quoi sert le réglage,
 * comment l'utiliser et quoi éviter. Texte volontairement court et concret.
 */
export type HelpTopic = {
  title: string;
  /** Une phrase : à quoi ça sert. */
  summary: string;
  /** Étapes ou points clés. */
  steps?: string[];
  /** Conseils / pièges. */
  tips?: string[];
  /** Lien « Aller plus loin ». */
  link?: { label: string; href: string };
};

export const HELP_TOPICS: Record<string, HelpTopic> = {
  // ----- Identité -----
  identity: {
    title: 'Identité de la boutique',
    summary: 'Le nom, le slogan et le logo apparaissent dans l’en-tête, le pied de page, l’onglet du navigateur et les emails clients.',
    steps: [
      'Saisissez le nom exact de votre marque.',
      'Ajoutez un slogan court (facultatif) : il s’affiche sous le nom et dans les résultats Google.',
      'Importez votre logo : il est enregistré immédiatement.',
    ],
    tips: ['Le nom et le slogan sont publiés quand vous cliquez sur « Enregistrer ».'],
  },
  siteName: {
    title: 'Nom de la boutique',
    summary: 'Le nom de votre marque, affiché partout sur la vitrine et dans les emails envoyés à vos clients.',
    tips: ['Changer le nom ne change pas l’adresse (slug) de la boutique.'],
  },
  tagline: {
    title: 'Slogan',
    summary: 'Une phrase courte qui résume ce que vous vendez. Elle sert aussi de description par défaut pour Google.',
    tips: ['Visez moins de 100 caractères.'],
  },
  logo: {
    title: 'Logo',
    summary: 'L’image de votre marque, affichée en haut de la vitrine et dans les emails.',
    steps: ['Cliquez sur « Importer un logo » et choisissez une image.', 'Le logo est enregistré tout de suite, sans cliquer sur Enregistrer.'],
    tips: [
      'Préférez un PNG ou WebP avec fond transparent.',
      'Format horizontal conseillé, environ 400 × 120 px.',
      'Si vous n’en avez pas, le nom de la boutique s’affiche à la place.',
    ],
  },
  favicon: {
    title: 'Favicon',
    summary: 'La petite icône affichée dans l’onglet du navigateur et dans les favoris.',
    tips: ['Image carrée, 64 × 64 px minimum. Sans favicon, le logo est utilisé.'],
  },
  slug: {
    title: 'Adresse de la boutique (slug)',
    summary: 'La partie unique de votre adresse web, par exemple « ma-boutique » pour ma-boutique.getstore.com.',
    tips: ['Elle est choisie à la création. Pour utiliser votre propre nom de domaine, voir « Domaine personnalisé ».'],
  },

  // ----- Domaine -----
  customDomain: {
    title: 'Domaine personnalisé',
    summary: 'Faites afficher votre boutique sur votre propre adresse, par exemple www.mamarque.ma.',
    steps: [
      'Achetez le domaine chez un registrar (ou utilisez celui que vous possédez déjà).',
      'Saisissez-le ici, sans https://.',
      'Créez chez votre registrar les enregistrements DNS indiqués par l’assistant.',
      'Cliquez sur « Vérifier » : la propagation peut prendre de quelques minutes à 24 h.',
    ],
    tips: [
      'Disponible à partir du plan Pro.',
      'Votre adresse getstore reste active pendant et après la configuration.',
    ],
  },

  // ----- Réglages -----
  plan: {
    title: 'Abonnement',
    summary: 'Votre plan définit le nombre de produits, de comptes et les fonctions disponibles (thèmes, A/B, WhatsApp, webhooks…).',
    steps: ['Les fonctions d’un plan supérieur portent une couronne.', 'Pendant l’essai gratuit, rien n’est facturé ; à la fin, la boutique passe au plan choisi.'],
  },
  pixels: {
    title: 'Pixels et conversion',
    summary: 'Branchez Meta (Facebook), TikTok ou Google pour mesurer vos ventes et cibler vos publicités.',
    steps: ['Copiez l’identifiant du pixel depuis votre compte publicitaire.', 'Collez-le ici et enregistrez.'],
    tips: ['Le nombre de pixels dépend de votre plan.'],
  },
  language: {
    title: 'Langue de la vitrine',
    summary: 'Choisissez la langue par défaut et les langues proposées à vos clients (français, anglais, arabe avec lecture de droite à gauche).',
  },
  payments: {
    title: 'Paiements',
    summary: 'Activez les moyens de paiement proposés au checkout : paiement à la livraison, carte, PayPal.',
    steps: ['Activez le moyen voulu.', 'Renseignez les clés fournies par le prestataire.', 'Faites un paiement test avant d’ouvrir la boutique.'],
    tips: ['Ne partagez jamais vos clés secrètes : elles sont chiffrées et masquées après enregistrement.'],
  },
  loyalty: {
    title: 'Fidélité',
    summary: 'Les clients gagnent des points à chaque achat et peuvent les utiliser pour réduire leurs prochaines commandes.',
    tips: ['Réservé au plan Pro.'],
  },
  cndp: {
    title: 'Conformité CNDP',
    summary: 'Informe vos clients de la collecte de leurs données (loi 09-08) : bandeau cookies, politique de confidentialité, durée de conservation.',
    tips: ['Ajoutez un lien vers votre page de confidentialité (créée automatiquement depuis l’assistant).'],
  },
  whatsapp: {
    title: 'WhatsApp Business',
    summary: 'Envoyez des confirmations et des relances de commande à vos clients par WhatsApp.',
    tips: ['Réservé au plan Pro.'],
  },
  shipping: {
    title: 'Livraison',
    summary: 'Définissez les frais de livraison, le seuil de livraison gratuite et le transporteur par défaut.',
    tips: ['Un seuil de livraison gratuite augmente souvent le panier moyen.'],
  },
  contact: {
    title: 'Contact',
    summary: 'Email, téléphone, WhatsApp et ville affichés sur la vitrine (pied de page, page contact) et utilisés dans les emails.',
  },
  social: {
    title: 'Réseaux sociaux',
    summary: 'Les liens de vos pages Instagram, Facebook, TikTok… affichés dans le pied de page et sur la fiche produit pour le partage.',
  },

  // ----- Apparence -----
  'appearance.themes': {
    title: 'Thèmes et styles',
    summary: 'Un style règle d’un clic le design, les couleurs, les polices et l’agencement de toute la boutique.',
    steps: ['Choisissez un style pour partir d’une base cohérente.', 'Affinez ensuite chaque partie dans les autres sections.'],
    tips: ['Certains thèmes demandent le plan Pro (couronne).', 'Rien n’est publié tant que vous n’enregistrez pas, sauf mention contraire.'],
  },
  'appearance.identity': {
    title: 'Couleurs et identité',
    summary: 'Couleur principale et secondaire de la boutique : boutons, liens, badges.',
    tips: ['Gardez un bon contraste entre le texte et le fond.'],
  },
  'appearance.typography': {
    title: 'Typographie',
    summary: 'Les polices des titres et du texte, et l’arrondi des éléments (angles vifs, doux ou très arrondis).',
  },
  'appearance.buttons': { title: 'Boutons', summary: 'Style des boutons : plein, contour, arrondi. Il s’applique partout sur la vitrine.' },
  'appearance.cards': { title: 'Cartes produit', summary: 'Aspect des fiches produit dans les listes : ratio de l’image, survol, boutons rapides, badges.' },
  'appearance.hero': { title: 'Bannière d’accueil', summary: 'La grande zone en haut de la page d’accueil : style, texte du bouton, avantages affichés.' },
  'appearance.backgrounds': { title: 'Fonds et surfaces', summary: 'Couleur de fond du site et des cartes, et mode clair ou sombre.' },
  'appearance.header': { title: 'En-tête', summary: 'Logo, menu, recherche, panier, bandeau promo : ce qui s’affiche en haut de chaque page.' },
  'appearance.footer': { title: 'Pied de page', summary: 'Disposition du bas de page : liens, contact, réseaux sociaux, pages légales.' },
  'appearance.home': { title: 'Page d’accueil', summary: 'Densité et sections de l’accueil. Pour composer librement la page, utilisez le menu Pages.', link: { label: 'Ouvrir Pages', href: '/admin/pages' } },
  'appearance.shop': { title: 'Boutique (catalogue)', summary: 'Disposition de la liste des produits : filtres, nombre de colonnes, tri, message si aucun résultat.' },
  'appearance.product': {
    title: 'Fiche produit',
    summary: 'Galerie, position des informations, bouton Commander, et sections sous la fiche.',
    steps: ['Activez ou masquez la description, WhatsApp, Partager.', 'Réordonnez « Souvent achetés ensemble », « Avis » et « Produits similaires » avec les flèches.'],
  },
  'appearance.wishlist': { title: 'Favoris', summary: 'Aspect de la page des produits favoris des clients.' },
  'appearance.cart': { title: 'Panier', summary: 'Densité, état vide, produits complémentaires et texte du bouton « Passer la commande ».' },
  'appearance.checkout': {
    title: 'Commande (checkout)',
    summary: 'Page unique ou en étapes, position du récapitulatif, champ code promo, notes, badges de confiance.',
    tips: ['Moins il y a de champs, plus les clients terminent leur commande.'],
  },
  'appearance.forms': { title: 'Formulaires', summary: 'Aspect des pages contact, devis et sur-mesure.' },
  'appearance.notFound': { title: 'Page introuvable (404)', summary: 'Ce que voit un client qui arrive sur une adresse qui n’existe pas.' },

  // ----- Écrans admin -----
  'screen.dashboard': {
    title: 'Tableau de bord',
    summary: 'Votre point de départ : chiffres clés, commandes récentes et la liste des étapes pour ouvrir la boutique.',
    steps: ['Suivez la checklist de haut en bas : chaque étape se coche toute seule quand elle est faite.'],
  },
  'screen.revenue': { title: 'Revenus', summary: 'Chiffre d’affaires, nombre de commandes et panier moyen sur la période choisie.' },
  'screen.orders': {
    title: 'Commandes',
    summary: 'Toutes les commandes de vos clients, de la réception à la livraison.',
    steps: ['Ouvrez une commande pour voir le détail.', 'Changez son statut (confirmée, expédiée, livrée) : le client est prévenu par email.'],
    tips: ['Ajoutez le numéro de suivi à l’expédition : il est envoyé au client.'],
  },
  'screen.abandoned': {
    title: 'Paniers abandonnés',
    summary: 'Clients qui ont rempli un panier sans commander. Relancez-les par email ou WhatsApp pour récupérer la vente.',
    tips: ['Réservé au plan Pro.'],
  },
  'screen.customRequests': { title: 'Personnalisations', summary: 'Demandes de produits sur mesure ou de devis envoyées par vos clients depuis la vitrine.' },
  'screen.stock': { title: 'Stock', summary: 'Quantités disponibles par produit et par variante. Une alerte vous prévient quand un produit est presque épuisé.' },
  'screen.products': {
    title: 'Produits',
    summary: 'Votre catalogue : ajoutez, modifiez, masquez ou supprimez des produits.',
    steps: ['Cliquez sur « Nouveau produit ».', 'Ajoutez photos, prix, description et catégorie.', 'Renseignez le titre et la description SEO pour apparaître sur Google.'],
    tips: ['Les produits d’exemple (préfixe DEMO-) peuvent être supprimés en un clic.', 'La limite de produits dépend de votre plan.'],
  },
  'screen.categories': {
    title: 'Catégories',
    summary: 'Rangez vos produits par famille. Les catégories servent de filtres sur la boutique et de pages que Google peut référencer.',
    tips: ['Renseignez le titre et la description SEO de chaque catégorie.'],
  },
  'screen.attributes': { title: 'Attributs', summary: 'Tailles, couleurs, matières… Définissez-les une fois, puis réutilisez-les pour créer les variantes de vos produits.' },
  'screen.onlineStore': { title: 'Boutique en ligne', summary: 'Vue d’ensemble de votre vitrine et raccourcis vers l’apparence, les pages, la navigation et le bandeau.' },
  'screen.pages': {
    title: 'Pages',
    summary: 'Créez des pages (accueil, à propos, offre, mentions légales) en assemblant des blocs.',
    steps: ['Partez d’un modèle ou d’une page vide.', 'Ajoutez des blocs, vérifiez l’aperçu mobile.', 'Publiez : la page est visible sur la vitrine.'],
    tips: ['Les pages légales (CGV, confidentialité, retours) sont liées automatiquement dans le pied de page.'],
  },
  'screen.navigation': { title: 'Navigation', summary: 'Choisissez les liens du menu et du pied de page, et leur ordre.' },
  'screen.topBar': { title: 'Bandeau d’annonces', summary: 'Messages courts affichés tout en haut du site : livraison offerte, promotion, rentrée.' },
  'screen.onboarding': { title: 'Assistant de création', summary: 'Style, contact, premiers produits et publication en 4 étapes. Vous pouvez le relancer à tout moment.' },
  'screen.promoModals': { title: 'Pop-ups promo', summary: 'Fenêtres affichées aux visiteurs pour annoncer une offre ou collecter des emails.', tips: ['Ne multipliez pas les pop-ups : une seule à la fois suffit.'] },
  'screen.promoCodes': { title: 'Codes promo', summary: 'Créez des codes de réduction (pourcentage ou montant) avec dates de validité et limites d’usage.' },
  'screen.blog': {
    title: 'Blog',
    summary: 'Publiez des articles pour attirer des visiteurs depuis Google et présenter vos produits.',
    tips: ['Renseignez le titre et la description SEO de chaque article.', 'Vous pouvez programmer la date de publication.'],
  },
  'screen.leads': { title: 'Contacts (leads)', summary: 'Emails et messages laissés par les visiteurs (formulaire de contact, inscription, pop-ups).' },
  'screen.reviews': { title: 'Avis clients', summary: 'Modérez les avis avant leur affichage sur les fiches produit.' },
  'screen.webhooks': { title: 'Webhooks', summary: 'Envoyez automatiquement les événements de la boutique (nouvelle commande…) vers un autre outil.', tips: ['Réservé au plan Pro.'] },
  'screen.apiKeys': { title: 'Clés API', summary: 'Accès programmatique au catalogue et aux commandes pour des applications ou une vitrine sur mesure.', tips: ['Gardez vos clés secrètes ; révoquez toute clé exposée.', 'Réservé au plan Pro.'] },
  'screen.shipping': { title: 'Livraison', summary: 'Suivi des expéditions et transporteurs. Les frais et le seuil gratuit se règlent dans Réglages.', link: { label: 'Ouvrir Réglages', href: '/admin/reglages' } },
  'screen.members': { title: 'Équipe', summary: 'Invitez des collaborateurs et donnez à chacun un rôle (commandes, produits, contenu…).', tips: ['Le nombre de comptes dépend de votre plan.'] },
  'screen.audit': { title: 'Journal d’activité', summary: 'Qui a fait quoi et quand dans l’administration : connexions, modifications, suppressions.' },

  // ----- Pages / blocs -----
  pageBuilder: {
    title: 'Page builder (blocs)',
    summary: 'Composez vos pages en empilant des blocs : bannière, texte, produits, galerie, avis…',
    steps: [
      'Ajoutez un bloc depuis la palette.',
      'Cliquez dessus pour modifier son contenu et son style.',
      'Glissez pour réordonner, puis publiez.',
    ],
    tips: ['Utilisez l’aperçu mobile : plus de la moitié de vos clients commandent depuis un téléphone.'],
  },
  blocks: {
    title: 'Blocs',
    summary: 'Un bloc est une section de page prête à l’emploi. Chacun a ses propres champs (titre, image, bouton) et son style (couleurs, espacement).',
  },
};

/** Aide affichée à côté du titre de chaque écran admin (préfixe d'URL → sujet). */
export const ROUTE_HELP: Record<string, string> = {
  '/admin/dashboard': 'screen.dashboard',
  '/admin/revenus': 'screen.revenue',
  '/admin/commandes': 'screen.orders',
  '/admin/paniers-abandonnes': 'screen.abandoned',
  '/admin/personnalisations': 'screen.customRequests',
  '/admin/stock': 'screen.stock',
  '/admin/produits': 'screen.products',
  '/admin/categories': 'screen.categories',
  '/admin/attributs': 'screen.attributes',
  '/admin/boutique-en-ligne': 'screen.onlineStore',
  '/admin/pages': 'screen.pages',
  '/admin/sections': 'screen.navigation',
  '/admin/top-bar-messages': 'screen.topBar',
  '/admin/onboarding': 'screen.onboarding',
  '/admin/promo-modals': 'screen.promoModals',
  '/admin/codes-promo': 'screen.promoCodes',
  '/admin/blog': 'screen.blog',
  '/admin/leads': 'screen.leads',
  '/admin/avis': 'screen.reviews',
  '/admin/reseaux-sociaux': 'social',
  '/admin/webhooks': 'screen.webhooks',
  '/admin/api-keys': 'screen.apiKeys',
  '/admin/conformite': 'cndp',
  '/admin/livraison': 'screen.shipping',
  '/admin/membres': 'screen.members',
  '/admin/audit': 'screen.audit',
};

export function helpTopicForPath(pathname: string): string | undefined {
  const hit = Object.keys(ROUTE_HELP).find((p) => pathname === p || pathname.startsWith(p + '/'));
  return hit ? ROUTE_HELP[hit] : undefined;
}

export function getHelpTopic(key: string): HelpTopic | undefined {
  return HELP_TOPICS[key];
}
