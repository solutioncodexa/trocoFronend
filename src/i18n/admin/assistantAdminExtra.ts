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
  | 'assistant.sug.pages1';

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
};

export const assistantAdminExtra: Record<StoreLocale, Record<AssistantAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
