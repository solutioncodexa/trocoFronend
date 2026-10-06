import { categoriesApi } from '@/services/api/categories';
import { productsApi } from '@/services/api/products';
import { DEMO_SKU_PREFIX, getStarterPack } from '@/config/starterPacks';
import { localizeStarterPack } from '@/config/starterPacks.ar';

export type StarterPackResult = {
  categoriesCreated: number;
  productsCreated: number;
};

/**
 * Crée (sans doublon) les catégories puis les produits d'exemple du secteur choisi.
 * Les produits portent un SKU `DEMO-…` pour pouvoir être retirés ensuite.
 */
export async function applyStarterPack(packKey: string, lang?: string | null): Promise<StarterPackResult> {
  const pack = localizeStarterPack(getStarterPack(packKey), lang);

  const existingCategories = await categoriesApi.getAllCategories();
  const knownSlugs = new Set(existingCategories.map((c) => c.slug));
  let categoriesCreated = 0;
  for (const cat of pack.categories) {
    if (knownSlugs.has(cat.slug)) continue;
    await categoriesApi.createCategory(cat);
    knownSlugs.add(cat.slug);
    categoriesCreated += 1;
  }

  const existingDemo = await listDemoProducts();
  const knownDemoNames = new Set(existingDemo.map((p) => p.name));
  let productsCreated = 0;
  for (const [index, p] of pack.products.entries()) {
    if (knownDemoNames.has(p.name)) continue;
    await productsApi.createProduct(
      {
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        sku: `${DEMO_SKU_PREFIX}${pack.key.toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
        stockQuantity: p.stockQuantity ?? 20,
        badges: p.badges,
      },
      [],
    );
    productsCreated += 1;
  }

  return { categoriesCreated, productsCreated };
}

/** Produits d'exemple présents dans le catalogue (SKU `DEMO-…`). */
export async function listDemoProducts() {
  const page = await productsApi.getAllProducts({ page: 0, size: 200 });
  return page.content.filter((p) => p.sku?.startsWith(DEMO_SKU_PREFIX));
}

/** Supprime tous les produits d'exemple ; retourne le nombre supprimé. */
export async function removeDemoProducts(): Promise<number> {
  const demo = await listDemoProducts();
  const errors: string[] = [];
  let removed = 0;
  for (const p of demo) {
    try {
      await productsApi.deleteProduct(p.id);
      removed += 1;
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message : 'erreur';
      errors.push(`${p.name} : ${msg}`);
    }
  }
  if (errors.length > 0) {
    throw new Error(
      removed > 0
        ? `${removed} supprimé(s). Échec : ${errors.slice(0, 3).join(' · ')}`
        : errors.slice(0, 3).join(' · '),
    );
  }
  return removed;
}
