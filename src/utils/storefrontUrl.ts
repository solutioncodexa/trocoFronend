/**
 * Construit l'URL publique d'une boutique (preview vendeur).
 * Priorité : sous-domaine en prod, sinon ?tenant=slug (dev / plateforme).
 */
export function buildStorefrontUrl(slug: string | null | undefined): string {
  const s = slug?.trim().toLowerCase();
  if (!s) {
    return `${window.location.origin}/`;
  }

  const host = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : '';
  const protocol = window.location.protocol;

  // troco.localhost:5173
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return `${protocol}//${s}.localhost${port}/`;
  }

  // slug.matjarona.ma
  if (host.includes('matjarona.')) {
    const base = host.replace(/^(www\.)?([a-z0-9-]+\.)?matjarona\./i, 'matjarona.');
    return `${protocol}//${s}.${base}${port}/`;
  }

  // Fallback universel (dev Vite proxy / IP)
  return `${window.location.origin}/?tenant=${encodeURIComponent(s)}`;
}

export function buildStorefrontPath(slug: string | null | undefined): string {
  const s = slug?.trim().toLowerCase();
  if (!s) return '/';
  return `/?tenant=${encodeURIComponent(s)}`;
}
