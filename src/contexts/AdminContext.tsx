import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as authApi from '@/services/api/auth';
import type { UserInfoDTO } from '@/types/api';

interface AdminContextType {
  isAuthenticated: boolean;
  user: UserInfoDTO | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_ROLE = 'ADMIN';

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && user.role === ADMIN_ROLE;

  const logout = useCallback(() => {
    authApi.setStoredToken(null);
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
      if (me && me.role === ADMIN_ROLE) {
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      if (response.role !== ADMIN_ROLE) {
        authApi.setStoredToken(null);
        return false;
      }
      authApi.setStoredToken(response.access_token);
      setUser({
        id: response.id,
        email: response.email,
        role: response.role,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
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
