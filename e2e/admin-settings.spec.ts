import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Paramètres boutique admin', () => {
  test('accès paramètres après login', async ({ page }) => {
    await mockMatjaronaApi(page);
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });

    await page.goto('/admin/parametres');
    await expect(page.getByText(/paramètres|boutique|domaine|branding|apparence/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
