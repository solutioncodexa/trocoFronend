import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n pour paniers abandonnés, devis, leads, hub boutique, etc. */
export type MorePagesAdminMessageKey =
  | 'abandonedCarts.colActivity'
  | 'abandonedCarts.colContact'
  | 'abandonedCarts.colItems'
  | 'abandonedCarts.colReminder'
  | 'abandonedCarts.reminderSent'
  | 'abandonedCarts.reminderScheduled'
  | 'abandonedCarts.recovered'
  | 'abandonedCarts.abandoned'
  | 'customRequests.searchPlaceholder'
  | 'customRequests.requestsCount'
  | 'customRequests.filterPrefix'
  | 'customRequests.updating'
  | 'customRequests.unitsEstimated'
  | 'customRequests.quote'
  | 'customRequests.quotePrefix'
  | 'customRequests.validUntil'
  | 'customRequests.dialogTitle'
  | 'customRequests.loadingDetail'
  | 'customRequests.typeLogo'
  | 'customRequests.typeUnique'
  | 'customRequests.typeDimensions'
  | 'customRequests.typeOtherCustom'
  | 'customRequests.typeBulk'
  | 'customRequests.typeRestock'
  | 'customRequests.typeMulti'
  | 'customRequests.typeOtherQuote'
  | 'leads.breadcrumb'
  | 'leads.exportCsv'
  | 'leads.exportDone'
  | 'leads.exportError'
  | 'leads.empty'
  | 'leads.colSource'
  | 'leads.typeNewsletter'
  | 'leads.typeContact'
  | 'leads.typeQuote'
  | 'onlineStore.customize'
  | 'onlineStore.viewNamed'
  | 'onlineStore.viewFallback'
  | 'onlineStore.statusTitle'
  | 'onlineStore.statusDesc'
  | 'onlineStore.navLabel'
  | 'onlineStore.bannerLabel'
  | 'onlineStore.homeLabel'
  | 'onlineStore.stickyLabel'
  | 'onlineStore.headerMega'
  | 'onlineStore.headerSimple'
  | 'onlineStore.bannerRotating'
  | 'onlineStore.bannerAppBar'
  | 'onlineStore.bannerNone'
  | 'onlineStore.homeBuilder'
  | 'onlineStore.homeClassic'
  | 'onlineStore.tileAppearanceTitle'
  | 'onlineStore.tileAppearanceDesc'
  | 'onlineStore.tilePagesTitle'
  | 'onlineStore.tilePagesDesc'
  | 'onlineStore.tileNavTitle'
  | 'onlineStore.tileNavDesc'
  | 'onlineStore.tileTopBarTitle'
  | 'onlineStore.tileTopBarDesc'
  | 'onlineStore.builderHomeTitle'
  | 'onlineStore.builderHomeDesc'
  | 'onlineStore.editNamed'
  | 'onlineStore.classicHomeTitle'
  | 'onlineStore.classicHomeDesc'
  | 'onlineStore.heroCategories'
  | 'onlineStore.featuredProducts'
  | 'onlineStore.createHomePage'
  | 'onlineStore.assistantTitle'
  | 'onlineStore.assistantDesc'
  | 'onlineStore.assistantCta';

const fr: Record<MorePagesAdminMessageKey, string> = {
  'abandonedCarts.colActivity': 'Dernière activité',
  'abandonedCarts.colContact': 'Contact',
  'abandonedCarts.colItems': 'Articles',
  'abandonedCarts.colReminder': 'Relance',
  'abandonedCarts.reminderSent': 'Envoyée',
  'abandonedCarts.reminderScheduled': 'Prévue {date}',
  'abandonedCarts.recovered': 'Récupéré',
  'abandonedCarts.abandoned': 'Abandonné',
  'customRequests.searchPlaceholder': 'Rechercher par ID, nom ou email…',
  'customRequests.requestsCount': '{count} demande(s)',
  'customRequests.filterPrefix': 'filtre',
  'customRequests.updating': '(mise à jour…)',
  'customRequests.unitsEstimated': '{count} unités estimées',
  'customRequests.quote': 'Devis',
  'customRequests.quotePrefix': 'Devis : {status}',
  'customRequests.validUntil': 'Valide jusqu’au {date}',
  'customRequests.dialogTitle': 'Demande {id}',
  'customRequests.loadingDetail': 'Chargement de la demande…',
  'customRequests.typeLogo': 'Sur mesure — logo',
  'customRequests.typeUnique': 'Sur mesure — produit unique',
  'customRequests.typeDimensions': 'Sur mesure — dimensions',
  'customRequests.typeOtherCustom': 'Sur mesure — autre',
  'customRequests.typeBulk': 'Devis — gros',
  'customRequests.typeRestock': 'Devis — stock',
  'customRequests.typeMulti': 'Devis — multi-produits',
  'customRequests.typeOtherQuote': 'Devis — autre',
  'leads.breadcrumb': 'Leads',
  'leads.exportCsv': 'Export CSV',
  'leads.exportDone': 'Export CSV téléchargé',
  'leads.exportError': 'Export impossible',
  'leads.empty': 'Aucun lead pour le moment.',
  'leads.colSource': 'Source',
  'leads.typeNewsletter': 'Newsletter',
  'leads.typeContact': 'Contact',
  'leads.typeQuote': 'Devis',
  'onlineStore.customize': 'Personnaliser la boutique',
  'onlineStore.viewNamed': 'Voir {name}',
  'onlineStore.viewFallback': 'la boutique',
  'onlineStore.statusTitle': 'État actuel',
  'onlineStore.statusDesc':
    'Source de vérité pour le header et le bandeau — une seule active à la fois.',
  'onlineStore.navLabel': 'Navigation :',
  'onlineStore.bannerLabel': 'Bandeau :',
  'onlineStore.homeLabel': 'Accueil :',
  'onlineStore.stickyLabel': 'CTA sticky :',
  'onlineStore.headerMega': 'Mega menu (Navigation)',
  'onlineStore.headerSimple': 'Liens simples (Apparence → Header)',
  'onlineStore.bannerRotating': 'Bandeau rotatif ({count} message(s))',
  'onlineStore.bannerAppBar': 'En-tête / promo App bar',
  'onlineStore.bannerNone': 'Aucun bandeau actif',
  'onlineStore.homeBuilder': 'Page builder (« {title} »)',
  'onlineStore.homeClassic': 'Accueil classique (thème + sections)',
  'onlineStore.tileAppearanceTitle': 'Apparence',
  'onlineStore.tileAppearanceDesc': 'Thèmes, couleurs, polices, logo et header.',
  'onlineStore.tilePagesTitle': 'Pages',
  'onlineStore.tilePagesDesc': 'Constructeur, accueil personnalisé, templates.',
  'onlineStore.tileNavTitle': 'Navigation',
  'onlineStore.tileNavDesc': 'Menus, en-tête global et CTA sticky.',
  'onlineStore.tileTopBarTitle': 'Bandeau',
  'onlineStore.tileTopBarDesc': 'Messages rotatifs au-dessus de la vitrine.',
  'onlineStore.builderHomeTitle': 'Accueil page builder',
  'onlineStore.builderHomeDesc':
    'Votre page d’accueil publiée remplace les sections classiques. Éditez-la dans le constructeur.',
  'onlineStore.editNamed': 'Éditer « {title} »',
  'onlineStore.classicHomeTitle': 'Accueil classique',
  'onlineStore.classicHomeDesc':
    'Pas de page d’accueil publiée : catégories hero et produits à la une. Pour un accueil type Shopify, créez une page Accueil dans Pages.',
  'onlineStore.heroCategories': 'Catégories accueil',
  'onlineStore.featuredProducts': 'Produits à la une',
  'onlineStore.createHomePage': 'Créer une page d’accueil',
  'onlineStore.assistantTitle': 'Assistant de configuration',
  'onlineStore.assistantDesc': 'Thème → identité → accueil → menu → bandeau → produits.',
  'onlineStore.assistantCta': 'Lancer l’assistant',
};

const en: Record<MorePagesAdminMessageKey, string> = {
  'abandonedCarts.colActivity': 'Last activity',
  'abandonedCarts.colContact': 'Contact',
  'abandonedCarts.colItems': 'Items',
  'abandonedCarts.colReminder': 'Reminder',
  'abandonedCarts.reminderSent': 'Sent',
  'abandonedCarts.reminderScheduled': 'Scheduled {date}',
  'abandonedCarts.recovered': 'Recovered',
  'abandonedCarts.abandoned': 'Abandoned',
  'customRequests.searchPlaceholder': 'Search by ID, name or email…',
  'customRequests.requestsCount': '{count} request(s)',
  'customRequests.filterPrefix': 'filter',
  'customRequests.updating': '(updating…)',
  'customRequests.unitsEstimated': '{count} estimated units',
  'customRequests.quote': 'Quote',
  'customRequests.quotePrefix': 'Quote: {status}',
  'customRequests.validUntil': 'Valid until {date}',
  'customRequests.dialogTitle': 'Request {id}',
  'customRequests.loadingDetail': 'Loading request…',
  'customRequests.typeLogo': 'Custom — logo',
  'customRequests.typeUnique': 'Custom — unique product',
  'customRequests.typeDimensions': 'Custom — dimensions',
  'customRequests.typeOtherCustom': 'Custom — other',
  'customRequests.typeBulk': 'Quote — bulk',
  'customRequests.typeRestock': 'Quote — restock',
  'customRequests.typeMulti': 'Quote — multi-product',
  'customRequests.typeOtherQuote': 'Quote — other',
  'leads.breadcrumb': 'Leads',
  'leads.exportCsv': 'Export CSV',
  'leads.exportDone': 'CSV export downloaded',
  'leads.exportError': 'Export failed',
  'leads.empty': 'No leads yet.',
  'leads.colSource': 'Source',
  'leads.typeNewsletter': 'Newsletter',
  'leads.typeContact': 'Contact',
  'leads.typeQuote': 'Quote',
  'onlineStore.customize': 'Customize store',
  'onlineStore.viewNamed': 'View {name}',
  'onlineStore.viewFallback': 'the store',
  'onlineStore.statusTitle': 'Current status',
  'onlineStore.statusDesc':
    'Source of truth for the header and banner — only one active at a time.',
  'onlineStore.navLabel': 'Navigation:',
  'onlineStore.bannerLabel': 'Banner:',
  'onlineStore.homeLabel': 'Home:',
  'onlineStore.stickyLabel': 'Sticky CTA:',
  'onlineStore.headerMega': 'Mega menu (Navigation)',
  'onlineStore.headerSimple': 'Simple links (Appearance → Header)',
  'onlineStore.bannerRotating': 'Rotating banner ({count} message(s))',
  'onlineStore.bannerAppBar': 'Header / App bar promo',
  'onlineStore.bannerNone': 'No active banner',
  'onlineStore.homeBuilder': 'Page builder (“{title}”)',
  'onlineStore.homeClassic': 'Classic home (theme + sections)',
  'onlineStore.tileAppearanceTitle': 'Appearance',
  'onlineStore.tileAppearanceDesc': 'Themes, colors, fonts, logo and header.',
  'onlineStore.tilePagesTitle': 'Pages',
  'onlineStore.tilePagesDesc': 'Builder, custom home, templates.',
  'onlineStore.tileNavTitle': 'Navigation',
  'onlineStore.tileNavDesc': 'Menus, global header and sticky CTA.',
  'onlineStore.tileTopBarTitle': 'Top bar',
  'onlineStore.tileTopBarDesc': 'Rotating messages above the storefront.',
  'onlineStore.builderHomeTitle': 'Page builder home',
  'onlineStore.builderHomeDesc':
    'Your published home page replaces classic sections. Edit it in the builder.',
  'onlineStore.editNamed': 'Edit “{title}”',
  'onlineStore.classicHomeTitle': 'Classic home',
  'onlineStore.classicHomeDesc':
    'No published home page: hero categories and featured products. For a Shopify-style home, create a Home page in Pages.',
  'onlineStore.heroCategories': 'Home categories',
  'onlineStore.featuredProducts': 'Featured products',
  'onlineStore.createHomePage': 'Create a home page',
  'onlineStore.assistantTitle': 'Setup assistant',
  'onlineStore.assistantDesc': 'Theme → identity → home → menu → banner → products.',
  'onlineStore.assistantCta': 'Launch assistant',
};

const ar: Record<MorePagesAdminMessageKey, string> = {
  'abandonedCarts.colActivity': 'آخر نشاط',
  'abandonedCarts.colContact': 'جهة الاتصال',
  'abandonedCarts.colItems': 'العناصر',
  'abandonedCarts.colReminder': 'تذكير',
  'abandonedCarts.reminderSent': 'مُرسَل',
  'abandonedCarts.reminderScheduled': 'مجدول {date}',
  'abandonedCarts.recovered': 'مُسترجَع',
  'abandonedCarts.abandoned': 'متروك',
  'customRequests.searchPlaceholder': 'البحث بالمعرّف أو الاسم أو البريد…',
  'customRequests.requestsCount': '{count} طلب(طلبات)',
  'customRequests.filterPrefix': 'تصفية',
  'customRequests.updating': '(جارٍ التحديث…)',
  'customRequests.unitsEstimated': '{count} وحدة مقدّرة',
  'customRequests.quote': 'عرض سعر',
  'customRequests.quotePrefix': 'عرض سعر: {status}',
  'customRequests.validUntil': 'صالح حتى {date}',
  'customRequests.dialogTitle': 'الطلب {id}',
  'customRequests.loadingDetail': 'جارٍ تحميل الطلب…',
  'customRequests.typeLogo': 'مخصص — شعار',
  'customRequests.typeUnique': 'مخصص — منتج فريد',
  'customRequests.typeDimensions': 'مخصص — أبعاد',
  'customRequests.typeOtherCustom': 'مخصص — أخرى',
  'customRequests.typeBulk': 'عرض سعر — جملة',
  'customRequests.typeRestock': 'عرض سعر — مخزون',
  'customRequests.typeMulti': 'عرض سعر — منتجات متعددة',
  'customRequests.typeOtherQuote': 'عرض سعر — أخرى',
  'leads.breadcrumb': 'العملاء المحتملون',
  'leads.exportCsv': 'تصدير CSV',
  'leads.exportDone': 'تم تنزيل ملف CSV',
  'leads.exportError': 'تعذّر التصدير',
  'leads.empty': 'لا يوجد عملاء محتملون بعد.',
  'leads.colSource': 'المصدر',
  'leads.typeNewsletter': 'النشرة',
  'leads.typeContact': 'اتصال',
  'leads.typeQuote': 'عرض سعر',
  'onlineStore.customize': 'تخصيص المتجر',
  'onlineStore.viewNamed': 'عرض {name}',
  'onlineStore.viewFallback': 'المتجر',
  'onlineStore.statusTitle': 'الحالة الحالية',
  'onlineStore.statusDesc':
    'مصدر الحقيقة للرأس والشريط — واحد فقط نشط في كل مرة.',
  'onlineStore.navLabel': 'التنقل:',
  'onlineStore.bannerLabel': 'الشريط:',
  'onlineStore.homeLabel': 'الرئيسية:',
  'onlineStore.stickyLabel': 'زر ثابت:',
  'onlineStore.headerMega': 'قائمة ضخمة (التنقل)',
  'onlineStore.headerSimple': 'روابط بسيطة (المظهر ← الرأس)',
  'onlineStore.bannerRotating': 'شريط دوّار ({count} رسالة)',
  'onlineStore.bannerAppBar': 'رأس / ترويج شريط التطبيق',
  'onlineStore.bannerNone': 'لا يوجد شريط نشط',
  'onlineStore.homeBuilder': 'منشئ الصفحات (« {title} »)',
  'onlineStore.homeClassic': 'رئيسية كلاسيكية (سمة + أقسام)',
  'onlineStore.tileAppearanceTitle': 'المظهر',
  'onlineStore.tileAppearanceDesc': 'السمات والألوان والخطوط والشعار والرأس.',
  'onlineStore.tilePagesTitle': 'الصفحات',
  'onlineStore.tilePagesDesc': 'المنشئ، الرئيسية المخصصة، والقوالب.',
  'onlineStore.tileNavTitle': 'التنقل',
  'onlineStore.tileNavDesc': 'القوائم والرأس العام والزر الثابت.',
  'onlineStore.tileTopBarTitle': 'الشريط العلوي',
  'onlineStore.tileTopBarDesc': 'رسائل دوّارة أعلى الواجهة.',
  'onlineStore.builderHomeTitle': 'رئيسية منشئ الصفحات',
  'onlineStore.builderHomeDesc':
    'صفحتك الرئيسية المنشورة تستبدل الأقسام الكلاسيكية. عدّلها في المنشئ.',
  'onlineStore.editNamed': 'تعديل « {title} »',
  'onlineStore.classicHomeTitle': 'رئيسية كلاسيكية',
  'onlineStore.classicHomeDesc':
    'لا توجد صفحة رئيسية منشورة: فئات البطل والمنتجات المميزة. لأسلوب شبيه بـ Shopify، أنشئ صفحة رئيسية في الصفحات.',
  'onlineStore.heroCategories': 'فئات الصفحة الرئيسية',
  'onlineStore.featuredProducts': 'منتجات مميزة',
  'onlineStore.createHomePage': 'إنشاء صفحة رئيسية',
  'onlineStore.assistantTitle': 'مساعد الإعداد',
  'onlineStore.assistantDesc': 'سمة ← هوية ← رئيسية ← قائمة ← شريط ← منتجات.',
  'onlineStore.assistantCta': 'تشغيل المساعد',
};

export const morePagesAdminExtra: Record<
  StoreLocale,
  Record<MorePagesAdminMessageKey, string>
> = {
  fr,
  en,
  ar,
};
