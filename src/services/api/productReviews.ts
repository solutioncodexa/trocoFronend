import { buildApiUrl, apiRequest } from '@/config/api';
import type {
  CreateProductReviewRequest,
  ProductReviewDTO,
  ProductReviewSummaryDTO,
} from '@/types/api';

export const productReviewsApi = {
  getPublicSummary: (productId: number | string): Promise<ProductReviewSummaryDTO> =>
    apiRequest<ProductReviewSummaryDTO>(buildApiUrl(`/product-reviews/public/${productId}`)),

  submitPublic: (payload: CreateProductReviewRequest): Promise<ProductReviewDTO> =>
    apiRequest<ProductReviewDTO>(buildApiUrl('/product-reviews/public'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listAdmin: (): Promise<ProductReviewDTO[]> =>
    apiRequest<ProductReviewDTO[]>(buildApiUrl('/product-reviews')),

  setApproved: (id: number, approved: boolean): Promise<ProductReviewDTO> =>
    apiRequest<ProductReviewDTO>(buildApiUrl(`/product-reviews/${id}/approve`), {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    }),

  delete: (id: number): Promise<void> =>
    apiRequest<void>(buildApiUrl(`/product-reviews/${id}`), { method: 'DELETE' }),
};
