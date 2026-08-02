import type { ProductVariant } from './product-variant';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'online'
  | 'card_cmi'
  | 'card_stripe'
  | 'paypal'
  | 'bnpl';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sku?: string;
  inStock: boolean;
  stockQuantity: number;
  badges: ('new' | 'bestseller' | 'promo')[];
  createdAt: string;
  variants?: ProductVariant[];
  /** Legacy / optional */
  goldType?: string;
  availableSizes?: string[];
  weight?: number;
  marginGain?: number;
  showWeight?: boolean;
  /** Si true, le client peut uploader son logo */
  customizable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariantId?: string;
  /** Logo client (URL upload) pour produits personnalisés */
  customLogoUrl?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

/** Compat export used elsewhere */
export type ProductCategory = string;
