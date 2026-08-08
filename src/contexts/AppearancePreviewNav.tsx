import { createContext, useContext, type ReactNode } from 'react';

/** Navigation interne dans l’aperçu Apparence (évite de quitter l’admin). */
export type AppearancePreviewNavValue = {
  go: (page: string) => void;
};

const AppearancePreviewNavContext = createContext<AppearancePreviewNavValue | null>(null);

export function AppearancePreviewNavProvider({
  value,
  children,
}: {
  value: AppearancePreviewNavValue | null;
  children: ReactNode;
}) {
  return (
    <AppearancePreviewNavContext.Provider value={value}>
      {children}
    </AppearancePreviewNavContext.Provider>
  );
}

export function useAppearancePreviewNav() {
  return useContext(AppearancePreviewNavContext);
}

/** Mappe une URL vitrine vers une clé de page d’aperçu. */
export function previewPageFromHref(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '') return 'home';
    if (path === '/boutique' || path.startsWith('/boutique/')) return 'shop';
    if (path === '/sur-mesure') return 'sur-mesure';
    if (path === '/devis') return 'devis';
    if (path === '/contact') return 'contact';
    if (path === '/panier' || path === '/cart') return 'cart';
    if (path === '/checkout') return 'checkout';
    if (path === '/favoris' || path === '/wishlist') return 'wishlist';
    if (path.startsWith('/produit/') || path.startsWith('/product/')) return 'product';
    if (path.startsWith('/page/')) return path;
    return null;
  } catch {
    return null;
  }
}
