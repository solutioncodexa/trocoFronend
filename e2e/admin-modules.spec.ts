import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

async function loginAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin');
  await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
  await page.locator('input[type="password"]').fill('Password123!');
  await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
}

const adminRoutes = [
  '/admin/dashboard',
  '/admin/produits',
  '/admin/commandes',
  '/admin/personnalisations',
  '/admin/categories',
  '/admin/accueil-categories',
  '/admin/produits-selectionnes',
  '/admin/top-bar-messages',
  '/admin/promo-modals',
  '/admin/codes-promo',
  '/admin/stock',
  '/admin/revenus',
  '/admin/reseaux-sociaux',
  '/admin/membres',
  '/admin/audit',
  '/admin/parametres',
  '/admin/pages',
  '/admin/sections',
  '/admin/webhooks',
  '/admin/blog',
  '/admin/leads',
  '/admin/avis',
  '/admin/paniers-abandonnes',
];

test.describe('Modules admin boutique', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await loginAdmin(page);
  });

  for (const route of adminRoutes) {
    test(`charge ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      await expect(page.locator('body')).not.toBeEmpty();
      // Pas de redirection forcée vers login
      await expect(page).not.toHaveURL(/\/admin$/);
    });
  }
});
