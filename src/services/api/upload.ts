import { buildApiUrl } from '@/config/api';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

/**
 * Envoie un fichier image au serveur et retourne l'URL publique.
 * L'URL retournée est relative (ex: /uploads/xxx.jpg). Pour l'affichage, utilise getImageUrl().
 */
export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('goldyara_admin_token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(buildApiUrl('/upload'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const token = localStorage.getItem('goldyara_admin_token');
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));

  const response = await fetch(buildApiUrl('/upload-multiple'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
