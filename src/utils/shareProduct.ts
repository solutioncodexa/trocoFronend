import { getActiveSiteName } from '@/lib/activeStoreBrand';
import type { ProductCategory } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';

export interface ProductShareParams {
  name: string;
  url: string;
  price?: number;
  originalPrice?: number;
  description?: string;
  weight?: number;
  category?: ProductCategory;
  availableSizes?: string[];
  imageUrl?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'sachets-pochettes': 'Sachets & pochettes',
  cartons: 'Cartons',
  protections: 'Protections',
  decorations: 'Décorations',
};

function truncateText(text: string, maxLen = 200): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1).trimEnd()}…`;
}

export interface RichSharePayload {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

export function buildProductShareMessage(params: ProductShareParams): string {
  const {
    name,
    url,
    price,
    originalPrice,
    description,
    category,
    availableSizes,
  } = params;

  const lines: string[] = [name];

  if (price != null) {
    let priceLine = `Prix : ${formatPrice(price)}`;
    if (originalPrice != null && originalPrice > price) {
      priceLine += ` (au lieu de ${formatPrice(originalPrice)})`;
    }
    lines.push(priceLine);
  }

  if (category) {
    lines.push(CATEGORY_LABELS[category] ?? category);
  }

  if (availableSizes && availableSizes.length > 0) {
    const shown = availableSizes.slice(0, 10);
    const extra = availableSizes.length > shown.length ? '…' : '';
    lines.push(`Options : ${shown.join(', ')}${extra}`);
  }

  if (description?.trim()) {
    lines.push(truncateText(description, 120));
  }

  lines.push('');
  lines.push(`${getActiveSiteName()} : ${url}`);

  return lines.join('\n');
}

export function buildProductShareTitle(name: string): string {
  return `${name} — ${getActiveSiteName()}`;
}

/** Ouvre toujours dans un nouvel onglet. */
function openShareInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/** Lance un deep link (ex. fb-messenger://) sans quitter la page courante. */
function openDeepLink(url: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
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
    const file = await fetchImageAsFile(payload.imageUrl, 'produit-troco');
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

/** Limite longueur pour deep links (Instagram, Messenger). */
function truncateForDeepLink(text: string, maxLen = 1200): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1).trimEnd()}…`;
}

function buildMessengerSharesheetUrl(text: string): string {
  return `fb-messenger://share?text=${encodeURIComponent(truncateForDeepLink(text))}`;
}

export async function shareViaMessenger(
  payload: RichSharePayload,
): Promise<NativeShareResult | 'sharesheet' | 'clipboard'> {
  const native = await shareViaNativeRich(payload);
  if (native === 'shared' || native === 'aborted') return native;

  await copyShareMessage(payload.text);

  if (isMobileDevice()) {
    openDeepLink(buildMessengerSharesheetUrl(payload.text));
    return 'sharesheet';
  }

  openShareInNewTab('https://www.messenger.com/');
  return 'clipboard';
}

function openInstagramDirect() {
  openShareInNewTab('https://www.instagram.com/direct/inbox/');
}

function buildInstagramSharesheetUrl(text: string): string {
  return `instagram://sharesheet?text=${encodeURIComponent(truncateForDeepLink(text))}`;
}

export async function shareViaInstagram(
  payload: RichSharePayload,
): Promise<NativeShareResult | 'sharesheet' | 'link'> {
  const native = await shareViaNativeRich(payload);
  if (native === 'shared' || native === 'aborted') return native;

  await copyShareMessage(payload.text);

  if (isMobileDevice()) {
    openDeepLink(buildInstagramSharesheetUrl(payload.text));
    return 'sharesheet';
  }

  openInstagramDirect();
  return 'link';
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
