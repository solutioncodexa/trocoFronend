import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as authApi from '@/services/api/auth';
import type { UserInfoDTO } from '@/types/api';
import type { PermissionCode } from '@/config/permissions';
import { hasEffectivePermission } from '@/config/permissions';
import { clearStockAlertPending } from '@/utils/stockAlertSession';
import { setStoredTenantSlug } from '@/config/api';
import { platformApi } from '@/services/api/platform';
import { useTenant } from '@/contexts/TenantContext';

interface AdminContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  user: UserInfoDTO | null;
  permissions: string[];
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: true; role: string } | { ok: false; error: string }>;
  logout: () => void;
  hasPermission: (code: PermissionCode | string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const BACKOFFICE_ROLES = new Set(['ADMIN', 'STAFF', 'SUPER_ADMIN']);

function isBackofficeRole(role?: string) {
  return !!role && BACKOFFICE_ROLES.has(role);
}

function resolveFournisseurId(source: {
  fournisseurId?: number | null;
  fournisseur_id?: number | null;
}): number | null | undefined {
  if (source.fournisseurId != null) return source.fournisseurId;
  if (source.fournisseur_id != null) return source.fournisseur_id;
  return source.fournisseurId;
}

function isStoreStaffRole(role?: string) {
  return role === 'ADMIN' || role === 'STAFF';
}

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loadFromAdminSession } = useTenant();

  const isAuthenticated = !!user && isBackofficeRole(user.role);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const permissions = user?.permissions ?? [];

  const syncStoreBrand = useCallback(
    async (role: string, fournisseurId?: number | null, opts?: { force?: boolean }) => {
      if (!isStoreStaffRole(role)) return;
      // ADMIN/STAFF avec boutique (fournisseur) — SUPER_ADMIN ignoré
      if (fournisseurId === null) return;
      // Ne pas écraser le branding / slug de la vitrine publique (autre sous-domaine).
      const onAdminSurface =
        opts?.force === true ||
        window.location.pathname.startsWith('/admin');
      if (!onAdminSurface) return;
      try {
        const data = await platformApi.getMyStoreSettings();
        if (data.slug) {
          setStoredTenantSlug(data.slug);
        }
      } catch {
        /* ignore — pas de boutique liée */
      }
      await loadFromAdminSession();
    },
    [loadFromAdminSession],
  );

  const hasPermission = useCallback(
    (code: PermissionCode | string) => {
      if (!user || !isBackofficeRole(user.role)) return false;
      if (user.role === 'SUPER_ADMIN') return true;
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
        await syncStoreBrand(me.role, me.fournisseurId);
      } else {
        authApi.setStoredToken(null);
      }
    } catch {
      authApi.setStoredToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncStoreBrand]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (
    email: string,
    password: string,
  ): Promise<{ ok: true; role: string } | { ok: false; error: string }> => {
    try {
      const response = await authApi.login({ email, password });
      if (!isBackofficeRole(response.role)) {
        authApi.setStoredToken(null);
        return { ok: false, error: 'Ce compte n’a pas accès à l’administration' };
      }
      authApi.setStoredToken(response.access_token);
      let role = response.role;
      let fournisseurId = resolveFournisseurId(response) ?? null;
      setUser({
        id: response.id,
        email: response.email,
        role: response.role,
        fullName: response.fullName,
        active: true,
        permissions: response.permissions ?? [],
        fournisseurId,
      });
      try {
        const me = await authApi.getMe();
        if (me && isBackofficeRole(me.role)) {
          setUser(me);
          role = me.role;
          fournisseurId = me.fournisseurId ?? fournisseurId;
        }
      } catch {
        /* keep login payload */
      }
      await syncStoreBrand(role, fournisseurId, { force: true });
      return { ok: true, role };
    } catch (err) {
      console.error('Admin login failed:', err);
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Email ou mot de passe incorrect',
      };
    }
  }, [syncStoreBrand]);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
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
