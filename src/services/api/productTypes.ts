import { buildApiUrl, apiRequest } from '@/config/api';
import { ProductTypeDTO } from '@/types/api';

export const productTypesApi = {
  getAllProductTypes: async (): Promise<ProductTypeDTO[]> => {
    const url = buildApiUrl('/product-types');
    return apiRequest<ProductTypeDTO[]>(url);
  },

  getProductTypeById: async (id: string): Promise<ProductTypeDTO> => {
    const url = buildApiUrl(`/product-types/${id}`);
    return apiRequest<ProductTypeDTO>(url);
  },

  getProductTypeByCode: async (code: string): Promise<ProductTypeDTO> => {
    const url = buildApiUrl(`/product-types/code/${code}`);
    return apiRequest<ProductTypeDTO>(url);
  },

  createProductType: async (data: Partial<ProductTypeDTO>): Promise<ProductTypeDTO> => {
    const url = buildApiUrl('/product-types');
    return apiRequest<ProductTypeDTO>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProductType: async (id: string, data: Partial<ProductTypeDTO>): Promise<ProductTypeDTO> => {
    const url = buildApiUrl(`/product-types/${id}`);
    return apiRequest<ProductTypeDTO>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProductType: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/product-types/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
