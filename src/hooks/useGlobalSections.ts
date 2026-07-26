import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storeGlobalSectionsApi } from '@/services/api/storeGlobalSections';
import { resolveTenantSlug } from '@/contexts/TenantContext';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import {
  parseFooterLinksConfig,
  parseMegaMenuConfig,
  parseStickyCtaConfig,
  type FooterLinksConfig,
  type GlobalSectionKey,
  type MegaMenuConfig,
  type StickyCtaConfig,
  type StoreGlobalSection,
} from '@/types/store-global-sections';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';

export function useGlobalSections() {
  const { isDemo } = useStorefrontPath();
  const slug = resolveTenantSlug();
  const enabled = !!slug && !isDemo;

  const query = useQuery({
    queryKey: ['store-global-sections', 'public', slug],
    queryFn: () => storeGlobalSectionsApi.listPublic(),
    enabled,
    ...staticCatalogQueryOptions,
  });

  const byKey = useMemo(() => {
    const map = new Map<GlobalSectionKey, StoreGlobalSection>();
    for (const section of query.data ?? []) {
      const key = section.sectionKey as GlobalSectionKey;
      map.set(key, section);
    }
    return map;
  }, [query.data]);

  const megaMenuSection = byKey.get('mega_menu');
  const footerLinksSection = byKey.get('footer_links');
  const stickyCtaSection = byKey.get('sticky_cta');

  const megaMenuConfig = useMemo(
    (): MegaMenuConfig | null =>
      megaMenuSection?.enabled ? parseMegaMenuConfig(megaMenuSection.config) : null,
    [megaMenuSection],
  );

  const footerLinksConfig = useMemo(
    (): FooterLinksConfig | null =>
      footerLinksSection?.enabled ? parseFooterLinksConfig(footerLinksSection.config) : null,
    [footerLinksSection],
  );

  const stickyCtaConfig = useMemo((): StickyCtaConfig | null => {
    if (!stickyCtaSection?.enabled) return null;
    return parseStickyCtaConfig(stickyCtaSection.config);
  }, [stickyCtaSection]);

  const useMegaMenuNav =
    !!megaMenuConfig && megaMenuConfig.items.length > 0;

  return {
    ...query,
    sections: query.data ?? [],
    megaMenuConfig,
    footerLinksConfig,
    stickyCtaConfig,
    useMegaMenuNav,
  };
}
