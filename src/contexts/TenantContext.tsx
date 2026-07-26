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
import type { StoreSettingsDTO } from '@/types/api';
import { clearRootStoreTheme } from '@/utils/storeTheme';

interface TenantContextType {
  store: StoreSettingsDTO | null;
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
  if (/^(www\.)?matjarona\./i.test(h)) return true;
  return false;
}

export function resolveTenantSlugFromHost(hostname = window.location.hostname): string | null {
  const h = hostname.toLowerCase();
  if (h.endsWith('.localhost')) {
    const sub = h.slice(0, -'.localhost'.length);
    if (sub && !sub.includes('.') && sub !== 'www') return sub;
  }
  const match = h.match(/^([a-z0-9-]+)\.matjarona\./i);
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

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<StoreSettingsDTO | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storeUnavailableMessage, setStoreUnavailableMessage] = useState<string | null>(null);

  const isPlatformHost = useMemo(() => isPlatformHostname(), []);

  const refresh = useCallback(async () => {
    const resolved = resolveTenantSlug();
    setSlug(resolved);
    setStoredTenantSlug(resolved);
    // Couleurs boutique : uniquement via Layout vitrine (jamais sur :root / admin / Matjarona).
    clearRootStoreTheme();

    if (!resolved) {
      setStore(null);
      setStoreUnavailableMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await platformApi.getStore(resolved);
      setStore(data);
      setStoreUnavailableMessage(null);
      if (data.slug) {
        setSlug(data.slug);
        setStoredTenantSlug(data.slug);
      }
    } catch (err) {
      setStore(null);
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
      const data = await platformApi.getMyStoreSettings();
      // Met à jour le state admin uniquement — ne recolorie pas la plateforme.
      setStore(data);
      clearRootStoreTheme();
      if (data.slug) {
        setSlug(data.slug);
        setStoredTenantSlug(data.slug);
      }
    } catch {
      /* ignore — pas de session admin boutique */
    }
  }, []);

  useEffect(() => {
    clearRootStoreTheme();
    void refresh();
  }, [refresh]);

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
