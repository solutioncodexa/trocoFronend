import { API_BASE_URL } from '@/config/api';
import { TopBarMessageDTO, CreateTopBarMessageRequest, UpdateTopBarMessageRequest } from '@/types/top-bar-messages';

const getAuthHeaders = () => {
  const token = localStorage.getItem('troco_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class TopBarMessagesApi {
  async getActiveMessages(): Promise<TopBarMessageDTO[]> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/public`, {
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

  async getAllMessages(): Promise<TopBarMessageDTO[]> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages`, {
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

  async createMessage(message: CreateTopBarMessageRequest): Promise<TopBarMessageDTO> {
    const body = {
      message: message.message?.trim() ?? '',
      displayOrder: Number.isFinite(Number(message.displayOrder)) ? Number(message.displayOrder) : 1,
      isActive: message.isActive !== false,
      displayDurationSeconds: Number.isFinite(Number(message.displayDurationSeconds))
        ? Number(message.displayDurationSeconds)
        : 7,
    };
    const response = await fetch(`${API_BASE_URL}/top-bar-messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async updateMessage(id: string, message: UpdateTopBarMessageRequest): Promise<TopBarMessageDTO> {
    const body = {
      message: message.message?.trim() ?? '',
      displayOrder: Number.isFinite(Number(message.displayOrder)) ? Number(message.displayOrder) : 1,
      isActive: message.isActive,
      displayDurationSeconds: Number.isFinite(Number(message.displayDurationSeconds))
        ? Number(message.displayDurationSeconds)
        : 7,
    };
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async deleteMessage(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/top-bar-messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

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
