import { buildApiUrl, apiRequest } from '@/config/api';
import type { PageResponse } from '@/types/api';
import {
  PromoCodeDTO,
  PromoCodeListItemDTO,
  PromoCodeStatsDTO,
  CreatePromoCodeRequest,
  UpdatePromoCodeRequest,
  ValidatePromoCodeResponse,
  PromoSuggestionDTO,
} from '@/types/promo-codes';

export interface PromoCodeQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  keyword?: string;
}

function buildPromoCodesQueryString(params: PromoCodeQueryParams): string {
  const {
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDir = 'DESC',
    keyword,
  } = params;

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('sortBy', sortBy);
  qs.set('sortDir', sortDir);
  if (keyword?.trim()) qs.set('keyword', keyword.trim());
  return qs.toString();
}

export const promoCodesApi = {
  getAll: async (params: PromoCodeQueryParams = {}): Promise<PageResponse<PromoCodeListItemDTO>> => {
    const qs = buildPromoCodesQueryString(params);
    return apiRequest<PageResponse<PromoCodeListItemDTO>>(buildApiUrl(`/promo-codes?${qs}`));
  },

  getStats: async (): Promise<PromoCodeStatsDTO> => {
    return apiRequest<PromoCodeStatsDTO>(buildApiUrl('/promo-codes/stats'));
  },

  getById: async (id: number): Promise<PromoCodeDTO> => {
    const url = buildApiUrl(`/promo-codes/${id}`);
    return apiRequest<PromoCodeDTO>(url);
  },

  create: async (data: CreatePromoCodeRequest): Promise<PromoCodeDTO> => {
    const url = buildApiUrl('/promo-codes');
    return apiRequest<PromoCodeDTO>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdatePromoCodeRequest): Promise<PromoCodeDTO> => {
    const url = buildApiUrl(`/promo-codes/${id}`);
    return apiRequest<PromoCodeDTO>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    const url = buildApiUrl(`/promo-codes/${id}`);
    return apiRequest<void>(url, { method: 'DELETE' });
  },

  toggleActive: async (id: number, isActive: boolean): Promise<PromoCodeDTO> => {
    const url = buildApiUrl(`/promo-codes/${id}/toggle?isActive=${isActive}`);
    return apiRequest<PromoCodeDTO>(url, { method: 'PATCH' });
  },

  generateCode: async (): Promise<string> => {
    const url = buildApiUrl('/promo-codes/generate');
    return apiRequest<string>(url);
  },

  validate: async (code: string, orderTotal: number): Promise<ValidatePromoCodeResponse> => {
    const url = buildApiUrl(`/promo-codes/validate?code=${encodeURIComponent(code)}&orderTotal=${orderTotal}`);
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },

  getSuggestions: async (orderTotal: number): Promise<PromoSuggestionDTO[]> => {
    const url = buildApiUrl(`/promo-codes/suggestions?orderTotal=${orderTotal}`);
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },

  getPublicCodes: async (): Promise<PromoCodeDTO[]> => {
    const url = buildApiUrl('/promo-codes/public');
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },
};
