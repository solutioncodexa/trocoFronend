/**
 * Permet à n'importe quel écran de l'admin (ex. la liste « Premiers pas » du tableau de bord) de demander à
 * l'assistant d'ouvrir le chat et de lancer un parcours guidé.
 */
export type AssistantFlowId =
  | 'basics'
  | 'catalog'
  | 'design'
  | 'shipping'
  | 'marketing'
  | 'growth'
  | 'legal'
  | 'manage'
  | 'content'
  | 'payments';

export const ASSISTANT_FLOW_EVENT = 'troco:assistant-flow';

export function requestAssistantFlow(flow: AssistantFlowId) {
  window.dispatchEvent(new CustomEvent<{ flow: AssistantFlowId }>(ASSISTANT_FLOW_EVENT, { detail: { flow } }));
}
