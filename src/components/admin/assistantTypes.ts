import type { AnyWidget } from '@/config/assistantFlow';
import type { AssistantMessage } from '@/services/api/assistant';

/** Entrée de la conversation : texte envoyé au modèle + éventuel outil affiché (jamais envoyé). */
export type Entry = AssistantMessage & { widget?: AnyWidget };
