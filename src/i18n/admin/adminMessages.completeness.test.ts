import { describe, expect, it } from 'vitest';
import { adminMessages, type AdminMessageKey } from './adminMessages';

describe('adminMessages completeness', () => {
  it('has the same keys for fr, ar, en', () => {
    const frKeys = Object.keys(adminMessages.fr).sort();
    const arKeys = Object.keys(adminMessages.ar).sort();
    const enKeys = Object.keys(adminMessages.en).sort();
    expect(arKeys).toEqual(frKeys);
    expect(enKeys).toEqual(frKeys);
  });

  it('has non-empty translations for every key', () => {
    const keys = Object.keys(adminMessages.fr) as AdminMessageKey[];
    for (const key of keys) {
      expect(adminMessages.fr[key]?.trim().length, `fr:${key}`).toBeGreaterThan(0);
      expect(adminMessages.ar[key]?.trim().length, `ar:${key}`).toBeGreaterThan(0);
      expect(adminMessages.en[key]?.trim().length, `en:${key}`).toBeGreaterThan(0);
    }
  });
});
