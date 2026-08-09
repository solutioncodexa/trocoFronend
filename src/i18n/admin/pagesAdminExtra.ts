import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n pour Commandes, Produits, Catégories, Stock et Revenus (chrome des pages). */
export type PagesAdminMessageKey =
  | 'common.customer'
  | 'common.city'
  | 'common.payment'
  | 'common.total'
  | 'common.product'
  | 'common.details'
  | 'common.filterLabel'
  | 'common.category'
  | 'common.price'
  | 'common.badges'
  | 'common.outOfStock'
  | 'common.productUnit'
  | 'common.type'
  | 'common.resetFilters'
  | 'orders.searchPlaceholder'
  | 'orders.allStatuses'
  | 'orders.itemsUnit'
  | 'orders.dialogTitle'
  | 'orders.loadingDetail'
  | 'orders.customerInfo'
  | 'orders.orderedItems'
  | 'orders.changeStatus'
  | 'orders.qty'
  | 'orders.unit'
  | 'products.onboardingBanner'
  | 'products.onboardingBack'
  | 'products.updating'
  | 'products.searchPlaceholder'
  | 'products.allCategories'
  | 'products.badgeNew'
  | 'products.badgeBestseller'
  | 'products.badgePromo'
  | 'products.badgeLogo'
  | 'products.emptyFilteredDesc'
  | 'products.emptyDesc'
  | 'products.emptyCatalogDesc'
  | 'products.addProduct'
  | 'products.inStockCount'
  | 'products.stockCount'
  | 'products.editProduct'
  | 'products.newProduct'
  | 'categories.homeLink'
  | 'categories.newCategory'
  | 'categories.searchPlaceholder'
  | 'categories.selectAll'
  | 'categories.expandAll'
  | 'categories.collapseAll'
  | 'categories.selectedCount'
  | 'categories.emptyTitle'
  | 'categories.emptyDesc'
  | 'categories.emptyAction'
  | 'categories.noSearchResults'
  | 'categories.unit'
  | 'categories.childUnit'
  | 'categories.subcatAbbrev'
  | 'categories.prodAbbrev'
  | 'categories.addSubcategoriesTitle'
  | 'categories.quickAddPlaceholder'
  | 'categories.subcategoriesTitle'
  | 'categories.deleteSelection'
  | 'stock.lowStock'
  | 'stock.statOutOfStock'
  | 'stock.expiringSoon'
  | 'stock.stockValue'
  | 'stock.settingsTitle'
  | 'stock.defaultThreshold'
  | 'stock.defaultThresholdHelp'
  | 'stock.expiryDaysLabel'
  | 'stock.alertsEnabledLabel'
  | 'stock.lowStockAlertsLabel'
  | 'stock.expiryAlertsLabel'
  | 'stock.applyDefaultToAll'
  | 'stock.listDescription'
  | 'stock.searchPlaceholder'
  | 'stock.filterAlert'
  | 'stock.thresholdDate'
  | 'stock.actionPurchase'
  | 'stock.actionDirectSale'
  | 'stock.inventoryShort'
  | 'stock.statusLow'
  | 'stock.movementsDescription'
  | 'stock.filterTypeAll'
  | 'stock.filterTypeIn'
  | 'stock.filterTypeOut'
  | 'stock.filterTypeAdjust'
  | 'stock.filterTypeRestore'
  | 'stock.filterProductAll'
  | 'stock.dialogPurchaseTitle'
  | 'stock.dialogDirectSaleTitle'
  | 'stock.validate'
  | 'revenue.customRange'
  | 'revenue.from'
  | 'revenue.to'
  | 'revenue.rangeDays'
  | 'revenue.deliveredRevenue'
  | 'revenue.deliveredOrders'
  | 'revenue.averageBasket'
  | 'revenue.cancellationRate'
  | 'revenue.dailyRevenue'
  | 'revenue.noDataPeriod'
  | 'revenue.revenueAbbrev'
  | 'revenue.indicators'
  | 'revenue.confirmedRevenue'
  | 'revenue.newOrders'
  | 'revenue.totalOrders'
  | 'revenue.topProducts'
  | 'revenue.noProductsSold';

const fr: Record<PagesAdminMessageKey, string> = {
  'common.customer': 'Client',
  'common.city': 'Ville',
  'common.payment': 'Paiement',
  'common.total': 'Total',
  'common.product': 'Produit',
  'common.details': 'Détails',
  'common.filterLabel': 'filtre',
  'common.category': 'Catégorie',
  'common.price': 'Prix',
  'common.badges': 'Badges',
  'common.outOfStock': 'Rupture',
  'common.productUnit': 'produit(s)',
  'common.type': 'Type',
  'common.resetFilters': 'Réinitialiser les filtres',
  'orders.searchPlaceholder': 'Rechercher par ID, nom ou téléphone...',
  'orders.allStatuses': 'Tous les statuts',
  'orders.itemsUnit': 'article(s)',
  'orders.dialogTitle': 'Commande {id}',
  'orders.loadingDetail': 'Chargement de la commande…',
  'orders.customerInfo': 'Informations client',
  'orders.orderedItems': 'Articles commandés',
  'orders.changeStatus': 'Changer le statut',
  'orders.qty': 'Qté',
  'orders.unit': 'commande(s)',
  'products.onboardingBanner':
    'Assistant de configuration — ajoutez un produit, puis vous reviendrez à l’étape Publication.',
  'products.onboardingBack': 'Retour à l’assistant',
  'products.updating': '(mise à jour…)',
  'products.searchPlaceholder': 'Rechercher un produit...',
  'products.allCategories': 'Toutes les catégories',
  'products.badgeNew': 'Nouveau',
  'products.badgeBestseller': 'Best-seller',
  'products.badgePromo': 'Promo',
  'products.badgeLogo': 'Logo',
  'products.emptyFilteredDesc': 'Modifiez la recherche ou la catégorie.',
  'products.emptyDesc': 'Ajoutez votre premier produit pour démarrer la boutique.',
  'products.emptyCatalogDesc': 'Créez un produit pour le voir apparaître ici et sur votre boutique.',
  'products.addProduct': 'Ajouter un produit',
  'products.inStockCount': 'En stock ({count})',
  'products.stockCount': 'Stock {count}',
  'products.editProduct': 'Modifier le produit',
  'products.newProduct': 'Nouveau produit',
  'categories.homeLink': 'Accueil',
  'categories.newCategory': 'Nouvelle catégorie',
  'categories.searchPlaceholder': 'Rechercher une catégorie…',
  'categories.selectAll': 'Tout sélectionner',
  'categories.expandAll': 'Tout déplier',
  'categories.collapseAll': 'Tout replier',
  'categories.selectedCount': '{count} sélectionnée(s)',
  'categories.emptyTitle': 'Structurez votre catalogue',
  'categories.emptyDesc':
    'Créez une catégorie (ex. Vêtements), puis ajoutez des sous-catégories (ex. T-shirts, Robes) directement dessous.',
  'categories.emptyAction': 'Créer ma première catégorie',
  'categories.noSearchResults': 'Aucun résultat pour « {query} »',
  'categories.unit': 'catégorie(s)',
  'categories.childUnit': 'sous-catégorie(s)',
  'categories.subcatAbbrev': 'sous-cat.',
  'categories.prodAbbrev': 'prod.',
  'categories.addSubcategoriesTitle': 'Ajouter des sous-catégories',
  'categories.quickAddPlaceholder': 'Ajouter une sous-catégorie à « {name} »…',
  'categories.subcategoriesTitle': 'Sous-catégorie(s)',
  'categories.deleteSelection': 'Supprimer la sélection',
  'stock.lowStock': 'Stock bas',
  'stock.statOutOfStock': 'Ruptures',
  'stock.expiringSoon': 'Expire bientôt',
  'stock.stockValue': 'Valeur stock',
  'stock.settingsTitle': 'Paramètres d’alerte',
  'stock.defaultThreshold': 'Seuil d’alerte par défaut',
  'stock.defaultThresholdHelp': 'Utilisé pour les variantes sans seuil personnalisé',
  'stock.expiryDaysLabel': 'Jours avant alerte péremption',
  'stock.alertsEnabledLabel': 'Alertes actives',
  'stock.lowStockAlertsLabel': 'Alertes stock bas',
  'stock.expiryAlertsLabel': 'Alertes péremption',
  'stock.applyDefaultToAll': 'Appliquer le défaut aux variantes sans override',
  'stock.listDescription':
    'Les commandes du site déduisent le stock automatiquement. Utilisez Achat stock pour réapprovisionner, ou Vente directe pour une vente hors site — chaque action est enregistrée dans l’historique.',
  'stock.searchPlaceholder': 'Rechercher produit, variante, SKU…',
  'stock.filterAlert': 'En alerte',
  'stock.thresholdDate': 'Seuil / date',
  'stock.actionPurchase': 'Achat stock',
  'stock.actionDirectSale': 'Vente directe',
  'stock.inventoryShort': 'Inventaire',
  'stock.statusLow': 'Bas',
  'stock.movementsDescription':
    'Historique de tous les mouvements : achats, ventes directes, commandes site et corrections.',
  'stock.filterTypeAll': 'Tous les types',
  'stock.filterTypeIn': 'Achats / entrées',
  'stock.filterTypeOut': 'Sorties (site + direct)',
  'stock.filterTypeAdjust': 'Corrections inventaire',
  'stock.filterTypeRestore': 'Annulations commande',
  'stock.filterProductAll': 'Tous les produits',
  'stock.dialogPurchaseTitle': 'Achat / entrée stock',
  'stock.dialogDirectSaleTitle': 'Vente directe (hors site)',
  'stock.validate': 'Valider',
  'revenue.customRange': 'Personnalisé',
  'revenue.from': 'Du',
  'revenue.to': 'Au',
  'revenue.rangeDays': '{count}j',
  'revenue.deliveredRevenue': 'CA livré',
  'revenue.deliveredOrders': 'Commandes livrées',
  'revenue.averageBasket': 'Panier moyen',
  'revenue.cancellationRate': 'Taux annulation',
  'revenue.dailyRevenue': 'CA journalier (livré)',
  'revenue.noDataPeriod': 'Aucune donnée sur la période',
  'revenue.revenueAbbrev': 'CA',
  'revenue.indicators': 'Indicateurs',
  'revenue.confirmedRevenue': 'CA confirmé',
  'revenue.newOrders': 'Nouvelles',
  'revenue.totalOrders': 'Total commandes',
  'revenue.topProducts': 'Top produits',
  'revenue.noProductsSold': 'Aucun produit vendu sur la période',
};

const en: Record<PagesAdminMessageKey, string> = {
  'common.customer': 'Customer',
  'common.city': 'City',
  'common.payment': 'Payment',
  'common.total': 'Total',
  'common.product': 'Product',
  'common.details': 'Details',
  'common.filterLabel': 'filter',
  'common.category': 'Category',
  'common.price': 'Price',
  'common.badges': 'Badges',
  'common.outOfStock': 'Out of stock',
  'common.productUnit': 'product(s)',
  'common.type': 'Type',
  'common.resetFilters': 'Reset filters',
  'orders.searchPlaceholder': 'Search by ID, name or phone...',
  'orders.allStatuses': 'All statuses',
  'orders.itemsUnit': 'item(s)',
  'orders.dialogTitle': 'Order {id}',
  'orders.loadingDetail': 'Loading order…',
  'orders.customerInfo': 'Customer information',
  'orders.orderedItems': 'Ordered items',
  'orders.changeStatus': 'Change status',
  'orders.qty': 'Qty',
  'orders.unit': 'order(s)',
  'products.onboardingBanner':
    'Setup assistant — add a product, then you’ll return to the Publication step.',
  'products.onboardingBack': 'Back to the assistant',
  'products.updating': '(updating…)',
  'products.searchPlaceholder': 'Search for a product...',
  'products.allCategories': 'All categories',
  'products.badgeNew': 'New',
  'products.badgeBestseller': 'Best-seller',
  'products.badgePromo': 'Promo',
  'products.badgeLogo': 'Logo',
  'products.emptyFilteredDesc': 'Change the search or category.',
  'products.emptyDesc': 'Add your first product to launch the store.',
  'products.emptyCatalogDesc': 'Create a product to see it appear here and on your store.',
  'products.addProduct': 'Add a product',
  'products.inStockCount': 'In stock ({count})',
  'products.stockCount': 'Stock {count}',
  'products.editProduct': 'Edit product',
  'products.newProduct': 'New product',
  'categories.homeLink': 'Home',
  'categories.newCategory': 'New category',
  'categories.searchPlaceholder': 'Search a category…',
  'categories.selectAll': 'Select all',
  'categories.expandAll': 'Expand all',
  'categories.collapseAll': 'Collapse all',
  'categories.selectedCount': '{count} selected',
  'categories.emptyTitle': 'Structure your catalog',
  'categories.emptyDesc':
    'Create a category (e.g. Clothing), then add subcategories (e.g. T-shirts, Dresses) directly underneath.',
  'categories.emptyAction': 'Create my first category',
  'categories.noSearchResults': 'No results for “{query}”',
  'categories.unit': 'categorie(s)',
  'categories.childUnit': 'subcategorie(s)',
  'categories.subcatAbbrev': 'subcat.',
  'categories.prodAbbrev': 'prod.',
  'categories.addSubcategoriesTitle': 'Add subcategories',
  'categories.quickAddPlaceholder': 'Add a subcategory to “{name}”…',
  'categories.subcategoriesTitle': 'Subcategory(ies)',
  'categories.deleteSelection': 'Delete selection',
  'stock.lowStock': 'Low stock',
  'stock.statOutOfStock': 'Out of stock',
  'stock.expiringSoon': 'Expiring soon',
  'stock.stockValue': 'Stock value',
  'stock.settingsTitle': 'Alert settings',
  'stock.defaultThreshold': 'Default alert threshold',
  'stock.defaultThresholdHelp': 'Used for variants without a custom threshold',
  'stock.expiryDaysLabel': 'Days before expiry alert',
  'stock.alertsEnabledLabel': 'Alerts active',
  'stock.lowStockAlertsLabel': 'Low stock alerts',
  'stock.expiryAlertsLabel': 'Expiry alerts',
  'stock.applyDefaultToAll': 'Apply default to variants without an override',
  'stock.listDescription':
    'Site orders deduct stock automatically. Use Stock purchase to restock, or Direct sale for an off-site sale — every action is logged in the history.',
  'stock.searchPlaceholder': 'Search product, variant, SKU…',
  'stock.filterAlert': 'On alert',
  'stock.thresholdDate': 'Threshold / date',
  'stock.actionPurchase': 'Stock purchase',
  'stock.actionDirectSale': 'Direct sale',
  'stock.inventoryShort': 'Inventory',
  'stock.statusLow': 'Low',
  'stock.movementsDescription':
    'History of all movements: purchases, direct sales, site orders and corrections.',
  'stock.filterTypeAll': 'All types',
  'stock.filterTypeIn': 'Purchases / stock-in',
  'stock.filterTypeOut': 'Stock-out (site + direct)',
  'stock.filterTypeAdjust': 'Inventory corrections',
  'stock.filterTypeRestore': 'Order cancellations',
  'stock.filterProductAll': 'All products',
  'stock.dialogPurchaseTitle': 'Stock purchase / stock-in',
  'stock.dialogDirectSaleTitle': 'Direct sale (off-site)',
  'stock.validate': 'Confirm',
  'revenue.customRange': 'Custom',
  'revenue.from': 'From',
  'revenue.to': 'To',
  'revenue.rangeDays': '{count}d',
  'revenue.deliveredRevenue': 'Delivered revenue',
  'revenue.deliveredOrders': 'Delivered orders',
  'revenue.averageBasket': 'Average basket',
  'revenue.cancellationRate': 'Cancellation rate',
  'revenue.dailyRevenue': 'Daily revenue (delivered)',
  'revenue.noDataPeriod': 'No data for this period',
  'revenue.revenueAbbrev': 'Rev.',
  'revenue.indicators': 'Indicators',
  'revenue.confirmedRevenue': 'Confirmed revenue',
  'revenue.newOrders': 'New',
  'revenue.totalOrders': 'Total orders',
  'revenue.topProducts': 'Top products',
  'revenue.noProductsSold': 'No products sold in this period',
};

const ar: Record<PagesAdminMessageKey, string> = {
  'common.customer': 'العميل',
  'common.city': 'المدينة',
  'common.payment': 'الدفع',
  'common.total': 'الإجمالي',
  'common.product': 'المنتج',
  'common.details': 'التفاصيل',
  'common.filterLabel': 'مرشح',
  'common.category': 'الفئة',
  'common.price': 'السعر',
  'common.badges': 'الشارات',
  'common.outOfStock': 'نفاد المخزون',
  'common.productUnit': 'منتج(ات)',
  'common.type': 'النوع',
  'common.resetFilters': 'إعادة تعيين المرشحات',
  'orders.searchPlaceholder': 'ابحث بالمعرف أو الاسم أو الهاتف...',
  'orders.allStatuses': 'كل الحالات',
  'orders.itemsUnit': 'عنصر (عناصر)',
  'orders.dialogTitle': 'الطلب {id}',
  'orders.loadingDetail': 'جارٍ تحميل الطلب…',
  'orders.customerInfo': 'معلومات العميل',
  'orders.orderedItems': 'العناصر المطلوبة',
  'orders.changeStatus': 'تغيير الحالة',
  'orders.qty': 'الكمية',
  'orders.unit': 'طلب(ات)',
  'products.onboardingBanner':
    'مساعد الإعداد — أضف منتجًا، ثم ستعود إلى خطوة النشر.',
  'products.onboardingBack': 'العودة إلى المساعد',
  'products.updating': '(جارٍ التحديث…)',
  'products.searchPlaceholder': 'ابحث عن منتج...',
  'products.allCategories': 'كل الفئات',
  'products.badgeNew': 'جديد',
  'products.badgeBestseller': 'الأكثر مبيعًا',
  'products.badgePromo': 'عرض',
  'products.badgeLogo': 'شعار',
  'products.emptyFilteredDesc': 'غيّر البحث أو الفئة.',
  'products.emptyDesc': 'أضف منتجك الأول لإطلاق المتجر.',
  'products.emptyCatalogDesc': 'أنشئ منتجًا ليظهر هنا وعلى متجرك.',
  'products.addProduct': 'إضافة منتج',
  'products.inStockCount': 'متوفر ({count})',
  'products.stockCount': 'المخزون {count}',
  'products.editProduct': 'تعديل المنتج',
  'products.newProduct': 'منتج جديد',
  'categories.homeLink': 'الرئيسية',
  'categories.newCategory': 'فئة جديدة',
  'categories.searchPlaceholder': 'ابحث عن فئة…',
  'categories.selectAll': 'تحديد الكل',
  'categories.expandAll': 'توسيع الكل',
  'categories.collapseAll': 'طي الكل',
  'categories.selectedCount': '{count} محددة',
  'categories.emptyTitle': 'نظّم كتالوجك',
  'categories.emptyDesc':
    'أنشئ فئة (مثال: ملابس)، ثم أضف فئات فرعية (مثال: تيشيرتات، فساتين) مباشرة تحتها.',
  'categories.emptyAction': 'إنشاء فئتي الأولى',
  'categories.noSearchResults': 'لا توجد نتائج لـ « {query} »',
  'categories.unit': 'فئة (فئات)',
  'categories.childUnit': 'فئة (فئات) فرعية',
  'categories.subcatAbbrev': 'فئة فرعية',
  'categories.prodAbbrev': 'منتج',
  'categories.addSubcategoriesTitle': 'إضافة فئات فرعية',
  'categories.quickAddPlaceholder': 'أضف فئة فرعية إلى « {name} »…',
  'categories.subcategoriesTitle': 'فئة (فئات) فرعية',
  'categories.deleteSelection': 'حذف التحديد',
  'stock.lowStock': 'مخزون منخفض',
  'stock.statOutOfStock': 'نفاد المخزون',
  'stock.expiringSoon': 'ينتهي قريبًا',
  'stock.stockValue': 'قيمة المخزون',
  'stock.settingsTitle': 'إعدادات التنبيهات',
  'stock.defaultThreshold': 'حد التنبيه الافتراضي',
  'stock.defaultThresholdHelp': 'يُستخدم للمتغيرات التي لا تملك حدًا مخصصًا',
  'stock.expiryDaysLabel': 'عدد الأيام قبل تنبيه انتهاء الصلاحية',
  'stock.alertsEnabledLabel': 'التنبيهات مفعّلة',
  'stock.lowStockAlertsLabel': 'تنبيهات المخزون المنخفض',
  'stock.expiryAlertsLabel': 'تنبيهات انتهاء الصلاحية',
  'stock.applyDefaultToAll': 'تطبيق القيمة الافتراضية على المتغيرات بدون تخصيص',
  'stock.listDescription':
    'تخصم طلبات الموقع المخزون تلقائيًا. استخدم شراء مخزون لإعادة التموين، أو بيع مباشر لبيع خارج الموقع — يُسجَّل كل إجراء في السجل.',
  'stock.searchPlaceholder': 'ابحث عن منتج، متغير، SKU…',
  'stock.filterAlert': 'في حالة تنبيه',
  'stock.thresholdDate': 'الحد / التاريخ',
  'stock.actionPurchase': 'شراء مخزون',
  'stock.actionDirectSale': 'بيع مباشر',
  'stock.inventoryShort': 'الجرد',
  'stock.statusLow': 'منخفض',
  'stock.movementsDescription':
    'سجل جميع الحركات: المشتريات والمبيعات المباشرة وطلبات الموقع والتصحيحات.',
  'stock.filterTypeAll': 'كل الأنواع',
  'stock.filterTypeIn': 'مشتريات / إدخال',
  'stock.filterTypeOut': 'إخراج (الموقع + مباشر)',
  'stock.filterTypeAdjust': 'تصحيحات الجرد',
  'stock.filterTypeRestore': 'إلغاء طلبات',
  'stock.filterProductAll': 'كل المنتجات',
  'stock.dialogPurchaseTitle': 'شراء / إدخال مخزون',
  'stock.dialogDirectSaleTitle': 'بيع مباشر (خارج الموقع)',
  'stock.validate': 'تأكيد',
  'revenue.customRange': 'مخصص',
  'revenue.from': 'من',
  'revenue.to': 'إلى',
  'revenue.rangeDays': '{count} يوم',
  'revenue.deliveredRevenue': 'رقم المعاملات المسلَّم',
  'revenue.deliveredOrders': 'الطلبات المسلَّمة',
  'revenue.averageBasket': 'متوسط السلة',
  'revenue.cancellationRate': 'معدل الإلغاء',
  'revenue.dailyRevenue': 'الإيرادات اليومية (المسلَّمة)',
  'revenue.noDataPeriod': 'لا توجد بيانات لهذه الفترة',
  'revenue.revenueAbbrev': 'الإيرادات',
  'revenue.indicators': 'المؤشرات',
  'revenue.confirmedRevenue': 'رقم المعاملات المؤكَّد',
  'revenue.newOrders': 'جديدة',
  'revenue.totalOrders': 'إجمالي الطلبات',
  'revenue.topProducts': 'أفضل المنتجات',
  'revenue.noProductsSold': 'لم يُباع أي منتج خلال هذه الفترة',
};

export const pagesAdminExtra: Record<StoreLocale, Record<PagesAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
