// Types pour les réponses API du backend

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
  status?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Types pour les DTOs du backend
export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: number;
  images: string[];
  category: string; // 'beldi' or 'modern'
  type: string; // 'bracelet', 'ring', 'necklace', 'earrings', 'set'
  goldType: string; // 'yellow', 'white', 'rose'
  collection?: string;
  availableSizes?: string[];
  inStock?: boolean;
  stockQuantity?: number;
  badges?: string[]; // 'new', 'bestseller', 'promo'
  createdAt?: string;
}

export interface CartItemDTO {
  product: ProductDTO;
  quantity: number;
  selectedSize?: string;
  selectedGoldType?: string;
}

export interface CustomerDTO {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
}

export interface OrderDTO {
  id: string;
  items: CartItemDTO[];
  customer: CustomerDTO;
  total: number;
  paymentMethod: string; // 'cash_on_delivery' or 'online'
  status: string; // 'new', 'confirmed', 'delivered', 'cancelled'
  createdAt: string;
}

export interface CustomOrderDTO {
  id: string;
  imageUrl?: string;
  description: string;
  type: string; // ProductType
  weight?: number;
  style: string; // ProductCategory
  customer: CustomerDTO;
  status: string; // 'pending', 'contacted', 'completed'
  estimatedPrice?: number;
  createdAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface CollectionDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartDTO {
  id: number;
  sessionId: string;
  items: CartItemDTO[];
  createdAt?: string;
}

export interface ProductTypeDTO {
  id: string;
  name: string;
  code: string;
  requiresSize: boolean;
  sizeOptions?: string[];
}

export interface GoldTypeDTO {
  id: number;
  name: string;
  code: string;
  sortOrder?: number;
}

// Auth DTOs
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  id: number;
  email: string;
  role: string;
  expires_in: number;
}

export interface UserInfoDTO {
  id: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: string;
}

export interface GoldPriceSettingDTO {
  id: number;
  pricePerGram: number;
}

// Notifications
export interface NotificationDTO {
  id: number;
  type: string; // ORDER, CUSTOM_ORDER
  title: string;
  message: string;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
}

// Gold price API (or.fr / goldbroker.com)
export interface GoldPricePointDTO {
  date: string;
  price: number;
}

export interface GoldPriceDTO {
  currentPrice: number;
  currency: string;
  metal: string;
  weightUnit: string;
  source: string;
  history: GoldPricePointDTO[];
}
