/**
 * Construit l'URL publique d'une boutique (preview vendeur).
 * Priorité : sous-domaine en prod ; en local → ?tenant=slug (fiable sur Windows).
 */
export function buildStorefrontUrl(slug: string | null | undefined): string {
  const s = slug?.trim().toLowerCase();
  if (!s) {
    return `${window.location.origin}/`;
  }

  const host = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : '';
  const protocol = window.location.protocol;

  // Dev local : ?tenant= sur localhost (évite *.localhost qui ouvre parfois la landing Matjarona).
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return `${protocol}//localhost${port}/?tenant=${encodeURIComponent(s)}`;
  }

  // slug.matjarona.ma
  if (host.includes('matjarona.')) {
    const base = host.replace(/^(www\.)?([a-z0-9-]+\.)?matjarona\./i, 'matjarona.');
    return `${protocol}//${s}.${base}${port}/`;
  }

  // Fallback universel (dev Vite proxy / IP)
  return `${window.location.origin}/?tenant=${encodeURIComponent(s)}`;
}

/** Force un rechargement frais de la vitrine (évite cache navigateur après Enregistrer). */
export function withStorefrontCacheBust(
  url: string,
  rev: number | string = Date.now(),
): string {
  try {
    const u = new URL(url);
    u.searchParams.set('_v', String(rev));
    return u.href;
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}_v=${encodeURIComponent(String(rev))}`;
  }
}

export function buildFreshStorefrontUrl(
  slug: string | null | undefined,
  rev: number | string = Date.now(),
): string {
  return withStorefrontCacheBust(buildStorefrontUrl(slug), rev);
}

export function buildStorefrontPath(slug: string | null | undefined): string {
  const s = slug?.trim().toLowerCase();
  if (!s) return '/';
  return `/?tenant=${encodeURIComponent(s)}`;
}
