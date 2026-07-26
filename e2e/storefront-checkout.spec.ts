import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { seedCart } from './helpers/seedCart';

test.describe('Checkout vitrine', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await seedCart(page);
  });

  test('remplit le formulaire et confirme la commande', async ({ page }) => {
    await page.goto('/checkout?tenant=maison-atlas');
    await expect(page.getByRole('heading', { name: /Validation de votre Commande/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.locator('#fullname').fill('Youssef Atlas');
    await page.locator('#phone').fill('+212612345678');
    await page.locator('#email').fill('youssef@exemple.ma');
    await page.locator('#address').fill('12 Rue Atlas');
    await page.locator('#city').fill('Casablanca');

    await page.getByRole('button', { name: /Confirmer la commande/i }).click();

    await expect(page.getByRole('heading', { name: /Commande Confirmée/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Youssef Atlas/i).first()).toBeVisible();
  });

  test('panier affiche l’article seedé', async ({ page }) => {
    await page.goto('/panier?tenant=maison-atlas');
    await expect(page.getByText(/Sachet Kraft Atlas/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
