// Relatif `/api` par défaut : même origine que la page (évite DNS cassé www vs apex ou .ma/.com).
// Override build : VITE_API_BASE_URL (ex. URL absolue seulement si besoin exceptionnel).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const TENANT_SLUG_STORAGE_KEY = 'troco_tenant_slug';

// Récupération du token pour les requêtes authentifiées (évite import circulaire)
const getAuthToken = (): string | null => {
  return localStorage.getItem('troco_admin_token');
};

const getTenantSlug = (): string | null => {
  try {
    return localStorage.getItem(TENANT_SLUG_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredTenantSlug = (slug: string | null): void => {
  try {
    if (slug) {
      localStorage.setItem(TENANT_SLUG_STORAGE_KEY, slug);
    } else {
      localStorage.removeItem(TENANT_SLUG_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
};

// Helper pour construire les URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper pour les requêtes fetch avec gestion d'erreurs
export type ApiRequestOptions = RequestInit & {
  /** Ne pas envoyer le JWT admin (ex. POST /orders vitrine — tenant via Host/slug). */
  skipAuth?: boolean;
};

export const apiRequest = async <T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  if (!headers['Content-Type'] && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const tenantSlug = getTenantSlug();
  if (tenantSlug && !headers['X-Fournisseur-Slug']) {
    headers['X-Fournisseur-Slug'] = tenantSlug;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !skipAuth) {
      localStorage.removeItem('troco_admin_token');
    }
    const rawText = await response.text().catch(() => '');
    let error: Record<string, unknown> = {};
    try {
      error = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
    } catch {
      /* plain text body (ex. Spring CORS "Invalid CORS request") */
    }
    const detail = typeof error.detail === 'string' ? error.detail : '';
    const message = typeof error.message === 'string' ? error.message : '';
    const title = typeof error.title === 'string' ? error.title : '';
    const plain = rawText.trim();
    if (/invalid cors request/i.test(plain) || /invalid cors request/i.test(message)) {
      throw new Error(
        'Paiement bloqué (CORS). Redémarrez le backend après mise à jour des origines autorisées (*.localhost).',
      );
    }
    const candidate = [detail, message, title, plain].find(
      (s) => typeof s === 'string' && s.length > 0 && s.length < 200,
    );
    throw new Error(candidate || 'Une erreur est survenue');
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const data = await response.json();

  // Si la réponse est une ApiResponse wrapper, extraire le data
  if (data.success !== undefined && data.data !== undefined) {
    return data.data as T;
  }

  return data as T;
};
