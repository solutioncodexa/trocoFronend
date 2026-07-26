import { useEffect } from 'react';
import type { StorePage } from '@/types/store-pages';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Applique title / description / OG pour une page custom. */
export function PageSeo({ page }: { page: StorePage }) {
  useEffect(() => {
    const title = page.seoTitle?.trim() || page.title;
    const desc = page.seoDescription?.trim() || '';
    const og = page.ogImageUrl ? resolvePublicImageUrl(page.ogImageUrl) : '';

    const prevTitle = document.title;
    document.title = title;
    if (desc) {
      upsertMeta('name', 'description', desc);
      upsertMeta('property', 'og:description', desc);
    }
    upsertMeta('property', 'og:title', title);
    if (og) upsertMeta('property', 'og:image', og);

    return () => {
      document.title = prevTitle;
    };
  }, [page.seoTitle, page.seoDescription, page.ogImageUrl, page.title]);

  return null;
}
