/** URL publique du site (prod). Utilisée pour Open Graph et partage. */
export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://goldyara.com';

export const PUBLIC_SITE_NAME =
  (import.meta.env.VITE_PUBLIC_SITE_NAME as string | undefined) || 'YaraGold';
