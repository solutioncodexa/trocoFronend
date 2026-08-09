import type { StoreLocale } from '@/i18n/messages';
import {
  appearanceAdminExtra,
  type AppearanceAdminMessageKey,
} from './appearanceAdminExtra';

export type AdminLocale = StoreLocale;

export type AdminMessageKey =
  | AppearanceAdminMessageKey
  | 'nav.overview'
  | 'nav.sales'
  | 'nav.catalog'
  | 'nav.onlineStore'
  | 'nav.store'
  | 'nav.marketing'
  | 'nav.integrations'
  | 'nav.compliance'
  | 'nav.team'
  | 'nav.dashboard'
  | 'nav.revenue'
  | 'nav.orders'
  | 'nav.abandonedCarts'
  | 'nav.customRequests'
  | 'nav.stock'
  | 'nav.products'
  | 'nav.categories'
  | 'nav.attributes'
  | 'nav.onlineStoreOverview'
  | 'nav.appearance'
  | 'nav.pages'
  | 'nav.navigation'
  | 'nav.topBar'
  | 'nav.onboarding'
  | 'nav.settings'
  | 'nav.promoModals'
  | 'nav.promoCodes'
  | 'nav.blog'
  | 'nav.leads'
  | 'nav.reviews'
  | 'nav.social'
  | 'nav.webhooks'
  | 'nav.apiKeys'
  | 'nav.privacy'
  | 'nav.shipping'
  | 'nav.members'
  | 'nav.audit'
  | 'common.save'
  | 'common.cancel'
  | 'common.delete'
  | 'common.edit'
  | 'common.add'
  | 'common.create'
  | 'common.search'
  | 'common.filter'
  | 'common.actions'
  | 'common.loading'
  | 'common.error'
  | 'common.retry'
  | 'common.back'
  | 'common.close'
  | 'common.confirm'
  | 'common.yes'
  | 'common.no'
  | 'common.active'
  | 'common.inactive'
  | 'common.enabled'
  | 'common.disabled'
  | 'common.status'
  | 'common.name'
  | 'common.email'
  | 'common.phone'
  | 'common.date'
  | 'common.all'
  | 'common.none'
  | 'common.view'
  | 'common.refresh'
  | 'common.export'
  | 'common.import'
  | 'common.duplicate'
  | 'common.publish'
  | 'common.unpublish'
  | 'common.draft'
  | 'common.published'
  | 'common.pending'
  | 'common.suspended'
  | 'common.myStore'
  | 'common.sellerSpace'
  | 'common.hideMenu'
  | 'common.showMenu'
  | 'common.viewStore'
  | 'common.logout'
  | 'common.superAdmin'
  | 'common.paginationOf'
  | 'common.language'
  | 'common.saved'
  | 'common.deleted'
  | 'common.updated'
  | 'common.created'
  | 'common.noResults'
  | 'common.required'
  | 'common.optional'
  | 'common.moveUp'
  | 'common.moveDown'
  | 'login.sellerSpace'
  | 'login.title'
  | 'login.subtitle'
  | 'login.bullet1'
  | 'login.bullet2'
  | 'login.bullet3'
  | 'login.signIn'
  | 'login.email'
  | 'login.password'
  | 'login.submit'
  | 'login.submitting'
  | 'login.errorCredentials'
  | 'login.errorAccess'
  | 'login.welcomeBack'
  | 'login.createStore'
  | 'login.accessDashboard'
  | 'login.backToSite'
  | 'login.showPassword'
  | 'login.hidePassword'
  | 'dashboard.title'
  | 'dashboard.description'
  | 'dashboard.welcome'
  | 'dashboard.noOrders'
  | 'dashboard.noCustomRequests'
  | 'dashboard.recentOrders'
  | 'dashboard.pendingRequests'
  | 'dashboard.quickActions'
  | 'dashboard.viewAll'
  | 'revenue.title'
  | 'orders.title'
  | 'orders.breadcrumb'
  | 'orders.empty'
  | 'abandonedCarts.title'
  | 'abandonedCarts.description'
  | 'abandonedCarts.empty'
  | 'abandonedCarts.emptyDesc'
  | 'customRequests.title'
  | 'customRequests.breadcrumb'
  | 'customRequests.empty'
  | 'customRequests.emptyDesc'
  | 'stock.title'
  | 'stock.breadcrumb'
  | 'stock.inventoryCorrection'
  | 'stock.emptyLines'
  | 'stock.noMovements'
  | 'stock.noMovementsDesc'
  | 'stock.tabAlerts'
  | 'stock.tabList'
  | 'stock.tabHistory'
  | 'products.title'
  | 'products.breadcrumb'
  | 'products.empty'
  | 'products.emptyFiltered'
  | 'products.emptyCatalog'
  | 'products.setPrimary'
  | 'categories.title'
  | 'categories.breadcrumb'
  | 'attributes.title'
  | 'attributes.description'
  | 'onlineStore.title'
  | 'onlineStore.description'
  | 'appearance.title'
  | 'settings.title'
  | 'pages.title'
  | 'pages.description'
  | 'pages.empty'
  | 'pages.emptyDesc'
  | 'pageEditor.title'
  | 'pageEditor.edit'
  | 'pageEditor.builder'
  | 'pageEditor.regeneratePreview'
  | 'navigation.title'
  | 'navigation.description'
  | 'topBar.title'
  | 'topBar.description'
  | 'topBar.colorPreview'
  | 'onboarding.title'
  | 'onboarding.description'
  | 'promoModals.title'
  | 'promoCodes.title'
  | 'promoCodes.autoGenerate'
  | 'blog.title'
  | 'blog.description'
  | 'leads.title'
  | 'leads.description'
  | 'reviews.title'
  | 'reviews.description'
  | 'reviews.empty'
  | 'reviews.emptyDesc'
  | 'social.title'
  | 'webhooks.title'
  | 'webhooks.description'
  | 'webhooks.empty'
  | 'webhooks.emptyDesc'
  | 'apiKeys.title'
  | 'apiKeys.empty'
  | 'apiKeys.emptyDesc'
  | 'privacy.title'
  | 'shipping.title'
  | 'shipping.empty'
  | 'shipping.emptyDesc'
  | 'members.title'
  | 'members.breadcrumbTeam'
  | 'members.empty'
  | 'members.cannotDeleteSelf'
  | 'audit.title'
  | 'audit.breadcrumb'
  | 'audit.empty'
  | 'heroCategories.title'
  | 'featuredProducts.title'
  | 'featuredProducts.loadError'
  | 'featuredProducts.loadErrorDesc'
  | 'featuredProducts.empty'
  | 'featuredProducts.emptyDesc'
  | 'status.active'
  | 'status.pending'
  | 'status.suspended';

type AdminCoreMessageKey = Exclude<AdminMessageKey, AppearanceAdminMessageKey>;

const fr: Record<AdminCoreMessageKey, string> = {
  'nav.overview': 'Vue d’ensemble',
  'nav.sales': 'Ventes',
  'nav.catalog': 'Catalogue',
  'nav.onlineStore': 'Boutique en ligne',
  'nav.store': 'Boutique',
  'nav.marketing': 'Marketing',
  'nav.integrations': 'Intégrations',
  'nav.compliance': 'Conformité',
  'nav.team': 'Équipe',
  'nav.dashboard': 'Tableau de bord',
  'nav.revenue': 'Revenus',
  'nav.orders': 'Commandes',
  'nav.abandonedCarts': 'Paniers abandonnés',
  'nav.customRequests': 'Devis / Sur-mesure',
  'nav.stock': 'Stock',
  'nav.products': 'Produits',
  'nav.categories': 'Catégories',
  'nav.attributes': 'Attributs & variantes',
  'nav.onlineStoreOverview': 'Vue d’ensemble',
  'nav.appearance': 'Apparence',
  'nav.pages': 'Pages',
  'nav.navigation': 'Navigation',
  'nav.topBar': 'Bandeau',
  'nav.onboarding': 'Assistant',
  'nav.settings': 'Paramètres',
  'nav.promoModals': 'Pop-ups promo',
  'nav.promoCodes': 'Codes promo',
  'nav.blog': 'Blog',
  'nav.leads': 'Clients / Leads',
  'nav.reviews': 'Avis',
  'nav.social': 'Réseaux sociaux',
  'nav.webhooks': 'Webhooks',
  'nav.apiKeys': 'Clés API',
  'nav.privacy': 'Données personnelles',
  'nav.shipping': 'Livraison',
  'nav.members': 'Membres',
  'nav.audit': 'Journal d’audit',
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.add': 'Ajouter',
  'common.create': 'Créer',
  'common.search': 'Rechercher',
  'common.filter': 'Filtrer',
  'common.actions': 'Actions',
  'common.loading': 'Chargement…',
  'common.error': 'Erreur',
  'common.retry': 'Réessayer',
  'common.back': 'Retour',
  'common.close': 'Fermer',
  'common.confirm': 'Confirmer',
  'common.yes': 'Oui',
  'common.no': 'Non',
  'common.active': 'Actif',
  'common.inactive': 'Inactif',
  'common.enabled': 'Activé',
  'common.disabled': 'Désactivé',
  'common.status': 'Statut',
  'common.name': 'Nom',
  'common.email': 'E-mail',
  'common.phone': 'Téléphone',
  'common.date': 'Date',
  'common.all': 'Tous',
  'common.none': 'Aucun',
  'common.view': 'Voir',
  'common.refresh': 'Actualiser',
  'common.export': 'Exporter',
  'common.import': 'Importer',
  'common.duplicate': 'Dupliquer',
  'common.publish': 'Publier',
  'common.unpublish': 'Dépublier',
  'common.draft': 'Brouillon',
  'common.published': 'Publié',
  'common.pending': 'En attente',
  'common.suspended': 'Suspendue',
  'common.myStore': 'Ma boutique',
  'common.sellerSpace': 'Espace vendeur',
  'common.hideMenu': 'Masquer le menu',
  'common.showMenu': 'Afficher le menu',
  'common.viewStore': 'Voir ma boutique',
  'common.logout': 'Déconnexion',
  'common.superAdmin': 'Super Admin',
  'common.paginationOf': '{start}–{end} sur {total}',
  'common.language': 'Langue',
  'common.saved': 'Enregistré',
  'common.deleted': 'Supprimé',
  'common.updated': 'Mis à jour',
  'common.created': 'Créé',
  'common.noResults': 'Aucun résultat',
  'common.required': 'Obligatoire',
  'common.optional': 'Optionnel',
  'common.moveUp': 'Monter',
  'common.moveDown': 'Descendre',
  'login.sellerSpace': 'Espace vendeur',
  'login.title': 'Gérez votre boutique Get STORE',
  'login.subtitle': 'Commandes, catalogue, design et abonnement — tout au même endroit.',
  'login.bullet1': 'Suivi des commandes en temps réel',
  'login.bullet2': 'Personnalisez logo, couleurs et design',
  'login.bullet3': 'Catalogue et stock centralisés',
  'login.signIn': 'Connexion',
  'login.email': 'E-mail',
  'login.password': 'Mot de passe',
  'login.submit': 'Se connecter',
  'login.submitting': 'Connexion…',
  'login.errorCredentials': 'Email ou mot de passe incorrect',
  'login.errorAccess': 'Connectez-vous pour accéder à cette page',
  'login.welcomeBack': 'Bon retour',
  'login.createStore': 'Créer une boutique',
  'login.accessDashboard': 'Accédez au tableau de bord de votre boutique',
  'login.backToSite': '← Retour au site',
  'login.hidePassword': 'Masquer le mot de passe',
  'login.showPassword': 'Afficher le mot de passe',
  'dashboard.title': 'Tableau de bord',
  'dashboard.description': 'Vue d’ensemble de votre boutique',
  'dashboard.welcome': 'Bienvenue sur {name}',
  'dashboard.noOrders': 'Aucune commande',
  'dashboard.noCustomRequests': 'Aucune demande en attente',
  'dashboard.recentOrders': 'Commandes récentes',
  'dashboard.pendingRequests': 'Demandes en attente',
  'dashboard.quickActions': 'Actions rapides',
  'dashboard.viewAll': 'Tout voir',
  'revenue.title': 'Revenus',
  'orders.title': 'Gestion des Commandes',
  'orders.breadcrumb': 'Commandes',
  'orders.empty': 'Aucune commande trouvée',
  'abandonedCarts.title': 'Paniers abandonnés',
  'abandonedCarts.description': 'Paniers capturés depuis la vitrine avec relance email (si activée).',
  'abandonedCarts.empty': 'Aucun panier abandonné',
  'abandonedCarts.emptyDesc':
    'Les paniers capturés au checkout (email ou téléphone) apparaîtront ici pour relance.',
  'customRequests.title': 'Demandes de Personnalisation',
  'customRequests.breadcrumb': 'Personnalisations',
  'customRequests.empty': 'Aucune demande trouvée',
  'customRequests.emptyDesc': 'Les nouvelles demandes de personnalisation apparaîtront ici.',
  'stock.title': 'Stock',
  'stock.breadcrumb': 'Stock',
  'stock.inventoryCorrection': 'Correction inventaire',
  'stock.emptyLines': 'Aucune ligne à afficher',
  'stock.noMovements': 'Aucun mouvement',
  'stock.noMovementsDesc': 'Les achats, ventes et commandes apparaîtront ici.',
  'stock.tabAlerts': 'Alertes',
  'stock.tabList': 'Liste stock',
  'stock.tabHistory': 'Historique',
  'products.title': 'Gestion des Produits',
  'products.breadcrumb': 'Produits',
  'products.empty': 'Aucun produit pour le moment',
  'products.emptyFiltered': 'Aucun produit ne correspond',
  'products.emptyCatalog': 'Catalogue vide',
  'products.setPrimary': 'Définir comme principale',
  'categories.title': 'Gestion des Catégories',
  'categories.breadcrumb': 'Catégories',
  'attributes.title': 'Attributs & variantes',
  'attributes.description': 'Modèles d’attributs réutilisables pour générer rapidement les variantes produit.',
  'onlineStore.title': 'Boutique en ligne',
  'onlineStore.description': 'Tout pour personnaliser la vitrine vue par vos clients.',
  'appearance.title': 'Apparence',
  'settings.title': 'Paramètres',
  'pages.title': 'Pages',
  'pages.description': 'Templates, starters, puis édition drag & drop des composants.',
  'pages.empty': 'Aucune page',
  'pages.emptyDesc':
    'Choisissez un template ci-dessus ou créez une page vide pour démarrer votre vitrine.',
  'pageEditor.title': 'Page',
  'pageEditor.edit': 'Éditer la page',
  'pageEditor.builder': 'Constructeur — {title}',
  'pageEditor.regeneratePreview': 'Régénérer le lien d’aperçu',
  'navigation.title': 'Navigation',
  'navigation.description':
    'Menus · En-tête · Pied de page · CTA sticky. Un seul menu principal à la fois : Menus activé remplace Apparence → Header.',
  'topBar.title': 'Bandeau',
  'topBar.description':
    'Créez plusieurs bandeaux promo : texte, couleurs, durée d’affichage et rotation automatique.',
  'topBar.colorPreview': 'Aperçu couleurs',
  'onboarding.title': 'Configurer ma boutique',
  'onboarding.description': 'Choisissez votre look et publiez en quelques minutes.',
  'promoModals.title': 'Pop-ups promo',
  'promoCodes.title': 'Codes Promo',
  'promoCodes.autoGenerate': 'Générer automatiquement',
  'blog.title': 'Blog',
  'blog.description': 'Articles publiés sur /blog de votre boutique.',
  'leads.title': 'Leads & formulaires',
  'leads.description': 'Inscriptions newsletter, contacts et demandes de devis depuis la vitrine.',
  'reviews.title': 'Avis produits',
  'reviews.description': 'Modérez les avis clients avant publication sur la fiche produit.',
  'reviews.empty': 'Aucun avis',
  'reviews.emptyDesc': 'Les avis soumis sur les fiches produits apparaîtront ici pour validation.',
  'social.title': 'Réseaux sociaux',
  'webhooks.title': 'Webhooks',
  'webhooks.description': 'Notifiez vos outils (Zapier, Make, CRM…) lors d’une commande ou d’un lead.',
  'webhooks.empty': 'Aucun webhook',
  'webhooks.emptyDesc': 'Créez un endpoint pour recevoir les événements en JSON signé (HMAC).',
  'apiKeys.title': 'Clés API',
  'apiKeys.empty': 'Aucune clé API',
  'apiKeys.emptyDesc': 'Créez une clé pour intégrer votre boutique.',
  'privacy.title': 'Conformité & données personnelles',
  'shipping.title': 'Livraison',
  'shipping.empty': 'Aucun transporteur',
  'shipping.emptyDesc': 'Configurez les transporteurs côté plateforme.',
  'members.title': 'Membres',
  'members.breadcrumbTeam': 'Équipe',
  'members.empty': 'Aucun membre',
  'members.cannotDeleteSelf': 'Impossible de supprimer votre propre compte',
  'audit.title': 'Audit',
  'audit.breadcrumb': 'Audit',
  'audit.empty': 'Aucune entrée d’audit',
  'heroCategories.title': 'Catégories de l’accueil',
  'featuredProducts.title': 'Produits à la une',
  'featuredProducts.loadError': 'Erreur de chargement',
  'featuredProducts.loadErrorDesc':
    'Impossible de charger les produits sélectionnés. Veuillez vérifier que le serveur backend est en cours d’exécution.',
  'featuredProducts.empty': 'Aucun produit sélectionné trouvé',
  'featuredProducts.emptyDesc':
    'Ajoutez des produits à mettre en avant sur la vitrine ou en sur-mesure.',
  'status.active': 'Active',
  'status.pending': 'En attente',
  'status.suspended': 'Suspendue',
};

const ar: Record<AdminCoreMessageKey, string> = {
  'nav.overview': 'نظرة عامة',
  'nav.sales': 'المبيعات',
  'nav.catalog': 'الكتالوج',
  'nav.onlineStore': 'المتجر الإلكتروني',
  'nav.store': 'المتجر',
  'nav.marketing': 'التسويق',
  'nav.integrations': 'التكاملات',
  'nav.compliance': 'الامتثال',
  'nav.team': 'الفريق',
  'nav.dashboard': 'لوحة التحكم',
  'nav.revenue': 'الإيرادات',
  'nav.orders': 'الطلبات',
  'nav.abandonedCarts': 'السلال المتروكة',
  'nav.customRequests': 'عروض / حسب الطلب',
  'nav.stock': 'المخزون',
  'nav.products': 'المنتجات',
  'nav.categories': 'الفئات',
  'nav.attributes': 'السمات والمتغيرات',
  'nav.onlineStoreOverview': 'نظرة عامة',
  'nav.appearance': 'المظهر',
  'nav.pages': 'الصفحات',
  'nav.navigation': 'التنقل',
  'nav.topBar': 'الشريط العلوي',
  'nav.onboarding': 'المساعد',
  'nav.settings': 'الإعدادات',
  'nav.promoModals': 'نوافذ ترويجية',
  'nav.promoCodes': 'أكواد الخصم',
  'nav.blog': 'المدونة',
  'nav.leads': 'العملاء / العملاء المحتملون',
  'nav.reviews': 'التقييمات',
  'nav.social': 'الشبكات الاجتماعية',
  'nav.webhooks': 'Webhooks',
  'nav.apiKeys': 'مفاتيح API',
  'nav.privacy': 'البيانات الشخصية',
  'nav.shipping': 'التوصيل',
  'nav.members': 'الأعضاء',
  'nav.audit': 'سجل التدقيق',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.create': 'إنشاء',
  'common.search': 'بحث',
  'common.filter': 'تصفية',
  'common.actions': 'إجراءات',
  'common.loading': 'جارٍ التحميل…',
  'common.error': 'خطأ',
  'common.retry': 'إعادة المحاولة',
  'common.back': 'رجوع',
  'common.close': 'إغلاق',
  'common.confirm': 'تأكيد',
  'common.yes': 'نعم',
  'common.no': 'لا',
  'common.active': 'نشط',
  'common.inactive': 'غير نشط',
  'common.enabled': 'مفعّل',
  'common.disabled': 'معطّل',
  'common.status': 'الحالة',
  'common.name': 'الاسم',
  'common.email': 'البريد الإلكتروني',
  'common.phone': 'الهاتف',
  'common.date': 'التاريخ',
  'common.all': 'الكل',
  'common.none': 'لا شيء',
  'common.view': 'عرض',
  'common.refresh': 'تحديث',
  'common.export': 'تصدير',
  'common.import': 'استيراد',
  'common.duplicate': 'تكرار',
  'common.publish': 'نشر',
  'common.unpublish': 'إلغاء النشر',
  'common.draft': 'مسودة',
  'common.published': 'منشور',
  'common.pending': 'قيد الانتظار',
  'common.suspended': 'معلّق',
  'common.myStore': 'متجري',
  'common.sellerSpace': 'مساحة البائع',
  'common.hideMenu': 'إخفاء القائمة',
  'common.showMenu': 'إظهار القائمة',
  'common.viewStore': 'عرض متجري',
  'common.logout': 'تسجيل الخروج',
  'common.superAdmin': 'المشرف العام',
  'common.paginationOf': '{start}–{end} من {total}',
  'common.language': 'اللغة',
  'common.saved': 'تم الحفظ',
  'common.deleted': 'تم الحذف',
  'common.updated': 'تم التحديث',
  'common.created': 'تم الإنشاء',
  'common.noResults': 'لا توجد نتائج',
  'common.required': 'مطلوب',
  'common.optional': 'اختياري',
  'common.moveUp': 'أعلى',
  'common.moveDown': 'أسفل',
  'login.sellerSpace': 'مساحة البائع',
  'login.title': 'أدِر متجرك على Get STORE',
  'login.subtitle': 'الطلبات، الكتالوج، التصميم والاشتراك — كل شيء في مكان واحد.',
  'login.bullet1': 'متابعة الطلبات في الوقت الفعلي',
  'login.bullet2': 'خصّص الشعار والألوان والتصميم',
  'login.bullet3': 'كتالوج ومخزون مركزيان',
  'login.signIn': 'تسجيل الدخول',
  'login.email': 'البريد الإلكتروني',
  'login.password': 'كلمة المرور',
  'login.submit': 'تسجيل الدخول',
  'login.submitting': 'جارٍ تسجيل الدخول…',
  'login.errorCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'login.errorAccess': 'سجّل الدخول للوصول إلى هذه الصفحة',
  'login.welcomeBack': 'مرحباً بعودتك',
  'login.createStore': 'إنشاء متجر',
  'login.accessDashboard': 'ادخل إلى لوحة تحكم متجرك',
  'login.backToSite': '← العودة إلى الموقع',
  'login.hidePassword': 'إخفاء كلمة المرور',
  'login.showPassword': 'إظهار كلمة المرور',
  'dashboard.title': 'لوحة التحكم',
  'dashboard.description': 'نظرة عامة على متجرك',
  'dashboard.welcome': 'مرحباً بك في {name}',
  'dashboard.noOrders': 'لا توجد طلبات',
  'dashboard.noCustomRequests': 'لا توجد طلبات قيد الانتظار',
  'dashboard.recentOrders': 'الطلبات الأخيرة',
  'dashboard.pendingRequests': 'الطلبات المعلّقة',
  'dashboard.quickActions': 'إجراءات سريعة',
  'dashboard.viewAll': 'عرض الكل',
  'revenue.title': 'الإيرادات',
  'orders.title': 'إدارة الطلبات',
  'orders.breadcrumb': 'الطلبات',
  'orders.empty': 'لم يتم العثور على طلبات',
  'abandonedCarts.title': 'السلال المتروكة',
  'abandonedCarts.description': 'سلال مُلتقطة من الواجهة مع تذكير بالبريد (إن كان مفعّلاً).',
  'abandonedCarts.empty': 'لا توجد سلال متروكة',
  'abandonedCarts.emptyDesc':
    'ستظهر هنا السلال المُلتقطة عند الدفع (بريد أو هاتف) للمتابعة.',
  'customRequests.title': 'طلبات التخصيص',
  'customRequests.breadcrumb': 'التخصيصات',
  'customRequests.empty': 'لم يتم العثور على طلبات',
  'customRequests.emptyDesc': 'ستظهر هنا طلبات التخصيص الجديدة.',
  'stock.title': 'المخزون',
  'stock.breadcrumb': 'المخزون',
  'stock.inventoryCorrection': 'تصحيح المخزون',
  'stock.emptyLines': 'لا توجد أسطر للعرض',
  'stock.noMovements': 'لا توجد حركات',
  'stock.noMovementsDesc': 'ستظهر هنا المشتريات والمبيعات والطلبات.',
  'stock.tabAlerts': 'التنبيهات',
  'stock.tabList': 'قائمة المخزون',
  'stock.tabHistory': 'السجل',
  'products.title': 'إدارة المنتجات',
  'products.breadcrumb': 'المنتجات',
  'products.empty': 'لا توجد منتجات حالياً',
  'products.emptyFiltered': 'لا يوجد منتج مطابق',
  'products.emptyCatalog': 'الكتالوج فارغ',
  'products.setPrimary': 'تعيين كصورة رئيسية',
  'categories.title': 'إدارة الفئات',
  'categories.breadcrumb': 'الفئات',
  'attributes.title': 'السمات والمتغيرات',
  'attributes.description': 'قوالب سمات قابلة لإعادة الاستخدام لتوليد متغيرات المنتج بسرعة.',
  'onlineStore.title': 'المتجر الإلكتروني',
  'onlineStore.description': 'كل ما تحتاجه لتخصيص الواجهة التي يراها عملاؤك.',
  'appearance.title': 'المظهر',
  'settings.title': 'الإعدادات',
  'pages.title': 'الصفحات',
  'pages.description': 'قوالب وبدايات ثم تحرير المكوّنات بالسحب والإفلات.',
  'pages.empty': 'لا توجد صفحات',
  'pages.emptyDesc': 'اختر قالباً أعلاه أو أنشئ صفحة فارغة لبدء واجهتك.',
  'pageEditor.title': 'صفحة',
  'pageEditor.edit': 'تحرير الصفحة',
  'pageEditor.builder': 'المنشئ — {title}',
  'pageEditor.regeneratePreview': 'إعادة إنشاء رابط المعاينة',
  'navigation.title': 'التنقل',
  'navigation.description':
    'القوائم · الرأس · التذييل · زر ثابت. قائمة رئيسية واحدة فقط في كل مرة: تفعيل القوائم يستبدل المظهر → الرأس.',
  'topBar.title': 'الشريط العلوي',
  'topBar.description':
    'أنشئ عدة شرائط ترويجية: نص، ألوان، مدة العرض والتبديل التلقائي.',
  'topBar.colorPreview': 'معاينة الألوان',
  'onboarding.title': 'إعداد متجري',
  'onboarding.description': 'اختر مظهرك وانشر خلال دقائق.',
  'promoModals.title': 'نوافذ ترويجية',
  'promoCodes.title': 'أكواد الخصم',
  'promoCodes.autoGenerate': 'توليد تلقائي',
  'blog.title': 'المدونة',
  'blog.description': 'مقالات منشورة على /blog في متجرك.',
  'leads.title': 'العملاء المحتملون والنماذج',
  'leads.description': 'اشتراكات النشرة وجهات الاتصال وطلبات العرض من الواجهة.',
  'reviews.title': 'تقييمات المنتجات',
  'reviews.description': 'راجع تقييمات العملاء قبل النشر على صفحة المنتج.',
  'reviews.empty': 'لا توجد تقييمات',
  'reviews.emptyDesc': 'ستظهر هنا التقييمات المرسلة من صفحات المنتجات للمراجعة.',
  'social.title': 'الشبكات الاجتماعية',
  'webhooks.title': 'Webhooks',
  'webhooks.description': 'أبلغ أدواتك (Zapier، Make، CRM…) عند طلب أو عميل محتمل.',
  'webhooks.empty': 'لا توجد webhooks',
  'webhooks.emptyDesc': 'أنشئ نقطة نهاية لاستقبال الأحداث بتنسيق JSON موقّع (HMAC).',
  'apiKeys.title': 'مفاتيح API',
  'apiKeys.empty': 'لا توجد مفاتيح API',
  'apiKeys.emptyDesc': 'أنشئ مفتاحاً لدمج متجرك.',
  'privacy.title': 'الامتثال والبيانات الشخصية',
  'shipping.title': 'التوصيل',
  'shipping.empty': 'لا يوجد ناقل',
  'shipping.emptyDesc': 'قم بإعداد الناقلين من جهة المنصة.',
  'members.title': 'الأعضاء',
  'members.breadcrumbTeam': 'الفريق',
  'members.empty': 'لا يوجد أعضاء',
  'members.cannotDeleteSelf': 'لا يمكنك حذف حسابك الخاص',
  'audit.title': 'التدقيق',
  'audit.breadcrumb': 'التدقيق',
  'audit.empty': 'لا توجد سجلات تدقيق',
  'heroCategories.title': 'فئات الصفحة الرئيسية',
  'featuredProducts.title': 'منتجات مميزة',
  'featuredProducts.loadError': 'خطأ في التحميل',
  'featuredProducts.loadErrorDesc':
    'تعذّر تحميل المنتجات المحددة. تحقق من تشغيل خادم الواجهة الخلفية.',
  'featuredProducts.empty': 'لم يتم العثور على منتجات محددة',
  'featuredProducts.emptyDesc': 'أضف منتجات لإبرازها على الواجهة أو حسب الطلب.',
  'status.active': 'نشط',
  'status.pending': 'قيد الانتظار',
  'status.suspended': 'معلّق',
};

const en: Record<AdminCoreMessageKey, string> = {
  'nav.overview': 'Overview',
  'nav.sales': 'Sales',
  'nav.catalog': 'Catalog',
  'nav.onlineStore': 'Online store',
  'nav.store': 'Store',
  'nav.marketing': 'Marketing',
  'nav.integrations': 'Integrations',
  'nav.compliance': 'Compliance',
  'nav.team': 'Team',
  'nav.dashboard': 'Dashboard',
  'nav.revenue': 'Revenue',
  'nav.orders': 'Orders',
  'nav.abandonedCarts': 'Abandoned carts',
  'nav.customRequests': 'Quotes / Custom',
  'nav.stock': 'Inventory',
  'nav.products': 'Products',
  'nav.categories': 'Categories',
  'nav.attributes': 'Attributes & variants',
  'nav.onlineStoreOverview': 'Overview',
  'nav.appearance': 'Appearance',
  'nav.pages': 'Pages',
  'nav.navigation': 'Navigation',
  'nav.topBar': 'Announcement bar',
  'nav.onboarding': 'Setup assistant',
  'nav.settings': 'Settings',
  'nav.promoModals': 'Promo pop-ups',
  'nav.promoCodes': 'Promo codes',
  'nav.blog': 'Blog',
  'nav.leads': 'Customers / Leads',
  'nav.reviews': 'Reviews',
  'nav.social': 'Social networks',
  'nav.webhooks': 'Webhooks',
  'nav.apiKeys': 'API keys',
  'nav.privacy': 'Personal data',
  'nav.shipping': 'Shipping',
  'nav.members': 'Members',
  'nav.audit': 'Audit log',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.create': 'Create',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.actions': 'Actions',
  'common.loading': 'Loading…',
  'common.error': 'Error',
  'common.retry': 'Retry',
  'common.back': 'Back',
  'common.close': 'Close',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.active': 'Active',
  'common.inactive': 'Inactive',
  'common.enabled': 'Enabled',
  'common.disabled': 'Disabled',
  'common.status': 'Status',
  'common.name': 'Name',
  'common.email': 'Email',
  'common.phone': 'Phone',
  'common.date': 'Date',
  'common.all': 'All',
  'common.none': 'None',
  'common.view': 'View',
  'common.refresh': 'Refresh',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.duplicate': 'Duplicate',
  'common.publish': 'Publish',
  'common.unpublish': 'Unpublish',
  'common.draft': 'Draft',
  'common.published': 'Published',
  'common.pending': 'Pending',
  'common.suspended': 'Suspended',
  'common.myStore': 'My store',
  'common.sellerSpace': 'Seller space',
  'common.hideMenu': 'Hide menu',
  'common.showMenu': 'Show menu',
  'common.viewStore': 'View my store',
  'common.logout': 'Log out',
  'common.superAdmin': 'Super Admin',
  'common.paginationOf': '{start}–{end} of {total}',
  'common.language': 'Language',
  'common.saved': 'Saved',
  'common.deleted': 'Deleted',
  'common.updated': 'Updated',
  'common.created': 'Created',
  'common.noResults': 'No results',
  'common.required': 'Required',
  'common.optional': 'Optional',
  'common.moveUp': 'Move up',
  'common.moveDown': 'Move down',
  'login.sellerSpace': 'Seller space',
  'login.title': 'Manage your Get STORE shop',
  'login.subtitle': 'Orders, catalog, design and subscription — all in one place.',
  'login.bullet1': 'Real-time order tracking',
  'login.bullet2': 'Customize logo, colors and design',
  'login.bullet3': 'Centralized catalog and inventory',
  'login.signIn': 'Sign in',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',
  'login.errorCredentials': 'Incorrect email or password',
  'login.errorAccess': 'Sign in to access this page',
  'login.welcomeBack': 'Welcome back',
  'login.createStore': 'Create a store',
  'login.accessDashboard': 'Access your store dashboard',
  'login.backToSite': '← Back to site',
  'login.hidePassword': 'Hide password',
  'login.showPassword': 'Show password',
  'dashboard.title': 'Dashboard',
  'dashboard.description': 'Overview of your store',
  'dashboard.welcome': 'Welcome to {name}',
  'dashboard.noOrders': 'No orders',
  'dashboard.noCustomRequests': 'No pending requests',
  'dashboard.recentOrders': 'Recent orders',
  'dashboard.pendingRequests': 'Pending requests',
  'dashboard.quickActions': 'Quick actions',
  'dashboard.viewAll': 'View all',
  'revenue.title': 'Revenue',
  'orders.title': 'Order management',
  'orders.breadcrumb': 'Orders',
  'orders.empty': 'No orders found',
  'abandonedCarts.title': 'Abandoned carts',
  'abandonedCarts.description': 'Carts captured from the storefront with email follow-up (if enabled).',
  'abandonedCarts.empty': 'No abandoned carts',
  'abandonedCarts.emptyDesc':
    'Carts captured at checkout (email or phone) will appear here for follow-up.',
  'customRequests.title': 'Customization requests',
  'customRequests.breadcrumb': 'Custom orders',
  'customRequests.empty': 'No requests found',
  'customRequests.emptyDesc': 'New customization requests will appear here.',
  'stock.title': 'Inventory',
  'stock.breadcrumb': 'Inventory',
  'stock.inventoryCorrection': 'Inventory adjustment',
  'stock.emptyLines': 'No rows to display',
  'stock.noMovements': 'No movements',
  'stock.noMovementsDesc': 'Purchases, sales and orders will appear here.',
  'stock.tabAlerts': 'Alerts',
  'stock.tabList': 'Stock list',
  'stock.tabHistory': 'History',
  'products.title': 'Product management',
  'products.breadcrumb': 'Products',
  'products.empty': 'No products yet',
  'products.emptyFiltered': 'No matching products',
  'products.emptyCatalog': 'Empty catalog',
  'products.setPrimary': 'Set as primary',
  'categories.title': 'Category management',
  'categories.breadcrumb': 'Categories',
  'attributes.title': 'Attributes & variants',
  'attributes.description': 'Reusable attribute templates to quickly generate product variants.',
  'onlineStore.title': 'Online store',
  'onlineStore.description': 'Everything to customize the storefront your customers see.',
  'appearance.title': 'Appearance',
  'settings.title': 'Settings',
  'pages.title': 'Pages',
  'pages.description': 'Templates, starters, then drag-and-drop component editing.',
  'pages.empty': 'No pages',
  'pages.emptyDesc': 'Pick a template above or create a blank page to start your storefront.',
  'pageEditor.title': 'Page',
  'pageEditor.edit': 'Edit page',
  'pageEditor.builder': 'Builder — {title}',
  'pageEditor.regeneratePreview': 'Regenerate preview link',
  'navigation.title': 'Navigation',
  'navigation.description':
    'Menus · Header · Footer · Sticky CTA. One primary menu at a time: enabled Menus replaces Appearance → Header.',
  'topBar.title': 'Announcement bar',
  'topBar.description':
    'Create multiple promo bars: text, colors, display duration and automatic rotation.',
  'topBar.colorPreview': 'Color preview',
  'onboarding.title': 'Set up my store',
  'onboarding.description': 'Choose your look and publish in a few minutes.',
  'promoModals.title': 'Promo pop-ups',
  'promoCodes.title': 'Promo codes',
  'promoCodes.autoGenerate': 'Generate automatically',
  'blog.title': 'Blog',
  'blog.description': 'Posts published on your store’s /blog.',
  'leads.title': 'Leads & forms',
  'leads.description': 'Newsletter signups, contacts and quote requests from the storefront.',
  'reviews.title': 'Product reviews',
  'reviews.description': 'Moderate customer reviews before publishing on the product page.',
  'reviews.empty': 'No reviews',
  'reviews.emptyDesc': 'Reviews submitted on product pages will appear here for approval.',
  'social.title': 'Social networks',
  'webhooks.title': 'Webhooks',
  'webhooks.description': 'Notify your tools (Zapier, Make, CRM…) on an order or lead.',
  'webhooks.empty': 'No webhooks',
  'webhooks.emptyDesc': 'Create an endpoint to receive signed JSON events (HMAC).',
  'apiKeys.title': 'API keys',
  'apiKeys.empty': 'No API keys',
  'apiKeys.emptyDesc': 'Create a key to integrate your store.',
  'privacy.title': 'Compliance & personal data',
  'shipping.title': 'Shipping',
  'shipping.empty': 'No carriers',
  'shipping.emptyDesc': 'Configure carriers on the platform side.',
  'members.title': 'Members',
  'members.breadcrumbTeam': 'Team',
  'members.empty': 'No members',
  'members.cannotDeleteSelf': 'You cannot delete your own account',
  'audit.title': 'Audit',
  'audit.breadcrumb': 'Audit',
  'audit.empty': 'No audit entries',
  'heroCategories.title': 'Home categories',
  'featuredProducts.title': 'Featured products',
  'featuredProducts.loadError': 'Loading error',
  'featuredProducts.loadErrorDesc':
    'Could not load selected products. Please check that the backend server is running.',
  'featuredProducts.empty': 'No selected products found',
  'featuredProducts.emptyDesc': 'Add products to feature on the storefront or custom-order pages.',
  'status.active': 'Active',
  'status.pending': 'Pending',
  'status.suspended': 'Suspended',
};

export const adminMessages: Record<AdminLocale, Record<AdminMessageKey, string>> = {
  fr: { ...fr, ...appearanceAdminExtra.fr },
  ar: { ...ar, ...appearanceAdminExtra.ar },
  en: { ...en, ...appearanceAdminExtra.en },
};

export const ADMIN_LOCALES: AdminLocale[] = ['fr', 'ar', 'en'];

export const ADMIN_LOCALE_LABELS: Record<AdminLocale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export const ADMIN_LOCALE_STORAGE_KEY = 'matjarona_admin_locale';
