import { type RefObject, useEffect } from 'react';

/** Élément autorisé à être enregistré (ex. logo cliquable vers l'accueil). */
const ALLOW_DOWNLOAD_SELECTOR = '[data-allow-image-download]';

function hasVisibleBackgroundImage(el: HTMLElement): boolean {
  const bg = getComputedStyle(el).backgroundImage;
  return Boolean(bg && bg !== 'none');
}

function isProtectedMedia(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest(ALLOW_DOWNLOAD_SELECTOR)) return false;

  if (target.tagName === 'IMG') return true;

  let node: HTMLElement | null = target;
  while (node) {
    if (node.hasAttribute('data-protected-image') || node.classList.contains('protect-bg-image')) {
      return true;
    }
    if (node.classList.contains('bg-cover') && hasVisibleBackgroundImage(node)) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

/**
 * Décourage l'enregistrement des photos sur le site public (clic droit, glisser, appui long).
 * Ce n'est pas une protection absolue (réseau / outils dev), mais bloque les usages courants.
 */
export function useProtectSiteImages(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onContextMenu = (e: MouseEvent) => {
      if (isProtectedMedia(e.target)) e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      if (isProtectedMedia(e.target)) e.preventDefault();
    };

    root.addEventListener('contextmenu', onContextMenu);
    root.addEventListener('dragstart', onDragStart);
    return () => {
      root.removeEventListener('contextmenu', onContextMenu);
      root.removeEventListener('dragstart', onDragStart);
    };
  }, [containerRef]);
}
