import { apiDownload, apiRequest, buildApiUrl } from '@/config/api';

export type MarketConfig = {
  payzoneEnabled?: boolean;
  transferEnabled?: boolean;
  transferInstructions?: string | null;
  metaCatalogPath?: string;
  campaign?: {
    code: string;
    title: string;
    discountPercent?: number | null;
  } | null;
};

export type EmailTemplates = {
  note?: string | null;
  signature?: string | null;
};

export type CityRate = {
  id: number;
  carrierCode: string;
  city: string;
  fee: number;
};

export type SeasonalCampaign = {
  id?: number;
  code: string;
  title: string;
  discountPercent?: number | null;
  startsOn?: string | null;
  endsOn?: string | null;
  enabled: boolean;
};

export type ReferralCode = {
  id?: number;
  code: string;
  rewardMad: number;
  referrerLabel?: string | null;
  usesCount?: number;
};

export type OrderReturnRow = {
  id: number;
  orderId: number;
  reason?: string | null;
  status: string;
  refundAmount?: number | null;
  customerPhone?: string | null;
};

function asObject<T>(value: T | unknown[]): T | null {
  if (!value || Array.isArray(value)) return null;
  return value;
}

export const marketApi = {
  publicConfig: async (): Promise<MarketConfig | null> =>
    asObject(await apiRequest<MarketConfig | unknown[]>(buildApiUrl('/market/public/config'), { skipAuth: true })),

  updateConfig: (body: Partial<MarketConfig>) =>
    apiRequest<MarketConfig>(buildApiUrl('/market/config'), { method: 'PUT', body: JSON.stringify(body) }),

  emailTemplates: async (): Promise<EmailTemplates | null> =>
    asObject(await apiRequest<EmailTemplates | unknown[]>(buildApiUrl('/market/email-templates'))),

  updateEmailTemplates: (body: EmailTemplates) =>
    apiRequest<EmailTemplates>(buildApiUrl('/market/email-templates'), { method: 'PUT', body: JSON.stringify(body) }),

  cityRates: () => apiRequest<CityRate[]>(buildApiUrl('/market/city-rates')),

  upsertCityRate: (body: { carrierCode: string; city: string; fee: number }) =>
    apiRequest<CityRate>(buildApiUrl('/market/city-rates'), { method: 'PUT', body: JSON.stringify(body) }),

  deleteCityRate: (id: number) =>
    apiRequest<void>(buildApiUrl(`/market/city-rates/${id}`), { method: 'DELETE' }),

  campaigns: () => apiRequest<SeasonalCampaign[]>(buildApiUrl('/market/campaigns')),

  saveCampaign: (body: SeasonalCampaign) =>
    apiRequest<SeasonalCampaign>(buildApiUrl('/market/campaigns'), { method: 'PUT', body: JSON.stringify(body) }),

  referrals: () => apiRequest<ReferralCode[]>(buildApiUrl('/market/referrals')),

  saveReferral: (body: { code: string; rewardMad: number; referrerLabel?: string }) =>
    apiRequest<ReferralCode>(buildApiUrl('/market/referrals'), { method: 'PUT', body: JSON.stringify(body) }),

  previewReferral: (code: string) =>
    apiRequest<{ code: string; rewardMad: number }>(
      buildApiUrl(`/market/public/referral?code=${encodeURIComponent(code)}`),
      { skipAuth: true },
    ),

  requestReturn: (body: { orderNumber: string; phone: string; reason?: string }) =>
    apiRequest<OrderReturnRow>(buildApiUrl('/market/public/returns'), {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(body),
    }),

  returns: () => apiRequest<OrderReturnRow[]>(buildApiUrl('/market/returns')),

  updateReturn: (id: number, status: string) =>
    apiRequest<OrderReturnRow>(buildApiUrl(`/market/returns/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  downloadOrdersCsv: () => apiDownload(buildApiUrl('/market/orders.csv'), 'commandes.csv'),
};
