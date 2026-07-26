export type HomeAbVariant = 'A' | 'B';

/** Variante légère (sans blocs) — GET /store-pages/public/homes. */
export type PublicHomeVariant = {
  id: number;
  abVariant?: string | null;
  currentlyLive?: boolean;
};

export function resolveStickyHomeAbVariant(
  storeSlug: string | undefined,
  homes: PublicHomeVariant[] | undefined,
): HomeAbVariant | undefined {
  if (!homes?.length) return undefined;
  const hasA = homes.some((h) => h.abVariant?.toUpperCase() === 'A');
  const hasB = homes.some((h) => h.abVariant?.toUpperCase() === 'B');
  if (!hasA || !hasB) return undefined;

  const key = `home_ab_variant_${storeSlug || 'default'}`;
  try {
    const stored = sessionStorage.getItem(key);
    if (stored === 'A' || stored === 'B') return stored;
    const picked: HomeAbVariant = Math.random() < 0.5 ? 'A' : 'B';
    sessionStorage.setItem(key, picked);
    return picked;
  } catch {
    return Math.random() < 0.5 ? 'A' : 'B';
  }
}
