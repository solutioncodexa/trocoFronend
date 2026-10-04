import { useEffect } from 'react';

const MANIFEST_ATTR = 'data-admin-manifest';

/**
 * Rend l'administration installable (écran d'accueil du téléphone). Le manifeste et le service worker ne sont
 * déclarés que dans l'admin : la vitrine des clients n'est pas concernée.
 */
export function useAdminPwa() {
  useEffect(() => {
    if (document.querySelector(`link[${MANIFEST_ATTR}]`)) return;
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/admin.webmanifest';
    link.setAttribute(MANIFEST_ATTR, '');
    document.head.appendChild(link);

    if ('serviceWorker' in navigator && window.isSecureContext) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {
        /* non bloquant : l'admin fonctionne sans */
      });
    }
    return () => link.remove();
  }, []);
}
