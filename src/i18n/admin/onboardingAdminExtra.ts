import type { StoreLocale } from '@/i18n/messages';

/** Clés i18n de l'assistant de création de boutique (`/admin/onboarding`). */
export type OnboardingAdminMessageKey =
  | 'ob.crumb'
  | 'ob.stepsNav'
  | 'ob.step.style'
  | 'ob.step.contact'
  | 'ob.step.catalog'
  | 'ob.step.publish'
  | 'ob.planLocked.style'
  | 'ob.planLocked.theme'
  | 'ob.err.save'
  | 'ob.err.home'
  | 'ob.err.extraPages'
  | 'ob.err.legal'
  | 'ob.err.demoAdd'
  | 'ob.err.delete'
  | 'ob.demo.added'
  | 'ob.demo.already'
  | 'ob.demo.removed'
  | 'ob.demo.auto'
  | 'ob.preview'
  | 'ob.myStore'
  | 'ob.share'
  | 'ob.done.title'
  | 'ob.done.pending'
  | 'ob.done.share'
  | 'ob.copy'
  | 'ob.copied'
  | 'ob.copyFailed'
  | 'ob.viewStore'
  | 'ob.shareWa'
  | 'ob.next.title'
  | 'ob.next.products'
  | 'ob.next.topbar'
  | 'ob.next.menu'
  | 'ob.next.pages'
  | 'ob.toDashboard'
  | 'ob.pendingBanner'
  | 'ob.style.title'
  | 'ob.style.subtitle'
  | 'ob.name'
  | 'ob.sector'
  | 'ob.change'
  | 'ob.styles.recommended'
  | 'ob.styles.all'
  | 'ob.styles.showAll'
  | 'ob.styles.showRecommended'
  | 'ob.brand.summary'
  | 'ob.tagline'
  | 'ob.tagline.placeholder'
  | 'ob.logo'
  | 'ob.details'
  | 'ob.design'
  | 'ob.colors'
  | 'ob.palette'
  | 'ob.err.phone'
  | 'ob.preview.show'
  | 'ob.preview.hide'
  | 'ob.pal.lagon'
  | 'ob.pal.terracotta'
  | 'ob.pal.bordeaux'
  | 'ob.pal.slate'
  | 'ob.pal.olive'
  | 'ob.pal.indigo'
  | 'ob.err.template'
  | 'ob.quick.err.name'
  | 'ob.quick.err.price'
  | 'ob.quick.err.category'
  | 'ob.color.primary'
  | 'ob.color.secondary'
  | 'ob.fonts'
  | 'ob.radius'
  | 'ob.contact.title'
  | 'ob.contact.subtitle'
  | 'ob.phone'
  | 'ob.waSame'
  | 'ob.whatsapp'
  | 'ob.city'
  | 'ob.city.placeholder'
  | 'ob.email'
  | 'ob.catalog.title'
  | 'ob.catalog.subtitle'
  | 'ob.catalog.count'
  | 'ob.catalog.countWithDemo'
  | 'ob.catalog.addDemo'
  | 'ob.catalog.addFirst'
  | 'ob.catalog.addAnother'
  | 'ob.catalog.removeDemo'
  | 'ob.catalog.manage'
  | 'ob.publish.title'
  | 'ob.publish.subtitle'
  | 'ob.publish.home'
  | 'ob.publish.homeDesc'
  | 'ob.publish.legal'
  | 'ob.publish.legalPages'
  | 'ob.publish.legalDisclaimer'
  | 'ob.publish.extra'
  | 'ob.publish.extraHint'
  | 'ob.publish.failed'
  | 'ob.publish.cta'
  | 'ob.tip.logo'
  | 'ob.tip.catalog'
  | 'ob.back'
  | 'ob.skip'
  | 'ob.continue'
  | 'ob.logoPalette.title'
  | 'ob.logoPalette.apply'
  | 'ob.logoPalette.applied'
  | 'ob.tagline.suggest'
  | 'ob.tagline.fallback'
  | 'ob.device.desktop'
  | 'ob.device.mobile'
  | 'ob.quick.title'
  | 'ob.quick.replaceTitle'
  | 'ob.quick.subtitle'
  | 'ob.quick.photo'
  | 'ob.quick.photoPick'
  | 'ob.quick.name'
  | 'ob.quick.price'
  | 'ob.quick.category'
  | 'ob.quick.newCategory'
  | 'ob.quick.categoryPlaceholder'
  | 'ob.quick.description'
  | 'ob.quick.save'
  | 'ob.quick.done'
  | 'ob.quick.replaced'
  | 'ob.quick.err'
  | 'ob.quick.required'
  | 'ob.quick.more'
  | 'ob.source.demo'
  | 'ob.source.demo.desc'
  | 'ob.source.quick'
  | 'ob.source.quick.desc'
  | 'ob.source.instagram'
  | 'ob.source.instagram.desc'
  | 'ob.source.csv'
  | 'ob.source.csv.desc'
  | 'ob.demoList.title'
  | 'ob.demoList.replace'
  | 'ob.stepCounter'
  | 'ob.publishNow'
  | 'ob.qr.title'
  | 'ob.qr.hint'
  | 'ob.qr.download'
  | 'ob.sector.mode.desc'
  | 'ob.sector.beaute.desc'
  | 'ob.sector.alimentation.desc'
  | 'ob.sector.maison.desc'
  | 'ob.sector.electronique.desc'
  | 'ob.sector.artisanat.desc'
  | 'ob.sector.traditionnel.desc'
  | 'ob.sector.naturel.desc'
  | 'ob.sector.patisserie.desc'
  | 'ob.sector.general.desc'
  | 'ob.stylePreset.classique'
  | 'ob.stylePreset.classique.desc'
  | 'ob.stylePreset.editorial'
  | 'ob.stylePreset.editorial.desc'
  | 'ob.stylePreset.nordique'
  | 'ob.stylePreset.nordique.desc'
  | 'ob.stylePreset.artisan'
  | 'ob.stylePreset.artisan.desc'
  | 'ob.stylePreset.flash'
  | 'ob.stylePreset.flash.desc'
  | 'ob.stylePreset.marche'
  | 'ob.stylePreset.marche.desc'
  | 'ob.theme.classic'
  | 'ob.theme.classic.desc'
  | 'ob.theme.minimal'
  | 'ob.theme.minimal.desc'
  | 'ob.theme.bold'
  | 'ob.theme.bold.desc'
  | 'ob.theme.elegant'
  | 'ob.theme.elegant.desc'
  | 'ob.tpl.home-boutique'
  | 'ob.tpl.home-boutique.desc'
  | 'ob.tpl.a-propos'
  | 'ob.tpl.a-propos.desc'
  | 'ob.tpl.lookbook'
  | 'ob.tpl.lookbook.desc'
  | 'ob.tpl.promo-flash'
  | 'ob.tpl.promo-flash.desc'
  | 'ob.tpl.landing-leads'
  | 'ob.tpl.landing-leads.desc'
  | 'ob.tpl.home-complete'
  | 'ob.tpl.home-complete.desc'
  | 'ob.tpl.notre-histoire'
  | 'ob.tpl.notre-histoire.desc'
  | 'ob.tpl.landing-offre'
  | 'ob.tpl.landing-offre.desc';

const fr: Record<OnboardingAdminMessageKey, string> = {
  'ob.crumb': 'Assistant',
  'ob.stepsNav': 'Étapes',
  'ob.step.style': 'Style',
  'ob.step.contact': 'Contact',
  'ob.step.catalog': 'Catalogue',
  'ob.step.publish': 'Publication',
  'ob.planLocked.style': 'Le style « {name} » demande un plan supérieur.',
  'ob.planLocked.theme': 'Le thème « {name} » demande un plan supérieur.',
  'ob.err.save': 'Enregistrement impossible',
  'ob.err.home': 'Création de la page d’accueil impossible',
  'ob.err.extraPages': 'Création des pages supplémentaires impossible',
  'ob.err.legal': 'Création des pages légales impossible',
  'ob.err.demoAdd': 'Ajout des produits d’exemple impossible',
  'ob.err.delete': 'Suppression impossible',
  'ob.demo.added': '{count} produit(s) d’exemple ajouté(s)',
  'ob.demo.already': 'Les produits d’exemple sont déjà présents',
  'ob.demo.removed': '{count} produit(s) d’exemple supprimé(s)',
  'ob.demo.auto': '{count} produits d’exemple ajoutés pour remplir votre boutique — remplacez-les à l’étape Catalogue.',
  'ob.preview': 'Aperçu en direct',
  'ob.myStore': 'Ma boutique',
  'ob.share': 'Découvrez {name} : {url}',
  'ob.done.title': 'Votre boutique est en ligne !',
  'ob.done.pending':
    'Elle sera visible publiquement dès son activation par Get STORE. Vous pouvez déjà prévisualiser votre vitrine.',
  'ob.done.share': 'Partagez-la dès maintenant avec vos premiers clients.',
  'ob.copy': 'Copier',
  'ob.copied': 'Lien copié',
  'ob.copyFailed': 'Copie impossible',
  'ob.viewStore': 'Voir ma boutique',
  'ob.shareWa': 'Partager sur WhatsApp',
  'ob.next.title': 'Pour aller plus loin',
  'ob.next.products': 'Ajouter vos vrais produits avec photos',
  'ob.next.topbar': 'Ajouter un bandeau promo (livraison gratuite, offre…)',
  'ob.next.menu': 'Personnaliser le menu et le pied de page',
  'ob.next.pages': 'Modifier vos pages avec le constructeur',
  'ob.toDashboard': 'Aller au tableau de bord',
  'ob.pendingBanner':
    'Votre boutique est prête côté design mais reste en attente d’activation Get STORE avant d’être visible publiquement.',
  'ob.style.title': 'Le style de votre boutique',
  'ob.style.subtitle': 'Tout est modifiable plus tard. L’aperçu se met à jour en direct.',
  'ob.name': 'Nom de la boutique',
  'ob.sector': 'Votre activité',
  'ob.change': 'Changer',
  'ob.styles.recommended': 'Styles conseillés pour vous',
  'ob.styles.all': 'Tous les styles',
  'ob.styles.showAll': 'Voir les {count} styles',
  'ob.styles.showRecommended': 'Voir seulement les styles conseillés',
  'ob.brand.summary': 'Logo et accroche (optionnel)',
  'ob.tagline': 'Accroche',
  'ob.tagline.placeholder': 'Ex. L’artisanat marocain livré chez vous',
  'ob.logo': 'Logo',
  'ob.details': 'Personnaliser en détail',
  'ob.design': 'Design',
  'ob.colors': 'Couleurs',
  'ob.palette': 'Palette {name}',
  'ob.err.phone': 'Numéro invalide. Exemple : 06 12 34 56 78',
  'ob.preview.show': 'Voir l’aperçu de ma boutique',
  'ob.preview.hide': 'Masquer l’aperçu',
  'ob.pal.lagon': 'Lagon',
  'ob.pal.terracotta': 'Terre cuite',
  'ob.pal.bordeaux': 'Bordeaux',
  'ob.pal.slate': 'Ardoise',
  'ob.pal.olive': 'Olive',
  'ob.pal.indigo': 'Indigo',
  'ob.err.template': 'Modèle introuvable',
  'ob.quick.err.name': 'Indiquez le nom du produit.',
  'ob.quick.err.price': 'Indiquez un prix supérieur à 0.',
  'ob.quick.err.category': 'Choisissez ou saisissez une catégorie.',
  'ob.color.primary': 'Principale',
  'ob.color.secondary': 'Secondaire',
  'ob.fonts': 'Polices',
  'ob.radius': 'Arrondis',
  'ob.contact.title': 'Comment vos clients vous joignent',
  'ob.contact.subtitle':
    'Affiché dans le pied de page, la page contact et les pages légales. Le numéro WhatsApp ajoute le bouton « Commander sur WhatsApp ».',
  'ob.phone': 'Téléphone',
  'ob.waSame': 'C’est aussi mon numéro WhatsApp',
  'ob.whatsapp': 'WhatsApp',
  'ob.city': 'Ville',
  'ob.city.placeholder': 'Casablanca',
  'ob.email': 'Email de contact',
  'ob.catalog.title': 'Votre catalogue',
  'ob.catalog.subtitle':
    'Démarrez avec des produits d’exemple ({pack}) puis remplacez-les, ou ajoutez directement vos produits. Vous pouvez aussi passer cette étape.',
  'ob.catalog.count': '{count} produit(s) dans le catalogue.',
  'ob.catalog.countWithDemo': '{count} produit(s) dans le catalogue (dont {demo} d’exemple).',
  'ob.catalog.addDemo': 'Ajouter des produits d’exemple',
  'ob.catalog.addFirst': 'Ajouter mon premier produit',
  'ob.catalog.addAnother': 'Ajouter un autre produit',
  'ob.catalog.removeDemo': 'Supprimer les {count} produits d’exemple',
  'ob.catalog.manage': 'Gérer mon catalogue',
  'ob.publish.title': 'Prêt à publier',
  'ob.publish.subtitle': 'Un clic prépare votre page d’accueil et vos pages légales. Tout reste modifiable ensuite.',
  'ob.publish.home': 'Page d’accueil complète',
  'ob.publish.homeDesc':
    'Bannière, avantages, catégories, produits, histoire, avis, blog et newsletter — modifiable bloc par bloc.',
  'ob.publish.legal': 'Pages légales',
  'ob.publish.legalPages': '(mentions légales, CGV, retours, confidentialité)',
  'ob.publish.legalDisclaimer':
    'Ces textes sont des modèles génériques : relisez-les, complétez les informations entre crochets et faites-les valider avant publication.',
  'ob.publish.extra': 'Pages supplémentaires (optionnel)',
  'ob.publish.extraHint': 'Cochez celles à créer maintenant ; vous pourrez en ajouter d’autres plus tard depuis « Pages ».',
  'ob.publish.failed': 'La publication a échoué : réessayez (rien n’est perdu).',
  'ob.publish.cta': 'Publier ma boutique',
  'ob.tip.logo': 'Astuce : vous pouvez ajouter votre logo à l’étape Style.',
  'ob.tip.catalog': 'Astuce : votre catalogue est vide — ajoutez des produits à l’étape Catalogue.',
  'ob.back': 'Retour',
  'ob.skip': 'Passer',
  'ob.continue': 'Continuer',
  'ob.logoPalette.title': 'Utiliser les couleurs de votre logo ?',
  'ob.logoPalette.apply': 'Appliquer',
  'ob.logoPalette.applied': 'Couleurs du logo appliquées',
  'ob.tagline.suggest': 'Proposer',
  'ob.tagline.fallback': '{sector}, livrés partout au Maroc',
  'ob.device.desktop': 'Ordinateur',
  'ob.device.mobile': 'Mobile',
  'ob.quick.title': 'Ajouter un produit',
  'ob.quick.replaceTitle': 'Remplacer « {name} »',
  'ob.quick.subtitle': 'Photo, nom et prix suffisent. Vous compléterez le reste plus tard.',
  'ob.quick.photo': 'Photo',
  'ob.quick.photoPick': 'Choisir une photo',
  'ob.quick.name': 'Nom du produit',
  'ob.quick.price': 'Prix (MAD)',
  'ob.quick.category': 'Catégorie',
  'ob.quick.newCategory': 'Nouvelle catégorie',
  'ob.quick.categoryPlaceholder': 'Ex. Caftans',
  'ob.quick.description': 'Description (optionnel)',
  'ob.quick.save': 'Ajouter au catalogue',
  'ob.quick.done': '« {name} » ajouté au catalogue',
  'ob.quick.replaced': '« {name} » remplace le produit d’exemple',
  'ob.quick.err': 'Ajout du produit impossible',
  'ob.quick.required': 'Le nom, le prix et la catégorie sont obligatoires.',
  'ob.quick.more': 'Formulaire complet (variantes, stock…)',
  'ob.source.demo': 'Produits d’exemple',
  'ob.source.demo.desc': 'Remplissez la boutique en un clic, puis remplacez-les.',
  'ob.source.quick': 'Ajout rapide',
  'ob.source.quick.desc': 'Photo, nom, prix : en 30 secondes.',
  'ob.source.instagram': 'Depuis Instagram',
  'ob.source.instagram.desc': 'Transformez vos publications en produits.',
  'ob.source.csv': 'Depuis Excel / CSV',
  'ob.source.csv.desc': 'Importez tout votre catalogue d’un coup.',
  'ob.demoList.title': 'Produits d’exemple à remplacer',
  'ob.demoList.replace': 'Remplacer',
  'ob.stepCounter': 'Étape {n} sur {total} · environ {min} min',
  'ob.publishNow': 'Publier directement',
  'ob.qr.title': 'Le QR code de votre boutique',
  'ob.qr.hint': 'À imprimer pour votre comptoir, vos sacs ou vos cartes de visite.',
  'ob.qr.download': 'Télécharger le QR code',
  'ob.sector.mode.desc': 'Prêt-à-porter, accessoires, chaussures.',
  'ob.sector.beaute.desc': 'Soins, maquillage, parfums.',
  'ob.sector.alimentation.desc': 'Produits du terroir, épices, douceurs.',
  'ob.sector.maison.desc': 'Décoration, textile, art de la table.',
  'ob.sector.electronique.desc': 'Audio, chargeurs, accessoires mobiles.',
  'ob.sector.artisanat.desc': 'Poterie, zellige, cuir, tapis et cuivre faits main.',
  'ob.sector.traditionnel.desc': 'Caftans, takchitas, djellabas et gandouras.',
  'ob.sector.naturel.desc': 'Argan, savon beldi, ghassoul, eaux florales.',
  'ob.sector.patisserie.desc': 'Gâteaux marocains, plateaux et commandes sur mesure.',
  'ob.sector.general.desc': 'Un petit catalogue polyvalent pour démarrer.',
  'ob.stylePreset.classique': 'Classique',
  'ob.stylePreset.classique.desc': 'Équilibré et rassurant, pour tous les catalogues.',
  'ob.stylePreset.editorial': 'Éditorial',
  'ob.stylePreset.editorial.desc': 'Aéré et élégant : mode, décoration, belles photos.',
  'ob.stylePreset.nordique': 'Minimal',
  'ob.stylePreset.nordique.desc': 'Épuré et moderne, le produit avant tout.',
  'ob.stylePreset.artisan': 'Artisan',
  'ob.stylePreset.artisan.desc': 'Chaleureux et authentique : terroir, artisanat.',
  'ob.stylePreset.flash': 'Flash',
  'ob.stylePreset.flash.desc': 'Contrasté et dynamique : promos, high-tech.',
  'ob.stylePreset.marche': 'Marché',
  'ob.stylePreset.marche.desc': 'Dense et efficace : beaucoup de produits, filtres latéraux.',
  'ob.theme.classic': 'Classique',
  'ob.theme.classic.desc': 'Vitrine e-commerce classique : hero photo, bénéfices, grilles catégories & produits arrondis.',
  'ob.theme.minimal': 'Minimal',
  'ob.theme.minimal.desc': 'Look éditorial blanc : typo géante, peu de sections, grille produit épurée sans cartes.',
  'ob.theme.bold': 'Bold',
  'ob.theme.bold.desc': 'Ambiance dark flash-sale : angles droits, bannières, gros CTA et mosaïque asymétrique.',
  'ob.theme.elegant': 'Élégant',
  'ob.theme.elegant.desc': 'Magazine luxe : hero centré, italiques, cercles catégories et mise en page éditoriale.',
  'ob.tpl.home-boutique': 'Accueil boutique',
  'ob.tpl.home-boutique.desc': 'Hero, catégories, produits et CTA — idéal pour remplacer l’accueil.',
  'ob.tpl.a-propos': 'À propos',
  'ob.tpl.a-propos.desc': 'Histoire de marque, image et contact.',
  'ob.tpl.lookbook': 'Lookbook',
  'ob.tpl.lookbook.desc': 'Mise en avant visuelle type magazine + grille produits.',
  'ob.tpl.promo-flash': 'Promo flash',
  'ob.tpl.promo-flash.desc': 'Compte à rebours, produits et FAQ — parfait pour des soldes.',
  'ob.tpl.landing-leads': 'Capture leads',
  'ob.tpl.landing-leads.desc': 'Hero + témoignages + formulaire — pour collecter des contacts.',
  'ob.tpl.home-complete': 'Accueil complet',
  'ob.tpl.home-complete.desc':
    'Hero, avantages, catégories, produits, histoire, avis, blog et newsletter — accueil prêt à lancer.',
  'ob.tpl.notre-histoire': 'Notre histoire',
  'ob.tpl.notre-histoire.desc': 'Page de marque : récit, valeurs en icônes, galerie photo et contact.',
  'ob.tpl.landing-offre': 'Landing offre',
  'ob.tpl.landing-offre.desc': 'Page de conversion : hero, avantages, produits, compte à rebours, FAQ et newsletter.',
};

const en: Record<OnboardingAdminMessageKey, string> = {
  'ob.crumb': 'Assistant',
  'ob.stepsNav': 'Steps',
  'ob.step.style': 'Style',
  'ob.step.contact': 'Contact',
  'ob.step.catalog': 'Catalog',
  'ob.step.publish': 'Publish',
  'ob.planLocked.style': 'The “{name}” style requires a higher plan.',
  'ob.planLocked.theme': 'The “{name}” theme requires a higher plan.',
  'ob.err.save': 'Could not save',
  'ob.err.home': 'Could not create the home page',
  'ob.err.extraPages': 'Could not create the extra pages',
  'ob.err.legal': 'Could not create the legal pages',
  'ob.err.demoAdd': 'Could not add the sample products',
  'ob.err.delete': 'Could not delete',
  'ob.demo.added': '{count} sample product(s) added',
  'ob.demo.already': 'The sample products are already there',
  'ob.demo.removed': '{count} sample product(s) removed',
  'ob.demo.auto': '{count} sample products added to fill your store — replace them in the Catalog step.',
  'ob.preview': 'Live preview',
  'ob.myStore': 'My store',
  'ob.share': 'Discover {name}: {url}',
  'ob.done.title': 'Your store is live!',
  'ob.done.pending':
    'It will be publicly visible as soon as Get STORE activates it. You can already preview your storefront.',
  'ob.done.share': 'Share it now with your first customers.',
  'ob.copy': 'Copy',
  'ob.copied': 'Link copied',
  'ob.copyFailed': 'Could not copy',
  'ob.viewStore': 'View my store',
  'ob.shareWa': 'Share on WhatsApp',
  'ob.next.title': 'Next steps',
  'ob.next.products': 'Add your real products with photos',
  'ob.next.topbar': 'Add a promo banner (free shipping, offer…)',
  'ob.next.menu': 'Customize the menu and footer',
  'ob.next.pages': 'Edit your pages with the builder',
  'ob.toDashboard': 'Go to dashboard',
  'ob.pendingBanner':
    'Your store design is ready, but it is waiting for Get STORE activation before becoming publicly visible.',
  'ob.style.title': 'Your store’s style',
  'ob.style.subtitle': 'Everything can be changed later. The preview updates live.',
  'ob.name': 'Store name',
  'ob.sector': 'Your business',
  'ob.change': 'Change',
  'ob.styles.recommended': 'Styles recommended for you',
  'ob.styles.all': 'All styles',
  'ob.styles.showAll': 'See all {count} styles',
  'ob.styles.showRecommended': 'Show recommended styles only',
  'ob.brand.summary': 'Logo and tagline (optional)',
  'ob.tagline': 'Tagline',
  'ob.tagline.placeholder': 'E.g. Moroccan craftsmanship delivered to your door',
  'ob.logo': 'Logo',
  'ob.details': 'Customize in detail',
  'ob.design': 'Design',
  'ob.colors': 'Colors',
  'ob.palette': '{name} palette',
  'ob.err.phone': 'Invalid number. Example: 06 12 34 56 78',
  'ob.preview.show': 'Show my store preview',
  'ob.preview.hide': 'Hide preview',
  'ob.pal.lagon': 'Lagoon',
  'ob.pal.terracotta': 'Terracotta',
  'ob.pal.bordeaux': 'Burgundy',
  'ob.pal.slate': 'Slate',
  'ob.pal.olive': 'Olive',
  'ob.pal.indigo': 'Indigo',
  'ob.err.template': 'Template not found',
  'ob.quick.err.name': 'Enter the product name.',
  'ob.quick.err.price': 'Enter a price above 0.',
  'ob.quick.err.category': 'Choose or enter a category.',
  'ob.color.primary': 'Primary',
  'ob.color.secondary': 'Secondary',
  'ob.fonts': 'Fonts',
  'ob.radius': 'Corners',
  'ob.contact.title': 'How customers reach you',
  'ob.contact.subtitle':
    'Shown in the footer, the contact page and the legal pages. The WhatsApp number adds the “Order on WhatsApp” button.',
  'ob.phone': 'Phone',
  'ob.waSame': 'This is also my WhatsApp number',
  'ob.whatsapp': 'WhatsApp',
  'ob.city': 'City',
  'ob.city.placeholder': 'Casablanca',
  'ob.email': 'Contact email',
  'ob.catalog.title': 'Your catalog',
  'ob.catalog.subtitle':
    'Start with sample products ({pack}) and replace them, or add your own products right away. You can also skip this step.',
  'ob.catalog.count': '{count} product(s) in the catalog.',
  'ob.catalog.countWithDemo': '{count} product(s) in the catalog ({demo} of them samples).',
  'ob.catalog.addDemo': 'Add sample products',
  'ob.catalog.addFirst': 'Add my first product',
  'ob.catalog.addAnother': 'Add another product',
  'ob.catalog.removeDemo': 'Remove the {count} sample products',
  'ob.catalog.manage': 'Manage my catalog',
  'ob.publish.title': 'Ready to publish',
  'ob.publish.subtitle': 'One click prepares your home page and legal pages. Everything stays editable afterwards.',
  'ob.publish.home': 'Complete home page',
  'ob.publish.homeDesc': 'Banner, benefits, categories, products, story, reviews, blog and newsletter — editable block by block.',
  'ob.publish.legal': 'Legal pages',
  'ob.publish.legalPages': '(legal notice, terms of sale, returns, privacy)',
  'ob.publish.legalDisclaimer':
    'These texts are generic templates: review them, fill in the bracketed information and have them validated before publishing.',
  'ob.publish.extra': 'Extra pages (optional)',
  'ob.publish.extraHint': 'Tick the ones to create now; you can add more later from “Pages”.',
  'ob.publish.failed': 'Publishing failed: try again (nothing is lost).',
  'ob.publish.cta': 'Publish my store',
  'ob.tip.logo': 'Tip: you can add your logo in the Style step.',
  'ob.tip.catalog': 'Tip: your catalog is empty — add products in the Catalog step.',
  'ob.back': 'Back',
  'ob.skip': 'Skip',
  'ob.continue': 'Continue',
  'ob.logoPalette.title': 'Use your logo colors?',
  'ob.logoPalette.apply': 'Apply',
  'ob.logoPalette.applied': 'Logo colors applied',
  'ob.tagline.suggest': 'Suggest',
  'ob.tagline.fallback': '{sector}, delivered all over Morocco',
  'ob.device.desktop': 'Desktop',
  'ob.device.mobile': 'Mobile',
  'ob.quick.title': 'Add a product',
  'ob.quick.replaceTitle': 'Replace “{name}”',
  'ob.quick.subtitle': 'A photo, a name and a price are enough. You can complete the rest later.',
  'ob.quick.photo': 'Photo',
  'ob.quick.photoPick': 'Choose a photo',
  'ob.quick.name': 'Product name',
  'ob.quick.price': 'Price (MAD)',
  'ob.quick.category': 'Category',
  'ob.quick.newCategory': 'New category',
  'ob.quick.categoryPlaceholder': 'E.g. Caftans',
  'ob.quick.description': 'Description (optional)',
  'ob.quick.save': 'Add to catalog',
  'ob.quick.done': '“{name}” added to the catalog',
  'ob.quick.replaced': '“{name}” replaces the sample product',
  'ob.quick.err': 'Could not add the product',
  'ob.quick.required': 'Name, price and category are required.',
  'ob.quick.more': 'Full form (variants, stock…)',
  'ob.source.demo': 'Sample products',
  'ob.source.demo.desc': 'Fill the store in one click, then replace them.',
  'ob.source.quick': 'Quick add',
  'ob.source.quick.desc': 'Photo, name, price: in 30 seconds.',
  'ob.source.instagram': 'From Instagram',
  'ob.source.instagram.desc': 'Turn your posts into products.',
  'ob.source.csv': 'From Excel / CSV',
  'ob.source.csv.desc': 'Import your whole catalog at once.',
  'ob.demoList.title': 'Sample products to replace',
  'ob.demoList.replace': 'Replace',
  'ob.stepCounter': 'Step {n} of {total} · about {min} min left',
  'ob.publishNow': 'Publish now',
  'ob.qr.title': 'Your store QR code',
  'ob.qr.hint': 'Print it for your counter, bags or business cards.',
  'ob.qr.download': 'Download the QR code',
  'ob.sector.mode.desc': 'Ready-to-wear, accessories, shoes.',
  'ob.sector.beaute.desc': 'Skincare, make-up, perfumes.',
  'ob.sector.alimentation.desc': 'Local produce, spices, sweets.',
  'ob.sector.maison.desc': 'Decoration, textiles, tableware.',
  'ob.sector.electronique.desc': 'Audio, chargers, phone accessories.',
  'ob.sector.artisanat.desc': 'Handmade pottery, zellige, leather, rugs and copper.',
  'ob.sector.traditionnel.desc': 'Caftans, takchitas, djellabas and gandouras.',
  'ob.sector.naturel.desc': 'Argan, beldi soap, ghassoul, floral waters.',
  'ob.sector.patisserie.desc': 'Moroccan pastries, trays and custom orders.',
  'ob.sector.general.desc': 'A small all-purpose catalog to get started.',
  'ob.stylePreset.classique': 'Classic',
  'ob.stylePreset.classique.desc': 'Balanced and reassuring, for any catalog.',
  'ob.stylePreset.editorial': 'Editorial',
  'ob.stylePreset.editorial.desc': 'Airy and elegant: fashion, decor, beautiful photos.',
  'ob.stylePreset.nordique': 'Minimal',
  'ob.stylePreset.nordique.desc': 'Clean and modern, product first.',
  'ob.stylePreset.artisan': 'Artisan',
  'ob.stylePreset.artisan.desc': 'Warm and authentic: local produce, crafts.',
  'ob.stylePreset.flash': 'Flash',
  'ob.stylePreset.flash.desc': 'High-contrast and dynamic: promotions, tech.',
  'ob.stylePreset.marche': 'Market',
  'ob.stylePreset.marche.desc': 'Dense and efficient: many products, side filters.',
  'ob.theme.classic': 'Classic',
  'ob.theme.classic.desc': 'Classic e-commerce storefront: photo hero, benefits, rounded category and product grids.',
  'ob.theme.minimal': 'Minimal',
  'ob.theme.minimal.desc': 'White editorial look: huge type, few sections, clean card-less product grid.',
  'ob.theme.bold': 'Bold',
  'ob.theme.bold.desc': 'Dark flash-sale mood: sharp corners, banners, big CTAs and asymmetric mosaic.',
  'ob.theme.elegant': 'Elegant',
  'ob.theme.elegant.desc': 'Luxury magazine: centered hero, italics, round categories and editorial layout.',
  'ob.tpl.home-boutique': 'Store home',
  'ob.tpl.home-boutique.desc': 'Hero, categories, products and CTA — ideal to replace the home page.',
  'ob.tpl.a-propos': 'About',
  'ob.tpl.a-propos.desc': 'Brand story, image and contact.',
  'ob.tpl.lookbook': 'Lookbook',
  'ob.tpl.lookbook.desc': 'Magazine-style visual showcase + product grid.',
  'ob.tpl.promo-flash': 'Flash sale',
  'ob.tpl.promo-flash.desc': 'Countdown, products and FAQ — perfect for a sale.',
  'ob.tpl.landing-leads': 'Lead capture',
  'ob.tpl.landing-leads.desc': 'Hero + testimonials + form — to collect contacts.',
  'ob.tpl.home-complete': 'Complete home',
  'ob.tpl.home-complete.desc': 'Hero, benefits, categories, products, story, reviews, blog and newsletter — ready to launch.',
  'ob.tpl.notre-histoire': 'Our story',
  'ob.tpl.notre-histoire.desc': 'Brand page: story, values as icons, photo gallery and contact.',
  'ob.tpl.landing-offre': 'Offer landing',
  'ob.tpl.landing-offre.desc': 'Conversion page: hero, benefits, products, countdown, FAQ and newsletter.',
};

const ar: Record<OnboardingAdminMessageKey, string> = {
  'ob.crumb': 'المساعد',
  'ob.stepsNav': 'المراحل',
  'ob.step.style': 'الأسلوب',
  'ob.step.contact': 'التواصل',
  'ob.step.catalog': 'الكتالوج',
  'ob.step.publish': 'النشر',
  'ob.planLocked.style': 'أسلوب « {name} » يتطلب باقة أعلى.',
  'ob.planLocked.theme': 'قالب « {name} » يتطلب باقة أعلى.',
  'ob.err.save': 'تعذّر الحفظ',
  'ob.err.home': 'تعذّر إنشاء الصفحة الرئيسية',
  'ob.err.extraPages': 'تعذّر إنشاء الصفحات الإضافية',
  'ob.err.legal': 'تعذّر إنشاء الصفحات القانونية',
  'ob.err.demoAdd': 'تعذّرت إضافة المنتجات التجريبية',
  'ob.err.delete': 'تعذّر الحذف',
  'ob.demo.added': 'تمت إضافة {count} منتج(ات) تجريبية',
  'ob.demo.already': 'المنتجات التجريبية موجودة مسبقًا',
  'ob.demo.removed': 'تم حذف {count} منتج(ات) تجريبية',
  'ob.demo.auto': 'أضفنا {count} منتجات تجريبية لملء متجرك — استبدلها في مرحلة الكتالوج.',
  'ob.preview': 'معاينة مباشرة',
  'ob.myStore': 'متجري',
  'ob.share': 'اكتشفوا {name}: {url}',
  'ob.done.title': 'متجرك الآن على الإنترنت!',
  'ob.done.pending': 'سيظهر للعموم فور تفعيله من طرف Get STORE. يمكنك منذ الآن معاينة واجهتك.',
  'ob.done.share': 'شاركه الآن مع أول زبنائك.',
  'ob.copy': 'نسخ',
  'ob.copied': 'تم نسخ الرابط',
  'ob.copyFailed': 'تعذّر النسخ',
  'ob.viewStore': 'عرض متجري',
  'ob.shareWa': 'مشاركة عبر واتساب',
  'ob.next.title': 'للمضي أبعد',
  'ob.next.products': 'أضف منتجاتك الحقيقية مع الصور',
  'ob.next.topbar': 'أضف شريطًا ترويجيًا (توصيل مجاني، عرض…)',
  'ob.next.menu': 'خصّص القائمة وتذييل الصفحة',
  'ob.next.pages': 'عدّل صفحاتك بأداة البناء',
  'ob.toDashboard': 'الذهاب إلى لوحة التحكم',
  'ob.pendingBanner': 'تصميم متجرك جاهز، لكنه في انتظار تفعيل Get STORE قبل أن يظهر للعموم.',
  'ob.style.title': 'أسلوب متجرك',
  'ob.style.subtitle': 'كل شيء قابل للتعديل لاحقًا. المعاينة تتحدّث مباشرة.',
  'ob.name': 'اسم المتجر',
  'ob.sector': 'نشاطك',
  'ob.change': 'تغيير',
  'ob.styles.recommended': 'أساليب مقترحة لك',
  'ob.styles.all': 'كل الأساليب',
  'ob.styles.showAll': 'عرض الأساليب الـ {count}',
  'ob.styles.showRecommended': 'عرض الأساليب المقترحة فقط',
  'ob.brand.summary': 'الشعار والعبارة التعريفية (اختياري)',
  'ob.tagline': 'العبارة التعريفية',
  'ob.tagline.placeholder': 'مثال: الصناعة التقليدية المغربية حتى باب دارك',
  'ob.logo': 'الشعار',
  'ob.details': 'تخصيص مفصّل',
  'ob.design': 'التصميم',
  'ob.colors': 'الألوان',
  'ob.palette': 'لوحة {name}',
  'ob.err.phone': 'رقم غير صالح. مثال: 06 12 34 56 78',
  'ob.preview.show': 'عرض معاينة متجري',
  'ob.preview.hide': 'إخفاء المعاينة',
  'ob.pal.lagon': 'لاغون',
  'ob.pal.terracotta': 'طين مشوي',
  'ob.pal.bordeaux': 'أحمر داكن',
  'ob.pal.slate': 'أردوازي',
  'ob.pal.olive': 'زيتوني',
  'ob.pal.indigo': 'نيلي',
  'ob.err.template': 'القالب غير موجود',
  'ob.quick.err.name': 'أدخل اسم المنتج.',
  'ob.quick.err.price': 'أدخل ثمنًا أكبر من 0.',
  'ob.quick.err.category': 'اختر فئة أو أدخلها.',
  'ob.color.primary': 'الرئيسي',
  'ob.color.secondary': 'الثانوي',
  'ob.fonts': 'الخطوط',
  'ob.radius': 'الزوايا',
  'ob.contact.title': 'كيف يتواصل معك زبناؤك',
  'ob.contact.subtitle': 'يظهر في تذييل الصفحة وصفحة التواصل والصفحات القانونية. رقم واتساب يضيف زر « اطلب عبر واتساب ».',
  'ob.phone': 'الهاتف',
  'ob.waSame': 'هذا أيضًا رقم واتساب ديالي',
  'ob.whatsapp': 'واتساب',
  'ob.city': 'المدينة',
  'ob.city.placeholder': 'الدار البيضاء',
  'ob.email': 'البريد الإلكتروني للتواصل',
  'ob.catalog.title': 'الكتالوج ديالك',
  'ob.catalog.subtitle':
    'ابدأ بمنتجات تجريبية ({pack}) ثم استبدلها، أو أضف منتجاتك مباشرة. يمكنك أيضًا تخطي هذه المرحلة.',
  'ob.catalog.count': '{count} منتج(ات) في الكتالوج.',
  'ob.catalog.countWithDemo': '{count} منتج(ات) في الكتالوج (منها {demo} تجريبية).',
  'ob.catalog.addDemo': 'إضافة منتجات تجريبية',
  'ob.catalog.addFirst': 'إضافة أول منتج',
  'ob.catalog.addAnother': 'إضافة منتج آخر',
  'ob.catalog.removeDemo': 'حذف المنتجات التجريبية ({count})',
  'ob.catalog.manage': 'إدارة الكتالوج',
  'ob.publish.title': 'جاهز للنشر',
  'ob.publish.subtitle': 'نقرة واحدة تُجهّز صفحتك الرئيسية وصفحاتك القانونية. كل شيء يبقى قابلًا للتعديل بعد ذلك.',
  'ob.publish.home': 'صفحة رئيسية كاملة',
  'ob.publish.homeDesc': 'بانر، مزايا، فئات، منتجات، قصة، آراء، مدونة ونشرة إخبارية — قابلة للتعديل كتلة بكتلة.',
  'ob.publish.legal': 'الصفحات القانونية',
  'ob.publish.legalPages': '(الإشعار القانوني، شروط البيع، الإرجاع، الخصوصية)',
  'ob.publish.legalDisclaimer':
    'هذه النصوص نماذج عامة: راجعها، وأكمل المعلومات بين المعقوفين، واعرضها للمصادقة قبل النشر.',
  'ob.publish.extra': 'صفحات إضافية (اختياري)',
  'ob.publish.extraHint': 'اختر ما تريد إنشاءه الآن؛ يمكنك إضافة صفحات أخرى لاحقًا من « الصفحات ».',
  'ob.publish.failed': 'فشل النشر: أعد المحاولة (لم يضِع أي شيء).',
  'ob.publish.cta': 'نشر متجري',
  'ob.tip.logo': 'نصيحة: يمكنك إضافة شعارك في مرحلة الأسلوب.',
  'ob.tip.catalog': 'نصيحة: الكتالوج فارغ — أضف منتجات في مرحلة الكتالوج.',
  'ob.back': 'رجوع',
  'ob.skip': 'تخطي',
  'ob.continue': 'متابعة',
  'ob.logoPalette.title': 'استعمال ألوان شعارك؟',
  'ob.logoPalette.apply': 'تطبيق',
  'ob.logoPalette.applied': 'تم تطبيق ألوان الشعار',
  'ob.tagline.suggest': 'اقتراح',
  'ob.tagline.fallback': '{sector}، توصيل لجميع أنحاء المغرب',
  'ob.device.desktop': 'حاسوب',
  'ob.device.mobile': 'هاتف',
  'ob.quick.title': 'إضافة منتج',
  'ob.quick.replaceTitle': 'استبدال « {name} »',
  'ob.quick.subtitle': 'صورة واسم وثمن تكفي. يمكنك إكمال الباقي لاحقًا.',
  'ob.quick.photo': 'الصورة',
  'ob.quick.photoPick': 'اختيار صورة',
  'ob.quick.name': 'اسم المنتج',
  'ob.quick.price': 'الثمن (درهم)',
  'ob.quick.category': 'الفئة',
  'ob.quick.newCategory': 'فئة جديدة',
  'ob.quick.categoryPlaceholder': 'مثال: قفاطن',
  'ob.quick.description': 'الوصف (اختياري)',
  'ob.quick.save': 'إضافة إلى الكتالوج',
  'ob.quick.done': 'تمت إضافة « {name} » إلى الكتالوج',
  'ob.quick.replaced': '« {name} » يعوّض المنتج التجريبي',
  'ob.quick.err': 'تعذّرت إضافة المنتج',
  'ob.quick.required': 'الاسم والثمن والفئة إلزامية.',
  'ob.quick.more': 'الاستمارة الكاملة (المتغيرات، المخزون…)',
  'ob.source.demo': 'منتجات تجريبية',
  'ob.source.demo.desc': 'املأ المتجر بنقرة واحدة ثم استبدلها.',
  'ob.source.quick': 'إضافة سريعة',
  'ob.source.quick.desc': 'صورة، اسم، ثمن: في 30 ثانية.',
  'ob.source.instagram': 'من إنستغرام',
  'ob.source.instagram.desc': 'حوّل منشوراتك إلى منتجات.',
  'ob.source.csv': 'من Excel / CSV',
  'ob.source.csv.desc': 'استورد الكتالوج كاملًا دفعة واحدة.',
  'ob.demoList.title': 'منتجات تجريبية يجب استبدالها',
  'ob.demoList.replace': 'استبدال',
  'ob.stepCounter': 'المرحلة {n} من {total} · حوالي {min} د',
  'ob.publishNow': 'النشر مباشرة',
  'ob.qr.title': 'رمز QR لمتجرك',
  'ob.qr.hint': 'اطبعه على الكونطوار أو الأكياس أو بطاقات الزيارة.',
  'ob.qr.download': 'تحميل رمز QR',
  'ob.sector.mode.desc': 'ملابس جاهزة، إكسسوارات، أحذية.',
  'ob.sector.beaute.desc': 'عناية، مكياج، عطور.',
  'ob.sector.alimentation.desc': 'منتجات محلية، توابل، حلويات.',
  'ob.sector.maison.desc': 'ديكور، أقمشة، أدوات المائدة.',
  'ob.sector.electronique.desc': 'سماعات، شواحن، إكسسوارات الهاتف.',
  'ob.sector.artisanat.desc': 'فخار وزليج وجلد وزربي ونحاس مصنوعون يدويًا.',
  'ob.sector.traditionnel.desc': 'قفاطن وتكشيطات وجلابيب وقنادر.',
  'ob.sector.naturel.desc': 'أركان وصابون بلدي وغاسول ومياه الزهور.',
  'ob.sector.patisserie.desc': 'حلويات مغربية وصواني وطلبات حسب الطلب.',
  'ob.sector.general.desc': 'كتالوج صغير متعدد الاستعمالات للانطلاق.',
  'ob.stylePreset.classique': 'كلاسيكي',
  'ob.stylePreset.classique.desc': 'متوازن ومطمئن، يناسب كل الكتالوجات.',
  'ob.stylePreset.editorial': 'تحريري',
  'ob.stylePreset.editorial.desc': 'فسيح وأنيق: أزياء، ديكور، صور جميلة.',
  'ob.stylePreset.nordique': 'بسيط',
  'ob.stylePreset.nordique.desc': 'نقي وعصري، المنتج أولًا.',
  'ob.stylePreset.artisan': 'حِرفي',
  'ob.stylePreset.artisan.desc': 'دافئ وأصيل: منتجات محلية، صناعة تقليدية.',
  'ob.stylePreset.flash': 'فلاش',
  'ob.stylePreset.flash.desc': 'متباين وحيوي: عروض، تكنولوجيا.',
  'ob.stylePreset.marche': 'سوق',
  'ob.stylePreset.marche.desc': 'كثيف وفعّال: منتجات كثيرة، فلاتر جانبية.',
  'ob.theme.classic': 'كلاسيكي',
  'ob.theme.classic.desc': 'واجهة متجر كلاسيكية: صورة رئيسية، مزايا، شبكات فئات ومنتجات بزوايا دائرية.',
  'ob.theme.minimal': 'بسيط',
  'ob.theme.minimal.desc': 'مظهر تحريري أبيض: خط كبير، أقسام قليلة، شبكة منتجات نقية بدون بطاقات.',
  'ob.theme.bold': 'جريء',
  'ob.theme.bold.desc': 'أجواء تخفيضات داكنة: زوايا حادة، بانرات، أزرار كبيرة وفسيفساء غير متماثلة.',
  'ob.theme.elegant': 'أنيق',
  'ob.theme.elegant.desc': 'مجلة فاخرة: صورة رئيسية في الوسط، خط مائل، فئات دائرية وتنسيق تحريري.',
  'ob.tpl.home-boutique': 'رئيسية المتجر',
  'ob.tpl.home-boutique.desc': 'صورة رئيسية، فئات، منتجات وزر دعوة — مثالية لتعويض الصفحة الرئيسية.',
  'ob.tpl.a-propos': 'من نحن',
  'ob.tpl.a-propos.desc': 'قصة العلامة، صورة وتواصل.',
  'ob.tpl.lookbook': 'لوك بوك',
  'ob.tpl.lookbook.desc': 'عرض بصري على شكل مجلة + شبكة منتجات.',
  'ob.tpl.promo-flash': 'عرض سريع',
  'ob.tpl.promo-flash.desc': 'عدّاد تنازلي، منتجات وأسئلة شائعة — مثالي للتخفيضات.',
  'ob.tpl.landing-leads': 'جمع جهات الاتصال',
  'ob.tpl.landing-leads.desc': 'صورة رئيسية + شهادات + استمارة — لجمع جهات الاتصال.',
  'ob.tpl.home-complete': 'رئيسية كاملة',
  'ob.tpl.home-complete.desc': 'صورة رئيسية، مزايا، فئات، منتجات، قصة، آراء، مدونة ونشرة — جاهزة للإطلاق.',
  'ob.tpl.notre-histoire': 'قصتنا',
  'ob.tpl.notre-histoire.desc': 'صفحة العلامة: الحكاية، القيم بالأيقونات، معرض صور وتواصل.',
  'ob.tpl.landing-offre': 'صفحة عرض',
  'ob.tpl.landing-offre.desc': 'صفحة تحويل: صورة رئيسية، مزايا، منتجات، عدّاد تنازلي، أسئلة شائعة ونشرة.',
};

export const onboardingAdminExtra: Record<StoreLocale, Record<OnboardingAdminMessageKey, string>> = { fr, en, ar };
