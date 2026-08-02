import { describe, it, expect } from 'vitest';
import { messages, type MessageKey, type StoreLocale } from './messages';

const LOCALES: StoreLocale[] = ['fr', 'ar', 'en'];

describe('i18n messages completeness', () => {
  it('chaque locale a exactement les mêmes clés', () => {
    const frKeys = Object.keys(messages.fr).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(messages[locale]).sort()).toEqual(frKeys);
    }
  });

  it('aucune traduction vide (fr / ar / en)', () => {
    const frKeys = Object.keys(messages.fr) as MessageKey[];
    const gaps: string[] = [];
    for (const key of frKeys) {
      for (const locale of LOCALES) {
        const value = messages[locale][key];
        if (typeof value !== 'string' || !value.trim()) {
          gaps.push(`${locale}.${key}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('arabe lisible (pas de mojibake)', () => {
    expect(messages.ar.home).toBe('الرئيسية');
    expect(messages.ar.shop).toBe('المتجر');
    expect(messages.ar.contactUs).toBe('اتصل بنا');
    // UTF-8 mal lu en latin1 produit souvent Ø / Ã
    expect(messages.ar.home).not.toMatch(/Ø|Ã|ø/);
  });
});
