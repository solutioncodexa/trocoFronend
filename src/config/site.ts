/** URL publique du site (prod). Utilisée pour Open Graph et partage. */
export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://troco.ma';

export const PUBLIC_SITE_NAME =
  (import.meta.env.VITE_PUBLIC_SITE_NAME as string | undefined) || 'Troco';

/** Seuil livraison gratuite (DH) — aligné troco.ma */
export const FREE_SHIPPING_THRESHOLD_MAD = 750;

export const FACEBOOK_PAGE_URL =
  'https://www.facebook.com/profile.php?id=61589818832364';

export const INSTAGRAM_URL = 'https://www.instagram.com/troco/';

export const TIKTOK_URL = 'https://www.tiktok.com/@troco1';

/** Contact Troco */
export const CONTACT_PHONE_E164 = '+212684490098';
export const CONTACT_PHONE_DISPLAY = '+212 6 84 49 00 98';
export const CONTACT_WHATSAPP_URL = 'https://wa.me/212684490098';
export const CONTACT_EMAIL = 'contact@troco.ma';
export const CONTACT_CITY = 'Tanger, Maroc';

/**
 * ID app Meta (developers.facebook.com) — requis pour le partage Messenger
 * avec sélection de conversation (Send Dialog / fb-messenger://share).
 */
export const FACEBOOK_APP_ID =
  (import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined)?.trim() || '';
