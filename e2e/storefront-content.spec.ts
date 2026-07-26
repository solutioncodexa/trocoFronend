import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Contenu vitrine (blog, sitemap)', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('liste blog + article', async ({ page }) => {
    await page.goto('/blog?tenant=maison-atlas');
    await expect(page.getByRole('heading', { name: /Guide emballage/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.goto('/blog/guide-emballage?tenant=maison-atlas');
    await expect(page.getByRole('heading', { name: /Guide emballage/i })).toBeVisible();
    await expect(page.getByText(/Contenu article de démo/i)).toBeVisible();
  });

  test('admin pages charge la liste', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });

    await page.goto('/admin/pages');
    await expect(page.getByText(/Pages|Accueil A|Templates/i).first()).toBeVisible({ timeout: 15_000 });
  });

  test('admin webhooks empty state', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });

    await page.goto('/admin/webhooks');
    await expect(page.getByText(/Aucun webhook|Nouveau webhook|Zapier/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
