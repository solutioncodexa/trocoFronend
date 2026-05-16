import { formatPrice } from '@/utils/formatPrice';

export interface ProductShareParams {
  name: string;
  url: string;
  price?: number;
}

export function buildProductShareMessage({ name, url, price }: ProductShareParams): string {
  const pricePart = price != null ? ` — ${formatPrice(price)}` : '';
  return `Découvrez « ${name} »${pricePart} sur Or & Co Paris\n\n${url}`;
}

export function buildProductShareTitle(name: string): string {
  return `${name} — Or & Co Paris`;
}

/** Ouvre toujours dans un nouvel onglet. */
function openShareInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallback */
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export async function copyShareMessage(message: string): Promise<boolean> {
  return copyText(message);
}

/** WhatsApp : ouvre une conversation avec le message pré-rempli. */
export function shareViaWhatsApp(message: string) {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  openShareInNewTab(url);
}

/**
 * Messenger : dialogue d’envoi avec le lien du produit.
 * Le message complet est aussi copié pour collage manuel si besoin.
 */
export async function shareViaMessenger(pageUrl: string, message: string) {
  await copyShareMessage(message);
  const link = encodeURIComponent(pageUrl);
  const redirect = encodeURIComponent(pageUrl);
  openShareInNewTab(
    `https://www.facebook.com/dialog/send?link=${link}&redirect_uri=${redirect}&display=popup`,
  );
}

export type InstagramShareResult = 'native' | 'manual';

/**
 * Instagram : tente le partage natif (mobile), sinon prépare une copie manuelle.
 * Instagram ne permet pas de préremplir un DM depuis le web via une URL.
 */
export async function shareViaInstagram(
  message: string,
  pageUrl: string,
  title: string,
): Promise<InstagramShareResult> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text: message, url: pageUrl });
      return 'native';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw err;
      }
    }
  }
  return 'manual';
}

export function openInstagramInbox() {
  openShareInNewTab('https://www.instagram.com/direct/inbox/');
}

export function shareViaEmail(title: string, message: string) {
  const url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}

export async function copyProductLink(url: string): Promise<boolean> {
  return copyText(url);
}
