import { API_BASE_URL } from '@/config/api';
import { PromoModalDTO, CreatePromoModalRequest, UpdatePromoModalRequest } from '@/types/promo-modals';

// Fonction utilitaire pour les headers d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('goldyara_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class PromoModalsApi {

  // Récupérer le premier modal actif (public)
  async getActivePromoModal(): Promise<PromoModalDTO | null> {
    console.log('📥 PromoModal: Récupération modal actif (public)');
    const response = await fetch(`${API_BASE_URL}/promo-modals/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 PromoModal: Response status public:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ PromoModal: Modal public reçu:', data.data);
    return data.data;
  }

  // Récupérer tous les modals (admin)
  async getAllPromoModals(): Promise<PromoModalDTO[]> {
    console.log('📥 Récupération tous les promo modals admin');
    const response = await fetch(`${API_BASE_URL}/promo-modals`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📡 Response status getAll:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse admin:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Promo modals récupérés:', data.data);
    return data.data;
  }

  // Créer un nouveau modal
  async createPromoModal(modal: CreatePromoModalRequest): Promise<PromoModalDTO> {
    console.log('🔧 Création promo modal API:', modal);
    const response = await fetch(`${API_BASE_URL}/promo-modals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modal),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Réponse API:', data);
    return data.data;
  }

  // Mettre à jour un modal
  async updatePromoModal(id: string, modal: UpdatePromoModalRequest): Promise<PromoModalDTO> {
    const response = await fetch(`${API_BASE_URL}/promo-modals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(modal),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Supprimer un modal
  async deletePromoModal(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/promo-modals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Activer/Désactiver un modal
  async toggleActive(id: string, isActive: boolean): Promise<PromoModalDTO> {
    const response = await fetch(`${API_BASE_URL}/promo-modals/${id}/toggle?isActive=${isActive}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }
}

export const promoModalsApi = new PromoModalsApi();
