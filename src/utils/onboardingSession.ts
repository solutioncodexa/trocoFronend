const STORAGE_KEY = 'troco.onboarding.v1';

export type OnboardingDraft = {
  step: number;
  themeKey?: string;
  fontPair?: string;
  radiusPreset?: string;
  siteName?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  publishHome?: boolean;
};

export function readOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingDraft;
  } catch {
    return null;
  }
}

export function writeOnboardingDraft(draft: OnboardingDraft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota / private mode
  }
}

export function clearOnboardingDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Retour assistant après création produit. */
export const ONBOARDING_RETURN_QUERY = 'fromOnboarding';
export const ONBOARDING_PUBLICATION_PATH = '/admin/onboarding?step=6';
export const ONBOARDING_PRODUCTS_PATH = '/admin/onboarding?step=5';
