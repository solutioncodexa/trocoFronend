import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type StoreLang = 'fr' | 'ar';

export function useStoreLang() {
  const [params, setParams] = useSearchParams();
  const lang: StoreLang = params.get('lang')?.toLowerCase().startsWith('ar') ? 'ar' : 'fr';

  const setLang = useCallback(
    (next: StoreLang) => {
      const p = new URLSearchParams(params);
      if (next === 'fr') p.delete('lang');
      else p.set('lang', 'ar');
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
      sp.set('lang', 'ar');
      return `${base}?${sp.toString()}`;
    },
    [lang],
  );

  return useMemo(() => ({ lang, setLang, withLang, isAr: lang === 'ar' }), [lang, setLang, withLang]);
}
