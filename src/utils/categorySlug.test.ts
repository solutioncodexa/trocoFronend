import { describe, it, expect } from 'vitest';

/** Miroir de la logique AdminProducts (slug catégorie inline). */
function generateCategorySlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function uniqueCategorySlug(base: string, existing: Set<string>) {
  let slug = base || 'categorie';
  if (!existing.has(slug)) return slug;
  let i = 2;
  while (existing.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

describe('categorySlug (création inline produit)', () => {
  it('normalise accents et espaces', () => {
    expect(generateCategorySlug('T-shirts Été')).toBe('t-shirts-ete');
  });

  it('garantit l’unicité du slug', () => {
    const used = new Set(['vetements', 'vetements-2']);
    expect(uniqueCategorySlug('vetements', used)).toBe('vetements-3');
  });
});
