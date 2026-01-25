export type ProductCategory = 'beldi' | 'modern';
export type ProductType = 'bracelet' | 'ring' | 'necklace' | 'earrings' | 'set';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number; // in grams
  images: string[];
  category: ProductCategory;
  type: ProductType;
  inStock: boolean;
  stockQuantity: number;
  badges: ('new' | 'bestseller')[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
