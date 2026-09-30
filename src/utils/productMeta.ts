import { PUBLIC_SITE_URL } from '@/config/site';
import { getActiveSiteName } from '@/lib/activeStoreBrand';

export interface ProductMetaInput {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  /** SEO personnalisé par le marchand (priment sur nom / description). */
  seoTitle?: string;
  seoDescription?: string;
}

/** Origine courante (boutique sur domaine custom / sous-domaine) ; repli sur l'URL publique configurée. */
function storefrontOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return PUBLIC_SITE_URL;
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
  seoTitle,
  seoDescription,
}: ProductMetaInput): void {
  const siteName = getActiveSiteName();
  // Canonical / og:url = domaine réel de la boutique (jamais celui de la plateforme).
  const origin = storefrontOrigin();
  const pageUrl = `${origin}/produit/${id}`;
  const title = seoTitle?.trim() || `${name} | ${siteName}`;
  const pricePart = price != null ? ` — ${price.toLocaleString('fr-FR')} DH` : '';
  const desc = seoDescription?.trim()
    ? seoDescription.trim()
    : (description?.trim() || `Découvrez ce produit sur ${siteName}.`) + pricePart;
  const ogImage = imageUrl || `${origin}/favicon.png`;

  document.title = title;
  upsertMeta('name', 'description', desc);
  upsertCanonical(pageUrl);

  upsertMeta('property', 'og:type', 'product');
  upsertMeta('property', 'og:site_name', siteName);
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

const DEFAULT_DESC =
  'Découvrez nos produits et passez commande en ligne.';

export function resetProductMeta(): void {
  const siteName = getActiveSiteName();
  const defaultTitle = `${siteName} | Boutique en ligne`;
  document.title = defaultTitle;
  upsertMeta('name', 'description', DEFAULT_DESC);
  upsertMeta('property', 'og:title', defaultTitle);
  upsertMeta('property', 'og:description', DEFAULT_DESC);
  upsertMeta('property', 'og:url', storefrontOrigin());
}
