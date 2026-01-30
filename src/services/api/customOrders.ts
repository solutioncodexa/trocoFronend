import { buildApiUrl, apiRequest } from '@/config/api';
import { CustomOrderDTO } from '@/types/api';

export const customOrdersApi = {
  // Récupérer toutes les commandes personnalisées
  getAllCustomOrders: async (): Promise<CustomOrderDTO[]> => {
    const url = buildApiUrl('/custom-orders');
    return apiRequest<CustomOrderDTO[]>(url);
  },

  // Récupérer une commande personnalisée par ID
  getCustomOrderById: async (id: string): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}`);
    return apiRequest<CustomOrderDTO>(url);
  },

  // Récupérer les commandes personnalisées par statut
  getCustomOrdersByStatus: async (status: string): Promise<CustomOrderDTO[]> => {
    const url = buildApiUrl(`/custom-orders/status/${status}`);
    return apiRequest<CustomOrderDTO[]>(url);
  },

  // Créer une commande personnalisée
  createCustomOrder: async (customOrder: Partial<CustomOrderDTO>): Promise<CustomOrderDTO> => {
    const url = buildApiUrl('/custom-orders');
    return apiRequest<CustomOrderDTO>(url, {
      method: 'POST',
      body: JSON.stringify(customOrder),
    });
  },

  // Mettre à jour le statut d'une commande personnalisée
  updateCustomOrderStatus: async (id: string, status: string): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}/status`);
    return apiRequest<CustomOrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Mettre à jour le prix estimé
  updateEstimatedPrice: async (id: string, estimatedPrice: number): Promise<CustomOrderDTO> => {
    const url = buildApiUrl(`/custom-orders/${id}/price`);
    return apiRequest<CustomOrderDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify({ estimatedPrice }),
    });
  },

  // Supprimer une commande personnalisée
  deleteCustomOrder: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/custom-orders/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
