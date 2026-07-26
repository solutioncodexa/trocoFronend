import type { Product } from '@/types/product';
import type { StoreThemeKey } from '@/config/storeThemes';

export type DemoCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
};

const IMG = {
  bag: 'https://images.unsplash.com/photo-1590874103328-eac38a683073?w=800&h=1000&fit=crop&q=80',
  box: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=1000&fit=crop&q=80',
  candle: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=1000&fit=crop&q=80',
  ceramic: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=1000&fit=crop&q=80',
  textile: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=1000&fit=crop&q=80',
  jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop&q=80',
  vase: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=1000&fit=crop&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=1000&fit=crop&q=80',
  desk: 'https://images.unsplash.com/photo-1611269151860-8b2d2d6a0f8f?w=800&h=1000&fit=crop&q=80',
  plant: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=1000&fit=crop&q=80',
  heroClassic: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&h=1400&fit=crop&q=85',
  heroMinimal: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=2000&h=1400&fit=crop&q=85',
  heroBold: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=2000&h=1400&fit=crop&q=85',
  heroElegant: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&h=1400&fit=crop&q=85',
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  { id: 'c1', name: 'Nouveautés', slug: 'nouveautes', image: IMG.bag, count: 12 },
  { id: 'c2', name: 'Maison', slug: 'maison', image: IMG.ceramic, count: 28 },
  { id: 'c3', name: 'Mode', slug: 'mode', image: IMG.textile, count: 34 },
  { id: 'c4', name: 'Cadeaux', slug: 'cadeaux', image: IMG.box, count: 19 },
  { id: 'c5', name: 'Édition limitée', slug: 'edition', image: IMG.jewelry, count: 8 },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Sac cabas lin naturel',
    description:
      'Cabas en lin lavé, anses cuir végétal. Idéal quotidien ou week-end. Doublure coton, poche intérieure.',
    shortDescription: 'Lin lavé · anses cuir',
    price: 389,
    originalPrice: 450,
    images: [IMG.bag, IMG.textile],
    category: 'mode',
    sku: 'DEMO-BAG-01',
    inStock: true,
    stockQuantity: 14,
    badges: ['promo', 'bestseller'],
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'demo-2',
    name: 'Coffret découverte artisan',
    description: 'Sélection de 4 produits signature dans un écrin kraft personnalisable au nom du destinataire.',
    shortDescription: 'Cadeau prêt à offrir',
    price: 520,
    images: [IMG.box],
    category: 'cadeaux',
    sku: 'DEMO-BOX-02',
    inStock: true,
    stockQuantity: 22,
    badges: ['new'],
    createdAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'demo-3',
    name: 'Bougie cire de soja — Ambre',
    description: 'Bougie coulée à la main, mèche coton, 45 h de combustion. Parfum ambre & bois de rose.',
    shortDescription: '45 h · cire soja',
    price: 165,
    images: [IMG.candle],
    category: 'maison',
    sku: 'DEMO-CND-03',
    inStock: true,
    stockQuantity: 40,
    badges: ['bestseller'],
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'demo-4',
    name: 'Vase céramique émaillée',
    description: 'Pièce unique tournée à la main. Émail mat ivoire, base teintée. Hauteur 28 cm.',
    shortDescription: 'Pièce artisanale',
    price: 740,
    images: [IMG.vase, IMG.ceramic],
    category: 'maison',
    sku: 'DEMO-VAS-04',
    inStock: true,
    stockQuantity: 6,
    badges: ['new'],
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'demo-5',
    name: 'Étole cachemire douce',
    description: '100 % cachemire peigné. Finitions ourlets discrets. Disponible en 3 teintes.',
    shortDescription: 'Cachemire peigné',
    price: 890,
    originalPrice: 990,
    images: [IMG.textile],
    category: 'mode',
    sku: 'DEMO-SCL-05',
    inStock: true,
    stockQuantity: 11,
    badges: ['promo'],
    createdAt: '2026-04-18T10:00:00Z',
  },
  {
    id: 'demo-6',
    name: 'Collier chaîne fine or',
    description: 'Plaqué or 18k, fermoir coulissant. Longueur réglable 40–45 cm. Hypoallergénique.',
    shortDescription: 'Plaqué or 18k',
    price: 320,
    images: [IMG.jewelry],
    category: 'edition',
    sku: 'DEMO-JWL-06',
    inStock: true,
    stockQuantity: 18,
    badges: ['bestseller'],
    createdAt: '2026-03-09T10:00:00Z',
  },
  {
    id: 'demo-7',
    name: 'Lampe à poser opaline',
    description: 'Abat-jour opaline soufflée, pied laiton brossé. Ampoule LED incluse (2700 K).',
    shortDescription: 'Opaline & laiton',
    price: 1180,
    images: [IMG.lamp],
    category: 'maison',
    sku: 'DEMO-LMP-07',
    inStock: false,
    stockQuantity: 0,
    badges: [],
    createdAt: '2026-02-14T10:00:00Z',
  },
  {
    id: 'demo-8',
    name: 'Plante Monstera + cache-pot',
    description: 'Monstera deliciosa en pot terre cuite émaillé. Livraison soignée dans le Grand Casablanca.',
    shortDescription: 'Plante + cache-pot',
    price: 275,
    images: [IMG.plant],
    category: 'nouveautes',
    sku: 'DEMO-PLT-08',
    inStock: true,
    stockQuantity: 9,
    badges: ['new'],
    createdAt: '2026-07-10T10:00:00Z',
  },
];

export const DEMO_HERO_BY_THEME: Record<StoreThemeKey, string> = {
  classic: IMG.heroClassic,
  minimal: IMG.heroMinimal,
  bold: IMG.heroBold,
  elegant: IMG.heroElegant,
};

export const DEMO_FAQS = [
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Casablanca / Rabat : 24–48 h. Autres villes du Maroc : 2–4 jours ouvrés.',
  },
  {
    q: 'Puis-je retourner un article ?',
    a: 'Oui, sous 14 jours si l’article est intact et dans son emballage d’origine.',
  },
  {
    q: 'Proposez-vous le sur-mesure ?',
    a: 'Oui — décrivez votre besoin via la page Sur-mesure, nous vous répondons sous 24 h.',
  },
  {
    q: 'Quels moyens de paiement ?',
    a: 'Paiement à la livraison, carte bancaire et virement (selon votre configuration boutique).',
  },
];

export function getDemoProduct(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function filterDemoProducts(opts: {
  category?: string | null;
  keyword?: string | null;
  inStockOnly?: boolean;
}): Product[] {
  let list = [...DEMO_PRODUCTS];
  if (opts.category) {
    list = list.filter((p) => p.category === opts.category);
  }
  if (opts.keyword?.trim()) {
    const q = opts.keyword.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  if (opts.inStockOnly) {
    list = list.filter((p) => p.inStock);
  }
  return list;
}
