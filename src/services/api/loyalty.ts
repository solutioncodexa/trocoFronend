import { buildApiUrl, apiRequest } from '@/config/api';

export type LoyaltyBalanceDTO = {
  enabled: boolean;
  points: number;
  pointsPerMad?: number;
  madPerPoint?: number;
};

export const loyaltyApi = {
  getBalance: (phone: string): Promise<LoyaltyBalanceDTO> => {
    const qs = new URLSearchParams({ phone: phone.trim() });
    return apiRequest<LoyaltyBalanceDTO>(buildApiUrl(`/loyalty/public/balance?${qs.toString()}`));
  },
};
