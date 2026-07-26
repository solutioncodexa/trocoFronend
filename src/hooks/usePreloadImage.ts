import { useEffect } from 'react';

/** Injecte `<link rel="preload" as="image">` pour l’image LCP (hero). */
export function usePreloadImage(url: string | null | undefined, enabled = true) {
  useEffect(() => {
    if (!enabled || !url) return;
    const href = url.trim();
    if (!href || href.startsWith('data:')) return;

    const id = 'troco-lcp-preload';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'preload';
      link.as = 'image';
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
    link.href = href;

    return () => {
      // garder le preload tant que la page est montée ; retiré au démontage
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [url, enabled]);
}
