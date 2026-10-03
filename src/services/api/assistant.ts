import { apiRequest, buildApiUrl } from '@/config/api';

export type AssistantRole = 'user' | 'assistant';

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

export const assistantApi = {
  status: () => apiRequest<{ enabled: boolean }>(buildApiUrl('/assistant/status')),

  chat: (messages: AssistantMessage[], route: string) =>
    apiRequest<{ reply: string }>(buildApiUrl('/assistant/chat'), {
      method: 'POST',
      body: JSON.stringify({ messages, route }),
    }),
};
