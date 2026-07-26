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

export type { ProductListItemDTO, ProductDetailDTO, ProductDTO } from './product-dtos';

import type { ProductDetailDTO } from './product-dtos';

export interface CartItemDTO {
  product: ProductDetailDTO;
  quantity: number;
  selectedSize?: string;
  selectedVariantId?: string;
  /** @deprecated leftover jewelry field — unused for packaging */
  selectedGoldType?: string;
  customLogoUrl?: string;
}

export interface CustomerDTO {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
}

/** Client allégé pour listes admin */
export interface CustomerSummaryDTO {
  fullName: string;
  phone: string;
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
  promoCode?: string;
  discount?: number;
}

/** Liste paginée admin — sans articles ni produits complets */
export interface OrderListItemDTO {
  id: string;
  customer: CustomerSummaryDTO;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  previewProductName?: string;
  previewProductImage?: string;
}

export interface CustomOrderStatsDTO {
  total: number;
  pending: number;
  contacted: number;
  completed: number;
}

export interface CustomOrderDTO {
  id: string;
  imageUrl?: string;
  referenceImageUrls?: string[];
  description: string;
  type: string;
  size?: string;
  weight?: number;
  style: string;
  customer: CustomerDTO;
  status: string; // 'pending', 'contacted', 'completed'
  estimatedPrice?: number;
  createdAt: string;
}

/** Liste paginée admin — description tronquée, sans images de référence multiples */
export interface CustomOrderListItemDTO {
  id: string;
  imageUrl?: string;
  description: string;
  type: string;
  weight?: number;
  style: string;
  customer: CustomerSummaryDTO;
  status: string;
  createdAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
  parentName?: string | null;
  /** Bandeau accueil — géré en admin */
  heroImageUrl?: string | null;
  showOnHero?: boolean;
  heroSortOrder?: number | null;
  productCount?: number;
}

export interface HeroCategoryPatchDTO {
  showOnHero?: boolean;
  heroSortOrder?: number;
  /** true : ordre automatique (affichage aléatoire avec les autres sans ordre manuel) */
  automaticHeroSortOrder?: boolean;
  /** Chaîne vide pour retirer l’image */
  heroImageUrl?: string | null;
}

export interface CartDTO {
  id: number;
  sessionId: string;
  items: CartItemDTO[];
  createdAt?: string;
}

// Auth DTOs
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  id: number;
  email: string;
  role: string;
  fullName?: string;
  permissions?: string[];
  /** Snake_case from backend AuthResponse */
  fournisseur_id?: number | null;
  /** CamelCase fallback */
  fournisseurId?: number | null;
  expires_in: number;
}

export interface UserInfoDTO {
  id: number;
  email: string;
  role: string;
  fullName?: string;
  active?: boolean;
  fournisseurId?: number | null;
  permissions?: string[];
}

// Platform / multi-tenant
export interface PlanDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
  priceMad: number;
  currency?: string;
  billingPeriod?: string;
  maxProducts?: number | null;
  maxStaff?: number | null;
  customDomain?: boolean;
  active?: boolean;
}

export interface StoreSettingsDTO {
  fournisseurId: number;
  slug: string;
  siteName: string;
  tagline?: string | null;
  aboutText?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  customDomain?: string | null;
  domainVerified?: boolean;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactCity?: string | null;
  freeShippingThreshold?: number | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  faviconUrl?: string | null;
  heroEnabled: boolean;
  categoriesEnabled: boolean;
  surMesureEnabled: boolean;
  themeKey?: string | null;
  status?: string | null;
  planCode?: string | null;
  planName?: string | null;
  planPriceMad?: number | null;
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAdsId?: string | null;
  googleAnalyticsId?: string | null;
  abandonedCartEnabled?: boolean;
  abandonedCartDelayMinutes?: number | null;
  whatsappOrderTemplate?: string | null;
}

export interface StoreThemeDTO {
  key: string;
  label: string;
  description: string;
}

export interface CmiCheckoutDTO {
  gatewayUrl: string;
  oid: string;
  fields: Record<string, string>;
}

export interface BillingResultDTO {
  mode: string;
  oid: string;
  status: string;
  planCode?: string | null;
  planName?: string | null;
  amountMad?: number | null;
  subscriptionEndsAt?: string | null;
}

export interface FournisseurDTO {
  id: number;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  customDomain?: string | null;
  domainVerified?: boolean;
  status: string;
  planCode?: string | null;
  planName?: string | null;
  planPriceMad?: number | null;
  createdAt?: string | null;
  subscriptionEndsAt?: string | null;
}

export interface CreateFournisseurRequest {
  name: string;
  slug: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName?: string;
  email?: string;
  phone?: string;
  planCode?: string;
}

export interface UpdateStoreSettingsRequest {
  siteName?: string;
  tagline?: string;
  aboutText?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactCity?: string;
  freeShippingThreshold?: number | null;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  faviconUrl?: string;
  heroEnabled?: boolean;
  categoriesEnabled?: boolean;
  surMesureEnabled?: boolean;
  themeKey?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
  googleAdsId?: string;
  googleAnalyticsId?: string;
  abandonedCartEnabled?: boolean;
  abandonedCartDelayMinutes?: number | null;
  whatsappOrderTemplate?: string;
}

export interface ProductReviewDTO {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  title?: string | null;
  body: string;
  approved: boolean;
  createdAt: string;
}

export interface ProductReviewSummaryDTO {
  productId: number;
  averageRating: number;
  reviewCount: number;
  reviews: ProductReviewDTO[];
}

export interface CreateProductReviewRequest {
  productId: number;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  body: string;
}

export interface AbandonedCartDTO {
  id: number;
  sessionKey: string;
  recoveryToken?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  cartJson?: string | null;
  cartTotal?: number | null;
  itemCount: number;
  reminderSent: boolean;
  recovered: boolean;
  remindAt?: string | null;
  lastActivityAt?: string | null;
  createdAt?: string | null;
}

export interface CaptureAbandonedCartRequest {
  sessionKey: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  items: Record<string, unknown>[];
  cartTotal?: number;
}

export interface PermissionDTO {
  code: string;
  label: string;
  category: string;
  description?: string;
}

export interface MemberDTO {
  id: number;
  email: string;
  fullName?: string;
  role: string;
  active: boolean;
  createdAt?: string;
  permissions: string[];
}

export interface AuditLogDTO {
  id: number;
  action: string;
  entityName?: string;
  entityId?: string;
  description?: string;
  createdAt: string;
  userId?: number;
  username?: string;
  userFullName?: string;
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

// Notifications
export interface NotificationDTO {
  id: number;
  type: string; // ORDER, CUSTOM_ORDER, LOW_STOCK, OUT_OF_STOCK, EXPIRING_SOON
  title: string;
  message: string;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
}

// (types gold / cours or retirés — projet emballage)
