import { buildApiUrl, apiRequest } from '@/config/api';
import type { ShippingCarrierDTO } from '@/types/api';

export const shippingApi = {
  getPublic: (subtotal?: number): Promise<ShippingCarrierDTO[]> => {
    const qs = new URLSearchParams();
    if (subtotal !== undefined && Number.isFinite(subtotal)) {
      qs.set('subtotal', String(subtotal));
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return apiRequest<ShippingCarrierDTO[]>(buildApiUrl(`/shipping-carriers/public${suffix}`));
  },

  quote: (
    carrierCode: string,
    subtotal: number,
  ): Promise<{ carrierCode: string; subtotal: number; shippingFee: number }> => {
    const qs = new URLSearchParams({
      carrierCode,
      subtotal: String(subtotal),
    });
    return apiRequest(buildApiUrl(`/shipping-carriers/public/quote?${qs.toString()}`));
  },

  listAdmin: (): Promise<ShippingCarrierDTO[]> =>
    apiRequest<ShippingCarrierDTO[]>(buildApiUrl('/shipping-carriers')),

  upsert: (body: ShippingCarrierDTO): Promise<ShippingCarrierDTO> =>
    apiRequest<ShippingCarrierDTO>(buildApiUrl('/shipping-carriers'), {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};
