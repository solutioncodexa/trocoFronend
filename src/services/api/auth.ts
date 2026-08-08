import { buildApiUrl, apiRequest } from '@/config/api';
import type { AuthResponse, UserInfoDTO, LoginRequest, RegisterRequest } from '@/types/api';

const AUTH_TOKEN_KEY = 'troco_admin_token';
const REFRESH_TOKEN_KEY = 'troco_admin_refresh';

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setStoredRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/** Efface access + refresh token (déconnexion locale). */
export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** Déconnexion : invalide le refresh token côté serveur (best-effort) puis nettoie le local. */
export async function logout(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  if (refreshToken) {
    try {
      await apiRequest<void>(buildApiUrl('/auth/logout'), {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        skipAuth: true,
      });
    } catch {
      /* best-effort : on nettoie le local quoi qu'il arrive */
    }
  }
  clearStoredAuth();
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>(buildApiUrl('/auth/login'), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>(buildApiUrl('/auth/register'), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function getMe(): Promise<UserInfoDTO | null> {
  try {
    const data = await apiRequest<UserInfoDTO>(buildApiUrl('/auth/me'), {
      method: 'GET',
    });
    return data;
  } catch {
    return null;
  }
}
