import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalizeLocale, type StoreLocale } from '@/i18n/messages';

/** Langue vitrine alignée sur ?lang= (fr | ar | en). */
export function useStoreLang() {
  const [params, setParams] = useSearchParams();
  const lang: StoreLocale = normalizeLocale(params.get('lang'));

  const setLang = useCallback(
    (next: StoreLocale) => {
      const p = new URLSearchParams(params);
      if (next === 'fr') p.delete('lang');
      else p.set('lang', next);
      setParams(p, { replace: true });
      try {
        localStorage.setItem('matjarona_store_lang', next);
      } catch {
        /* ignore */
      }
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    },
    [params, setParams],
  );

  const withLang = useCallback(
    (path: string) => {
      if (lang === 'fr') return path;
      const [base, qs] = path.split('?');
      const sp = new URLSearchParams(qs || '');
      sp.set('lang', lang);
      return `${base}?${sp.toString()}`;
    },
    [lang],
  );

  return useMemo(
    () => ({ lang, setLang, withLang, isAr: lang === 'ar' }),
    [lang, setLang, withLang],
  );
}
