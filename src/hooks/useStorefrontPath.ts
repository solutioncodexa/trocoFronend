import { useCallback } from 'react';
import { useDesignDemo } from '@/demo/DesignDemoContext';

/**
 * Préfixe les routes vitrine quand on est dans une démo design.
 * Sinon retourne le chemin tel quel.
 */
export function useStorefrontPath() {
  const demo = useDesignDemo();

  const to = useCallback(
    (storePath: string) => {
      if (!demo) return storePath || '/';
      return demo.path(storePath);
    },
    [demo],
  );

  return {
    isDemo: !!demo,
    basePath: demo?.basePath ?? '',
    to,
    demo,
  };
}
