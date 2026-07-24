/**
 * Favicons à partir du logo :
 *   1. trim() automatique des marges transparentes (le logo "(2).png" a beaucoup de blanc/transparence autour)
 *   2. extension en carré centré (pour ne pas déformer le logo)
 *   3. resize à la taille cible
 * Après changement de logo : npm run generate-favicon
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src', 'assets', 'troco-logo.png');

/** Padding (en % de la taille finale) autour du logo après trim. 0 = collé aux bords. */
const PADDING_RATIO = 0;

async function toSquarePng(size, dest) {
  const trimmed = await sharp(src)
    .trim()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const w = meta.width ?? size;
  const h = meta.height ?? size;
  const side = Math.max(w, h);

  const inner = Math.max(1, Math.round(size * (1 - PADDING_RATIO * 2)));
  const offset = Math.round((size - inner) / 2);

  const resized = await sharp(trimmed)
    .resize(inner, inner, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(dest);

  void side; void offset;
}

await toSquarePng(16, path.join(root, 'public', 'favicon-16x16.png'));
await toSquarePng(32, path.join(root, 'public', 'favicon-32x32.png'));
await toSquarePng(48, path.join(root, 'public', 'favicon-48x48.png'));
await toSquarePng(64, path.join(root, 'public', 'favicon-64x64.png'));
await toSquarePng(180, path.join(root, 'public', 'apple-touch-icon.png'));
await toSquarePng(48, path.join(root, 'public', 'favicon.png'));

console.log('Favicons générés (trim auto + padding', PADDING_RATIO * 100, '%).');
