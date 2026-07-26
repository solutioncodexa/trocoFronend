import { apiRequest, buildApiUrl, TENANT_SLUG_STORAGE_KEY } from '@/config/api';
import type { CreateStoreLeadPayload, StoreLead } from '@/types/store-leads';

export const storeLeadsApi = {
  submitPublic: (payload: CreateStoreLeadPayload) =>
    apiRequest<StoreLead>(buildApiUrl('/store-leads/public'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  list: () => apiRequest<StoreLead[]>(buildApiUrl('/store-leads')),

  exportCsv: async (filename?: string) => {
    const token = localStorage.getItem('troco_admin_token');
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      const tenantSlug = localStorage.getItem(TENANT_SLUG_STORAGE_KEY);
      if (tenantSlug) headers['X-Fournisseur-Slug'] = tenantSlug;
    } catch {
      /* ignore */
    }
    const response = await fetch(buildApiUrl('/store-leads/export.csv'), { headers });
    if (!response.ok) {
      throw new Error('Export CSV impossible');
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
