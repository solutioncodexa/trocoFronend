import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { acceptCookies } from './helpers/consent';

test.describe('Paniers abandonnés', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await acceptCookies(page);
  });

  test('lien recover restaure le panier', async ({ page }) => {
    await page.goto('/panier?tenant=maison-atlas&recover=recover-demo-token');
    await expect(page.getByText(/Sachet Kraft Atlas/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/restauré|panier/i).first()).toBeVisible();
  });

  test('admin liste les paniers abandonnés', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/(dashboard|onboarding)/, { timeout: 15_000 });

    await page.goto('/admin/paniers-abandonnes');
    await expect(page.getByText(/Sara Demo|client@exemple\.ma/i).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Abandonné/i).first()).toBeVisible();
  });
});
