import { buildApiUrl, apiRequest } from '@/config/api';
import { CollectionDTO } from '@/types/api';

export const collectionsApi = {
  getAllCollections: async (): Promise<CollectionDTO[]> => {
    const url = buildApiUrl('/collections');
    return apiRequest<CollectionDTO[]>(url);
  },

  getCollectionById: async (id: string): Promise<CollectionDTO> => {
    const url = buildApiUrl(`/collections/${id}`);
    return apiRequest<CollectionDTO>(url);
  },

  getCollectionBySlug: async (slug: string): Promise<CollectionDTO> => {
    const url = buildApiUrl(`/collections/slug/${slug}`);
    return apiRequest<CollectionDTO>(url);
  },

  getActiveCollections: async (): Promise<CollectionDTO[]> => {
    const url = buildApiUrl('/collections/active');
    return apiRequest<CollectionDTO[]>(url);
  },

  createCollection: async (data: Partial<CollectionDTO>): Promise<CollectionDTO> => {
    const url = buildApiUrl('/collections');
    return apiRequest<CollectionDTO>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCollection: async (id: string, data: Partial<CollectionDTO>): Promise<CollectionDTO> => {
    const url = buildApiUrl(`/collections/${id}`);
    return apiRequest<CollectionDTO>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCollection: async (id: string): Promise<void> => {
    const url = buildApiUrl(`/collections/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
