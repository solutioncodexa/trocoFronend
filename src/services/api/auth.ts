import { buildApiUrl, apiRequest } from '@/config/api';
import type { AuthResponse, UserInfoDTO, LoginRequest, RegisterRequest } from '@/types/api';

const AUTH_TOKEN_KEY = 'troco_admin_token';

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
