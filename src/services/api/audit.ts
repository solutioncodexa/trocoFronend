import { buildApiUrl, apiRequest } from '@/config/api';
import type { AuditLogDTO, PageResponse } from '@/types/api';

export const auditApi = {
  search: (params: {
    userId?: number;
    action?: string;
    entity?: string;
    page?: number;
    size?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    qs.set('page', String(params.page ?? 0));
    qs.set('size', String(params.size ?? 20));
    if (params.userId != null) qs.set('userId', String(params.userId));
    if (params.action) qs.set('action', params.action);
    if (params.entity) qs.set('entity', params.entity);
    return apiRequest<PageResponse<AuditLogDTO>>(buildApiUrl(`/admin/audit?${qs}`));
  },
};
