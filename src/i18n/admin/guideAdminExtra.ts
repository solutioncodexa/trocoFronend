import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n du guide 1ère utilisation admin. */
export type GuideAdminMessageKey =
  | 'guide.menu'
  | 'guide.badge'
  | 'guide.prev'
  | 'guide.next'
  | 'guide.skip'
  | 'guide.finish'
  | 'guide.saving'
  | 'guide.tipLabel'
  | 'guide.close'
  | 'guide.stepAria'
  | 'guide.saveError'
  | 'guide.open'
  | 'guide.welcome.title'
  | 'guide.welcome.summary'
  | 'guide.welcome.b1'
  | 'guide.welcome.b2'
  | 'guide.welcome.b3'
  | 'guide.welcome.tip'
  | 'guide.assistant.title'
  | 'guide.assistant.summary'
  | 'guide.assistant.b1'
  | 'guide.assistant.b2'
  | 'guide.assistant.b3'
  | 'guide.assistant.tip'
  | 'guide.assistant.cta'
  | 'guide.dashboard.title'
  | 'guide.dashboard.summary'
  | 'guide.dashboard.b1'
  | 'guide.dashboard.b2'
  | 'guide.dashboard.b3'
  | 'guide.dashboard.cta'
  | 'guide.catalog.title'
  | 'guide.catalog.summary'
  | 'guide.catalog.b1'
  | 'guide.catalog.b2'
  | 'guide.catalog.b3'
  | 'guide.catalog.b4'
  | 'guide.catalog.tip'
  | 'guide.catalog.cta'
  | 'guide.categories.title'
  | 'guide.categories.summary'
  | 'guide.categories.b1'
  | 'guide.categories.b2'
  | 'guide.categories.b3'
  | 'guide.categories.cta'
  | 'guide.orders.title'
  | 'guide.orders.summary'
  | 'guide.orders.b1'
  | 'guide.orders.b2'
  | 'guide.orders.b3'
  | 'guide.orders.b4'
  | 'guide.orders.cta'
  | 'guide.stock.title'
  | 'guide.stock.summary'
  | 'guide.stock.b1'
  | 'guide.stock.b2'
  | 'guide.stock.b3'
  | 'guide.stock.cta'
  | 'guide.storefront.title'
  | 'guide.storefront.summary'
  | 'guide.storefront.b1'
  | 'guide.storefront.b2'
  | 'guide.storefront.b3'
  | 'guide.storefront.cta'
  | 'guide.settings.title'
  | 'guide.settings.summary'
  | 'guide.settings.b1'
  | 'guide.settings.b2'
  | 'guide.settings.b3'
  | 'guide.settings.tip'
  | 'guide.settings.cta'
  | 'guide.ready.title'
  | 'guide.ready.summary'
  | 'guide.ready.b1'
  | 'guide.ready.b2'
  | 'guide.ready.b3';

const fr: Record<GuideAdminMessageKey, string> = {
  'guide.menu': "Guide d'utilisation",
  'guide.badge': 'Guide · {current}/{total}',
  'guide.prev': 'Précédent',
  'guide.next': 'Suivant',
  'guide.skip': 'Passer',
  'guide.finish': 'Terminer',
  'guide.saving': 'Enregistrement…',
  'guide.tipLabel': 'Astuce · ',
  'guide.close': 'Fermer',
  'guide.stepAria': 'Étape {n}',
  'guide.saveError': "Impossible d'enregistrer le guide",
  'guide.open': 'Ouvrir',

  'guide.welcome.title': 'Bienvenue dans votre back-office',
  'guide.welcome.summary':
    'Ce guide vous montre comment lancer et piloter votre boutique Get STORE. Il ne s’affiche qu’une fois : votre progression est enregistrée sur votre compte.',
  'guide.welcome.b1':
    'Menu de gauche : toutes les sections (catalogue, commandes, boutique, réglages).',
  'guide.welcome.b2':
    'Cloche en haut à droite : notifications en temps réel (nouvelles commandes, stock…).',
  'guide.welcome.b3':
    'En bas du menu : voir la vitrine, changer de langue, se déconnecter.',
  'guide.welcome.tip':
    'Vous pourrez relancer ce guide à tout moment via « Guide d’utilisation » dans le menu.',

  'guide.assistant.title': 'Assistant de démarrage',
  'guide.assistant.summary':
    'L’assistant vous aide à publier rapidement : thème, identité, page d’accueil, menu, produits, publication.',
  'guide.assistant.b1':
    'Ouvrez « Assistant » dans le menu pour un parcours guidé étape par étape.',
  'guide.assistant.b2':
    'Choisissez un thème, ajoutez logo et couleurs, puis votre premier produit.',
  'guide.assistant.b3':
    'La checklist du tableau de bord rappelle ce qu’il reste à faire pour la boutique.',
  'guide.assistant.tip':
    'L’assistant configure la boutique ; ce guide explique l’usage au quotidien.',
  'guide.assistant.cta': "Ouvrir l'assistant",

  'guide.dashboard.title': 'Tableau de bord',
  'guide.dashboard.summary':
    'Vue d’ensemble : produits, commandes, personnalisations, chiffre d’affaires et alertes stock.',
  'guide.dashboard.b1': 'Cliquez une carte KPI pour aller directement à la section concernée.',
  'guide.dashboard.b2':
    'Les commandes récentes et demandes personnalisées apparaissent en bas.',
  'guide.dashboard.b3':
    'Si la boutique est « en attente d’activation », Get STORE doit encore valider le compte.',
  'guide.dashboard.cta': 'Voir le tableau de bord',

  'guide.catalog.title': 'Catalogue : catégories & produits',
  'guide.catalog.summary':
    'Organisez d’abord les catégories, puis créez vos produits avec images, prix, stock et variantes.',
  'guide.catalog.b1':
    'Catégories : créez des parents et des sous-catégories (ex. Vêtements › T-shirts).',
  'guide.catalog.b2':
    'Produits : depuis le formulaire, vous pouvez créer une catégorie sans quitter la fiche.',
  'guide.catalog.b3':
    'Variantes (tailles, couleurs…) : activez-les et définissez stock / prix par combinaison.',
  'guide.catalog.b4':
    'Marque, badges (Nouveau, Promo) et images soignent l’affichage vitrine.',
  'guide.catalog.tip': 'Sans catégorie, vous ne pourrez pas enregistrer un produit.',
  'guide.catalog.cta': 'Créer un produit',

  'guide.categories.title': 'Arborescence des catégories',
  'guide.categories.summary':
    'Une bonne arborescence facilite la navigation client et les filtres catalogue.',
  'guide.categories.b1':
    'Parents = grandes familles ; enfants = sous-rayons affichés dans le menu.',
  'guide.categories.b2':
    'Désactiver une catégorie la masque de la vitrine sans supprimer les produits.',
  'guide.categories.b3':
    'Les tailles / pointures se gèrent dans « Attributs », pas comme sous-catégories.',
  'guide.categories.cta': 'Gérer les catégories',

  'guide.orders.title': 'Commandes & notifications',
  'guide.orders.summary':
    'Chaque commande client arrive ici. La cloche vous alerte immédiatement (temps réel).',
  'guide.orders.b1': 'Statuts typiques : Nouvelle → Confirmée → Livrée (ou Annulée).',
  'guide.orders.b2': 'Ouvrez une commande pour voir le client, les lignes et le suivi.',
  'guide.orders.b3':
    'Les demandes de personnalisation (logo client) ont leur propre section.',
  'guide.orders.b4':
    'Marquez les notifications comme lues pour garder la cloche à jour.',
  'guide.orders.cta': 'Voir les commandes',

  'guide.stock.title': 'Stock & alertes',
  'guide.stock.summary':
    'Suivez les quantités par variante, les seuils d’alerte et les mouvements (entrées / sorties).',
  'guide.stock.b1': 'Ajustez le stock ou le seuil de sécurité depuis Stock.',
  'guide.stock.b2':
    'Les alertes rupture / stock bas créent une notification admin.',
  'guide.stock.b3':
    'Le stock global produit sert de secours si une variante n’a pas de quantité.',
  'guide.stock.cta': 'Ouvrir le stock',

  'guide.storefront.title': 'Boutique en ligne',
  'guide.storefront.summary':
    'Pages, sections, menu, bandeau et blog composent votre vitrine — indépendamment du catalogue.',
  'guide.storefront.b1':
    'Hub « Boutique en ligne » : point d’entrée pour pages, apparence et publication.',
  'guide.storefront.b2':
    'Éditez la page d’accueil et les sections (hero, grille produits, etc.).',
  'guide.storefront.b3':
    'Prévisualisez toujours via « Voir la boutique » avant de communiquer l’URL.',
  'guide.storefront.cta': 'Hub boutique',

  'guide.settings.title': 'Paramètres & paiements',
  'guide.settings.summary':
    'Identité visuelle, devises, moyens de paiement (COD, CMI, Stripe…), pixels et options avancées.',
  'guide.settings.b1': 'Apparence : couleurs, polices, logo, favicon.',
  'guide.settings.b2': 'Activez les paiements selon votre plan et vos contrats.',
  'guide.settings.b3':
    'Membres / permissions : invitez un collaborateur STAFF si besoin.',
  'guide.settings.tip':
    'Les réglages sont liés à votre boutique, pas seulement à votre session.',
  'guide.settings.cta': 'Ouvrir les paramètres',

  'guide.ready.title': 'Vous êtes prêt',
  'guide.ready.summary':
    'Parcours recommandé : Assistant → 1er produit → vérifier la vitrine → attendre / traiter les commandes.',
  'guide.ready.b1':
    'Revenez ici via « Guide d’utilisation » si un collaborateur rejoint l’équipe.',
  'guide.ready.b2':
    'Le guide ne se réaffichera plus automatiquement (sauf nouvelle version majeure).',
  'guide.ready.b3':
    'Support : contactez Get STORE si la boutique reste en attente d’activation.',
};

const en: Record<GuideAdminMessageKey, string> = {
  'guide.menu': 'User guide',
  'guide.badge': 'Guide · {current}/{total}',
  'guide.prev': 'Previous',
  'guide.next': 'Next',
  'guide.skip': 'Skip',
  'guide.finish': 'Finish',
  'guide.saving': 'Saving…',
  'guide.tipLabel': 'Tip · ',
  'guide.close': 'Close',
  'guide.stepAria': 'Step {n}',
  'guide.saveError': 'Could not save the guide preference',
  'guide.open': 'Open',

  'guide.welcome.title': 'Welcome to your back office',
  'guide.welcome.summary':
    'This guide shows how to launch and run your Get STORE shop. It appears once: your progress is saved on your account.',
  'guide.welcome.b1':
    'Left menu: all sections (catalog, orders, storefront, settings).',
  'guide.welcome.b2':
    'Bell top-right: real-time notifications (new orders, stock…).',
  'guide.welcome.b3':
    'Bottom of the menu: view storefront, change language, sign out.',
  'guide.welcome.tip':
    'You can reopen this guide anytime via “User guide” in the menu.',

  'guide.assistant.title': 'Setup assistant',
  'guide.assistant.summary':
    'The assistant helps you publish quickly: theme, identity, home, menu, products, go-live.',
  'guide.assistant.b1':
    'Open “Assistant” in the menu for a step-by-step setup.',
  'guide.assistant.b2':
    'Pick a theme, add logo and colors, then your first product.',
  'guide.assistant.b3':
    'The dashboard checklist shows what is left to finish the store.',
  'guide.assistant.tip':
    'The assistant configures the store; this guide covers day-to-day use.',
  'guide.assistant.cta': 'Open assistant',

  'guide.dashboard.title': 'Dashboard',
  'guide.dashboard.summary':
    'Overview: products, orders, custom requests, revenue and stock alerts.',
  'guide.dashboard.b1': 'Click a KPI card to jump to that section.',
  'guide.dashboard.b2':
    'Recent orders and pending custom requests appear below.',
  'guide.dashboard.b3':
    'If status is “pending activation”, Get STORE still needs to approve the account.',
  'guide.dashboard.cta': 'Open dashboard',

  'guide.catalog.title': 'Catalog: categories & products',
  'guide.catalog.summary':
    'Set up categories first, then create products with images, pricing, stock and variants.',
  'guide.catalog.b1':
    'Categories: create parents and subcategories (e.g. Clothing › T-shirts).',
  'guide.catalog.b2':
    'Products: from the form you can create a category without leaving the page.',
  'guide.catalog.b3':
    'Variants (sizes, colors…): enable them and set stock / price per combination.',
  'guide.catalog.b4':
    'Brand, badges (New, Sale) and images improve the storefront look.',
  'guide.catalog.tip': 'Without a category you cannot save a product.',
  'guide.catalog.cta': 'Create a product',

  'guide.categories.title': 'Category tree',
  'guide.categories.summary':
    'A clear tree helps customer navigation and catalog filters.',
  'guide.categories.b1':
    'Parents = main families; children = sub-aisles shown in the menu.',
  'guide.categories.b2':
    'Deactivating a category hides it from the storefront without deleting products.',
  'guide.categories.b3':
    'Sizes are managed under “Attributes”, not as subcategories.',
  'guide.categories.cta': 'Manage categories',

  'guide.orders.title': 'Orders & notifications',
  'guide.orders.summary':
    'Every customer order lands here. The bell alerts you instantly (real time).',
  'guide.orders.b1': 'Typical statuses: New → Confirmed → Delivered (or Cancelled).',
  'guide.orders.b2': 'Open an order to see the customer, line items and tracking.',
  'guide.orders.b3':
    'Custom requests (customer logo) have their own section.',
  'guide.orders.b4':
    'Mark notifications as read to keep the bell accurate.',
  'guide.orders.cta': 'View orders',

  'guide.stock.title': 'Stock & alerts',
  'guide.stock.summary':
    'Track variant quantities, safety thresholds and movements (in / out).',
  'guide.stock.b1': 'Adjust stock or safety stock from Stock.',
  'guide.stock.b2':
    'Out-of-stock / low-stock alerts create an admin notification.',
  'guide.stock.b3':
    'Product-level stock is a fallback when a variant has no quantity.',
  'guide.stock.cta': 'Open stock',

  'guide.storefront.title': 'Online store',
  'guide.storefront.summary':
    'Pages, sections, menu, top bar and blog build your storefront — separate from the catalog.',
  'guide.storefront.b1':
    '“Online store” hub: entry point for pages, appearance and publishing.',
  'guide.storefront.b2':
    'Edit the home page and sections (hero, product grid, etc.).',
  'guide.storefront.b3':
    'Always preview via “View store” before sharing the URL.',
  'guide.storefront.cta': 'Store hub',

  'guide.settings.title': 'Settings & payments',
  'guide.settings.summary':
    'Brand identity, currencies, payment methods (COD, CMI, Stripe…), pixels and advanced options.',
  'guide.settings.b1': 'Appearance: colors, fonts, logo, favicon.',
  'guide.settings.b2': 'Enable payments according to your plan and contracts.',
  'guide.settings.b3':
    'Members / permissions: invite a STAFF collaborator if needed.',
  'guide.settings.tip':
    'Settings belong to the store, not only to your session.',
  'guide.settings.cta': 'Open settings',

  'guide.ready.title': 'You’re ready',
  'guide.ready.summary':
    'Recommended path: Assistant → first product → check storefront → handle orders.',
  'guide.ready.b1':
    'Come back via “User guide” when a teammate joins.',
  'guide.ready.b2':
    'The guide will not auto-open again (unless a major UI version ships).',
  'guide.ready.b3':
    'Support: contact Get STORE if the shop stays pending activation.',
};

const ar: Record<GuideAdminMessageKey, string> = {
  'guide.menu': 'دليل الاستخدام',
  'guide.badge': 'الدليل · {current}/{total}',
  'guide.prev': 'السابق',
  'guide.next': 'التالي',
  'guide.skip': 'تخطي',
  'guide.finish': 'إنهاء',
  'guide.saving': 'جاري الحفظ…',
  'guide.tipLabel': 'نصيحة · ',
  'guide.close': 'إغلاق',
  'guide.stepAria': 'الخطوة {n}',
  'guide.saveError': 'تعذّر حفظ تفضيل الدليل',
  'guide.open': 'فتح',

  'guide.welcome.title': 'مرحبًا بك في لوحة التحكم',
  'guide.welcome.summary':
    'يوضح هذا الدليل كيف تطلق وتدير متجرك على Get STORE. يظهر مرة واحدة: يُحفظ تقدّمك على حسابك.',
  'guide.welcome.b1':
    'القائمة اليسرى: كل الأقسام (الكتالوج، الطلبات، المتجر، الإعدادات).',
  'guide.welcome.b2':
    'الجرس أعلى اليمين: إشعارات فورية (طلبات جديدة، المخزون…).',
  'guide.welcome.b3':
    'أسفل القائمة: عرض الواجهة، تغيير اللغة، تسجيل الخروج.',
  'guide.welcome.tip':
    'يمكنك إعادة فتح الدليل في أي وقت عبر « دليل الاستخدام » في القائمة.',

  'guide.assistant.title': 'مساعد الإعداد',
  'guide.assistant.summary':
    'يساعدك المساعد على النشر بسرعة: الثيم، الهوية، الصفحة الرئيسية، القائمة، المنتجات، النشر.',
  'guide.assistant.b1':
    'افتح « المساعد » في القائمة لمسار إعداد خطوة بخطوة.',
  'guide.assistant.b2':
    'اختر ثيمًا، أضف الشعار والألوان، ثم أول منتج.',
  'guide.assistant.b3':
    'قائمة لوحة التحكم تذكّرك بما تبقّى لإكمال المتجر.',
  'guide.assistant.tip':
    'المساعد يضبط المتجر؛ هذا الدليل يشرح الاستخدام اليومي.',
  'guide.assistant.cta': 'فتح المساعد',

  'guide.dashboard.title': 'لوحة التحكم',
  'guide.dashboard.summary':
    'نظرة عامة: المنتجات، الطلبات، التخصيص، الإيرادات وتنبيهات المخزون.',
  'guide.dashboard.b1': 'انقر بطاقة مؤشر للانتقال مباشرة إلى القسم.',
  'guide.dashboard.b2':
    'الطلبات الأخيرة وطلبات التخصيص تظهر في الأسفل.',
  'guide.dashboard.b3':
    'إذا كانت الحالة « بانتظار التفعيل »، ما زال Get STORE بحاجة للموافقة.',
  'guide.dashboard.cta': 'عرض لوحة التحكم',

  'guide.catalog.title': 'الكتالوج: الفئات والمنتجات',
  'guide.catalog.summary':
    'نظّم الفئات أولًا، ثم أنشئ المنتجات بالصور والأسعار والمخزون والمتغيرات.',
  'guide.catalog.b1':
    'الفئات: أنشئ آباءً وفئات فرعية (مثال: ملابس › تي شيرت).',
  'guide.catalog.b2':
    'المنتجات: من النموذج يمكنك إنشاء فئة دون مغادرة الصفحة.',
  'guide.catalog.b3':
    'المتغيرات (مقاسات، ألوان…): فعّلها وحدّد المخزون / السعر لكل تركيبة.',
  'guide.catalog.b4':
    'العلامة والشارات (جديد، عرض) والصور تحسّن مظهر الواجهة.',
  'guide.catalog.tip': 'بدون فئة لا يمكنك حفظ منتج.',
  'guide.catalog.cta': 'إنشاء منتج',

  'guide.categories.title': 'شجرة الفئات',
  'guide.categories.summary':
    'شجرة واضحة تسهّل تنقّل العملاء وتصفية الكتالوج.',
  'guide.categories.b1':
    'الآباء = عائلات رئيسية؛ الأبناء = أقسام فرعية في القائمة.',
  'guide.categories.b2':
    'تعطيل فئة يخفيها من الواجهة دون حذف المنتجات.',
  'guide.categories.b3':
    'المقاسات تُدار من « السمات » وليس كفئات فرعية.',
  'guide.categories.cta': 'إدارة الفئات',

  'guide.orders.title': 'الطلبات والإشعارات',
  'guide.orders.summary':
    'كل طلب عميل يصل هنا. الجرس ينبّهك فورًا (وقت حقيقي).',
  'guide.orders.b1': 'حالات شائعة: جديد → مؤكّد → مسلَّم (أو ملغى).',
  'guide.orders.b2': 'افتح طلبًا لرؤية العميل والبنود والمتابعة.',
  'guide.orders.b3':
    'طلبات التخصيص (شعار العميل) لها قسم خاص.',
  'guide.orders.b4':
    'علّم الإشعارات كمقروءة لإبقاء الجرس محدّثًا.',
  'guide.orders.cta': 'عرض الطلبات',

  'guide.stock.title': 'المخزون والتنبيهات',
  'guide.stock.summary':
    'تتبّع كميات المتغيرات وعتبات التنبيه والحركات (دخول / خروج).',
  'guide.stock.b1': 'عدّل المخزون أو عتبة الأمان من المخزون.',
  'guide.stock.b2':
    'تنبيهات النفاد / انخفاض المخزون تنشئ إشعارًا للإدارة.',
  'guide.stock.b3':
    'مخزون المنتج العام احتياطي إن لم يكن للمتغير كمية.',
  'guide.stock.cta': 'فتح المخزون',

  'guide.storefront.title': 'المتجر الإلكتروني',
  'guide.storefront.summary':
    'الصفحات والأقسام والقائمة والشريط والمدونة تشكّل الواجهة — بمعزل عن الكتالوج.',
  'guide.storefront.b1':
    'مركز « المتجر الإلكتروني »: مدخل الصفحات والمظهر والنشر.',
  'guide.storefront.b2':
    'عدّل الصفحة الرئيسية والأقسام (بطل، شبكة منتجات…).',
  'guide.storefront.b3':
    'عاين دائمًا عبر « عرض المتجر » قبل مشاركة الرابط.',
  'guide.storefront.cta': 'مركز المتجر',

  'guide.settings.title': 'الإعدادات والمدفوعات',
  'guide.settings.summary':
    'الهوية البصرية، العملات، وسائل الدفع (COD، CMI، Stripe…)، البكسلات والخيارات المتقدمة.',
  'guide.settings.b1': 'المظهر: الألوان، الخطوط، الشعار، الأيقونة.',
  'guide.settings.b2': 'فعّل المدفوعات حسب خطتك وعقودك.',
  'guide.settings.b3':
    'الأعضاء / الصلاحيات: ادعُ متعاونًا STAFF عند الحاجة.',
  'guide.settings.tip':
    'الإعدادات مرتبطة بالمتجر وليس بجلستك فقط.',
  'guide.settings.cta': 'فتح الإعدادات',

  'guide.ready.title': 'أنت جاهز',
  'guide.ready.summary':
    'المسار المقترح: المساعد → أول منتج → التحقق من الواجهة → معالجة الطلبات.',
  'guide.ready.b1':
    'عد عبر « دليل الاستخدام » عند انضمام متعاون.',
  'guide.ready.b2':
    'لن يُفتح الدليل تلقائيًا مجددًا (إلا مع نسخة واجهة كبرى).',
  'guide.ready.b3':
    'الدعم: تواصل مع Get STORE إذا بقي المتجر بانتظار التفعيل.',
};

export const guideAdminExtra: Record<StoreLocale, Record<GuideAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
