import { apiRequest, buildApiUrl } from '@/config/api';

export type AssistantRole = 'user' | 'assistant';

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

/** Action de l'assistant : faite, échouée, ou proposée en attente de confirmation du commerçant. */
export type AssistantAction = {
  tool: string;
  status: 'done' | 'failed' | 'pending';
  actionId?: string | null;
  undoId?: string | null;
  display?: Record<string, string>;
  error?: string | null;
};

export const assistantApi = {
  status: () => apiRequest<{ enabled: boolean }>(buildApiUrl('/assistant/status')),

  /**
   * `locale` : langue de l'interface admin (fr | en | ar) — l'assistant répond dans cette langue.
   * `step` : étape de la configuration guidée en cours, pour que les questions libres restent dans le contexte.
   * `actions` n'est présent que lorsque les actions de l'assistant sont activées côté serveur.
   */
  chat: (messages: AssistantMessage[], route: string, locale: string, step?: string) =>
    apiRequest<{ reply: string; actions?: AssistantAction[] }>(buildApiUrl('/assistant/chat'), {
      method: 'POST',
      body: JSON.stringify({ messages, route, locale, step }),
    }),

  confirmAction: (id: string) =>
    apiRequest<AssistantAction>(buildApiUrl(`/assistant/actions/${encodeURIComponent(id)}/confirm`), { method: 'POST' }),

  undoAction: (id: string) =>
    apiRequest<AssistantAction>(buildApiUrl(`/assistant/actions/${encodeURIComponent(id)}/undo`), { method: 'POST' }),

  cancelAction: (id: string) =>
    apiRequest<{ cancelled: boolean }>(buildApiUrl(`/assistant/actions/${encodeURIComponent(id)}/cancel`), {
      method: 'POST',
    }),
};
