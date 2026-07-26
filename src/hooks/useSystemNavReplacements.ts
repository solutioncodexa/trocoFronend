import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storePagesApi } from '@/services/api/storePages';
import { SYSTEM_NAV_REPLACEMENTS } from '@/config/pageTemplates';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreLang } from '@/hooks/useStoreLang';

/**
 * Pages custom publiées qui remplacent une entrée menu système
 * (ex. slug `contact` → masque /contact, affiche /page/contact).
 */
export function useSystemNavReplacements() {
  const { store } = useStoreBrand();
  const { isDemo, to } = useStorefrontPath();
  const { lang, withLang } = useStoreLang();

  const { data: customNav = [] } = useQuery({
    queryKey: ['store-pages', 'nav', store?.slug, lang],
    queryFn: () => storePagesApi.publicNav(lang),
    ...staticCatalogQueryOptions,
    enabled: !isDemo,
  });

  const replacedSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const p of customNav) {
      const slug = (p.slug || '').toLowerCase();
      if ((SYSTEM_NAV_REPLACEMENTS as readonly string[]).includes(slug)) {
        set.add(slug);
      }
    }
    return set;
  }, [customNav]);

  const isReplaced = (systemPath: string) => {
    const slug = systemPath.replace(/^\//, '').toLowerCase();
    return replacedSlugs.has(slug);
  };

  /** Lien menu : page custom si remplacée, sinon route système. */
  const navHref = (systemPath: string) => {
    const slug = systemPath.replace(/^\//, '').toLowerCase();
    if (replacedSlugs.has(slug)) return withLang(to(`/page/${slug}`));
    return withLang(to(systemPath));
  };

  return { customNav, replacedSlugs, isReplaced, navHref, isDemo, lang };
}
