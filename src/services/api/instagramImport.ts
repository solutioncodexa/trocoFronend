import { apiRequest, buildApiUrl } from '@/config/api';

export interface InstagramDraft {
  id: number;
  sourceType: 'LINK' | 'UPLOAD' | 'API';
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

export interface InstagramOAuthStatus {
  configured: boolean;
  connected: boolean;
  username: string | null;
  expiresAt: string | null;
}

export interface InstagramAccountPost {
  id: string;
  caption: string | null;
  mediaType: string;
  imageUrl: string | null;
  permalink: string | null;
  timestamp: string | null;
  imported: boolean;
}

export interface InstagramAccountPage {
  items: InstagramAccountPost[];
  nextCursor: string | null;
}

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

  oauthStatus: () => apiRequest<InstagramOAuthStatus>(buildApiUrl('/instagram-import/oauth/status')),

  oauthAuthorizeUrl: (returnTo: string) =>
    apiRequest<{ url: string }>(buildApiUrl(`/instagram-import/oauth/authorize-url?returnTo=${encodeURIComponent(returnTo)}`)),

  oauthDisconnect: () => apiRequest<void>(buildApiUrl('/instagram-import/oauth'), { method: 'DELETE' }),

  accountPosts: (after?: string | null) =>
    apiRequest<InstagramAccountPage>(
      buildApiUrl(`/instagram-import/oauth/media${after ? `?after=${encodeURIComponent(after)}` : ''}`),
    ),

  importAccountPosts: (ids: string[]) =>
    apiRequest<InstagramImportItem[]>(buildApiUrl('/instagram-import/oauth/import'), json({ ids })),
};
