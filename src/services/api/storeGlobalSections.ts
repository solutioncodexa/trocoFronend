import { apiRequest, buildApiUrl } from '@/config/api';
import type { StoreGlobalSection, UpsertGlobalSectionPayload } from '@/types/store-global-sections';

export const storeGlobalSectionsApi = {
  listPublic: () =>
    apiRequest<StoreGlobalSection[]>(buildApiUrl('/store-global-sections/public')),

  listAdmin: () => apiRequest<StoreGlobalSection[]>(buildApiUrl('/store-global-sections')),

  upsert: (payload: UpsertGlobalSectionPayload) =>
    apiRequest<StoreGlobalSection>(buildApiUrl('/store-global-sections'), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
