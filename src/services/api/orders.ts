import { buildApiUrl, apiRequest } from '@/config/api';
import { OrderCreatedDTO, OrderDTO, OrderListItemDTO, PageResponse } from '@/types/api';

export interface OrderQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  status?: string;
  keyword?: string;
}

function buildOrdersQueryString(params: OrderQueryParams): string {
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

export const ordersApi = {
  getAllOrders: async (params: OrderQueryParams = {}): Promise<PageResponse<OrderListItemDTO>> => {
    const qs = buildOrdersQueryString(params);
    return apiRequest<PageResponse<OrderListItemDTO>>(buildApiUrl(`/orders?${qs}`));
  },

  getOrderById: async (id: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/${id}`);
    return apiRequest<OrderDTO>(url);
  },

  getOrderByNumber: async (orderNumber: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/number/${orderNumber}`);
    return apiRequest<OrderDTO>(url);
  },

  getOrdersByStatus: async (status: string): Promise<OrderListItemDTO[]> => {
    const url = buildApiUrl(`/orders/status/${status}`);
    return apiRequest<OrderListItemDTO[]>(url);
  },

  createOrder: async (order: OrderDTO): Promise<OrderCreatedDTO> => {
    const url = buildApiUrl('/orders');
    // skipAuth : le JWT admin ne doit pas écraser le tenant vitrine (Host / slug).
    return apiRequest<OrderCreatedDTO>(url, {
      method: 'POST',
      body: JSON.stringify(order),
      skipAuth: true,
    });
  },

  updateOrderStatus: async (id: string, status: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/${id}/status`);
    return apiRequest<OrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  deleteOrder: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/orders/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
