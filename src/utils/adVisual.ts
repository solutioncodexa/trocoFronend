/** Visuels publicitaires dessinés dans le navigateur (canvas) : aucun envoi d'image, aucun crédit IA. */

export type AdFormat = 'square' | 'story' | 'facebook' | 'a4';

export const AD_FORMATS: Record<AdFormat, { label: string; width: number; height: number }> = {
  square: { label: 'Carré 1080×1080 (post)', width: 1080, height: 1080 },
  story: { label: 'Story 1080×1920', width: 1080, height: 1920 },
  facebook: { label: 'Bannière Facebook Ads 1200×628', width: 1200, height: 628 },
  a4: { label: 'Affiche A4 imprimable', width: 1654, height: 2339 },
};

export type AdVisualInput = {
  format: AdFormat;
  storeName: string;
  headline: string;
  priceLabel: string;
  whatsapp: string;
  primaryColor: string;
  logoUrl?: string | null;
  productImageUrl?: string | null;
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const FALLBACK_COLOR = '#1e3a5f';

/** Noir ou blanc selon la luminance du fond, pour garder le texte lisible. */
export function readableOn(hex: string): string {
  const h = HEX.test(hex) ? hex : FALLBACK_COLOR;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#111827' : '#ffffff';
}

function loadImage(url?: string | null): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[.,;:!?…\s]+$/, '')}…`;
    return kept;
  }
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

/** Dessine le visuel et renvoie le canvas (le téléchargement se fait via {@link canvasToBlob}). */
export async function renderAdVisual(input: AdVisualInput): Promise<HTMLCanvasElement> {
  const { width: W, height: H } = AD_FORMATS[input.format];
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponible');

  const bg = HEX.test(input.primaryColor) ? input.primaryColor : FALLBACK_COLOR;
  const fg = readableOn(bg);
  const [logo, photo] = await Promise.all([loadImage(input.logoUrl), loadImage(input.productImageUrl)]);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const unit = Math.min(W, H);
  const pad = Math.round(unit * 0.06);
  const landscape = W > H * 1.2;
  const font = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

  // Zone photo : à droite en paysage, en haut sinon.
  const photoBox = landscape
    ? { x: Math.round(W * 0.52), y: pad, w: Math.round(W * 0.48) - pad, h: H - pad * 2 }
    : {
        x: pad,
        y: Math.round(H * 0.14),
        w: W - pad * 2,
        h: Math.round(H * (input.format === 'story' ? 0.42 : 0.46)),
      };
  if (photo) {
    drawCover(ctx, photo, photoBox.x, photoBox.y, photoBox.w, photoBox.h, Math.round(unit * 0.03));
  } else {
    ctx.fillStyle = fg === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    roundRect(ctx, photoBox.x, photoBox.y, photoBox.w, photoBox.h, Math.round(unit * 0.03));
    ctx.fill();
  }

  // En-tête : logo ou nom de la boutique.
  const headH = Math.round(unit * 0.07);
  if (logo) {
    const lw = (logo.width / logo.height) * headH;
    ctx.drawImage(logo, pad, pad, Math.min(lw, W * 0.4), headH);
  } else {
    ctx.fillStyle = fg;
    ctx.font = `700 ${Math.round(headH * 0.6)}px ${font}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(input.storeName, pad, pad + headH / 2);
  }

  // Bloc texte.
  const textX = pad;
  const textW = landscape ? Math.round(W * 0.5) - pad * 2 : W - pad * 2;
  const textTop = landscape ? Math.round(H * 0.3) : photoBox.y + photoBox.h + Math.round(unit * 0.05);
  const headSize = Math.round(unit * (landscape ? 0.075 : 0.07));
  ctx.fillStyle = fg;
  ctx.textBaseline = 'top';
  ctx.font = `800 ${headSize}px ${font}`;
  const lines = wrap(ctx, input.headline, textW, 3);
  lines.forEach((l, i) => ctx.fillText(l, textX, textTop + i * headSize * 1.15));
  let y = textTop + lines.length * headSize * 1.15 + Math.round(unit * 0.03);

  // Prix.
  if (input.priceLabel) {
    const pSize = Math.round(unit * 0.058);
    ctx.font = `800 ${pSize}px ${font}`;
    const pw = ctx.measureText(input.priceLabel).width + pSize * 1.2;
    ctx.fillStyle = fg;
    roundRect(ctx, textX, y, pw, pSize * 1.6, pSize * 0.8);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.fillText(input.priceLabel, textX + pSize * 0.6, y + pSize * 0.3);
    y += pSize * 1.6 + Math.round(unit * 0.03);
  }

  // WhatsApp.
  if (input.whatsapp) {
    const wSize = Math.round(unit * 0.036);
    ctx.fillStyle = fg;
    ctx.font = `600 ${wSize}px ${font}`;
    ctx.fillText(`WhatsApp : ${input.whatsapp}`, textX, Math.min(y, H - pad - wSize));
  }

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export impossible'))), type, 0.92);
    } catch (e) {
      reject(e);
    }
  });
}
