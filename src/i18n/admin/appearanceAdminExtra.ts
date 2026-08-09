import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n dédiées à l’atelier Apparence admin. */
export type AppearanceAdminMessageKey =
  | 'common.saving'
  | 'common.hide'
  | 'common.apply'
  | 'common.restore'
  | 'common.demo'
  | 'common.customized'
  | 'common.viewStoreShort'
  | 'common.section'
  | 'appearance.properties'
  | 'appearance.sections'
  | 'appearance.live'
  | 'appearance.clickSectionHint'
  | 'appearance.clickEditHint'
  | 'appearance.showSections'
  | 'appearance.showEditor'
  | 'appearance.hideSections'
  | 'appearance.hideEditor'
  | 'appearance.desktop'
  | 'appearance.tablet'
  | 'appearance.mobile'
  | 'appearance.undo'
  | 'appearance.redo'
  | 'appearance.onlineStoreCrumb'
  | 'appearance.themesHint'
  | 'appearance.looksComplete'
  | 'appearance.looksHint'
  | 'appearance.sec.themes'
  | 'appearance.sec.identity'
  | 'appearance.sec.typography'
  | 'appearance.sec.buttons'
  | 'appearance.sec.cards'
  | 'appearance.sec.hero'
  | 'appearance.sec.backgrounds'
  | 'appearance.sec.header'
  | 'appearance.sec.footer'
  | 'appearance.sec.home'
  | 'appearance.sec.shop'
  | 'appearance.sec.product'
  | 'appearance.sec.wishlist'
  | 'appearance.sec.cart'
  | 'appearance.sec.checkout'
  | 'appearance.sec.forms'
  | 'appearance.sec.notFound'
  | 'appearance.theme.classic'
  | 'appearance.theme.classicDesc'
  | 'appearance.theme.minimal'
  | 'appearance.theme.minimalDesc'
  | 'appearance.theme.bold'
  | 'appearance.theme.boldDesc'
  | 'appearance.theme.elegant'
  | 'appearance.theme.elegantDesc'
  | 'appearance.look.editorial'
  | 'appearance.look.editorialDesc'
  | 'appearance.look.dense'
  | 'appearance.look.denseDesc'
  | 'appearance.look.boutique'
  | 'appearance.look.boutiqueDesc'
  | 'appearance.look.flash'
  | 'appearance.look.flashDesc'
  | 'appearance.typoHint'
  | 'appearance.fontPairs'
  | 'appearance.buttonsHint'
  | 'appearance.cardsHint'
  | 'appearance.heroHint'
  | 'appearance.ctaLabel'
  | 'appearance.benefitsStrip'
  | 'appearance.identityHint'
  | 'appearance.siteName'
  | 'appearance.tagline'
  | 'appearance.about'
  | 'appearance.faviconHint'
  | 'appearance.colorSchemesHint'
  | 'appearance.primary'
  | 'appearance.secondary'
  | 'appearance.headerSticky'
  | 'appearance.headerStickyDesc'
  | 'appearance.footerHint'
  | 'appearance.cartHint'
  | 'appearance.cartEmptyHint'
  | 'appearance.crossSell'
  | 'appearance.checkoutHint'
  | 'appearance.shopHint'
  | 'appearance.shopTitle'
  | 'appearance.subtitle'
  | 'appearance.shopEmptyTitle'
  | 'appearance.shopEmptyDesc'
  | 'appearance.shopEmptyCta'
  | 'appearance.productHint'
  | 'appearance.productCta'
  | 'appearance.wishlistHint'
  | 'appearance.emptyTitle'
  | 'appearance.emptyCta'
  | 'appearance.formsHint'
  | 'appearance.formsCta'
  | 'appearance.notFoundHint'
  | 'appearance.titleField'
  | 'appearance.message'
  | 'appearance.ctaHref'
  | 'appearance.homeBlocksHint'
  | 'appearance.text'
  | 'appearance.destination'
  | 'appearance.manualLink'
  | 'appearance.fallbackBar'
  | 'appearance.fallbackText'
  | 'appearance.fallbackBg'
  | 'appearance.fallbackFg'
  | 'appearance.track'
  | 'appearance.thumb'
  | 'appearance.headerText'
  | 'appearance.footerText'
  | 'appearance.settingsSaved'
  | 'appearance.storeSettings'
  | 'appearance.loadError'
  | 'appearance.loadErrorDesc'
  | 'appearance.group.radius'
  | 'appearance.group.surfaces'
  | 'appearance.group.backgrounds'
  | 'appearance.group.texts'
  | 'appearance.group.scrollbar'
  | 'appearance.group.layout'
  | 'appearance.group.headerStyle'
  | 'appearance.group.elements'
  | 'appearance.group.promoBars'
  | 'appearance.group.systemButtons'
  | 'appearance.group.customPages'
  | 'appearance.group.logo'
  | 'appearance.group.favicon'
  | 'appearance.group.colorSchemes'
  | 'appearance.group.customize'
  | 'appearance.group.preview'
  | 'appearance.group.density'
  | 'appearance.group.emptyCart'
  | 'appearance.group.summaryPos'
  | 'appearance.group.formStyle'
  | 'appearance.group.paymentStyle'
  | 'appearance.group.title'
  | 'appearance.group.payButton'
  | 'appearance.group.options'
  | 'appearance.group.cardStyle'
  | 'appearance.autoSurfaceHint';

const fr: Record<AppearanceAdminMessageKey, string> = {
  'common.saving': 'Enregistrement…',
  'common.hide': 'Masquer',
  'common.apply': 'Appliquer',
  'common.restore': 'Restaurer',
  'common.demo': 'Démo',
  'common.customized': 'Personnalisé',
  'common.viewStoreShort': 'Voir boutique',
  'common.section': 'Section',
  'appearance.properties': 'Propriétés',
  'appearance.sections': 'Sections',
  'appearance.live': 'Live',
  'appearance.clickSectionHint': 'Cliquez une section ou une zone de l’aperçu',
  'appearance.clickEditHint':
    '1ᵉʳ clic = éditer · 2ᵉ clic même zone = fermer · 2ᵉ clic menu = page',
  'appearance.showSections': 'Afficher sections',
  'appearance.showEditor': 'Afficher éditeur',
  'appearance.hideSections': 'Masquer les sections',
  'appearance.hideEditor': 'Masquer l’éditeur',
  'appearance.desktop': 'Bureau',
  'appearance.tablet': 'Tablette',
  'appearance.mobile': 'Mobile',
  'appearance.undo': 'Annuler (Ctrl+Z)',
  'appearance.redo': 'Rétablir (Ctrl+Y)',
  'appearance.onlineStoreCrumb': 'Boutique en ligne',
  'appearance.themesHint':
    'Chaque thème conserve ses couleurs et réglages. Changer de thème sauvegarde l’actuel ; y revenir le restaure.',
  'appearance.looksComplete': 'Looks complets',
  'appearance.looksHint':
    '1 clic applique styles boutique + layout (sans changer le thème de base).',
  'appearance.sec.themes': 'Thèmes',
  'appearance.sec.identity': 'Identité & couleurs',
  'appearance.sec.typography': 'Typographie',
  'appearance.sec.buttons': 'Boutons',
  'appearance.sec.cards': 'Cards produit',
  'appearance.sec.hero': 'Hero',
  'appearance.sec.backgrounds': 'Fonds',
  'appearance.sec.header': 'Header',
  'appearance.sec.footer': 'Footer',
  'appearance.sec.home': 'Sections accueil',
  'appearance.sec.shop': 'Boutique',
  'appearance.sec.product': 'Fiche produit',
  'appearance.sec.wishlist': 'Favoris',
  'appearance.sec.cart': 'Panier',
  'appearance.sec.checkout': 'Checkout',
  'appearance.sec.forms': 'Formulaires',
  'appearance.sec.notFound': 'Page 404',
  'appearance.theme.classic': 'Classique',
  'appearance.theme.classicDesc':
    'Vitrine e-commerce classique : hero photo, bénéfices, grilles catégories & produits arrondis.',
  'appearance.theme.minimal': 'Minimal',
  'appearance.theme.minimalDesc':
    'Look éditorial blanc : typo géante, peu de sections, grille produit épurée sans cartes.',
  'appearance.theme.bold': 'Bold',
  'appearance.theme.boldDesc':
    'Ambiance dark flash-sale : angles droits, bannières, gros CTA et mosaïque asymétrique.',
  'appearance.theme.elegant': 'Élégant',
  'appearance.theme.elegantDesc':
    'Magazine luxe : hero centré, italiques, cercles catégories et mise en page éditoriale.',
  'appearance.look.editorial': 'Éditorial',
  'appearance.look.editorialDesc': 'Aéré, 2 colonnes, galerie premium.',
  'appearance.look.dense': 'Dense',
  'appearance.look.denseDesc': 'Max produits, filtres sidebar, checkout compact.',
  'appearance.look.boutique': 'Boutique',
  'appearance.look.boutiqueDesc': 'Équilibre confort, cards relief, CTA fort.',
  'appearance.look.flash': 'Flash',
  'appearance.look.flashDesc': 'Contraste fort, pilules, checkout une page.',
  'appearance.typoHint': 'Choisissez une paire Display / Body — aperçu live à gauche.',
  'appearance.fontPairs': 'Paires de polices',
  'appearance.buttonsHint': 'Style des boutons CTA — cliquez une carte pour appliquer.',
  'appearance.cardsHint': 'Apparence des fiches produit — style, image, badges, hover.',
  'appearance.heroHint': 'Disposition du bandeau d’accueil — comme les layouts Shopify.',
  'appearance.ctaLabel': 'Libellé CTA',
  'appearance.benefitsStrip': 'Bande bénéfices',
  'appearance.identityHint': 'Nom, logo, favicon et couleurs de marque.',
  'appearance.siteName': 'Nom du site',
  'appearance.tagline': 'Accroche',
  'appearance.about': 'À propos',
  'appearance.faviconHint':
    'Icône de l’onglet du navigateur (.png, .ico, .svg — idéal 32×32 ou 64×64).',
  'appearance.colorSchemesHint':
    'Un clic applique primaire + secondaire (comme les color schemes Shopify).',
  'appearance.primary': 'Primaire',
  'appearance.secondary': 'Secondaire',
  'appearance.headerSticky': 'Header sticky',
  'appearance.headerStickyDesc': 'Reste visible au scroll.',
  'appearance.footerHint': 'Blocs visibles et structure du pied de page.',
  'appearance.cartHint': 'Mise en page de la page panier — aperçu live au centre.',
  'appearance.cartEmptyHint': 'Cliquez un style — l’aperçu passe automatiquement en « Vide ».',
  'appearance.crossSell': 'Cross-sell',
  'appearance.checkoutHint': 'Parcours de commande — visible dans l’aperçu Checkout.',
  'appearance.shopHint': 'Catalogue boutique — filtres, grille, densité, état vide.',
  'appearance.shopTitle': 'Titre boutique',
  'appearance.subtitle': 'Sous-titre',
  'appearance.shopEmptyTitle': 'Titre catalogue vide',
  'appearance.shopEmptyDesc': 'Description vide',
  'appearance.shopEmptyCta': 'CTA catalogue vide',
  'appearance.productHint': 'Fiche produit — galerie, buy box, produits liés.',
  'appearance.productCta': 'Libellé CTA principal',
  'appearance.wishlistHint': 'Page favoris — grille et état vide.',
  'appearance.emptyTitle': 'Titre état vide',
  'appearance.emptyCta': 'Libellé CTA vide',
  'appearance.formsHint': 'Contact, Sur-mesure et Devis — même logique visuelle.',
  'appearance.formsCta': 'Libellé CTA (vide = défaut page)',
  'appearance.notFoundHint': 'Page 404 — titres et CTA de secours.',
  'appearance.titleField': 'Titre',
  'appearance.message': 'Message',
  'appearance.ctaHref': 'Lien CTA',
  'appearance.homeBlocksHint': 'Activez les blocs d’accueil classiques — un clic suffit.',
  'appearance.text': 'Texte',
  'appearance.destination': 'Destination',
  'appearance.manualLink': 'Lien manuel',
  'appearance.fallbackBar': 'Bandeau fixe de secours (Apparence)',
  'appearance.fallbackText': 'Texte de secours',
  'appearance.fallbackBg': 'Fond (secours)',
  'appearance.fallbackFg': 'Texte (secours)',
  'appearance.track': 'Piste',
  'appearance.thumb': 'Curseur',
  'appearance.headerText': 'Texte header',
  'appearance.footerText': 'Texte footer',
  'appearance.settingsSaved': 'Paramètres boutique enregistrés',
  'appearance.storeSettings': 'Paramètres boutique',
  'appearance.loadError': 'Erreur de chargement',
  'appearance.loadErrorDesc': 'Impossible de charger les paramètres boutique.',
  'appearance.group.radius': 'Arrondis',
  'appearance.group.surfaces': 'Surfaces rapides',
  'appearance.group.backgrounds': 'Fonds',
  'appearance.group.texts': 'Textes',
  'appearance.group.scrollbar': 'Scrollbar',
  'appearance.group.layout': 'Disposition',
  'appearance.group.headerStyle': 'Style header',
  'appearance.group.elements': 'Éléments',
  'appearance.group.promoBars': 'Bandeaux promo',
  'appearance.group.systemButtons': 'Boutons système',
  'appearance.group.customPages': 'Pages personnalisées',
  'appearance.group.logo': 'Logo',
  'appearance.group.favicon': 'Favicon',
  'appearance.group.colorSchemes': 'Schémas de couleurs',
  'appearance.group.customize': 'Personnaliser',
  'appearance.group.preview': 'Aperçu',
  'appearance.group.density': 'Densité',
  'appearance.group.emptyCart': 'Panier vide',
  'appearance.group.summaryPos': 'Position du récap',
  'appearance.group.formStyle': 'Style formulaire',
  'appearance.group.paymentStyle': 'Style paiements',
  'appearance.group.title': 'Titre',
  'appearance.group.payButton': 'Bouton de paiement',
  'appearance.group.options': 'Options',
  'appearance.group.cardStyle': 'Style carte',
  'appearance.autoSurfaceHint':
    '« Auto » utilise la couleur du thème actif. Ou choisissez une surface prête.',
};

const ar: Record<AppearanceAdminMessageKey, string> = {
  'common.saving': 'جارٍ الحفظ…',
  'common.hide': 'إخفاء',
  'common.apply': 'تطبيق',
  'common.restore': 'استعادة',
  'common.demo': 'تجريبي',
  'common.customized': 'مخصّص',
  'common.viewStoreShort': 'عرض المتجر',
  'common.section': 'قسم',
  'appearance.properties': 'الخصائص',
  'appearance.sections': 'الأقسام',
  'appearance.live': 'مباشر',
  'appearance.clickSectionHint': 'انقر قسماً أو منطقة في المعاينة',
  'appearance.clickEditHint':
    'نقرة 1 = تحرير · نقرة 2 على نفس المنطقة = إغلاق · نقرة 2 على القائمة = صفحة',
  'appearance.showSections': 'إظهار الأقسام',
  'appearance.showEditor': 'إظهار المحرر',
  'appearance.hideSections': 'إخفاء الأقسام',
  'appearance.hideEditor': 'إخفاء المحرر',
  'appearance.desktop': 'سطح المكتب',
  'appearance.tablet': 'جهاز لوحي',
  'appearance.mobile': 'جوال',
  'appearance.undo': 'تراجع (Ctrl+Z)',
  'appearance.redo': 'إعادة (Ctrl+Y)',
  'appearance.onlineStoreCrumb': 'المتجر الإلكتروني',
  'appearance.themesHint':
    'كل ثيم يحتفظ بألوانه وإعداداته. تغيير الثيم يحفظ الحالي؛ والعودة إليه تستعيده.',
  'appearance.looksComplete': 'مظاهر كاملة',
  'appearance.looksHint':
    'نقرة واحدة تطبق أنماط المتجر والتخطيط (دون تغيير الثيم الأساسي).',
  'appearance.sec.themes': 'الثيمات',
  'appearance.sec.identity': 'الهوية والألوان',
  'appearance.sec.typography': 'الخطوط',
  'appearance.sec.buttons': 'الأزرار',
  'appearance.sec.cards': 'بطاقات المنتج',
  'appearance.sec.hero': 'البانر الرئيسي',
  'appearance.sec.backgrounds': 'الخلفيات',
  'appearance.sec.header': 'الرأس',
  'appearance.sec.footer': 'التذييل',
  'appearance.sec.home': 'أقسام الصفحة الرئيسية',
  'appearance.sec.shop': 'المتجر',
  'appearance.sec.product': 'صفحة المنتج',
  'appearance.sec.wishlist': 'المفضلة',
  'appearance.sec.cart': 'السلة',
  'appearance.sec.checkout': 'الدفع',
  'appearance.sec.forms': 'النماذج',
  'appearance.sec.notFound': 'صفحة 404',
  'appearance.theme.classic': 'كلاسيكي',
  'appearance.theme.classicDesc':
    'واجهة متجر كلاسيكية: بانر صورة، مزايا، شبكات فئات ومنتجات مستديرة.',
  'appearance.theme.minimal': 'بسيط',
  'appearance.theme.minimalDesc':
    'مظهر تحريري أبيض: خطوط كبيرة، أقسام قليلة، شبكة منتجات نظيفة بدون بطاقات.',
  'appearance.theme.bold': 'جريء',
  'appearance.theme.boldDesc':
    'أجواء مبيعات قوية: زوايا حادة، لافتات، أزرار كبيرة وشبكة غير متماثلة.',
  'appearance.theme.elegant': 'أنيق',
  'appearance.theme.elegantDesc':
    'مجلة فاخرة: بانر مركزي، خطوط مائلة، فئات دائرية وتخطيط تحريري.',
  'appearance.look.editorial': 'تحريري',
  'appearance.look.editorialDesc': 'واسع، عمودان، معرض فاخر.',
  'appearance.look.dense': 'مكثف',
  'appearance.look.denseDesc': 'أقصى منتجات، فلاتر جانبية، دفع مضغوط.',
  'appearance.look.boutique': 'بوتيك',
  'appearance.look.boutiqueDesc': 'توازن مريح، بطاقات بارزة، زر قوي.',
  'appearance.look.flash': 'فلاش',
  'appearance.look.flashDesc': 'تباين قوي، أزرار كبسولة، دفع بصفحة واحدة.',
  'appearance.typoHint': 'اختر زوج خطوط Display / Body — معاينة مباشرة على اليسار.',
  'appearance.fontPairs': 'أزواج الخطوط',
  'appearance.buttonsHint': 'نمط أزرار الدعوة للإجراء — انقر بطاقة للتطبيق.',
  'appearance.cardsHint': 'مظهر بطاقات المنتج — النمط، الصورة، الشارات، التحويم.',
  'appearance.heroHint': 'تخطيط بانر الصفحة الرئيسية — مثل تخطيطات Shopify.',
  'appearance.ctaLabel': 'نص الزر',
  'appearance.benefitsStrip': 'شريط المزايا',
  'appearance.identityHint': 'الاسم، الشعار، أيقونة التبويب وألوان العلامة.',
  'appearance.siteName': 'اسم الموقع',
  'appearance.tagline': 'الشعار النصي',
  'appearance.about': 'نبذة',
  'appearance.faviconHint':
    'أيقونة تبويب المتصفح (.png، .ico، .svg — يُفضّل 32×32 أو 64×64).',
  'appearance.colorSchemesHint':
    'نقرة واحدة تطبق اللون الأساسي والثانوي (مثل مخططات ألوان Shopify).',
  'appearance.primary': 'أساسي',
  'appearance.secondary': 'ثانوي',
  'appearance.headerSticky': 'رأس ثابت',
  'appearance.headerStickyDesc': 'يبقى ظاهراً أثناء التمرير.',
  'appearance.footerHint': 'الكتل الظاهرة وهيكل تذييل الصفحة.',
  'appearance.cartHint': 'تخطيط صفحة السلة — معاينة مباشرة في الوسط.',
  'appearance.cartEmptyHint': 'انقر نمطاً — تنتقل المعاينة تلقائياً إلى «فارغ».',
  'appearance.crossSell': 'بيع متقاطع',
  'appearance.checkoutHint': 'مسار الطلب — ظاهر في معاينة الدفع.',
  'appearance.shopHint': 'كتالوج المتجر — فلاتر، شبكة، كثافة، حالة فارغة.',
  'appearance.shopTitle': 'عنوان المتجر',
  'appearance.subtitle': 'العنوان الفرعي',
  'appearance.shopEmptyTitle': 'عنوان الكتالوج الفارغ',
  'appearance.shopEmptyDesc': 'وصف فارغ',
  'appearance.shopEmptyCta': 'زر الكتالوج الفارغ',
  'appearance.productHint': 'صفحة المنتج — المعرض، صندوق الشراء، منتجات ذات صلة.',
  'appearance.productCta': 'نص الزر الرئيسي',
  'appearance.wishlistHint': 'صفحة المفضلة — الشبكة والحالة الفارغة.',
  'appearance.emptyTitle': 'عنوان الحالة الفارغة',
  'appearance.emptyCta': 'نص زر الحالة الفارغة',
  'appearance.formsHint': 'الاتصال، حسب الطلب والعروض — نفس المنطق البصري.',
  'appearance.formsCta': 'نص الزر (فارغ = افتراضي الصفحة)',
  'appearance.notFoundHint': 'صفحة 404 — العناوين وأزرار الاحتياط.',
  'appearance.titleField': 'العنوان',
  'appearance.message': 'الرسالة',
  'appearance.ctaHref': 'رابط الزر',
  'appearance.homeBlocksHint': 'فعّل كتل الصفحة الرئيسية الكلاسيكية — نقرة واحدة تكفي.',
  'appearance.text': 'النص',
  'appearance.destination': 'الوجهة',
  'appearance.manualLink': 'رابط يدوي',
  'appearance.fallbackBar': 'شريط احتياطي ثابت (المظهر)',
  'appearance.fallbackText': 'نص احتياطي',
  'appearance.fallbackBg': 'خلفية (احتياطي)',
  'appearance.fallbackFg': 'نص (احتياطي)',
  'appearance.track': 'المسار',
  'appearance.thumb': 'المؤشر',
  'appearance.headerText': 'نص الرأس',
  'appearance.footerText': 'نص التذييل',
  'appearance.settingsSaved': 'تم حفظ إعدادات المتجر',
  'appearance.storeSettings': 'إعدادات المتجر',
  'appearance.loadError': 'خطأ في التحميل',
  'appearance.loadErrorDesc': 'تعذّر تحميل إعدادات المتجر.',
  'appearance.group.radius': 'الزوايا',
  'appearance.group.surfaces': 'أسطح سريعة',
  'appearance.group.backgrounds': 'الخلفيات',
  'appearance.group.texts': 'النصوص',
  'appearance.group.scrollbar': 'شريط التمرير',
  'appearance.group.layout': 'التخطيط',
  'appearance.group.headerStyle': 'نمط الرأس',
  'appearance.group.elements': 'العناصر',
  'appearance.group.promoBars': 'أشرطة ترويجية',
  'appearance.group.systemButtons': 'أزرار النظام',
  'appearance.group.customPages': 'صفحات مخصصة',
  'appearance.group.logo': 'الشعار',
  'appearance.group.favicon': 'أيقونة التبويب',
  'appearance.group.colorSchemes': 'مخططات الألوان',
  'appearance.group.customize': 'تخصيص',
  'appearance.group.preview': 'معاينة',
  'appearance.group.density': 'الكثافة',
  'appearance.group.emptyCart': 'سلة فارغة',
  'appearance.group.summaryPos': 'موضع الملخص',
  'appearance.group.formStyle': 'نمط النموذج',
  'appearance.group.paymentStyle': 'نمط الدفع',
  'appearance.group.title': 'العنوان',
  'appearance.group.payButton': 'زر الدفع',
  'appearance.group.options': 'خيارات',
  'appearance.group.cardStyle': 'نمط البطاقة',
  'appearance.autoSurfaceHint':
    '« تلقائي » يستخدم لون الثيم النشط. أو اختر سطحاً جاهزاً.',
};

const en: Record<AppearanceAdminMessageKey, string> = {
  'common.saving': 'Saving…',
  'common.hide': 'Hide',
  'common.apply': 'Apply',
  'common.restore': 'Restore',
  'common.demo': 'Demo',
  'common.customized': 'Customized',
  'common.viewStoreShort': 'View store',
  'common.section': 'Section',
  'appearance.properties': 'Properties',
  'appearance.sections': 'Sections',
  'appearance.live': 'Live',
  'appearance.clickSectionHint': 'Click a section or an area in the preview',
  'appearance.clickEditHint':
    '1st click = edit · 2nd click same area = close · 2nd click menu = page',
  'appearance.showSections': 'Show sections',
  'appearance.showEditor': 'Show editor',
  'appearance.hideSections': 'Hide sections',
  'appearance.hideEditor': 'Hide editor',
  'appearance.desktop': 'Desktop',
  'appearance.tablet': 'Tablet',
  'appearance.mobile': 'Mobile',
  'appearance.undo': 'Undo (Ctrl+Z)',
  'appearance.redo': 'Redo (Ctrl+Y)',
  'appearance.onlineStoreCrumb': 'Online store',
  'appearance.themesHint':
    'Each theme keeps its colors and settings. Switching themes saves the current one; coming back restores it.',
  'appearance.looksComplete': 'Full looks',
  'appearance.looksHint':
    '1 click applies store styles + layout (without changing the base theme).',
  'appearance.sec.themes': 'Themes',
  'appearance.sec.identity': 'Identity & colors',
  'appearance.sec.typography': 'Typography',
  'appearance.sec.buttons': 'Buttons',
  'appearance.sec.cards': 'Product cards',
  'appearance.sec.hero': 'Hero',
  'appearance.sec.backgrounds': 'Backgrounds',
  'appearance.sec.header': 'Header',
  'appearance.sec.footer': 'Footer',
  'appearance.sec.home': 'Home sections',
  'appearance.sec.shop': 'Shop',
  'appearance.sec.product': 'Product page',
  'appearance.sec.wishlist': 'Wishlist',
  'appearance.sec.cart': 'Cart',
  'appearance.sec.checkout': 'Checkout',
  'appearance.sec.forms': 'Forms',
  'appearance.sec.notFound': '404 page',
  'appearance.theme.classic': 'Classic',
  'appearance.theme.classicDesc':
    'Classic ecommerce storefront: photo hero, benefits, rounded category & product grids.',
  'appearance.theme.minimal': 'Minimal',
  'appearance.theme.minimalDesc':
    'Editorial white look: huge type, few sections, clean product grid without cards.',
  'appearance.theme.bold': 'Bold',
  'appearance.theme.boldDesc':
    'Dark flash-sale vibe: sharp corners, banners, big CTAs and asymmetric mosaic.',
  'appearance.theme.elegant': 'Elegant',
  'appearance.theme.elegantDesc':
    'Luxury magazine: centered hero, italics, circle categories and editorial layout.',
  'appearance.look.editorial': 'Editorial',
  'appearance.look.editorialDesc': 'Airy, 2 columns, premium gallery.',
  'appearance.look.dense': 'Dense',
  'appearance.look.denseDesc': 'Max products, sidebar filters, compact checkout.',
  'appearance.look.boutique': 'Boutique',
  'appearance.look.boutiqueDesc': 'Comfortable balance, raised cards, strong CTA.',
  'appearance.look.flash': 'Flash',
  'appearance.look.flashDesc': 'High contrast, pills, single-page checkout.',
  'appearance.typoHint': 'Pick a Display / Body pair — live preview on the left.',
  'appearance.fontPairs': 'Font pairs',
  'appearance.buttonsHint': 'CTA button style — click a card to apply.',
  'appearance.cardsHint': 'Product card look — style, image, badges, hover.',
  'appearance.heroHint': 'Home banner layout — like Shopify layouts.',
  'appearance.ctaLabel': 'CTA label',
  'appearance.benefitsStrip': 'Benefits strip',
  'appearance.identityHint': 'Name, logo, favicon and brand colors.',
  'appearance.siteName': 'Site name',
  'appearance.tagline': 'Tagline',
  'appearance.about': 'About',
  'appearance.faviconHint':
    'Browser tab icon (.png, .ico, .svg — ideally 32×32 or 64×64).',
  'appearance.colorSchemesHint':
    'One click applies primary + secondary (like Shopify color schemes).',
  'appearance.primary': 'Primary',
  'appearance.secondary': 'Secondary',
  'appearance.headerSticky': 'Sticky header',
  'appearance.headerStickyDesc': 'Stays visible while scrolling.',
  'appearance.footerHint': 'Visible blocks and footer structure.',
  'appearance.cartHint': 'Cart page layout — live preview in the center.',
  'appearance.cartEmptyHint': 'Click a style — preview switches to “Empty” automatically.',
  'appearance.crossSell': 'Cross-sell',
  'appearance.checkoutHint': 'Checkout flow — visible in the Checkout preview.',
  'appearance.shopHint': 'Shop catalog — filters, grid, density, empty state.',
  'appearance.shopTitle': 'Shop title',
  'appearance.subtitle': 'Subtitle',
  'appearance.shopEmptyTitle': 'Empty catalog title',
  'appearance.shopEmptyDesc': 'Empty description',
  'appearance.shopEmptyCta': 'Empty catalog CTA',
  'appearance.productHint': 'Product page — gallery, buy box, related products.',
  'appearance.productCta': 'Primary CTA label',
  'appearance.wishlistHint': 'Wishlist page — grid and empty state.',
  'appearance.emptyTitle': 'Empty state title',
  'appearance.emptyCta': 'Empty CTA label',
  'appearance.formsHint': 'Contact, Custom and Quote — same visual logic.',
  'appearance.formsCta': 'CTA label (empty = page default)',
  'appearance.notFoundHint': '404 page — fallback titles and CTAs.',
  'appearance.titleField': 'Title',
  'appearance.message': 'Message',
  'appearance.ctaHref': 'CTA link',
  'appearance.homeBlocksHint': 'Enable classic home blocks — one click is enough.',
  'appearance.text': 'Text',
  'appearance.destination': 'Destination',
  'appearance.manualLink': 'Manual link',
  'appearance.fallbackBar': 'Fallback fixed bar (Appearance)',
  'appearance.fallbackText': 'Fallback text',
  'appearance.fallbackBg': 'Background (fallback)',
  'appearance.fallbackFg': 'Text (fallback)',
  'appearance.track': 'Track',
  'appearance.thumb': 'Thumb',
  'appearance.headerText': 'Header text',
  'appearance.footerText': 'Footer text',
  'appearance.settingsSaved': 'Store settings saved',
  'appearance.storeSettings': 'Store settings',
  'appearance.loadError': 'Loading error',
  'appearance.loadErrorDesc': 'Could not load store settings.',
  'appearance.group.radius': 'Corners',
  'appearance.group.surfaces': 'Quick surfaces',
  'appearance.group.backgrounds': 'Backgrounds',
  'appearance.group.texts': 'Texts',
  'appearance.group.scrollbar': 'Scrollbar',
  'appearance.group.layout': 'Layout',
  'appearance.group.headerStyle': 'Header style',
  'appearance.group.elements': 'Elements',
  'appearance.group.promoBars': 'Promo bars',
  'appearance.group.systemButtons': 'System buttons',
  'appearance.group.customPages': 'Custom pages',
  'appearance.group.logo': 'Logo',
  'appearance.group.favicon': 'Favicon',
  'appearance.group.colorSchemes': 'Color schemes',
  'appearance.group.customize': 'Customize',
  'appearance.group.preview': 'Preview',
  'appearance.group.density': 'Density',
  'appearance.group.emptyCart': 'Empty cart',
  'appearance.group.summaryPos': 'Summary position',
  'appearance.group.formStyle': 'Form style',
  'appearance.group.paymentStyle': 'Payment style',
  'appearance.group.title': 'Title',
  'appearance.group.payButton': 'Payment button',
  'appearance.group.options': 'Options',
  'appearance.group.cardStyle': 'Card style',
  'appearance.autoSurfaceHint':
    '“Auto” uses the active theme color. Or pick a ready-made surface.',
};

export const appearanceAdminExtra: Record<
  StoreLocale,
  Record<AppearanceAdminMessageKey, string>
> = { fr, ar, en };
