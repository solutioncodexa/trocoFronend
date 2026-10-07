import type { StoreThemeKey } from '@/config/storeThemes';

/** Préfixe SKU des produits d'exemple : permet de les retrouver et de les supprimer en un clic. */
export const DEMO_SKU_PREFIX = 'DEMO-';

export type StarterProduct = {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  /** Slug de la catégorie (doit exister dans `categories` du pack). */
  category: string;
  badges?: Array<'new' | 'bestseller' | 'promo'>;
  stockQuantity?: number;
};

export type StarterPack = {
  key: string;
  label: string;
  description: string;
  /** Thème vitrine conseillé pour ce secteur. */
  suggestedTheme: StoreThemeKey;
  categories: Array<{ name: string; slug: string; description: string }>;
  products: StarterProduct[];
};

export const DEFAULT_STARTER_PACK_KEY = 'general';

const ALL_PACKS: StarterPack[] = [
  {
    key: 'mode',
    label: 'Mode & vêtements',
    description: 'Prêt-à-porter, accessoires, chaussures.',
    suggestedTheme: 'elegant',
    categories: [
      { name: 'Vêtements', slug: 'vetements', description: 'Hauts, bas et tenues de saison.' },
      { name: 'Accessoires', slug: 'accessoires-mode', description: 'Sacs, ceintures et petits accessoires.' },
    ],
    products: [
      { name: 'T-shirt coton premium', shortDescription: 'Coupe droite, 100 % coton.', description: 'T-shirt en coton épais et doux, coupe droite et finitions soignées. Un basique à porter en toute saison.', price: 149, category: 'vetements', badges: ['bestseller'] },
      { name: 'Chemise en lin', shortDescription: 'Légère et respirante.', description: 'Chemise en lin léger, idéale pour les journées chaudes. Col classique, manches longues retroussables.', price: 289, originalPrice: 349, category: 'vetements', badges: ['promo'] },
      { name: 'Robe fluide d’été', shortDescription: 'Longueur midi, taille élastiquée.', description: 'Robe fluide à imprimé discret, taille élastiquée pour un maintien confortable. Se porte de la plage à la ville.', price: 329, category: 'vetements', badges: ['new'] },
      { name: 'Sac cabas en cuir', shortDescription: 'Grand format, fermeture zippée.', description: 'Cabas en cuir grainé avec poche intérieure zippée. Assez grand pour un ordinateur 13 pouces.', price: 549, category: 'accessoires-mode', badges: ['bestseller'] },
      { name: 'Ceinture cuir tressé', shortDescription: 'Boucle métal brossé.', description: 'Ceinture en cuir tressé avec boucle en métal brossé. Ajustable, disponible pour toutes les tailles.', price: 119, category: 'accessoires-mode' },
      { name: 'Foulard imprimé', shortDescription: 'Soie mélangée, 90 × 90 cm.', description: 'Foulard carré en soie mélangée, motif graphique. Se porte au cou, dans les cheveux ou sur un sac.', price: 99, category: 'accessoires-mode', badges: ['new'] },
    ],
  },
  {
    key: 'beaute',
    label: 'Beauté & cosmétiques',
    description: 'Soins, maquillage, parfums.',
    suggestedTheme: 'minimal',
    categories: [
      { name: 'Soins visage', slug: 'soins-visage', description: 'Nettoyants, sérums et crèmes.' },
      { name: 'Corps & cheveux', slug: 'corps-cheveux', description: 'Huiles, gommages et soins capillaires.' },
    ],
    products: [
      { name: 'Sérum éclat vitamine C', shortDescription: 'Flacon 30 ml.', description: 'Sérum concentré en vitamine C pour un teint lumineux. Application matin et soir avant la crème.', price: 219, category: 'soins-visage', badges: ['bestseller'] },
      { name: 'Crème hydratante 24 h', shortDescription: 'Pot 50 ml, tous types de peau.', description: 'Crème hydratante à texture légère, non grasse. Hydrate en profondeur pendant 24 heures.', price: 169, category: 'soins-visage' },
      { name: 'Nettoyant doux moussant', shortDescription: 'Tube 150 ml.', description: 'Gel nettoyant doux qui élimine impuretés et maquillage sans dessécher la peau.', price: 89, originalPrice: 119, category: 'soins-visage', badges: ['promo'] },
      { name: 'Huile d’argan pure', shortDescription: 'Flacon verre 50 ml.', description: 'Huile d’argan 100 % pure, pressée à froid. Nourrit la peau, les cheveux et les ongles.', price: 129, category: 'corps-cheveux', badges: ['bestseller'] },
      { name: 'Gommage corps au sucre', shortDescription: 'Pot 250 g.', description: 'Gommage au sucre et à l’huile d’amande douce pour une peau douce et nette dès la première utilisation.', price: 99, category: 'corps-cheveux', badges: ['new'] },
      { name: 'Masque capillaire réparateur', shortDescription: 'Pot 200 ml.', description: 'Masque nourrissant aux huiles végétales pour cheveux secs ou abîmés. Laisser poser 10 minutes.', price: 119, category: 'corps-cheveux' },
    ],
  },
  {
    key: 'alimentation',
    label: 'Alimentation & épicerie fine',
    description: 'Produits du terroir, épices, douceurs.',
    suggestedTheme: 'classic',
    categories: [
      { name: 'Épicerie salée', slug: 'epicerie-salee', description: 'Huiles, épices et conserves.' },
      { name: 'Douceurs', slug: 'douceurs', description: 'Miels, confitures et pâtisseries.' },
    ],
    products: [
      { name: 'Huile d’olive vierge extra 1 L', shortDescription: 'Première pression à froid.', description: 'Huile d’olive vierge extra issue d’une première pression à froid. Goût fruité, idéale en assaisonnement.', price: 89, category: 'epicerie-salee', badges: ['bestseller'] },
      { name: 'Mélange d’épices ras el hanout', shortDescription: 'Sachet 100 g.', description: 'Mélange traditionnel d’épices pour tajines, couscous et viandes. Moulu à la commande.', price: 39, category: 'epicerie-salee' },
      { name: 'Olives vertes marinées', shortDescription: 'Bocal 500 g.', description: 'Olives vertes marinées aux herbes et au citron confit, en bocal verre.', price: 45, category: 'epicerie-salee', badges: ['new'] },
      { name: 'Miel d’oranger 500 g', shortDescription: 'Récolte locale.', description: 'Miel d’oranger crémeux et parfumé, récolté localement, sans additif.', price: 99, category: 'douceurs', badges: ['bestseller'] },
      { name: 'Confiture de figues', shortDescription: 'Pot 320 g.', description: 'Confiture artisanale de figues, cuite lentement en petits chaudrons.', price: 55, originalPrice: 65, category: 'douceurs', badges: ['promo'] },
      { name: 'Assortiment de pâtisseries', shortDescription: 'Boîte de 12 pièces.', description: 'Boîte de 12 pâtisseries aux amandes et au miel, préparées le jour même.', price: 149, category: 'douceurs' },
    ],
  },
  {
    key: 'maison',
    label: 'Maison & déco',
    description: 'Décoration, textile, art de la table.',
    suggestedTheme: 'elegant',
    categories: [
      { name: 'Décoration', slug: 'decoration', description: 'Objets déco, bougies et vases.' },
      { name: 'Art de la table', slug: 'art-de-la-table', description: 'Vaisselle, verres et linge de table.' },
    ],
    products: [
      { name: 'Vase en céramique artisanale', shortDescription: 'Hauteur 25 cm.', description: 'Vase en céramique façonné et émaillé à la main. Chaque pièce est unique.', price: 249, category: 'decoration', badges: ['bestseller'] },
      { name: 'Bougie parfumée cire naturelle', shortDescription: '180 g, 40 h de combustion.', description: 'Bougie en cire végétale parfumée au bois de cèdre, dans un pot en verre réutilisable.', price: 129, category: 'decoration', badges: ['new'] },
      { name: 'Coussin tissé main', shortDescription: '45 × 45 cm, housse amovible.', description: 'Coussin en coton tissé à la main, housse amovible et lavable, garnissage inclus.', price: 179, category: 'decoration' },
      { name: 'Set de 4 assiettes', shortDescription: 'Grès émaillé, Ø 22 cm.', description: 'Quatre assiettes plates en grès émaillé, compatibles lave-vaisselle et four micro-ondes.', price: 299, originalPrice: 359, category: 'art-de-la-table', badges: ['promo'] },
      { name: 'Verres à thé (lot de 6)', shortDescription: 'Verre coloré, 15 cl.', description: 'Six verres à thé en verre coloré, aux motifs dorés. Parfaits pour le service traditionnel.', price: 139, category: 'art-de-la-table', badges: ['bestseller'] },
      { name: 'Nappe en lin', shortDescription: '150 × 250 cm.', description: 'Nappe en lin lavé, texture naturelle et finitions ourlées. Résiste aux lavages fréquents.', price: 259, category: 'art-de-la-table' },
    ],
  },
  {
    key: 'electronique',
    label: 'High-tech & accessoires',
    description: 'Audio, chargeurs, accessoires mobiles.',
    suggestedTheme: 'bold',
    categories: [
      { name: 'Audio', slug: 'audio', description: 'Écouteurs, casques et enceintes.' },
      { name: 'Accessoires mobiles', slug: 'accessoires-mobiles', description: 'Chargeurs, câbles et coques.' },
    ],
    products: [
      { name: 'Écouteurs sans fil Bluetooth', shortDescription: 'Autonomie 24 h avec boîtier.', description: 'Écouteurs Bluetooth 5.3 avec réduction de bruit, boîtier de charge et autonomie de 24 heures.', price: 349, category: 'audio', badges: ['bestseller'] },
      { name: 'Enceinte portable étanche', shortDescription: 'IPX7, 12 h d’autonomie.', description: 'Enceinte Bluetooth compacte et étanche, son puissant, jusqu’à 12 heures d’écoute.', price: 449, originalPrice: 529, category: 'audio', badges: ['promo'] },
      { name: 'Casque audio filaire', shortDescription: 'Coussinets mousse, jack 3,5 mm.', description: 'Casque circum-aural avec micro intégré, confortable pour de longues sessions.', price: 199, category: 'audio' },
      { name: 'Chargeur rapide 30 W', shortDescription: 'USB-C, compatible tous mobiles.', description: 'Chargeur mural USB-C 30 W avec protection surtension, compatible smartphones et tablettes.', price: 129, category: 'accessoires-mobiles', badges: ['new'] },
      { name: 'Câble USB-C tressé 2 m', shortDescription: 'Charge et synchronisation.', description: 'Câble USB-C tressé renforcé, 2 mètres, charge rapide et transfert de données.', price: 59, category: 'accessoires-mobiles', badges: ['bestseller'] },
      { name: 'Batterie externe 10 000 mAh', shortDescription: 'Deux ports USB, écran LED.', description: 'Batterie externe compacte 10 000 mAh avec deux ports USB et affichage du niveau de charge.', price: 189, category: 'accessoires-mobiles' },
    ],
  },
  {
    key: "artisanat",
    label: "Artisanat marocain",
    description: "Poterie, zellige, cuir, tapis et cuivre faits main.",
    suggestedTheme: "elegant",
    categories: [
      { name: "Poterie & zellige", slug: "poterie-zellige", description: "Tajines, plats et pièces en zellige." },
      { name: "Cuir & textile", slug: "cuir-textile", description: "Babouches, poufs, tapis et couvertures." },
      { name: "Cuivre & décoration", slug: "cuivre-decoration", description: "Lanternes, plateaux à thé et objets déco." },
    ],
    products: [
      { name: "Tajine en terre cuite décoré", shortDescription: "Ø 30 cm, fait main à Safi.", description: "Tajine en terre cuite émaillée et peint à la main. Convient à la cuisson et au service à table.", price: 189, category: "poterie-zellige", badges: ["bestseller"] },
      { name: "Plat en zellige fait main", shortDescription: "Ø 25 cm, motifs géométriques.", description: "Plat décoratif en mosaïque de zellige taillée à la main à Fès. Chaque pièce est unique.", price: 249, category: "poterie-zellige", badges: ["new"] },
      { name: "Babouches en cuir véritable", shortDescription: "Semelle cuir, plusieurs couleurs.", description: "Babouches traditionnelles en cuir tanné, cousues main. Disponibles en jaune, blanc et couleurs vives.", price: 169, category: "cuir-textile", badges: ["bestseller"] },
      { name: "Pouf en cuir tressé", shortDescription: "Rempli, Ø 50 cm.", description: "Pouf en cuir de chèvre tressé à la main, livré rempli. Parfait pour le salon ou la chambre.", price: 399, category: "cuir-textile" },
      { name: "Tapis berbère en laine", shortDescription: "120 × 180 cm, tissé main.", description: "Tapis berbère en pure laine, tissé à la main dans l’Atlas. Motifs losanges, chaleureux et résistant.", price: 1290, category: "cuir-textile", badges: ["new"] },
      { name: "Lanterne en cuivre ajouré", shortDescription: "H 35 cm, pour bougie.", description: "Lanterne marocaine en cuivre ciselé qui projette de beaux jeux de lumière. Bougie non incluse.", price: 219, category: "cuivre-decoration", badges: ["bestseller"] },
      { name: "Plateau à thé en cuivre martelé", shortDescription: "Ø 45 cm.", description: "Grand plateau à thé en cuivre martelé et gravé, idéal pour le service traditionnel.", price: 349, originalPrice: 429, category: "cuivre-decoration", badges: ["promo"] },
    ],
  },
  {
    key: "traditionnel",
    label: "Tenues traditionnelles",
    description: "Caftans, takchitas, djellabas et gandouras.",
    suggestedTheme: "elegant",
    categories: [
      { name: "Caftans & takchitas", slug: "caftans-takchitas", description: "Tenues de fête et de mariage." },
      { name: "Djellabas & gandouras", slug: "djellabas-gandouras", description: "Tenues du quotidien, femme et homme." },
    ],
    products: [
      { name: "Caftan brodé main", shortDescription: "Satin, broderie sfifa.", description: "Caftan en satin avec broderies sfifa faites main. Ceinture assortie incluse. Sur mesure possible.", price: 1490, category: "caftans-takchitas", badges: ["bestseller"] },
      { name: "Takchita deux pièces perlée", shortDescription: "Dessous + dessus, perles.", description: "Takchita deux pièces ornée de perles et de passementerie, pour mariages et grandes occasions.", price: 2290, category: "caftans-takchitas", badges: ["new"] },
      { name: "Caftan moderne en satin", shortDescription: "Coupe droite, manches larges.", description: "Caftan simple et élégant en satin fluide, pour les invitations et les fêtes en famille.", price: 790, originalPrice: 990, category: "caftans-takchitas", badges: ["promo"] },
      { name: "Djellaba femme à capuche", shortDescription: "Tissu léger, broderie discrète.", description: "Djellaba confortable à capuche, fermeture zippée et petites broderies sur le devant.", price: 590, category: "djellabas-gandouras", badges: ["bestseller"] },
      { name: "Gandoura d’été", shortDescription: "Coton léger, mi-manches.", description: "Gandoura légère et respirante pour les journées chaudes, facile à porter et à entretenir.", price: 290, category: "djellabas-gandouras" },
      { name: "Djellaba homme en laine", shortDescription: "Capuche, coupe classique.", description: "Djellaba pour homme en laine épaisse, parfaite pour l’hiver, finitions soignées.", price: 690, category: "djellabas-gandouras" },
      { name: "Ensemble jabador homme", shortDescription: "Veste + pantalon, coton.", description: "Ensemble jabador deux pièces, tenue idéale pour le vendredi et les fêtes religieuses.", price: 450, category: "djellabas-gandouras", badges: ["new"] },
    ],
  },
  {
    key: "naturel",
    label: "Cosmétiques naturels & hammam",
    description: "Argan, savon beldi, ghassoul, eaux florales.",
    suggestedTheme: "minimal",
    categories: [
      { name: "Argan & huiles", slug: "argan-huiles", description: "Huiles pures pour la peau et les cheveux." },
      { name: "Hammam & soins", slug: "hammam-soins", description: "Savon beldi, ghassoul, gommages et henné." },
    ],
    products: [
      { name: "Huile d’argan cosmétique", shortDescription: "Flacon verre 50 ml.", description: "Huile d’argan 100 % pure pressée à froid par une coopérative. Peau, cheveux et ongles.", price: 129, category: "argan-huiles", badges: ["bestseller"] },
      { name: "Huile de nigelle (Habba Sawda)", shortDescription: "Flacon 100 ml.", description: "Huile de graines de nigelle pressée à froid, usage externe pour la peau et les cheveux.", price: 89, category: "argan-huiles" },
      { name: "Savon beldi à l’eucalyptus", shortDescription: "Pot 200 g.", description: "Savon noir beldi à l’huile d’olive et à l’eucalyptus, pour le hammam avec le gant kessa.", price: 49, category: "hammam-soins", badges: ["bestseller"] },
      { name: "Ghassoul (rhassoul) naturel", shortDescription: "Sachet 250 g.", description: "Argile naturelle de l’Atlas pour le visage, le corps et les cheveux. À délayer à l’eau de rose.", price: 59, category: "hammam-soins", badges: ["new"] },
      { name: "Eau de rose de Kelaa M’Gouna", shortDescription: "Flacon 250 ml.", description: "Eau de rose distillée, tonique doux pour le visage et parfum naturel.", price: 69, originalPrice: 79, category: "hammam-soins", badges: ["promo"] },
      { name: "Coffret hammam (savon, kessa, ghassoul)", shortDescription: "Coffret cadeau.", description: "Coffret hammam : savon beldi, gant kessa, ghassoul et eau de rose. Idéal en cadeau.", price: 189, category: "hammam-soins" },
    ],
  },
  {
    key: "patisserie",
    label: "Pâtisseries & traiteur",
    description: "Gâteaux marocains, plateaux et commandes sur mesure.",
    suggestedTheme: "classic",
    categories: [
      { name: "Pâtisseries marocaines", slug: "patisseries-marocaines", description: "Cornes de gazelle, chebakia, sellou et plus." },
      { name: "Plateaux & traiteur", slug: "plateaux-traiteur", description: "Plateaux de fêtes, briouates et plats préparés." },
    ],
    products: [
      { name: "Cornes de gazelle (500 g)", shortDescription: "Amandes et fleur d’oranger.", description: "Cornes de gazelle fourrées à la pâte d’amande, préparées le jour même.", price: 120, category: "patisseries-marocaines", badges: ["bestseller"] },
      { name: "Chebakia au miel (500 g)", shortDescription: "Sésame et miel.", description: "Chebakia croustillante au sésame et au miel, spécialité du Ramadan.", price: 85, category: "patisseries-marocaines" },
      { name: "Sellou (Slilou) 500 g", shortDescription: "Amandes, sésame, farine grillée.", description: "Sellou traditionnel aux amandes et au sésame, riche en énergie.", price: 110, category: "patisseries-marocaines", badges: ["new"] },
      { name: "Plateau de gâteaux assortis", shortDescription: "30 pièces.", description: "Assortiment de 30 pâtisseries marocaines pour mariages, aïd et réceptions. Commande 48 h à l’avance.", price: 390, originalPrice: 450, category: "plateaux-traiteur", badges: ["promo"] },
      { name: "Briouates salées (lot de 20)", shortDescription: "Poulet ou kefta.", description: "Briouates dorées au poulet ou à la kefta, à réchauffer au four. Commande 24 h à l’avance.", price: 160, category: "plateaux-traiteur", badges: ["bestseller"] },
      { name: "Pastilla au poulet (6 personnes)", shortDescription: "Amandes et cannelle.", description: "Pastilla au poulet et aux amandes, feuilletée et parfumée, prête à réchauffer.", price: 220, category: "plateaux-traiteur" },
    ],
  },
  {
    key: 'general',
    label: 'Boutique généraliste',
    description: 'Un petit catalogue polyvalent pour démarrer.',
    suggestedTheme: 'classic',
    categories: [
      { name: 'Nouveautés', slug: 'nouveautes', description: 'Les derniers arrivages.' },
      { name: 'Idées cadeaux', slug: 'idees-cadeaux', description: 'Pour offrir ou se faire plaisir.' },
    ],
    products: [
      { name: 'Produit exemple A', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 149, category: 'nouveautes', badges: ['new'] },
      { name: 'Produit exemple B', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 199, category: 'nouveautes', badges: ['bestseller'] },
      { name: 'Produit exemple C', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 249, originalPrice: 299, category: 'nouveautes', badges: ['promo'] },
      { name: 'Coffret cadeau exemple', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 299, category: 'idees-cadeaux' },
      { name: 'Carte cadeau exemple', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 100, category: 'idees-cadeaux' },
      { name: 'Édition limitée exemple', shortDescription: 'Remplacez-moi par votre produit.', description: 'Ceci est un produit d’exemple. Modifiez son nom, sa description, son prix et ajoutez vos photos depuis l’admin.', price: 399, category: 'idees-cadeaux', badges: ['new'] },
    ],
  },
];

/** Secteurs marocains en tête des sélecteurs (création de boutique, onboarding). */
const MOROCCAN_FIRST = ['artisanat', 'traditionnel', 'naturel', 'patisserie'];
export const STARTER_PACKS: StarterPack[] = [
  ...MOROCCAN_FIRST.map((k) => ALL_PACKS.find((p) => p.key === k)).filter((p): p is StarterPack => !!p),
  ...ALL_PACKS.filter((p) => !MOROCCAN_FIRST.includes(p.key)),
];

export function getStarterPack(key?: string | null): StarterPack {
  return (
    STARTER_PACKS.find((p) => p.key === key) ??
    STARTER_PACKS.find((p) => p.key === DEFAULT_STARTER_PACK_KEY)!
  );
}
