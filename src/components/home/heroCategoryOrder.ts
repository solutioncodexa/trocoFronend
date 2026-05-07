import type { CategoryDTO } from '@/types/api';

/** Mélange Fisher–Yates (copie). */
function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Catégories hero : ordre explicite (heroSortOrder défini) d’abord, puis celles en « ordre auto »
 * (heroSortOrder null) dans un ordre aléatoire à chaque calcul.
 */
export function orderHeroCategoriesForDisplay(categories: CategoryDTO[]): CategoryDTO[] {
  const explicit = categories
    .filter((c) => c.heroSortOrder != null)
    .sort(
      (a, b) =>
        (a.heroSortOrder! - b.heroSortOrder!) || a.name.localeCompare(b.name, 'fr')
    );
  const auto = shuffle(categories.filter((c) => c.heroSortOrder == null));
  return [...explicit, ...auto];
}
