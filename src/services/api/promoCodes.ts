import { buildApiUrl, apiRequest } from '@/config/api';
import {
  PromoCodeDTO,
  CreatePromoCodeRequest,
  UpdatePromoCodeRequest,
  ValidatePromoCodeResponse,
  PromoSuggestionDTO,
} from '@/types/promo-codes';

export const promoCodesApi = {
  // ─── Admin: Promo Codes ───────────────────────────────────
  getAll: async (): Promise<PromoCodeDTO[]> => {
    const url = buildApiUrl('/promo-codes');
    return apiRequest<PromoCodeDTO[]>(url);
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

  // ─── Public: Validate code at checkout ────────────────────
  validate: async (code: string, orderTotal: number): Promise<ValidatePromoCodeResponse> => {
    const url = buildApiUrl(`/promo-codes/validate?code=${encodeURIComponent(code)}&orderTotal=${orderTotal}`);
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },

  // ─── Public: Get nearby promo suggestions based on cart total ──
  getSuggestions: async (orderTotal: number): Promise<PromoSuggestionDTO[]> => {
    const url = buildApiUrl(`/promo-codes/suggestions?orderTotal=${orderTotal}`);
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },

  // ─── Public: Get all active public promo codes ────────────
  getPublicCodes: async (): Promise<PromoCodeDTO[]> => {
    const url = buildApiUrl('/promo-codes/public');
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.data !== undefined) return data.data;
    return data;
  },
};
