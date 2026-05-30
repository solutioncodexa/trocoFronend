export type PromoCodeType = 'single_use' | 'reusable';
export type DiscountType = 'percentage' | 'fixed';

export interface PromoCodeDTO {
  id: number;
  code: string;
  type: PromoCodeType;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface PromoCodeStatsDTO {
  total: number;
  active: number;
  singleUse: number;
  reusable: number;
}

export interface CreatePromoCodeRequest {
  code: string;
  type: PromoCodeType;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface UpdatePromoCodeRequest extends Partial<CreatePromoCodeRequest> {}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  message: string;
  discountType?: DiscountType;
  discountValue?: number;
  code?: string;
}

export interface PromoSuggestionDTO {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  /** How much more the customer needs to spend to unlock this */
  amountNeeded: number;
  /** true = customer already qualifies */
  qualified: boolean;
}
