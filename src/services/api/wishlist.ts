import { buildApiUrl, apiRequest } from '@/config/api';
import { ProductDTO } from '@/types/api';

// Helper pour obtenir un customerId (pour l'instant, utiliser un ID par défaut ou depuis localStorage)
const getCustomerId = (): number => {
  // Pour l'instant, utiliser un ID par défaut
  // Dans une vraie application, cela viendrait de l'authentification
  const storedId = localStorage.getItem('customerId');
  return storedId ? parseInt(storedId, 10) : 1;
};

export const wishlistApi = {
  // Récupérer la wishlist
  getWishlist: async (customerId?: number): Promise<ProductDTO[]> => {
    const id = customerId || getCustomerId();
    const url = buildApiUrl(`/wishlist/${id}`);
    return apiRequest<ProductDTO[]>(url, {}, true);
  },

  // Ajouter un produit à la wishlist
  addToWishlist: async (productId: string, customerId?: number): Promise<void> => {
    const id = customerId || getCustomerId();
    const url = buildApiUrl(`/wishlist/${id}/products/${productId}`);
    return apiRequest<void>(url, {
      method: 'POST',
    }, true);
  },

  // Supprimer un produit de la wishlist
  removeFromWishlist: async (productId: string, customerId?: number): Promise<void> => {
    const id = customerId || getCustomerId();
    const url = buildApiUrl(`/wishlist/${id}/products/${productId}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    }, true);
  },

  // Vider la wishlist
  clearWishlist: async (customerId?: number): Promise<void> => {
    const id = customerId || getCustomerId();
    const url = buildApiUrl(`/wishlist/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    }, true);
  },
};
