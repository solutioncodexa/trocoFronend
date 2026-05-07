import { API_BASE_URL } from '@/config/api';

/**
 * URL absolue pour une image servie par le backend.
 * (Logique isolée ici pour éviter que `productMapper` importe `services/api/upload`,
 * ce qui peut provoquer des requêtes bizarres / cycles avec le barrel `@/services/api`.)
 *
 * Spring : `server.servlet.context-path=/api` → fichiers `/uploads/**` en réalité sous `/api/uploads/...`.
 */
export function resolvePublicImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const u = url.trim();
  if (u.startsWith('http')) return u;

  const apiBase = API_BASE_URL.replace(/\/+$/, '');
  const serverOrigin = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;

  if (u.startsWith('/api/')) {
    return `${serverOrigin}${u}`;
  }
  if (u.startsWith('/uploads/')) {
    return `${apiBase}${u}`;
  }
  if (u.startsWith('/')) {
    return u;
  }
  return `${apiBase}/${u}`;
}
