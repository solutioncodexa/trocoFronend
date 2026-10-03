/**
 * Contenu de base : coordonnées (email, ville), texte « à propos », page FAQ et page Contact.
 * Logique pure, sans réseau. Les réponses de la FAQ viennent des réglages de la boutique, sans rien inventer.
 */
import type { StorePageBlock, UpsertStorePagePayload } from '@/types/store-pages';

type Lang = 'fr' | 'en' | 'ar';

export type ContentStepId = 'email' | 'city' | 'about' | 'faq' | 'contactPage';

type ContentSettings = {
  contactEmail?: string | null;
  contactCity?: string | null;
  aboutText?: string | null;
};

const blank = (v?: string | null) => !v || !v.trim();

export const FAQ_SLUGS = ['faq', 'questions-frequentes', 'foire-aux-questions'];
export const CONTACT_SLUGS = ['contact', 'contactez-nous', 'nous-contacter'];

export function buildContentFlow(s: ContentSettings, pageSlugs: string[]): ContentStepId[] {
  const known = new Set(pageSlugs.map((p) => p.toLowerCase()));
  const has = (slugs: string[]) => slugs.some((x) => known.has(x));
  const steps: ContentStepId[] = [];
  if (blank(s.contactEmail)) steps.push('email');
  if (blank(s.contactCity)) steps.push('city');
  if (blank(s.aboutText)) steps.push('about');
  if (!has(FAQ_SLUGS)) steps.push('faq');
  if (!has(CONTACT_SLUGS)) steps.push('contactPage');
  return steps;
}

export const isEmail = (v: string) => /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.trim().length <= 120;

/** Ville : 2 à 60 caractères. */
export const validCity = (v: string) => v.trim().length >= 2 && v.trim().length <= 60;

/** Texte « à propos » : 20 à 1000 caractères. */
export const validAbout = (v: string) => v.trim().length >= 20 && v.trim().length <= 1000;

/** Courte présentation proposée, à partir du nom, du slogan et de la ville. */
export function aboutProposal(lang: Lang, name: string, tagline?: string | null, city?: string | null) {
  const n = name.trim() || '—';
  const tag = (tagline ?? '').trim();
  const c = (city ?? '').trim();
  const where = {
    fr: c ? ` Nous sommes basés à ${c}.` : '',
    en: c ? ` We are based in ${c}.` : '',
    ar: c ? ` مقرّنا في ${c}.` : '',
  }[lang];
  return {
    fr: `${n}${tag ? ` : ${tag}` : ''}.${where} Nous sélectionnons nos produits avec soin et livrons partout au Maroc.`,
    en: `${n}${tag ? `: ${tag}` : ''}.${where} We choose our products with care and deliver across Morocco.`,
    ar: `${n}${tag ? `: ${tag}` : ''}.${where} ننتقي منتجاتنا بعناية ونوصّل إلى كل أنحاء المغرب.`,
  }[lang];
}

export type FaqSettings = {
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  freeShippingThreshold?: number | null;
  paymentCodEnabled?: boolean;
  paymentCmiEnabled?: boolean;
  paymentStripeEnabled?: boolean;
  paymentPaypalEnabled?: boolean;
};

const T = {
  fr: {
    faqTitle: 'Questions fréquentes',
    contactTitle: 'Contact',
    contactBody: 'Une question ? Écrivez-nous, nous vous répondons rapidement.',
    qOrder: 'Comment passer commande ?',
    aOrder:
      'Ajoutez vos produits au panier, puis validez la commande en indiquant vos coordonnées de livraison. Nous vous contactons si besoin pour confirmer.',
    qPay: 'Quels moyens de paiement acceptez-vous ?',
    cod: 'le paiement à la livraison',
    card: 'le paiement par carte bancaire',
    payYes: (l: string) => `Nous acceptons ${l}.`,
    payNone: 'Les moyens de paiement disponibles sont affichés lors de la validation de la commande.',
    qShip: 'Quels sont les frais de livraison ?',
    shipFree: (n: number) => `La livraison est offerte à partir de ${n} MAD d’achat. `,
    shipInfo: 'Les frais et délais sont affichés avant la validation de la commande.',
    qReach: 'Comment vous joindre ?',
    reach: (l: string) => `Vous pouvez nous joindre ${l}.`,
    byEmail: (v: string) => `par email à ${v}`,
    byPhone: (v: string) => `par téléphone au ${v}`,
    byWa: (v: string) => `sur WhatsApp au ${v}`,
    reachNone: 'Utilisez la page Contact de la boutique pour nous écrire.',
    and: ' ou ',
  },
  en: {
    faqTitle: 'Frequently asked questions',
    contactTitle: 'Contact',
    contactBody: 'Got a question? Write to us, we reply quickly.',
    qOrder: 'How do I place an order?',
    aOrder:
      'Add products to your cart, then confirm the order with your delivery details. We contact you if needed to confirm.',
    qPay: 'Which payment methods do you accept?',
    cod: 'cash on delivery',
    card: 'card payment',
    payYes: (l: string) => `We accept ${l}.`,
    payNone: 'Available payment methods are shown when you confirm your order.',
    qShip: 'What are the delivery costs?',
    shipFree: (n: number) => `Delivery is free from ${n} MAD of purchases. `,
    shipInfo: 'Costs and lead times are shown before you confirm your order.',
    qReach: 'How can I contact you?',
    reach: (l: string) => `You can reach us ${l}.`,
    byEmail: (v: string) => `by email at ${v}`,
    byPhone: (v: string) => `by phone at ${v}`,
    byWa: (v: string) => `on WhatsApp at ${v}`,
    reachNone: 'Use the store’s Contact page to write to us.',
    and: ' or ',
  },
  ar: {
    faqTitle: 'الأسئلة الشائعة',
    contactTitle: 'اتصل بنا',
    contactBody: 'عندك سؤال؟ راسلنا وسنجيبك بسرعة.',
    qOrder: 'كيف أطلب؟',
    aOrder: 'أضف المنتجات إلى السلة ثم أكّد الطلب مع بيانات التوصيل. سنتصل بك عند الحاجة للتأكيد.',
    qPay: 'ما وسائل الدفع المقبولة؟',
    cod: 'الدفع عند الاستلام',
    card: 'الدفع بالبطاقة البنكية',
    payYes: (l: string) => `نقبل ${l}.`,
    payNone: 'تظهر وسائل الدفع المتاحة عند تأكيد الطلب.',
    qShip: 'ما تكلفة التوصيل؟',
    shipFree: (n: number) => `التوصيل مجاني ابتداءً من ${n} درهم من المشتريات. `,
    shipInfo: 'تظهر التكلفة والآجال قبل تأكيد الطلب.',
    qReach: 'كيف يمكنني التواصل معكم؟',
    reach: (l: string) => `يمكنك التواصل معنا ${l}.`,
    byEmail: (v: string) => `عبر البريد ${v}`,
    byPhone: (v: string) => `هاتفيًا على ${v}`,
    byWa: (v: string) => `عبر واتساب على ${v}`,
    reachNone: 'استعمل صفحة «اتصل بنا» في المتجر لمراسلتنا.',
    and: ' أو ',
  },
} as const;

/** Questions / réponses de la FAQ, construites uniquement à partir des réglages de la boutique. */
export function faqItems(lang: Lang, s: FaqSettings): { q: string; a: string }[] {
  const x = T[lang];
  const methods: string[] = [];
  if (s.paymentCodEnabled) methods.push(x.cod);
  if (s.paymentCmiEnabled || s.paymentStripeEnabled || s.paymentPaypalEnabled) methods.push(x.card);
  const ways: string[] = [];
  if (!blank(s.contactEmail)) ways.push(x.byEmail((s.contactEmail as string).trim()));
  if (!blank(s.contactPhone)) ways.push(x.byPhone((s.contactPhone as string).trim()));
  if (!blank(s.contactWhatsapp)) ways.push(x.byWa((s.contactWhatsapp as string).trim()));
  const free = s.freeShippingThreshold != null && s.freeShippingThreshold > 0 ? x.shipFree(s.freeShippingThreshold) : '';
  return [
    { q: x.qOrder, a: x.aOrder },
    { q: x.qPay, a: methods.length ? x.payYes(methods.join(x.and)) : x.payNone },
    { q: x.qShip, a: `${free}${x.shipInfo}` },
    { q: x.qReach, a: ways.length ? x.reach(ways.join(x.and)) : x.reachNone },
  ];
}

type PageTemplate = { meta: UpsertStorePagePayload; blocks: StorePageBlock[] };

export function faqPage(lang: Lang, s: FaqSettings): PageTemplate {
  const title = T[lang].faqTitle;
  return {
    meta: { title, slug: 'faq', isHome: false, showInNav: true, published: true },
    blocks: [{ type: 'faq', sortOrder: 0, config: { title, faqStyle: 'accordion', items: faqItems(lang, s) } }],
  };
}

export function contactPage(lang: Lang): PageTemplate {
  const title = T[lang].contactTitle;
  return {
    meta: { title, slug: 'contact', isHome: false, showInNav: true, published: true },
    blocks: [{ type: 'contact', sortOrder: 0, config: { title, body: T[lang].contactBody, leadType: 'lead' } }],
  };
}
