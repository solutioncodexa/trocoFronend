import { buildApiUrl, apiRequest } from '@/config/api';
import { ProductDTO, PageResponse } from '@/types/api';

export interface ProductFilters {
  category?: string;
  type?: string;
  goldType?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

/** Données produit pour création/modification (sans images, envoyées séparément) */
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: number;
  marginGain?: number;
  category: string;
  type: string;
  goldType: string;
  collection?: string;
  availableSizes?: string[];
  stockQuantity?: number;
  badges?: string[];
}

export const productsApi = {
  // Récupérer tous les produits avec pagination
  getAllProducts: async (params: ProductQueryParams = {}): Promise<PageResponse<ProductDTO>> => {
    const { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'DESC' } = params;
    const url = buildApiUrl(`/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    console.log('Fetching products from:', url);
    return apiRequest<PageResponse<ProductDTO>>(url);
  },

  // Récupérer un produit par ID
  getProductById: async (id: string): Promise<ProductDTO> => {
    const url = buildApiUrl(`/products/${id}`);
    return apiRequest<ProductDTO>(url);
  },

  // Filtrer les produits
  filterProducts: async (filters: ProductFilters): Promise<ProductDTO[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.goldType) params.append('goldType', filters.goldType);
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    
    const url = buildApiUrl(`/products/filter?${params.toString()}`);
    return apiRequest<ProductDTO[]>(url);
  },

  // Créer un produit avec images (admin)
  createProduct: async (product: ProductFormData, images: File[]): Promise<ProductDTO> => {
    const url = buildApiUrl('/products');
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    images.forEach((file) => formData.append('images', file));

    const token = localStorage.getItem('goldyara_admin_token');
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur création produit');
    return data.data ?? data;
  },

  // Mettre à jour un produit avec images (admin)
  updateProduct: async (id: string, product: ProductFormData, images?: File[]): Promise<ProductDTO> => {
    const url = buildApiUrl(`/products/${id}`);
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const token = localStorage.getItem('goldyara_admin_token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur mise à jour produit');
    return data.data ?? data;
  },

  // Supprimer un produit (admin)
  deleteProduct: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/products/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
