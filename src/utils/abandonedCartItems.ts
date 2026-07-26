import type { CartItem } from '@/types/product';

export function cartItemsToCapturePayload(items: CartItem[]): Record<string, unknown>[] {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    selectedSize: item.selectedSize ?? null,
    selectedVariantId: item.selectedVariantId ?? null,
    customLogoUrl: item.customLogoUrl ?? null,
    name: item.product.name,
    price: item.product.price,
  }));
}

export type ParsedCartLine = {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedVariantId?: string;
  customLogoUrl?: string;
};

function readId(obj: Record<string, unknown>): string | null {
  const raw = obj.productId ?? obj.product_id ?? obj.id;
  if (raw == null) return null;
  return String(raw);
}

function readQty(obj: Record<string, unknown>): number {
  const raw = obj.quantity ?? obj.qty ?? 1;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function parseAbandonedCartJson(cartJson?: string | null): ParsedCartLine[] {
  if (!cartJson?.trim()) return [];
  try {
    const parsed = JSON.parse(cartJson) as unknown;
    if (!Array.isArray(parsed)) return [];
    const lines: ParsedCartLine[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') continue;
      const o = entry as Record<string, unknown>;
      const productId = readId(o);
      if (!productId) continue;
      lines.push({
        productId,
        quantity: readQty(o),
        selectedSize: typeof o.selectedSize === 'string' ? o.selectedSize : undefined,
        selectedVariantId:
          o.selectedVariantId != null ? String(o.selectedVariantId) : undefined,
        customLogoUrl: typeof o.customLogoUrl === 'string' ? o.customLogoUrl : undefined,
      });
    }
    return lines;
  } catch {
    return [];
  }
}
