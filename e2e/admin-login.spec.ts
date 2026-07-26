import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Connexion admin', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('login admin boutique → dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('#password, input[type="password"]').first().fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
  });

  test('login super admin → console plateforme', async ({ page }) => {
    await page.goto('/super-admin');
    const email = page.getByLabel(/email/i);
    if (await email.count()) {
      await email.fill('superadmin@matjarona.ma');
    } else {
      await page.locator('input[type="email"]').fill('superadmin@matjarona.ma');
    }
    await page.locator('input[type="password"]').fill('SuperAdmin1234');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/super-admin/, { timeout: 15_000 });
  });
});
