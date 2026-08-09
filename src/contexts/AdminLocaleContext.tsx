import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { interpolate, normalizeLocale } from '@/i18n/messages';
import {
  ADMIN_LOCALES,
  ADMIN_LOCALE_STORAGE_KEY,
  adminMessages,
  type AdminLocale,
  type AdminMessageKey,
} from '@/i18n/admin/adminMessages';

type AdminLocaleContextValue = {
  locale: AdminLocale;
  setLocale: (next: AdminLocale) => void;
  t: (key: AdminMessageKey, vars?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

function readStoredAdminLocale(): AdminLocale {
  try {
    const stored = localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY);
    if (stored) return normalizeLocale(stored);
  } catch {
    /* ignore */
  }
  return 'fr';
}

function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
}

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [locale, setLocaleState] = useState<AdminLocale>(() => readStoredAdminLocale());
  const onAdmin = isAdminPath(location.pathname);

  const setLocale = useCallback((next: AdminLocale) => {
    if (!ADMIN_LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!onAdmin) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale, onAdmin]);

  const t = useCallback(
    (key: AdminMessageKey, vars?: Record<string, string | number>) => {
      const raw = adminMessages[locale][key] ?? adminMessages.fr[key] ?? key;
      return vars ? interpolate(raw, vars) : raw;
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      dir: (locale === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
    }),
    [locale, setLocale, t],
  );

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale(): AdminLocaleContextValue {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  }
  return ctx;
}

export function useAdminLocaleOptional(): AdminLocaleContextValue | null {
  return useContext(AdminLocaleContext);
}
