import { isPlanAtLeast, type PlanCode } from '@/config/planGates';
import type { ActivityId } from '@/config/catalogTemplates';
import type { KeyField, Provider } from '@/config/sellFlow';
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

/** Widgets de la conversation « catalogue » (catégories, sous-catégories, articles). */
export type CatalogWidget =
  | { kind: 'cyesno'; id: 'moreCats' | 'addProduct' | 'another' }
  | { kind: 'activity' }
  | { kind: 'catTree'; activity: ActivityId | null }
  | { kind: 'catPick' }
  | { kind: 'cfield'; field: 'name' | 'price' | 'desc' | 'stock'; proposal?: string }
  | { kind: 'photos' }
  | { kind: 'cconfirm' };


/** Widgets de la conversation « personnalisation » (thème, en-tête, pages, réseaux sociaux). */
export type DesignWidget =
  | { kind: 'dyesno'; id: 'search' | 'promo' | 'home' | 'about' | 'legal' }
  | { kind: 'themePick' }
  | { kind: 'layoutPick' }
  | { kind: 'dfield'; field: 'promo' | 'instagram' | 'facebook' | 'tiktok' };


/** Widgets de la conversation « livraison » (transporteurs, frais, délais). */
export type ShippingWidget =
  | { kind: 'shyesno'; id: 'add' | 'another' }
  | { kind: 'shfield'; field: 'name' | 'fee' | 'free' | 'eta' }
  | { kind: 'shconfirm' };

/** Widgets de la conversation « paiement par carte » : les champs secrets ne sont jamais affichés ni conservés. */
export type PaymentWidget =
  | { kind: 'payprovider' }
  | { kind: 'payfield'; provider: Provider; field: KeyField; secret: boolean }
  | { kind: 'paymode' }
  | { kind: 'payyesno' };

/** Widgets de la conversation « marketing et référencement » (pixels, SEO, code promo). */
export type MarketingWidget =
  | { kind: 'myesno'; id: 'pixels' | 'catSeo' | 'promo' | 'another' }
  | { kind: 'mfield'; field: 'meta' | 'tiktok' | 'ga' | 'promoCode' | 'promoValue' | 'promoUses' }
  | { kind: 'mseo' }
  | { kind: 'mkind' }
  | { kind: 'mconfirm' };

/** Widgets de la conversation « fonctions Pro » (paniers abandonnés, WhatsApp, fidélité, domaine). */
export type GrowthWidget =
  | { kind: 'gyesno'; id: 'cart' | 'whatsapp' | 'loyalty' | 'domain' | 'verify' }
  | { kind: 'gpick'; id: 'cartDelay' | 'points' | 'value' | 'template' }
  | { kind: 'gfield' }
  | { kind: 'gconfirm' };

/** Widgets de la conversation « conformité » (pages légales, cookies, conservation des données). */
export type LegalWidget = { kind: 'lyesno'; id: 'pages' | 'cookies' | 'retention' } | { kind: 'lpick' };

/** Widgets de la conversation « modifier l'existant » (produits et catégories). */
export type ManageWidget =
  | { kind: 'xpick'; id: 'type' | 'choose' | 'action' }
  | { kind: 'xfield'; field: 'search' | 'price' | 'stock' | 'name' }
  | { kind: 'xconfirm' }
  | { kind: 'xyesno' };

/** Widgets de la conversation « contenu de base » (email, ville, présentation, pages FAQ et Contact). */
export type ContentWidget =
  | { kind: 'kyesno'; id: 'faq' | 'contactPage' }
  | { kind: 'kfield'; field: 'email' | 'city' | 'about' };

export type AnyWidget =
  | FlowWidget
  | CatalogWidget
  | DesignWidget
  | ShippingWidget
  | PaymentWidget
  | MarketingWidget
  | GrowthWidget
  | LegalWidget
  | ManageWidget
  | ContentWidget;

const CATALOG_KINDS = new Set(['cyesno', 'activity', 'catTree', 'catPick', 'cfield', 'photos', 'cconfirm']);
export const isCatalogWidget = (w: AnyWidget): w is CatalogWidget => CATALOG_KINDS.has(w.kind);

const DESIGN_KINDS = new Set(['dyesno', 'themePick', 'layoutPick', 'dfield']);
export const isDesignWidget = (w: AnyWidget): w is DesignWidget => DESIGN_KINDS.has(w.kind);

const SHIPPING_KINDS = new Set(['shyesno', 'shfield', 'shconfirm']);
export const isShippingWidget = (w: AnyWidget): w is ShippingWidget => SHIPPING_KINDS.has(w.kind);

const MARKETING_KINDS = new Set(['myesno', 'mfield', 'mseo', 'mkind', 'mconfirm']);
export const isMarketingWidget = (w: AnyWidget): w is MarketingWidget => MARKETING_KINDS.has(w.kind);

const GROWTH_KINDS = new Set(['gyesno', 'gpick', 'gfield', 'gconfirm']);
export const isGrowthWidget = (w: AnyWidget): w is GrowthWidget => GROWTH_KINDS.has(w.kind);

const LEGAL_KINDS = new Set(['lyesno', 'lpick']);
export const isLegalWidget = (w: AnyWidget): w is LegalWidget => LEGAL_KINDS.has(w.kind);

const MANAGE_KINDS = new Set(['xpick', 'xfield', 'xconfirm', 'xyesno']);
export const isManageWidget = (w: AnyWidget): w is ManageWidget => MANAGE_KINDS.has(w.kind);

const CONTENT_KINDS = new Set(['kyesno', 'kfield']);
export const isContentWidget = (w: AnyWidget): w is ContentWidget => CONTENT_KINDS.has(w.kind);
