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

/** Produit allégé sur les lignes de commande (réponse + create). */
export interface OrderLineProductDTO {
  id: string;
  name: string;
  price: number;
  images?: string[];
  weight?: number;
  sku?: string;
}

export interface CartItemDTO {
  product: OrderLineProductDTO;
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

export type CheckoutPaymentMethod = 'cash_on_delivery' | 'online' | 'card_cmi' | 'bnpl';

export interface OrderDTO {
  id: string;
  items: CartItemDTO[];
  customer: CustomerDTO;
  total: number;
  paymentMethod: CheckoutPaymentMethod | string;
  status: string; // 'new', 'confirmed', 'delivered', 'cancelled'
  createdAt: string;
  promoCode?: string;
  discount?: number;
  shippingFee?: number;
  carrierCode?: string;
  loyaltyPointsToRedeem?: number;
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
}

/** Accusé de création (POST /orders) — sans lignes. */
export interface OrderCreatedDTO {
  id: string;
  orderNumber?: string | null;
  total: number;
  status: string;
  paymentStatus?: string | null;
  loyaltyPointsEarned?: number | null;
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
export interface PlanFeaturesDTO {
  themes?: string;
  pageBuilder?: string;
  abTesting?: boolean;
  abandonedCart?: boolean;
  abandonedCartAdvanced?: boolean;
  whatsappBusiness?: boolean;
  whatsappMultiTemplates?: boolean;
  webhooks?: string;
  blogSeo?: string;
  support?: string;
  apiHeadless?: boolean;
  loyalty?: boolean;
  multiCurrency?: boolean;
}

/** Landing / inscription (GET /platform/plans). */
export interface PlanMarketingDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
  priceMad: number;
  currency?: string;
  maxProducts?: number | null;
  maxStaff?: number | null;
  maxOrdersPerMonth?: number | null;
  maxPixels?: number | null;
  storageMb?: number | null;
  customDomain?: boolean;
  features?: PlanFeaturesDTO;
}

/** Config Super Admin (GET /platform/plans/admin). */
export interface PlanDTO extends PlanMarketingDTO {
  billingPeriod?: string;
  active?: boolean;
}

export interface UpdatePlanRequest {
  code?: string;
  name?: string;
  description?: string;
  priceMad?: number;
  currency?: string;
  billingPeriod?: string;
  maxProducts?: number | null;
  maxStaff?: number | null;
  maxOrdersPerMonth?: number | null;
  maxPixels?: number | null;
  storageMb?: number | null;
  customDomain?: boolean;
  active?: boolean;
  features?: PlanFeaturesDTO;
}

/** Bootstrap vitrine publique (GET /platform/store) — sans paiement / plan. */
export interface StorefrontBootstrapDTO {
  fournisseurId: number;
  slug: string;
  status?: string | null;
  siteName: string;
  tagline?: string | null;
  aboutText?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  themeKey?: string | null;
  fontPair?: string | null;
  radiusPreset?: string | null;
  appearance?: import('@/config/storeAppearance').StoreAppearance | Record<string, unknown> | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactCity?: string | null;
  freeShippingThreshold?: number | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  heroEnabled: boolean;
  categoriesEnabled: boolean;
  surMesureEnabled: boolean;
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAdsId?: string | null;
  googleAnalyticsId?: string | null;
  cookieConsentRequired?: boolean;
  privacyPolicyUrl?: string | null;
  defaultLocale?: string | null;
  supportedLocales?: string | null;
  currency?: string | null;
  currencyRatesJson?: string | null;
  whatsappOrderTemplate?: string | null;
}

/** Checkout à la demande (GET /platform/store/checkout). */
export interface StorefrontCheckoutDTO {
  slug: string;
  paymentCodEnabled: boolean;
  paymentCmiEnabled: boolean;
  paymentBnplEnabled: boolean;
  bnplProvider?: string | null;
  loyaltyEnabled: boolean;
  loyaltyPointsPerMad?: number | null;
  loyaltyMadPerPoint?: number | null;
  shippingDefaultCarrier?: string | null;
  abandonedCartEnabled: boolean;
  freeShippingThreshold?: number | null;
}

/** Shell admin (GET /store-settings/me/summary). */
export interface AdminStoreSummaryDTO {
  fournisseurId: number;
  slug: string;
  status?: string | null;
  siteName: string;
  tagline?: string | null;
  aboutText?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  themeKey?: string | null;
  fontPair?: string | null;
  radiusPreset?: string | null;
  appearance?: import('@/config/storeAppearance').StoreAppearance | Record<string, unknown> | null;
  planCode?: string | null;
  planName?: string | null;
}

/**
 * Contexte tenant unifié.
 * Vitrine → StorefrontBootstrapDTO ; admin shell → summary (+ plan) avec flags optionnels.
 */
export type TenantStoreDTO = StorefrontBootstrapDTO & {
  planCode?: string | null;
  planName?: string | null;
};

/** Config complète — page Paramètres admin uniquement. */
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
  fontPair?: string | null;
  radiusPreset?: string | null;
  appearance?: import('@/config/storeAppearance').StoreAppearance | Record<string, unknown> | null;
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
  defaultLocale?: string | null;
  supportedLocales?: string | null;
  currency?: string | null;
  currencyRatesJson?: string | null;
  paymentCodEnabled?: boolean;
  paymentCmiEnabled?: boolean;
  paymentBnplEnabled?: boolean;
  bnplProvider?: string | null;
  loyaltyEnabled?: boolean;
  loyaltyPointsPerMad?: number | null;
  loyaltyMadPerPoint?: number | null;
  privacyPolicyUrl?: string | null;
  cookieConsentRequired?: boolean;
  dataRetentionDays?: number | null;
  cndpNoticeVersion?: string | null;
  shippingDefaultCarrier?: string | null;
  /** Snapshots look par thème (classic/minimal/bold/elegant). */
  themePresets?: Record<string, Record<string, unknown>> | null;
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
  fontPair?: string;
  radiusPreset?: string;
  appearance?: import('@/config/storeAppearance').StoreAppearance | Record<string, unknown>;
  metaPixelId?: string;
  tiktokPixelId?: string;
  googleAdsId?: string;
  googleAnalyticsId?: string;
  abandonedCartEnabled?: boolean;
  abandonedCartDelayMinutes?: number | null;
  whatsappOrderTemplate?: string;
  defaultLocale?: string;
  supportedLocales?: string;
  currency?: string;
  currencyRatesJson?: string;
  paymentCodEnabled?: boolean;
  paymentCmiEnabled?: boolean;
  paymentBnplEnabled?: boolean;
  bnplProvider?: string;
  loyaltyEnabled?: boolean;
  loyaltyPointsPerMad?: number | null;
  loyaltyMadPerPoint?: number | null;
  privacyPolicyUrl?: string;
  cookieConsentRequired?: boolean;
  dataRetentionDays?: number | null;
  cndpNoticeVersion?: string;
  shippingDefaultCarrier?: string;
}

export interface CatalogFacetsDTO {
  categories: CatalogFacetBucket[];
  sizes: CatalogFacetBucket[];
  priceMin: number;
  priceMax: number;
  totalProducts: number;
}

export interface CatalogFacetBucket {
  value: string;
  label: string;
  count: number;
}

export interface ShippingCarrierDTO {
  id?: number;
  code: string;
  name: string;
  enabled?: boolean;
  baseFee?: number;
  freeAbove?: number | null;
  trackingUrlTemplate?: string | null;
  etaDaysMin?: number | null;
  etaDaysMax?: number | null;
  sortOrder?: number | null;
  quotedFee?: number | null;
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
}

export interface CategoryNavDTO {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
}

export interface CategoryCardDTO {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  heroImageUrl?: string | null;
}

export interface CategoryHeroDTO {
  id: number;
  name: string;
  slug: string;
  heroImageUrl?: string | null;
  heroSortOrder?: number | null;
}

export interface AbandonedCartListItemDTO {
  id: number;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  cartTotal?: number | null;
  itemCount: number;
  reminderSent: boolean;
  recovered: boolean;
  remindAt?: string | null;
  lastActivityAt?: string | null;
  createdAt?: string | null;
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
