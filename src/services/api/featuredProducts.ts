import { 
  FeaturedProductDTO, 
  CreateFeaturedProductRequest, 
  UpdateFeaturedProductRequest,
  FeaturedProductSection 
} from '@/types/featured-products';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class FeaturedProductsApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('goldyara_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Récupérer tous les produits sélectionnés
  async getAllFeaturedProducts(): Promise<FeaturedProductDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured-products-mock`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Récupérer les produits par section
  async getFeaturedProductsBySection(section: 'heritage' | 'sur-mesure'): Promise<FeaturedProductDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/section/${section}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching featured products for section ${section}:`, error);
      throw error;
    }
  }

  // Récupérer un produit sélectionné par ID
  async getFeaturedProductById(id: string): Promise<FeaturedProductDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching featured product ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau produit sélectionné
  async createFeaturedProduct(data: CreateFeaturedProductRequest): Promise<FeaturedProductDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured-products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating featured product:', error);
      throw error;
    }
  }

  // Mettre à jour un produit sélectionné
  async updateFeaturedProduct(id: string, data: UpdateFeaturedProductRequest): Promise<FeaturedProductDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating featured product ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un produit sélectionné
  async deleteFeaturedProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting featured product ${id}:`, error);
      throw error;
    }
  }

  // Réorganiser l'ordre des produits
  async reorderFeaturedProducts(section: 'heritage' | 'sur-mesure', productIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/reorder`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ section, productIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error reordering featured products:', error);
      throw error;
    }
  }

  // Activer/Désactiver un produit sélectionné
  async toggleFeaturedProduct(id: string, isActive: boolean): Promise<FeaturedProductDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/featured-products/${id}/toggle`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error toggling featured product ${id}:`, error);
      throw error;
    }
  }
}

export const featuredProductsApi = new FeaturedProductsApi();
