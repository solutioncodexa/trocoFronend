import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { socialNetworksApi } from '@/services/api/socialNetworks';
import type { SocialNetworkDTO, SocialNetworkKey } from '@/types/social-networks';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useStoreBrand } from '@/hooks/useStoreBrand';

function networksFromBrand(brand: {
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  whatsappUrl: string | null;
}): SocialNetworkDTO[] {
  const entries: Array<{ key: SocialNetworkKey; label: string; url: string | null; order: number }> = [
    { key: 'facebook', label: 'Facebook', url: brand.facebookUrl, order: 1 },
    { key: 'instagram', label: 'Instagram', url: brand.instagramUrl, order: 2 },
    { key: 'tiktok', label: 'TikTok', url: brand.tiktokUrl, order: 3 },
    { key: 'whatsapp', label: 'WhatsApp', url: brand.whatsappUrl, order: 4 },
  ];
  return entries
    .filter((e) => !!e.url)
    .map((e, index) => ({
      id: -(index + 1),
      networkKey: e.key,
      label: e.label,
      url: e.url!,
      enabled: true,
      displayOrder: e.order,
    }));
}

export function useSocialNetworks() {
  const brand = useStoreBrand();
  const query = useQuery({
    queryKey: ['social-networks', 'public'],
    queryFn: () => socialNetworksApi.getPublic(),
    ...staticCatalogQueryOptions,
  });

  const brandNetworks = useMemo(
    () =>
      networksFromBrand({
        facebookUrl: brand.facebookUrl,
        instagramUrl: brand.instagramUrl,
        tiktokUrl: brand.tiktokUrl,
        whatsappUrl: brand.whatsappUrl,
      }),
    [brand.facebookUrl, brand.instagramUrl, brand.tiktokUrl, brand.whatsappUrl],
  );

  const networks = useMemo(() => {
    if (query.isError || !query.data || query.data.length === 0) {
      return brandNetworks;
    }
    return query.data;
  }, [query.isError, query.data, brandNetworks]);

  const isEnabled = (key: SocialNetworkKey | string) =>
    networks.some((n) => n.networkKey === key && n.enabled);

  const getUrl = (key: SocialNetworkKey | string) =>
    networks.find((n) => n.networkKey === key && n.enabled)?.url;

  const getNetwork = (key: SocialNetworkKey | string) =>
    networks.find((n) => n.networkKey === key);

  return {
    ...query,
    networks,
    isEnabled,
    getUrl,
    getNetwork,
  };
}
