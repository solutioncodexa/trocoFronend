import { buildApiUrl, apiRequest } from '@/config/api';
import type { GoldPriceSettingDTO } from '@/types/api';

export const goldPriceSettingsApi = {
  getSettings: async (): Promise<GoldPriceSettingDTO> => {
    const url = buildApiUrl('/gold-price-settings');
    return apiRequest<GoldPriceSettingDTO>(url);
  },

  updateSettings: async (pricePerGram: number): Promise<GoldPriceSettingDTO> => {
    const url = buildApiUrl('/gold-price-settings');
    return apiRequest<GoldPriceSettingDTO>(url, {
      method: 'PUT',
      body: JSON.stringify({ pricePerGram }),
    });
  },
};

/** Calcule le prix : (grammes × prix au gramme) + gain */
export function calculatePrice(
  weightGrams: number,
  pricePerGram: number,
  marginGain: number
): number {
  return weightGrams * pricePerGram + marginGain;
}
