import type { MessageKey, StoreLocale } from '@/i18n/messages';
import { messages } from '@/i18n/messages';

/**
 * Textes FR « système » (templates / defaults) → clés i18n.
 * Les textes marchand personnalisés (hors cette liste) restent tels quels.
 */
const FR_DEFAULT_TO_KEY: Record<string, MessageKey> = {
  'Bienvenue dans notre boutique': 'welcomeStore',
  Bienvenue: 'welcomeShort',
  'Découvrez une sélection soignée, livrée partout au Maroc.': 'discoverSelectionMorocco',
  'Découvrez une sélection soignée, livrée partout au Maroc': 'discoverSelectionMorocco',
  'Découvrez nos produits.': 'discoverProducts',
  'Voir la boutique': 'seeShop',
  Shop: 'seeShop',
  'Shop now': 'seeShop',
  Catégories: 'categories',
  Sélection: 'selection',
  Produits: 'productsTitle',
  'Tout voir': 'seeAll',
  'Nous contacter': 'contactUs',
  Contact: 'contact',
  'Sur-mesure': 'surMesure',
  'Demander un devis': 'askQuote',
  'Un projet sur-mesure ?': 'customProjectTitle',
  'Décrivez votre besoin, nous vous répondons sous 24 h.': 'customProjectBody',
  'Livraison rapide': 'fastDelivery',
  'Partout au Maroc': 'everywhereMorocco',
  'Paiement sécurisé': 'securePayment',
  'COD ou en ligne': 'codOrOnline',
  'Sélection soignée': 'carefulSelection',
  'Qualité garantie': 'qualityGuaranteed',
  'Deal du moment': 'dealOfMoment',
  'Catégories hot': 'hotCategories',
  'Découvrir la collection': 'discoverCollection',
  Éditorial: 'editorial',
  'Pièces choisies': 'chosenPieces',
  'Voir toute la boutique': 'seeWholeShop',
  Collections: 'collections',
  'Best sellers': 'bestSellers',
  Buy: 'buyNow',
  'En savoir plus': 'learnMore',
  'Politique de confidentialité': 'privacyPolicy',
};

function lookup(locale: StoreLocale, key: MessageKey): string {
  return messages[locale][key] ?? messages.fr[key] ?? key;
}

/** Traduit une chaîne si c’est un défaut FR connu ; sinon la laisse (contenu marchand). */
export function localizeKnownCopy(
  value: string | null | undefined,
  locale: StoreLocale,
  fallbackKey?: MessageKey,
): string {
  const s = (value ?? '').trim();
  if (!s) return fallbackKey ? lookup(locale, fallbackKey) : '';
  if (locale === 'fr') return s;
  const key = FR_DEFAULT_TO_KEY[s];
  if (key) return lookup(locale, key);
  return s;
}
