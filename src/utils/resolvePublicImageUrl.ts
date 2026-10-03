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
 *      `https://files.troco.ma/troco-uploads/xxx.jpg`. On la retourne telle quelle.
 *
 *   3. Compat héritée : URL avec `/api/...` (déjà préfixée).
 */
export function resolvePublicImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const u = rewriteMinioBrowserUrl(url.trim());

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

/**
 * MinIO console (:9001) et API (:9000) ne sont pas exposés au navigateur.
 * Les fichiers publics passent par nginx : https://hôte/files/bucket/objet.
 * Une URL qui n'est que la racine de la console n'est pas un fichier.
 */
function rewriteMinioBrowserUrl(u: string): string {
  if (!/^https?:\/\//i.test(u)) return u;
  let parsed: URL;
  try {
    parsed = new URL(u);
  } catch {
    return u;
  }
  const minioPort = parsed.port === '9000' || parsed.port === '9001';
  if (!minioPort && parsed.protocol !== 'http:') return u;

  if (minioPort) {
    const path = parsed.pathname.replace(/\/+$/, '');
    if (!path) return '';
    return `https://${parsed.hostname}/files${parsed.pathname}${parsed.search}`;
  }

  if (parsed.hostname.endsWith('codexa-solution.com') || parsed.hostname.endsWith('getstore.codexa-solution.com')) {
    parsed.protocol = 'https:';
    return parsed.toString();
  }
  return u;
}
