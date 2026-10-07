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
  marque?: string;
  weight?: number;
  customizable?: boolean;
  rentalEnabled?: boolean;
  rentalUnit?: string;
  rentalDeposit?: number | null;
  rentalMinUnits?: number | null;
  rentalMaxUnits?: number | null;
}

export interface ProductDetailDTO extends ProductListItemDTO {
  /** SEO personnalisé (titre / description meta). */
  seoTitle?: string;
  seoDescription?: string;
  description: string;
  shortDescription?: string;
  availableSizes?: string[];
  marginGain?: number;
  variants?: ProductVariant[];
  deleted?: boolean;
}

/** @deprecated Utiliser ProductDetailDTO */
export type ProductDTO = ProductDetailDTO;
