/**
 * Fonctions de croissance réservées aux plans payants : relance des paniers abandonnés, message WhatsApp de
 * commande, fidélité, domaine personnalisé. Logique pure, sans réseau. Les droits viennent du plan, jamais du modèle.
 */
import type { PlanFeaturesDTO } from '@/types/api';

export type GrowthStepId = 'cart' | 'whatsapp' | 'loyalty' | 'domain' | 'verify';

type GrowthSettings = {
  abandonedCartEnabled?: boolean;
  contactWhatsapp?: string | null;
  whatsappOrderTemplate?: string | null;
  loyaltyEnabled?: boolean;
  customDomain?: string | null;
  domainVerified?: boolean;
};

type FlowInput = {
  settings: GrowthSettings;
  features?: PlanFeaturesDTO;
  customDomainAllowed: boolean;
};

const blank = (v?: string | null) => !v || !v.trim();

/** Étapes à proposer : uniquement ce que le plan autorise et qui n'est pas déjà en place. */
export function buildGrowthFlow({ settings: s, features, customDomainAllowed }: FlowInput): GrowthStepId[] {
  const steps: GrowthStepId[] = [];
  if (features?.abandonedCart && !s.abandonedCartEnabled) steps.push('cart');
  if (features?.whatsappBusiness && blank(s.whatsappOrderTemplate) && !blank(s.contactWhatsapp)) steps.push('whatsapp');
  if (features?.loyalty && !s.loyaltyEnabled) steps.push('loyalty');
  if (customDomainAllowed) {
    if (blank(s.customDomain)) steps.push('domain');
    else if (!s.domainVerified) steps.push('verify');
  }
  return steps;
}

/** Délais proposés avant la relance d'un panier abandonné (minutes). */
export const CART_DELAYS = [30, 60, 180, 1440] as const;

/** Points gagnés par MAD dépensé, puis valeur d'un point en MAD. */
export const POINTS_PER_MAD = [1, 2, 5] as const;
export const MAD_PER_POINT = [0.05, 0.1, 0.2] as const;

type Lang = 'fr' | 'en' | 'ar';

/** Modèles de message WhatsApp ; `{productName}` et `{url}` sont remplacés par la fiche produit. */
export const whatsappTemplates = (lang: Lang): string[] =>
  ({
    fr: [
      'Bonjour, je souhaite commander : {productName} ({url})',
      'Bonjour ! Ce produit est-il disponible ? {productName} ({url})',
    ],
    en: [
      'Hello, I would like to order: {productName} ({url})',
      'Hi! Is this product available? {productName} ({url})',
    ],
    ar: [
      'مرحبًا، أريد طلب: {productName} ({url})',
      'السلام عليكم، هل هذا المنتج متوفر؟ {productName} ({url})',
    ],
  })[lang];

/** Hôtes de la plateforme, non utilisables comme domaine personnalisé. */
const PLATFORM_HOSTS = /(^|\.)(getstore\.com|codexa-solution\.com)$/;

/** Nettoie ce que le commerçant a saisi : sans protocole, chemin ni majuscules. */
export const normalizeDomain = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[/?#].*$/, '')
    .replace(/\.$/, '');

/** Nom de domaine plausible (au moins un point, extension alphabétique) et qui n'est pas celui de la plateforme. */
export const isCustomDomain = (v: string) => {
  const d = normalizeDomain(v);
  return /^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,24}$/.test(d) && !PLATFORM_HOSTS.test(d);
};

/** Cible du CNAME, identique à celle de l'écran Domaine des réglages. */
export const cnameTarget = (slug?: string | null) => `${slug || 'votre-slug'}.getstore.com`;

export const delayLabelKey = (minutes: number) =>
  minutes >= 1440 ? ('assistant.growth.delay.day' as const) : minutes >= 60 ? ('assistant.growth.delay.hours' as const) : ('assistant.growth.delay.minutes' as const);

export const delayValue = (minutes: number) => (minutes >= 1440 ? minutes / 1440 : minutes >= 60 ? minutes / 60 : minutes);
