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

export const STARTER_PACKS: StarterPack[] = [
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

export function getStarterPack(key?: string | null): StarterPack {
  return (
    STARTER_PACKS.find((p) => p.key === key) ??
    STARTER_PACKS.find((p) => p.key === DEFAULT_STARTER_PACK_KEY)!
  );
}
