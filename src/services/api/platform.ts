import { buildApiUrl, apiRequest } from '@/config/api';
import type {
  BillingResultDTO,
  CmiCheckoutDTO,
  CreateFournisseurRequest,
  FournisseurDTO,
  PlanDTO,
  StoreSettingsDTO,
  StoreThemeDTO,
  UpdateStoreSettingsRequest,
} from '@/types/api';

export const platformApi = {
  getPlans: (): Promise<PlanDTO[]> =>
    apiRequest<PlanDTO[]>(buildApiUrl('/platform/plans')),

  getThemes: (): Promise<StoreThemeDTO[]> =>
    apiRequest<StoreThemeDTO[]>(buildApiUrl('/platform/themes')),

  getStore: (slug?: string): Promise<StoreSettingsDTO> => {
    const qs = slug ? `?slug=${encodeURIComponent(slug)}` : '';
    return apiRequest<StoreSettingsDTO>(buildApiUrl(`/platform/store${qs}`));
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
};

/** Auto-submit POST vers la gateway CMI. */
export function submitCmiCheckout(checkout: CmiCheckoutDTO): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkout.gatewayUrl;
  form.acceptCharset = 'UTF-8';
  Object.entries(checkout.fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}
