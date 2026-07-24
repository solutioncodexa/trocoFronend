import { buildApiUrl, apiRequest } from '@/config/api';
import type { SocialNetworkDTO } from '@/types/social-networks';

export const socialNetworksApi = {
  getPublic: () =>
    apiRequest<SocialNetworkDTO[]>(buildApiUrl('/social-networks/public')),

  getAll: () =>
    apiRequest<SocialNetworkDTO[]>(buildApiUrl('/social-networks')),

  updateBatch: (updates: Partial<SocialNetworkDTO>[]) =>
    apiRequest<SocialNetworkDTO[]>(buildApiUrl('/social-networks'), {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};
