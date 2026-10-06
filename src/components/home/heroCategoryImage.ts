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

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Image par défaut d'une catégorie sans photo : dégradé (teinte dérivée du nom, donc stable)
 * + initiale. Data-URL : aucune requête réseau, rendu identique partout (accueil, boutique, admin).
 */
export function categoryPlaceholderSrc(name?: string | null): string {
  const label = (name ?? '').trim();
  if (!label) return HERO_CATEGORY_IMAGE_FALLBACK;
  let hash = 0;
  for (const ch of label.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  const initial = escapeXml(Array.from(label)[0].toUpperCase());
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    `<stop offset="0%" stop-color="hsl(${hash} 62% 62%)"/>` +
    `<stop offset="100%" stop-color="hsl(${(hash + 40) % 360} 58% 42%)"/>` +
    '</linearGradient></defs>' +
    '<rect width="400" height="400" fill="url(#g)"/>' +
    '<circle cx="320" cy="80" r="110" fill="#fff" fill-opacity="0.10"/>' +
    '<circle cx="60" cy="350" r="90" fill="#fff" fill-opacity="0.08"/>' +
    '<text x="200" y="262" font-family="Georgia,serif" font-size="190" font-weight="700" ' +
    `fill="#fff" fill-opacity="0.92" text-anchor="middle">${initial}</text>` +
    '</svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/**
 * En dev, si l’image pointe vers le backend local, on utilise un chemin relatif
 * (`/api/uploads/...`) pour le proxy Vite. En prod, URL absolue inchangée.
 * Sans image : placeholder généré à partir du nom de la catégorie (si fourni).
 */
export function heroCategoryDisplaySrc(raw: string | undefined, name?: string | null): string {
  if (!raw?.trim()) return categoryPlaceholderSrc(name);

  const absolute = resolvePublicImageUrl(raw);
  if (!absolute) return categoryPlaceholderSrc(name);

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
