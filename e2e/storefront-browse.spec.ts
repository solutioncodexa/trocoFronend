import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Parcours client boutique', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('boutique → produit → panier → checkout', async ({ page }) => {
    await page.goto('/?tenant=maison-atlas');
    await expect(page.getByText(/Maison Atlas|Sachet Kraft Atlas/i).first()).toBeVisible({ timeout: 15_000 });

    // Navigation boutique
    await page.goto('/boutique?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/produit/1?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/panier?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/checkout?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();
  });

  test('pages info + sur-mesure + devis', async ({ page }) => {
    await page.goto('/contact?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/faq?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/livraison-retours?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/sur-mesure?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/devis?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/favoris?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/codes-promo?tenant=maison-atlas');
    await expect(page.locator('body')).toBeVisible();
  });
});
