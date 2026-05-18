import type { ProductVariant } from './product-variant';

export type ProductCategory = 'beldi' | 'modern';
export type ProductType = 'bracelet' | 'ring' | 'necklace' | 'earrings' | 'set';
export type PaymentMethod = 'cash_on_delivery' | 'online';

// Size options for rings and necklaces
export const ringSizes = ['41', '43', '45', '47', '49', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72'];
export const necklaceSizes = ['40cm', '42cm', '45cm', '50cm', '55cm', '60cm'];
export const braceletSizes = ['16cm', '17cm', '18cm', '19cm', '20cm', '21cm'];

// Collection management
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Prix avant réduction
  weight: number; // in grams
  images: string[];
  category: ProductCategory;
  type: ProductType;
  /** Conservé pour compatibilité API / données existantes ; non utilisé côté UI */
  goldType?: string;
  collection?: string; // ID de la collection
  availableSizes?: string[];
  inStock: boolean;
  stockQuantity: number;
  /** Marge / gain du produit (MAD). Prix = (poids × prix_au_gramme) + marginGain */
  marginGain?: number;
  badges: ('new' | 'bestseller' | 'promo')[];
  createdAt: string;
}

// Collections par défaut
export const defaultCollections: Collection[] = [
  {
    id: 'mariage',
    name: 'Mariage',
    slug: 'mariage',
    description: 'Collections pour les mariages et fiançailles',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'homme',
    name: 'Homme',
    slug: 'homme',
    description: 'Collections masculines',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'femme',
    name: 'Femme',
    slug: 'femme',
    description: 'Collections féminines',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariantId?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  total: number;
  paymentMethod: PaymentMethod;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CustomFabricationRequest {
  id: string;
  imageUrl: string;
  description: string;
  type: ProductType;
  weight: number;
  style: ProductCategory;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}

// Product type definitions for admin management
export interface ProductTypeDefinition {
  id: string;
  name: string;
  requiresSize: boolean;
  sizeOptions?: string[];
}

export const defaultProductTypes: ProductTypeDefinition[] = [
  { id: 'bracelet', name: 'Bracelet', requiresSize: true, sizeOptions: braceletSizes },
  { id: 'ring', name: 'Bague', requiresSize: true, sizeOptions: ringSizes },
  { id: 'necklace', name: 'Collier', requiresSize: true, sizeOptions: necklaceSizes },
  { id: 'earrings', name: 'Boucles d\'oreilles', requiresSize: false },
  { id: 'set', name: 'Parure', requiresSize: false },
];

