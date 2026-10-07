import type { ProductVariant } from './product-variant';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'online'
  | 'card_cmi'
  | 'card_stripe'
  | 'paypal'
  | 'bnpl'
  | 'payzone'
  | 'bank_transfer';

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
  /** Marque / label produit (ex. Apple, Nike). */
  marque?: string;
  /** SEO personnalisé (sinon dérivé du nom / de la description). */
  seoTitle?: string;
  seoDescription?: string;
  /** Legacy / optional */
  availableSizes?: string[];
  weight?: number;
  marginGain?: number;
  /** Si true, le client peut uploader son logo */
  customizable?: boolean;
  /** Location : le prix est alors le tarif par unité (jour par défaut). */
  rentalEnabled?: boolean;
  rentalUnit?: 'DAY' | 'WEEK';
  rentalDeposit?: number | null;
  rentalMinUnits?: number | null;
  rentalMaxUnits?: number | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariantId?: string;
  /** Location : période choisie (jours inclus, `YYYY-MM-DD`) et unité de facturation. */
  rentalStart?: string;
  rentalEnd?: string;
  rentalUnit?: 'DAY' | 'WEEK';
  rentalDeposit?: number | null;
  /** Clé d'identité de la ligne (front uniquement) : distingue deux variantes sans id. */
  variantKey?: string;
  /** Libellé lisible de la variante choisie (ex. « Quantité : 10 »). */
  variantLabel?: string;
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
