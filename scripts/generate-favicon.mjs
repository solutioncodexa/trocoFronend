/**
 * Favicons à partir du logo : zoom sur le centre (carré) puis redimensionnement,
 * pour que le marquage remplisse mieux les quelques pixels de l’onglet.
 * Après changement de logo : npm run generate-favicon
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src', 'assets', 'GOLD_YARA_LOGO (1).png');

/** Part de min(largeur,hauteur) conservée au centre ; plus petit = plus zoomé (logo plus gros dans le favicon). */
const CENTER_SQUARE_RATIO = 0.48;

async function toSquarePng(size, dest) {
  const meta = await sharp(src).metadata();
  const w = meta.width ?? 512;
  const h = meta.height ?? 512;
  const side = Math.max(2, Math.round(Math.min(w, h) * CENTER_SQUARE_RATIO));
  const left = Math.max(0, Math.round((w - side) / 2));
  const top = Math.max(0, Math.round((h - side) / 2));

  await sharp(src)
    .extract({ left, top, width: Math.min(side, w - left), height: Math.min(side, h - top) })
    .resize(size, size, { fit: 'fill' })
    .png()
    .toFile(dest);
}

await toSquarePng(16, path.join(root, 'public', 'favicon-16x16.png'));
await toSquarePng(32, path.join(root, 'public', 'favicon-32x32.png'));
await toSquarePng(48, path.join(root, 'public', 'favicon-48x48.png'));
await toSquarePng(64, path.join(root, 'public', 'favicon-64x64.png'));
await toSquarePng(180, path.join(root, 'public', 'apple-touch-icon.png'));
await toSquarePng(48, path.join(root, 'public', 'favicon.png'));

console.log('Favicons générés (zoom centre', CENTER_SQUARE_RATIO * 100, '% du carré minimal).');
