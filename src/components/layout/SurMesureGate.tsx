import type { ReactNode } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import NeutralBootLoader from '@/components/layout/NeutralBootLoader';
import NotFound from '@/pages/NotFound';

/**
 * Protège /sur-mesure et /devis : ces pages n'existent que si le marchand
 * a activé « Sur mesure » (réglage boutique). Sinon → 404, comme un lien inconnu.
 */
const SurMesureGate = ({ children }: { children: ReactNode }) => {
  const { store, isLoading } = useTenant();
  if (isLoading && !store) return <NeutralBootLoader />;
  if (store && store.surMesureEnabled === false) return <NotFound />;
  return <>{children}</>;
};

export default SurMesureGate;
