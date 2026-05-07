import type { ProductDetailDTO, ProductListItemDTO } from '@/types/product-dtos';
import { Product, ProductCategory, ProductType } from '@/types/product';
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
    badges: (dto.badges || []) as ('new' | 'bestseller' | 'promo')[],
    createdAt: dto.createdAt || new Date().toISOString(),
  };
};

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

export const mapProductListItemListToProducts = (dtos: ProductListItemDTO[]): Product[] =>
  dtos.map(mapProductListItemToProduct);

export const mapProductDetailListToProducts = (dtos: ProductDetailDTO[]): Product[] =>
  dtos.map(mapProductDetailToProduct);

/** Alias historique : listes API légères */
export const mapProductDTOListToProducts = mapProductListItemListToProducts;
