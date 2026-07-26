export type StoreLocale = 'fr' | 'ar' | 'en';

export type MessageKey =
  | 'shop'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'addToCart'
  | 'filters'
  | 'freeShipping'
  | 'cookieTitle'
  | 'cookieBody'
  | 'acceptAll'
  | 'essentialOnly'
  | 'language'
  | 'currency'
  | 'payCod'
  | 'payCard'
  | 'payBnpl'
  | 'shipping'
  | 'loyaltyPoints';

const fr: Record<MessageKey, string> = {
  shop: 'Boutique',
  search: 'Rechercher',
  cart: 'Panier',
  checkout: 'Commande',
  addToCart: 'Ajouter au panier',
  filters: 'Filtres',
  freeShipping: 'Livraison gratuite',
  cookieTitle: 'Cookies & confidentialité',
  cookieBody:
    'Nous utilisons des cookies essentiels pour le panier et, avec votre accord, des cookies marketing (Meta, TikTok, Google).',
  acceptAll: 'Tout accepter',
  essentialOnly: 'Essentiels uniquement',
  language: 'Langue',
  currency: 'Devise',
  payCod: 'Paiement à la livraison',
  payCard: 'Carte bancaire (CMI)',
  payBnpl: 'Paiement en plusieurs fois',
  shipping: 'Livraison',
  loyaltyPoints: 'Points fidélité',
};

const ar: Record<MessageKey, string> = {
  shop: 'المتجر',
  search: 'بحث',
  cart: 'السلة',
  checkout: 'إتمام الطلب',
  addToCart: 'أضف إلى السلة',
  filters: 'تصفية',
  freeShipping: 'شحن مجاني',
  cookieTitle: 'ملفات تعريف الارتباط والخصوصية',
  cookieBody:
    'نستخدم ملفات أساسية للسلة، وبموافقتك ملفات تسويق (ميتا، تيك توك، جوجل).',
  acceptAll: 'قبول الكل',
  essentialOnly: 'الأساسية فقط',
  language: 'اللغة',
  currency: 'العملة',
  payCod: 'الدفع عند الاستلام',
  payCard: 'بطاقة بنكية (CMI)',
  payBnpl: 'الدفع على أقساط',
  shipping: 'الشحن',
  loyaltyPoints: 'نقاط الولاء',
};

const en: Record<MessageKey, string> = {
  shop: 'Shop',
  search: 'Search',
  cart: 'Cart',
  checkout: 'Checkout',
  addToCart: 'Add to cart',
  filters: 'Filters',
  freeShipping: 'Free shipping',
  cookieTitle: 'Cookies & privacy',
  cookieBody:
    'We use essential cookies for your cart and, with your consent, marketing cookies (Meta, TikTok, Google).',
  acceptAll: 'Accept all',
  essentialOnly: 'Essential only',
  language: 'Language',
  currency: 'Currency',
  payCod: 'Cash on delivery',
  payCard: 'Card (CMI)',
  payBnpl: 'Buy now, pay later',
  shipping: 'Shipping',
  loyaltyPoints: 'Loyalty points',
};

export const messages: Record<StoreLocale, Record<MessageKey, string>> = { fr, ar, en };

export function normalizeLocale(raw?: string | null): StoreLocale {
  const v = (raw || 'fr').toLowerCase().slice(0, 2);
  if (v === 'ar') return 'ar';
  if (v === 'en') return 'en';
  return 'fr';
}

export function parseSupportedLocales(raw?: string | null): StoreLocale[] {
  const parts = (raw || 'fr,ar,en')
    .split(/[,;\s]+/)
    .map((s) => normalizeLocale(s))
    .filter(Boolean);
  const uniq = [...new Set(parts)] as StoreLocale[];
  return uniq.length ? uniq : ['fr'];
}
