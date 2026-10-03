import { isPlanAtLeast, type PlanCode } from '@/config/planGates';
import type { StoreSettingsDTO } from '@/types/api';

/**
 * Configuration guidée par l'assistant : l'assistant pose les questions et affiche l'outil adapté
 * (envoi d'image, couleurs…). Les étapes et les enregistrements sont pilotés par ce code et l'API
 * existante, jamais par le modèle : pas d'action inventée, et le plan de la boutique est respecté.
 */
export type FlowStepId =
  | 'logo'
  | 'colors'
  | 'tagline'
  | 'phone'
  | 'whatsapp'
  | 'cod'
  | 'freeShipping'
  | 'whatsappBusiness';

type SettingsLike = Pick<
  StoreSettingsDTO,
  'logoUrl' | 'tagline' | 'contactPhone' | 'contactWhatsapp' | 'paymentCodEnabled' | 'freeShippingThreshold'
>;

type FlowStepDef = {
  id: FlowStepId;
  /** Plan minimal : en dessous, l'étape n'est jamais posée (ex. WhatsApp Business pour un plan Basic). */
  minPlan: PlanCode;
  /** L'étape n'est posée que si ce qu'elle configure manque encore. */
  needed: (s: SettingsLike) => boolean;
};

const blank = (v?: string | null) => !v || !v.trim();

/** Ordre de la conversation. */
export const FLOW_STEPS: readonly FlowStepDef[] = [
  { id: 'logo', minPlan: 'basic', needed: (s) => blank(s.logoUrl) },
  { id: 'colors', minPlan: 'basic', needed: () => true },
  { id: 'tagline', minPlan: 'basic', needed: (s) => blank(s.tagline) },
  { id: 'phone', minPlan: 'basic', needed: (s) => blank(s.contactPhone) },
  { id: 'whatsapp', minPlan: 'basic', needed: (s) => blank(s.contactWhatsapp) },
  { id: 'cod', minPlan: 'basic', needed: (s) => !s.paymentCodEnabled },
  { id: 'freeShipping', minPlan: 'basic', needed: (s) => s.freeShippingThreshold == null },
  { id: 'whatsappBusiness', minPlan: 'pro', needed: () => true },
];

/** Étapes à poser à ce commerçant : ce qui manque, dans les limites de son plan. */
export function buildFlow(settings: SettingsLike, planCode?: string | null): FlowStepId[] {
  return FLOW_STEPS.filter((s) => isPlanAtLeast(planCode, s.minPlan) && s.needed(settings)).map((s) => s.id);
}

export const COLOR_PRESETS: readonly { primary: string; secondary: string }[] = [
  { primary: '#2563EB', secondary: '#1E293B' },
  { primary: '#059669', secondary: '#064E3B' },
  { primary: '#E11D48', secondary: '#4C0519' },
  { primary: '#D97706', secondary: '#451A03' },
  { primary: '#7C3AED', secondary: '#2E1065' },
  { primary: '#0D9488', secondary: '#134E4A' },
  { primary: '#EA580C', secondary: '#431407' },
  { primary: '#334155', secondary: '#0F172A' },
];

export const isHexColor = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v.trim());

/** Numéro saisi à la main : chiffres, +, espaces, points, tirets, parenthèses ; 6 à 30 caractères. */
export const isPhone = (v: string) => /^[+0-9 ().-]{6,30}$/.test(v.trim()) && /\d{5,}/.test(v.replace(/\D/g, ''));

/** Montant de livraison gratuite : nombre strictement positif (virgule acceptée). */
export function parseAmount(v: string): number | null {
  const n = Number(v.trim().replace(',', '.'));
  return Number.isFinite(n) && n > 0 && n < 1_000_000 ? n : null;
}

/** Widgets affichés dans le chat sous la question de l'assistant. */
export type FlowWidget =
  | { kind: 'yesno'; stepId: FlowStepId }
  | { kind: 'upload'; stepId: 'logo' }
  | { kind: 'colors' }
  | { kind: 'text'; stepId: 'tagline' | 'phone' | 'whatsapp' | 'freeShipping' }
  | { kind: 'link'; stepId: 'whatsappBusiness'; href: string };

/** Premier widget de chaque étape. */
export function widgetForStep(id: FlowStepId): FlowWidget {
  switch (id) {
    case 'logo':
    case 'cod':
    case 'whatsappBusiness':
      return { kind: 'yesno', stepId: id };
    case 'colors':
      return { kind: 'colors' };
    default:
      return { kind: 'text', stepId: id };
  }
}
