import { buildApiUrl, apiRequest } from '@/config/api';
import type { MemberDTO, PermissionDTO } from '@/types/api';

export interface CreateMemberPayload {
  email: string;
  password: string;
  fullName: string;
  active?: boolean;
  permissions?: string[];
}

export interface UpdateMemberPayload {
  fullName?: string;
  active?: boolean;
  permissions?: string[];
}

export const membersApi = {
  list: () => apiRequest<MemberDTO[]>(buildApiUrl('/admin/members')),

  listPermissions: () =>
    apiRequest<PermissionDTO[]>(buildApiUrl('/admin/members/permissions')),

  create: (data: CreateMemberPayload) =>
    apiRequest<MemberDTO>(buildApiUrl('/admin/members'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateMemberPayload) =>
    apiRequest<MemberDTO>(buildApiUrl(`/admin/members/${id}`), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  activate: (id: number) =>
    apiRequest<MemberDTO>(buildApiUrl(`/admin/members/${id}/activate`), {
      method: 'PUT',
    }),

  deactivate: (id: number) =>
    apiRequest<MemberDTO>(buildApiUrl(`/admin/members/${id}/deactivate`), {
      method: 'PUT',
    }),

  resetPassword: (id: number, password: string) =>
    apiRequest<void>(buildApiUrl(`/admin/members/${id}/password`), {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),

  delete: (id: number) =>
    apiRequest<void>(buildApiUrl(`/admin/members/${id}`), {
      method: 'DELETE',
    }),
};
