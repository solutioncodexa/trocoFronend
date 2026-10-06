import { describe, expect, it } from 'vitest';
import {
  ACTIVITIES,
  ACTIVITY_TREES,
  categoryOptions,
  checkPhotos,
  localizeTree,
  parseStock,
  planCategoryCreation,
  slugify,
  uniqueSlug,
  validDescription,
  validProductName,
  type CatNode,
} from './catalogTemplates';

const allNodes = (nodes: CatNode[]): CatNode[] => nodes.flatMap((n) => [n, ...allNodes(n.children ?? [])]);

describe('catalogTemplates', () => {
  it('chaque modèle est traduit en fr, en et ar, sans doublon d’identifiant', () => {
    const ids = new Set<string>();
    for (const a of ACTIVITIES) {
      for (const node of allNodes(ACTIVITY_TREES[a])) {
        for (const lang of ['fr', 'en', 'ar'] as const) {
          expect(node.names[lang]?.trim().length, `${node.id}:${lang}`).toBeGreaterThan(0);
        }
        expect(ids.has(node.id), `doublon ${node.id}`).toBe(false);
        ids.add(node.id);
        expect(slugify(node.id)).toBe(node.id);
      }
    }
  });

  it('localise l’arbre dans la langue demandée', () => {
    expect(localizeTree('fashion', 'fr')[0].name).toBe('Femme');
    expect(localizeTree('fashion', 'en')[0].name).toBe('Women');
    expect(localizeTree('fashion', 'ar')[0].name).toBe('نساء');
    expect(localizeTree('fashion', 'fr')[0].children.length).toBeGreaterThan(0);
  });

  it('slugifie sans accents ni caractères spéciaux, et gère les slugs déjà pris', () => {
    expect(slugify('Robes d’été & Caftans !')).toBe('robes-dete-caftans');
    expect(slugify('نساء')).not.toBe(''); // translittéré, jamais vide
    expect(uniqueSlug('robes', new Set(['robes', 'robes-2']))).toBe('robes-3');
    expect(uniqueSlug('', new Set())).toBe('categorie');
  });

  it('planifie : parents avant enfants, réutilise les catégories existantes', () => {
    const plan = planCategoryCreation(
      [
        { key: 'femme-robes', name: 'Robes', parentKey: 'femme' },
        { key: 'femme', name: 'Femme', parentKey: null },
        { key: 'homme', name: 'Homme', parentKey: null },
      ],
      [{ id: 7, slug: 'homme' }],
    );
    expect(plan.toCreate.map((c) => c.key)).toEqual(['femme', 'femme-robes']);
    expect(plan.reuse).toEqual({ homme: 7 });
  });

  it('relancer l’assistant ne recrée pas ce qui existe déjà', () => {
    const plan = planCategoryCreation(
      [{ key: 'femme', name: 'Femme', parentKey: null }],
      [{ id: 3, slug: 'femme' }],
    );
    expect(plan.toCreate).toEqual([]);
    expect(plan.reuse).toEqual({ femme: 3 });
  });

  it('une catégorie personnalisée en arabe reçoit un slug valide et unique', () => {
    const plan = planCategoryCreation(
      [
        { key: 'custom:1', name: 'نساء', parentKey: null },
        { key: 'custom:2', name: 'رجال', parentKey: null },
      ],
      [],
    );
    const slugs = plan.toCreate.map((c) => c.slug);
    expect(slugs.every((s) => /^[a-z0-9-]+$/.test(s) && s.length > 1)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('un enfant dont le parent n’est pas sélectionné est rattaché à la racine', () => {
    const plan = planCategoryCreation([{ key: 'femme-robes', name: 'Robes', parentKey: 'femme' }], []);
    expect(plan.toCreate).toEqual([{ key: 'femme-robes', name: 'Robes', slug: 'femme-robes', parentKey: null }]);
  });

  it('liste les catégories avec libellé Parent › Enfant, sans les désactivées', () => {
    const opts = categoryOptions([
      { id: 1, slug: 'femme', name: 'Femme' },
      { id: 2, slug: 'femme-robes', name: 'Robes', parentId: 1 },
      { id: 3, slug: 'homme', name: 'Homme', active: false },
    ]);
    expect(opts).toEqual([
      { slug: 'femme', label: 'Femme' },
      { slug: 'femme-robes', label: 'Femme › Robes' },
    ]);
  });

  it('valide les champs d’un article', () => {
    expect(validProductName('Ab')).toBe(false);
    expect(validProductName('Caftan')).toBe(true);
    expect(validDescription('   ')).toBe(false);
    expect(validDescription('Belle pièce')).toBe(true);
    expect(parseStock('12')).toBe(12);
    expect(parseStock('0')).toBe(0);
    expect(parseStock('-1')).toBeNull();
    expect(parseStock('1.5')).toBeNull();
    expect(parseStock('abc')).toBeNull();
  });

  it('contrôle les photos : type image, 10 Mo max, 8 au plus', () => {
    const ok = { type: 'image/png', size: 1000 };
    expect(checkPhotos([ok])).toBe(true);
    expect(checkPhotos([])).toBe(false);
    expect(checkPhotos([{ type: 'application/pdf', size: 10 }])).toBe(false);
    expect(checkPhotos([{ type: 'image/png', size: 11 * 1024 * 1024 }])).toBe(false);
    expect(checkPhotos(Array.from({ length: 9 }, () => ok))).toBe(false);
  });
});
