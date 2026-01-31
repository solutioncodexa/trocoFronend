import { ProductDTO } from '@/types/api';
import { Product, ProductCategory, ProductType, GoldType } from '@/types/product';

// Get the backend API base URL
const getBackendUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

/**
 * Convertit un ProductDTO (backend) en Product (frontend)
 */
export const mapProductDTOToProduct = (dto: ProductDTO): Product => {
  // Convert image paths to full URLs
  const images = (dto.images || []).map(img => {
    if (img.startsWith('http')) {
      return img; // Already full URL
    }
    // Convert relative path to full URL with /api context
    const baseUrl = getBackendUrl(); // Keep /api suffix since uploads are served on /api/uploads
    return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
  });

  // If no images, add default placeholder based on product category
  const finalImages = images.length > 0 ? images : [
    dto.category === 'beldi' ? '/placeholder-beldi-fixed.svg' : '/placeholder-modern-fixed.svg'
  ];

  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
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

/**
 * Convertit une liste de ProductDTO en Product
 */
export const mapProductDTOListToProducts = (dtos: ProductDTO[]): Product[] => {
  return dtos.map(mapProductDTOToProduct);
};
