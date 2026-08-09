import { buildApiUrl, apiRequest } from '@/config/api';
import type {
  CategoryCardDTO,
  CategoryDTO,
  CategoryHeroDTO,
  CategoryNavDTO,
  HeroCategoryPatchDTO,
} from '@/types/api';

export const categoriesApi = {
  // Récupérer toutes les catégories
  getAllCategories: async (): Promise<CategoryDTO[]> => {
    const url = buildApiUrl('/categories');
    return apiRequest<CategoryDTO[]>(url);
  },

  /** Footer / nav — sans description ni productCount. */
  getNavCategories: async (): Promise<CategoryNavDTO[]> => {
    const url = buildApiUrl('/categories/nav');
    return apiRequest<CategoryNavDTO[]>(url);
  },

  /** Cartes vitrine (home / page builder). */
  getCardCategories: async (): Promise<CategoryCardDTO[]> => {
    const url = buildApiUrl('/categories/cards');
    return apiRequest<CategoryCardDTO[]>(url);
  },

  /** Catégories affichées sur le hero (ordre + image définis en admin). */
  getHeroCategories: async (): Promise<CategoryHeroDTO[]> => {
    const url = buildApiUrl('/categories/hero');
    return apiRequest<CategoryHeroDTO[]>(url);
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

  /** Suppression multiple (enfants traités avant parents). */
  bulkDeleteCategories: async (
    ids: number[],
  ): Promise<{ successCount: number; failureCount: number; errors: string[] }> => {
    return apiRequest(buildApiUrl('/categories/bulk-delete'), {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  /** Activer / désactiver plusieurs catégories. */
  bulkSetActive: async (
    ids: number[],
    active: boolean,
  ): Promise<{ successCount: number; failureCount: number; errors: string[] }> => {
    return apiRequest(buildApiUrl('/categories/bulk-active'), {
      method: 'POST',
      body: JSON.stringify({ ids, active }),
    });
  },

  setActive: async (id: number, active: boolean): Promise<CategoryDTO> => {
    return apiRequest(buildApiUrl(`/categories/${id}/active?active=${active}`), {
      method: 'PATCH',
    });
  },
};
