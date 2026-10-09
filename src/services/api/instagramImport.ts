import { apiRequest, buildApiUrl } from '@/config/api';

export interface InstagramDraft {
  id: number;
  sourceType: 'LINK' | 'UPLOAD';
  sourceUrl: string | null;
  caption: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  stock: number;
  categorySlug: string | null;
  images: string[];
  status: 'PENDING' | 'PUBLISHED' | 'DISCARDED';
  /** Ce qui bloque la publication. */
  issues: Array<'name' | 'price' | 'category' | 'image'>;
  aiExtracted: boolean;
  productId: number | null;
}

export interface InstagramImportItem {
  source: string;
  result: 'CREATED' | 'DUPLICATE' | 'INVALID';
  message: string | null;
  draft: InstagramDraft | null;
}

export interface InstagramPublishItem {
  id: number;
  published: boolean;
  message: string | null;
  productId: number | null;
}

export type InstagramDraftUpdate = Partial<Pick<InstagramDraft, 'name' | 'description' | 'price' | 'stock' | 'categorySlug' | 'images'>>;

const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });

export const instagramImportApi = {
  importLinks: (urls: string[]) =>
    apiRequest<InstagramImportItem[]>(buildApiUrl('/instagram-import/links'), json({ urls })),

  importUpload: (files: File[], caption: string) => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    form.append('caption', caption);
    return apiRequest<InstagramImportItem>(buildApiUrl('/instagram-import/upload'), { method: 'POST', body: form });
  },

  drafts: () => apiRequest<InstagramDraft[]>(buildApiUrl('/instagram-import/drafts')),

  update: (id: number, patch: InstagramDraftUpdate) =>
    apiRequest<InstagramDraft>(buildApiUrl(`/instagram-import/drafts/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  discard: (id: number) =>
    apiRequest<void>(buildApiUrl(`/instagram-import/drafts/${id}`), { method: 'DELETE' }),

  publish: (ids: number[], defaultCategorySlug?: string) =>
    apiRequest<InstagramPublishItem[]>(buildApiUrl('/instagram-import/publish'), json({ ids, defaultCategorySlug })),
};
