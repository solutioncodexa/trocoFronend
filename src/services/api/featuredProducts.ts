import { buildApiUrl, apiRequest } from '@/config/api';
import type {
  FeaturedProductDTO,
  CreateFeaturedProductRequest,
  UpdateFeaturedProductRequest,
} from '@/types/featured-products';

export const featuredProductsApi = {
  /** Public / home : actifs uniquement */
  getAllFeaturedProducts: () =>
    apiRequest<FeaturedProductDTO[]>(buildApiUrl('/featured-products')),

  /** Admin : actifs + inactifs */
  getAllFeaturedProductsAdmin: () =>
    apiRequest<FeaturedProductDTO[]>(buildApiUrl('/featured-products?includeInactive=true')),

  getFeaturedProductsBySection: (section: 'heritage' | 'sur-mesure') =>
    apiRequest<FeaturedProductDTO[]>(buildApiUrl(`/featured-products/section/${section}`)),

  getFeaturedProductById: (id: string) =>
    apiRequest<FeaturedProductDTO>(buildApiUrl(`/featured-products/${id}`)),

  createFeaturedProduct: (data: CreateFeaturedProductRequest) =>
    apiRequest<FeaturedProductDTO>(buildApiUrl('/featured-products'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFeaturedProduct: (id: string, data: UpdateFeaturedProductRequest) =>
    apiRequest<FeaturedProductDTO>(buildApiUrl(`/featured-products/${id}`), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFeaturedProduct: (id: string) =>
    apiRequest<void>(buildApiUrl(`/featured-products/${id}`), {
      method: 'DELETE',
    }),

  reorderFeaturedProducts: (section: 'heritage' | 'sur-mesure', productIds: string[]) =>
    apiRequest<void>(buildApiUrl('/featured-products/reorder'), {
      method: 'POST',
      body: JSON.stringify({ section, productIds }),
    }),

  toggleFeaturedProduct: (id: string, isActive: boolean) =>
    apiRequest<FeaturedProductDTO>(buildApiUrl(`/featured-products/${id}/toggle`), {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),
};
