import { buildApiUrl, apiRequest } from '@/config/api';
import type { PageResponse } from '@/types/api';
import type {
  StockAdjustRequest,
  StockMovementDTO,
  StockOverviewDTO,
  StockSettingsDTO,
  StockVariantPatchRequest,
  StockVariantRowDTO,
} from '@/types/stock';

export const stockApi = {
  getSettings: () => apiRequest<StockSettingsDTO>(buildApiUrl('/stock/settings')),

  updateSettings: (data: Partial<StockSettingsDTO>) =>
    apiRequest<StockSettingsDTO>(buildApiUrl('/stock/settings'), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getOverview: () => apiRequest<StockOverviewDTO>(buildApiUrl('/stock/overview')),

  listVariants: (filter = 'all', page = 0, size = 50) =>
    apiRequest<PageResponse<StockVariantRowDTO>>(
      buildApiUrl(
        `/stock/variants?filter=${encodeURIComponent(filter)}&page=${page}&size=${size}`,
      ),
    ),

  listMovements: (params: { page?: number; size?: number; variantId?: number; type?: string } = {}) => {
    const qs = new URLSearchParams();
    qs.set('page', String(params.page ?? 0));
    qs.set('size', String(params.size ?? 20));
    if (params.variantId != null) qs.set('variantId', String(params.variantId));
    if (params.type && params.type !== 'all') qs.set('type', params.type);
    return apiRequest<PageResponse<StockMovementDTO>>(buildApiUrl(`/stock/movements?${qs}`));
  },

  adjust: (data: StockAdjustRequest) =>
    apiRequest<StockVariantRowDTO>(buildApiUrl('/stock/adjust'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  patchVariant: (id: number, data: StockVariantPatchRequest) =>
    apiRequest<StockVariantRowDTO>(buildApiUrl(`/stock/variants/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  bulkSafety: (data: { clearOverrides?: boolean; safetyStock?: number }) =>
    apiRequest<{ updated: number }>(buildApiUrl('/stock/variants/bulk-safety'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
