import { buildApiUrl, apiRequest } from '@/config/api';
import { OrderDTO } from '@/types/api';

export const ordersApi = {
  // Récupérer toutes les commandes
  getAllOrders: async (): Promise<OrderDTO[]> => {
    const url = buildApiUrl('/orders');
    return apiRequest<OrderDTO[]>(url);
  },

  // Récupérer une commande par ID
  getOrderById: async (id: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/${id}`);
    return apiRequest<OrderDTO>(url);
  },

  // Récupérer une commande par numéro
  getOrderByNumber: async (orderNumber: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/number/${orderNumber}`);
    return apiRequest<OrderDTO>(url);
  },

  // Récupérer les commandes par statut
  getOrdersByStatus: async (status: string): Promise<OrderDTO[]> => {
    const url = buildApiUrl(`/orders/status/${status}`);
    return apiRequest<OrderDTO[]>(url);
  },

  // Créer une commande
  createOrder: async (order: OrderDTO): Promise<OrderDTO> => {
    const url = buildApiUrl('/orders');
    return apiRequest<OrderDTO>(url, {
      method: 'POST',
      body: JSON.stringify(order),
    }, true); // skipAuth = true pour les commandes client
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (id: string, status: string): Promise<OrderDTO> => {
    const url = buildApiUrl(`/orders/${id}/status`);
    return apiRequest<OrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Supprimer une commande
  deleteOrder: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/orders/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
