import { buildApiUrl, TENANT_SLUG_STORAGE_KEY } from '@/config/api';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import { compressImageWithReport, type CompressImageOptions } from '@/utils/compressImage';
import { notifyCompressionReports } from '@/utils/notifyCompression';

function authAndTenantHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('troco_admin_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const slug = localStorage.getItem(TENANT_SLUG_STORAGE_KEY);
    if (slug) headers['X-Fournisseur-Slug'] = slug;
  } catch {
    /* ignore */
  }
  return headers;
}

/**
 * Options communes aux fonctions d'upload :
 *   - `compress`  : `true` (défaut) → l'image est compressée côté navigateur avant l'envoi.
 *   - `compressOptions` : surcharger les paramètres de compression (taille, dimensions…).
 */
export interface UploadOptions {
  compress?: boolean;
  compressOptions?: CompressImageOptions;
}

/**
 * Envoie un fichier image au serveur et retourne l'URL publique.
 * L'URL retournée est relative (ex: /uploads/xxx.jpg). Pour l'affichage, utilise getImageUrl().
 *
 * Par défaut, l'image est compressée côté client (WebP, max 3000px, ~2.5MB) afin
 * de réduire la bande passante tout en gardant une bonne qualité visuelle.
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {},
): Promise<string> {
  const { compress = true, compressOptions } = options;
  let finalFile = file;
  if (compress) {
    const { file: compressed, report } = await compressImageWithReport(file, compressOptions);
    finalFile = compressed;
    notifyCompressionReports([report]);
  }

  const formData = new FormData();
  formData.append('file', finalFile);

  const response = await fetch(buildApiUrl('/upload'), {
    method: 'POST',
    headers: authAndTenantHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${response.status}`);
  }

  const data = await response.json();
  const url = data?.data?.url ?? data?.url;
  if (!url) throw new Error('Réponse upload invalide');
  return url;
}

/**
 * Envoie plusieurs fichiers et retourne la liste des URLs.
 * Compresse chaque image en parallèle avant l'upload.
 */
export async function uploadImages(
  files: File[],
  options: UploadOptions = {},
): Promise<string[]> {
  const { compress = true, compressOptions } = options;
  let finalFiles = files;
  if (compress) {
    const results = await Promise.all(
      files.map((f) => compressImageWithReport(f, compressOptions)),
    );
    finalFiles = results.map((r) => r.file);
    notifyCompressionReports(results.map((r) => r.report));
  }

  const formData = new FormData();
  finalFiles.forEach((f) => formData.append('files', f));

  const response = await fetch(buildApiUrl('/upload-multiple'), {
    method: 'POST',
    headers: authAndTenantHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${response.status}`);
  }

  const data = await response.json();
  const urls = data?.data ?? data?.urls ?? [];
  return Array.isArray(urls) ? urls : [];
}

export { resolvePublicImageUrl };

export function getImageUrl(url: string | undefined | null): string {
  return resolvePublicImageUrl(url);
}
