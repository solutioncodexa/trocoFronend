export type ProductCategory = 'beldi' | 'modern';
export type ProductType = 'bracelet' | 'ring' | 'necklace' | 'earrings' | 'set';
export type GoldType = 'yellow' | 'white' | 'rose';
export type PaymentMethod = 'cash_on_delivery' | 'online';

// Size options for rings and necklaces
export const ringSizes = ['48', '50', '52', '54', '56', '58', '60', '62', '64', '66'];
export const necklaceSizes = ['40cm', '42cm', '45cm', '50cm', '55cm', '60cm'];
export const braceletSizes = ['16cm', '17cm', '18cm', '19cm', '20cm', '21cm'];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number; // in grams
  images: string[];
  category: ProductCategory;
  type: ProductType;
  goldType: GoldType; // or jaune, or blanc, or rose
  availableSizes?: string[]; // for rings and necklaces
  inStock: boolean;
  stockQuantity: number;
  badges: ('new' | 'bestseller')[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedGoldType?: GoldType;
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

export const goldTypeLabels: Record<GoldType, string> = {
  yellow: 'Or Jaune',
  white: 'Or Blanc',
  rose: 'Or Rose',
};
