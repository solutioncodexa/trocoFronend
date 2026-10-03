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
  | 'assistant.flow.wab.hint'
  | 'assistant.catalog.start'
  | 'assistant.catalog.intro'
  | 'assistant.catalog.haveCats'
  | 'assistant.catalog.activity.ask'
  | 'assistant.catalog.activity.fashion'
  | 'assistant.catalog.activity.beauty'
  | 'assistant.catalog.activity.home'
  | 'assistant.catalog.activity.tech'
  | 'assistant.catalog.activity.food'
  | 'assistant.catalog.activity.crafts'
  | 'assistant.catalog.activity.otherPlaceholder'
  | 'assistant.catalog.tree.ask'
  | 'assistant.catalog.tree.custom'
  | 'assistant.catalog.tree.add'
  | 'assistant.catalog.tree.addPlaceholder'
  | 'assistant.catalog.tree.parentTop'
  | 'assistant.catalog.tree.create'
  | 'assistant.catalog.tree.count'
  | 'assistant.catalog.tree.creating'
  | 'assistant.catalog.tree.done'
  | 'assistant.catalog.tree.nothingNew'
  | 'assistant.catalog.product.ask'
  | 'assistant.catalog.product.another'
  | 'assistant.catalog.product.noCats'
  | 'assistant.catalog.product.category'
  | 'assistant.catalog.product.name'
  | 'assistant.catalog.product.namePlaceholder'
  | 'assistant.catalog.product.price'
  | 'assistant.catalog.product.pricePlaceholder'
  | 'assistant.catalog.product.photos'
  | 'assistant.catalog.product.photosPick'
  | 'assistant.catalog.product.photosCount'
  | 'assistant.catalog.product.photosInvalid'
  | 'assistant.catalog.product.desc'
  | 'assistant.catalog.product.descPlaceholder'
  | 'assistant.catalog.product.descUse'
  | 'assistant.catalog.product.stock'
  | 'assistant.catalog.product.stockPlaceholder'
  | 'assistant.catalog.product.confirm'
  | 'assistant.catalog.product.create'
  | 'assistant.catalog.product.cancel'
  | 'assistant.catalog.product.created'
  | 'assistant.catalog.product.cancelled'
  | 'assistant.catalog.product.view'
  | 'assistant.catalog.summary.name'
  | 'assistant.catalog.summary.price'
  | 'assistant.catalog.summary.category'
  | 'assistant.catalog.summary.stock'
  | 'assistant.catalog.summary.photos'
  | 'assistant.catalog.error'
  | 'assistant.catalog.done';

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
  'assistant.catalog.start': 'Créer mes catégories et articles',
  'assistant.catalog.intro': 'Parfait ! On organise d’abord votre catalogue en catégories et sous-catégories, puis on ajoute vos articles. Je vous guide pas à pas.',
  'assistant.catalog.haveCats': 'Vous avez déjà {n} catégorie(s). Voulez-vous en ajouter d’autres ?',
  'assistant.catalog.activity.ask': 'Quel type de produits vendez-vous ? Choisissez une activité : je vous propose des catégories adaptées. Sinon, décrivez la vôtre.',
  'assistant.catalog.activity.fashion': 'Mode et vêtements',
  'assistant.catalog.activity.beauty': 'Beauté et soins',
  'assistant.catalog.activity.home': 'Maison et déco',
  'assistant.catalog.activity.tech': 'High-tech',
  'assistant.catalog.activity.food': 'Alimentation',
  'assistant.catalog.activity.crafts': 'Artisanat',
  'assistant.catalog.activity.otherPlaceholder': 'Autre activité (ex. : Jouets, Sport…)',
  'assistant.catalog.tree.ask': 'Voici une structure que je vous propose. Décochez ce que vous ne voulez pas, ou ajoutez vos propres catégories.',
  'assistant.catalog.tree.custom': 'Je n’ai pas de modèle pour cette activité. Ajoutez vos catégories une par une ; vous pouvez choisir une catégorie principale pour créer une sous-catégorie.',
  'assistant.catalog.tree.add': 'Ajouter',
  'assistant.catalog.tree.addPlaceholder': 'Nouvelle catégorie',
  'assistant.catalog.tree.parentTop': 'Catégorie principale',
  'assistant.catalog.tree.create': 'Créer ces catégories',
  'assistant.catalog.tree.count': '{n} sélectionnée(s)',
  'assistant.catalog.tree.creating': 'Création…',
  'assistant.catalog.tree.done': '{n} catégorie(s) créée(s) ✅',
  'assistant.catalog.tree.nothingNew': 'Ces catégories existent déjà, rien à créer ✅',
  'assistant.catalog.product.ask': 'Voulez-vous ajouter votre premier article maintenant ?',
  'assistant.catalog.product.another': 'Voulez-vous ajouter un autre article ?',
  'assistant.catalog.product.noCats': 'Il faut au moins une catégorie pour ranger un article. Créons-en d’abord.',
  'assistant.catalog.product.category': 'Dans quelle catégorie ranger cet article ?',
  'assistant.catalog.product.name': 'Comment s’appelle l’article ?',
  'assistant.catalog.product.namePlaceholder': 'Ex. : Caftan brodé main',
  'assistant.catalog.product.price': 'Quel est son prix, en MAD ?',
  'assistant.catalog.product.pricePlaceholder': 'Ex. : 299',
  'assistant.catalog.product.photos': 'Ajoutez une ou plusieurs photos (la première sera l’image principale).',
  'assistant.catalog.product.photosPick': 'Choisir des photos',
  'assistant.catalog.product.photosCount': '{n} photo(s) sélectionnée(s)',
  'assistant.catalog.product.photosInvalid': 'Images uniquement, 10 Mo maximum chacune, 8 photos au plus.',
  'assistant.catalog.product.desc': 'Décrivez l’article en quelques phrases. Je vous propose un texte à reprendre ou à modifier.',
  'assistant.catalog.product.descPlaceholder': 'Description de l’article',
  'assistant.catalog.product.descUse': 'Utiliser cette proposition',
  'assistant.catalog.product.stock': 'Combien en avez-vous en stock ?',
  'assistant.catalog.product.stockPlaceholder': 'Ex. : 10',
  'assistant.catalog.product.confirm': 'Voici votre article. Je le crée ?',
  'assistant.catalog.product.create': 'Créer l’article',
  'assistant.catalog.product.cancel': 'Annuler',
  'assistant.catalog.product.created': 'Article « {name} » créé ✅',
  'assistant.catalog.product.cancelled': 'D’accord, article annulé.',
  'assistant.catalog.product.view': 'Voir mes produits',
  'assistant.catalog.summary.name': 'Nom',
  'assistant.catalog.summary.price': 'Prix',
  'assistant.catalog.summary.category': 'Catégorie',
  'assistant.catalog.summary.stock': 'Stock',
  'assistant.catalog.summary.photos': 'Photos',
  'assistant.catalog.error': 'Impossible de continuer : {msg}',
  'assistant.catalog.done': 'Votre catalogue est prêt ✅ Vous pourrez ajouter d’autres articles depuis le menu Produits.',
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
  'assistant.catalog.start': 'Create my categories and products',
  'assistant.catalog.intro': 'Perfect! First we’ll organize your catalog into categories and subcategories, then add your products. I’ll guide you step by step.',
  'assistant.catalog.haveCats': 'You already have {n} categories. Would you like to add more?',
  'assistant.catalog.activity.ask': 'What kind of products do you sell? Pick an activity and I’ll suggest suitable categories. Otherwise, describe yours.',
  'assistant.catalog.activity.fashion': 'Fashion and clothing',
  'assistant.catalog.activity.beauty': 'Beauty and care',
  'assistant.catalog.activity.home': 'Home and decor',
  'assistant.catalog.activity.tech': 'Electronics',
  'assistant.catalog.activity.food': 'Food and drinks',
  'assistant.catalog.activity.crafts': 'Crafts',
  'assistant.catalog.activity.otherPlaceholder': 'Other activity (e.g. Toys, Sports…)',
  'assistant.catalog.tree.ask': 'Here’s a structure I suggest. Untick what you don’t want, or add your own categories.',
  'assistant.catalog.tree.custom': 'I don’t have a template for that activity. Add your categories one by one; pick a main category to create a subcategory.',
  'assistant.catalog.tree.add': 'Add',
  'assistant.catalog.tree.addPlaceholder': 'New category',
  'assistant.catalog.tree.parentTop': 'Main category',
  'assistant.catalog.tree.create': 'Create these categories',
  'assistant.catalog.tree.count': '{n} selected',
  'assistant.catalog.tree.creating': 'Creating…',
  'assistant.catalog.tree.done': '{n} categories created ✅',
  'assistant.catalog.tree.nothingNew': 'These categories already exist, nothing to create ✅',
  'assistant.catalog.product.ask': 'Would you like to add your first product now?',
  'assistant.catalog.product.another': 'Would you like to add another product?',
  'assistant.catalog.product.noCats': 'You need at least one category to file a product. Let’s create some first.',
  'assistant.catalog.product.category': 'Which category should this product go in?',
  'assistant.catalog.product.name': 'What is the product called?',
  'assistant.catalog.product.namePlaceholder': 'E.g. Hand-embroidered kaftan',
  'assistant.catalog.product.price': 'What is its price, in MAD?',
  'assistant.catalog.product.pricePlaceholder': 'E.g. 299',
  'assistant.catalog.product.photos': 'Add one or more photos (the first one will be the main image).',
  'assistant.catalog.product.photosPick': 'Choose photos',
  'assistant.catalog.product.photosCount': '{n} photo(s) selected',
  'assistant.catalog.product.photosInvalid': 'Images only, 10 MB max each, up to 8 photos.',
  'assistant.catalog.product.desc': 'Describe the product in a few sentences. I’ll suggest a text you can use or edit.',
  'assistant.catalog.product.descPlaceholder': 'Product description',
  'assistant.catalog.product.descUse': 'Use this suggestion',
  'assistant.catalog.product.stock': 'How many do you have in stock?',
  'assistant.catalog.product.stockPlaceholder': 'E.g. 10',
  'assistant.catalog.product.confirm': 'Here’s your product. Shall I create it?',
  'assistant.catalog.product.create': 'Create product',
  'assistant.catalog.product.cancel': 'Cancel',
  'assistant.catalog.product.created': 'Product “{name}” created ✅',
  'assistant.catalog.product.cancelled': 'OK, product cancelled.',
  'assistant.catalog.product.view': 'View my products',
  'assistant.catalog.summary.name': 'Name',
  'assistant.catalog.summary.price': 'Price',
  'assistant.catalog.summary.category': 'Category',
  'assistant.catalog.summary.stock': 'Stock',
  'assistant.catalog.summary.photos': 'Photos',
  'assistant.catalog.error': 'Couldn’t continue: {msg}',
  'assistant.catalog.done': 'Your catalog is ready ✅ You can add more products from the Products menu.',
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
  'assistant.catalog.start': 'إنشاء الفئات والمنتجات',
  'assistant.catalog.intro': 'ممتاز! سننظّم أولًا كتالوجك في فئات وفئات فرعية، ثم نضيف منتجاتك. سأرشدك خطوة بخطوة.',
  'assistant.catalog.haveCats': 'لديك بالفعل {n} فئة. هل تريد إضافة المزيد؟',
  'assistant.catalog.activity.ask': 'ما نوع المنتجات التي تبيعها؟ اختر نشاطًا وسأقترح فئات مناسبة، أو صِف نشاطك بنفسك.',
  'assistant.catalog.activity.fashion': 'الأزياء والملابس',
  'assistant.catalog.activity.beauty': 'الجمال والعناية',
  'assistant.catalog.activity.home': 'المنزل والديكور',
  'assistant.catalog.activity.tech': 'الإلكترونيات',
  'assistant.catalog.activity.food': 'المواد الغذائية',
  'assistant.catalog.activity.crafts': 'الصناعة التقليدية',
  'assistant.catalog.activity.otherPlaceholder': 'نشاط آخر (مثال: ألعاب، رياضة…)',
  'assistant.catalog.tree.ask': 'هذه بنية أقترحها عليك. ألغِ تحديد ما لا تريده أو أضف فئاتك الخاصة.',
  'assistant.catalog.tree.custom': 'ليس لدي نموذج لهذا النشاط. أضف فئاتك واحدة تلو الأخرى؛ اختر فئة رئيسية لإنشاء فئة فرعية.',
  'assistant.catalog.tree.add': 'إضافة',
  'assistant.catalog.tree.addPlaceholder': 'فئة جديدة',
  'assistant.catalog.tree.parentTop': 'فئة رئيسية',
  'assistant.catalog.tree.create': 'إنشاء هذه الفئات',
  'assistant.catalog.tree.count': '{n} محددة',
  'assistant.catalog.tree.creating': 'جارٍ الإنشاء…',
  'assistant.catalog.tree.done': 'تم إنشاء {n} فئة ✅',
  'assistant.catalog.tree.nothingNew': 'هذه الفئات موجودة بالفعل، لا شيء لإنشائه ✅',
  'assistant.catalog.product.ask': 'هل تريد إضافة أول منتج الآن؟',
  'assistant.catalog.product.another': 'هل تريد إضافة منتج آخر؟',
  'assistant.catalog.product.noCats': 'تحتاج إلى فئة واحدة على الأقل لتصنيف المنتج. لننشئ بعضها أولًا.',
  'assistant.catalog.product.category': 'في أي فئة نضع هذا المنتج؟',
  'assistant.catalog.product.name': 'ما اسم المنتج؟',
  'assistant.catalog.product.namePlaceholder': 'مثال: قفطان مطرّز يدويًا',
  'assistant.catalog.product.price': 'ما سعره بالدرهم؟',
  'assistant.catalog.product.pricePlaceholder': 'مثال: 299',
  'assistant.catalog.product.photos': 'أضف صورة أو أكثر (الأولى ستكون الصورة الرئيسية).',
  'assistant.catalog.product.photosPick': 'اختيار الصور',
  'assistant.catalog.product.photosCount': 'تم اختيار {n} صورة',
  'assistant.catalog.product.photosInvalid': 'صور فقط، بحد أقصى 10 ميغابايت لكل صورة، و8 صور كحد أقصى.',
  'assistant.catalog.product.desc': 'صِف المنتج في بضع جمل. سأقترح نصًا يمكنك اعتماده أو تعديله.',
  'assistant.catalog.product.descPlaceholder': 'وصف المنتج',
  'assistant.catalog.product.descUse': 'استخدام هذا الاقتراح',
  'assistant.catalog.product.stock': 'كم عدد القطع المتوفرة في المخزون؟',
  'assistant.catalog.product.stockPlaceholder': 'مثال: 10',
  'assistant.catalog.product.confirm': 'هذا هو منتجك. هل أنشئه؟',
  'assistant.catalog.product.create': 'إنشاء المنتج',
  'assistant.catalog.product.cancel': 'إلغاء',
  'assistant.catalog.product.created': 'تم إنشاء المنتج «{name}» ✅',
  'assistant.catalog.product.cancelled': 'حسنًا، تم إلغاء المنتج.',
  'assistant.catalog.product.view': 'عرض منتجاتي',
  'assistant.catalog.summary.name': 'الاسم',
  'assistant.catalog.summary.price': 'السعر',
  'assistant.catalog.summary.category': 'الفئة',
  'assistant.catalog.summary.stock': 'المخزون',
  'assistant.catalog.summary.photos': 'الصور',
  'assistant.catalog.error': 'تعذّر المتابعة: {msg}',
  'assistant.catalog.done': 'كتالوجك جاهز ✅ يمكنك إضافة منتجات أخرى من قائمة المنتجات.',
};

export const assistantAdminExtra: Record<StoreLocale, Record<AssistantAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
