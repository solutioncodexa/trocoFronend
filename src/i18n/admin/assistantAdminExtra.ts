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
  | 'assistant.catalog.done'
  | 'assistant.design.start'
  | 'assistant.design.intro'
  | 'assistant.design.theme.ask'
  | 'assistant.design.theme.classic'
  | 'assistant.design.theme.classic.desc'
  | 'assistant.design.theme.minimal'
  | 'assistant.design.theme.minimal.desc'
  | 'assistant.design.theme.bold'
  | 'assistant.design.theme.bold.desc'
  | 'assistant.design.theme.elegant'
  | 'assistant.design.theme.elegant.desc'
  | 'assistant.design.theme.pro'
  | 'assistant.design.theme.active'
  | 'assistant.design.theme.locked'
  | 'assistant.design.theme.same'
  | 'assistant.design.theme.done'
  | 'assistant.design.layout.ask'
  | 'assistant.design.layout.inline'
  | 'assistant.design.layout.centered'
  | 'assistant.design.layout.stacked'
  | 'assistant.design.layout.done'
  | 'assistant.design.search.ask'
  | 'assistant.design.search.done'
  | 'assistant.design.promo.ask'
  | 'assistant.design.promo.text'
  | 'assistant.design.promo.placeholder'
  | 'assistant.design.promo.s1'
  | 'assistant.design.promo.s2'
  | 'assistant.design.promo.s3'
  | 'assistant.design.promo.done'
  | 'assistant.design.home.ask'
  | 'assistant.design.home.done'
  | 'assistant.design.about.ask'
  | 'assistant.design.about.done'
  | 'assistant.design.legal.ask'
  | 'assistant.design.legal.done'
  | 'assistant.design.social.instagram'
  | 'assistant.design.social.facebook'
  | 'assistant.design.social.tiktok'
  | 'assistant.design.social.placeholder.instagram'
  | 'assistant.design.social.placeholder.facebook'
  | 'assistant.design.social.placeholder.tiktok'
  | 'assistant.design.done'
  | 'assistant.design.error'
  | 'assistant.ship.start'
  | 'assistant.ship.intro'
  | 'assistant.ship.have'
  | 'assistant.ship.name.ask'
  | 'assistant.ship.name.placeholder'
  | 'assistant.ship.name.own'
  | 'assistant.ship.fee.ask'
  | 'assistant.ship.fee.placeholder'
  | 'assistant.ship.free.ask'
  | 'assistant.ship.free.placeholder'
  | 'assistant.ship.eta.ask'
  | 'assistant.ship.eta.placeholder'
  | 'assistant.ship.confirm'
  | 'assistant.ship.summary.name'
  | 'assistant.ship.summary.fee'
  | 'assistant.ship.summary.free'
  | 'assistant.ship.summary.eta'
  | 'assistant.ship.summary.days'
  | 'assistant.ship.add'
  | 'assistant.ship.created'
  | 'assistant.ship.default'
  | 'assistant.ship.another'
  | 'assistant.ship.done'
  | 'assistant.ship.error'
  | 'assistant.pay.start'
  | 'assistant.pay.intro'
  | 'assistant.pay.provider.ask'
  | 'assistant.pay.provider.stripe'
  | 'assistant.pay.provider.paypal'
  | 'assistant.pay.provider.cmi'
  | 'assistant.pay.provider.ready'
  | 'assistant.pay.provider.later'
  | 'assistant.pay.help.stripe'
  | 'assistant.pay.help.paypal'
  | 'assistant.pay.help.cmi'
  | 'assistant.pay.field.stripePk'
  | 'assistant.pay.field.stripeSk'
  | 'assistant.pay.field.paypalId'
  | 'assistant.pay.field.paypalSecret'
  | 'assistant.pay.field.cmiId'
  | 'assistant.pay.field.cmiKey'
  | 'assistant.pay.field.placeholder'
  | 'assistant.pay.field.show'
  | 'assistant.pay.invalid'
  | 'assistant.pay.mode.ask'
  | 'assistant.pay.mode.sandbox'
  | 'assistant.pay.mode.live'
  | 'assistant.pay.testing'
  | 'assistant.pay.ok'
  | 'assistant.pay.fail'
  | 'assistant.pay.live'
  | 'assistant.pay.another'
  | 'assistant.pay.done'
  | 'assistant.pay.error'
  | 'assistant.secret.blocked'
  | 'assistant.mkt.start'
  | 'assistant.mkt.intro'
  | 'assistant.mkt.nothing'
  | 'assistant.mkt.pixels.ask'
  | 'assistant.mkt.pixels.askUnlimited'
  | 'assistant.mkt.pixels.meta'
  | 'assistant.mkt.pixels.tiktok'
  | 'assistant.mkt.pixels.ga'
  | 'assistant.mkt.pixels.placeholder.meta'
  | 'assistant.mkt.pixels.placeholder.tiktok'
  | 'assistant.mkt.pixels.placeholder.ga'
  | 'assistant.mkt.pixels.saved'
  | 'assistant.mkt.pixels.limit'
  | 'assistant.mkt.homeSeo.ask'
  | 'assistant.mkt.homeSeo.title'
  | 'assistant.mkt.homeSeo.description'
  | 'assistant.mkt.homeSeo.apply'
  | 'assistant.mkt.homeSeo.done'
  | 'assistant.mkt.catSeo.ask'
  | 'assistant.mkt.catSeo.done'
  | 'assistant.mkt.promo.ask'
  | 'assistant.mkt.promo.code'
  | 'assistant.mkt.promo.code.placeholder'
  | 'assistant.mkt.promo.kind'
  | 'assistant.mkt.promo.kind.percentage'
  | 'assistant.mkt.promo.kind.fixed'
  | 'assistant.mkt.promo.value.percentage'
  | 'assistant.mkt.promo.value.fixed'
  | 'assistant.mkt.promo.value.placeholder'
  | 'assistant.mkt.promo.uses'
  | 'assistant.mkt.promo.confirm'
  | 'assistant.mkt.promo.summary.code'
  | 'assistant.mkt.promo.summary.discount'
  | 'assistant.mkt.promo.summary.uses'
  | 'assistant.mkt.promo.summary.unlimited'
  | 'assistant.mkt.promo.create'
  | 'assistant.mkt.promo.done'
  | 'assistant.mkt.done'
  | 'assistant.mkt.error'
  | 'assistant.growth.start'
  | 'assistant.growth.intro'
  | 'assistant.growth.nothing'
  | 'assistant.growth.locked'
  | 'assistant.growth.cart.ask'
  | 'assistant.growth.cart.delay'
  | 'assistant.growth.delay.minutes'
  | 'assistant.growth.delay.hours'
  | 'assistant.growth.delay.day'
  | 'assistant.growth.cart.done'
  | 'assistant.growth.whatsapp.ask'
  | 'assistant.growth.whatsapp.pick'
  | 'assistant.growth.whatsapp.done'
  | 'assistant.growth.loyalty.ask'
  | 'assistant.growth.loyalty.points'
  | 'assistant.growth.loyalty.value'
  | 'assistant.growth.loyalty.confirm'
  | 'assistant.growth.loyalty.summary.points'
  | 'assistant.growth.loyalty.summary.value'
  | 'assistant.growth.loyalty.enable'
  | 'assistant.growth.loyalty.done'
  | 'assistant.growth.domain.ask'
  | 'assistant.growth.domain.field'
  | 'assistant.growth.domain.placeholder'
  | 'assistant.growth.domain.saved'
  | 'assistant.growth.domain.verifyAsk'
  | 'assistant.growth.domain.ok'
  | 'assistant.growth.domain.pending'
  | 'assistant.growth.done'
  | 'assistant.growth.error'
  | 'assistant.legal.start'
  | 'assistant.legal.intro'
  | 'assistant.legal.nothing'
  | 'assistant.legal.pages.ask'
  | 'assistant.legal.pages.done'
  | 'assistant.legal.pages.none'
  | 'assistant.legal.cookies.ask'
  | 'assistant.legal.cookies.done'
  | 'assistant.legal.retention.ask'
  | 'assistant.legal.retention.pick'
  | 'assistant.legal.retention.months'
  | 'assistant.legal.retention.years'
  | 'assistant.legal.retention.done'
  | 'assistant.legal.done'
  | 'assistant.legal.error'
  | 'assistant.manage.start'
  | 'assistant.manage.type'
  | 'assistant.manage.type.product'
  | 'assistant.manage.type.category'
  | 'assistant.manage.search.product'
  | 'assistant.manage.search.category'
  | 'assistant.manage.search.placeholder'
  | 'assistant.manage.empty.product'
  | 'assistant.manage.empty.category'
  | 'assistant.manage.notfound'
  | 'assistant.manage.choose'
  | 'assistant.manage.action'
  | 'assistant.manage.action.price'
  | 'assistant.manage.action.stock'
  | 'assistant.manage.action.name'
  | 'assistant.manage.action.hide'
  | 'assistant.manage.action.show'
  | 'assistant.manage.action.delete'
  | 'assistant.manage.price.ask'
  | 'assistant.manage.stock.ask'
  | 'assistant.manage.name.ask'
  | 'assistant.manage.price.done'
  | 'assistant.manage.stock.done'
  | 'assistant.manage.name.done'
  | 'assistant.manage.hide.done'
  | 'assistant.manage.show.done'
  | 'assistant.manage.variants'
  | 'assistant.manage.delete.product'
  | 'assistant.manage.delete.category'
  | 'assistant.manage.delete.confirm'
  | 'assistant.manage.delete.done'
  | 'assistant.manage.summary.item'
  | 'assistant.manage.summary.price'
  | 'assistant.manage.summary.products'
  | 'assistant.manage.again'
  | 'assistant.manage.done'
  | 'assistant.manage.error'
  | 'assistant.content.start'
  | 'assistant.content.intro'
  | 'assistant.content.nothing'
  | 'assistant.content.email.ask'
  | 'assistant.content.email.placeholder'
  | 'assistant.content.email.saved'
  | 'assistant.content.city.ask'
  | 'assistant.content.city.placeholder'
  | 'assistant.content.city.saved'
  | 'assistant.content.about.ask'
  | 'assistant.content.about.placeholder'
  | 'assistant.content.about.saved'
  | 'assistant.content.faq.ask'
  | 'assistant.content.faq.done'
  | 'assistant.content.contactPage.ask'
  | 'assistant.content.contactPage.done'
  | 'assistant.content.team'
  | 'assistant.content.done'
  | 'assistant.content.error';

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
  'assistant.design.start': 'Personnaliser thème, en-tête et pages',
  'assistant.design.intro': 'Allons-y : on choisit le look de votre boutique, son en-tête, puis on crée les pages utiles. Chaque étape peut être passée.',
  'assistant.design.theme.ask': 'Quel style pour votre boutique ? Le thème règle le design, les couleurs et l’agencement d’un coup.',
  'assistant.design.theme.classic': 'Classique',
  'assistant.design.theme.classic.desc': 'Vitrine e-commerce claire, photo en tête et grilles arrondies.',
  'assistant.design.theme.minimal': 'Minimal',
  'assistant.design.theme.minimal.desc': 'Look éditorial épuré : peu de sections, le produit avant tout.',
  'assistant.design.theme.bold': 'Bold',
  'assistant.design.theme.bold.desc': 'Ambiance sombre « vente flash », gros boutons et bannières.',
  'assistant.design.theme.elegant': 'Élégant',
  'assistant.design.theme.elegant.desc': 'Magazine de luxe : titres centrés, italiques, catégories en cercles.',
  'assistant.design.theme.pro': 'Pro',
  'assistant.design.theme.active': 'Actif',
  'assistant.design.theme.locked': 'Ce thème est réservé au plan Pro. Choisissez Classique ou Minimal, ou passez au plan Pro dans /admin/reglages.',
  'assistant.design.theme.same': 'Le thème « {name} » est déjà actif, on le garde.',
  'assistant.design.theme.done': 'Thème « {name} » appliqué ✅ Ses couleurs et polices sont initialisées, vous pourrez les ajuster ensuite.',
  'assistant.design.layout.ask': 'Comment disposer l’en-tête (logo et menu) ?',
  'assistant.design.layout.inline': 'Logo à gauche, menu en ligne',
  'assistant.design.layout.centered': 'Logo centré',
  'assistant.design.layout.stacked': 'Logo au-dessus du menu',
  'assistant.design.layout.done': 'En-tête mis à jour ✅',
  'assistant.design.search.ask': 'Voulez-vous une barre de recherche dans l’en-tête ?',
  'assistant.design.search.done': 'C’est noté ✅',
  'assistant.design.promo.ask': 'Voulez-vous une bannière d’annonce tout en haut du site (livraison offerte, promotion…) ?',
  'assistant.design.promo.text': 'Quel message afficher ? Choisissez une suggestion ou écrivez le vôtre.',
  'assistant.design.promo.placeholder': 'Votre message (100 caractères max)',
  'assistant.design.promo.s1': 'Livraison gratuite dès 500 MAD',
  'assistant.design.promo.s2': 'Paiement à la livraison partout au Maroc',
  'assistant.design.promo.s3': '-10 % sur votre première commande',
  'assistant.design.promo.done': 'Bannière d’annonce activée ✅',
  'assistant.design.home.ask': 'Voulez-vous une page d’accueil complète (bannière, catégories, produits, avis) ? Vous pourrez tout modifier ensuite.',
  'assistant.design.home.done': 'Page d’accueil créée et publiée ✅ /admin/pages',
  'assistant.design.about.ask': 'Voulez-vous une page « À propos » pour présenter votre boutique ?',
  'assistant.design.about.done': 'Page À propos créée ✅ Complétez-la dans /admin/pages',
  'assistant.design.legal.ask': 'Voulez-vous créer les pages légales (mentions légales, CGV, confidentialité, retours) ?',
  'assistant.design.legal.done': '{n} page(s) légale(s) créée(s) ✅ Ce sont des modèles : faites-les relire avant d’ouvrir la boutique.',
  'assistant.design.social.instagram': 'Quel est le lien de votre page Instagram ? (facultatif)',
  'assistant.design.social.facebook': 'Et le lien de votre page Facebook ? (facultatif)',
  'assistant.design.social.tiktok': 'Et votre compte TikTok ? (facultatif)',
  'assistant.design.social.placeholder.instagram': 'instagram.com/votre-boutique',
  'assistant.design.social.placeholder.facebook': 'facebook.com/votre-boutique',
  'assistant.design.social.placeholder.tiktok': 'tiktok.com/@votre-boutique',
  'assistant.design.done': 'Votre boutique est personnalisée 🎉 Ouvrez l’aperçu en direct pour voir le résultat : /admin/parametres',
  'assistant.design.error': 'Impossible de continuer : {msg}',
  'assistant.ship.start': 'Configurer la livraison',
  'assistant.ship.intro': 'Parlons livraison : on ajoute vos transporteurs avec leurs frais et délais. Sans transporteur, vos clients ne peuvent pas finaliser leur commande.',
  'assistant.ship.have': 'Vous avez déjà {n} transporteur(s). Voulez-vous en ajouter un ?',
  'assistant.ship.name.ask': 'Quel transporteur ou mode de livraison proposez-vous ? Choisissez une suggestion ou écrivez le nom.',
  'assistant.ship.name.placeholder': 'Ex. : Livraison par mes soins',
  'assistant.ship.name.own': 'Livraison par mes soins',
  'assistant.ship.fee.ask': 'Quels sont ses frais de livraison, en MAD ? (0 si la livraison est offerte)',
  'assistant.ship.fee.placeholder': 'Ex. : 30',
  'assistant.ship.free.ask': 'À partir de quel montant de commande la livraison devient-elle gratuite avec ce transporteur ? Passez si elle ne l’est jamais.',
  'assistant.ship.free.placeholder': 'Ex. : 500',
  'assistant.ship.eta.ask': 'En combien de jours livrez-vous ? Indiquez un nombre ou une fourchette.',
  'assistant.ship.eta.placeholder': 'Ex. : 2-4',
  'assistant.ship.confirm': 'Voici ce transporteur. Je l’ajoute ?',
  'assistant.ship.summary.name': 'Nom',
  'assistant.ship.summary.fee': 'Frais',
  'assistant.ship.summary.free': 'Gratuit dès',
  'assistant.ship.summary.eta': 'Délai',
  'assistant.ship.summary.days': '{min}-{max} jours',
  'assistant.ship.add': 'Ajouter le transporteur',
  'assistant.ship.created': 'Transporteur « {name} » ajouté ✅ Vos clients peuvent le choisir à la commande.',
  'assistant.ship.default': 'Défini comme transporteur par défaut ✅',
  'assistant.ship.another': 'Voulez-vous ajouter un autre transporteur ?',
  'assistant.ship.done': 'La livraison est prête ✅ Vous pourrez modifier vos transporteurs dans /admin/livraison',
  'assistant.ship.error': 'Impossible de continuer : {msg}',
  'assistant.pay.start': 'Configurer le paiement par carte',
  'assistant.pay.intro': 'Configurons le paiement en ligne. Vos clés vont directement et de façon sécurisée à votre boutique : elles ne passent jamais par l’assistant ni par la conversation.',
  'assistant.pay.provider.ask': 'Quel prestataire de paiement voulez-vous brancher ?',
  'assistant.pay.provider.stripe': 'Stripe',
  'assistant.pay.provider.paypal': 'PayPal',
  'assistant.pay.provider.cmi': 'CMI (banque marocaine)',
  'assistant.pay.provider.ready': 'actif',
  'assistant.pay.provider.later': 'Plus tard',
  'assistant.pay.help.stripe': 'Dans votre compte Stripe, section Développeurs puis Clés API, copiez la clé publiable (pk_…) et la clé secrète (sk_…). Commencez par les clés de test.',
  'assistant.pay.help.paypal': 'Dans votre compte PayPal Developer, créez une application et copiez l’identifiant client et le secret. Commencez par le mode sandbox.',
  'assistant.pay.help.cmi': 'Le paiement CMI nécessite un contrat avec votre banque, qui vous fournit l’identifiant client (clientid) et la clé magasin (storekey).',
  'assistant.pay.field.stripePk': 'Collez votre clé publiable Stripe (elle commence par pk_).',
  'assistant.pay.field.stripeSk': 'Collez votre clé secrète Stripe (elle commence par sk_). Elle ne sera pas affichée.',
  'assistant.pay.field.paypalId': 'Collez l’identifiant client PayPal.',
  'assistant.pay.field.paypalSecret': 'Collez le secret PayPal. Il ne sera pas affiché.',
  'assistant.pay.field.cmiId': 'Quel est votre identifiant client CMI ?',
  'assistant.pay.field.cmiKey': 'Collez votre clé magasin CMI. Elle ne sera pas affichée.',
  'assistant.pay.field.placeholder': 'Collez ici',
  'assistant.pay.field.show': 'Afficher',
  'assistant.pay.invalid': 'Ce format n’est pas valide. Vérifiez que vous avez copié la bonne clé, en entier.',
  'assistant.pay.mode.ask': 'Quel mode PayPal ? « Sandbox » sert aux essais, sans vrai paiement.',
  'assistant.pay.mode.sandbox': 'Sandbox (essais)',
  'assistant.pay.mode.live': 'Live (réel)',
  'assistant.pay.testing': 'Vérification des clés…',
  'assistant.pay.ok': '{name} est prêt ✅ {message}',
  'assistant.pay.fail': 'Le test de {name} a échoué : {msg} Vérifiez vos clés puis réessayez.',
  'assistant.pay.live': 'Ces clés sont en mode réel : de vrais paiements seront possibles dès que le prestataire est actif.',
  'assistant.pay.another': 'Voulez-vous brancher un autre prestataire ?',
  'assistant.pay.done': 'Paiement en ligne configuré. Faites un paiement test depuis votre boutique avant de l’ouvrir. Réglages : /admin/reglages',
  'assistant.pay.error': 'Impossible de continuer : {msg}',
  'assistant.secret.blocked': 'Par sécurité, je n’envoie pas ce message : il ressemble à une clé ou à un mot de passe. Ne les collez jamais dans le chat ; utilisez le parcours « Configurer le paiement par carte ».',
  'assistant.mkt.start': 'Marketing et référencement',
  'assistant.mkt.intro': 'Voyons comment faire connaître votre boutique : suivi publicitaire, apparition sur Google et un premier code promo. Chaque étape peut être passée.',
  'assistant.mkt.nothing': 'Tout est déjà en place de ce côté ✅ Vous pouvez affiner vos réglages dans /admin/reglages',
  'assistant.mkt.pixels.ask': 'Voulez-vous suivre vos ventes et vos publicités avec des pixels (Meta, TikTok, Google) ? Votre plan autorise {max} pixel(s), {used} utilisé(s).',
  'assistant.mkt.pixels.askUnlimited': 'Voulez-vous suivre vos ventes et vos publicités avec des pixels (Meta, TikTok, Google) ?',
  'assistant.mkt.pixels.meta': 'Quel est l’identifiant de votre pixel Meta (Facebook et Instagram) ? C’est un nombre de 15 ou 16 chiffres, visible dans le Gestionnaire d’événements.',
  'assistant.mkt.pixels.tiktok': 'Et l’identifiant de votre pixel TikTok ? (lettres et chiffres)',
  'assistant.mkt.pixels.ga': 'Et votre identifiant Google : Analytics (G-XXXXXXXXXX) ou Google Ads (AW-123456789) ?',
  'assistant.mkt.pixels.placeholder.meta': 'Ex. : 123456789012345',
  'assistant.mkt.pixels.placeholder.tiktok': 'Ex. : C4ABCDEF1234567890XY',
  'assistant.mkt.pixels.placeholder.ga': 'Ex. : G-ABC123DEF4',
  'assistant.mkt.pixels.saved': 'Pixel enregistré ✅',
  'assistant.mkt.pixels.limit': 'Votre plan {plan} autorise {max} pixel(s) et ils sont tous utilisés. Pour en ajouter, passez à un plan supérieur dans /admin/reglages',
  'assistant.mkt.homeSeo.ask': 'Voici ce que je propose pour que votre page d’accueil apparaisse bien sur Google. Je l’applique ?',
  'assistant.mkt.homeSeo.title': 'Titre',
  'assistant.mkt.homeSeo.description': 'Description',
  'assistant.mkt.homeSeo.apply': 'Appliquer',
  'assistant.mkt.homeSeo.done': 'Titre et description enregistrés ✅ Modifiables dans /admin/pages',
  'assistant.mkt.catSeo.ask': '{n} catégorie(s) n’ont pas de titre ou de description pour Google. Voulez-vous que je les génère toutes ?',
  'assistant.mkt.catSeo.done': '{n} catégorie(s) mise(s) à jour ✅ Relisez-les dans /admin/categories',
  'assistant.mkt.promo.ask': 'Voulez-vous créer un premier code promo (par exemple pour accueillir vos nouveaux clients) ?',
  'assistant.mkt.promo.code': 'Quel code les clients saisiront-ils ? Lettres et chiffres, 3 à 20 caractères.',
  'assistant.mkt.promo.code.placeholder': 'Ex. : BIENVENUE10',
  'assistant.mkt.promo.kind': 'Quel type de réduction ?',
  'assistant.mkt.promo.kind.percentage': 'Pourcentage (%)',
  'assistant.mkt.promo.kind.fixed': 'Montant fixe (MAD)',
  'assistant.mkt.promo.value.percentage': 'Quel pourcentage de réduction ? (1 à 90)',
  'assistant.mkt.promo.value.fixed': 'Quel montant de réduction, en MAD ?',
  'assistant.mkt.promo.value.placeholder': 'Ex. : 10',
  'assistant.mkt.promo.uses': 'Combien de fois ce code peut-il être utilisé au total ? Passez pour ne pas limiter.',
  'assistant.mkt.promo.confirm': 'Voici le code promo. Je le crée ?',
  'assistant.mkt.promo.summary.code': 'Code',
  'assistant.mkt.promo.summary.discount': 'Réduction',
  'assistant.mkt.promo.summary.uses': 'Utilisations max.',
  'assistant.mkt.promo.summary.unlimited': 'Illimité',
  'assistant.mkt.promo.create': 'Créer le code',
  'assistant.mkt.promo.done': 'Code « {code} » créé ✅ Gérez vos codes dans /admin/codes-promo',
  'assistant.mkt.done': 'Marketing et référencement terminés 🎉',
  'assistant.mkt.error': 'Impossible de continuer : {msg}',
  'assistant.growth.start': 'Fonctions Pro : ventes et domaine',
  'assistant.growth.intro': 'Voyons les options de votre plan qui font vendre davantage : relance des paniers, WhatsApp, fidélité et votre propre nom de domaine. Chaque étape peut être passée.',
  'assistant.growth.nothing': 'Tout est déjà en place de ce côté ✅',
  'assistant.growth.locked': 'Les relances de paniers, la fidélité, WhatsApp Business et le domaine personnalisé sont inclus dans les plans supérieurs. Vous pouvez changer de plan dans /admin/reglages',
  'assistant.growth.cart.ask': 'Voulez-vous relancer automatiquement les clients qui laissent des articles dans leur panier sans commander ?',
  'assistant.growth.cart.delay': 'Après combien de temps faut-il les relancer ?',
  'assistant.growth.delay.minutes': '{n} min',
  'assistant.growth.delay.hours': '{n} h',
  'assistant.growth.delay.day': '{n} jour',
  'assistant.growth.cart.done': 'Relance des paniers activée ✅ Suivez-la dans /admin/paniers-abandonnes',
  'assistant.growth.whatsapp.ask': 'Quand un client vous écrit sur WhatsApp depuis une fiche produit, voulez-vous un message prêt à l’emploi avec le nom du produit et son lien ?',
  'assistant.growth.whatsapp.pick': 'Choisissez le message. Le nom du produit et le lien sont remplis automatiquement.',
  'assistant.growth.whatsapp.done': 'Message WhatsApp enregistré ✅ Modifiable dans /admin/reglages',
  'assistant.growth.loyalty.ask': 'Voulez-vous récompenser vos clients fidèles avec des points échangeables contre des réductions ?',
  'assistant.growth.loyalty.points': 'Combien de points gagne un client pour chaque MAD dépensé ?',
  'assistant.growth.loyalty.value': 'Et combien vaut un point, en MAD, au moment de l’utiliser ?',
  'assistant.growth.loyalty.confirm': 'Voici le programme de fidélité. Je l’active ?',
  'assistant.growth.loyalty.summary.points': 'Points par MAD dépensé',
  'assistant.growth.loyalty.summary.value': 'Valeur d’un point',
  'assistant.growth.loyalty.enable': 'Activer',
  'assistant.growth.loyalty.done': 'Programme de fidélité activé ✅',
  'assistant.growth.domain.ask': 'Avez-vous votre propre nom de domaine (par exemple maboutique.ma) pour remplacer l’adresse fournie par la plateforme ?',
  'assistant.growth.domain.field': 'Quel est ce nom de domaine ? Sans https://',
  'assistant.growth.domain.placeholder': 'Ex. : maboutique.ma',
  'assistant.growth.domain.saved': 'Domaine enregistré. Chez votre registrar (ou Cloudflare), créez un enregistrement CNAME : nom « {host} », cible « {target} ». La propagation prend de quelques minutes à 24 h. Quand c’est fait, je vérifie ?',
  'assistant.growth.domain.verifyAsk': 'Le domaine {host} est enregistré mais pas encore vérifié. Enregistrement CNAME attendu : cible « {target} ». Je vérifie maintenant ?',
  'assistant.growth.domain.ok': 'Domaine vérifié ✅ Votre boutique répond sur https://{host}',
  'assistant.growth.domain.pending': 'Pas encore visible : la propagation DNS peut prendre jusqu’à 24 h. Revenez plus tard et je revérifierai.',
  'assistant.growth.done': 'Fonctions Pro terminées 🎉',
  'assistant.growth.error': 'Impossible de continuer : {msg}',
  'assistant.legal.start': 'Conformité et données (CNDP)',
  'assistant.legal.intro': 'Vérifions les points légaux de votre boutique : pages obligatoires, consentement aux cookies et durée de conservation des données clients. Chaque étape peut être passée.',
  'assistant.legal.nothing': 'Tout est déjà en place de ce côté ✅',
  'assistant.legal.pages.ask': 'Votre boutique n’a pas de politique de confidentialité. Voulez-vous que je crée les pages légales (mentions légales, conditions de vente, retours, confidentialité) à partir de modèles pré-remplis avec vos coordonnées ?',
  'assistant.legal.pages.done': '{n} page(s) créée(s) ✅ Ce sont des modèles génériques : relisez-les, complétez les passages entre crochets et faites-les valider dans /admin/pages',
  'assistant.legal.pages.none': 'Les pages légales existaient déjà ; j’ai seulement relié la politique de confidentialité ✅',
  'assistant.legal.cookies.ask': 'Vous utilisez des pixels de suivi mais le bandeau de consentement aux cookies est désactivé. Il est recommandé de demander l’accord des visiteurs avant de les suivre. Je l’active ?',
  'assistant.legal.cookies.done': 'Bandeau de consentement activé ✅',
  'assistant.legal.retention.ask': 'Combien de temps conservez-vous les données de vos clients ? Il est recommandé de fixer une durée précise. Voulez-vous la définir maintenant ?',
  'assistant.legal.retention.pick': 'Choisissez la durée de conservation.',
  'assistant.legal.retention.months': '{n} mois',
  'assistant.legal.retention.years': '{n} an(s)',
  'assistant.legal.retention.done': 'Durée de conservation enregistrée ✅ Modifiable dans /admin/reglages',
  'assistant.legal.done': 'Conformité terminée 🎉',
  'assistant.legal.error': 'Impossible de continuer : {msg}',
  'assistant.manage.start': 'Modifier ou supprimer l’existant',
  'assistant.manage.type': 'Que voulez-vous modifier ?',
  'assistant.manage.type.product': 'Un produit',
  'assistant.manage.type.category': 'Une catégorie',
  'assistant.manage.search.product': 'Quel produit ? Tapez son nom (ou une partie), ou choisissez parmi les plus récents.',
  'assistant.manage.search.category': 'Quelle catégorie ? Tapez son nom (ou une partie), ou choisissez ci-dessous.',
  'assistant.manage.search.placeholder': 'Nom à chercher',
  'assistant.manage.empty.product': 'Votre boutique n’a pas encore de produit.',
  'assistant.manage.empty.category': 'Votre boutique n’a pas encore de catégorie.',
  'assistant.manage.notfound': 'Je n’ai rien trouvé pour « {q} ». Essayez un autre mot.',
  'assistant.manage.choose': 'Plusieurs résultats, lequel voulez-vous ?',
  'assistant.manage.action': 'Que voulez-vous faire avec « {name} » ?',
  'assistant.manage.action.price': 'Changer le prix',
  'assistant.manage.action.stock': 'Changer le stock',
  'assistant.manage.action.name': 'Renommer',
  'assistant.manage.action.hide': 'Masquer de la boutique',
  'assistant.manage.action.show': 'Réafficher',
  'assistant.manage.action.delete': 'Supprimer',
  'assistant.manage.price.ask': 'Nouveau prix de « {name} » en MAD ? (actuel : {current} MAD)',
  'assistant.manage.stock.ask': 'Nouveau stock de « {name} » ? (actuel : {current})',
  'assistant.manage.name.ask': 'Nouveau nom de la catégorie ? (actuel : {current})',
  'assistant.manage.price.done': 'Prix mis à jour ✅ {name} : {from} → {to} MAD',
  'assistant.manage.stock.done': 'Stock mis à jour ✅ {name} : {from} → {to}',
  'assistant.manage.name.done': 'Catégorie renommée ✅ {from} → {to}',
  'assistant.manage.hide.done': '« {name} » est masquée de la boutique ✅ Vous pourrez la réafficher ici.',
  'assistant.manage.show.done': '« {name} » est de nouveau visible ✅',
  'assistant.manage.variants': '« {name} » a des variantes (taille, couleur…). Modifiez son prix et son stock dans /admin/produits pour ne rien perdre.',
  'assistant.manage.delete.product': 'Supprimer ce produit ? Il disparaîtra de la boutique.',
  'assistant.manage.delete.category': 'Supprimer cette catégorie ? Elle disparaîtra de la boutique.',
  'assistant.manage.delete.confirm': 'Oui, supprimer',
  'assistant.manage.delete.done': '« {name} » supprimé ✅',
  'assistant.manage.summary.item': 'Élément',
  'assistant.manage.summary.price': 'Prix',
  'assistant.manage.summary.products': 'Produits',
  'assistant.manage.again': 'Autre chose à modifier ?',
  'assistant.manage.done': 'Modifications terminées 🎉',
  'assistant.manage.error': 'Impossible de continuer : {msg}',
  'assistant.content.start': 'Contact, FAQ et page Contact',
  'assistant.content.intro': 'Complétons les informations que vos visiteurs cherchent : email, ville, présentation, page de questions fréquentes et page de contact. Chaque étape peut être passée.',
  'assistant.content.nothing': 'Tout est déjà en place de ce côté ✅',
  'assistant.content.email.ask': 'Quelle adresse email les clients peuvent-ils utiliser pour vous écrire ?',
  'assistant.content.email.placeholder': 'Ex. : contact@maboutique.ma',
  'assistant.content.email.saved': 'Email enregistré ✅',
  'assistant.content.city.ask': 'Dans quelle ville êtes-vous basé ?',
  'assistant.content.city.placeholder': 'Ex. : Casablanca',
  'assistant.content.city.saved': 'Ville enregistrée ✅',
  'assistant.content.about.ask': 'Voici une courte présentation de votre boutique. Utilisez-la telle quelle ou écrivez la vôtre (20 caractères minimum).',
  'assistant.content.about.placeholder': 'Votre présentation',
  'assistant.content.about.saved': 'Présentation enregistrée ✅',
  'assistant.content.faq.ask': 'Voulez-vous une page « Questions fréquentes » ? Je la remplis avec des réponses tirées de vos réglages (commande, paiement, livraison, contact) et je l’ajoute au menu.',
  'assistant.content.faq.done': 'Page FAQ créée et ajoutée au menu ✅ Complétez-la dans /admin/pages (retours, garanties…)',
  'assistant.content.contactPage.ask': 'Voulez-vous une page « Contact » avec un formulaire pour que les visiteurs vous écrivent ? Je l’ajoute au menu.',
  'assistant.content.contactPage.done': 'Page Contact créée et ajoutée au menu ✅ Les messages arrivent dans vos contacts.',
  'assistant.content.team': 'Pour ajouter un collaborateur, ouvrez /admin/membres : il faut choisir ses droits et définir son mot de passe, ce que je ne fais pas dans le chat par sécurité.',
  'assistant.content.done': 'Contenu de base terminé 🎉',
  'assistant.content.error': 'Impossible de continuer : {msg}',
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
  'assistant.design.start': 'Customize theme, header and pages',
  'assistant.design.intro': 'Let’s go: we’ll pick your store’s look and header, then create the pages you need. Any step can be skipped.',
  'assistant.design.theme.ask': 'Which style for your store? The theme sets the design, colors and layout in one go.',
  'assistant.design.theme.classic': 'Classic',
  'assistant.design.theme.classic.desc': 'Clean e-commerce storefront with a hero photo and rounded grids.',
  'assistant.design.theme.minimal': 'Minimal',
  'assistant.design.theme.minimal.desc': 'Clean editorial look: few sections, product first.',
  'assistant.design.theme.bold': 'Bold',
  'assistant.design.theme.bold.desc': 'Dark “flash sale” mood, big buttons and banners.',
  'assistant.design.theme.elegant': 'Elegant',
  'assistant.design.theme.elegant.desc': 'Luxury magazine feel: centered titles, italics, round categories.',
  'assistant.design.theme.pro': 'Pro',
  'assistant.design.theme.active': 'Active',
  'assistant.design.theme.locked': 'This theme is part of the Pro plan. Pick Classic or Minimal, or upgrade to Pro in /admin/reglages.',
  'assistant.design.theme.same': 'The “{name}” theme is already active, we’ll keep it.',
  'assistant.design.theme.done': 'Theme “{name}” applied ✅ Its colors and fonts are set up; you can fine-tune them afterwards.',
  'assistant.design.layout.ask': 'How should the header (logo and menu) be laid out?',
  'assistant.design.layout.inline': 'Logo left, inline menu',
  'assistant.design.layout.centered': 'Centered logo',
  'assistant.design.layout.stacked': 'Logo above the menu',
  'assistant.design.layout.done': 'Header updated ✅',
  'assistant.design.search.ask': 'Do you want a search bar in the header?',
  'assistant.design.search.done': 'Noted ✅',
  'assistant.design.promo.ask': 'Do you want an announcement banner at the very top (free shipping, promo…)?',
  'assistant.design.promo.text': 'What message should it show? Pick a suggestion or write your own.',
  'assistant.design.promo.placeholder': 'Your message (100 characters max)',
  'assistant.design.promo.s1': 'Free shipping from 500 MAD',
  'assistant.design.promo.s2': 'Cash on delivery across Morocco',
  'assistant.design.promo.s3': '10% off your first order',
  'assistant.design.promo.done': 'Announcement banner enabled ✅',
  'assistant.design.home.ask': 'Do you want a complete home page (banner, categories, products, reviews)? You can edit everything afterwards.',
  'assistant.design.home.done': 'Home page created and published ✅ /admin/pages',
  'assistant.design.about.ask': 'Do you want an “About” page to introduce your store?',
  'assistant.design.about.done': 'About page created ✅ Complete it in /admin/pages',
  'assistant.design.legal.ask': 'Do you want to create the legal pages (legal notice, terms of sale, privacy, returns)?',
  'assistant.design.legal.done': '{n} legal page(s) created ✅ These are templates: have them reviewed before opening the store.',
  'assistant.design.social.instagram': 'What is your Instagram page link? (optional)',
  'assistant.design.social.facebook': 'And your Facebook page link? (optional)',
  'assistant.design.social.tiktok': 'And your TikTok account? (optional)',
  'assistant.design.social.placeholder.instagram': 'instagram.com/your-store',
  'assistant.design.social.placeholder.facebook': 'facebook.com/your-store',
  'assistant.design.social.placeholder.tiktok': 'tiktok.com/@your-store',
  'assistant.design.done': 'Your store is customized 🎉 Open the live preview to see the result: /admin/parametres',
  'assistant.design.error': 'Couldn’t continue: {msg}',
  'assistant.ship.start': 'Set up shipping',
  'assistant.ship.intro': 'Let’s talk shipping: we’ll add your carriers with their fees and delivery times. Without a carrier, customers can’t complete their order.',
  'assistant.ship.have': 'You already have {n} carrier(s). Would you like to add one?',
  'assistant.ship.name.ask': 'Which carrier or delivery method do you offer? Pick a suggestion or type the name.',
  'assistant.ship.name.placeholder': 'E.g. Delivered by me',
  'assistant.ship.name.own': 'Delivered by me',
  'assistant.ship.fee.ask': 'What are its delivery fees, in MAD? (0 if shipping is free)',
  'assistant.ship.fee.placeholder': 'E.g. 30',
  'assistant.ship.free.ask': 'From what order amount does shipping become free with this carrier? Skip if it never does.',
  'assistant.ship.free.placeholder': 'E.g. 500',
  'assistant.ship.eta.ask': 'How many days does delivery take? Enter a number or a range.',
  'assistant.ship.eta.placeholder': 'E.g. 2-4',
  'assistant.ship.confirm': 'Here’s this carrier. Shall I add it?',
  'assistant.ship.summary.name': 'Name',
  'assistant.ship.summary.fee': 'Fee',
  'assistant.ship.summary.free': 'Free from',
  'assistant.ship.summary.eta': 'Delivery time',
  'assistant.ship.summary.days': '{min}-{max} days',
  'assistant.ship.add': 'Add carrier',
  'assistant.ship.created': 'Carrier “{name}” added ✅ Customers can choose it at checkout.',
  'assistant.ship.default': 'Set as the default carrier ✅',
  'assistant.ship.another': 'Would you like to add another carrier?',
  'assistant.ship.done': 'Shipping is ready ✅ You can edit your carriers in /admin/livraison',
  'assistant.ship.error': 'Couldn’t continue: {msg}',
  'assistant.pay.start': 'Set up card payments',
  'assistant.pay.intro': 'Let’s set up online payments. Your keys go straight and securely to your store: they never go through the assistant or the conversation.',
  'assistant.pay.provider.ask': 'Which payment provider do you want to connect?',
  'assistant.pay.provider.stripe': 'Stripe',
  'assistant.pay.provider.paypal': 'PayPal',
  'assistant.pay.provider.cmi': 'CMI (Moroccan bank)',
  'assistant.pay.provider.ready': 'active',
  'assistant.pay.provider.later': 'Later',
  'assistant.pay.help.stripe': 'In your Stripe account, go to Developers then API keys and copy the publishable key (pk_…) and the secret key (sk_…). Start with the test keys.',
  'assistant.pay.help.paypal': 'In your PayPal Developer account, create an app and copy the client ID and secret. Start with sandbox mode.',
  'assistant.pay.help.cmi': 'CMI payment requires a contract with your bank, which gives you the client ID (clientid) and the store key (storekey).',
  'assistant.pay.field.stripePk': 'Paste your Stripe publishable key (it starts with pk_).',
  'assistant.pay.field.stripeSk': 'Paste your Stripe secret key (it starts with sk_). It won’t be displayed.',
  'assistant.pay.field.paypalId': 'Paste the PayPal client ID.',
  'assistant.pay.field.paypalSecret': 'Paste the PayPal secret. It won’t be displayed.',
  'assistant.pay.field.cmiId': 'What is your CMI client ID?',
  'assistant.pay.field.cmiKey': 'Paste your CMI store key. It won’t be displayed.',
  'assistant.pay.field.placeholder': 'Paste here',
  'assistant.pay.field.show': 'Show',
  'assistant.pay.invalid': 'That format isn’t valid. Check that you copied the right key, in full.',
  'assistant.pay.mode.ask': 'Which PayPal mode? “Sandbox” is for testing, no real payments.',
  'assistant.pay.mode.sandbox': 'Sandbox (testing)',
  'assistant.pay.mode.live': 'Live (real)',
  'assistant.pay.testing': 'Checking the keys…',
  'assistant.pay.ok': '{name} is ready ✅ {message}',
  'assistant.pay.fail': '{name} test failed: {msg} Check your keys and try again.',
  'assistant.pay.live': 'These keys are live: real payments will be possible as soon as the provider is active.',
  'assistant.pay.another': 'Would you like to connect another provider?',
  'assistant.pay.done': 'Online payments configured. Make a test payment from your store before opening it. Settings: /admin/reglages',
  'assistant.pay.error': 'Couldn’t continue: {msg}',
  'assistant.secret.blocked': 'For your security I’m not sending this message: it looks like a key or a password. Never paste them in the chat; use the “Set up card payments” flow instead.',
  'assistant.mkt.start': 'Marketing and SEO',
  'assistant.mkt.intro': 'Let’s see how to promote your store: ad tracking, Google visibility and a first promo code. Any step can be skipped.',
  'assistant.mkt.nothing': 'Everything is already in place here ✅ You can fine-tune your settings in /admin/reglages',
  'assistant.mkt.pixels.ask': 'Do you want to track sales and ads with pixels (Meta, TikTok, Google)? Your plan allows {max} pixel(s), {used} used.',
  'assistant.mkt.pixels.askUnlimited': 'Do you want to track sales and ads with pixels (Meta, TikTok, Google)?',
  'assistant.mkt.pixels.meta': 'What is your Meta pixel ID (Facebook and Instagram)? It’s a 15 or 16 digit number shown in Events Manager.',
  'assistant.mkt.pixels.tiktok': 'And your TikTok pixel ID? (letters and digits)',
  'assistant.mkt.pixels.ga': 'And your Google ID: Analytics (G-XXXXXXXXXX) or Google Ads (AW-123456789)?',
  'assistant.mkt.pixels.placeholder.meta': 'E.g. 123456789012345',
  'assistant.mkt.pixels.placeholder.tiktok': 'E.g. C4ABCDEF1234567890XY',
  'assistant.mkt.pixels.placeholder.ga': 'E.g. G-ABC123DEF4',
  'assistant.mkt.pixels.saved': 'Pixel saved ✅',
  'assistant.mkt.pixels.limit': 'Your {plan} plan allows {max} pixel(s) and they’re all in use. To add more, upgrade your plan in /admin/reglages',
  'assistant.mkt.homeSeo.ask': 'Here’s what I suggest so your home page shows well on Google. Shall I apply it?',
  'assistant.mkt.homeSeo.title': 'Title',
  'assistant.mkt.homeSeo.description': 'Description',
  'assistant.mkt.homeSeo.apply': 'Apply',
  'assistant.mkt.homeSeo.done': 'Title and description saved ✅ Editable in /admin/pages',
  'assistant.mkt.catSeo.ask': '{n} categories have no Google title or description. Shall I generate them all?',
  'assistant.mkt.catSeo.done': '{n} categories updated ✅ Review them in /admin/categories',
  'assistant.mkt.promo.ask': 'Would you like to create a first promo code (for example to welcome new customers)?',
  'assistant.mkt.promo.code': 'What code will customers enter? Letters and digits, 3 to 20 characters.',
  'assistant.mkt.promo.code.placeholder': 'E.g. WELCOME10',
  'assistant.mkt.promo.kind': 'What type of discount?',
  'assistant.mkt.promo.kind.percentage': 'Percentage (%)',
  'assistant.mkt.promo.kind.fixed': 'Fixed amount (MAD)',
  'assistant.mkt.promo.value.percentage': 'What discount percentage? (1 to 90)',
  'assistant.mkt.promo.value.fixed': 'What discount amount, in MAD?',
  'assistant.mkt.promo.value.placeholder': 'E.g. 10',
  'assistant.mkt.promo.uses': 'How many times can this code be used in total? Skip for no limit.',
  'assistant.mkt.promo.confirm': 'Here’s the promo code. Shall I create it?',
  'assistant.mkt.promo.summary.code': 'Code',
  'assistant.mkt.promo.summary.discount': 'Discount',
  'assistant.mkt.promo.summary.uses': 'Max uses',
  'assistant.mkt.promo.summary.unlimited': 'Unlimited',
  'assistant.mkt.promo.create': 'Create code',
  'assistant.mkt.promo.done': 'Code “{code}” created ✅ Manage your codes in /admin/codes-promo',
  'assistant.mkt.done': 'Marketing and SEO done 🎉',
  'assistant.mkt.error': 'Couldn’t continue: {msg}',
  'assistant.growth.start': 'Pro features: sales and domain',
  'assistant.growth.intro': 'Let’s look at the options in your plan that help you sell more: cart recovery, WhatsApp, loyalty and your own domain name. Any step can be skipped.',
  'assistant.growth.nothing': 'Everything is already in place here ✅',
  'assistant.growth.locked': 'Cart recovery, loyalty, WhatsApp Business and custom domains come with higher plans. You can change plan in /admin/reglages',
  'assistant.growth.cart.ask': 'Do you want to automatically follow up with customers who leave items in their cart without ordering?',
  'assistant.growth.cart.delay': 'How long should we wait before following up?',
  'assistant.growth.delay.minutes': '{n} min',
  'assistant.growth.delay.hours': '{n} h',
  'assistant.growth.delay.day': '{n} day',
  'assistant.growth.cart.done': 'Cart recovery is on ✅ Follow it in /admin/paniers-abandonnes',
  'assistant.growth.whatsapp.ask': 'When a customer messages you on WhatsApp from a product page, do you want a ready-made message with the product name and link?',
  'assistant.growth.whatsapp.pick': 'Pick the message. The product name and link are filled in automatically.',
  'assistant.growth.whatsapp.done': 'WhatsApp message saved ✅ Editable in /admin/reglages',
  'assistant.growth.loyalty.ask': 'Do you want to reward loyal customers with points they can exchange for discounts?',
  'assistant.growth.loyalty.points': 'How many points does a customer earn per MAD spent?',
  'assistant.growth.loyalty.value': 'And how much is one point worth, in MAD, when it is used?',
  'assistant.growth.loyalty.confirm': 'Here is the loyalty program. Shall I turn it on?',
  'assistant.growth.loyalty.summary.points': 'Points per MAD spent',
  'assistant.growth.loyalty.summary.value': 'Value of one point',
  'assistant.growth.loyalty.enable': 'Turn on',
  'assistant.growth.loyalty.done': 'Loyalty program is on ✅',
  'assistant.growth.domain.ask': 'Do you have your own domain name (for example myshop.com) to replace the platform address?',
  'assistant.growth.domain.field': 'What is that domain name? Without https://',
  'assistant.growth.domain.placeholder': 'E.g. myshop.com',
  'assistant.growth.domain.saved': 'Domain saved. At your registrar (or Cloudflare), create a CNAME record: name “{host}”, target “{target}”. Propagation takes from a few minutes to 24 h. When it’s done, shall I check?',
  'assistant.growth.domain.verifyAsk': 'The domain {host} is saved but not verified yet. Expected CNAME record: target “{target}”. Shall I check now?',
  'assistant.growth.domain.ok': 'Domain verified ✅ Your store is live at https://{host}',
  'assistant.growth.domain.pending': 'Not visible yet: DNS propagation can take up to 24 h. Come back later and I will check again.',
  'assistant.growth.done': 'Pro features done 🎉',
  'assistant.growth.error': 'Couldn’t continue: {msg}',
  'assistant.legal.start': 'Compliance and data (CNDP)',
  'assistant.legal.intro': 'Let’s check your store’s legal basics: required pages, cookie consent and customer data retention. Any step can be skipped.',
  'assistant.legal.nothing': 'Everything is already in place here ✅',
  'assistant.legal.pages.ask': 'Your store has no privacy policy. Shall I create the legal pages (legal notice, terms of sale, returns, privacy) from templates pre-filled with your contact details?',
  'assistant.legal.pages.done': '{n} page(s) created ✅ These are generic templates: review them, fill in the bracketed parts and have them validated in /admin/pages',
  'assistant.legal.pages.none': 'The legal pages already existed; I only linked the privacy policy ✅',
  'assistant.legal.cookies.ask': 'You use tracking pixels but the cookie consent banner is off. It is recommended to ask visitors’ consent before tracking them. Shall I turn it on?',
  'assistant.legal.cookies.done': 'Consent banner turned on ✅',
  'assistant.legal.retention.ask': 'How long do you keep your customers’ data? It is recommended to set a clear period. Do you want to set it now?',
  'assistant.legal.retention.pick': 'Pick the retention period.',
  'assistant.legal.retention.months': '{n} months',
  'assistant.legal.retention.years': '{n} year(s)',
  'assistant.legal.retention.done': 'Retention period saved ✅ Editable in /admin/reglages',
  'assistant.legal.done': 'Compliance done 🎉',
  'assistant.legal.error': 'Couldn’t continue: {msg}',
  'assistant.manage.start': 'Edit or delete existing items',
  'assistant.manage.type': 'What would you like to change?',
  'assistant.manage.type.product': 'A product',
  'assistant.manage.type.category': 'A category',
  'assistant.manage.search.product': 'Which product? Type its name (or part of it), or pick one of the most recent.',
  'assistant.manage.search.category': 'Which category? Type its name (or part of it), or pick below.',
  'assistant.manage.search.placeholder': 'Name to search',
  'assistant.manage.empty.product': 'Your store has no products yet.',
  'assistant.manage.empty.category': 'Your store has no categories yet.',
  'assistant.manage.notfound': 'I found nothing for “{q}”. Try another word.',
  'assistant.manage.choose': 'Several results, which one do you mean?',
  'assistant.manage.action': 'What do you want to do with “{name}”?',
  'assistant.manage.action.price': 'Change the price',
  'assistant.manage.action.stock': 'Change the stock',
  'assistant.manage.action.name': 'Rename',
  'assistant.manage.action.hide': 'Hide from the store',
  'assistant.manage.action.show': 'Show again',
  'assistant.manage.action.delete': 'Delete',
  'assistant.manage.price.ask': 'New price for “{name}” in MAD? (current: {current} MAD)',
  'assistant.manage.stock.ask': 'New stock for “{name}”? (current: {current})',
  'assistant.manage.name.ask': 'New category name? (current: {current})',
  'assistant.manage.price.done': 'Price updated ✅ {name}: {from} → {to} MAD',
  'assistant.manage.stock.done': 'Stock updated ✅ {name}: {from} → {to}',
  'assistant.manage.name.done': 'Category renamed ✅ {from} → {to}',
  'assistant.manage.hide.done': '“{name}” is hidden from the store ✅ You can show it again here.',
  'assistant.manage.show.done': '“{name}” is visible again ✅',
  'assistant.manage.variants': '“{name}” has variants (size, color…). Edit its price and stock in /admin/produits so nothing is lost.',
  'assistant.manage.delete.product': 'Delete this product? It will disappear from the store.',
  'assistant.manage.delete.category': 'Delete this category? It will disappear from the store.',
  'assistant.manage.delete.confirm': 'Yes, delete',
  'assistant.manage.delete.done': '“{name}” deleted ✅',
  'assistant.manage.summary.item': 'Item',
  'assistant.manage.summary.price': 'Price',
  'assistant.manage.summary.products': 'Products',
  'assistant.manage.again': 'Anything else to change?',
  'assistant.manage.done': 'Changes done 🎉',
  'assistant.manage.error': 'Couldn’t continue: {msg}',
  'assistant.content.start': 'Contact details, FAQ and Contact page',
  'assistant.content.intro': 'Let’s complete what visitors look for: email, city, presentation, a FAQ page and a contact page. Any step can be skipped.',
  'assistant.content.nothing': 'Everything is already in place here ✅',
  'assistant.content.email.ask': 'Which email address can customers use to write to you?',
  'assistant.content.email.placeholder': 'E.g. contact@myshop.com',
  'assistant.content.email.saved': 'Email saved ✅',
  'assistant.content.city.ask': 'Which city are you based in?',
  'assistant.content.city.placeholder': 'E.g. Casablanca',
  'assistant.content.city.saved': 'City saved ✅',
  'assistant.content.about.ask': 'Here is a short presentation of your store. Use it as is or write your own (20 characters minimum).',
  'assistant.content.about.placeholder': 'Your presentation',
  'assistant.content.about.saved': 'Presentation saved ✅',
  'assistant.content.faq.ask': 'Would you like a “Frequently asked questions” page? I will fill it with answers taken from your settings (ordering, payment, delivery, contact) and add it to the menu.',
  'assistant.content.faq.done': 'FAQ page created and added to the menu ✅ Complete it in /admin/pages (returns, warranty…)',
  'assistant.content.contactPage.ask': 'Would you like a “Contact” page with a form so visitors can write to you? I will add it to the menu.',
  'assistant.content.contactPage.done': 'Contact page created and added to the menu ✅ Messages reach your leads.',
  'assistant.content.team': 'To add a team member, open /admin/membres: you need to choose their permissions and set their password, which I don’t do in chat for security.',
  'assistant.content.done': 'Basic content done 🎉',
  'assistant.content.error': 'Couldn’t continue: {msg}',
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
  'assistant.design.start': 'تخصيص القالب والترويسة والصفحات',
  'assistant.design.intro': 'هيا بنا: سنختار مظهر متجرك وترويسته، ثم ننشئ الصفحات اللازمة. يمكنك تخطّي أي خطوة.',
  'assistant.design.theme.ask': 'أي نمط لمتجرك؟ القالب يضبط التصميم والألوان والتخطيط دفعة واحدة.',
  'assistant.design.theme.classic': 'كلاسيكي',
  'assistant.design.theme.classic.desc': 'واجهة متجر واضحة بصورة رئيسية وشبكات مستديرة.',
  'assistant.design.theme.minimal': 'بسيط',
  'assistant.design.theme.minimal.desc': 'مظهر تحريري أنيق: أقسام قليلة والمنتج أولًا.',
  'assistant.design.theme.bold': 'جريء',
  'assistant.design.theme.bold.desc': 'أجواء داكنة لعروض الفلاش مع أزرار ولافتات كبيرة.',
  'assistant.design.theme.elegant': 'أنيق',
  'assistant.design.theme.elegant.desc': 'طابع مجلة فاخرة: عناوين في الوسط وفئات دائرية.',
  'assistant.design.theme.pro': 'برو',
  'assistant.design.theme.active': 'مفعّل',
  'assistant.design.theme.locked': 'هذا القالب مخصص لخطة برو. اختر الكلاسيكي أو البسيط، أو انتقل إلى خطة برو من /admin/reglages.',
  'assistant.design.theme.same': 'قالب «{name}» مفعّل بالفعل، سنُبقي عليه.',
  'assistant.design.theme.done': 'تم تطبيق قالب «{name}» ✅ تمت تهيئة ألوانه وخطوطه ويمكنك تعديلها لاحقًا.',
  'assistant.design.layout.ask': 'كيف نرتّب الترويسة (الشعار والقائمة)؟',
  'assistant.design.layout.inline': 'الشعار يسارًا والقائمة بجانبه',
  'assistant.design.layout.centered': 'شعار في الوسط',
  'assistant.design.layout.stacked': 'الشعار فوق القائمة',
  'assistant.design.layout.done': 'تم تحديث الترويسة ✅',
  'assistant.design.search.ask': 'هل تريد شريط بحث في الترويسة؟',
  'assistant.design.search.done': 'تم ✅',
  'assistant.design.promo.ask': 'هل تريد لافتة إعلان في أعلى الموقع (توصيل مجاني، عرض…)؟',
  'assistant.design.promo.text': 'ما الرسالة التي ستظهر؟ اختر اقتراحًا أو اكتب رسالتك.',
  'assistant.design.promo.placeholder': 'رسالتك (100 حرف كحد أقصى)',
  'assistant.design.promo.s1': 'توصيل مجاني ابتداءً من 500 درهم',
  'assistant.design.promo.s2': 'الدفع عند الاستلام في كل أنحاء المغرب',
  'assistant.design.promo.s3': 'خصم 10% على طلبك الأول',
  'assistant.design.promo.done': 'تم تفعيل لافتة الإعلان ✅',
  'assistant.design.home.ask': 'هل تريد صفحة رئيسية كاملة (لافتة وفئات ومنتجات وآراء)؟ ويمكنك تعديل كل شيء لاحقًا.',
  'assistant.design.home.done': 'تم إنشاء الصفحة الرئيسية ونشرها ✅ /admin/pages',
  'assistant.design.about.ask': 'هل تريد صفحة «من نحن» لتقديم متجرك؟',
  'assistant.design.about.done': 'تم إنشاء صفحة «من نحن» ✅ أكملها من /admin/pages',
  'assistant.design.legal.ask': 'هل تريد إنشاء الصفحات القانونية (إشعار قانوني، شروط البيع، الخصوصية، الإرجاع)؟',
  'assistant.design.legal.done': 'تم إنشاء {n} صفحة قانونية ✅ هذه نماذج: اطلب مراجعتها قبل افتتاح المتجر.',
  'assistant.design.social.instagram': 'ما رابط صفحتك على إنستغرام؟ (اختياري)',
  'assistant.design.social.facebook': 'ورابط صفحتك على فيسبوك؟ (اختياري)',
  'assistant.design.social.tiktok': 'وحسابك على تيك توك؟ (اختياري)',
  'assistant.design.social.placeholder.instagram': 'instagram.com/your-store',
  'assistant.design.social.placeholder.facebook': 'facebook.com/your-store',
  'assistant.design.social.placeholder.tiktok': 'tiktok.com/@your-store',
  'assistant.design.done': 'تم تخصيص متجرك 🎉 افتح المعاينة المباشرة لرؤية النتيجة: /admin/parametres',
  'assistant.design.error': 'تعذّرت المتابعة: {msg}',
  'assistant.ship.start': 'إعداد التوصيل',
  'assistant.ship.intro': 'لنتحدث عن التوصيل: سنضيف شركات التوصيل مع رسومها ومدّتها. بدون شركة توصيل لا يستطيع الزبائن إتمام طلباتهم.',
  'assistant.ship.have': 'لديك بالفعل {n} شركة توصيل. هل تريد إضافة واحدة؟',
  'assistant.ship.name.ask': 'أي شركة توصيل أو طريقة توصيل تقدّمها؟ اختر اقتراحًا أو اكتب الاسم.',
  'assistant.ship.name.placeholder': 'مثال: التوصيل بنفسي',
  'assistant.ship.name.own': 'التوصيل بنفسي',
  'assistant.ship.fee.ask': 'ما رسوم التوصيل بالدرهم؟ (0 إذا كان التوصيل مجانيًا)',
  'assistant.ship.fee.placeholder': 'مثال: 30',
  'assistant.ship.free.ask': 'ابتداءً من أي مبلغ يصبح التوصيل مجانيًا مع هذه الشركة؟ تخطَّ إن لم يكن مجانيًا أبدًا.',
  'assistant.ship.free.placeholder': 'مثال: 500',
  'assistant.ship.eta.ask': 'كم يوم يستغرق التوصيل؟ اكتب رقمًا أو مجالًا.',
  'assistant.ship.eta.placeholder': 'مثال: 2-4',
  'assistant.ship.confirm': 'هذه شركة التوصيل. هل أضيفها؟',
  'assistant.ship.summary.name': 'الاسم',
  'assistant.ship.summary.fee': 'الرسوم',
  'assistant.ship.summary.free': 'مجاني ابتداءً من',
  'assistant.ship.summary.eta': 'المدة',
  'assistant.ship.summary.days': '{min}-{max} أيام',
  'assistant.ship.add': 'إضافة شركة التوصيل',
  'assistant.ship.created': 'تمت إضافة «{name}» ✅ يمكن للزبائن اختيارها عند الطلب.',
  'assistant.ship.default': 'تم تعيينها كشركة التوصيل الافتراضية ✅',
  'assistant.ship.another': 'هل تريد إضافة شركة توصيل أخرى؟',
  'assistant.ship.done': 'التوصيل جاهز ✅ يمكنك تعديل شركات التوصيل من /admin/livraison',
  'assistant.ship.error': 'تعذّرت المتابعة: {msg}',
  'assistant.pay.start': 'إعداد الدفع بالبطاقة',
  'assistant.pay.intro': 'لنُعدّ الدفع الإلكتروني. تذهب مفاتيحك مباشرة وبأمان إلى متجرك: ولا تمرّ أبدًا عبر المساعد أو المحادثة.',
  'assistant.pay.provider.ask': 'أي مزوّد دفع تريد ربطه؟',
  'assistant.pay.provider.stripe': 'Stripe',
  'assistant.pay.provider.paypal': 'PayPal',
  'assistant.pay.provider.cmi': 'CMI (بنك مغربي)',
  'assistant.pay.provider.ready': 'مفعّل',
  'assistant.pay.provider.later': 'لاحقًا',
  'assistant.pay.help.stripe': 'في حسابك على Stripe، من قسم المطوّرين ثم مفاتيح API، انسخ المفتاح العام (pk_…) والمفتاح السري (sk_…). ابدأ بمفاتيح الاختبار.',
  'assistant.pay.help.paypal': 'في حساب PayPal Developer أنشئ تطبيقًا وانسخ معرّف العميل والسر. ابدأ بوضع sandbox.',
  'assistant.pay.help.cmi': 'يتطلب الدفع عبر CMI عقدًا مع بنكك، وهو من يزوّدك بمعرّف العميل (clientid) ومفتاح المتجر (storekey).',
  'assistant.pay.field.stripePk': 'الصق مفتاح Stripe العام (يبدأ بـ pk_).',
  'assistant.pay.field.stripeSk': 'الصق مفتاح Stripe السري (يبدأ بـ sk_). لن يُعرض.',
  'assistant.pay.field.paypalId': 'الصق معرّف عميل PayPal.',
  'assistant.pay.field.paypalSecret': 'الصق سر PayPal. لن يُعرض.',
  'assistant.pay.field.cmiId': 'ما معرّف عميل CMI الخاص بك؟',
  'assistant.pay.field.cmiKey': 'الصق مفتاح متجر CMI. لن يُعرض.',
  'assistant.pay.field.placeholder': 'الصق هنا',
  'assistant.pay.field.show': 'إظهار',
  'assistant.pay.invalid': 'هذه الصيغة غير صالحة. تأكد من نسخ المفتاح الصحيح كاملًا.',
  'assistant.pay.mode.ask': 'أي وضع لـ PayPal؟ «Sandbox» للتجارب دون مدفوعات حقيقية.',
  'assistant.pay.mode.sandbox': 'Sandbox (تجارب)',
  'assistant.pay.mode.live': 'Live (حقيقي)',
  'assistant.pay.testing': 'جارٍ التحقق من المفاتيح…',
  'assistant.pay.ok': '{name} جاهز ✅ {message}',
  'assistant.pay.fail': 'فشل اختبار {name}: {msg} تحقّق من مفاتيحك ثم أعد المحاولة.',
  'assistant.pay.live': 'هذه المفاتيح حقيقية: ستصبح المدفوعات الحقيقية ممكنة بمجرد تفعيل المزوّد.',
  'assistant.pay.another': 'هل تريد ربط مزوّد آخر؟',
  'assistant.pay.done': 'تم إعداد الدفع الإلكتروني. أجرِ دفعة تجريبية من متجرك قبل افتتاحه. الإعدادات: /admin/reglages',
  'assistant.pay.error': 'تعذّرت المتابعة: {msg}',
  'assistant.secret.blocked': 'لأمانك لن أرسل هذه الرسالة: تبدو كمفتاح أو كلمة مرور. لا تلصقها أبدًا في المحادثة؛ استخدم مسار «إعداد الدفع بالبطاقة».',
  'assistant.mkt.start': 'التسويق وتحسين الظهور',
  'assistant.mkt.intro': 'لنرَ كيف نعرّف بمتجرك: تتبّع الإعلانات، الظهور في غوغل وأول رمز ترويجي. يمكنك تخطّي أي خطوة.',
  'assistant.mkt.nothing': 'كل شيء جاهز هنا ✅ يمكنك ضبط الإعدادات من /admin/reglages',
  'assistant.mkt.pixels.ask': 'هل تريد تتبّع المبيعات والإعلانات عبر البكسل (Meta وTikTok وGoogle)؟ خطتك تسمح بـ {max} بكسل، المستخدم {used}.',
  'assistant.mkt.pixels.askUnlimited': 'هل تريد تتبّع المبيعات والإعلانات عبر البكسل (Meta وTikTok وGoogle)؟',
  'assistant.mkt.pixels.meta': 'ما معرّف بكسل Meta (فيسبوك وإنستغرام)؟ هو رقم من 15 أو 16 خانة يظهر في مدير الأحداث.',
  'assistant.mkt.pixels.tiktok': 'وما معرّف بكسل TikTok؟ (حروف وأرقام)',
  'assistant.mkt.pixels.ga': 'وما معرّفك في Google: Analytics (G-XXXXXXXXXX) أو Google Ads (AW-123456789)؟',
  'assistant.mkt.pixels.placeholder.meta': 'مثال: 123456789012345',
  'assistant.mkt.pixels.placeholder.tiktok': 'مثال: C4ABCDEF1234567890XY',
  'assistant.mkt.pixels.placeholder.ga': 'مثال: G-ABC123DEF4',
  'assistant.mkt.pixels.saved': 'تم حفظ البكسل ✅',
  'assistant.mkt.pixels.limit': 'خطة {plan} تسمح بـ {max} بكسل وكلها مستخدمة. للمزيد انتقل إلى خطة أعلى من /admin/reglages',
  'assistant.mkt.homeSeo.ask': 'هذا ما أقترحه ليظهر صفحتك الرئيسية جيدًا في غوغل. هل أطبّقه؟',
  'assistant.mkt.homeSeo.title': 'العنوان',
  'assistant.mkt.homeSeo.description': 'الوصف',
  'assistant.mkt.homeSeo.apply': 'تطبيق',
  'assistant.mkt.homeSeo.done': 'تم حفظ العنوان والوصف ✅ يمكن تعديلهما من /admin/pages',
  'assistant.mkt.catSeo.ask': '{n} فئة بدون عنوان أو وصف لغوغل. هل أنشئها كلها؟',
  'assistant.mkt.catSeo.done': 'تم تحديث {n} فئة ✅ راجعها من /admin/categories',
  'assistant.mkt.promo.ask': 'هل تريد إنشاء أول رمز ترويجي (مثلًا لاستقبال الزبائن الجدد)؟',
  'assistant.mkt.promo.code': 'ما الرمز الذي سيدخله الزبائن؟ حروف وأرقام من 3 إلى 20 خانة.',
  'assistant.mkt.promo.code.placeholder': 'مثال: WELCOME10',
  'assistant.mkt.promo.kind': 'ما نوع الخصم؟',
  'assistant.mkt.promo.kind.percentage': 'نسبة مئوية (%)',
  'assistant.mkt.promo.kind.fixed': 'مبلغ ثابت (درهم)',
  'assistant.mkt.promo.value.percentage': 'ما نسبة الخصم؟ (من 1 إلى 90)',
  'assistant.mkt.promo.value.fixed': 'ما مبلغ الخصم بالدرهم؟',
  'assistant.mkt.promo.value.placeholder': 'مثال: 10',
  'assistant.mkt.promo.uses': 'كم مرة يمكن استعمال هذا الرمز في المجموع؟ تخطَّ لعدم التحديد.',
  'assistant.mkt.promo.confirm': 'هذا هو الرمز الترويجي. هل أنشئه؟',
  'assistant.mkt.promo.summary.code': 'الرمز',
  'assistant.mkt.promo.summary.discount': 'الخصم',
  'assistant.mkt.promo.summary.uses': 'الحد الأقصى للاستعمال',
  'assistant.mkt.promo.summary.unlimited': 'غير محدود',
  'assistant.mkt.promo.create': 'إنشاء الرمز',
  'assistant.mkt.promo.done': 'تم إنشاء الرمز «{code}» ✅ أدِر رموزك من /admin/codes-promo',
  'assistant.mkt.done': 'انتهى التسويق وتحسين الظهور 🎉',
  'assistant.mkt.error': 'تعذّرت المتابعة: {msg}',
  'assistant.growth.start': 'ميزات برو: المبيعات والنطاق',
  'assistant.growth.intro': 'لنرَ خيارات خطتك التي تزيد المبيعات: تذكير السلال المتروكة وواتساب والولاء ونطاقك الخاص. يمكنك تخطّي أي خطوة.',
  'assistant.growth.nothing': 'كل شيء جاهز هنا ✅',
  'assistant.growth.locked': 'تذكير السلال والولاء وواتساب للأعمال والنطاق الخاص متاحة في الخطط الأعلى. يمكنك تغيير الخطة من /admin/reglages',
  'assistant.growth.cart.ask': 'هل تريد تذكير الزبائن الذين تركوا منتجات في السلة دون إتمام الطلب تلقائيًا؟',
  'assistant.growth.cart.delay': 'بعد كم من الوقت يجب تذكيرهم؟',
  'assistant.growth.delay.minutes': '{n} دقيقة',
  'assistant.growth.delay.hours': '{n} ساعة',
  'assistant.growth.delay.day': '{n} يوم',
  'assistant.growth.cart.done': 'تم تفعيل تذكير السلال ✅ تابعه من /admin/paniers-abandonnes',
  'assistant.growth.whatsapp.ask': 'عندما يراسلك زبون على واتساب من صفحة منتج، هل تريد رسالة جاهزة تتضمن اسم المنتج ورابطه؟',
  'assistant.growth.whatsapp.pick': 'اختر الرسالة. يتم إدراج اسم المنتج والرابط تلقائيًا.',
  'assistant.growth.whatsapp.done': 'تم حفظ رسالة واتساب ✅ يمكن تعديلها من /admin/reglages',
  'assistant.growth.loyalty.ask': 'هل تريد مكافأة زبائنك الأوفياء بنقاط قابلة للتبديل بتخفيضات؟',
  'assistant.growth.loyalty.points': 'كم نقطة يكسب الزبون عن كل درهم يُنفقه؟',
  'assistant.growth.loyalty.value': 'وكم تساوي النقطة الواحدة بالدرهم عند استعمالها؟',
  'assistant.growth.loyalty.confirm': 'هذا هو برنامج الولاء. هل أفعّله؟',
  'assistant.growth.loyalty.summary.points': 'النقاط لكل درهم',
  'assistant.growth.loyalty.summary.value': 'قيمة النقطة',
  'assistant.growth.loyalty.enable': 'تفعيل',
  'assistant.growth.loyalty.done': 'تم تفعيل برنامج الولاء ✅',
  'assistant.growth.domain.ask': 'هل لديك اسم نطاق خاص (مثل myshop.com) ليحل محل عنوان المنصة؟',
  'assistant.growth.domain.field': 'ما هو اسم النطاق؟ بدون https://',
  'assistant.growth.domain.placeholder': 'مثال: myshop.com',
  'assistant.growth.domain.saved': 'تم حفظ النطاق. لدى مزوّد النطاق (أو Cloudflare) أنشئ سجل CNAME: الاسم «{host}» والهدف «{target}». يستغرق الانتشار من بضع دقائق إلى 24 ساعة. عندما تنتهي، هل أتحقق؟',
  'assistant.growth.domain.verifyAsk': 'النطاق {host} محفوظ لكنه لم يُتحقق منه بعد. سجل CNAME المطلوب: الهدف «{target}». هل أتحقق الآن؟',
  'assistant.growth.domain.ok': 'تم التحقق من النطاق ✅ متجرك يعمل على https://{host}',
  'assistant.growth.domain.pending': 'لم يظهر بعد: قد يستغرق انتشار DNS حتى 24 ساعة. عد لاحقًا وسأتحقق مجددًا.',
  'assistant.growth.done': 'انتهت ميزات برو 🎉',
  'assistant.growth.error': 'تعذّرت المتابعة: {msg}',
  'assistant.legal.start': 'الامتثال والبيانات (CNDP)',
  'assistant.legal.intro': 'لنتحقق من الأساسيات القانونية لمتجرك: الصفحات الإلزامية والموافقة على الكوكيز ومدة حفظ بيانات الزبائن. يمكنك تخطّي أي خطوة.',
  'assistant.legal.nothing': 'كل شيء جاهز هنا ✅',
  'assistant.legal.pages.ask': 'متجرك بلا سياسة خصوصية. هل أنشئ الصفحات القانونية (الإشعار القانوني وشروط البيع والإرجاع والخصوصية) من نماذج معبأة بمعلوماتك؟',
  'assistant.legal.pages.done': 'تم إنشاء {n} صفحة ✅ هذه نماذج عامة: راجعها وأكمل الأجزاء بين الأقواس وتأكد من صحتها من /admin/pages',
  'assistant.legal.pages.none': 'الصفحات القانونية موجودة مسبقًا؛ اكتفيت بربط سياسة الخصوصية ✅',
  'assistant.legal.cookies.ask': 'تستعمل بكسل تتبّع لكن شريط الموافقة على الكوكيز معطّل. يُنصح بطلب موافقة الزوار قبل تتبّعهم. هل أفعّله؟',
  'assistant.legal.cookies.done': 'تم تفعيل شريط الموافقة ✅',
  'assistant.legal.retention.ask': 'كم من الوقت تحتفظ ببيانات زبائنك؟ يُنصح بتحديد مدة واضحة. هل تريد تحديدها الآن؟',
  'assistant.legal.retention.pick': 'اختر مدة الحفظ.',
  'assistant.legal.retention.months': '{n} أشهر',
  'assistant.legal.retention.years': '{n} سنة',
  'assistant.legal.retention.done': 'تم حفظ مدة الحفظ ✅ يمكن تعديلها من /admin/reglages',
  'assistant.legal.done': 'انتهى الامتثال 🎉',
  'assistant.legal.error': 'تعذّرت المتابعة: {msg}',
  'assistant.manage.start': 'تعديل أو حذف الموجود',
  'assistant.manage.type': 'ماذا تريد أن تعدّل؟',
  'assistant.manage.type.product': 'منتج',
  'assistant.manage.type.category': 'فئة',
  'assistant.manage.search.product': 'أي منتج؟ اكتب اسمه (أو جزءًا منه) أو اختر من الأحدث.',
  'assistant.manage.search.category': 'أي فئة؟ اكتب اسمها (أو جزءًا منها) أو اختر أدناه.',
  'assistant.manage.search.placeholder': 'الاسم المراد البحث عنه',
  'assistant.manage.empty.product': 'متجرك بلا منتجات بعد.',
  'assistant.manage.empty.category': 'متجرك بلا فئات بعد.',
  'assistant.manage.notfound': 'لم أجد شيئًا لـ «{q}». جرّب كلمة أخرى.',
  'assistant.manage.choose': 'عدة نتائج، أيها تقصد؟',
  'assistant.manage.action': 'ماذا تريد أن تفعل بـ «{name}»؟',
  'assistant.manage.action.price': 'تغيير السعر',
  'assistant.manage.action.stock': 'تغيير المخزون',
  'assistant.manage.action.name': 'إعادة التسمية',
  'assistant.manage.action.hide': 'إخفاء من المتجر',
  'assistant.manage.action.show': 'إظهار مجددًا',
  'assistant.manage.action.delete': 'حذف',
  'assistant.manage.price.ask': 'ما السعر الجديد لـ «{name}» بالدرهم؟ (الحالي: {current} درهم)',
  'assistant.manage.stock.ask': 'ما المخزون الجديد لـ «{name}»؟ (الحالي: {current})',
  'assistant.manage.name.ask': 'ما الاسم الجديد للفئة؟ (الحالي: {current})',
  'assistant.manage.price.done': 'تم تحديث السعر ✅ {name}: {from} ← {to} درهم',
  'assistant.manage.stock.done': 'تم تحديث المخزون ✅ {name}: {from} ← {to}',
  'assistant.manage.name.done': 'تمت إعادة تسمية الفئة ✅ {from} ← {to}',
  'assistant.manage.hide.done': 'تم إخفاء «{name}» من المتجر ✅ يمكنك إظهارها مجددًا من هنا.',
  'assistant.manage.show.done': 'أصبحت «{name}» ظاهرة مجددًا ✅',
  'assistant.manage.variants': 'لـ «{name}» متغيّرات (مقاس، لون…). عدّل سعره ومخزونه من /admin/produits حتى لا يضيع شيء.',
  'assistant.manage.delete.product': 'حذف هذا المنتج؟ سيختفي من المتجر.',
  'assistant.manage.delete.category': 'حذف هذه الفئة؟ ستختفي من المتجر.',
  'assistant.manage.delete.confirm': 'نعم، احذف',
  'assistant.manage.delete.done': 'تم حذف «{name}» ✅',
  'assistant.manage.summary.item': 'العنصر',
  'assistant.manage.summary.price': 'السعر',
  'assistant.manage.summary.products': 'المنتجات',
  'assistant.manage.again': 'هل هناك شيء آخر لتعديله؟',
  'assistant.manage.done': 'انتهت التعديلات 🎉',
  'assistant.manage.error': 'تعذّرت المتابعة: {msg}',
  'assistant.content.start': 'بيانات الاتصال والأسئلة الشائعة وصفحة الاتصال',
  'assistant.content.intro': 'لنُكمل ما يبحث عنه زوارك: البريد والمدينة والتعريف بالمتجر وصفحة الأسئلة الشائعة وصفحة الاتصال. يمكنك تخطّي أي خطوة.',
  'assistant.content.nothing': 'كل شيء جاهز هنا ✅',
  'assistant.content.email.ask': 'ما البريد الإلكتروني الذي يمكن للزبائن مراسلتك عليه؟',
  'assistant.content.email.placeholder': 'مثال: contact@myshop.com',
  'assistant.content.email.saved': 'تم حفظ البريد ✅',
  'assistant.content.city.ask': 'في أي مدينة يوجد مقرّك؟',
  'assistant.content.city.placeholder': 'مثال: الدار البيضاء',
  'assistant.content.city.saved': 'تم حفظ المدينة ✅',
  'assistant.content.about.ask': 'هذا تعريف قصير بمتجرك. استعمله كما هو أو اكتب تعريفك (20 حرفًا على الأقل).',
  'assistant.content.about.placeholder': 'تعريفك بالمتجر',
  'assistant.content.about.saved': 'تم حفظ التعريف ✅',
  'assistant.content.faq.ask': 'هل تريد صفحة «الأسئلة الشائعة»؟ سأملؤها بإجابات مأخوذة من إعداداتك (الطلب والدفع والتوصيل والاتصال) وأضيفها إلى القائمة.',
  'assistant.content.faq.done': 'تم إنشاء صفحة الأسئلة الشائعة وإضافتها إلى القائمة ✅ أكملها من /admin/pages (الإرجاع، الضمان…)',
  'assistant.content.contactPage.ask': 'هل تريد صفحة «اتصل بنا» بنموذج ليراسلك الزوار؟ سأضيفها إلى القائمة.',
  'assistant.content.contactPage.done': 'تم إنشاء صفحة الاتصال وإضافتها إلى القائمة ✅ تصلك الرسائل ضمن جهات الاتصال.',
  'assistant.content.team': 'لإضافة معاون افتح /admin/membres: يجب تحديد صلاحياته وكلمة مروره، وهو ما لا أفعله في المحادثة لأسباب أمنية.',
  'assistant.content.done': 'انتهى المحتوى الأساسي 🎉',
  'assistant.content.error': 'تعذّرت المتابعة: {msg}',
};

export const assistantAdminExtra: Record<StoreLocale, Record<AssistantAdminMessageKey, string>> = {
  fr,
  en,
  ar,
};
