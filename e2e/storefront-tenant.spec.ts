import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Storefront multi-tenant', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('charge la boutique via ?tenant=', async ({ page }) => {
    await page.goto('/?tenant=maison-atlas');

    // La boutique (pas la landing Matjarona) doit afficher le nom du store
    await expect(page.getByText(/Maison Atlas|Emballage premium|Sachet Kraft Atlas/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
