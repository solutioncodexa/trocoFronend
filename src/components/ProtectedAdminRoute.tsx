import { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdmin } from '@/contexts/AdminContext';
import type { PermissionCode } from '@/config/permissions';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  permission?: PermissionCode | string;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

export const ProtectedAdminRoute = ({
  children,
  permission,
  adminOnly = false,
  superAdminOnly = false,
}: ProtectedAdminRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin, isSuperAdmin, hasPermission } = useAdmin();
  const location = useLocation();
  const deniedToastShown = useRef(false);

  const denied =
    isAuthenticated &&
    ((superAdminOnly && !isSuperAdmin) ||
      (adminOnly && !isAdmin) ||
      (!!permission && !hasPermission(permission)));

  useEffect(() => {
    if (!denied || deniedToastShown.current) return;
    deniedToastShown.current = true;
    toast.info('Accès non autorisé pour cette page');
  }, [denied]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-body text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={superAdminOnly ? '/super-admin' : '/admin'}
        state={{ from: location }}
        replace
      />
    );
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to={isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard'} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
