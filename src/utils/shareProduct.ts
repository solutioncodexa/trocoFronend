import { formatPrice } from '@/utils/formatPrice';

export interface ProductShareParams {
  name: string;
  url: string;
  price?: number;
  imageUrl?: string;
}

export interface RichSharePayload {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

export function buildProductShareMessage({ name, url, price }: ProductShareParams): string {
  const pricePart = price != null ? ` — ${formatPrice(price)}` : '';
  return `Découvrez « ${name} »${pricePart} sur YaraGold\n\n${url}`;
}

export function buildProductShareTitle(name: string): string {
  return `${name} — YaraGold`;
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

async function fetchImageAsFile(imageUrl: string, fileName: string): Promise<File | null> {
  try {
    const res = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.size) return null;
    const type = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    return new File([blob], `${fileName}.${ext}`, { type });
  } catch {
    return null;
  }
}

export type NativeShareResult = 'shared' | 'unsupported' | 'aborted';

/**
 * Partage natif (mobile) : texte + URL + photo du produit si le navigateur le permet.
 * Fonctionne bien avec Instagram, Messenger, WhatsApp via le menu système.
 */
export async function shareViaNativeRich(payload: RichSharePayload): Promise<NativeShareResult> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return 'unsupported';
  }

  const shareData: ShareData = {
    title: payload.title,
    text: payload.text,
    url: payload.url,
  };

  if (payload.imageUrl) {
    const file = await fetchImageAsFile(payload.imageUrl, 'bijou-yaragold');
    if (file && navigator.canShare?.({ files: [file] })) {
      shareData.files = [file];
    }
  }

  try {
    if (navigator.canShare && !navigator.canShare(shareData)) {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
    } else {
      await navigator.share(shareData);
    }
    return 'shared';
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return 'aborted';
    return 'unsupported';
  }
}

export async function copyShareMessage(message: string): Promise<boolean> {
  return copyText(message);
}

/** WhatsApp : message + lien pré-remplis. */
export function shareViaWhatsApp(message: string) {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  openShareInNewTab(url);
}

/** Messenger : partage natif si possible, sinon dialogue Facebook + message copié. */
export async function shareViaMessenger(payload: RichSharePayload): Promise<NativeShareResult | 'dialog'> {
  const native = await shareViaNativeRich(payload);
  if (native === 'shared' || native === 'aborted') return native;

  await copyShareMessage(payload.text);
  const link = encodeURIComponent(payload.url);
  openShareInNewTab(
    `https://www.facebook.com/dialog/send?link=${link}&redirect_uri=${link}&display=popup`,
  );
  return 'dialog';
}

export type InstagramShareResult = 'native' | 'manual';

/** Instagram : partage natif (photo + texte) ou préparation manuelle. */
export async function shareViaInstagram(payload: RichSharePayload): Promise<InstagramShareResult> {
  const native = await shareViaNativeRich(payload);
  if (native === 'shared') return 'native';
  if (native === 'aborted') throw new DOMException('Aborted', 'AbortError');
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
