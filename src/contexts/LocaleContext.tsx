import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import {
  messages,
  interpolate,
  normalizeLocale,
  parseSupportedLocales,
  type MessageKey,
  type StoreLocale,
} from '@/i18n/messages';
import { localeStorageKey } from '@/i18n/localeStorage';
import { formatPrice as formatPriceMad, type PriceDisplayOptions } from '@/utils/formatPrice';

type LocaleContextValue = {
  locale: StoreLocale;
  supportedLocales: StoreLocale[];
  setLocale: (next: StoreLocale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  formatPrice: (madAmount: number) => string;
  priceOptions: PriceDisplayOptions;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function pickInitialLocale(
  slug: string | undefined,
  defaultLocale?: string | null,
  supported?: StoreLocale[],
): StoreLocale {
  const allowed = supported?.length ? supported : (['fr'] as StoreLocale[]);
  const storeDefault = normalizeLocale(defaultLocale);
  const fallback = allowed.includes(storeDefault) ? storeDefault : allowed[0];

  // Priorité URL ?lang= (partage / SEO)
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl) {
      const norm = normalizeLocale(fromUrl);
      if (allowed.includes(norm)) return norm;
    }
  }

  if (slug) {
    try {
      const stored = localStorage.getItem(localeStorageKey(slug));
      if (stored) {
        const norm = normalizeLocale(stored);
        // Préférence visiteurs uniquement si encore dans les langues activées
        if (allowed.includes(norm)) return norm;
        localStorage.removeItem(localeStorageKey(slug));
      }
    } catch {
      /* ignore */
    }
  }

  return fallback;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { store } = useTenant();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = store?.slug;
  const onAdminShell =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  const supportedLocales = useMemo(
    () => parseSupportedLocales(store?.supportedLocales),
    [store?.supportedLocales],
  );

  const [locale, setLocaleState] = useState<StoreLocale>(() =>
    pickInitialLocale(slug, store?.defaultLocale, supportedLocales),
  );

  useEffect(() => {
    setLocaleState(pickInitialLocale(slug, store?.defaultLocale, supportedLocales));
  }, [slug, store?.defaultLocale, supportedLocales]);

  const priceOptions: PriceDisplayOptions = useMemo(
    () => ({
      currency: store?.currency,
      currencyRatesJson: store?.currencyRatesJson,
    }),
    [store?.currency, store?.currencyRatesJson],
  );

  const setLocale = useCallback(
    (next: StoreLocale) => {
      if (!supportedLocales.includes(next)) return;
      setLocaleState(next);
      if (slug) {
        try {
          localStorage.setItem(localeStorageKey(slug), next);
        } catch {
          /* ignore */
        }
      }
      if (!onAdminShell) {
        document.documentElement.lang = next;
        document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      }
      const p = new URLSearchParams(searchParams);
      if (next === 'fr') p.delete('lang');
      else p.set('lang', next);
      setSearchParams(p, { replace: true });
    },
    [slug, supportedLocales, searchParams, setSearchParams, onAdminShell],
  );

  useEffect(() => {
    // L’admin a sa propre langue (AdminLocaleProvider) — ne pas écraser.
    if (onAdminShell) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale, onAdminShell]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const raw = messages[locale][key] ?? messages.fr[key] ?? key;
      return vars ? interpolate(raw, vars) : raw;
    },
    [locale],
  );

  const formatPrice = useCallback(
    (madAmount: number) => formatPriceMad(madAmount, priceOptions),
    [priceOptions],
  );

  const value = useMemo(
    () => ({ locale, supportedLocales, setLocale, t, formatPrice, priceOptions }),
    [locale, supportedLocales, setLocale, t, formatPrice, priceOptions],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

/** Safe when LocaleProvider is absent (e.g. admin shell). */
export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext);
}
