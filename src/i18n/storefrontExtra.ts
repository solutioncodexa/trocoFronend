export type StoreLocale = 'fr' | 'ar' | 'en';

/** Clés UI des pages vitrine (hors chrome déjà dans messages.ts). */
export type ExtraMessageKey =
  // Shared form / contact
  | 'fullName'
  | 'phone'
  | 'address'
  | 'city'
  | 'message'
  | 'optional'
  | 'required'
  | 'sending'
  | 'add'
  | 'browse'
  | 'select'
  | 'projectDetails'
  | 'estimatedQty'
  | 'dimensionsFormat'
  | 'yourDetails'
  | 'description'
  | 'newRequest'
  | 'requestSent'
  | 'thanksContact'
  | 'fileTooBig'
  | 'sendFailed'
  | 'fieldRequired'
  // Contact
  | 'contactEyebrow'
  | 'contactTitle'
  | 'contactIntro'
  | 'contactQuickTitle'
  | 'contactQuickDesc'
  | 'contactQuickDescLong'
  | 'yourRequest'
  | 'sendMessage'
  | 'messaging'
  | 'phFullName'
  | 'phEmail'
  | 'phPhone'
  | 'phMessage'
  // Sur-mesure
  | 'smTitle'
  | 'smEyebrow'
  | 'smSubtitle'
  | 'smNeedLogo'
  | 'smNeedUnique'
  | 'smNeedDims'
  | 'smNeedOther'
  | 'smNeedLabel'
  | 'smDescPh'
  | 'smUploadTitle'
  | 'smUploadHint'
  | 'smTip'
  | 'smSubmit'
  | 'smSuccess'
  | 'smProcessEyebrow'
  | 'smStep1Title'
  | 'smStep1Desc'
  | 'smStep2Title'
  | 'smStep2Desc'
  | 'smStep3Title'
  | 'smStep3Desc'
  | 'smAltLink'
  | 'smDefaultDesc'
  // Devis
  | 'dvTitle'
  | 'dvEyebrow'
  | 'dvSubtitle'
  | 'dvNeedBulk'
  | 'dvNeedRestock'
  | 'dvNeedMulti'
  | 'dvNeedOther'
  | 'dvNeedLabel'
  | 'dvDescPh'
  | 'dvUploadTitle'
  | 'dvUploadHint'
  | 'dvTip'
  | 'dvSubmit'
  | 'dvSuccess'
  | 'dvProcessEyebrow'
  | 'dvStep1Title'
  | 'dvStep1Desc'
  | 'dvStep2Title'
  | 'dvStep2Desc'
  | 'dvStep3Title'
  | 'dvStep3Desc'
  | 'dvAltLink'
  | 'dvDefaultDesc'
  // Home
  | 'welcomeStore'
  | 'welcomeShort'
  | 'discoverProducts'
  | 'discoverSelectionMorocco'
  | 'productsTitle'
  | 'learnMore'
  | 'privacyPolicy'
  | 'customProjectTitle'
  | 'customProjectBody'
  | 'bestSellers'
  | 'buyNow'
  | 'trustStripBold'
  | 'emptyPageBlocks'
  | 'mockCatalogHint'
  | 'ourShop'
  | 'personalization'
  | 'artOf'
  | 'surMesureTitle'
  | 'startProject'
  | 'selectedProduct'
  | 'smHomeFallback'
  | 'smHomeDesc'
  | 'customAndQuote'
  | 'customAndQuoteDesc'
  | 'askQuote'
  | 'fastDelivery'
  | 'fastDeliveryDesc'
  | 'securePayment'
  | 'securePaymentDesc'
  | 'qualityGuaranteed'
  | 'qualityGuaranteedDesc'
  | 'ourCategories'
  | 'categoriesIntro'
  | 'seeAllCategories'
  | 'featuredProducts'
  | 'featuredIntro'
  | 'seeAll'
  | 'noFeatured'
  | 'selection'
  | 'selectedProducts'
  | 'seeTheProduct'
  | 'seeAllProducts'
  | 'discoverPlatforms'
  | 'testimonialQuote'
  | 'testimonialAuthor'
  | 'hideCta'
  | 'callToAction'
  // FAQ
  | 'faqTitle'
  | 'faqSubtitle'
  | 'faqSecOrders'
  | 'faqSecShipping'
  | 'faqSecProducts'
  | 'faqSecCustom'
  | 'faqCtaTitle'
  | 'faqCtaDesc'
  // Shipping
  | 'shipEyebrow'
  | 'shipTitle'
  | 'shipIntro'
  | 'shipSectionDelivery'
  | 'shipSectionPayment'
  | 'shipSectionReturns'
  | 'shipContactPrefix'
  | 'shipContactOr'
  | 'shipContactAt'
  // Promo
  | 'backToCheckout'
  | 'promoCodesTitle'
  | 'promoCodesIntro'
  | 'loading'
  | 'noPromoCodes'
  | 'comeBackLater'
  | 'minOrder'
  | 'noMinimum'
  | 'discount'
  | 'expiresOn'
  | 'copied'
  | 'useInCheckout'
  // Blog
  | 'blogTitle'
  | 'blogIntro'
  | 'noArticles'
  | 'readMore'
  | 'article'
  | 'articleNotFound'
  | 'backToBlog'
  // Not found / Index
  | 'notFoundTitle'
  | 'notFoundMessage'
  | 'backHome'
  | 'prevPage'
  | 'nextPage'
  | 'searchNameDesc'
  // Boutique defaults
  | 'shopDefaultTitle'
  | 'shopDefaultSubtitle'
  // Theme home
  | 'everywhereMorocco'
  | 'codOrOnline'
  | 'carefulSelection'
  | 'nArticles'
  | 'dealOfMoment'
  | 'discoverCollection'
  | 'editorial'
  | 'chosenPieces'
  | 'seeWholeShop'
  | 'hotCategories'
  | 'collections'
  | 'tipTitle'
  | 'processTitle'
  | 'phDimensions'
  | 'phQuantity'
  | 'phFullNameForm'
  | 'phAddress'
  | 'phCity'
  | 'phBusinessEmail'
  | 'needTypeRequired';

const fr: Record<ExtraMessageKey, string> = {
  fullName: 'Nom complet',
  phone: 'Téléphone',
  address: 'Adresse',
  city: 'Ville',
  message: 'Votre Message',
  optional: 'optionnel',
  required: 'requis',
  sending: 'Envoi…',
  add: 'Ajouter',
  browse: 'Parcourir',
  select: 'Sélectionnez',
  projectDetails: 'Détails du projet',
  estimatedQty: 'Quantité estimée',
  dimensionsFormat: 'Dimensions / format',
  yourDetails: 'Vos coordonnées',
  description: 'Description',
  newRequest: 'Nouvelle demande',
  requestSent: 'Demande envoyée !',
  thanksContact: 'Merci {name} — {detail}',
  fileTooBig: '{file} dépasse 10 MB',
  sendFailed: "Impossible d'envoyer la demande",
  fieldRequired: '{field} requis',
  contactEyebrow: "Service Client d'Excellence",
  contactTitle: 'Contactez-nous',
  contactIntro:
    "Pour toute demande d'information, conseil personnalisé ou emballage sur-mesure, notre équipe est à votre entière disposition.",
  contactQuickTitle: 'Une réponse rapide',
  contactQuickDesc: 'Joignez-nous par téléphone, e-mail ou messagerie.',
  contactQuickDescLong:
    'Joignez-nous par téléphone, e-mail ou messagerie — nous revenons vers vous rapidement.',
  yourRequest: 'Votre demande',
  sendMessage: 'Envoyer le message',
  messaging: 'Messagerie',
  phFullName: 'M. Jean Dupont',
  phEmail: 'votre@email.com',
  phPhone: '+212 6...',
  phMessage: 'Comment pouvons-nous vous accompagner ?',
  smTitle: 'Sur mesure',
  smEyebrow: 'Création & personnalisation',
  smSubtitle: 'Logo, formats uniques et finitions adaptées à votre marque.',
  smNeedLogo: 'Personnalisation logo',
  smNeedUnique: 'Produit / format unique',
  smNeedDims: 'Dimensions spécifiques',
  smNeedOther: 'Autre projet sur mesure',
  smNeedLabel: 'Type de création *',
  smDescPh: 'Logo, couleurs, finitions, contraintes de production…',
  smUploadTitle: 'Logo ou maquette',
  smUploadHint: 'JPG, PNG, PDF — max 10 Mo (5 fichiers)',
  smTip: 'Joignez votre logo en haute définition (PDF ou PNG) pour un rendu fidèle.',
  smSubmit: 'Envoyer ma demande sur mesure',
  smSuccess: 'notre équipe étudie votre projet sur mesure et vous contacte sous 48h.',
  smProcessEyebrow: 'Votre projet sur mesure en 3 étapes',
  smStep1Title: 'Brief & maquette',
  smStep1Desc: 'Décrivez le produit et envoyez votre logo',
  smStep2Title: 'Proposition',
  smStep2Desc: 'Validation technique et devis associé',
  smStep3Title: 'Production',
  smStep3Desc: 'Fabrication personnalisée puis livraison',
  smAltLink: 'Besoin d’un devis volume ? Demandez un devis →',
  smDefaultDesc: 'Demande sur mesure emballage',
  dvTitle: 'Demande de devis',
  dvEyebrow: 'Tarifs & volumes professionnels',
  dvSubtitle: 'Chiffrage pour commandes en gros, multi-produits et renouvellement de stock.',
  dvNeedBulk: 'Commande en gros',
  dvNeedRestock: 'Renouvellement de stock',
  dvNeedMulti: 'Devis multi-produits',
  dvNeedOther: 'Autre demande de devis',
  dvNeedLabel: 'Type de devis *',
  dvDescPh: 'Volumes, fréquence, délais, budget approximatif, livraison…',
  dvUploadTitle: 'Fichiers utiles (optionnel)',
  dvUploadHint: 'Liste de besoins, cahier des charges — JPG, PNG, PDF',
  dvTip: 'Indiquez le volume mensuel et le délai souhaité pour un chiffrage précis.',
  dvSubmit: 'Envoyer ma demande de devis',
  dvSuccess: 'notre équipe prépare votre devis et vous contacte sous 48h.',
  dvProcessEyebrow: 'Votre devis en 3 étapes',
  dvStep1Title: 'Besoins & volumes',
  dvStep1Desc: 'Catégories, quantités, délais',
  dvStep2Title: 'Devis détaillé',
  dvStep2Desc: 'Réponse sous 48h (WhatsApp / email)',
  dvStep3Title: 'Commande',
  dvStep3Desc: 'Validation puis préparation / livraison',
  dvAltLink: 'Projet personnalisé avec logo ? Sur mesure →',
  dvDefaultDesc: 'Demande de devis emballage',
  welcomeStore: 'Bienvenue dans notre boutique',
  welcomeShort: 'Bienvenue',
  discoverProducts: 'Découvrez nos produits.',
  discoverSelectionMorocco: 'Découvrez une sélection soignée, livrée partout au Maroc.',
  productsTitle: 'Produits',
  learnMore: 'En savoir plus',
  privacyPolicy: 'Politique de confidentialité',
  customProjectTitle: 'Un projet sur-mesure ?',
  customProjectBody: 'Décrivez votre besoin, nous vous répondons sous 24 h.',
  bestSellers: 'Best sellers',
  buyNow: 'Buy',
  trustStripBold: '{name} · Livraison 48h · Retours faciles · Sur-mesure',
  emptyPageBlocks: 'Cette page n’a pas encore de composants.',
  mockCatalogHint: 'Exemple — ajoutez vos données',
  ourShop: 'Notre boutique',
  personalization: 'Personnalisation',
  artOf: "L'Art du",
  surMesureTitle: 'Sur-Mesure',
  startProject: 'Démarrer un Projet',
  selectedProduct: 'Produit sélectionné',
  smHomeFallback: 'Votre marque, votre style. Formats et finitions sur mesure.',
  smHomeDesc: 'Personnalisez avec {name} — logo, dimensions et finitions.',
  customAndQuote: 'Sur mesure & devis',
  customAndQuoteDesc: 'Personnalisez votre emballage ou demandez un devis volume.',
  askQuote: 'Demander un devis',
  fastDelivery: 'Livraison rapide',
  fastDeliveryDesc: 'Livraison gratuite à partir de {n} DH',
  securePayment: 'Paiement sécurisé',
  securePaymentDesc: 'Commandez en confiance — COD ou en ligne.',
  qualityGuaranteed: 'Qualité garantie',
  qualityGuaranteedDesc: 'Des produits soignés pour votre e-commerce.',
  ourCategories: 'Nos catégories',
  categoriesIntro: "Tout l'essentiel pour emballer et expédier.",
  seeAllCategories: 'Voir toutes les catégories',
  featuredProducts: 'Produits sélectionnés',
  featuredIntro: 'Une sélection mise en avant pour vous.',
  seeAll: 'Voir tout',
  noFeatured: 'Aucun produit sélectionné pour le moment.',
  selection: 'Sélection',
  selectedProducts: 'Produits sélectionnés',
  seeTheProduct: 'Voir Le Produit',
  seeAllProducts: 'Voir Tous Les Produits',
  discoverPlatforms: 'Découvrir nos plateformes',
  testimonialQuote: 'Service impeccable et emballages de qualité — je recommande.',
  testimonialAuthor: '— Client e-commerce, Casablanca',
  hideCta: 'Masquer',
  callToAction: "Appel à l'action",
  faqTitle: 'Questions fréquentes',
  faqSubtitle: 'Tout savoir sur les commandes, la livraison et le sur-mesure.',
  faqSecOrders: 'Commandes & paiement',
  faqSecShipping: 'Livraison',
  faqSecProducts: 'Produits & qualité',
  faqSecCustom: 'Sur-mesure & devis',
  faqCtaTitle: "Vous n'avez pas trouvé votre réponse ?",
  faqCtaDesc: 'Notre équipe est disponible pour vous aider.',
  shipEyebrow: 'Service client',
  shipTitle: 'Livraison & Retours',
  shipIntro: "Des conditions claires pour vos commandes d'emballage.",
  shipSectionDelivery: 'Livraison',
  shipSectionPayment: 'Paiement',
  shipSectionReturns: 'Retours',
  shipContactPrefix: 'Contactez-nous',
  shipContactOr: 'ou',
  shipContactAt: 'au',
  backToCheckout: 'Retour au checkout',
  promoCodesTitle: 'Codes Promo',
  promoCodesIntro: 'Copiez un code promo ci-dessous et utilisez-le au paiement.',
  loading: 'Chargement…',
  noPromoCodes: 'Aucun code promo disponible',
  comeBackLater: 'Revenez plus tard pour découvrir nos offres.',
  minOrder: 'Commande minimum',
  noMinimum: 'Aucun minimum',
  discount: 'Réduction',
  expiresOn: 'Expire le {date}',
  copied: 'Copié !',
  useInCheckout: 'Utiliser dans le checkout',
  blogTitle: 'Blog',
  blogIntro: 'Actualités et conseils de {name}.',
  noArticles: 'Aucun article pour le moment.',
  readMore: 'Lire la suite',
  article: 'Article',
  articleNotFound: 'Article introuvable.',
  backToBlog: 'Retour au blog',
  notFoundTitle: 'Page non trouvée',
  notFoundMessage: "La page que vous recherchez n'existe pas ou a été déplacée.",
  backHome: "Retour à l'accueil",
  prevPage: 'Page précédente',
  nextPage: 'Page suivante',
  searchNameDesc: 'Nom ou description…',
  shopDefaultTitle: "Solutions d'emballage",
  shopDefaultSubtitle: 'Sachets, cartons, protections et consommables pour vos envois e-commerce.',
  everywhereMorocco: 'Partout au Maroc',
  codOrOnline: 'COD ou en ligne',
  carefulSelection: 'Sélection soignée',
  nArticles: '{n} articles',
  dealOfMoment: 'Deal du moment',
  discoverCollection: 'Découvrir la collection',
  editorial: 'Éditorial',
  chosenPieces: 'Pièces choisies',
  seeWholeShop: 'Voir toute la boutique',
  hotCategories: 'Catégories hot',
  collections: 'Collections',
  tipTitle: 'Conseil',
  processTitle: 'Processus',
  phDimensions: 'Ex: 25×35 cm, pack 100',
  phQuantity: 'Ex: 500',
  phFullNameForm: 'Nom et prénom',
  phAddress: 'Adresse complète',
  phCity: 'Casablanca, Rabat…',
  phBusinessEmail: 'vous@entreprise.ma',
  needTypeRequired: 'Type de besoin',
};

const ar: Record<ExtraMessageKey, string> = {
  fullName: 'الاسم الكامل',
  phone: 'الهاتف',
  address: 'العنوان',
  city: 'المدينة',
  message: 'رسالتك',
  optional: 'اختياري',
  required: 'مطلوب',
  sending: 'جاري الإرسال…',
  add: 'إضافة',
  browse: 'تصفح',
  select: 'اختر',
  projectDetails: 'تفاصيل المشروع',
  estimatedQty: 'الكمية التقديرية',
  dimensionsFormat: 'الأبعاد / المقاس',
  yourDetails: 'بياناتك',
  description: 'الوصف',
  newRequest: 'طلب جديد',
  requestSent: 'تم إرسال الطلب!',
  thanksContact: 'شكرًا {name} — {detail}',
  fileTooBig: '{file} يتجاوز 10 ميغابايت',
  sendFailed: 'تعذر إرسال الطلب',
  fieldRequired: '{field} مطلوب',
  contactEyebrow: 'خدمة عملاء متميزة',
  contactTitle: 'اتصل بنا',
  contactIntro: 'لأي استفسار أو نصيحة أو تغليف حسب الطلب، فريقنا في خدمتك.',
  contactQuickTitle: 'رد سريع',
  contactQuickDesc: 'تواصل معنا عبر الهاتف أو البريد أو الرسائل.',
  contactQuickDescLong: 'تواصل معنا عبر الهاتف أو البريد أو الرسائل — نرد عليك بسرعة.',
  yourRequest: 'طلبك',
  sendMessage: 'إرسال الرسالة',
  messaging: 'المراسلة',
  phFullName: 'الاسم الكامل',
  phEmail: 'you@email.com',
  phPhone: '+212 6...',
  phMessage: 'كيف يمكننا مساعدتك؟',
  smTitle: 'حسب الطلب',
  smEyebrow: 'إبداع وتخصيص',
  smSubtitle: 'شعار، مقاسات فريدة وتشطيبات تناسب علامتك.',
  smNeedLogo: 'تخصيص الشعار',
  smNeedUnique: 'منتج / مقاس فريد',
  smNeedDims: 'أبعاد محددة',
  smNeedOther: 'مشروع آخر حسب الطلب',
  smNeedLabel: 'نوع الإبداع *',
  smDescPh: 'الشعار، الألوان، التشطيبات، قيود الإنتاج…',
  smUploadTitle: 'الشعار أو الماكيت',
  smUploadHint: 'JPG، PNG، PDF — حد أقصى 10 ميغابايت (5 ملفات)',
  smTip: 'أرفق شعارك بدقة عالية (PDF أو PNG) لنتيجة دقيقة.',
  smSubmit: 'إرسال طلبي حسب الطلب',
  smSuccess: 'يدرس فريقنا مشروعك حسب الطلب ويتواصل معك خلال 48 ساعة.',
  smProcessEyebrow: 'مشروعك حسب الطلب في 3 خطوات',
  smStep1Title: 'الطلب والماكيت',
  smStep1Desc: 'صف المنتج وأرسل شعارك',
  smStep2Title: 'الاقتراح',
  smStep2Desc: 'تحقق تقني وعرض سعر مرتبط',
  smStep3Title: 'الإنتاج',
  smStep3Desc: 'تصنيع مخصص ثم الشحن',
  smAltLink: 'تحتاج عرض سعر للكميات؟ اطلب عرض سعر ←',
  smDefaultDesc: 'طلب تغليف حسب الطلب',
  dvTitle: 'طلب عرض سعر',
  dvEyebrow: 'أسعار وكميات احترافية',
  dvSubtitle: 'تسعير للجملة والمنتجات المتعددة وتجديد المخزون.',
  dvNeedBulk: 'طلب بالجملة',
  dvNeedRestock: 'تجديد المخزون',
  dvNeedMulti: 'عرض سعر متعدد المنتجات',
  dvNeedOther: 'طلب عرض سعر آخر',
  dvNeedLabel: 'نوع عرض السعر *',
  dvDescPh: 'الكميات، التكرار، المواعيد، الميزانية، الشحن…',
  dvUploadTitle: 'ملفات مفيدة (اختياري)',
  dvUploadHint: 'قائمة الاحتياجات — JPG، PNG، PDF',
  dvTip: 'اذكر الحجم الشهري والموعد المطلوب لتسعير دقيق.',
  dvSubmit: 'إرسال طلب عرض السعر',
  dvSuccess: 'يعدّ فريقنا عرض السعر ويتواصل معك خلال 48 ساعة.',
  dvProcessEyebrow: 'عرض السعر في 3 خطوات',
  dvStep1Title: 'الاحتياجات والكميات',
  dvStep1Desc: 'الفئات، الكميات، المواعيد',
  dvStep2Title: 'عرض مفصل',
  dvStep2Desc: 'رد خلال 48 ساعة (واتساب / بريد)',
  dvStep3Title: 'الطلب',
  dvStep3Desc: 'التأكيد ثم التحضير / الشحن',
  dvAltLink: 'مشروع مخصص بشعار؟ حسب الطلب ←',
  dvDefaultDesc: 'طلب عرض سعر تغليف',
  welcomeStore: 'مرحبًا بكم في متجرنا',
  welcomeShort: 'مرحبًا',
  discoverProducts: 'اكتشف منتجاتنا.',
  discoverSelectionMorocco: 'اكتشف تشكيلة مختارة بعناية، مع التوصيل في كل أنحاء المغرب.',
  productsTitle: 'المنتجات',
  learnMore: 'اعرف المزيد',
  privacyPolicy: 'سياسة الخصوصية',
  customProjectTitle: 'مشروع حسب الطلب؟',
  customProjectBody: 'صف احتياجك، نرد عليك خلال 24 ساعة.',
  bestSellers: 'الأكثر مبيعًا',
  buyNow: 'اشترِ',
  trustStripBold: '{name} · توصيل خلال 48 ساعة · إرجاع سهل · حسب الطلب',
  emptyPageBlocks: 'هذه الصفحة لا تحتوي بعد على مكونات.',
  mockCatalogHint: 'مثال — أضف بياناتك',
  ourShop: 'متجرنا',
  personalization: 'التخصيص',
  artOf: 'فن',
  surMesureTitle: 'حسب الطلب',
  startProject: 'ابدأ مشروعًا',
  selectedProduct: 'منتج مختار',
  smHomeFallback: 'علامتك، أسلوبك. مقاسات وتشطيبات حسب الطلب.',
  smHomeDesc: 'خصّص مع {name} — شعار وأبعاد وتشطيبات.',
  customAndQuote: 'حسب الطلب وعرض السعر',
  customAndQuoteDesc: 'خصّص تغليفك أو اطلب عرض سعر للكميات.',
  askQuote: 'اطلب عرض سعر',
  fastDelivery: 'شحن سريع',
  fastDeliveryDesc: 'شحن مجاني ابتداءً من {n} درهم',
  securePayment: 'دفع آمن',
  securePaymentDesc: 'اطلب بثقة — عند الاستلام أو عبر الإنترنت.',
  qualityGuaranteed: 'جودة مضمونة',
  qualityGuaranteedDesc: 'منتجات بعناية لتجارتك الإلكترونية.',
  ourCategories: 'فئاتنا',
  categoriesIntro: 'كل ما تحتاجه للتغليف والشحن.',
  seeAllCategories: 'عرض كل الفئات',
  featuredProducts: 'منتجات مختارة',
  featuredIntro: 'اختيار مميز من أجلك.',
  seeAll: 'عرض الكل',
  noFeatured: 'لا توجد منتجات مختارة حاليًا.',
  selection: 'اختيار',
  selectedProducts: 'منتجات مختارة',
  seeTheProduct: 'عرض المنتج',
  seeAllProducts: 'عرض كل المنتجات',
  discoverPlatforms: 'اكتشف منصاتنا',
  testimonialQuote: 'خدمة ممتازة وتغليف عالي الجودة — أنصح به.',
  testimonialAuthor: '— عميل تجارة إلكترونية، الدار البيضاء',
  hideCta: 'إخفاء',
  callToAction: 'دعوة لاتخاذ إجراء',
  faqTitle: 'الأسئلة الشائعة',
  faqSubtitle: 'كل ما يخص الطلبات والشحن وحسب الطلب.',
  faqSecOrders: 'الطلبات والدفع',
  faqSecShipping: 'الشحن',
  faqSecProducts: 'المنتجات والجودة',
  faqSecCustom: 'حسب الطلب وعروض الأسعار',
  faqCtaTitle: 'لم تجد إجابتك؟',
  faqCtaDesc: 'فريقنا متاح لمساعدتك.',
  shipEyebrow: 'خدمة العملاء',
  shipTitle: 'الشحن والإرجاع',
  shipIntro: 'شروط واضحة لطلبات التغليف.',
  shipSectionDelivery: 'الشحن',
  shipSectionPayment: 'الدفع',
  shipSectionReturns: 'الإرجاع',
  shipContactPrefix: 'تواصل معنا',
  shipContactOr: 'أو',
  shipContactAt: 'على',
  backToCheckout: 'العودة للدفع',
  promoCodesTitle: 'أكواد الخصم',
  promoCodesIntro: 'انسخ كود خصم واستخدمه عند الدفع.',
  loading: 'جاري التحميل…',
  noPromoCodes: 'لا تتوفر أكواد خصم',
  comeBackLater: 'عد لاحقًا لاكتشاف عروضنا.',
  minOrder: 'حد أدنى للطلب',
  noMinimum: 'بدون حد أدنى',
  discount: 'خصم',
  expiresOn: 'ينتهي في {date}',
  copied: 'تم النسخ!',
  useInCheckout: 'استخدم في الدفع',
  blogTitle: 'المدونة',
  blogIntro: 'أخبار ونصائح من {name}.',
  noArticles: 'لا توجد مقالات حاليًا.',
  readMore: 'اقرأ المزيد',
  article: 'مقال',
  articleNotFound: 'المقال غير موجود.',
  backToBlog: 'العودة للمدونة',
  notFoundTitle: 'الصفحة غير موجودة',
  notFoundMessage: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  backHome: 'العودة للرئيسية',
  prevPage: 'الصفحة السابقة',
  nextPage: 'الصفحة التالية',
  searchNameDesc: 'الاسم أو الوصف…',
  shopDefaultTitle: 'حلول التغليف',
  shopDefaultSubtitle: 'أكياس وكراتين وحمايات لمشتريات التجارة الإلكترونية.',
  everywhereMorocco: 'في كل المغرب',
  codOrOnline: 'عند الاستلام أو عبر الإنترنت',
  carefulSelection: 'اختيار دقيق',
  nArticles: '{n} منتجات',
  dealOfMoment: 'عرض اللحظة',
  discoverCollection: 'اكتشف المجموعة',
  editorial: 'افتتاحية',
  chosenPieces: 'قطع مختارة',
  seeWholeShop: 'عرض المتجر بالكامل',
  hotCategories: 'فئات رائجة',
  collections: 'المجموعات',
  tipTitle: 'نصيحة',
  processTitle: 'العملية',
  phDimensions: 'مثال: 25×35 سم، عبوة 100',
  phQuantity: 'مثال: 500',
  phFullNameForm: 'الاسم واللقب',
  phAddress: 'العنوان الكامل',
  phCity: 'الدار البيضاء، الرباط…',
  phBusinessEmail: 'you@company.ma',
  needTypeRequired: 'نوع الحاجة',
};

const en: Record<ExtraMessageKey, string> = {
  fullName: 'Full name',
  phone: 'Phone',
  address: 'Address',
  city: 'City',
  message: 'Your message',
  optional: 'optional',
  required: 'required',
  sending: 'Sending…',
  add: 'Add',
  browse: 'Browse',
  select: 'Select',
  projectDetails: 'Project details',
  estimatedQty: 'Estimated quantity',
  dimensionsFormat: 'Dimensions / format',
  yourDetails: 'Your details',
  description: 'Description',
  newRequest: 'New request',
  requestSent: 'Request sent!',
  thanksContact: 'Thank you {name} — {detail}',
  fileTooBig: '{file} exceeds 10 MB',
  sendFailed: 'Could not send the request',
  fieldRequired: '{field} is required',
  contactEyebrow: 'Excellent customer service',
  contactTitle: 'Contact us',
  contactIntro:
    'For information, advice or custom packaging, our team is here to help.',
  contactQuickTitle: 'A quick reply',
  contactQuickDesc: 'Reach us by phone, email or messaging.',
  contactQuickDescLong: 'Reach us by phone, email or messaging — we get back to you quickly.',
  yourRequest: 'Your request',
  sendMessage: 'Send message',
  messaging: 'Messaging',
  phFullName: 'John Doe',
  phEmail: 'you@email.com',
  phPhone: '+212 6...',
  phMessage: 'How can we help you?',
  smTitle: 'Custom order',
  smEyebrow: 'Creation & personalization',
  smSubtitle: 'Logo, unique formats and finishes tailored to your brand.',
  smNeedLogo: 'Logo personalization',
  smNeedUnique: 'Unique product / format',
  smNeedDims: 'Specific dimensions',
  smNeedOther: 'Other custom project',
  smNeedLabel: 'Creation type *',
  smDescPh: 'Logo, colors, finishes, production constraints…',
  smUploadTitle: 'Logo or mockup',
  smUploadHint: 'JPG, PNG, PDF — max 10 MB (5 files)',
  smTip: 'Attach a high-resolution logo (PDF or PNG) for a faithful result.',
  smSubmit: 'Send my custom request',
  smSuccess: 'our team reviews your custom project and contacts you within 48h.',
  smProcessEyebrow: 'Your custom project in 3 steps',
  smStep1Title: 'Brief & mockup',
  smStep1Desc: 'Describe the product and send your logo',
  smStep2Title: 'Proposal',
  smStep2Desc: 'Technical validation and related quote',
  smStep3Title: 'Production',
  smStep3Desc: 'Custom manufacturing then delivery',
  smAltLink: 'Need a volume quote? Request a quote →',
  smDefaultDesc: 'Custom packaging request',
  dvTitle: 'Quote request',
  dvEyebrow: 'Professional rates & volumes',
  dvSubtitle: 'Pricing for bulk, multi-product and restocking orders.',
  dvNeedBulk: 'Bulk order',
  dvNeedRestock: 'Stock renewal',
  dvNeedMulti: 'Multi-product quote',
  dvNeedOther: 'Other quote request',
  dvNeedLabel: 'Quote type *',
  dvDescPh: 'Volumes, frequency, deadlines, budget, delivery…',
  dvUploadTitle: 'Useful files (optional)',
  dvUploadHint: 'Needs list, brief — JPG, PNG, PDF',
  dvTip: 'Share monthly volume and desired timeline for accurate pricing.',
  dvSubmit: 'Send my quote request',
  dvSuccess: 'our team prepares your quote and contacts you within 48h.',
  dvProcessEyebrow: 'Your quote in 3 steps',
  dvStep1Title: 'Needs & volumes',
  dvStep1Desc: 'Categories, quantities, deadlines',
  dvStep2Title: 'Detailed quote',
  dvStep2Desc: 'Reply within 48h (WhatsApp / email)',
  dvStep3Title: 'Order',
  dvStep3Desc: 'Validation then prep / delivery',
  dvAltLink: 'Custom project with logo? Custom order →',
  dvDefaultDesc: 'Packaging quote request',
  welcomeStore: 'Welcome to our store',
  welcomeShort: 'Welcome',
  discoverProducts: 'Discover our products.',
  discoverSelectionMorocco: 'Discover a carefully curated selection, delivered across Morocco.',
  productsTitle: 'Products',
  learnMore: 'Learn more',
  privacyPolicy: 'Privacy policy',
  customProjectTitle: 'A custom project?',
  customProjectBody: 'Tell us what you need — we reply within 24 hours.',
  bestSellers: 'Best sellers',
  buyNow: 'Buy',
  trustStripBold: '{name} · 48h delivery · Easy returns · Made to order',
  emptyPageBlocks: 'This page has no blocks yet.',
  mockCatalogHint: 'Sample — add your data',
  ourShop: 'Our shop',
  personalization: 'Personalization',
  artOf: 'The art of',
  surMesureTitle: 'Custom',
  startProject: 'Start a project',
  selectedProduct: 'Selected product',
  smHomeFallback: 'Your brand, your style. Custom formats and finishes.',
  smHomeDesc: 'Customize with {name} — logo, dimensions and finishes.',
  customAndQuote: 'Custom & quote',
  customAndQuoteDesc: 'Customize your packaging or request a volume quote.',
  askQuote: 'Request a quote',
  fastDelivery: 'Fast delivery',
  fastDeliveryDesc: 'Free shipping from {n} MAD',
  securePayment: 'Secure payment',
  securePaymentDesc: 'Order with confidence — COD or online.',
  qualityGuaranteed: 'Quality guaranteed',
  qualityGuaranteedDesc: 'Carefully made products for your e-commerce.',
  ourCategories: 'Our categories',
  categoriesIntro: 'Everything you need to pack and ship.',
  seeAllCategories: 'See all categories',
  featuredProducts: 'Featured products',
  featuredIntro: 'A selection highlighted for you.',
  seeAll: 'See all',
  noFeatured: 'No featured products yet.',
  selection: 'Selection',
  selectedProducts: 'Selected products',
  seeTheProduct: 'View product',
  seeAllProducts: 'View all products',
  discoverPlatforms: 'Discover our platforms',
  testimonialQuote: 'Impeccable service and quality packaging — highly recommend.',
  testimonialAuthor: '— E-commerce client, Casablanca',
  hideCta: 'Hide',
  callToAction: 'Call to action',
  faqTitle: 'Frequently asked questions',
  faqSubtitle: 'Everything about orders, shipping and custom work.',
  faqSecOrders: 'Orders & payment',
  faqSecShipping: 'Shipping',
  faqSecProducts: 'Products & quality',
  faqSecCustom: 'Custom & quotes',
  faqCtaTitle: "Didn't find your answer?",
  faqCtaDesc: 'Our team is available to help.',
  shipEyebrow: 'Customer service',
  shipTitle: 'Shipping & returns',
  shipIntro: 'Clear terms for your packaging orders.',
  shipSectionDelivery: 'Shipping',
  shipSectionPayment: 'Payment',
  shipSectionReturns: 'Returns',
  shipContactPrefix: 'Contact us',
  shipContactOr: 'or',
  shipContactAt: 'at',
  backToCheckout: 'Back to checkout',
  promoCodesTitle: 'Promo codes',
  promoCodesIntro: 'Copy a promo code below and use it at checkout.',
  loading: 'Loading…',
  noPromoCodes: 'No promo codes available',
  comeBackLater: 'Come back later for our offers.',
  minOrder: 'Minimum order',
  noMinimum: 'No minimum',
  discount: 'Discount',
  expiresOn: 'Expires on {date}',
  copied: 'Copied!',
  useInCheckout: 'Use at checkout',
  blogTitle: 'Blog',
  blogIntro: 'News and tips from {name}.',
  noArticles: 'No articles yet.',
  readMore: 'Read more',
  article: 'Article',
  articleNotFound: 'Article not found.',
  backToBlog: 'Back to blog',
  notFoundTitle: 'Page not found',
  notFoundMessage: 'The page you are looking for does not exist or was moved.',
  backHome: 'Back to home',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  searchNameDesc: 'Name or description…',
  shopDefaultTitle: 'Packaging solutions',
  shopDefaultSubtitle: 'Bags, boxes, protection and supplies for e-commerce shipments.',
  everywhereMorocco: 'Across Morocco',
  codOrOnline: 'COD or online',
  carefulSelection: 'Careful selection',
  nArticles: '{n} items',
  dealOfMoment: 'Deal of the moment',
  discoverCollection: 'Discover the collection',
  editorial: 'Editorial',
  chosenPieces: 'Chosen pieces',
  seeWholeShop: 'See the whole shop',
  hotCategories: 'Hot categories',
  collections: 'Collections',
  tipTitle: 'Tip',
  processTitle: 'Process',
  phDimensions: 'e.g. 25×35 cm, pack of 100',
  phQuantity: 'e.g. 500',
  phFullNameForm: 'First and last name',
  phAddress: 'Full address',
  phCity: 'Casablanca, Rabat…',
  phBusinessEmail: 'you@company.ma',
  needTypeRequired: 'Need type',
};

export const storefrontExtra: Record<StoreLocale, Record<ExtraMessageKey, string>> = {
  fr,
  ar,
  en,
};
