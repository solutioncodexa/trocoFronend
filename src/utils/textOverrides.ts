/**
 * Remplacement de textes de la vitrine : le marchand choisit n'importe quel texte affiché
 * (titre, bouton, libellé…) et le remplace par le sien. La table est `{ texte d'origine → nouveau texte }`.
 *
 * Le remplacement se fait sur les nœuds texte du DOM (et suit les mises à jour de React via un
 * MutationObserver) : il fonctionne donc aussi bien pour les textes traduits que pour les textes codés en dur.
 */

export type TextOverrides = Record<string, string>;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE', 'SVG', 'TITLE']);

/** Nœud d'origine → texte d'origine (avec ses espaces), pour pouvoir rétablir ou réévaluer. */
const originals = new WeakMap<Text, string>();

export function hasLetters(text: string): boolean {
  return /\p{L}/u.test(text);
}

export function isEditableTextNode(node: Node | null): node is Text {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.nodeValue ?? '';
  if (!text.trim() || !hasLetters(text)) return false;
  for (let el: HTMLElement | null = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName.toUpperCase())) return false;
    if (el.isContentEditable || el.hasAttribute('data-no-text-edit')) return false;
  }
  return true;
}

/** Texte d'origine d'un nœud (avant remplacement éventuel). */
export function originalTextOf(node: Text): string {
  return originals.get(node) ?? node.nodeValue ?? '';
}

function withOriginalSpacing(original: string, replacement: string): string {
  const lead = original.match(/^\s*/)?.[0] ?? '';
  const trail = original.match(/\s*$/)?.[0] ?? '';
  return lead + replacement + trail;
}

/**
 * Réévalue un nœud : `lastApplied` est la dernière valeur que NOUS avons écrite. Si le nœud a une autre valeur,
 * c'est React qui l'a réécrit (le texte lu est alors le nouvel original).
 */
function reconcileNode(node: Text, overrides: TextOverrides, lastApplied: WeakMap<Text, string>) {
  const current = node.nodeValue ?? '';
  const stored = originals.get(node);
  const ours = stored !== undefined && current === lastApplied.get(node);
  const base = ours ? (stored as string) : current;
  if (!ours) originals.delete(node);

  const replacement = isEditableTextNode(node) ? overrides[base.trim()] : undefined;
  if (replacement) {
    const next = withOriginalSpacing(base, replacement);
    originals.set(node, base);
    if (current !== next) node.nodeValue = next;
  } else if (ours) {
    node.nodeValue = base;
    originals.delete(node);
  }
  lastApplied.set(node, node.nodeValue ?? '');
}

function walk(root: Node, visit: (n: Text) => void) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = walker.nextNode();
  while (n) {
    visit(n as Text);
    n = walker.nextNode();
  }
}

/**
 * Applique les remplacements sur tout le document et les maintient. Retourne la fonction d'arrêt
 * (qui rétablit les textes d'origine).
 */
export function startTextOverrides(overrides: TextOverrides, root: HTMLElement = document.body): () => void {
  const lastApplied = new WeakMap<Text, string>();
  const active = Object.keys(overrides).length > 0;

  const run = (target: Node) => {
    if (target.nodeType === Node.TEXT_NODE) reconcileNode(target as Text, overrides, lastApplied);
    else walk(target, (n) => reconcileNode(n, overrides, lastApplied));
  };

  if (active) run(root);

  let frame = 0;
  const pending = new Set<Node>();
  const flush = () => {
    frame = 0;
    pending.forEach((n) => {
      if (n.isConnected) run(n);
    });
    pending.clear();
  };

  const observer = new MutationObserver((records) => {
    if (!active) return;
    for (const r of records) {
      if (r.type === 'characterData') pending.add(r.target);
      else r.addedNodes.forEach((n) => pending.add(n));
    }
    if (!frame) frame = window.requestAnimationFrame(flush);
  });
  observer.observe(root, { childList: true, characterData: true, subtree: true });

  return () => {
    observer.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    walk(root, (n) => {
      const original = originals.get(n);
      if (original !== undefined && n.nodeValue === lastApplied.get(n)) n.nodeValue = original;
      originals.delete(n);
    });
  };
}

/** Nettoie une table reçue du serveur ou d'un formulaire. */
export function sanitizeTextOverrides(raw: unknown): TextOverrides {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: TextOverrides = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = k.trim();
    if (!key || key.length > 300 || typeof v !== 'string') continue;
    const value = v.trim();
    if (!value || value.length > 600) continue;
    out[key] = value;
    if (Object.keys(out).length >= 300) break;
  }
  return out;
}

/** Le texte survolé / cliqué : le nœud texte sous le pointeur, sinon le premier texte direct de l'élément. */
export function textNodeAtPoint(x: number, y: number, fallback: Element | null): Text | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  const node = doc.caretPositionFromPoint?.(x, y)?.offsetNode ?? doc.caretRangeFromPoint?.(x, y)?.startContainer ?? null;
  if (isEditableTextNode(node)) return node;
  if (fallback) {
    for (const child of Array.from(fallback.childNodes)) {
      if (isEditableTextNode(child)) return child;
    }
  }
  return null;
}
