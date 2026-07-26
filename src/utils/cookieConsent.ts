export type CookieConsentRecord = {
  necessary: true;
  marketing: boolean;
  ts: number;
};

export function cookieConsentStorageKey(slug: string): string {
  return `matjarona_consent_${slug}`;
}

export function readCookieConsent(slug: string | undefined): CookieConsentRecord | null {
  if (!slug) return null;
  try {
    const raw = localStorage.getItem(cookieConsentStorageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed && parsed.necessary === true && typeof parsed.marketing === 'boolean') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(slug: string, marketing: boolean): void {
  const record: CookieConsentRecord = { necessary: true, marketing, ts: Date.now() };
  localStorage.setItem(cookieConsentStorageKey(slug), JSON.stringify(record));
}

/** Marketing pixels allowed when consent not required, or marketing flag is true. */
export function hasMarketingConsent(
  slug: string | undefined,
  cookieConsentRequired: boolean | undefined,
): boolean {
  if (cookieConsentRequired === false) return true;
  const stored = readCookieConsent(slug);
  return !!stored?.marketing;
}

export function consentDecisionMade(
  slug: string | undefined,
  cookieConsentRequired: boolean | undefined,
): boolean {
  if (cookieConsentRequired === false) return true;
  return !!readCookieConsent(slug);
}
