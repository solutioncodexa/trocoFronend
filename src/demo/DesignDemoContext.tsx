import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getThemeDefinition, type StoreThemeKey } from '@/config/storeThemes';
import {
  DEMO_CATEGORIES,
  DEMO_FAQS,
  DEMO_HERO_BY_THEME,
  DEMO_PRODUCTS,
  filterDemoProducts,
  getDemoProduct,
  type DemoCategory,
} from '@/demo/mockCatalog';
import type { Product } from '@/types/product';

export type DemoCartLine = {
  product: Product;
  quantity: number;
};

type DesignDemoContextValue = {
  themeKey: StoreThemeKey;
  basePath: string;
  brand: {
    siteName: string;
    tagline: string;
    logoUrl: null;
    primaryColor: string;
    secondaryColor: string;
    aboutText: string;
  }; // aboutText used by Layout override + ThemeHome
  heroImage: string;
  products: Product[];
  categories: DemoCategory[];
  faqs: typeof DEMO_FAQS;
  getProduct: (id: string) => Product | undefined;
  filterProducts: typeof filterDemoProducts;
  /** Préfixe une route vitrine pour rester dans la démo. */
  path: (storePath: string) => string;
  cart: DemoCartLine[];
  addToCart: (product: Product, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  cartCount: number;
  cartTotal: number;
};

const DesignDemoContext = createContext<DesignDemoContextValue | null>(null);

export function DesignDemoProvider({
  themeKey,
  children,
}: {
  themeKey: StoreThemeKey;
  children: ReactNode;
}) {
  const theme = getThemeDefinition(themeKey);
  const basePath = `/design-demo/${themeKey}`;

  const brand = useMemo(
    () => ({
      siteName: theme.demoSiteName,
      tagline: theme.demoTagline,
      logoUrl: null as null,
      primaryColor: theme.demoPrimary,
      secondaryColor: theme.demoSecondary,
      aboutText:
        'Collection démo Matjarona — données fictives pour explorer le design avant de l’appliquer à votre boutique.',
    }),
    [theme],
  );

  const [cart, setCart] = useState<DemoCartLine[]>(() => [
    { product: DEMO_PRODUCTS[0], quantity: 1 },
    { product: DEMO_PRODUCTS[2], quantity: 2 },
  ]);

  const path = useCallback(
    (storePath: string) => {
      if (!storePath || storePath === '/') return basePath;
      const clean = storePath.startsWith('/') ? storePath : `/${storePath}`;
      return `${basePath}${clean}`;
    },
    [basePath],
  );

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + qty } : l,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, quantity: qty } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const cartCount = cart.reduce((n, l) => n + l.quantity, 0);
  const cartTotal = cart.reduce((n, l) => n + l.product.price * l.quantity, 0);

  const value = useMemo<DesignDemoContextValue>(
    () => ({
      themeKey,
      basePath,
      brand,
      heroImage: DEMO_HERO_BY_THEME[themeKey],
      products: DEMO_PRODUCTS,
      categories: DEMO_CATEGORIES,
      faqs: DEMO_FAQS,
      getProduct: getDemoProduct,
      filterProducts: filterDemoProducts,
      path,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      cartCount,
      cartTotal,
    }),
    [
      themeKey,
      basePath,
      brand,
      path,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      cartCount,
      cartTotal,
    ],
  );

  return <DesignDemoContext.Provider value={value}>{children}</DesignDemoContext.Provider>;
}

export function useDesignDemo() {
  return useContext(DesignDemoContext);
}

export function useDesignDemoRequired() {
  const ctx = useDesignDemo();
  if (!ctx) throw new Error('useDesignDemoRequired must be used within DesignDemoProvider');
  return ctx;
}
