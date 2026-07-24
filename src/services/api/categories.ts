import { buildApiUrl, apiRequest } from '@/config/api';
import type { CategoryDTO, HeroCategoryPatchDTO } from '@/types/api';

export const categoriesApi = {
  // Récupérer toutes les catégories
  getAllCategories: async (): Promise<CategoryDTO[]> => {
    const url = buildApiUrl('/categories');
    return apiRequest<CategoryDTO[]>(url);
  },

  /** Catégories affichées sur le hero (ordre + image définis en admin). */
  getHeroCategories: async (): Promise<CategoryDTO[]> => {
    const url = buildApiUrl('/categories/hero');
    return apiRequest<CategoryDTO[]>(url);
  },

  // Récupérer une catégorie par ID
  getCategoryById: async (id: number): Promise<CategoryDTO> => {
    const url = buildApiUrl(`/categories/${id}`);
    return apiRequest<CategoryDTO>(url);
  },

  // Récupérer une catégorie par slug
  getCategoryBySlug: async (slug: string): Promise<CategoryDTO> => {
    const url = buildApiUrl(`/categories/slug/${slug}`);
    return apiRequest<CategoryDTO>(url);
  },

  // Créer une catégorie (admin)
  createCategory: async (category: {
    name: string;
    slug: string;
    description?: string;
    parentId?: number | null;
  }): Promise<CategoryDTO> => {
    const url = buildApiUrl('/categories');
    return apiRequest<CategoryDTO>(url, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  // Mettre à jour une catégorie (admin)
  updateCategory: async (
    id: number,
    category: {
      name: string;
      slug: string;
      description?: string;
      parentId?: number | null;
      clearParent?: boolean;
    }
  ): Promise<CategoryDTO> => {
    const url = buildApiUrl(`/categories/${id}`);
    return apiRequest<CategoryDTO>(url, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  /** Mise à jour partielle bandeau accueil (admin). */
  patchCategoryHero: async (id: number, patch: HeroCategoryPatchDTO): Promise<CategoryDTO> => {
    const url = buildApiUrl(`/categories/${id}/hero`);
    return apiRequest<CategoryDTO>(url, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  // Supprimer une catégorie (admin)
  deleteCategory: async (id: number): Promise<void> => {
    const url = buildApiUrl(`/categories/${id}`);
    return apiRequest<void>(url, {
      method: 'DELETE',
    });
  },
};
