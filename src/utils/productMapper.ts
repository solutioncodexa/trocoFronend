import type { ProductDetailDTO, ProductListItemDTO } from '@/types/product-dtos';
import { Product, ProductCategory, ProductType, GoldType } from '@/types/product';

const getBackendUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

function resolveDtoImages(dto: Pick<ProductListItemDTO, 'images' | 'category'>): string[] {
  const images = (dto.images || []).map((img) => {
    if (img.startsWith('http')) {
      return img;
    }
    const baseUrl = getBackendUrl();
    return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
  });
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
    goldType: dto.goldType as GoldType,
    collection: dto.collection,
    availableSizes: dto.availableSizes || [],
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
