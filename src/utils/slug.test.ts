import { describe, expect, it } from 'vitest';
import { nameKey, slugify, splitNames, transliterateArabic } from './slug';
import { suggestSubcategories } from '@/config/catalogTemplates';

describe('slug', () => {
  it('translittère l’arabe au lieu de produire un slug vide', () => {
    expect(transliterateArabic('قفطان')).toBe('qftan');
    expect(slugify('قفاطين')).toMatch(/^[a-z0-9-]+$/);
    expect(slugify('قفاطين').length).toBeGreaterThan(2);
    expect(slugify('Caftans & Takchitas')).toBe('caftans-takchitas');
    expect(slugify('Épices à tajine')).toBe('epices-a-tajine');
  });

  it('reconnaît un même nom malgré la casse, les accents et les diacritiques arabes', () => {
    expect(nameKey('Théières')).toBe(nameKey('theieres'));
    expect(nameKey('قَفْطَان')).toBe(nameKey('قفطان'));
  });

  it('découpe une saisie multiple (virgule arabe incluse) et supprime les doublons', () => {
    expect(splitNames('Robes, caftans،Sacs\nrobes ; Djellabas|Sacs')).toEqual(['Robes', 'caftans', 'Sacs', 'Djellabas']);
    expect(splitNames('  ,, ')).toEqual([]);
  });
});

describe('suggestSubcategories', () => {
  it('propose les sous-catégories du modèle, dans la langue du parent', () => {
    expect(suggestSubcategories('Femme')).toContain('Caftans');
    expect(suggestSubcategories('femme')).toContain('Djellabas');
    expect(suggestSubcategories('نساء')).toContain('جلابيب');
    expect(suggestSubcategories('Women')).toContain('Kaftans');
  });
  it('ne propose rien pour un nom inconnu ou trop court', () => {
    expect(suggestSubcategories('Zzzzzz')).toEqual([]);
    expect(suggestSubcategories('a')).toEqual([]);
  });
});
