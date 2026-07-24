import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as authApi from '@/services/api/auth';
import type { UserInfoDTO } from '@/types/api';
import type { PermissionCode } from '@/config/permissions';
import { hasEffectivePermission } from '@/config/permissions';
import { clearStockAlertPending } from '@/utils/stockAlertSession';

interface AdminContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: UserInfoDTO | null;
  permissions: string[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  hasPermission: (code: PermissionCode | string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const BACKOFFICE_ROLES = new Set(['ADMIN', 'STAFF']);

function isBackofficeRole(role?: string) {
  return !!role && BACKOFFICE_ROLES.has(role);
}

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && isBackofficeRole(user.role);
  const isAdmin = user?.role === 'ADMIN';
  const permissions = user?.permissions ?? [];

  const hasPermission = useCallback(
    (code: PermissionCode | string) => {
      if (!user || !isBackofficeRole(user.role)) return false;
      return hasEffectivePermission(user.permissions, code, user.role === 'ADMIN');
    },
    [user]
  );

  const logout = useCallback(() => {
    authApi.setStoredToken(null);
    clearStockAlertPending();
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    const token = authApi.getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      if (me && isBackofficeRole(me.role) && me.active !== false) {
        setUser(me);
      } else {
        authApi.setStoredToken(null);
      }
    } catch {
      authApi.setStoredToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (
    email: string,
    password: string,
  ): Promise<{ ok: true } | { ok: false; error: string }> => {
    try {
      const response = await authApi.login({ email, password });
      if (!isBackofficeRole(response.role)) {
        authApi.setStoredToken(null);
        return { ok: false, error: 'Ce compte n’a pas accès à l’administration' };
      }
      authApi.setStoredToken(response.access_token);
      setUser({
        id: response.id,
        email: response.email,
        role: response.role,
        fullName: response.fullName,
        active: true,
        permissions: response.permissions ?? [],
      });
      try {
        const me = await authApi.getMe();
        if (me && isBackofficeRole(me.role)) {
          setUser(me);
        }
      } catch {
        /* keep login payload */
      }
      return { ok: true };
    } catch (err) {
      console.error('Admin login failed:', err);
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Email ou mot de passe incorrect',
      };
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        permissions,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
