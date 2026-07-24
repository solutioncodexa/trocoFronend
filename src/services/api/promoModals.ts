import { API_BASE_URL } from '@/config/api';
import { PromoModalDTO, CreatePromoModalRequest, UpdatePromoModalRequest } from '@/types/promo-modals';

const getAuthHeaders = () => {
  const token = localStorage.getItem('troco_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class PromoModalsApi {
  async getActivePromoModal(): Promise<PromoModalDTO | null> {
    const response = await fetch(`${API_BASE_URL}/promo-modals/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getAllPromoModals(): Promise<PromoModalDTO[]> {
    const response = await fetch(`${API_BASE_URL}/promo-modals`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse admin:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async createPromoModal(modal: CreatePromoModalRequest): Promise<PromoModalDTO> {
    const response = await fetch(`${API_BASE_URL}/promo-modals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modal),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

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

  async deletePromoModal(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/promo-modals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

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
