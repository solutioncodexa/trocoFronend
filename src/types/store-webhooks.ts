export type StoreWebhookEvent = 'order.created' | 'lead.created';

export type StoreWebhook = {
  id: number;
  name: string;
  targetUrl: string;
  /** Présent uniquement juste après création. */
  secret?: string | null;
  hasSecret?: boolean;
  events: StoreWebhookEvent[];
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StoreWebhookDelivery = {
  id: number;
  webhookId: number;
  eventType: string;
  statusCode?: number | null;
  success: boolean;
  errorMessage?: string | null;
  createdAt?: string;
};

export type UpsertStoreWebhookPayload = {
  name: string;
  targetUrl: string;
  secret?: string;
  events: StoreWebhookEvent[];
  enabled?: boolean;
};
