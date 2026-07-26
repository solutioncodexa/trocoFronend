import { describe, it, expect } from 'vitest';
import {
  applyWhatsAppTemplate,
  buildCartWhatsAppMessage,
  buildProductWhatsAppMessage,
  buildWhatsAppMessageUrl,
  resolveStoreWhatsAppNumber,
} from './whatsappOrder';
import type { CartItem } from '@/types/product';

describe('whatsappOrder', () => {
  it('extrait les chiffres depuis +212 / wa.me', () => {
    expect(resolveStoreWhatsAppNumber('+212 6 12 34 56 78')).toBe('212612345678');
    expect(resolveStoreWhatsAppNumber('https://wa.me/212600000001')).toBe('212600000001');
    expect(resolveStoreWhatsAppNumber(null, '0699887766')).toBe('0699887766');
    expect(resolveStoreWhatsAppNumber(null, '06 99 88 77 66')).toBe('0699887766');
    expect(resolveStoreWhatsAppNumber(null, null)).toBeNull();
  });

  it('préfère contactWhatsapp au téléphone', () => {
    expect(resolveStoreWhatsAppNumber('+212611111111', '+212622222222')).toBe('212611111111');
  });

  it('construit l’URL wa.me avec message', () => {
    const url = buildWhatsAppMessageUrl('212611111111', 'Bonjour {test}');
    expect(url).toBe(
      `https://wa.me/212611111111?text=${encodeURIComponent('Bonjour {test}')}`,
    );
  });

  it('applique le modèle produit', () => {
    const msg = buildProductWhatsAppMessage(
      'Sachet Kraft',
      'https://shop.test/p/1',
      'Je veux {productName} → {url}',
    );
    expect(msg).toBe('Je veux Sachet Kraft → https://shop.test/p/1');
  });

  it('utilise le fallback si template vide', () => {
    expect(applyWhatsAppTemplate('  ', { productName: 'X', url: 'Y' })).toContain('X');
    expect(applyWhatsAppTemplate(null, { productName: 'X', url: 'Y' })).toContain('Y');
  });

  it('résume le panier pour WhatsApp', () => {
    const items: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Sachet',
          description: '',
          price: 10,
          images: [],
          category: 'sachets',
          inStock: true,
          stockQuantity: 5,
          badges: [],
          createdAt: '2026-01-01',
        },
        quantity: 2,
        selectedSize: 'M',
      },
    ];
    const msg = buildCartWhatsAppMessage(items, 20);
    expect(msg).toContain('Sachet');
    expect(msg).toContain('x2');
    expect(msg).toMatch(/Total/i);
  });
});
