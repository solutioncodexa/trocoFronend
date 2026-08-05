import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { acceptCookies } from './helpers/consent';

test.describe('Mega menu vitrine', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await acceptCookies(page);
  });

  test('navigation desktop : items mega-menu + sous-liens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/boutique?tenant=maison-atlas');

    const nav = page.getByRole('navigation', { name: /Navigation principale/i });
    await expect(nav).toBeVisible({ timeout: 15_000 });
    const emballages = nav.locator('span').filter({ hasText: /^Emballages$/ });
    await expect(emballages).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();

    await emballages.hover();
    const sachets = nav.getByRole('link', { name: 'Sachets kraft' });
    await expect(sachets).toBeVisible();
    await sachets.click();
    await expect(page).toHaveURL(/keyword=kraft/i);
  });

  test('admin sections globales charge le mega-menu', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/(dashboard|onboarding)/, { timeout: 15_000 });

    await page.goto('/admin/sections');
    // Label UI : « Menus » (ex. Mega menu)
    await expect(page.getByRole('tab', { name: /Menus|Mega menu/i })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('tab', { name: /Menus|Mega menu/i }).click();
    await expect(page.getByText(/Remplace|sous-liens|mega-menu|Menu principal/i).first()).toBeVisible();
  });
});
