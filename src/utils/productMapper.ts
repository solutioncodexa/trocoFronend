import type { ProductDetailDTO, ProductListItemDTO } from '@/types/product-dtos';
import { Product } from '@/types/product';
import type { ProductVariant } from '@/types/product-variant';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

/** API / JSON peuvent renvoyer une chaîne "52,54" ou un tableau */
export function normalizeAvailableSizes(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function resolveDtoImages(dto: Pick<ProductListItemDTO, 'images'>): string[] {
  const images = (dto.images || []).map((img) => resolvePublicImageUrl(img)).filter(Boolean);
  if (images.length > 0) return images;
  return ['/placeholder-modern-fixed.svg'];
}

export const mapProductDetailToProduct = (dto: ProductDetailDTO): Product => {
  const finalImages = resolveDtoImages(dto);
  const variants = normalizeVariants(dto.variants, dto);

  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? '',
    shortDescription: dto.shortDescription,
    price: dto.price,
    originalPrice: dto.originalPrice,
    images: finalImages,
    category: dto.category || '',
    sku: dto.sku,
    marque: dto.marque?.trim() || undefined,
    seoTitle: dto.seoTitle?.trim() || undefined,
    seoDescription: dto.seoDescription?.trim() || undefined,
    availableSizes: normalizeAvailableSizes(dto.availableSizes),
    inStock: dto.inStock ?? true,
    stockQuantity: dto.stockQuantity ?? 0,
    marginGain: dto.marginGain,
    weight: dto.weight,
    variants,
    badges: (dto.badges || []) as ('new' | 'bestseller' | 'promo')[],
    createdAt: dto.createdAt || new Date().toISOString(),
    customizable: dto.customizable === true,
    rentalEnabled: dto.rentalEnabled === true,
    rentalUnit: dto.rentalUnit?.toUpperCase() === 'WEEK' ? 'WEEK' : 'DAY',
    rentalDeposit: dto.rentalDeposit ?? null,
    rentalMinUnits: dto.rentalMinUnits ?? null,
    rentalMaxUnits: dto.rentalMaxUnits ?? null,
  };
};

function normalizeVariants(raw: ProductVariant[] | undefined, dto: ProductListItemDTO): ProductVariant[] {
  if (raw && raw.length > 0) {
    return [...raw].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }
  return [
    {
      label: 'Standard',
      price: dto.price,
      originalPrice: dto.originalPrice,
      stock: dto.stockQuantity,
      sku: dto.sku,
      displayOrder: 0,
      isDefault: true,
    },
  ];
}

export const mapProductListItemToProduct = (dto: ProductListItemDTO): Product => {
  return mapProductDetailToProduct({
    ...dto,
    description: '',
  });
};

export const mapProductListItemListToProducts = (list?: ProductListItemDTO[] | null): Product[] => {
  if (!list) return [];
  return list.map(mapProductListItemToProduct);
};

export function getDefaultVariant(product: Product): ProductVariant {
  const variants = product.variants ?? [];
  if (variants.length === 0) {
    return {
      label: 'Standard',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stockQuantity,
      sku: product.sku,
      isDefault: true,
      displayOrder: 0,
    };
  }
  return variants.find((v) => v.isDefault) ?? variants[0];
}

export function applyVariantToProduct(product: Product, variant: ProductVariant): Product {
  return {
    ...product,
    price: variant.price,
    originalPrice: variant.originalPrice,
    stockQuantity: variant.stock ?? product.stockQuantity,
    sku: variant.sku ?? product.sku,
    weight: variant.weight ?? product.weight,
  };
}

export function getVariantKey(v: ProductVariant): string {
  if (v.id != null && v.id !== '') return v.id;
  const attrs = (v.attributes ?? []).map((a) => `${a.name}=${a.value}`).join('|');
  return `a-${v.attributeName ?? ''}-${v.attributeValue ?? ''}-${attrs}-${v.label ?? ''}-${v.price}`;
}
