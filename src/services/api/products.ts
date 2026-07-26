import { buildApiUrl, apiRequest } from '@/config/api';
import type { ProductDetailDTO, ProductListItemDTO, ProductVariant } from '@/types/product-dtos';
import type { PageResponse } from '@/types/api';

export interface ProductFilters {
  category?: string;
  goldType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  category?: string;
  goldType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  keyword?: string;
}

/** Données produit pour création/modification (sans images, envoyées séparément) */
export interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  sku?: string;
  stockQuantity?: number;
  badges?: string[];
  variants?: ProductVariant[];
  /** Legacy optionnels */
  goldType?: string;
  availableSizes?: string[];
  weight?: number;
  marginGain?: number;
  showWeight?: boolean;
  /** Produit personnalisable : upload logo client */
  customizable?: boolean;
}

function buildProductsQueryString(params: ProductQueryParams): string {
  const {
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDir = 'DESC',
    category,
    goldType,
    minPrice,
    maxPrice,
    inStock,
    keyword,
  } = params;

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('sortBy', sortBy);
  qs.set('sortDir', sortDir);
  if (category) qs.set('category', category);
  if (goldType) qs.set('goldType', goldType);
  if (minPrice !== undefined) qs.set('minPrice', String(minPrice));
  if (maxPrice !== undefined) qs.set('maxPrice', String(maxPrice));
  if (inStock === true) qs.set('inStock', 'true');
  if (keyword !== undefined && keyword.trim() !== '') qs.set('keyword', keyword.trim());

  return qs.toString();
}

export const productsApi = {
  /** Pagination publique — ProductListItemDTO */
  getAllProducts: async (params: ProductQueryParams = {}): Promise<PageResponse<ProductListItemDTO>> => {
    const qs = buildProductsQueryString(params);
    return apiRequest<PageResponse<ProductListItemDTO>>(buildApiUrl(`/products?${qs}`));
  },

  /** Mêmes filtres — ProductDetailDTO (admin, export) */
  getAllProductsFullPage: async (params: ProductQueryParams = {}): Promise<PageResponse<ProductDetailDTO>> => {
    const qs = buildProductsQueryString(params);
    return apiRequest<PageResponse<ProductDetailDTO>>(buildApiUrl(`/products/full-page?${qs}`));
  },

  getProductById: async (id: string): Promise<ProductDetailDTO> => {
    const url = buildApiUrl(`/products/${id}`);
    return apiRequest<ProductDetailDTO>(url);
  },

  filterProducts: async (filters: ProductFilters): Promise<ProductListItemDTO[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.goldType) params.append('goldType', filters.goldType);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    const url = buildApiUrl(`/products/filter?${params.toString()}`);
    return apiRequest<ProductListItemDTO[]>(url);
  },

  createProduct: async (product: ProductFormData, images: File[]): Promise<ProductDetailDTO> => {
    const url = buildApiUrl('/products');
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    images.forEach((file) => formData.append('images', file));

    const token = localStorage.getItem('troco_admin_token');
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur création produit');
    return data.data ?? data;
  },

  updateProduct: async (id: string, product: ProductFormData, images?: File[]): Promise<ProductDetailDTO> => {
    const url = buildApiUrl(`/products/${id}`);
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    const token = localStorage.getItem('troco_admin_token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur mise à jour produit');
    return data.data ?? data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/products/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },

  frequentlyBought: async (id: string, limit = 4): Promise<ProductListItemDTO[]> => {
    const qs = new URLSearchParams({ limit: String(limit) });
    return apiRequest<ProductListItemDTO[]>(
      buildApiUrl(`/products/${id}/frequently-bought?${qs.toString()}`),
    );
  },
};
