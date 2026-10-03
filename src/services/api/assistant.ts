import { apiRequest, buildApiUrl } from '@/config/api';

export type AssistantRole = 'user' | 'assistant';

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

export const assistantApi = {
  status: () => apiRequest<{ enabled: boolean }>(buildApiUrl('/assistant/status')),

  /**
   * `locale` : langue de l'interface admin (fr | en | ar) — l'assistant répond dans cette langue.
   * `step` : étape de la configuration guidée en cours, pour que les questions libres restent dans le contexte.
   */
  chat: (messages: AssistantMessage[], route: string, locale: string, step?: string) =>
    apiRequest<{ reply: string }>(buildApiUrl('/assistant/chat'), {
      method: 'POST',
      body: JSON.stringify({ messages, route, locale, step }),
    }),
};
