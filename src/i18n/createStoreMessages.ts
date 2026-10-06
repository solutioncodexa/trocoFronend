/** Textes de la page « Créer ma boutique » (fr / en / ar). La langue choisie ici est aussi celle de l'admin. */
import type { AdminLocale } from '@/i18n/admin/adminMessages';

export type CreateStoreKey =
  | 'back'
  | 'title'
  | 'subtitle'
  | 'name.label'
  | 'name.placeholder'
  | 'name.required'
  | 'sector.label'
  | 'sector.hint'
  | 'sector.mode'
  | 'sector.beaute'
  | 'sector.alimentation'
  | 'sector.maison'
  | 'sector.electronique'
  | 'sector.artisanat'
  | 'sector.traditionnel'
  | 'sector.naturel'
  | 'sector.patisserie'
  | 'sector.general'
  | 'email.label'
  | 'email.invalid'
  | 'password.label'
  | 'password.hint'
  | 'password.short'
  | 'password.show'
  | 'password.hide'
  | 'url.label'
  | 'url.edit'
  | 'url.slugLabel'
  | 'url.empty'
  | 'url.taken'
  | 'url.invalid'
  | 'url.use'
  | 'url.short'
  | 'url.format'
  | 'more'
  | 'less'
  | 'fullName.label'
  | 'phone.label'
  | 'submit'
  | 'submitting'
  | 'trial'
  | 'plan.named'
  | 'plan.fallback'
  | 'login.prompt'
  | 'login.link'
  | 'fix'
  | 'created.pending'
  | 'created.trial'
  | 'created.login'
  | 'failed';

type Dict = Record<CreateStoreKey, string>;

const fr: Dict = {
  back: 'Retour Get STORE',
  title: 'Créer ma boutique',
  subtitle: 'Essai gratuit de {days} jours, sans carte bancaire — en ligne en 3 minutes',
  'name.label': 'Nom de la boutique',
  'name.placeholder': 'Ex. Maison Atlas',
  'name.required': 'Indiquez le nom de votre boutique.',
  'sector.label': 'Que vendez-vous ? (optionnel)',
  'sector.hint': 'Nous préparons le design, les catégories et des produits d’exemple adaptés.',
  'sector.mode': 'Mode & vêtements',
  'sector.beaute': 'Beauté & cosmétiques',
  'sector.alimentation': 'Alimentation & épicerie fine',
  'sector.maison': 'Maison & déco',
  'sector.electronique': 'High-tech & accessoires',
  'sector.artisanat': "Artisanat marocain",
  'sector.traditionnel': "Caftans & tenues traditionnelles",
  'sector.naturel': "Cosmétiques naturels & hammam",
  'sector.patisserie': "Pâtisseries & traiteur",
  'sector.general': 'Boutique généraliste',
  'email.label': 'Votre email',
  'email.invalid': 'Saisissez une adresse email valide.',
  'password.label': 'Mot de passe',
  'password.hint': 'Minimum 8 caractères',
  'password.short': 'Le mot de passe doit contenir au moins 8 caractères.',
  'password.show': 'Afficher le mot de passe',
  'password.hide': 'Masquer le mot de passe',
  'url.label': 'Adresse de votre boutique',
  'url.edit': 'Modifier',
  'url.slugLabel': 'Adresse (lettres, chiffres, tirets)',
  'url.empty': 'Votre adresse apparaîtra ici dès que vous aurez saisi un nom',
  'url.taken': 'Cette adresse est déjà prise.',
  'url.invalid': 'Adresse invalide (3 caractères minimum : lettres, chiffres, tirets).',
  'url.use': 'Utiliser « {slug} »',
  'url.short': 'L’adresse doit contenir au moins 3 caractères.',
  'url.format': 'Utilisez uniquement des lettres, chiffres et tirets (sans tiret au début ou à la fin).',
  more: 'Plus d’options',
  less: 'Moins d’options',
  'fullName.label': 'Votre nom (optionnel)',
  'phone.label': 'Téléphone / WhatsApp (optionnel)',
  submit: 'Lancer ma boutique',
  submitting: 'Création…',
  trial: '{days} jours d’essai gratuit, puis {plan} — vous pourrez changer de plan à tout moment.',
  'plan.named': 'plan {plan}',
  'plan.fallback': 'le plan choisi',
  'login.prompt': 'Déjà un compte ?',
  'login.link': 'Connexion admin',
  fix: 'Corrigez les champs indiqués en rouge',
  'created.pending': 'Boutique « {name} » créée — en attente d’activation Get STORE',
  'created.trial': 'Boutique « {name} » créée — essai gratuit de {days} jours démarré',
  'created.login': 'Boutique créée. Connectez-vous avec {email}',
  failed: 'Impossible de créer la boutique',
};

const en: Dict = {
  back: 'Back to Get STORE',
  title: 'Create my store',
  subtitle: '{days}-day free trial, no credit card — online in 3 minutes',
  'name.label': 'Store name',
  'name.placeholder': 'E.g. Maison Atlas',
  'name.required': 'Enter your store name.',
  'sector.label': 'What do you sell? (optional)',
  'sector.hint': 'We prepare a matching design, categories and sample products.',
  'sector.mode': 'Fashion & clothing',
  'sector.beaute': 'Beauty & cosmetics',
  'sector.alimentation': 'Food & delicatessen',
  'sector.maison': 'Home & decor',
  'sector.electronique': 'Tech & accessories',
  'sector.artisanat': "Moroccan crafts",
  'sector.traditionnel': "Kaftans & traditional wear",
  'sector.naturel': "Natural cosmetics & hammam",
  'sector.patisserie': "Pastries & catering",
  'sector.general': 'General store',
  'email.label': 'Your email',
  'email.invalid': 'Enter a valid email address.',
  'password.label': 'Password',
  'password.hint': 'At least 8 characters',
  'password.short': 'The password must be at least 8 characters long.',
  'password.show': 'Show password',
  'password.hide': 'Hide password',
  'url.label': 'Your store address',
  'url.edit': 'Edit',
  'url.slugLabel': 'Address (letters, digits, hyphens)',
  'url.empty': 'Your address will appear here once you enter a name',
  'url.taken': 'This address is already taken.',
  'url.invalid': 'Invalid address (3 characters minimum: letters, digits, hyphens).',
  'url.use': 'Use “{slug}”',
  'url.short': 'The address must be at least 3 characters long.',
  'url.format': 'Use only letters, digits and hyphens (no hyphen at the start or end).',
  more: 'More options',
  less: 'Fewer options',
  'fullName.label': 'Your name (optional)',
  'phone.label': 'Phone / WhatsApp (optional)',
  submit: 'Launch my store',
  submitting: 'Creating…',
  trial: '{days}-day free trial, then {plan} — you can change plan at any time.',
  'plan.named': 'the {plan} plan',
  'plan.fallback': 'your chosen plan',
  'login.prompt': 'Already have an account?',
  'login.link': 'Admin login',
  fix: 'Fix the fields marked in red',
  'created.pending': 'Store “{name}” created — waiting for Get STORE activation',
  'created.trial': 'Store “{name}” created — {days}-day free trial started',
  'created.login': 'Store created. Sign in with {email}',
  failed: 'Could not create the store',
};

const ar: Dict = {
  back: 'العودة إلى Get STORE',
  title: 'أنشئ متجري',
  subtitle: 'تجربة مجانية لمدة {days} يومًا دون بطاقة بنكية — متجرك جاهز في 3 دقائق',
  'name.label': 'اسم المتجر',
  'name.placeholder': 'مثال: Maison Atlas',
  'name.required': 'أدخل اسم متجرك.',
  'sector.label': 'ماذا تبيع؟ (اختياري)',
  'sector.hint': 'نجهّز لك تصميمًا وفئات ومنتجات تجريبية مناسبة.',
  'sector.mode': 'الأزياء والملابس',
  'sector.beaute': 'التجميل والعناية',
  'sector.alimentation': 'المواد الغذائية',
  'sector.maison': 'المنزل والديكور',
  'sector.electronique': 'التكنولوجيا والإكسسوارات',
  'sector.artisanat': "الصناعة التقليدية المغربية",
  'sector.traditionnel': "القفاطين والأزياء التقليدية",
  'sector.naturel': "مستحضرات طبيعية وحمام",
  'sector.patisserie': "حلويات وخدمات الطعام",
  'sector.general': 'متجر عام',
  'email.label': 'بريدك الإلكتروني',
  'email.invalid': 'أدخل بريدًا إلكترونيًا صالحًا.',
  'password.label': 'كلمة المرور',
  'password.hint': '8 أحرف على الأقل',
  'password.short': 'يجب ألا تقل كلمة المرور عن 8 أحرف.',
  'password.show': 'إظهار كلمة المرور',
  'password.hide': 'إخفاء كلمة المرور',
  'url.label': 'عنوان متجرك',
  'url.edit': 'تعديل',
  'url.slugLabel': 'العنوان (حروف لاتينية وأرقام وشرطات)',
  'url.empty': 'سيظهر عنوانك هنا بمجرد إدخال الاسم',
  'url.taken': 'هذا العنوان مستعمل بالفعل.',
  'url.invalid': 'عنوان غير صالح (3 أحرف على الأقل: حروف وأرقام وشرطات).',
  'url.use': 'استعمل «{slug}»',
  'url.short': 'يجب ألا يقل العنوان عن 3 أحرف.',
  'url.format': 'استعمل حروفًا لاتينية وأرقامًا وشرطات فقط (دون شرطة في البداية أو النهاية).',
  more: 'خيارات إضافية',
  less: 'خيارات أقل',
  'fullName.label': 'اسمك (اختياري)',
  'phone.label': 'الهاتف / واتساب (اختياري)',
  submit: 'أطلق متجري',
  submitting: 'جارٍ الإنشاء…',
  trial: 'تجربة مجانية {days} يومًا ثم {plan} — يمكنك تغيير الخطة في أي وقت.',
  'plan.named': 'خطة {plan}',
  'plan.fallback': 'الخطة المختارة',
  'login.prompt': 'لديك حساب؟',
  'login.link': 'دخول الإدارة',
  fix: 'صحّح الحقول المعلَّمة بالأحمر',
  'created.pending': 'تم إنشاء المتجر «{name}» — في انتظار التفعيل من Get STORE',
  'created.trial': 'تم إنشاء المتجر «{name}» — بدأت التجربة المجانية ({days} يومًا)',
  'created.login': 'تم إنشاء المتجر. سجّل الدخول بـ {email}',
  failed: 'تعذّر إنشاء المتجر',
};

export const createStoreMessages: Record<AdminLocale, Dict> = { fr, en, ar };
