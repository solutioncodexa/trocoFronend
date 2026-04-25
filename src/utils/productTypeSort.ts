import type { ProductTypeDTO } from '@/types/api';

/**
 * Priorité d’affichage des types de bijou (catégorie « ensemble » et sur-mesure) :
 * 1 — bracelet, gourmette, gourmet, chaîne
 * 2 — bague
 * 3 — sertie / sertla / serti
 * puis autres par nom.
 */
function productTypeRank(code: string): number {
  const c = code
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/(bracelet|gourmet|gourmette|chaine|chain)/.test(c)) return 1;
  if (/(bague|ring|anneau)/.test(c)) return 2;
  if (/(sertla|sertie|serti|sell)/.test(c)) return 3;
  if (/(collier|pendentif|necklace)/.test(c)) return 4;
  if (/(boucle|earring|creole)/.test(c)) return 5;
  return 50;
}

/** Tri pour la catégorie « ensemble » (et même logique sur-mesure quand style = ensemble). */
export function sortProductTypesForEnsemble(types: ProductTypeDTO[]): ProductTypeDTO[] {
  return [...types].sort((a, b) => {
    const ra = productTypeRank(a.code);
    const rb = productTypeRank(b.code);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name, 'fr');
  });
}

export function sortProductTypesForDisplay(
  types: ProductTypeDTO[],
  categorySlug: string | null
): ProductTypeDTO[] {
  if (categorySlug === 'ensemble') {
    return sortProductTypesForEnsemble(types);
  }
  return [...types].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}
