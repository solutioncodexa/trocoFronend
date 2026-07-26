import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

test.describe('Création de boutique', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('slug auto + inscription + redirection admin', async ({ page }) => {
    await page.goto('/creer-boutique');

    await page.getByLabel(/Nom de la boutique/i).fill('Maison Atlas');
    await expect(page.getByLabel(/Adresse \(slug\)/i)).toHaveValue('maison-atlas');

    await page.getByLabel(/Email admin/i).fill('admin@maison-atlas.test');
    await page.getByLabel(/^Mot de passe$/i).fill('Password123!');

    await page.getByRole('button', { name: /Lancer ma boutique/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
  });
});
