import { buildApiUrl, apiRequest } from '@/config/api';

export const privacyApi = {
  exportSubject: (params: { email?: string; phone?: string }): Promise<Record<string, unknown>> => {
    const qs = new URLSearchParams();
    if (params.email?.trim()) qs.set('email', params.email.trim());
    if (params.phone?.trim()) qs.set('phone', params.phone.trim());
    return apiRequest<Record<string, unknown>>(buildApiUrl(`/privacy/export?${qs.toString()}`));
  },

  eraseSubject: (params: { email?: string; phone?: string }): Promise<Record<string, unknown>> =>
    apiRequest<Record<string, unknown>>(buildApiUrl('/privacy/erase'), {
      method: 'POST',
      body: JSON.stringify({
        email: params.email?.trim() || undefined,
        phone: params.phone?.trim() || undefined,
      }),
    }),
};
