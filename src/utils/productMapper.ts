import { ProductDTO } from '@/types/api';
import { Product, ProductCategory, ProductType, GoldType } from '@/types/product';

/**
 * Convertit un ProductDTO (backend) en Product (frontend)
 */
export const mapProductDTOToProduct = (dto: ProductDTO): Product => {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    price: dto.price,
    originalPrice: dto.originalPrice,
    weight: dto.weight,
    images: dto.images || [],
    category: (dto.category === 'beldi' ? 'beldi' : 'modern') as ProductCategory,
    type: dto.type as ProductType,
    goldType: dto.goldType as GoldType,
    collection: dto.collection,
    availableSizes: dto.availableSizes || [],
    inStock: dto.inStock ?? true,
    stockQuantity: dto.stockQuantity ?? 0,
    marginGain: dto.marginGain,
    badges: (dto.badges || []) as ('new' | 'bestseller' | 'promo')[],
    createdAt: dto.createdAt || new Date().toISOString(),
  };
};

/**
 * Convertit une liste de ProductDTO en Product
 */
export const mapProductDTOListToProducts = (dtos: ProductDTO[]): Product[] => {
  return dtos.map(mapProductDTOToProduct);
};
