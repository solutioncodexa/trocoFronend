import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Landing Matjarona', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('affiche la marque et mène vers créer boutique', async ({ page }) => {
    await page.goto('/matjarona');
    await expect(page.getByText('Matjarona').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Créer ma boutique/i }).first()).toBeVisible();
    await expect(page.getByText(/150/)).toBeVisible();

    await page.getByRole('link', { name: /Créer ma boutique/i }).first().click();
    await expect(page).toHaveURL(/\/creer-boutique/);
    await expect(page.getByRole('heading', { name: /Créer ma boutique/i })).toBeVisible();
  });
});
