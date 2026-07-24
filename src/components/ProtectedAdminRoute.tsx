import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import type { PermissionCode } from '@/config/permissions';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  permission?: PermissionCode | string;
  adminOnly?: boolean;
}

export const ProtectedAdminRoute = ({
  children,
  permission,
  adminOnly = false,
}: ProtectedAdminRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin, hasPermission } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-body text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
