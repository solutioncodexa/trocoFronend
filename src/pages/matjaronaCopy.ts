import type { AdminLocale } from '@/i18n/admin/adminMessages';

export type LandingCopy = {
  navLabel: string;
  langLabel: string;
  login: string;
  dashboard: string;
  viewShop: string;
  finishSetup: string;
  heroTitle: string;
  heroText: string;
  nameLabel: string;
  namePlaceholder: string;
  addressPlaceholder: string;
  createShop: string;
  trialNote: string;
  slipLabel: string;
  orderNo: string;
  orderChannel: string;
  orderLines: { name: string; qty: number; price: number }[];
  total: string;
  payOnDelivery: string;
  stamp: string;
  currency: string;
  perMonth: string;
  featuresTitle: string;
  features: { title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  pricingTitle: string;
  pricingText: string;
  choosePlan: string;
  compareCaption: string;
  compareFeature: string;
  unlimited: string;
  ownerOnly: string;
  subdomainOnly: string;
  noWhatsapp: string;
  themesTwo: string;
  themesAll: string;
  builderFull: string;
  builderSimple: string;
  webhooksAll: string;
  yes: string;
  no: string;
  rowProducts: string;
  rowStaff: string;
  rowOrders: string;
  rowDomain: string;
  rowThemes: string;
  rowBuilder: string;
  rowAbandoned: string;
  rowPromo: string;
  rowPixels: string;
  rowWhatsapp: string;
  rowWebhooks: string;
  rowStorage: string;
  closingTitle: string;
  privacy: string;
  terms: string;
};

const fr: LandingCopy = {
  navLabel: 'Navigation',
  langLabel: 'Langue',
  login: 'Connexion',
  dashboard: 'Tableau de bord',
  viewShop: 'Voir ma boutique',
  finishSetup: 'Configurer et publier',
  heroTitle: 'Votre boutique, ouverte avant que le thé refroidisse.',
  heroText:
    'Recevez vos commandes en dirhams, payées à la livraison ou confirmées sur WhatsApp. En français, en arabe, de gauche à droite comme de droite à gauche.',
  nameLabel: 'Nom de votre boutique',
  namePlaceholder: 'Atelier Fès',
  addressPlaceholder: 'adresse-de-votre-boutique',
  createShop: 'Créer ma boutique',
  trialNote: 'Essai gratuit {days} jours, sans carte bancaire.',
  slipLabel: 'Exemple de bon de commande généré par votre boutique',
  orderNo: 'Commande n°',
  orderChannel: 'via WhatsApp',
  orderLines: [
    { name: 'Babouches en cuir', qty: 2, price: 170 },
    { name: 'Théière en laiton', qty: 1, price: 120 },
  ],
  total: 'Total',
  payOnDelivery: 'Paiement à la livraison. Livraison offerte.',
  stamp: 'Confirmée',
  currency: 'DH',
  perMonth: '/ mois',
  featuresTitle: 'Ce que vous recevez avec la boutique',
  features: [
    { title: 'Paiement à la livraison', text: 'Le client commande, vous encaissez à sa porte. Aucune carte bancaire n’est demandée.' },
    { title: 'Commandes sur WhatsApp', text: 'Le récapitulatif de chaque commande peut partir sur WhatsApp. Les numéros marocains sont mis au format +212 automatiquement.' },
    { title: 'Arabe, français, anglais', text: 'La boutique et l’administration changent de langue et passent de droite à gauche en arabe.' },
    { title: 'Vente et location', text: 'Louez au jour ou à la semaine, avec calendrier, caution et disponibilité calculée jour par jour.' },
    { title: 'Un assistant pour démarrer', text: 'Il propose des pages, des couleurs et des catégories adaptées à votre métier, que vous validez avant publication.' },
    { title: 'Codes promo et relances', text: 'Créez des codes de réduction, et relancez les paniers abandonnés avec les plans Pro et Business.' },
  ],
  stepsTitle: 'Ouvrir sa boutique en trois étapes',
  steps: [
    { title: 'Donnez un nom à votre boutique', text: 'Son adresse est créée pour vous. Vous pouvez la modifier avant de valider.' },
    { title: 'Choisissez son allure', text: 'Logo, couleurs et pages d’accueil, à votre rythme et sans code.' },
    { title: 'Ajoutez vos produits et vendez', text: 'Les commandes arrivent dans votre administration. Vous les suivez de la préparation à la livraison.' },
  ],
  pricingTitle: 'Choisissez votre plan',
  pricingText: 'Les {days} premiers jours sont gratuits. Changez de plan quand votre boutique grandit.',
  choosePlan: 'Choisir {plan}',
  compareCaption: 'Comparaison des plans',
  compareFeature: 'Fonctionnalité',
  unlimited: 'Illimité',
  ownerOnly: '1 (propriétaire)',
  subdomainOnly: 'Sous-domaine Get STORE',
  noWhatsapp: 'Commandes WhatsApp manuelles',
  themesTwo: '2 thèmes',
  themesAll: 'Tous',
  builderFull: 'Complet',
  builderSimple: 'Simple',
  webhooksAll: 'Tous',
  yes: 'Inclus',
  no: 'Non inclus',
  rowProducts: 'Produits',
  rowStaff: 'Comptes équipe',
  rowOrders: 'Commandes par mois',
  rowDomain: 'Domaine personnalisé',
  rowThemes: 'Thèmes',
  rowBuilder: 'Éditeur de pages',
  rowAbandoned: 'Panier abandonné',
  rowPromo: 'Codes promo',
  rowPixels: 'Pixels publicitaires',
  rowWhatsapp: 'WhatsApp Business',
  rowWebhooks: 'Webhooks',
  rowStorage: 'Stockage des images',
  closingTitle: 'Votre première commande peut arriver cette semaine.',
  privacy: 'Confidentialité',
  terms: 'Conditions d’utilisation',
};

const en: LandingCopy = {
  ...fr,
  login: 'Sign in',
  dashboard: 'Dashboard',
  viewShop: 'View my shop',
  finishSetup: 'Set up and publish',
  heroTitle: 'Your shop, open before the tea cools.',
  heroText:
    'Take orders in dirhams, paid on delivery or confirmed on WhatsApp. In French, in Arabic, left to right and right to left.',
  nameLabel: 'Your shop name',
  addressPlaceholder: 'your-shop-address',
  createShop: 'Create my shop',
  trialNote: 'Free for {days} days. No credit card.',
  slipLabel: 'Example of an order slip generated by your shop',
  orderNo: 'Order no.',
  orderChannel: 'via WhatsApp',
  orderLines: [
    { name: 'Leather babouches', qty: 2, price: 170 },
    { name: 'Brass teapot', qty: 1, price: 120 },
  ],
  payOnDelivery: 'Pay on delivery. Free shipping.',
  stamp: 'Confirmed',
  currency: 'MAD',
  perMonth: '/ month',
  featuresTitle: 'What comes with your shop',
  features: [
    { title: 'Cash on delivery', text: 'Customers order, you collect at their door. No bank card needed.' },
    { title: 'Orders on WhatsApp', text: 'Each order summary can go out on WhatsApp. Moroccan phone numbers are formatted to +212 automatically.' },
    { title: 'Arabic, French, English', text: 'The shop and the admin switch language, and flip right to left in Arabic.' },
    { title: 'Sales and rentals', text: 'Rent by the day or the week, with a calendar, a deposit and availability worked out day by day.' },
    { title: 'An assistant to get started', text: 'It suggests pages, colors and categories for your trade, and you approve them before they go live.' },
    { title: 'Promo codes and reminders', text: 'Create discount codes, and remind customers about abandoned carts on the Pro and Business plans.' },
  ],
  stepsTitle: 'Open your shop in three steps',
  steps: [
    { title: 'Name your shop', text: 'We create its address for you. You can change it before you confirm.' },
    { title: 'Choose how it looks', text: 'Logo, colors and home pages, at your own pace and without code.' },
    { title: 'Add your products and sell', text: 'Orders land in your admin. Follow each one from preparation to delivery.' },
  ],
  pricingTitle: 'Choose your plan',
  pricingText: 'The first {days} days are free. Change plan when your shop grows.',
  choosePlan: 'Choose {plan}',
  compareCaption: 'Plan comparison',
  compareFeature: 'Feature',
  unlimited: 'Unlimited',
  ownerOnly: '1 (owner)',
  subdomainOnly: 'Get STORE subdomain',
  noWhatsapp: 'Manual WhatsApp orders',
  themesTwo: '2 themes',
  themesAll: 'All',
  builderFull: 'Full',
  builderSimple: 'Simple',
  webhooksAll: 'All',
  yes: 'Included',
  no: 'Not included',
  rowProducts: 'Products',
  rowStaff: 'Team accounts',
  rowOrders: 'Orders per month',
  rowDomain: 'Custom domain',
  rowThemes: 'Themes',
  rowBuilder: 'Page editor',
  rowAbandoned: 'Abandoned cart',
  rowPromo: 'Promo codes',
  rowPixels: 'Ad pixels',
  rowWhatsapp: 'WhatsApp Business',
  rowWebhooks: 'Webhooks',
  rowStorage: 'Image storage',
  closingTitle: 'Your first order could arrive this week.',
  privacy: 'Privacy',
  terms: 'Terms of use',
};

const ar: LandingCopy = {
  ...fr,
  navLabel: 'التنقل',
  langLabel: 'اللغة',
  login: 'تسجيل الدخول',
  dashboard: 'لوحة التحكم',
  viewShop: 'عرض متجري',
  finishSetup: 'إعداد المتجر ونشره',
  heroTitle: 'متجرك مفتوح قبل أن يبرد الشاي.',
  heroText:
    'استقبل طلباتك بالدرهم، مع الدفع عند الاستلام أو التأكيد عبر واتساب. بالعربية والفرنسية، من اليمين إلى اليسار ومن اليسار إلى اليمين.',
  nameLabel: 'اسم متجرك',
  namePlaceholder: 'محترف فاس',
  addressPlaceholder: 'عنوان-متجرك',
  createShop: 'أنشئ متجري',
  trialNote: 'تجربة مجانية {days} يومًا، بدون بطاقة بنكية.',
  slipLabel: 'مثال على وصل طلب يصدره متجرك',
  orderNo: 'الطلب رقم',
  orderChannel: 'عبر واتساب',
  orderLines: [
    { name: 'بلغة جلدية', qty: 2, price: 170 },
    { name: 'إبريق شاي نحاسي', qty: 1, price: 120 },
  ],
  total: 'المجموع',
  payOnDelivery: 'الدفع عند الاستلام. التوصيل مجاني.',
  stamp: 'تم التأكيد',
  currency: 'درهم',
  perMonth: '/ شهريًا',
  featuresTitle: 'ما يأتي مع متجرك',
  features: [
    { title: 'الدفع عند الاستلام', text: 'يطلب الزبون وتقبض ثمن الطلب عند بابه. لا حاجة إلى بطاقة بنكية.' },
    { title: 'طلبات عبر واتساب', text: 'يمكن إرسال ملخص كل طلب عبر واتساب. تُحوَّل الأرقام المغربية تلقائيًا إلى صيغة ‎+212.' },
    { title: 'العربية والفرنسية والإنجليزية', text: 'يتغير لسان المتجر ولوحة الإدارة، وتنقلب الصفحة من اليمين إلى اليسار في العربية.' },
    { title: 'بيع وكراء', text: 'أكرِ بالنهار أو بالأسبوع، مع تقويم ووديعة وتوفر يُحسب يومًا بيوم.' },
    { title: 'مساعد للبداية', text: 'يقترح صفحات وألوانًا وأصنافًا تناسب نشاطك، وتوافق عليها قبل النشر.' },
    { title: 'رموز تخفيض وتذكيرات', text: 'أنشئ رموز تخفيض، وذكّر الزبناء بالسلات المتروكة في خطتي Pro وBusiness.' },
  ],
  stepsTitle: 'افتح متجرك في ثلاث خطوات',
  steps: [
    { title: 'اختر اسمًا لمتجرك', text: 'ننشئ له عنوانًا تلقائيًا، ويمكنك تعديله قبل التأكيد.' },
    { title: 'اختر مظهره', text: 'الشعار والألوان والصفحات الرئيسية، بالوتيرة التي تناسبك وبدون برمجة.' },
    { title: 'أضف منتجاتك وابدأ البيع', text: 'تصلك الطلبات في لوحة الإدارة، وتتابع كل طلب من التحضير إلى التسليم.' },
  ],
  pricingTitle: 'اختر خطتك',
  pricingText: 'الأيام {days} الأولى مجانية. غيّر خطتك حين يكبر متجرك.',
  choosePlan: 'اختر {plan}',
  compareCaption: 'مقارنة الخطط',
  compareFeature: 'الميزة',
  unlimited: 'غير محدود',
  ownerOnly: '1 (المالك)',
  subdomainOnly: 'نطاق فرعي من Get STORE',
  noWhatsapp: 'طلبات واتساب يدوية',
  themesTwo: 'قالبان',
  themesAll: 'كل القوالب',
  builderFull: 'كامل',
  builderSimple: 'بسيط',
  webhooksAll: 'الكل',
  yes: 'مشمول',
  no: 'غير مشمول',
  rowProducts: 'المنتجات',
  rowStaff: 'حسابات الفريق',
  rowOrders: 'الطلبات في الشهر',
  rowDomain: 'نطاق خاص',
  rowThemes: 'القوالب',
  rowBuilder: 'محرر الصفحات',
  rowAbandoned: 'السلة المتروكة',
  rowPromo: 'رموز التخفيض',
  rowPixels: 'بكسلات الإعلانات',
  rowWhatsapp: 'واتساب للأعمال',
  rowWebhooks: 'Webhooks',
  rowStorage: 'مساحة الصور',
  closingTitle: 'قد يصلك أول طلب هذا الأسبوع.',
  privacy: 'الخصوصية',
  terms: 'شروط الاستخدام',
};

export const landingCopy: Record<AdminLocale, LandingCopy> = { fr, en, ar };
