import { buildApiUrl, apiRequest } from '@/config/api';
import { CartDTO, CartItemDTO } from '@/types/api';

// Helper pour obtenir ou créer un sessionId
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const cartApi = {
  // Récupérer le panier
  getCart: async (): Promise<CartDTO> => {
    const sessionId = getSessionId();
    const url = buildApiUrl(`/cart?sessionId=${sessionId}`);
    return apiRequest<CartDTO>(url);
  },

  // Ajouter un article au panier
  addItemToCart: async (productId: string, quantity: number): Promise<CartDTO> => {
    const sessionId = getSessionId();
    const url = buildApiUrl(`/cart/items?sessionId=${sessionId}`);
    return apiRequest<CartDTO>(url, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Mettre à jour la quantité d'un article
  updateItemQuantity: async (itemId: number, quantity: number): Promise<CartDTO> => {
    const sessionId = getSessionId();
    const url = buildApiUrl(`/cart/items/${itemId}?sessionId=${sessionId}`);
    return apiRequest<CartDTO>(url, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Supprimer un article du panier
  removeItemFromCart: async (itemId: number): Promise<CartDTO> => {
    const sessionId = getSessionId();
    const url = buildApiUrl(`/cart/items/${itemId}?sessionId=${sessionId}`);
    return apiRequest<CartDTO>(url, {
      method: 'DELETE',
    });
  },

  // Vider le panier
  clearCart: async (): Promise<void> => {
    const sessionId = getSessionId();
    const url = buildApiUrl(`/cart?sessionId=${sessionId}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
