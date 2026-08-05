import { expect, type Page } from '@playwright/test';

export async function uiAdminLogin(page: Page, email: string, password: string) {
  await page.goto('/admin');
  await page.locator('input[type="email"], #email').first().fill(email);
  await page.locator('input[type="password"], #password').first().fill(password);
  await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
  await expect(page).toHaveURL(/\/admin(\/dashboard)?/, { timeout: 20_000 });
}

export async function uiSuperAdminLogin(page: Page, email: string, password: string) {
  await page.goto('/super-admin');
  const emailField = page.getByLabel(/email/i);
  if (await emailField.count()) {
    await emailField.fill(email);
  } else {
    await page.locator('input[type="email"]').fill(email);
  }
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /connexion|se connecter|connecter/i }).click();
  await expect(page).toHaveURL(/\/super-admin/, { timeout: 20_000 });
}
