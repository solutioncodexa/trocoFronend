import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resolveTenantSlugFromHost, useTenant } from '@/contexts/TenantContext';

const SKIP_PREFIX = /^\/(admin|super-admin|superadmin|creer|create|pricing|design-demo|matjarona|verifier-email)(\/|$)/;

/**
 * Sur localhost, réécrit l’URL pour garder ?tenant= après un clic interne.
 * Sans ça, un rafraîchissement retombe sur la boutique par défaut (Troco).
 */
export default function PreserveTenantQuery() {
  const { slug } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug || resolveTenantSlugFromHost()) return;
    if (SKIP_PREFIX.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    if (params.get('tenant') === slug) return;
    params.set('tenant', slug);
    navigate(
      { pathname: location.pathname, search: params.toString(), hash: location.hash },
      { replace: true },
    );
  }, [slug, location.pathname, location.search, location.hash, navigate]);

  return null;
}
