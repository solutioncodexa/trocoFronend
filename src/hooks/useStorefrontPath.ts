import { useCallback } from 'react';
import { useDesignDemo } from '@/demo/DesignDemoContext';
import { resolveTenantSlugFromHost, useTenant } from '@/contexts/TenantContext';
import { withTenantQuery } from '@/utils/storefrontUrl';

/**
 * Préfixe les routes vitrine quand on est dans une démo design.
 * Sur localhost (pas de sous-domaine), conserve ?tenant= pour que le rafraîchissement
 * rouvre la même boutique.
 */
export function useStorefrontPath() {
  const demo = useDesignDemo();
  const { slug } = useTenant();
  const onSubdomain = typeof window !== 'undefined' && !!resolveTenantSlugFromHost();

  const to = useCallback(
    (storePath: string) => {
      if (demo) return demo.path(storePath);
      if (onSubdomain) return storePath || '/';
      return withTenantQuery(storePath || '/', slug);
    },
    [demo, onSubdomain, slug],
  );

  return {
    isDemo: !!demo,
    basePath: demo?.basePath ?? '',
    to,
    demo,
  };
}
