import { describe, expect, it } from 'vitest';
import { formatPhone, isValidPhone, normalizePhone, whatsappDigits } from './phone';

describe('phone', () => {
  it('ramène toutes les écritures marocaines à +212…', () => {
    for (const raw of ['06 12 34 56 78', '0612345678', '+212612345678', '+212 6 12 34 56 78', '00212612345678', '612345678', '+212 (0)612345678']) {
      expect(normalizePhone(raw), raw).toBe('+212612345678');
    }
  });
  it('valide / refuse', () => {
    expect(isValidPhone('0712345678')).toBe(true);
    expect(isValidPhone('+33 6 12 34 56 78')).toBe(true);
    expect(isValidPhone('0912345678')).toBe(false); // 09… n'existe pas au Maroc
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
  it('formate et prépare wa.me', () => {
    expect(formatPhone('0612345678')).toBe('+212 6 12 34 56 78');
    expect(whatsappDigits('06 12 34 56 78')).toBe('212612345678');
    expect(whatsappDigits('12')).toBeNull();
  });
});
