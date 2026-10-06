import { describe, expect, it } from 'vitest';
import { STARTER_PACKS } from './starterPacks';
import { STYLE_FOR_SECTOR, getStylePreset } from './stylePresets';
import { createStoreMessages } from '@/i18n/createStoreMessages';

describe('starterPacks', () => {
  it('chaque produit référence une catégorie du pack, avec des slugs uniques', () => {
    for (const pack of STARTER_PACKS) {
      const slugs = pack.categories.map((c) => c.slug);
      expect(new Set(slugs).size, pack.key).toBe(slugs.length);
      for (const p of pack.products) {
        expect(slugs, `${pack.key}/${p.name}`).toContain(p.category);
        expect(p.price).toBeGreaterThan(0);
        if (p.originalPrice) expect(p.originalPrice).toBeGreaterThan(p.price);
      }
    }
  });

  it('chaque secteur a un style conseillé existant et un libellé fr / en / ar', () => {
    for (const pack of STARTER_PACKS) {
      expect(getStylePreset(STYLE_FOR_SECTOR[pack.key]), pack.key).toBeDefined();
      for (const lang of ['fr', 'en', 'ar'] as const) {
        const msgs = createStoreMessages[lang] as Record<string, string>;
        expect(msgs[`sector.${pack.key}`]?.length, `${pack.key}:${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('propose des secteurs marocains', () => {
    const keys = STARTER_PACKS.map((p) => p.key);
    expect(keys).toEqual(expect.arrayContaining(['artisanat', 'traditionnel', 'naturel', 'patisserie']));
  });
});
