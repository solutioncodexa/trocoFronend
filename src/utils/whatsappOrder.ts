import type { CartItem } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';

function whatsappDigits(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  if (v.startsWith('http')) {
    const m = v.match(/wa\.me\/(\d+)/);
    if (m) return m[1];
  }
  const digits = v.replace(/\D/g, '');
  return digits || null;
}

export function resolveStoreWhatsAppNumber(
  contactWhatsapp?: string | null,
  contactPhone?: string | null,
): string | null {
  return whatsappDigits(contactWhatsapp) || whatsappDigits(contactPhone);
}

export function buildWhatsAppMessageUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function applyWhatsAppTemplate(
  template: string | null | undefined,
  vars: Record<string, string>,
): string {
  const fallback =
    'Bonjour, je souhaite commander: {productName} ({url})';
  let msg = (template?.trim() || fallback);
  for (const [key, value] of Object.entries(vars)) {
    msg = msg.replaceAll(`{${key}}`, value);
  }
  return msg;
}

export function buildProductWhatsAppMessage(
  productName: string,
  productUrl: string,
  template?: string | null,
): string {
  return applyWhatsAppTemplate(template, { productName, url: productUrl });
}

export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map(
    (i) =>
      `• ${i.product.name}${i.selectedSize ? ` (${i.selectedSize})` : ''} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`,
  );
  return ['Bonjour, je souhaite commander mon panier :', '', ...lines, '', `Total indicatif : ${formatPrice(total)}`].join(
    '\n',
  );
}
