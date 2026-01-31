import { buildApiUrl, apiRequest } from '@/config/api';
import type { GoldPriceDTO } from '@/types/api';

export const goldPricesApi = {
  getGoldPrices: async (): Promise<GoldPriceDTO> => {
    const url = buildApiUrl('/gold-prices');
    return apiRequest<GoldPriceDTO>(url);
  },
};
