import type { ProductDetailDTO, ProductListItemDTO } from '@/types/product-dtos';
import { Product, ProductCategory, ProductType } from '@/types/product';
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

function resolveDtoImages(dto: Pick<ProductListItemDTO, 'images' | 'category'>): string[] {
  const images = (dto.images || []).map((img) => resolvePublicImageUrl(img)).filter(Boolean);
  if (images.length > 0) return images;
  return [
    dto.category === 'beldi' ? '/placeholder-beldi-fixed.svg' : '/placeholder-modern-fixed.svg',
  ];
}

/** Fiche complète (GET /products/{id}, panier, commande) */
export const mapProductDetailToProduct = (dto: ProductDetailDTO): Product => {
  const finalImages = resolveDtoImages(dto);

  const variants = normalizeVariants(dto.variants, dto);

  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? '',
    price: dto.price,
    originalPrice: dto.originalPrice,
    weight: dto.weight,
    images: finalImages,
    category: (dto.category === 'beldi' ? 'beldi' : 'modern') as ProductCategory,
    type: dto.type as ProductType,
    goldType: dto.goldType ? String(dto.goldType) : undefined,
    collection: dto.collection,
    availableSizes: normalizeAvailableSizes(dto.availableSizes),
    inStock: dto.inStock ?? true,
    stockQuantity: dto.stockQuantity ?? 0,
    marginGain: dto.marginGain,
    variants,
    badges: (dto.badges || []) as ('new' | 'bestseller' | 'promo')[],
    createdAt: dto.createdAt || new Date().toISOString(),
  };
};

function normalizeVariants(raw: ProductVariant[] | undefined, dto: ProductListItemDTO): ProductVariant[] {
  if (raw && raw.length > 0) {
    return [...raw].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }
  return [
    {
      label: formatWeightLabel(dto.weight),
      weight: dto.weight,
      price: dto.price,
      originalPrice: dto.originalPrice,
      marginGain: 'marginGain' in dto ? (dto as ProductDetailDTO).marginGain : undefined,
      displayOrder: 0,
      isDefault: true,
    },
  ];
}

function formatWeightLabel(weight: number): string {
  if (weight === Math.floor(weight)) {
    return `${weight} g`;
  }
  return `${weight.toFixed(1)} g`;
}

export function getDefaultVariant(product: Pick<Product, 'variants' | 'price' | 'weight' | 'originalPrice' | 'marginGain'>): ProductVariant {
  const variants = product.variants ?? [];
  return variants.find((v) => v.isDefault) ?? variants[0] ?? {
    label: formatWeightLabel(product.weight),
    weight: product.weight,
    price: product.price,
    originalPrice: product.originalPrice,
    marginGain: product.marginGain,
    isDefault: true,
    displayOrder: 0,
  };
}

export function applyVariantToProduct(product: Product, variant: ProductVariant): Product {
  return {
    ...product,
    price: variant.price,
    originalPrice: variant.originalPrice,
    weight: variant.weight,
    marginGain: variant.marginGain ?? product.marginGain,
  };
}

/** Grille / filtres (GET /products, ProductListItemDTO) */
export const mapProductListItemToProduct = (dto: ProductListItemDTO): Product => {
  const asDetail: ProductDetailDTO = {
    ...dto,
    description: '',
    availableSizes: [],
  };
  return mapProductDetailToProduct(asDetail);
};

/** @deprecated Utiliser mapProductDetailToProduct */
export const mapProductDTOToProduct = mapProductDetailToProduct;

export const mapProductListItemListToProducts = (dtos?: ProductListItemDTO[] | null): Product[] =>
  (dtos ?? []).map(mapProductListItemToProduct);

export const mapProductDetailListToProducts = (dtos?: ProductDetailDTO[] | null): Product[] =>
  (dtos ?? []).map(mapProductDetailToProduct);

/** Alias historique : listes API légères */
export const mapProductDTOListToProducts = mapProductListItemListToProducts;
