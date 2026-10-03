/**
 * Modifier ou supprimer l'existant (produits, catégories). Logique pure, sans réseau.
 */
export type ManageKind = 'product' | 'category';

export const MAX_CHOICES = 8;

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Éléments correspondant à la saisie : le nom exact d'abord, sinon ceux qui le contiennent. */
export function matchItems<T extends { label: string }>(items: T[], query: string): T[] {
  const q = fold(query);
  if (!q) return [];
  const exact = items.filter((i) => fold(i.label) === q);
  return exact.length > 0 ? exact : items.filter((i) => fold(i.label).includes(q));
}

/** Stock : entier de 0 à 1 000 000. */
export function parseStockCount(v: string): number | null {
  const t = v.trim();
  if (!/^\d{1,7}$/.test(t)) return null;
  const n = Number(t);
  return n <= 1_000_000 ? n : null;
}

/** Nom de catégorie : 2 à 80 caractères. */
export const validCategoryName = (v: string) => v.trim().length >= 2 && v.trim().length <= 80;

/** Un produit avec de vrais choix (taille, couleur…) se modifie dans l'écran Produits. */
export const hasRealVariants = (
  variants?: { attributeValue?: string; attributes?: unknown[] }[] | null,
): boolean => (variants ?? []).some((v) => v.attributeValue?.trim() || (v.attributes && v.attributes.length > 0));

/** Prix d'origine conservé seulement s'il reste supérieur au nouveau prix. */
export const keepOriginalPrice = (original: number | undefined, price: number) =>
  original !== undefined && original > price ? original : undefined;
