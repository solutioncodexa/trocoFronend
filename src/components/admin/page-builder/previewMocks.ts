import type { CategoryCardDTO } from '@/types/api';
import type { Product } from '@/types/product';

/** Images SVG inline — pas de dépendance réseau pour l’atelier. */
function mockImg(label: string, from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="640" height="800" fill="url(#g)"/>
  <text x="50%" y="52%" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="36" font-weight="600" opacity="0.9">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function mockProducts(limit = 8): Product[] {
  const catalog = [
    { name: 'Sac artisan', price: 349, from: '#0F766E', to: '#134E4A' },
    { name: 'Vase terre cuite', price: 189, from: '#B45309', to: '#78350F' },
    { name: 'Coussin lin', price: 129, from: '#64748B', to: '#334155' },
    { name: 'Lampe laiton', price: 459, from: '#A16207', to: '#713F12' },
    { name: 'Plateau bois', price: 219, from: '#78716C', to: '#44403C' },
    { name: 'Bougie parfumée', price: 89, from: '#9F1239', to: '#4C0519' },
    { name: 'Miroir ovale', price: 529, from: '#0E7490', to: '#164E63' },
    { name: 'Tapis berbère', price: 799, from: '#BE123C', to: '#881337' },
  ];
  return catalog.slice(0, Math.max(1, Math.min(limit, catalog.length))).map((item, i) => ({
    id: `mock-product-${i + 1}`,
    name: item.name,
    description: 'Exemple pour prévisualiser votre page',
    price: item.price,
    images: [mockImg(item.name.split(' ')[0] ?? 'Demo', item.from, item.to)],
    category: 'demo',
    inStock: true,
    stockQuantity: 10,
    badges: i === 0 ? (['new'] as Product['badges']) : [],
    createdAt: new Date().toISOString(),
  }));
}

export function mockCategories(limit = 4): CategoryCardDTO[] {
  const catalog = [
    { name: 'Nouveautés', slug: 'nouveautes', from: '#0F766E', to: '#115E59' },
    { name: 'Maison', slug: 'maison', from: '#B45309', to: '#92400E' },
    { name: 'Mode', slug: 'mode', from: '#9F1239', to: '#881337' },
    { name: 'Cadeaux', slug: 'cadeaux', from: '#1D4ED8', to: '#1E3A8A' },
  ];
  return catalog.slice(0, Math.max(1, Math.min(limit, catalog.length))).map((item, i) => ({
    id: -(i + 1),
    name: item.name,
    slug: item.slug,
    parentId: null,
    heroImageUrl: mockImg(item.name, item.from, item.to),
  }));
}

export const MOCK_TESTIMONIALS = [
  { name: 'Sara B.', text: 'Livraison rapide et produits magnifiques.', role: 'Casablanca' },
  { name: 'Youssef K.', text: 'Service client au top, je recommande.', role: 'Rabat' },
];

export const MOCK_FAQ = [
  { q: 'Quels délais de livraison ?', a: '24–48 h à Casablanca, 2–4 jours ailleurs.' },
  { q: 'Puis-je retourner un article ?', a: 'Oui, sous 14 jours.' },
];

export const MOCK_INSTAGRAM = [
  mockImg('1', '#0F766E', '#134E4A'),
  mockImg('2', '#B45309', '#78350F'),
  mockImg('3', '#64748B', '#334155'),
  mockImg('4', '#9F1239', '#4C0519'),
  mockImg('5', '#0E7490', '#164E63'),
  mockImg('6', '#A16207', '#713F12'),
];
