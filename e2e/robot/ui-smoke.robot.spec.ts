import { test, expect } from '@playwright/test';
import { ACCOUNTS } from './helpers/accounts';
import { uiAdminLogin, uiSuperAdminLogin } from './helpers/adminUi';
import { apiHealth } from './helpers/liveApi';

/**
 * Robot UI — smoke parcours navigateur sur stack live (front :4200 + API :8080).
 */
test.describe('Robot UI — smoke', () => {
  test.beforeAll(async ({ request }) => {
    test.skip(!(await apiHealth(request)), 'Backend API inaccessible sur :8080');
  });

  test('landing Matjarona affiche les plans', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Matjarona|Basic|79|199|399/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('login admin Basic → dashboard', async ({ page }) => {
    await uiAdminLogin(page, ACCOUNTS.basic.email, ACCOUNTS.basic.password);
    await expect(page.getByText(/tableau de bord|dashboard|commandes|produits/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('vitrine Basic accessible (?tenant=basic)', async ({ page }) => {
    await page.goto('/?tenant=basic');
    await expect(page.locator('body')).toBeVisible();
    // Pas d'erreur JS ProductCard
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/boutique?tenant=basic');
    await page.waitForTimeout(1500);
    expect(errors.filter((e) => /ProductCard|already been declared/i.test(e))).toEqual([]);
  });

  test('PDP Basic charge sans SyntaxError ProductCard', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/boutique?tenant=basic');
    const link = page.locator('a[href*="/produit/"]').first();
    if (await link.count()) {
      await link.click();
      await page.waitForTimeout(2000);
    } else {
      await page.goto('/produit/1?tenant=basic');
      await page.waitForTimeout(2000);
    }
    expect(errors.filter((e) => /ProductCard|already been declared/i.test(e)), errors.join('\n')).toEqual([]);
  });

  test('login Super Admin → console', async ({ page }) => {
    await uiSuperAdminLogin(page, ACCOUNTS.superAdmin.email, ACCOUNTS.superAdmin.password);
    await expect(page.getByText(/boutiques|fournisseurs|packs|plateforme/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('login Pro → dashboard', async ({ page }) => {
    await uiAdminLogin(page, ACCOUNTS.pro.email, ACCOUNTS.pro.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 20_000 });
  });

  test('login Business → dashboard', async ({ page }) => {
    await uiAdminLogin(page, ACCOUNTS.business.email, ACCOUNTS.business.password);
    await expect(page).toHaveURL(/\/admin/, { timeout: 20_000 });
  });

  test('checkout UI Basic: panier → formulaire (smoke)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/boutique?tenant=basic');
    const productLink = page.locator('a[href*="/produit/"]').first();
    await expect(productLink).toBeVisible({ timeout: 20_000 });
    await productLink.click();
    await page.waitForTimeout(1500);
    expect(errors.filter((e) => /already been declared/i.test(e))).toEqual([]);
    const addBtn = page.getByRole('button', { name: /ajouter|panier|acheter/i }).first();
    if (await addBtn.count()) {
      await addBtn.click();
      await page.waitForTimeout(800);
      await page.goto('/panier?tenant=basic');
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
