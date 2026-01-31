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

  // Créer une commande personnalisée (JSON)
  createCustomOrder: async (customOrder: Partial<CustomOrderDTO>): Promise<CustomOrderDTO> => {
    const url = buildApiUrl('/custom-orders');
    return apiRequest<CustomOrderDTO>(url, {
      method: 'POST',
      body: JSON.stringify(customOrder),
    });
  },

  // Créer une commande personnalisée avec images (multipart)
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
