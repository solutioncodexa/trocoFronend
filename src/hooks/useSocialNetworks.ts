import { useQuery } from '@tanstack/react-query';
import { socialNetworksApi } from '@/services/api/socialNetworks';
import type { SocialNetworkDTO, SocialNetworkKey } from '@/types/social-networks';
import {
  FACEBOOK_PAGE_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  CONTACT_WHATSAPP_URL,
} from '@/config/site';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const FALLBACK_NETWORKS: SocialNetworkDTO[] = [
  { id: 1, networkKey: 'facebook', label: 'Facebook', url: FACEBOOK_PAGE_URL, enabled: true, displayOrder: 1 },
  { id: 2, networkKey: 'instagram', label: 'Instagram', url: INSTAGRAM_URL, enabled: true, displayOrder: 2 },
  { id: 3, networkKey: 'tiktok', label: 'TikTok', url: TIKTOK_URL, enabled: true, displayOrder: 3 },
  { id: 4, networkKey: 'whatsapp', label: 'WhatsApp', url: CONTACT_WHATSAPP_URL, enabled: true, displayOrder: 4 },
];

export function useSocialNetworks() {
  const query = useQuery({
    queryKey: ['social-networks', 'public'],
    queryFn: () => socialNetworksApi.getPublic(),
    ...staticCatalogQueryOptions,
  });

  const networks = query.isError || !query.data ? FALLBACK_NETWORKS : query.data;

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
