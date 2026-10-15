import { DEMO_HERO_BY_THEME, IMG, type DemoCategory } from '@/demo/mockCatalog';
import { getStarterPack, type StarterPack } from '@/config/starterPacks';
import { localizeStarterPack } from '@/config/starterPacks.ar';
import type { StoreThemeKey } from '@/config/storeThemes';
import type { Product } from '@/types/product';

/** Photos d'illustration par secteur (les packs de démarrage n'ont pas d'images). */
const SECTOR_IMAGES: Record<string, string[]> = {
  mode: [IMG.bag, IMG.textile, IMG.jewelry, IMG.box],
  beaute: [IMG.candle, IMG.vase, IMG.box, IMG.jewelry],
  artisanat: [IMG.ceramic, IMG.textile, IMG.jewelry, IMG.vase],
  traditionnel: [IMG.textile, IMG.ceramic, IMG.jewelry, IMG.lamp],
  alimentation: [IMG.box, IMG.ceramic, IMG.plant, IMG.candle],
  patisserie: [IMG.box, IMG.ceramic, IMG.candle, IMG.plant],
  electronique: [IMG.desk, IMG.lamp, IMG.box, IMG.bag],
  maison: [IMG.lamp, IMG.vase, IMG.plant, IMG.candle],
  naturel: [IMG.plant, IMG.candle, IMG.vase, IMG.ceramic],
  general: [IMG.bag, IMG.box, IMG.lamp, IMG.ceramic],
};

export type TemplateMock = {
  products: Product[];
  categories: DemoCategory[];
  tagline: string;
  heroImageUrl: string;
};

/** Boutique d'exemple d'un secteur : vrais noms de produits, prix et catégories, avec photos, pour juger un modèle rempli. */
export function buildTemplateMock(sector: string, themeKey: StoreThemeKey, locale?: string | null): TemplateMock {
  const pack: StarterPack = localizeStarterPack(getStarterPack(sector), locale);
  const images = SECTOR_IMAGES[sector] ?? SECTOR_IMAGES.general;

  const products: Product[] = pack.products.map((p, i) => ({
    id: `mock-${sector}-${i}`,
    name: p.name,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    originalPrice: p.originalPrice,
    images: [images[i % images.length], images[(i + 1) % images.length]],
    category: p.category,
    sku: `MOCK-${i}`,
    inStock: true,
    stockQuantity: 12,
    badges: p.badges ?? [],
    createdAt: '2026-06-01T10:00:00Z',
  }));

  const categories: DemoCategory[] = pack.categories.map((c, i) => ({
    id: `mock-cat-${i}`,
    name: c.name,
    slug: c.slug,
    image: images[i % images.length],
    count: products.filter((p) => p.category === c.slug).length,
  }));

  return { products, categories, tagline: pack.description, heroImageUrl: DEMO_HERO_BY_THEME[themeKey] };
}
