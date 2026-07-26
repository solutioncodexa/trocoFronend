import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Footer links vitrine', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('colonnes footer personnalisées + navigation', async ({ page }) => {
    await page.goto('/boutique?tenant=maison-atlas');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 15_000 });
    await expect(footer.getByRole('heading', { name: 'Boutique' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Aide' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Tous les produits' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'FAQ' })).toBeVisible();

    await footer.getByRole('link', { name: 'Nous contacter' }).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('admin sections : onglet liens footer', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });

    await page.goto('/admin/sections');
    await expect(page.getByRole('tab', { name: /Liens pied de page/i })).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole('tab', { name: /Liens pied de page/i }).click();
    await expect(page.getByText(/Colonnes de liens|pied de page/i).first()).toBeVisible();
  });
});
