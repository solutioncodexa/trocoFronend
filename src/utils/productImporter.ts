import { categoriesApi } from '@/services/api/categories';
import { productsApi } from '@/services/api/products';
import { importSlug, type ImportRow } from '@/config/productImport';

export type ImportOutcome = { created: number; failures: { line: number; name: string; message: string }[] };

/**
 * Crée les catégories manquantes puis les produits, un par un (le serveur valide chaque produit). Une ligne en échec
 * n'arrête pas les suivantes. `defaultCategory` sert aux lignes sans catégorie.
 */
export async function runProductImport(
  rows: ImportRow[],
  defaultCategory: string,
  onProgress?: (done: number, total: number) => void,
): Promise<ImportOutcome> {
  const existing = await categoriesApi.getAllCategories();
  const bySlug = new Map(existing.map((c) => [c.slug, c.slug]));
  const byName = new Map(existing.map((c) => [c.name.trim().toLowerCase(), c.slug]));

  const slugFor = async (rawName: string): Promise<string> => {
    const name = rawName.trim() || defaultCategory;
    const known = byName.get(name.toLowerCase());
    if (known) return known;
    const wanted = importSlug(name) || `categorie-${byName.size + 1}`;
    // Même adresse, nom différent (ex. « Vêtements » / « Vetements ») : on réutilise la catégorie existante.
    if (bySlug.has(wanted)) {
      byName.set(name.toLowerCase(), wanted);
      return wanted;
    }
    const created = await categoriesApi.createCategory({ name, slug: wanted });
    bySlug.set(created.slug, created.slug);
    byName.set(name.toLowerCase(), created.slug);
    return created.slug;
  };

  const out: ImportOutcome = { created: 0, failures: [] };
  for (const [i, r] of rows.entries()) {
    try {
      const category = await slugFor(r.category);
      await productsApi.createProduct(
        {
          name: r.name,
          description: r.description,
          shortDescription: r.shortDescription,
          price: r.price as number,
          originalPrice: r.originalPrice,
          category,
          sku: r.sku,
          stockQuantity: r.stock ?? 0,
        },
        [],
      );
      out.created += 1;
    } catch (e) {
      out.failures.push({ line: r.line, name: r.name, message: e instanceof Error ? e.message.slice(0, 120) : '' });
    }
    onProgress?.(i + 1, rows.length);
  }
  return out;
}
