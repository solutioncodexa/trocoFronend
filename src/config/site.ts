/** URL publique du site (prod). Utilisée pour Open Graph et partage. */
export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://goldyara.com';

export const PUBLIC_SITE_NAME =
  (import.meta.env.VITE_PUBLIC_SITE_NAME as string | undefined) || 'YaraGold';

/**
 * ID app Meta (developers.facebook.com) — requis pour le partage Messenger
 * avec sélection de conversation (Send Dialog / fb-messenger://share).
 */
export const FACEBOOK_APP_ID =
  (import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined)?.trim() || '';
