import { buildApiUrl, apiRequest } from '@/config/api';
import type { GoldTypeDTO } from '@/types/api';

export const goldTypesApi = {
  getAllGoldTypes: async (): Promise<GoldTypeDTO[]> => {
    const url = buildApiUrl('/gold-types');
    return apiRequest<GoldTypeDTO[]>(url);
  },

  createGoldType: async (data: Omit<GoldTypeDTO, 'id'>): Promise<GoldTypeDTO> => {
    const url = buildApiUrl('/gold-types');
    return apiRequest<GoldTypeDTO>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGoldType: async (id: number, data: Partial<GoldTypeDTO>): Promise<GoldTypeDTO> => {
    const url = buildApiUrl(`/gold-types/${id}`);
    return apiRequest<GoldTypeDTO>(url, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    });
  },

  deleteGoldType: async (id: number): Promise<void> => {
    const url = buildApiUrl(`/gold-types/${id}`);
    return apiRequest<void>(url, { method: 'DELETE' });
  },
};
