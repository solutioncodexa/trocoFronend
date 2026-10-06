import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { seedCart } from './helpers/seedCart';

test.describe('Lot marché', () => {
  test('le checkout met le paiement à la livraison en avant', async ({ page }) => {
    await mockMatjaronaApi(page);
    await seedCart(page);
    await page.goto('/checkout?tenant=maison-atlas');
    await expect(page.getByText('Recommandé').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Payez en espèces/i).first()).toBeVisible();
  });

  test('la vitrine passe en RTL quand la langue est l’arabe', async ({ page }) => {
    await mockMatjaronaApi(page);
    await page.goto('/?tenant=maison-atlas&lang=ar');
    await expect.poll(async () => page.locator('html').getAttribute('dir')).toBe('rtl');
  });
});
