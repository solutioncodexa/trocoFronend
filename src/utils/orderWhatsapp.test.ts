import { describe, expect, it } from 'vitest';
import { buildOrderConfirmationMessage } from './orderWhatsapp';

describe('WhatsApp darija', () => {
  const input = {
    storeName: 'Maison Atlas',
    customerName: 'Sara',
    items: [{ name: 'Tajine', quantity: 1 }],
    total: '189 MAD',
    city: 'Fès',
  };

  it('rédige la confirmation en darija latine', () => {
    const text = buildOrderConfirmationMessage({ ...input, lang: 'darija' });
    expect(text).toContain('Salam Sara');
    expect(text).toContain('Wesletna commande');
    expect(text).toContain('Fès');
  });

  it('rédige la confirmation en darija arabe', () => {
    const text = buildOrderConfirmationMessage({ ...input, lang: 'darija-ar' });
    expect(text).toContain('وصلاتنا الطلبية');
    expect(text).toContain('السلام Sara');
  });
});
