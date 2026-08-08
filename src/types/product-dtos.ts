import type { ProductVariant } from './product-variant';

export type { ProductVariant };

export interface ProductListItemDTO {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sku?: string;
  inStock?: boolean;
  stockQuantity?: number;
  badges?: string[];
  createdAt?: string;
  goldType?: string;
  weight?: number;
  customizable?: boolean;
}

export interface ProductDetailDTO extends ProductListItemDTO {
  description: string;
  shortDescription?: string;
  availableSizes?: string[];
  marginGain?: number;
  variants?: ProductVariant[];
  deleted?: boolean;
}

/** @deprecated Utiliser ProductDetailDTO */
export type ProductDTO = ProductDetailDTO;
