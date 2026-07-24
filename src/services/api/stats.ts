import { buildApiUrl, apiRequest } from '@/config/api';
import type { DashboardStatsDTO, RevenueStatsDTO } from '@/types/stats';

export const statsApi = {
  getRevenue: (from?: string, to?: string) => {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    const suffix = qs.toString() ? `?${qs}` : '';
    return apiRequest<RevenueStatsDTO>(buildApiUrl(`/stats/revenue${suffix}`));
  },

  getDashboard: () => apiRequest<DashboardStatsDTO>(buildApiUrl('/stats/dashboard')),
};
