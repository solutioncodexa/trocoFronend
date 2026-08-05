import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { acceptCookies } from './helpers/consent';
import { seedCart } from './helpers/seedCart';

test.describe('Conversion vitrine (sticky, avis, upsell)', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await acceptCookies(page);
  });

  test('bandeau sticky CTA visible et masquable', async ({ page }) => {
    await page.goto('/boutique?tenant=maison-atlas');
    await page.evaluate(() => {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('troco_sticky_cta_dismiss_'))
        .forEach((k) => sessionStorage.removeItem(k));
    });
    await page.reload();

    const text = page.getByText(/Livraison gratuite dès 750 MAD/i);
    await expect(text).toBeVisible({ timeout: 15_000 });
    const banner = page.locator('[role="complementary"]').filter({ hasText: /Livraison gratuite/i });
    await expect(banner.getByRole('link', { name: /Voir la boutique/i })).toBeVisible();

    await banner.getByRole('button', { name: /Masquer/i }).click();
    await expect(text).toBeHidden();
  });

  test('fiche produit : avis publiés + formulaire', async ({ page }) => {
    await page.goto('/produit/1?tenant=maison-atlas');
    await expect(page.getByRole('heading', { name: /Avis clients/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Top qualité|Emballage parfait/i).first()).toBeVisible();
    await expect(page.getByText(/Nadia/i).first()).toBeVisible();

    await page.locator('#review-name').fill('Karim');
    await page.locator('#review-body').fill('Très bon produit, je recommande.');
    await page.getByRole('button', { name: /Envoyer mon avis/i }).click();
    await expect(page.getByText(/Merci|après validation/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('checkout : upsell « Souvent achetés ensemble »', async ({ page }) => {
    await seedCart(page);
    await page.goto('/checkout?tenant=maison-atlas');
    await expect(page.getByText(/Souvent achetés ensemble/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Boîte Cadeau Atlas/i).first()).toBeVisible();
  });

  test('fiche produit : produits fréquemment achetés', async ({ page }) => {
    await page.goto('/produit/1?tenant=maison-atlas');
    await expect(page.getByText(/Boîte Cadeau Atlas/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
