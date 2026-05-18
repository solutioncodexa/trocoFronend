/** URL publique du site (prod). Utilisée pour Open Graph et partage. */
export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://goldyara.com';

export const PUBLIC_SITE_NAME =
  (import.meta.env.VITE_PUBLIC_SITE_NAME as string | undefined) || 'YaraGold';

/** Page Facebook officielle — GOLD . YARA */
export const FACEBOOK_PAGE_URL =
  'https://www.facebook.com/profile.php?id=61589818832364';

export const INSTAGRAM_URL = 'https://www.instagram.com/gold_yara_/';

/** TikTok — @goldyara1 */
export const TIKTOK_URL = 'https://www.tiktok.com/@goldyara1';

/** Téléphone & WhatsApp — contact client */
export const CONTACT_PHONE_E164 = '+212690405817';
export const CONTACT_PHONE_DISPLAY = '+212 6 90 40 58 17';
export const CONTACT_WHATSAPP_URL = 'https://wa.me/212690405817';

/**
 * ID app Meta (developers.facebook.com) — requis pour le partage Messenger
 * avec sélection de conversation (Send Dialog / fb-messenger://share).
 */
export const FACEBOOK_APP_ID =
  (import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined)?.trim() || '';
