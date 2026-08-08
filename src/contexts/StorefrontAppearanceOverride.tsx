import { createContext, useContext, type ReactNode } from 'react';
import type { StoreAppearance } from '@/config/storeAppearance';

export type StorefrontAppearanceOverrideValue = {
  appearance?: StoreAppearance | null;
  themeKey?: string | null;
  fontPair?: string | null;
  radiusPreset?: string | null;
};

const StorefrontAppearanceOverrideContext =
  createContext<StorefrontAppearanceOverrideValue | null>(null);

export function StorefrontAppearanceOverrideProvider({
  value,
  children,
}: {
  value: StorefrontAppearanceOverrideValue | null;
  children: ReactNode;
}) {
  return (
    <StorefrontAppearanceOverrideContext.Provider value={value}>
      {children}
    </StorefrontAppearanceOverrideContext.Provider>
  );
}

export function useStorefrontAppearanceOverride() {
  return useContext(StorefrontAppearanceOverrideContext);
}
