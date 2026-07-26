import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import {
  messages,
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
  t: (key: MessageKey) => string;
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
  if (slug) {
    try {
      const stored = localStorage.getItem(localeStorageKey(slug));
      if (stored) {
        const norm = normalizeLocale(stored);
        if (allowed.includes(norm)) return norm;
      }
    } catch {
      /* ignore */
    }
  }
  const fromStore = normalizeLocale(defaultLocale);
  if (allowed.includes(fromStore)) return fromStore;
  return allowed[0];
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { store } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = store?.slug;

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
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      const p = new URLSearchParams(searchParams);
      if (next === 'ar') p.set('lang', 'ar');
      else p.delete('lang');
      setSearchParams(p, { replace: true });
    },
    [slug, supportedLocales, searchParams, setSearchParams],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = useCallback((key: MessageKey) => messages[locale][key] ?? messages.fr[key], [locale]);

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
