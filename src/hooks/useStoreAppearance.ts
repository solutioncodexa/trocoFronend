import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useStorefrontAppearanceOverride } from '@/contexts/StorefrontAppearanceOverride';
import { normalizeAppearance, type StoreAppearance } from '@/config/storeAppearance';

export function useStoreAppearance(): StoreAppearance {
  const { store } = useTenant();
  const override = useStorefrontAppearanceOverride();
  return useMemo(
    () => normalizeAppearance(override?.appearance ?? store?.appearance),
    [override?.appearance, store?.appearance],
  );
}
