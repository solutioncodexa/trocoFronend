/** Snapshot branding actif (hors React) pour SEO / partage. */
export type ActiveStoreBrand = {
  siteName: string;
  tagline?: string | null;
  logoUrl?: string | null;
};

let active: ActiveStoreBrand | null = null;

export function setActiveStoreBrand(brand: ActiveStoreBrand | null) {
  active = brand;
}

export function getActiveStoreBrand(): ActiveStoreBrand | null {
  return active;
}

export function getActiveSiteName(fallback = 'Boutique'): string {
  return active?.siteName?.trim() || fallback;
}
