export interface StockSettingsDTO {
  defaultSafetyStock: number;
  expiryAlertDays: number;
  alertsEnabled: boolean;
  lowStockAlertsEnabled: boolean;
  expiryAlertsEnabled: boolean;
}

export interface StockVariantRowDTO {
  variantId: number;
  productId: number;
  productName: string;
  variantLabel: string;
  sku?: string;
  stock: number;
  safetyStock: number | null;
  effectiveSafetyStock: number;
  usesDefaultSafety: boolean;
  reorderQty: number | null;
  expiryDate: string | null;
  lastRestockedAt: string | null;
  price: number;
  status: 'OK' | 'LOW' | 'OUT' | 'EXPIRING' | string;
}

export interface StockOverviewDTO {
  lowStockCount: number;
  outOfStockCount: number;
  expiringSoonCount: number;
  stockValue: number;
  defaultSafetyStock: number;
  expiryAlertDays: number;
  alerts: StockVariantRowDTO[];
}

export interface StockMovementDTO {
  id: number;
  variantId: number | null;
  productId: number | null;
  productName?: string;
  variantLabel?: string;
  type: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reason?: string;
  orderId?: number;
  createdBy?: string;
  createdAt: string;
}

export interface StockAdjustRequest {
  variantId: number;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUST';
  reason?: string;
}

export interface StockVariantPatchRequest {
  safetyStock?: number | null;
  clearSafetyStock?: boolean;
  reorderQty?: number | null;
  expiryDate?: string | null;
  clearExpiryDate?: boolean;
}
