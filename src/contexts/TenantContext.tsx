import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setStoredTenantSlug } from '@/config/api';
import { platformApi } from '@/services/api/platform';
import type { TenantStoreDTO } from '@/types/api';
import { clearRootStoreTheme } from '@/utils/storeTheme';
import {
  clearStorefrontThemeCache,
  readStorefrontThemeCache,
  writeStorefrontThemeCache,
} from '@/utils/storefrontThemeCache';

interface TenantContextType {
  store: TenantStoreDTO | null;
  slug: string | null;
  isPlatformHost: boolean;
  isLoading: boolean;
  /** Message si la boutique existe mais n'est pas accessible (PENDING / SUSPENDED). */
  storeUnavailableMessage: string | null;
  refresh: () => Promise<void>;
  /** Charge la boutique du fournisseur connecté (admin). */
  loadFromAdminSession: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function isPlatformHostname(hostname = window.location.hostname): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
  if (/^(www\.)?getstore\./i.test(h)) return true;
  return false;
}

export function resolveTenantSlugFromHost(hostname = window.location.hostname): string | null {
  const h = hostname.toLowerCase();
  if (h.endsWith('.localhost')) {
    const sub = h.slice(0, -'.localhost'.length);
    if (sub && !sub.includes('.') && sub !== 'www') return sub;
  }
  const match = h.match(/^([a-z0-9-]+)\.getstore\./i);
  if (match && match[1] && match[1] !== 'www') return match[1];
  return null;
}

export function resolveTenantSlug(): string | null {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('tenant')?.trim();
  if (fromQuery) return fromQuery;

  const fromHost = resolveTenantSlugFromHost();
  if (fromHost) return fromHost;

  const fromEnv = (import.meta.env.VITE_DEFAULT_TENANT_SLUG as string | undefined)?.trim();
  if (fromEnv) return fromEnv;

  return null;
}

function readInitialTenant(): {
  slug: string | null;
  store: TenantStoreDTO | null;
  isLoading: boolean;
} {
  if (typeof window === 'undefined') {
    return { slug: null, store: null, isLoading: true };
  }
  const resolved = resolveTenantSlug();
  if (!resolved) {
    return { slug: null, store: null, isLoading: false };
  }
  const cached = readStorefrontThemeCache(resolved);
  return {
    slug: resolved,
    store: cached,
    // Cache → peindre tout de suite ; sinon attendre l’API (loader neutre).
    isLoading: !cached,
  };
}

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const initial = useMemo(() => readInitialTenant(), []);
  const [store, setStore] = useState<TenantStoreDTO | null>(initial.store);
  const [slug, setSlug] = useState<string | null>(initial.slug);
  const [isLoading, setIsLoading] = useState(initial.isLoading);
  const [storeUnavailableMessage, setStoreUnavailableMessage] = useState<string | null>(null);

  const isPlatformHost = useMemo(() => isPlatformHostname(), []);

  const refresh = useCallback(async () => {
    const resolved = resolveTenantSlug();
    // Couleurs boutique : uniquement via Layout vitrine (jamais sur :root / admin / Get STORE).
    clearRootStoreTheme();

    if (!resolved) {
      // Sur /admin, le store vient de la session (loadFromAdminSession) — ne pas l’effacer.
      // Sinon « Voir ma boutique » perd le slug et ouvre la landing Get STORE.
      const onAdminSurface = window.location.pathname.startsWith('/admin');
      if (!onAdminSurface) {
        setSlug(null);
        setStoredTenantSlug(null);
        setStore(null);
      }
      setStoreUnavailableMessage(null);
      setIsLoading(false);
      return;
    }

    setSlug(resolved);
    setStoredTenantSlug(resolved);

    const cached = readStorefrontThemeCache(resolved);
    // Hydrate immédiatement pour éviter le flash Get STORE / thème classic.
    if (cached) {
      setStore((prev) => prev ?? cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await platformApi.getStore(resolved);
      setStore(data);
      writeStorefrontThemeCache(resolved, data);
      setStoreUnavailableMessage(null);
      if (data.slug) {
        setSlug(data.slug);
        setStoredTenantSlug(data.slug);
        if (data.slug !== resolved) {
          writeStorefrontThemeCache(data.slug, data);
        }
      }
    } catch (err) {
      // Garde le cache si l’API échoue temporairement.
      if (!cached) {
        setStore(null);
        clearStorefrontThemeCache(resolved);
      }
      const msg = err instanceof Error ? err.message : '';
      setStoreUnavailableMessage(
        msg && /attente|indisponible|suspend|activation/i.test(msg)
          ? msg
          : resolved
            ? 'Boutique temporairement indisponible'
            : null,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromAdminSession = useCallback(async () => {
    try {
      const data = await platformApi.getMyStoreSummary();
      // Résumé admin — inclut thème / typo / apparence pour cohérence vitrine.
      setStore({
        ...data,
        heroEnabled: true,
        categoriesEnabled: true,
        surMesureEnabled: true,
      });
      clearRootStoreTheme();
      if (data.slug) {
        setSlug(data.slug);
        setStoredTenantSlug(data.slug);
        writeStorefrontThemeCache(data.slug, {
          ...data,
          heroEnabled: true,
          categoriesEnabled: true,
          surMesureEnabled: true,
        });
      }
    } catch {
      /* ignore — pas de session admin boutique */
    }
  }, []);

  useEffect(() => {
    clearRootStoreTheme();
    if (initial.slug) {
      setStoredTenantSlug(initial.slug);
    }
    void refresh();
  }, [refresh, initial.slug]);

  const value = useMemo(
    () => ({
      store,
      slug,
      isPlatformHost,
      isLoading,
      storeUnavailableMessage,
      refresh,
      loadFromAdminSession,
    }),
    [
      store,
      slug,
      isPlatformHost,
      isLoading,
      storeUnavailableMessage,
      refresh,
      loadFromAdminSession,
    ],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
