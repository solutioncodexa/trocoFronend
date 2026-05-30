import { buildApiUrl, apiRequest } from '@/config/api';
import { CustomOrderDTO, CustomOrderStatsDTO, PageResponse } from '@/types/api';

export interface CustomOrderQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  status?: string;
  keyword?: string;
}

function buildCustomOrdersQueryString(params: CustomOrderQueryParams): string {
  const {
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDir = 'DESC',
    status,
    keyword,
  } = params;

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('sortBy', sortBy);
  qs.set('sortDir', sortDir);
  if (status && status !== 'all') qs.set('status', status);
  if (keyword?.trim()) qs.set('keyword', keyword.trim());
  return qs.toString();
}

export const customOrdersApi = {
  getAllCustomOrders: async (params: CustomOrderQueryParams = {}): Promise<PageResponse<CustomOrderDTO>> => {
    const qs = buildCustomOrdersQueryString(params);
    return apiRequest<PageResponse<CustomOrderDTO>>(buildApiUrl(`/custom-orders?${qs}`));
  },

  getStats: async (): Promise<CustomOrderStatsDTO> => {
    return apiRequest<CustomOrderStatsDTO>(buildApiUrl('/custom-orders/stats'));
  },

  getCustomOrderById: async (id: string): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}`);
    return apiRequest<CustomOrderDTO>(url);
  },

  getCustomOrdersByStatus: async (status: string): Promise<CustomOrderDTO[]> => {
    const url = buildApiUrl(`/custom-orders/status/${status}`);
    return apiRequest<CustomOrderDTO[]>(url);
  },

  createCustomOrder: async (customOrder: Partial<CustomOrderDTO>): Promise<CustomOrderDTO> => {
    const url = buildApiUrl('/custom-orders');
    return apiRequest<CustomOrderDTO>(url, {
      method: 'POST',
      body: JSON.stringify(customOrder),
    });
  },

  createCustomOrderWithImages: async (
    customOrder: Partial<CustomOrderDTO>,
    images: File[]
  ): Promise<CustomOrderDTO> => {
    const url = buildApiUrl('/custom-orders/submit');
    const formData = new FormData();
    formData.append('order', new Blob([JSON.stringify(customOrder)], { type: 'application/json' }));
    images.forEach((f) => formData.append('images', f));

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi' }));
      throw new Error(err.message || `Erreur ${response.status}`);
    }

    const data = await response.json();
    return (data?.data ?? data) as CustomOrderDTO;
  },

  updateCustomOrderStatus: async (id: string, status: string): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}/status`);
    return apiRequest<CustomOrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  updateEstimatedPrice: async (id: string, estimatedPrice: number): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}/price`);
    return apiRequest<CustomOrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ estimatedPrice }),
    });
  },

  deleteCustomOrder: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/custom-orders/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
