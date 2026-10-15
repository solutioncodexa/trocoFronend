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
  heroTitle: 'Créez votre site e-commerce et vendez en ligne.',
  heroText:
    'Lancez votre boutique en ligne en quelques minutes, sans code : catalogue, commandes, paiement à la livraison ou confirmation WhatsApp, en dirhams. Disponible en français, en arabe et en anglais.',
  nameLabel: 'Nom de votre boutique',
  namePlaceholder: 'Atelier Fès',
  addressPlaceholder: 'adresse-de-votre-boutique',
  createShop: 'Créer ma boutique en ligne',
  trialNote: 'Essai gratuit {days} jours, sans carte bancaire.',
  slipLabel: 'Exemple de commande reçue sur votre boutique en ligne',
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
  featuresTitle: 'Tout ce qu’il faut pour vendre en ligne',
  features: [
    { title: 'Paiement à la livraison', text: 'Le client commande, vous encaissez à sa porte. Aucune carte bancaire n’est demandée.' },
    { title: 'Commandes sur WhatsApp', text: 'Le récapitulatif de chaque commande peut partir sur WhatsApp. Les numéros marocains sont mis au format +212 automatiquement.' },
    { title: 'Arabe, français, anglais', text: 'La boutique et l’administration changent de langue et passent de droite à gauche en arabe.' },
    { title: 'Vente et location', text: 'Louez au jour ou à la semaine, avec calendrier, caution et disponibilité calculée jour par jour.' },
    { title: 'Un site prêt en quelques minutes', text: 'L’assistant crée pour vous les pages, les couleurs et les catégories adaptées à votre activité. Vous validez, puis vous publiez.' },
    { title: 'Outils marketing intégrés', text: 'Codes promo, pixels publicitaires et relance des paniers abandonnés (plans Pro et Business) pour faire grandir vos ventes.' },
  ],
  stepsTitle: 'Lancez votre site e-commerce en trois étapes',
  steps: [
    { title: 'Créez votre boutique', text: 'Choisissez son nom : son adresse web est créée pour vous et reste modifiable avant de valider.' },
    { title: 'Personnalisez votre site', text: 'Thèmes, logo, couleurs et pages avec l’éditeur visuel, à votre rythme et sans code.' },
    { title: 'Ajoutez vos produits et recevez des commandes', text: 'Les commandes arrivent dans votre administration. Vous les suivez de la préparation à la livraison.' },
  ],
  pricingTitle: 'Choisissez votre plan',
  pricingText: 'Les {days} premiers jours sont gratuits. Passez à un plan supérieur quand votre activité grandit.',
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
  closingTitle: 'Lancez votre boutique en ligne dès aujourd’hui.',
  privacy: 'Confidentialité',
  terms: 'Conditions d’utilisation',
};

const en: LandingCopy = {
  ...fr,
  login: 'Sign in',
  dashboard: 'Dashboard',
  viewShop: 'View my shop',
  finishSetup: 'Set up and publish',
  heroTitle: 'Build your online store and start selling.',
  heroText:
    'Launch your e-commerce site in minutes, with no code: catalog, orders, cash on delivery or WhatsApp confirmation, in dirhams. Available in French, Arabic and English.',
  nameLabel: 'Your shop name',
  addressPlaceholder: 'your-shop-address',
  createShop: 'Create my online store',
  trialNote: 'Free for {days} days. No credit card.',
  slipLabel: 'Example of an order received on your online store',
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
  featuresTitle: 'Everything you need to sell online',
  features: [
    { title: 'Cash on delivery', text: 'Customers order, you collect at their door. No bank card needed.' },
    { title: 'Orders on WhatsApp', text: 'Each order summary can go out on WhatsApp. Moroccan phone numbers are formatted to +212 automatically.' },
    { title: 'Arabic, French, English', text: 'The shop and the admin switch language, and flip right to left in Arabic.' },
    { title: 'Sales and rentals', text: 'Rent by the day or the week, with a calendar, a deposit and availability worked out day by day.' },
    { title: 'A site ready in minutes', text: 'The assistant sets up pages, colors and categories for your business. You review them, then publish.' },
    { title: 'Built-in marketing tools', text: 'Promo codes, ad pixels and abandoned-cart reminders (Pro and Business plans) to grow your sales.' },
  ],
  stepsTitle: 'Launch your online store in three steps',
  steps: [
    { title: 'Create your store', text: 'Pick a name: we create its web address for you, and you can change it before you confirm.' },
    { title: 'Customize your site', text: 'Themes, logo, colors and pages with the visual editor, at your own pace and without code.' },
    { title: 'Add products and get orders', text: 'Orders land in your admin. Follow each one from preparation to delivery.' },
  ],
  pricingTitle: 'Choose your plan',
  pricingText: 'The first {days} days are free. Upgrade when your business grows.',
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
  closingTitle: 'Launch your online store today.',
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
  heroTitle: 'أنشئ موقعك للتجارة الإلكترونية وابدأ البيع عبر الإنترنت.',
  heroText:
    'أطلق متجرك الإلكتروني في دقائق ودون برمجة: كتالوج وطلبات ودفع عند الاستلام أو تأكيد عبر واتساب، بالدرهم. متوفر بالعربية والفرنسية والإنجليزية.',
  nameLabel: 'اسم متجرك',
  namePlaceholder: 'محترف فاس',
  addressPlaceholder: 'عنوان-متجرك',
  createShop: 'أنشئ متجري الإلكتروني',
  trialNote: 'تجربة مجانية {days} يومًا، بدون بطاقة بنكية.',
  slipLabel: 'مثال على طلب وصل إلى متجرك الإلكتروني',
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
  featuresTitle: 'كل ما تحتاجه للبيع عبر الإنترنت',
  features: [
    { title: 'الدفع عند الاستلام', text: 'يطلب الزبون وتقبض ثمن الطلب عند بابه. لا حاجة إلى بطاقة بنكية.' },
    { title: 'طلبات عبر واتساب', text: 'يمكن إرسال ملخص كل طلب عبر واتساب. تُحوَّل الأرقام المغربية تلقائيًا إلى صيغة ‎+212.' },
    { title: 'العربية والفرنسية والإنجليزية', text: 'يتغير لسان المتجر ولوحة الإدارة، وتنقلب الصفحة من اليمين إلى اليسار في العربية.' },
    { title: 'بيع وكراء', text: 'أكرِ بالنهار أو بالأسبوع، مع تقويم ووديعة وتوفر يُحسب يومًا بيوم.' },
    { title: 'موقع جاهز في دقائق', text: 'يجهّز لك المساعد الصفحات والألوان والأصناف المناسبة لنشاطك، فتراجعها ثم تنشر.' },
    { title: 'أدوات تسويق مدمجة', text: 'رموز تخفيض وبكسلات إعلانية وتذكير بالسلات المتروكة (خطتا Pro وBusiness) لتنمية مبيعاتك.' },
  ],
  stepsTitle: 'أطلق متجرك الإلكتروني في ثلاث خطوات',
  steps: [
    { title: 'أنشئ متجرك', text: 'اختر اسمًا له، وننشئ لك عنوانه على الويب تلقائيًا، ويمكنك تعديله قبل التأكيد.' },
    { title: 'خصّص موقعك', text: 'القوالب والشعار والألوان والصفحات بالمحرر المرئي، بالوتيرة التي تناسبك وبدون برمجة.' },
    { title: 'أضف منتجاتك واستقبل الطلبات', text: 'تصلك الطلبات في لوحة الإدارة، وتتابع كل طلب من التحضير إلى التسليم.' },
  ],
  pricingTitle: 'اختر خطتك',
  pricingText: 'الأيام {days} الأولى مجانية. انتقل إلى خطة أعلى حين يكبر نشاطك.',
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
  closingTitle: 'أطلق متجرك الإلكتروني اليوم.',
  privacy: 'الخصوصية',
  terms: 'شروط الاستخدام',
};

export const landingCopy: Record<AdminLocale, LandingCopy> = { fr, en, ar };
