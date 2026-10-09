import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n de l'import de produits (CSV). */
export type ImportAdminMessageKey =
  | 'import.button'
  | 'import.title'
  | 'import.description'
  | 'import.step.file'
  | 'import.template'
  | 'import.pick'
  | 'import.hint'
  | 'import.readError'
  | 'import.missing'
  | 'import.step.preview'
  | 'import.summary'
  | 'import.ignored'
  | 'import.truncated'
  | 'import.col.line'
  | 'import.col.name'
  | 'import.col.price'
  | 'import.col.category'
  | 'import.col.stock'
  | 'import.col.status'
  | 'import.err.name'
  | 'import.err.price'
  | 'import.err.duplicate'
  | 'import.ok'
  | 'import.defaultCategory'
  | 'import.start'
  | 'import.running'
  | 'import.done'
  | 'import.failed'
  | 'import.seeProducts'
  | 'import.again'
  | 'ig.button'
  | 'ig.title'
  | 'ig.description'
  | 'ig.links.label'
  | 'ig.links.placeholder'
  | 'ig.links.import'
  | 'ig.upload.label'
  | 'ig.upload.caption'
  | 'ig.upload.pick'
  | 'ig.upload.add'
  | 'ig.upload.photos'
  | 'ig.summary'
  | 'ig.review.title'
  | 'ig.empty'
  | 'ig.field.name'
  | 'ig.field.price'
  | 'ig.field.stock'
  | 'ig.field.category'
  | 'ig.noCategory'
  | 'ig.issue.name'
  | 'ig.issue.price'
  | 'ig.issue.category'
  | 'ig.issue.image'
  | 'ig.ai'
  | 'ig.defaultCategory'
  | 'ig.selectAll'
  | 'ig.discard'
  | 'ig.publish'
  | 'ig.publishing'
  | 'ig.published'
  | 'ig.publishFailed'
  | 'ig.seeProducts'
  | 'ig.error';

const fr: Record<ImportAdminMessageKey, string> = {
  'import.button': 'Importer (CSV)',
  'import.title': 'Importer des produits',
  'import.description': 'Ajoutez plusieurs produits d’un coup depuis un fichier CSV : modèle Get STORE, export Shopify, WooCommerce ou YouCan, ou tableur.',
  'import.step.file': '1. Choisissez votre fichier',
  'import.template': 'Télécharger le modèle',
  'import.pick': 'Choisir un fichier CSV',
  'import.hint': 'Colonnes reconnues : nom, prix, catégorie, stock, sku, description. Les photos ne sont pas importées : ajoutez-les ensuite, une image par défaut s’affiche en attendant.',
  'import.readError': 'Fichier illisible. Enregistrez-le au format CSV (UTF-8) et réessayez.',
  'import.missing': 'Colonne obligatoire absente : {cols}. Vérifiez la première ligne du fichier.',
  'import.step.preview': '2. Vérifiez l’aperçu',
  'import.summary': '{ok} produit(s) prêt(s), {bad} ligne(s) à corriger, {dup} déjà présent(s).',
  'import.ignored': 'Colonnes ignorées : {cols}',
  'import.truncated': 'Seules les {max} premières lignes sont importées.',
  'import.col.line': 'Ligne',
  'import.col.name': 'Nom',
  'import.col.price': 'Prix',
  'import.col.category': 'Catégorie',
  'import.col.stock': 'Stock',
  'import.col.status': 'État',
  'import.err.name': 'Nom invalide',
  'import.err.price': 'Prix invalide',
  'import.err.duplicate': 'Déjà présent',
  'import.ok': 'Prêt',
  'import.defaultCategory': 'Divers',
  'import.start': 'Importer {n} produit(s)',
  'import.running': 'Import en cours… {done}/{total}',
  'import.done': '{n} produit(s) importé(s) ✅',
  'import.failed': '{n} échec(s) : {first}',
  'import.seeProducts': 'Voir les produits',
  'import.again': 'Importer un autre fichier',
  'ig.button': 'Importer depuis Instagram',
  'ig.title': 'Importer depuis Instagram',
  'ig.description': 'Collez des liens de posts ou envoyez vos photos : chaque post devient un brouillon à relire, puis publiez tout en un clic.',
  'ig.links.label': 'Liens de posts Instagram (un par ligne)',
  'ig.links.placeholder': 'https://www.instagram.com/p/…',
  'ig.links.import': 'Importer les liens',
  'ig.upload.label': 'Ou envoyez les photos et la légende d\'un post',
  'ig.upload.caption': 'Collez la légende du post (nom, prix, description…)',
  'ig.upload.pick': 'Choisir des photos',
  'ig.upload.add': 'Ajouter ce post',
  'ig.upload.photos': '{n} photo(s) prête(s)',
  'ig.summary': '{created} brouillon(s) créé(s), {dup} déjà importé(s), {bad} refusé(s).',
  'ig.review.title': 'À relire avant publication',
  'ig.empty': 'Aucun brouillon en attente.',
  'ig.field.name': 'Nom',
  'ig.field.price': 'Prix (DH)',
  'ig.field.stock': 'Stock',
  'ig.field.category': 'Catégorie',
  'ig.noCategory': '— Choisir —',
  'ig.issue.name': 'Nom manquant',
  'ig.issue.price': 'Prix manquant',
  'ig.issue.category': 'Catégorie manquante',
  'ig.issue.image': 'Sans photo',
  'ig.ai': 'Rempli par l\'IA',
  'ig.defaultCategory': 'Catégorie par défaut pour les brouillons sans catégorie',
  'ig.selectAll': 'Tout sélectionner',
  'ig.discard': 'Écarter',
  'ig.publish': 'Publier {n} produit(s)',
  'ig.publishing': 'Publication…',
  'ig.published': '{n} produit(s) publié(s).',
  'ig.publishFailed': '{n} non publié(s) : {first}',
  'ig.seeProducts': 'Voir les produits',
  'ig.error': 'Opération impossible, réessayez.',
};

const en: Record<ImportAdminMessageKey, string> = {
  'import.button': 'Import (CSV)',
  'import.title': 'Import products',
  'import.description': 'Add many products at once from a CSV file: Get STORE template, Shopify, WooCommerce or YouCan export, or a spreadsheet.',
  'import.step.file': '1. Choose your file',
  'import.template': 'Download the template',
  'import.pick': 'Choose a CSV file',
  'import.hint': 'Recognised columns: name, price, category, stock, sku, description. Photos are not imported: add them afterwards, a default image is shown meanwhile.',
  'import.readError': 'Unreadable file. Save it as CSV (UTF-8) and try again.',
  'import.missing': 'Required column missing: {cols}. Check the first line of the file.',
  'import.step.preview': '2. Check the preview',
  'import.summary': '{ok} product(s) ready, {bad} line(s) to fix, {dup} already present.',
  'import.ignored': 'Ignored columns: {cols}',
  'import.truncated': 'Only the first {max} lines are imported.',
  'import.col.line': 'Line',
  'import.col.name': 'Name',
  'import.col.price': 'Price',
  'import.col.category': 'Category',
  'import.col.stock': 'Stock',
  'import.col.status': 'Status',
  'import.err.name': 'Invalid name',
  'import.err.price': 'Invalid price',
  'import.err.duplicate': 'Already present',
  'import.ok': 'Ready',
  'import.defaultCategory': 'Miscellaneous',
  'import.start': 'Import {n} product(s)',
  'import.running': 'Importing… {done}/{total}',
  'import.done': '{n} product(s) imported ✅',
  'import.failed': '{n} failure(s): {first}',
  'import.seeProducts': 'View products',
  'import.again': 'Import another file',
  'ig.button': 'Import from Instagram',
  'ig.title': 'Import from Instagram',
  'ig.description': 'Paste post links or upload your photos: each post becomes a draft to review, then publish everything in one click.',
  'ig.links.label': 'Instagram post links (one per line)',
  'ig.links.placeholder': 'https://www.instagram.com/p/…',
  'ig.links.import': 'Import links',
  'ig.upload.label': 'Or upload a post\'s photos and caption',
  'ig.upload.caption': 'Paste the post caption (name, price, description…)',
  'ig.upload.pick': 'Choose photos',
  'ig.upload.add': 'Add this post',
  'ig.upload.photos': '{n} photo(s) ready',
  'ig.summary': '{created} draft(s) created, {dup} already imported, {bad} rejected.',
  'ig.review.title': 'To review before publishing',
  'ig.empty': 'No pending drafts.',
  'ig.field.name': 'Name',
  'ig.field.price': 'Price (MAD)',
  'ig.field.stock': 'Stock',
  'ig.field.category': 'Category',
  'ig.noCategory': '— Choose —',
  'ig.issue.name': 'Name missing',
  'ig.issue.price': 'Price missing',
  'ig.issue.category': 'Category missing',
  'ig.issue.image': 'No photo',
  'ig.ai': 'Filled by AI',
  'ig.defaultCategory': 'Default category for drafts without one',
  'ig.selectAll': 'Select all',
  'ig.discard': 'Discard',
  'ig.publish': 'Publish {n} product(s)',
  'ig.publishing': 'Publishing…',
  'ig.published': '{n} product(s) published.',
  'ig.publishFailed': '{n} not published: {first}',
  'ig.seeProducts': 'See products',
  'ig.error': 'Operation failed, please retry.',
};

const ar: Record<ImportAdminMessageKey, string> = {
  'import.button': 'استيراد (CSV)',
  'import.title': 'استيراد المنتجات',
  'import.description': 'أضف عدة منتجات دفعة واحدة من ملف CSV: نموذج Get STORE أو تصدير Shopify أو WooCommerce أو YouCan أو جدول بيانات.',
  'import.step.file': '1. اختر ملفك',
  'import.template': 'تنزيل النموذج',
  'import.pick': 'اختيار ملف CSV',
  'import.hint': 'الأعمدة المعتمدة: الاسم والسعر والفئة والمخزون وsku والوصف. لا تُستورد الصور: أضفها لاحقًا وتظهر صورة افتراضية في الأثناء.',
  'import.readError': 'ملف غير قابل للقراءة. احفظه بصيغة CSV (UTF-8) وأعد المحاولة.',
  'import.missing': 'عمود إلزامي مفقود: {cols}. تحقق من السطر الأول في الملف.',
  'import.step.preview': '2. تحقق من المعاينة',
  'import.summary': '{ok} منتج جاهز، {bad} سطر يحتاج تصحيحًا، {dup} موجود مسبقًا.',
  'import.ignored': 'أعمدة متجاهَلة: {cols}',
  'import.truncated': 'يتم استيراد أول {max} سطرًا فقط.',
  'import.col.line': 'السطر',
  'import.col.name': 'الاسم',
  'import.col.price': 'السعر',
  'import.col.category': 'الفئة',
  'import.col.stock': 'المخزون',
  'import.col.status': 'الحالة',
  'import.err.name': 'اسم غير صالح',
  'import.err.price': 'سعر غير صالح',
  'import.err.duplicate': 'موجود مسبقًا',
  'import.ok': 'جاهز',
  'import.defaultCategory': 'متفرقات',
  'import.start': 'استيراد {n} منتج',
  'import.running': 'جارٍ الاستيراد… {done}/{total}',
  'import.done': 'تم استيراد {n} منتج ✅',
  'import.failed': '{n} إخفاق: {first}',
  'import.seeProducts': 'عرض المنتجات',
  'import.again': 'استيراد ملف آخر',
  'ig.button': 'استيراد من إنستغرام',
  'ig.title': 'استيراد من إنستغرام',
  'ig.description': 'الصق روابط المنشورات أو ارفع صورك: كل منشور يصبح مسودة للمراجعة ثم انشر الكل بنقرة واحدة.',
  'ig.links.label': 'روابط منشورات إنستغرام (رابط في كل سطر)',
  'ig.links.placeholder': 'https://www.instagram.com/p/…',
  'ig.links.import': 'استيراد الروابط',
  'ig.upload.label': 'أو ارفع صور المنشور وتعليقه',
  'ig.upload.caption': 'الصق تعليق المنشور (الاسم، السعر، الوصف…)',
  'ig.upload.pick': 'اختيار الصور',
  'ig.upload.add': 'إضافة هذا المنشور',
  'ig.upload.photos': '{n} صورة جاهزة',
  'ig.summary': 'تم إنشاء {created} مسودة، {dup} مستوردة سابقًا، {bad} مرفوضة.',
  'ig.review.title': 'للمراجعة قبل النشر',
  'ig.empty': 'لا توجد مسودات.',
  'ig.field.name': 'الاسم',
  'ig.field.price': 'السعر (د.م)',
  'ig.field.stock': 'المخزون',
  'ig.field.category': 'الفئة',
  'ig.noCategory': '— اختر —',
  'ig.issue.name': 'الاسم مفقود',
  'ig.issue.price': 'السعر مفقود',
  'ig.issue.category': 'الفئة مفقودة',
  'ig.issue.image': 'بدون صورة',
  'ig.ai': 'مملوء بالذكاء الاصطناعي',
  'ig.defaultCategory': 'فئة افتراضية للمسودات بدون فئة',
  'ig.selectAll': 'تحديد الكل',
  'ig.discard': 'استبعاد',
  'ig.publish': 'نشر {n} منتج',
  'ig.publishing': 'جارٍ النشر…',
  'ig.published': 'تم نشر {n} منتج.',
  'ig.publishFailed': '{n} لم يُنشر: {first}',
  'ig.seeProducts': 'عرض المنتجات',
  'ig.error': 'تعذر تنفيذ العملية، حاول مجددًا.',
};

export const importAdminExtra: Record<StoreLocale, Record<ImportAdminMessageKey, string>> = { fr, en, ar };
