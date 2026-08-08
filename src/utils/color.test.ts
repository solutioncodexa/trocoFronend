import { describe, it, expect } from 'vitest';
import { hexToHslComponents } from './color';

describe('hexToHslComponents', () => {
  it('convertit le teal Get STORE', () => {
    expect(hexToHslComponents('#0F766E')).toMatch(/^\d+ \d+% \d+%$/);
  });

  it('accepte sans #', () => {
    expect(hexToHslComponents('C2410C')).not.toBeNull();
  });

  it('accepte le format court #RGB', () => {
    expect(hexToHslComponents('#fff')).toBe('0 0% 100%');
  });

  it('rejette les valeurs invalides', () => {
    expect(hexToHslComponents('')).toBeNull();
    expect(hexToHslComponents('#ffff')).toBeNull();
    expect(hexToHslComponents('not-a-color')).toBeNull();
  });
});
