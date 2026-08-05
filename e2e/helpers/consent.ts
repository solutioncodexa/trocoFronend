import type { Page } from '@playwright/test';

/** Pré-accepte les cookies pour éviter le bandeau (z-index) qui bloque les clics. */
export async function acceptCookies(page: Page, slug = 'maison-atlas') {
  await page.addInitScript((storeSlug) => {
    localStorage.setItem(
      `matjarona_consent_${storeSlug}`,
      JSON.stringify({ necessary: true, marketing: true, ts: Date.now() }),
    );
  }, slug);

  const banner = page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"]');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: /Tout accepter|Accept all|قبول الكل/i }).click();
  }
}
