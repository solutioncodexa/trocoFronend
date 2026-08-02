import { buildApiUrl, apiRequest } from '@/config/api';
import type {
  AdminStoreSummaryDTO,
  BillingResultDTO,
  CmiCheckoutDTO,
  CreateFournisseurRequest,
  FournisseurDTO,
  PlanDTO,
  PlanMarketingDTO,
  StorePaymentsConfigDTO,
  StoreSettingsDTO,
  StoreThemeDTO,
  StorefrontBootstrapDTO,
  StorefrontCheckoutDTO,
  UpdatePlanRequest,
  UpdateStoreSettingsRequest,
} from '@/types/api';

export type PaymentCredentialsTestPayload = {
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalMode?: string;
  cmiClientId?: string;
  cmiStoreKey?: string;
};

export const platformApi = {
  getPlans: (): Promise<PlanMarketingDTO[]> =>
    apiRequest<PlanMarketingDTO[]>(buildApiUrl('/platform/plans')),

  listPlansAdmin: (): Promise<PlanDTO[]> =>
    apiRequest<PlanDTO[]>(buildApiUrl('/platform/plans/admin')),

  createPlan: (payload: UpdatePlanRequest): Promise<PlanDTO> =>
    apiRequest<PlanDTO>(buildApiUrl('/platform/plans'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updatePlan: (id: number, payload: UpdatePlanRequest): Promise<PlanDTO> =>
    apiRequest<PlanDTO>(buildApiUrl(`/platform/plans/${id}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getThemes: (): Promise<StoreThemeDTO[]> =>
    apiRequest<StoreThemeDTO[]>(buildApiUrl('/platform/themes')),

  /** Bootstrap vitrine (léger). */
  getStore: (slug?: string): Promise<StorefrontBootstrapDTO> => {
    const qs = slug ? `?slug=${encodeURIComponent(slug)}` : '';
    return apiRequest<StorefrontBootstrapDTO>(buildApiUrl(`/platform/store${qs}`));
  },

  /** Checkout à la demande. */
  getStoreCheckout: (slug?: string): Promise<StorefrontCheckoutDTO> => {
    const qs = slug ? `?slug=${encodeURIComponent(slug)}` : '';
    return apiRequest<StorefrontCheckoutDTO>(buildApiUrl(`/platform/store/checkout${qs}`));
  },

  listFournisseurs: (): Promise<FournisseurDTO[]> =>
    apiRequest<FournisseurDTO[]>(buildApiUrl('/platform/fournisseurs')),

  getFournisseur: (id: number): Promise<FournisseurDTO> =>
    apiRequest<FournisseurDTO>(buildApiUrl(`/platform/fournisseurs/${id}`)),

  createFournisseur: (payload: CreateFournisseurRequest): Promise<FournisseurDTO> =>
    apiRequest<FournisseurDTO>(buildApiUrl('/platform/fournisseurs'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Inscription publique vendeur — statut PENDING jusqu'à activation Super Admin. */
  registerStore: (payload: CreateFournisseurRequest): Promise<FournisseurDTO> =>
    apiRequest<FournisseurDTO>(buildApiUrl('/platform/register'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateFournisseurStatus: (id: number, status: string): Promise<FournisseurDTO> =>
    apiRequest<FournisseurDTO>(buildApiUrl(`/platform/fournisseurs/${id}/status`), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateFournisseurPlan: (id: number, planCode: string): Promise<FournisseurDTO> =>
    apiRequest<FournisseurDTO>(buildApiUrl(`/platform/fournisseurs/${id}/plan`), {
      method: 'PATCH',
      body: JSON.stringify({ planCode }),
    }),

  /** Shell admin — layout / dashboard / session. */
  getMyStoreSummary: (): Promise<AdminStoreSummaryDTO> =>
    apiRequest<AdminStoreSummaryDTO>(buildApiUrl('/store-settings/me/summary')),

  /** Config complète — page Paramètres. */
  getMyStoreSettings: (): Promise<StoreSettingsDTO> =>
    apiRequest<StoreSettingsDTO>(buildApiUrl('/store-settings/me')),

  updateMyStoreSettings: (payload: UpdateStoreSettingsRequest): Promise<StoreSettingsDTO> =>
    apiRequest<StoreSettingsDTO>(buildApiUrl('/store-settings/me'), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  verifyMyDomain: (): Promise<StoreSettingsDTO> =>
    apiRequest<StoreSettingsDTO>(buildApiUrl('/store-settings/me/verify-domain'), {
      method: 'POST',
    }),

  /** Paiement simulé (tests) — aucune redirection CMI. */
  testPassPayment: (planCode?: string): Promise<BillingResultDTO> =>
    apiRequest<BillingResultDTO>(buildApiUrl('/billing/test-pass'), {
      method: 'POST',
      body: JSON.stringify({ planCode }),
    }),

  /** Démarre un paiement CMI réel pour un plan (abonnement). */
  startCmiCheckout: (planCode?: string): Promise<CmiCheckoutDTO> =>
    apiRequest<CmiCheckoutDTO>(buildApiUrl('/billing/cmi/checkout'), {
      method: 'POST',
      body: JSON.stringify({ planCode }),
    }),

  testStoreStripe: (
    payload?: PaymentCredentialsTestPayload,
  ): Promise<{ message: string; settings: StoreSettingsDTO }> =>
    apiRequest(buildApiUrl('/store-settings/me/payments/test-stripe'), {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
    }),

  testStorePaypal: (
    payload?: PaymentCredentialsTestPayload,
  ): Promise<{ message: string; settings: StoreSettingsDTO }> =>
    apiRequest(buildApiUrl('/store-settings/me/payments/test-paypal'), {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
    }),

  testStoreCmi: (
    payload?: PaymentCredentialsTestPayload,
  ): Promise<{ message: string; settings: StoreSettingsDTO }> =>
    apiRequest(buildApiUrl('/store-settings/me/payments/test-cmi'), {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
    }),

  getStorePaymentsConfig: (slug?: string): Promise<StorePaymentsConfigDTO> => {
    const qs = slug ? `?slug=${encodeURIComponent(slug)}` : '';
    return apiRequest<StorePaymentsConfigDTO>(buildApiUrl(`/store-payments/config${qs}`));
  },

  createStoreStripePaymentIntent: (payload: {
    amountCents: number;
    currency: string;
    description?: string;
  }): Promise<{ paymentIntentId: string; clientSecret: string }> =>
    apiRequest(buildApiUrl('/store-payments/stripe/payment-intent'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Débit carte (PaymentMethod Stripe Elements) — comme Grammar. */
  chargeStoreStripe: (payload: {
    paymentMethodId: string;
    amountCents: number;
    currency: string;
    description?: string;
  }): Promise<{ paymentIntentId: string; status: string }> =>
    apiRequest(buildApiUrl('/store-payments/stripe/charge'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createStorePaypalOrder: (payload: {
    amount: number;
    currency: string;
    description?: string;
  }): Promise<{ orderId: string; approveUrl?: string }> =>
    apiRequest(buildApiUrl('/store-payments/paypal/create-order'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  captureStorePaypalOrder: (orderId: string): Promise<{ status: string; orderId: string }> =>
    apiRequest(buildApiUrl(`/store-payments/paypal/capture/${encodeURIComponent(orderId)}`), {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  initStoreCmiCheckout: (payload: {
    amount: number;
    currency?: string;
    description?: string;
    okUrl?: string;
    failUrl?: string;
  }): Promise<CmiCheckoutDTO> =>
    apiRequest(buildApiUrl('/store-payments/cmi/init'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/** Auto-submit POST vers la gateway CMI (iframe via `target`, ou page courante). */
export function submitCmiCheckout(
  checkout: CmiCheckoutDTO,
  options?: { target?: string },
): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkout.gatewayUrl;
  form.acceptCharset = 'UTF-8';
  if (options?.target) {
    form.target = options.target;
  }
  Object.entries(checkout.fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  window.setTimeout(() => form.remove(), 1500);
}
