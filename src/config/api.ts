// Relatif `/api` par défaut : même origine que la page (évite DNS cassé www vs apex ou .ma/.com).
// Override build : VITE_API_BASE_URL (ex. URL absolue seulement si besoin exceptionnel).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Récupération du token pour les requêtes authentifiées (évite import circulaire)
const getAuthToken = (): string | null => {
  return localStorage.getItem('goldyara_admin_token');
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
      localStorage.removeItem('goldyara_admin_token');
    }
    const error = await response.json().catch(() => ({}));
    const safeMessage = typeof error.message === 'string' && error.message.length < 200
      ? error.message
      : 'Une erreur est survenue';
    throw new Error(safeMessage);
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
