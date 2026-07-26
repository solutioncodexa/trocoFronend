import type { Page } from '@playwright/test';

/** Panier localStorage minimal pour les parcours checkout E2E. */
export async function seedCart(page: Page) {
  await page.addInitScript(() => {
    const cart = [
      {
        product: {
          id: '1',
          name: 'Sachet Kraft Atlas',
          description: 'Sachet kraft premium',
          price: 12.5,
          images: ['/uploads/demo.png'],
          category: 'sachets',
          inStock: true,
          stockQuantity: 40,
          badges: [],
          createdAt: new Date().toISOString(),
        },
        quantity: 1,
        selectedVariantId: '1',
      },
    ];
    localStorage.setItem('cart', JSON.stringify(cart));
  });
}
