import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Super Admin plateforme', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('login + dashboard + liste fournisseurs', async ({ page }) => {
    await page.goto('/super-admin');
    await page.locator('input[type="email"]').fill('superadmin@matjarona.ma');
    await page.locator('input[type="password"]').fill('SuperAdmin1234');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();

    await expect(page).toHaveURL(/\/super-admin\/(dashboard)?/, { timeout: 15_000 });

    await page.goto('/super-admin/fournisseurs');
    await expect(page.getByText(/Maison Atlas|fournisseur|boutique/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
