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
  | 'import.again';

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
};

export const importAdminExtra: Record<StoreLocale, Record<ImportAdminMessageKey, string>> = { fr, en, ar };
