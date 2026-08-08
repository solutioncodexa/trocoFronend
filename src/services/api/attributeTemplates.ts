import { buildApiUrl, apiRequest } from '@/config/api';

/** Un axe d'attribut de variante (ex. « Taille » + valeurs suggérées). */
export interface AttributeAxis {
  name: string;
  values?: string[];
  required?: boolean;
}

/** Modèle d'attributs. categoryId null = modèle par défaut de la boutique. */
export interface ProductAttributeTemplate {
  id?: number | null;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  axes: AttributeAxis[];
}

export interface SaveAttributeTemplatePayload {
  categoryId?: number | null;
  axes: AttributeAxis[];
}

export const attributeTemplatesApi = {
  /** Tous les modèles configurés pour la boutique. */
  getAll: async (): Promise<ProductAttributeTemplate[]> => {
    return apiRequest<ProductAttributeTemplate[]>(buildApiUrl('/attribute-templates'));
  },

  /** Modèle à appliquer pour une catégorie (fallback modèle boutique). */
  resolve: async (categoryId?: number | null): Promise<ProductAttributeTemplate> => {
    const query = categoryId != null ? `?categoryId=${categoryId}` : '';
    return apiRequest<ProductAttributeTemplate>(buildApiUrl(`/attribute-templates/resolve${query}`));
  },

  /** Crée ou met à jour un modèle (par catégorie ou par défaut boutique). */
  save: async (payload: SaveAttributeTemplatePayload): Promise<ProductAttributeTemplate> => {
    return apiRequest<ProductAttributeTemplate>(buildApiUrl('/attribute-templates'), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /** Supprime un modèle. */
  remove: async (id: number): Promise<void> => {
    return apiRequest<void>(buildApiUrl(`/attribute-templates/${id}`), {
      method: 'DELETE',
    });
  },
};
