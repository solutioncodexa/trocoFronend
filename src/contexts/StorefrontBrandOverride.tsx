import { createContext, useContext, type ReactNode } from 'react';

export type StorefrontBrandOverrideValue = {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  aboutText?: string | null;
};

const StorefrontBrandOverrideContext = createContext<StorefrontBrandOverrideValue | null>(null);

export function StorefrontBrandOverrideProvider({
  value,
  children,
}: {
  value: StorefrontBrandOverrideValue | null;
  children: ReactNode;
}) {
  return (
    <StorefrontBrandOverrideContext.Provider value={value}>
      {children}
    </StorefrontBrandOverrideContext.Provider>
  );
}

export function useStorefrontBrandOverride() {
  return useContext(StorefrontBrandOverrideContext);
}
