import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { normalizeAppearance, type StoreAppearance } from '@/config/storeAppearance';

export function useStoreAppearance(): StoreAppearance {
  const { store } = useTenant();
  return useMemo(() => normalizeAppearance(store?.appearance), [store?.appearance]);
}
