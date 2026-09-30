import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Rend `children` dans un vrai iframe de largeur `width`.
 *
 * Pourquoi : les classes Tailwind responsives (`sm:`, `md:`, `lg:`) suivent la largeur de la
 * *fenêtre*, pas celle d'un conteneur. Dans un simple <div> de 390 px, l'aperçu « mobile »
 * affichait donc la mise en page bureau. Dans un iframe, la fenêtre fait réellement `width` :
 * les media queries s'appliquent comme chez le visiteur.
 *
 * Les enfants restent dans l'arbre React de l'application (contexte, react-query, router, événements
 * et glisser-déposer fonctionnent) ; seuls les styles sont copiés dans le document de l'iframe.
 */

const FRAME_DOC =
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>';

/** Attributs du <html>/<body> parent répliqués dans l'iframe (thème, classes, variables CSS inline). */
const SYNCED_ATTRS = ['class', 'style', 'lang', 'data-theme'];

function syncAttributes(from: Element, to: Element) {
  for (const name of [...SYNCED_ATTRS, ...from.getAttributeNames().filter((n) => n.startsWith('data-'))]) {
    const value = from.getAttribute(name);
    if (value == null) to.removeAttribute(name);
    else to.setAttribute(name, value);
  }
}

/** Copie les feuilles de style de l'application (link + style) dans l'iframe. */
function syncStyles(target: Document, cloned: Node[]): Node[] {
  cloned.forEach((n) => n.parentNode?.removeChild(n));
  const next: Node[] = [];
  document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const copy = target.importNode(node, true);
    target.head.appendChild(copy);
    next.push(copy);
  });
  return next;
}

export default function DeviceFrame({
  width,
  children,
  title = 'Aperçu de la page',
  minHeight = 480,
  onHeightChange,
  dir = 'ltr',
}: {
  width: number;
  children: ReactNode;
  title?: string;
  minHeight?: number;
  /** Hauteur du contenu (px, non zoomée) — pour réserver la bonne place quand l'aperçu est réduit. */
  onHeightChange?: (height: number) => void;
  /** Direction du contenu (RTL pour l'édition en arabe). */
  dir?: 'ltr' | 'rtl';
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(minHeight);
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const onHeightChangeRef = useRef(onHeightChange);
  onHeightChangeRef.current = onHeightChange;

  useEffect(() => {
    onHeightChangeRef.current?.(height);
  }, [height]);

  const init = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc || !doc.body) return;
    cleanupRef.current?.();

    let clonedStyles: Node[] = syncStyles(doc, []);
    syncAttributes(document.documentElement, doc.documentElement);
    syncAttributes(document.body, doc.body);
    doc.documentElement.dir = dirRef.current;

    const reset = doc.createElement('style');
    reset.textContent = 'html,body{margin:0;padding:0;overflow:hidden;background:transparent}';
    doc.head.appendChild(reset);

    const root = doc.createElement('div');
    root.id = 'device-frame-root';
    doc.body.appendChild(root);

    // L'aperçu ne doit jamais naviguer (liens de la boutique) : on neutralise les ancres.
    const blockLinks = (e: Event) => {
      const anchor = (e.target as Element | null)?.closest?.('a');
      if (anchor) e.preventDefault();
    };
    doc.addEventListener('click', blockLinks, true);

    // Hauteur = contenu (le parent défile, pas l'iframe).
    const measure = () => setHeight(Math.max(minHeight, Math.ceil(root.getBoundingClientRect().height)));
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    measure();

    // Styles / thème injectés après coup (HMR, thème boutique appliqué en JS) : on resynchronise.
    let raf = 0;
    const resync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        clonedStyles = syncStyles(doc, clonedStyles);
        doc.head.appendChild(reset); // garde le reset en dernier
        syncAttributes(document.documentElement, doc.documentElement);
        syncAttributes(document.body, doc.body);
      });
    };
    const styleObserver = new MutationObserver(resync);
    styleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
    const attrObserver = new MutationObserver(resync);
    attrObserver.observe(document.documentElement, { attributes: true });
    attrObserver.observe(document.body, { attributes: true });

    cleanupRef.current = () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      styleObserver.disconnect();
      attrObserver.disconnect();
      doc.removeEventListener('click', blockLinks, true);
    };
    setMountNode(root);
  }, [minHeight]);

  useEffect(() => () => cleanupRef.current?.(), []);

  useEffect(() => {
    if (mountNode) mountNode.ownerDocument.documentElement.dir = dir;
  }, [dir, mountNode]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={FRAME_DOC}
        onLoad={init}
        // Même origine (srcdoc) : nécessaire pour y rendre les composants React.
        style={{ width, height, border: 0, display: 'block', background: 'transparent' }}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}
