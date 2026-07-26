import { buildApiUrl, apiRequest } from '@/config/api';
import type { AbandonedCartDTO, CaptureAbandonedCartRequest } from '@/types/api';

export const abandonedCartsApi = {
  capture: (payload: CaptureAbandonedCartRequest): Promise<AbandonedCartDTO> =>
    apiRequest<AbandonedCartDTO>(buildApiUrl('/abandoned-carts/public/capture'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  recover: (token: string): Promise<AbandonedCartDTO> =>
    apiRequest<AbandonedCartDTO>(buildApiUrl(`/abandoned-carts/public/recover/${encodeURIComponent(token)}`)),

  markRecovered: (sessionKey: string): Promise<void> =>
    apiRequest<void>(buildApiUrl('/abandoned-carts/public/recovered'), {
      method: 'POST',
      body: JSON.stringify({ sessionKey }),
    }),

  listAdmin: (): Promise<AbandonedCartDTO[]> =>
    apiRequest<AbandonedCartDTO[]>(buildApiUrl('/abandoned-carts')),
};
