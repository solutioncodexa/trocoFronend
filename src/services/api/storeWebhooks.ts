import { apiRequest, buildApiUrl } from '@/config/api';
import type {
  StoreWebhook,
  StoreWebhookDelivery,
  UpsertStoreWebhookPayload,
} from '@/types/store-webhooks';

export const storeWebhooksApi = {
  list: () => apiRequest<StoreWebhook[]>(buildApiUrl('/store-webhooks')),

  deliveries: () =>
    apiRequest<StoreWebhookDelivery[]>(buildApiUrl('/store-webhooks/deliveries')),

  create: (payload: UpsertStoreWebhookPayload) =>
    apiRequest<StoreWebhook>(buildApiUrl('/store-webhooks'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpsertStoreWebhookPayload) =>
    apiRequest<StoreWebhook>(buildApiUrl(`/store-webhooks/${id}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiRequest<void>(buildApiUrl(`/store-webhooks/${id}`), { method: 'DELETE' }),
};
