import { test, expect } from '@playwright/test';
import { mockMatjaronaApi } from './helpers/apiMock';
import { acceptCookies } from './helpers/consent';
import { seedCart } from './helpers/seedCart';

test.describe('WhatsApp Business boutique', () => {
  test.beforeEach(async ({ page }) => {
    await mockMatjaronaApi(page);
    await acceptCookies(page);
  });

  test('bouton flottant pointe vers le numéro de la boutique', async ({ page }) => {
    await page.goto('/?tenant=maison-atlas');
    const btn = page.getByRole('link', { name: /Contacter Maison Atlas/i });
    await expect(btn).toBeVisible({ timeout: 15_000 });
    await expect(btn).toHaveAttribute('href', /wa\.me\/212612345678/);
  });

  test('fiche produit : Commander sur WhatsApp', async ({ page }) => {
    await page.goto('/produit/1?tenant=maison-atlas');
    const cta = page.getByRole('link', { name: /Commander sur WhatsApp/i });
    await expect(cta).toBeVisible({ timeout: 15_000 });
    const href = await cta.getAttribute('href');
    expect(href).toMatch(/wa\.me\/212612345678/);
    expect(decodeURIComponent(href || '')).toMatch(/Sachet Kraft Atlas/i);
  });

  test('panier : Commander le panier sur WhatsApp', async ({ page }) => {
    await seedCart(page);
    await page.goto('/panier?tenant=maison-atlas');
    const cta = page.getByRole('link', { name: /Commander le panier sur WhatsApp/i });
    await expect(cta).toBeVisible({ timeout: 15_000 });
    await expect(cta).toHaveAttribute('href', /wa\.me\/212612345678/);
  });

  test('admin paramètres : guide WhatsApp Business', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel(/email/i).fill('admin@maison-atlas.test');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
    await expect(page).toHaveURL(/\/admin\/(dashboard|onboarding)/, { timeout: 15_000 });

    // WhatsApp est dans /admin/reglages (parametres = Apparence)
    await page.goto('/admin/reglages');
    await expect(page.getByRole('heading', { name: /WhatsApp Business/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Meta Business Suite/i)).toBeVisible();
    await expect(page.locator('#contactWhatsapp')).toBeVisible();
  });
});
