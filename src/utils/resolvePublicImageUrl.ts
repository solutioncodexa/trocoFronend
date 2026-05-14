import { API_BASE_URL } from '@/config/api';

/**
 * URL absolue pour une image servie par le backend.
 *
 * Plusieurs cas de figure selon le mode de stockage côté serveur :
 *
 *   1. Stockage local (Spring `context-path=/api`) → l'API renvoie une URL relative
 *      `/uploads/xxx.jpg`, qu'il faut préfixer par `${API_BASE_URL}` (donc `/api/uploads/xxx.jpg`).
 *
 *   2. Stockage MinIO/S3 → l'API renvoie déjà une URL absolue
 *      `https://files.goldyara.ma/goldyara-uploads/xxx.jpg`. On la retourne telle quelle.
 *
 *   3. Compat héritée : URL avec `/api/...` (déjà préfixée).
 */
export function resolvePublicImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const u = url.trim();

  // Cas MinIO / CDN externe : déjà une URL absolue
  if (/^https?:\/\//i.test(u)) return u;
  // Data URL (base64) — laissé tel quel
  if (u.startsWith('data:')) return u;

  const apiBase = API_BASE_URL.replace(/\/+$/, '');
  const serverOrigin = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;

  // /api/... → préfixé directement par l'origine serveur
  if (u.startsWith('/api/')) {
    return `${serverOrigin}${u}`;
  }
  // /uploads/... → on le sert via le context-path de l'API
  if (u.startsWith('/uploads/')) {
    return `${apiBase}${u}`;
  }
  // /n'importe quoi d'autre → laissé tel quel (asset front)
  if (u.startsWith('/')) {
    return u;
  }
  return `${apiBase}/${u}`;
}
