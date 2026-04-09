import { API_BASE_URL } from '@/config/api';
import { TopBarMessageDTO, CreateTopBarMessageRequest, UpdateTopBarMessageRequest } from '@/types/top-bar-messages';

// Fonction utilitaire pour les headers d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('goldyara_admin_token');
  console.log('🔑 Token trouvé:', token ? 'OUI' : 'NON');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  console.log('📤 Headers:', headers);
  return headers;
};

class TopBarMessagesApi {

  // Récupérer tous les messages actifs (public)
  async getActiveMessages(): Promise<TopBarMessageDTO[]> {
    console.log('📥 TopBar: Récupération messages actifs (public)');
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 TopBar: Response status public:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ TopBar: Messages publics reçus:', data.data);
    return data.data;
  }

  // Récupérer tous les messages (admin)
  async getAllMessages(): Promise<TopBarMessageDTO[]> {
    console.log('📥 Récupération tous les messages admin');
    const response = await fetch(`${API_BASE_URL}/top-bar-messages`, {
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
    console.log('✅ Messages récupérés:', data.data);
    return data.data;
  }

  // Créer un nouveau message
  async createMessage(message: CreateTopBarMessageRequest): Promise<TopBarMessageDTO> {
    console.log('🔧 Création message API:', message);
    const response = await fetch(`${API_BASE_URL}/top-bar-messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(message),
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

  // Mettre à jour un message
  async updateMessage(id: string, message: UpdateTopBarMessageRequest): Promise<TopBarMessageDTO> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Supprimer un message
  async deleteMessage(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Activer/Désactiver un message
  async toggleActive(id: string, isActive: boolean): Promise<TopBarMessageDTO> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/${id}/toggle?isActive=${isActive}`, {
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

export const topBarMessagesApi = new TopBarMessagesApi();
