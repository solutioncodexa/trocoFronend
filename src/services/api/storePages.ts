import { apiRequest, buildApiUrl } from '@/config/api';
import type {
  StorePage,
  StorePageListItem,
  StorePageNavItem,
  UpsertStorePagePayload,
  StorePageBlock,
  StorePageVersion,
  StorePageAnalyticsSummary,
  StorePageExportPayload,
  StorePagePreviewLink,
} from '@/types/store-pages';

export const storePagesApi = {
  list: () => apiRequest<StorePageListItem[]>(buildApiUrl('/store-pages')),

  get: (id: number) => apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}`)),

  create: (payload: UpsertStorePagePayload) =>
    apiRequest<StorePage>(buildApiUrl('/store-pages'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpsertStorePagePayload) =>
    apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiRequest<void>(buildApiUrl(`/store-pages/${id}`), { method: 'DELETE' }),

  clone: (id: number) =>
    apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}/clone`), { method: 'POST' }),

  replaceBlocks: (id: number, blocks: StorePageBlock[], versionLabel?: string) =>
    apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}/blocks`), {
      method: 'PUT',
      body: JSON.stringify({
        versionLabel,
        blocks: blocks.map((b, i) => ({
          type: b.type,
          sortOrder: b.sortOrder ?? i,
          config: b.config ?? {},
          configAr: b.configAr ?? {},
          visibleMobile: b.visibleMobile !== false,
          visibleDesktop: b.visibleDesktop !== false,
        })),
      }),
    }),

  versions: (id: number) =>
    apiRequest<StorePageVersion[]>(buildApiUrl(`/store-pages/${id}/versions`)),

  restoreVersion: (id: number, versionId: number) =>
    apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}/versions/${versionId}/restore`), {
      method: 'POST',
    }),

  analytics: (days = 30) =>
    apiRequest<StorePageAnalyticsSummary[]>(
      buildApiUrl(`/store-pages/analytics?days=${days}`),
    ),

  publicNav: (lang = 'fr') =>
    apiRequest<StorePageNavItem[]>(buildApiUrl(`/store-pages/public/nav?lang=${lang}`)),

  /** Variantes A/B sans blocs — contenu via publicHome. */
  publicHomes: (lang = 'fr') =>
    apiRequest<Array<{ id: number; abVariant?: string | null; currentlyLive?: boolean }>>(
      buildApiUrl(`/store-pages/public/homes?lang=${encodeURIComponent(lang)}`),
    ),

  publicHome: (lang = 'fr', variant?: string | null) => {
    const qs = new URLSearchParams({ lang });
    if (variant) qs.set('variant', variant);
    return apiRequest<StorePage | null>(buildApiUrl(`/store-pages/public/home?${qs.toString()}`));
  },

  export: (id: number) =>
    apiRequest<StorePageExportPayload>(buildApiUrl(`/store-pages/${id}/export`)),

  import: (payload: StorePageExportPayload) =>
    apiRequest<StorePage>(buildApiUrl('/store-pages/import'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  publicBySlug: (slug: string, lang = 'fr') =>
    apiRequest<StorePage>(
      buildApiUrl(`/store-pages/public/by-slug/${encodeURIComponent(slug)}?lang=${lang}`),
    ),

  publicPreview: (token: string, lang = 'fr') =>
    apiRequest<StorePage>(
      buildApiUrl(
        `/store-pages/public/preview/${encodeURIComponent(token)}?lang=${encodeURIComponent(lang)}`,
      ),
    ),

  issuePreviewLink: (id: number) =>
    apiRequest<StorePagePreviewLink>(buildApiUrl(`/store-pages/${id}/preview-link`), {
      method: 'POST',
    }),

  rotatePreviewLink: (id: number) =>
    apiRequest<StorePagePreviewLink>(buildApiUrl(`/store-pages/${id}/preview-link/rotate`), {
      method: 'POST',
    }),

  promoteAb: (id: number) =>
    apiRequest<StorePage>(buildApiUrl(`/store-pages/${id}/promote-ab`), { method: 'POST' }),

  track: (payload: {
    pageId?: number;
    eventType: 'view' | 'cta_click';
    path?: string;
    meta?: Record<string, unknown>;
  }) =>
    apiRequest<void>(buildApiUrl('/store-pages/public/track'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }).catch(() => undefined),
};
