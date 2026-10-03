import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n de l'assistant de configuration (chat admin). */
export type AssistantAdminMessageKey =
  | 'assistant.fab'
  | 'assistant.openAria'
  | 'assistant.title'
  | 'assistant.intro'
  | 'assistant.thinking'
  | 'assistant.clear'
  | 'assistant.close'
  | 'assistant.placeholder'
  | 'assistant.inputLabel'
  | 'assistant.send'
  | 'assistant.errorGeneric'
  | 'assistant.errorSlow'
  | 'assistant.sug.default1'
  | 'assistant.sug.default2'
  | 'assistant.sug.default3'
  | 'assistant.sug.dashboard1'
  | 'assistant.sug.dashboard2'
  | 'assistant.sug.settings1'
  | 'assistant.sug.settings2'
  | 'assistant.sug.appearance1'
  | 'assistant.sug.appearance2'
  | 'assistant.sug.products1'
  | 'assistant.sug.products2'
  | 'assistant.sug.orders1'
  | 'assistant.sug.pages1'
  | 'assistant.flow.start'
  | 'assistant.flow.intro'
  | 'assistant.flow.yes'
  | 'assistant.flow.no'
  | 'assistant.flow.skip'
  | 'assistant.flow.continue'
  | 'assistant.flow.save'
  | 'assistant.flow.saved'
  | 'assistant.flow.skipped'
  | 'assistant.flow.invalid'
  | 'assistant.flow.error'
  | 'assistant.flow.done'
  | 'assistant.flow.logo.ask'
  | 'assistant.flow.logo.upload'
  | 'assistant.flow.logo.pick'
  | 'assistant.flow.logo.uploading'
  | 'assistant.flow.logo.done'
  | 'assistant.flow.colors.ask'
  | 'assistant.flow.colors.custom'
  | 'assistant.flow.colors.preview'
  | 'assistant.flow.colors.sample'
  | 'assistant.flow.colors.apply'
  | 'assistant.flow.colors.live'
  | 'assistant.flow.colors.done'
  | 'assistant.flow.tagline.ask'
  | 'assistant.flow.tagline.placeholder'
  | 'assistant.flow.phone.ask'
  | 'assistant.flow.phone.placeholder'
  | 'assistant.flow.whatsapp.ask'
  | 'assistant.flow.cod.ask'
  | 'assistant.flow.cod.done'
  | 'assistant.flow.shipping.ask'
  | 'assistant.flow.shipping.placeholder'
  | 'assistant.flow.wab.ask'
  | 'assistant.flow.wab.open'
  | 'assistant.flow.wab.hint';

const fr: Record<AssistantAdminMessageKey, string> = {
  'assistant.fab': 'Besoin d’aide ?',
  'assistant.openAria': 'Ouvrir l’assistant de configuration',
  'assistant.title': 'Assistant de configuration',
  'assistant.intro':
    'Posez-moi une question sur la configuration de votre boutique. Je vous explique comment faire, étape par étape.',
  'assistant.thinking': 'L’assistant réfléchit…',
  'assistant.clear': 'Effacer la conversation',
  'assistant.close': 'Fermer l’assistant',
  'assistant.placeholder': 'Votre question…',
  'assistant.inputLabel': 'Votre question',
  'assistant.send': 'Envoyer',
  'assistant.errorGeneric': 'L’assistant est momentanément indisponible. Réessayez dans un instant.',
  'assistant.errorSlow': 'L’assistant met trop de temps à répondre. Réessayez dans un instant.',
  'assistant.sug.default1': 'Comment changer mon logo ?',
  'assistant.sug.default2': 'Comment configurer les paiements ?',
  'assistant.sug.default3': 'Comment ajouter un produit ?',
  'assistant.sug.dashboard1': 'Par où commencer pour ouvrir ma boutique ?',
  'assistant.sug.dashboard2': 'Que me reste-t-il à configurer ?',
  'assistant.sug.settings1': 'Comment activer le paiement à la livraison ?',
  'assistant.sug.settings2': 'Comment fixer un seuil de livraison gratuite ?',
  'assistant.sug.appearance1': 'Comment changer les couleurs de ma boutique ?',
  'assistant.sug.appearance2': 'Comment changer de style ?',
  'assistant.sug.products1': 'Comment ajouter mon premier produit ?',
  'assistant.sug.products2': 'Comment apparaître sur Google ?',
  'assistant.sug.orders1': 'Comment prévenir un client que sa commande est expédiée ?',
  'assistant.sug.pages1': 'Comment créer une page À propos ?',
  'assistant.flow.start': 'Configurer ma boutique avec l’assistant',
  'assistant.flow.intro': 'Très bien, configurons votre boutique ensemble. Je vous pose quelques questions et vous pouvez passer chaque étape.',
  'assistant.flow.yes': 'Oui',
  'assistant.flow.no': 'Non',
  'assistant.flow.skip': 'Passer',
  'assistant.flow.continue': 'Continuer',
  'assistant.flow.save': 'Enregistrer',
  'assistant.flow.saved': 'C’est enregistré ✅',
  'assistant.flow.skipped': 'On passe cette étape.',
  'assistant.flow.invalid': 'Cette valeur n’est pas valide. Réessayez.',
  'assistant.flow.error': 'Impossible d’enregistrer pour le moment. Réessayez.',
  'assistant.flow.done': 'Configuration terminée 🎉 Vous pouvez affiner chaque réglage depuis le menu, ou me poser une question.',
  'assistant.flow.logo.ask': 'Voulez-vous ajouter un logo ?',
  'assistant.flow.logo.upload': 'Envoyez-moi l’image de votre logo (PNG ou WebP, de préférence sur fond transparent).',
  'assistant.flow.logo.pick': 'Choisir une image',
  'assistant.flow.logo.uploading': 'Envoi du logo…',
  'assistant.flow.logo.done': 'Logo enregistré ✅ Il s’affiche déjà sur votre boutique.',
  'assistant.flow.colors.ask': 'Quelle couleur pour votre boutique ? Choisissez une palette ou une couleur personnalisée.',
  'assistant.flow.colors.custom': 'Couleur personnalisée',
  'assistant.flow.colors.preview': 'Aperçu',
  'assistant.flow.colors.sample': 'Commander',
  'assistant.flow.colors.apply': 'Appliquer cette couleur',
  'assistant.flow.colors.live': 'Ouvrir l’aperçu en direct',
  'assistant.flow.colors.done': 'Couleurs appliquées ✅ Ouvrez l’aperçu en direct pour voir le résultat et affiner.',
  'assistant.flow.tagline.ask': 'Quel slogan, en une phrase, pour votre boutique ?',
  'assistant.flow.tagline.placeholder': 'Ex. : Le meilleur de l’artisanat marocain',
  'assistant.flow.phone.ask': 'Quel numéro de téléphone afficher à vos clients ?',
  'assistant.flow.phone.placeholder': '+212 6 12 34 56 78',
  'assistant.flow.whatsapp.ask': 'Et votre numéro WhatsApp, pour que vos clients vous écrivent ? (facultatif)',
  'assistant.flow.cod.ask': 'Voulez-vous proposer le paiement à la livraison ?',
  'assistant.flow.cod.done': 'Paiement à la livraison activé ✅',
  'assistant.flow.shipping.ask': 'À partir de quel montant (en MAD) la livraison est-elle gratuite ? Passez cette étape si vous n’en proposez pas.',
  'assistant.flow.shipping.placeholder': 'Ex. : 500',
  'assistant.flow.wab.ask': 'Voulez-vous envoyer les confirmations de commande à vos clients par WhatsApp Business ?',
  'assistant.flow.wab.open': 'Ouvrir les réglages WhatsApp',
  'assistant.flow.wab.hint': 'La configuration se fait dans Réglages. Je vous attends ici, cliquez sur « Continuer » ensuite.',
};

const en: Record<AssistantAdminMessageKey, string> = {
  'assistant.fab': 'Need help?',
  'assistant.openAria': 'Open the setup assistant',
  'assistant.title': 'Setup assistant',
  'assistant.intro': 'Ask me anything about setting up your store. I will walk you through it, step by step.',
  'assistant.thinking': 'The assistant is thinking…',
  'assistant.clear': 'Clear conversation',
  'assistant.close': 'Close the assistant',
  'assistant.placeholder': 'Your question…',
  'assistant.inputLabel': 'Your question',
  'assistant.send': 'Send',
  'assistant.errorGeneric': 'The assistant is temporarily unavailable. Please try again in a moment.',
  'assistant.errorSlow': 'The assistant is taking too long to answer. Please try again in a moment.',
  'assistant.sug.default1': 'How do I change my logo?',
  'assistant.sug.default2': 'How do I set up payments?',
  'assistant.sug.default3': 'How do I add a product?',
  'assistant.sug.dashboard1': 'Where do I start to open my store?',
  'assistant.sug.dashboard2': 'What is left to set up?',
  'assistant.sug.settings1': 'How do I enable cash on delivery?',
  'assistant.sug.settings2': 'How do I set a free shipping threshold?',
  'assistant.sug.appearance1': 'How do I change my store colors?',
  'assistant.sug.appearance2': 'How do I change the style?',
  'assistant.sug.products1': 'How do I add my first product?',
  'assistant.sug.products2': 'How do I show up on Google?',
  'assistant.sug.orders1': 'How do I tell a customer their order has shipped?',
  'assistant.sug.pages1': 'How do I create an About page?',
  'assistant.flow.start': 'Set up my store with the assistant',
  'assistant.flow.intro': 'Great, let’s set up your store together. I’ll ask a few questions and you can skip any step.',
  'assistant.flow.yes': 'Yes',
  'assistant.flow.no': 'No',
  'assistant.flow.skip': 'Skip',
  'assistant.flow.continue': 'Continue',
  'assistant.flow.save': 'Save',
  'assistant.flow.saved': 'Saved ✅',
  'assistant.flow.skipped': 'Skipping this step.',
  'assistant.flow.invalid': 'That value isn’t valid. Please try again.',
  'assistant.flow.error': 'Couldn’t save right now. Please try again.',
  'assistant.flow.done': 'Setup complete 🎉 You can fine-tune any setting from the menu, or ask me a question.',
  'assistant.flow.logo.ask': 'Would you like to add a logo?',
  'assistant.flow.logo.upload': 'Send me your logo image (PNG or WebP, preferably with a transparent background).',
  'assistant.flow.logo.pick': 'Choose an image',
  'assistant.flow.logo.uploading': 'Uploading logo…',
  'assistant.flow.logo.done': 'Logo saved ✅ It already shows on your store.',
  'assistant.flow.colors.ask': 'Which color for your store? Pick a palette or a custom color.',
  'assistant.flow.colors.custom': 'Custom color',
  'assistant.flow.colors.preview': 'Preview',
  'assistant.flow.colors.sample': 'Order now',
  'assistant.flow.colors.apply': 'Apply this color',
  'assistant.flow.colors.live': 'Open live preview',
  'assistant.flow.colors.done': 'Colors applied ✅ Open the live preview to see the result and fine-tune.',
  'assistant.flow.tagline.ask': 'What tagline, in one sentence, for your store?',
  'assistant.flow.tagline.placeholder': 'E.g. The best of Moroccan crafts',
  'assistant.flow.phone.ask': 'Which phone number should customers see?',
  'assistant.flow.phone.placeholder': '+212 6 12 34 56 78',
  'assistant.flow.whatsapp.ask': 'And your WhatsApp number, so customers can message you? (optional)',
  'assistant.flow.cod.ask': 'Would you like to offer cash on delivery?',
  'assistant.flow.cod.done': 'Cash on delivery enabled ✅',
  'assistant.flow.shipping.ask': 'From what amount (in MAD) is shipping free? Skip this step if you don’t offer it.',
  'assistant.flow.shipping.placeholder': 'E.g. 500',
  'assistant.flow.wab.ask': 'Would you like to send order confirmations to customers via WhatsApp Business?',
  'assistant.flow.wab.open': 'Open WhatsApp settings',
  'assistant.flow.wab.hint': 'Setup happens in Settings. I’ll wait here, click “Continue” afterwards.',
};

const ar: Record<AssistantAdminMessageKey, string> = {
  'assistant.fab': 'تحتاج مساعدة؟',
  'assistant.openAria': 'فتح مساعد الإعداد',
  'assistant.title': 'مساعد الإعداد',
  'assistant.intro': 'اسألني عن أي شيء يخص إعداد متجرك، وسأشرح لك الخطوات واحدة تلو الأخرى.',
  'assistant.thinking': 'المساعد يفكّر…',
  'assistant.clear': 'مسح المحادثة',
  'assistant.close': 'إغلاق المساعد',
  'assistant.placeholder': 'اكتب سؤالك…',
  'assistant.inputLabel': 'سؤالك',
  'assistant.send': 'إرسال',
  'assistant.errorGeneric': 'المساعد غير متاح مؤقتًا. حاول مرة أخرى بعد قليل.',
  'assistant.errorSlow': 'المساعد يستغرق وقتًا طويلًا للرد. حاول مرة أخرى بعد قليل.',
  'assistant.sug.default1': 'كيف أغيّر شعار متجري؟',
  'assistant.sug.default2': 'كيف أضبط وسائل الدفع؟',
  'assistant.sug.default3': 'كيف أضيف منتجًا؟',
  'assistant.sug.dashboard1': 'من أين أبدأ لافتتاح متجري؟',
  'assistant.sug.dashboard2': 'ماذا بقي لي لإعداده؟',
  'assistant.sug.settings1': 'كيف أفعّل الدفع عند الاستلام؟',
  'assistant.sug.settings2': 'كيف أحدد حدًّا أدنى للتوصيل المجاني؟',
  'assistant.sug.appearance1': 'كيف أغيّر ألوان متجري؟',
  'assistant.sug.appearance2': 'كيف أغيّر النمط؟',
  'assistant.sug.products1': 'كيف أضيف أول منتج؟',
  'assistant.sug.products2': 'كيف أظهر في نتائج غوغل؟',
  'assistant.sug.orders1': 'كيف أُخبر الزبون بأن طلبه قد شُحن؟',
  'assistant.sug.pages1': 'كيف أنشئ صفحة «من نحن»؟',
  'assistant.flow.start': 'إعداد متجري مع المساعد',
  'assistant.flow.intro': 'حسنًا، لنُعدّ متجرك معًا. سأطرح عليك بعض الأسئلة ويمكنك تخطّي أي خطوة.',
  'assistant.flow.yes': 'نعم',
  'assistant.flow.no': 'لا',
  'assistant.flow.skip': 'تخطّي',
  'assistant.flow.continue': 'متابعة',
  'assistant.flow.save': 'حفظ',
  'assistant.flow.saved': 'تم الحفظ ✅',
  'assistant.flow.skipped': 'سنتخطّى هذه الخطوة.',
  'assistant.flow.invalid': 'هذه القيمة غير صالحة. حاول مجددًا.',
  'assistant.flow.error': 'تعذّر الحفظ حاليًا. حاول مرة أخرى.',
  'assistant.flow.done': 'اكتمل الإعداد 🎉 يمكنك ضبط أي إعداد من القائمة أو طرح سؤال عليّ.',
  'assistant.flow.logo.ask': 'هل تريد إضافة شعار؟',
  'assistant.flow.logo.upload': 'أرسل لي صورة شعارك (PNG أو WebP، ويفضَّل بخلفية شفافة).',
  'assistant.flow.logo.pick': 'اختيار صورة',
  'assistant.flow.logo.uploading': 'جارٍ رفع الشعار…',
  'assistant.flow.logo.done': 'تم حفظ الشعار ✅ وهو يظهر الآن في متجرك.',
  'assistant.flow.colors.ask': 'أي لون لمتجرك؟ اختر لوحة ألوان أو لونًا مخصصًا.',
  'assistant.flow.colors.custom': 'لون مخصص',
  'assistant.flow.colors.preview': 'معاينة',
  'assistant.flow.colors.sample': 'اطلب الآن',
  'assistant.flow.colors.apply': 'تطبيق هذا اللون',
  'assistant.flow.colors.live': 'فتح المعاينة المباشرة',
  'assistant.flow.colors.done': 'تم تطبيق الألوان ✅ افتح المعاينة المباشرة لرؤية النتيجة والتعديل.',
  'assistant.flow.tagline.ask': 'ما شعار متجرك في جملة واحدة؟',
  'assistant.flow.tagline.placeholder': 'مثال: أفضل الصناعات التقليدية المغربية',
  'assistant.flow.phone.ask': 'ما رقم الهاتف الذي سيراه زبائنك؟',
  'assistant.flow.phone.placeholder': '+212 6 12 34 56 78',
  'assistant.flow.whatsapp.ask': 'ورقم واتساب الخاص بك ليراسلك الزبائن؟ (اختياري)',
  'assistant.flow.cod.ask': 'هل تريد تفعيل الدفع عند الاستلام؟',
  'assistant.flow.cod.done': 'تم تفعيل الدفع عند الاستلام ✅',
  'assistant.flow.shipping.ask': 'ابتداءً من أي مبلغ (بالدرهم) يكون التوصيل مجانيًا؟ تخطَّ هذه الخطوة إن لم تقدّمه.',
  'assistant.flow.shipping.placeholder': 'مثال: 500',
  'assistant.flow.wab.ask': 'هل تريد إرسال تأكيدات الطلبات لزبائنك عبر واتساب للأعمال؟',
  'assistant.flow.wab.open': 'فتح إعدادات واتساب',
  'assistant.flow.wab.hint': 'يتم الإعداد من صفحة الإعدادات. سأنتظرك هنا، ثم اضغط «متابعة».',
};

export const assistantAdminExtra: Record<StoreLocale, Record<AssistantAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
