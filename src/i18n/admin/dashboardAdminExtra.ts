import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n du tableau de bord admin (corps de page). */
export type DashboardAdminMessageKey =
  | 'dashboard.toastCreatedPending'
  | 'dashboard.toastWelcomeChecklist'
  | 'dashboard.viewStorefront'
  | 'dashboard.pendingActivationTitle'
  | 'dashboard.pendingActivationBody'
  | 'dashboard.setupTitle'
  | 'dashboard.setupRemaining'
  | 'dashboard.setupTheme'
  | 'dashboard.setupLogo'
  | 'dashboard.setupAppearance'
  | 'dashboard.setupFirstProduct'
  | 'dashboard.setupViewStore'
  | 'dashboard.qaNewProduct'
  | 'dashboard.qaCategory'
  | 'dashboard.statProducts'
  | 'dashboard.statCustom'
  | 'dashboard.statRevenue'
  | 'dashboard.newOrdersCount'
  | 'dashboard.pendingCount'
  | 'dashboard.delivered12m'
  | 'dashboard.viewAllArrow'
  | 'dashboard.lowStock'
  | 'dashboard.outOfStock'
  | 'dashboard.pendingCustomizations'
  | 'dashboard.modelAlt'
  | 'status.new'
  | 'status.confirmed'
  | 'status.delivered'
  | 'status.cancelled'
  | 'status.contacted'
  | 'status.completed'
  | 'common.activate'
  | 'common.deactivate';

const fr: Record<DashboardAdminMessageKey, string> = {
  'dashboard.toastCreatedPending':
    'Boutique créée — en attente d’activation par Get STORE.',
  'dashboard.toastWelcomeChecklist':
    'Bienvenue ! Suivez la checklist pour lancer votre boutique.',
  'dashboard.viewStorefront': 'Voir la boutique',
  'dashboard.pendingActivationTitle': 'Compte en attente d’activation',
  'dashboard.pendingActivationBody':
    'Un Super Admin Get STORE doit activer votre boutique avant qu’elle soit visible en ligne. Vous pouvez déjà préparer logo, design et produits.',
  'dashboard.setupTitle': 'Démarrez votre boutique',
  'dashboard.setupRemaining': '{count} étape(s) restante(s) pour être prêt.',
  'dashboard.setupTheme': 'Choisir un thème',
  'dashboard.setupLogo': 'Ajouter un logo',
  'dashboard.setupAppearance': 'Personnaliser l’apparence',
  'dashboard.setupFirstProduct': 'Ajouter un premier produit',
  'dashboard.setupViewStore': 'Voir ma boutique en ligne',
  'dashboard.qaNewProduct': 'Nouveau produit',
  'dashboard.qaCategory': 'Catégorie',
  'dashboard.statProducts': 'Total Produits',
  'dashboard.statCustom': 'Personnalisations',
  'dashboard.statRevenue': "Chiffre d'affaires",
  'dashboard.newOrdersCount': '{count} nouvelles',
  'dashboard.pendingCount': '{count} en attente',
  'dashboard.delivered12m': 'Livrées (12 mois)',
  'dashboard.viewAllArrow': 'Voir tout →',
  'dashboard.lowStock': 'Alertes stock bas',
  'dashboard.outOfStock': 'Ruptures',
  'dashboard.pendingCustomizations': 'Personnalisations en attente',
  'dashboard.modelAlt': 'Modèle',
  'status.new': 'Nouvelle',
  'status.confirmed': 'Confirmée',
  'status.delivered': 'Livrée',
  'status.cancelled': 'Annulée',
  'status.contacted': 'Contacté',
  'status.completed': 'Terminée',
  'common.activate': 'Activer',
  'common.deactivate': 'Désactiver',
};

const en: Record<DashboardAdminMessageKey, string> = {
  'dashboard.toastCreatedPending':
    'Store created — waiting for Get STORE activation.',
  'dashboard.toastWelcomeChecklist':
    'Welcome! Follow the checklist to launch your store.',
  'dashboard.viewStorefront': 'View store',
  'dashboard.pendingActivationTitle': 'Account pending activation',
  'dashboard.pendingActivationBody':
    'A Get STORE Super Admin must activate your store before it is visible online. You can already prepare your logo, design and products.',
  'dashboard.setupTitle': 'Get your store started',
  'dashboard.setupRemaining': '{count} step(s) left to be ready.',
  'dashboard.setupTheme': 'Choose a theme',
  'dashboard.setupLogo': 'Add a logo',
  'dashboard.setupAppearance': 'Customize appearance',
  'dashboard.setupFirstProduct': 'Add a first product',
  'dashboard.setupViewStore': 'View my online store',
  'dashboard.qaNewProduct': 'New product',
  'dashboard.qaCategory': 'Category',
  'dashboard.statProducts': 'Total products',
  'dashboard.statCustom': 'Custom requests',
  'dashboard.statRevenue': 'Revenue',
  'dashboard.newOrdersCount': '{count} new',
  'dashboard.pendingCount': '{count} pending',
  'dashboard.delivered12m': 'Delivered (12 months)',
  'dashboard.viewAllArrow': 'View all →',
  'dashboard.lowStock': 'Low stock alerts',
  'dashboard.outOfStock': 'Out of stock',
  'dashboard.pendingCustomizations': 'Pending custom requests',
  'dashboard.modelAlt': 'Model',
  'status.new': 'New',
  'status.confirmed': 'Confirmed',
  'status.delivered': 'Delivered',
  'status.cancelled': 'Cancelled',
  'status.contacted': 'Contacted',
  'status.completed': 'Completed',
  'common.activate': 'Activate',
  'common.deactivate': 'Deactivate',
};

const ar: Record<DashboardAdminMessageKey, string> = {
  'dashboard.toastCreatedPending':
    'تم إنشاء المتجر — في انتظار التفعيل من Get STORE.',
  'dashboard.toastWelcomeChecklist':
    'مرحبًا! اتبع قائمة التحقق لإطلاق متجرك.',
  'dashboard.viewStorefront': 'عرض المتجر',
  'dashboard.pendingActivationTitle': 'الحساب في انتظار التفعيل',
  'dashboard.pendingActivationBody':
    'يجب على مشرف Get STORE تفعيل متجرك قبل أن يظهر عبر الإنترنت. يمكنك بالفعل تجهيز الشعار والتصميم والمنتجات.',
  'dashboard.setupTitle': 'ابدأ متجرك',
  'dashboard.setupRemaining': 'يتبقى {count} خطوة (خطوات) لتكون جاهزًا.',
  'dashboard.setupTheme': 'اختر سمة',
  'dashboard.setupLogo': 'أضف شعارًا',
  'dashboard.setupAppearance': 'خصّص المظهر',
  'dashboard.setupFirstProduct': 'أضف منتجك الأول',
  'dashboard.setupViewStore': 'عرض متجري عبر الإنترنت',
  'dashboard.qaNewProduct': 'منتج جديد',
  'dashboard.qaCategory': 'فئة',
  'dashboard.statProducts': 'إجمالي المنتجات',
  'dashboard.statCustom': 'التخصيصات',
  'dashboard.statRevenue': 'رقم المعاملات',
  'dashboard.newOrdersCount': '{count} جديدة',
  'dashboard.pendingCount': '{count} قيد الانتظار',
  'dashboard.delivered12m': 'المسلَّمة (12 شهرًا)',
  'dashboard.viewAllArrow': 'عرض الكل ←',
  'dashboard.lowStock': 'تنبيهات انخفاض المخزون',
  'dashboard.outOfStock': 'نفاد المخزون',
  'dashboard.pendingCustomizations': 'تخصيصات قيد الانتظار',
  'dashboard.modelAlt': 'نموذج',
  'status.new': 'جديدة',
  'status.confirmed': 'مؤكدة',
  'status.delivered': 'مسلَّمة',
  'status.cancelled': 'ملغاة',
  'status.contacted': 'تم التواصل',
  'status.completed': 'مكتملة',
  'common.activate': 'تفعيل',
  'common.deactivate': 'تعطيل',
};

export const dashboardAdminExtra: Record<
  StoreLocale,
  Record<DashboardAdminMessageKey, string>
> = {
  fr,
  en,
  ar,
};
