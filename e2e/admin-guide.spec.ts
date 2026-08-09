import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';

async function loginAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin');
  await page.locator('#email').fill('admin@maison-atlas.test');
  await page.locator('#password').fill('Password123!');
  await page.getByRole('button', { name: /se connecter/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
}

test.describe('Guide 1ère utilisation admin', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
  });

  test('affiche le guide au login puis le masque après Terminer', async ({ page }) => {
    await loginAdmin(page);

    // FR par défaut (locale admin)
    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toBeVisible({
      timeout: 10_000,
    });

    for (let i = 0; i < 15; i += 1) {
      const terminer = page.getByRole('button', { name: /^(terminer|finish|إنهاء)$/i });
      if (await terminer.isVisible().catch(() => false)) {
        await terminer.click();
        break;
      }
      await page.getByRole('button', { name: /^(suivant|next|التالي)$/i }).click();
    }

    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toHaveCount(0, {
      timeout: 10_000,
    });

    await page.reload();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toHaveCount(0, {
      timeout: 5_000,
    });
  });

  test('relance via Guide d’utilisation dans le menu', async ({ page }) => {
    await loginAdmin(page);

    await expect(page.getByRole('button', { name: /^(passer|skip|تخطي)$/i })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole('button', { name: /^(passer|skip|تخطي)$/i }).click();
    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toHaveCount(0);

    await page.getByRole('button', { name: /guide d.utilisation|user guide|دليل الاستخدام/i }).click();
    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toBeVisible();
  });

  test('affiche le guide en anglais après changement de langue', async ({ page }) => {
    await loginAdmin(page);
    await expect(page.getByRole('heading', { name: /Bienvenue dans votre back-office/i })).toBeVisible({
      timeout: 10_000,
    });

    // Sélecteur FR/AR/EN dans le dialogue (le modal bloque le header)
    await page.getByRole('dialog').getByRole('button', { name: /^English$/i }).click();

    await expect(page.getByRole('heading', { name: /Welcome to your back office/i })).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByRole('button', { name: /^next$/i })).toBeVisible();
  });
});
