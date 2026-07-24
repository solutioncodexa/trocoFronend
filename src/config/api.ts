// Relatif `/api` par défaut : même origine que la page (évite DNS cassé www vs apex ou .ma/.com).
// Override build : VITE_API_BASE_URL (ex. URL absolue seulement si besoin exceptionnel).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Récupération du token pour les requêtes authentifiées (évite import circulaire)
const getAuthToken = (): string | null => {
  return localStorage.getItem('troco_admin_token');
};

// Helper pour construire les URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper pour les requêtes fetch avec gestion d'erreurs
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('troco_admin_token');
    }
    const error = await response.json().catch(() => ({} as Record<string, unknown>));
    const detail = typeof error.detail === 'string' ? error.detail : '';
    const message = typeof error.message === 'string' ? error.message : '';
    const title = typeof error.title === 'string' ? error.title : '';
    const candidate = [detail, message, title].find((s) => s.length > 0 && s.length < 200);
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
