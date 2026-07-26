import { buildApiUrl, apiRequest } from '@/config/api';

export type StoreApiKeyListItem = {
  id: number;
  name: string;
  keyPrefix: string;
  scopes: string;
  enabled: boolean;
  lastUsedAt?: string | null;
  createdAt?: string;
  revokedAt?: string | null;
};

export type StoreApiKeyCreated = StoreApiKeyListItem & {
  apiKey: string;
};

export const apiKeysApi = {
  list: (): Promise<StoreApiKeyListItem[]> =>
    apiRequest<StoreApiKeyListItem[]>(buildApiUrl('/api-keys')),

  create: (body: { name: string; scopes?: string }): Promise<StoreApiKeyCreated> =>
    apiRequest<StoreApiKeyCreated>(buildApiUrl('/api-keys'), {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  revoke: (id: number): Promise<void> =>
    apiRequest<void>(buildApiUrl(`/api-keys/${id}`), { method: 'DELETE' }),
};
