import { apiRequest, buildApiUrl } from '@/config/api';
import type { StoreBlogPost, UpsertBlogPostPayload } from '@/types/store-blog';

export const storeBlogApi = {
  listPublic: (lang = 'fr') =>
    apiRequest<StoreBlogPost[]>(buildApiUrl(`/store-blog/public?lang=${encodeURIComponent(lang)}`)),

  getPublicBySlug: (slug: string) =>
    apiRequest<StoreBlogPost>(buildApiUrl(`/store-blog/public/${encodeURIComponent(slug)}`)),

  list: () => apiRequest<StoreBlogPost[]>(buildApiUrl('/store-blog')),

  get: (id: number) => apiRequest<StoreBlogPost>(buildApiUrl(`/store-blog/${id}`)),

  create: (payload: UpsertBlogPostPayload) =>
    apiRequest<StoreBlogPost>(buildApiUrl('/store-blog'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpsertBlogPostPayload) =>
    apiRequest<StoreBlogPost>(buildApiUrl(`/store-blog/${id}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiRequest<void>(buildApiUrl(`/store-blog/${id}`), { method: 'DELETE' }),
};
