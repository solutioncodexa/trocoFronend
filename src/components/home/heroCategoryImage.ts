import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

/** Pastille hero si aucune image exploitable (data-URL, aucune requête réseau). */
export const HERO_CATEGORY_IMAGE_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">' +
      '<defs><radialGradient id="g" cx="38%" cy="32%">' +
      '<stop offset="0%" stop-color="#f0d78c"/><stop offset="100%" stop-color="#9a7b2e"/>' +
      '</radialGradient></defs>' +
      '<circle cx="40" cy="40" r="36" fill="url(#g)"/>' +
      '</svg>'
  );

/**
 * En dev, si l’image pointe vers le backend local, on utilise un chemin relatif
 * (`/api/uploads/...`) pour le proxy Vite. En prod, URL absolue inchangée.
 */
export function heroCategoryDisplaySrc(raw: string | undefined): string {
  if (!raw?.trim()) return HERO_CATEGORY_IMAGE_FALLBACK;

  const absolute = resolvePublicImageUrl(raw);
  if (!absolute) return HERO_CATEGORY_IMAGE_FALLBACK;

  if (!import.meta.env.DEV) return absolute;

  try {
    const u = new URL(absolute);
    const h = u.hostname;
    const localHost =
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '[::1]' ||
      h.endsWith('.localhost');
    if (localHost && u.pathname.startsWith('/api/')) {
      return `${u.pathname}${u.search}`;
    }
  } catch {
    /* ignore */
  }

  return absolute;
}
