/**
 * Couleurs de la boutique tirées du logo, calculées dans le navigateur : l'image ne quitte pas l'appareil.
 */
export type Palette = { primary: string; secondary: string };

type Hsl = { h: number; s: number; l: number };

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

function toHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h * 60, s, l };
}

function fromHsl({ h, s, l }: Hsl): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Luminance relative (WCAG) d'une couleur sRGB. */
function luminance(r: number, g: number, b: number) {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Contraste avec du texte blanc (les boutons de la boutique ont un texte blanc). */
const contrastWithWhite = (r: number, g: number, b: number) => 1.05 / (luminance(r, g, b) + 0.05);

/** Assombrit une couleur jusqu'à un contraste d'au moins 3 avec du blanc, pour que le texte des boutons reste lisible. */
function readable(c: Hsl): Hsl {
  let cur = { ...c };
  for (let i = 0; i < 20; i += 1) {
    const [r, g, b] = fromHsl(cur);
    if (contrastWithWhite(r, g, b) >= 3) break;
    cur = { ...cur, l: cur.l - 0.03 };
  }
  return cur;
}

const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * Choisit une couleur principale et une secondaire dans des pixels RGBA. Ignore le transparent, le blanc, le noir et
 * les gris (fonds et contours). Renvoie `null` pour un logo sans couleur marquée (noir et blanc, gris).
 */
export function pickPalette(data: ArrayLike<number>): Palette | null {
  const buckets = new Map<number, { w: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 3 < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (data[i + 3] < 128) continue;
    const { s, l } = toHsl(r, g, b);
    if (l > 0.92 || l < 0.1 || s < 0.25) continue;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const w = 0.5 + s; // les couleurs vives pèsent plus que les ternes
    const cur = buckets.get(key) ?? { w: 0, r: 0, g: 0, b: 0 };
    cur.w += w;
    cur.r += r * w;
    cur.g += g * w;
    cur.b += b * w;
    buckets.set(key, cur);
  }
  const ranked = [...buckets.values()]
    .filter((b) => b.w > 0)
    .sort((a, b) => b.w - a.w)
    .map((b) => toHsl(b.r / b.w, b.g / b.w, b.b / b.w));
  if (ranked.length === 0) return null;

  const primary = readable(ranked[0]);
  const second = ranked.find((c) => hueGap(c.h, primary.h) >= 40);
  const secondary = second
    ? readable(second)
    : { h: primary.h, s: Math.min(1, primary.s), l: Math.max(0.12, primary.l * 0.6) };

  return {
    primary: toHex(...fromHsl(primary)),
    secondary: toHex(...fromHsl(secondary)),
  };
}

/** Palette d'une image déjà chargée, réduite à 64 px. `null` si le navigateur refuse la lecture des pixels. */
export function paletteFromImage(img: CanvasImageSource & { width: number; height: number }): Palette | null {
  try {
    const scale = 64 / Math.max(img.width, img.height, 1);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    return pickPalette(ctx.getImageData(0, 0, w, h).data);
  } catch {
    return null;
  }
}

function loadImage(src: string, crossOrigin: boolean): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Palette d'un fichier image choisi par le commerçant. */
export async function paletteFromFile(file: File): Promise<Palette | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url, false);
    return img ? paletteFromImage(img) : null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Palette d'une image déjà en ligne : échoue en silence si le serveur d'images n'autorise pas la lecture. */
export async function paletteFromUrl(url: string): Promise<Palette | null> {
  const img = await loadImage(url, true);
  return img ? paletteFromImage(img) : null;
}
