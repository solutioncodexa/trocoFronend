import { buildApiUrl, apiRequest } from '@/config/api';
import { NotificationDTO } from '@/types/api';

export const notificationsApi = {
  getAll: async (): Promise<NotificationDTO[]> => {
    const url = buildApiUrl('/notifications');
    return apiRequest<NotificationDTO[]>(url);
  },

  getUnread: async (): Promise<NotificationDTO[]> => {
    const url = buildApiUrl('/notifications/unread');
    return apiRequest<NotificationDTO[]>(url);
  },

  getUnreadCount: async (): Promise<number> => {
    const url = buildApiUrl('/notifications/unread/count');
    const res = await apiRequest<{ count: number }>(url);
    return res.count;
  },

  markAsRead: async (id: number): Promise<void> => {
    const url = buildApiUrl(`/notifications/${id}/read`);
    await apiRequest<void>(url, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (): Promise<void> => {
    const url = buildApiUrl('/notifications/read-all');
    await apiRequest<void>(url, {
      method: 'PATCH',
    });
  },
};
