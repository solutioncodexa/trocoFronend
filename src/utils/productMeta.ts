import { PUBLIC_SITE_NAME, PUBLIC_SITE_URL } from '@/config/site';

export interface ProductMetaInput {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    if (attr === 'name') el.setAttribute('name', key);
    else el.setAttribute('property', key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyProductMeta({
  id,
  name,
  description,
  price,
  imageUrl,
}: ProductMetaInput): void {
  const pageUrl = `${PUBLIC_SITE_URL}/produit/${id}`;
  const title = `${name} | ${PUBLIC_SITE_NAME}`;
  const pricePart = price != null ? ` — ${price.toLocaleString('fr-FR')} DH` : '';
  const desc =
    (description?.trim() || `Découvrez ce produit d'emballage sur ${PUBLIC_SITE_NAME}.`) +
    pricePart;
  const ogImage = imageUrl || `${PUBLIC_SITE_URL}/favicon.png`;

  document.title = title;
  upsertMeta('name', 'description', desc);
  upsertCanonical(pageUrl);

  upsertMeta('property', 'og:type', 'product');
  upsertMeta('property', 'og:site_name', PUBLIC_SITE_NAME);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', desc);
  upsertMeta('property', 'og:url', pageUrl);
  upsertMeta('property', 'og:image', ogImage);
  upsertMeta('property', 'og:locale', 'fr_MA');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', desc);
  upsertMeta('name', 'twitter:image', ogImage);
}

const DEFAULT_TITLE = `${PUBLIC_SITE_NAME} | Emballage e-commerce`;
const DEFAULT_DESC =
  'Sachets, cartons, protections et décorations pour vos commandes e-commerce au Maroc.';

export function resetProductMeta(): void {
  document.title = DEFAULT_TITLE;
  upsertMeta('name', 'description', DEFAULT_DESC);
  upsertMeta('property', 'og:title', DEFAULT_TITLE);
  upsertMeta('property', 'og:description', DEFAULT_DESC);
  upsertMeta('property', 'og:url', PUBLIC_SITE_URL);
}
