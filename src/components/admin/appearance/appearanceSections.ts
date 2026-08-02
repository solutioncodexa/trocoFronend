import type { AppearancePreviewSection } from '@/components/admin/StoreAppearanceLivePreview';

/** Sections éditables dans l’atelier Apparence (outline + panneau droit). */
export type AppearanceSectionId =
  | 'themes'
  | 'identity'
  | AppearancePreviewSection
  | 'home';

export const APPEARANCE_OUTLINE: {
  id: AppearanceSectionId;
  label: string;
}[] = [
  { id: 'themes', label: 'Thèmes' },
  { id: 'identity', label: 'Identité & couleurs' },
  { id: 'typography', label: 'Typographie' },
  { id: 'buttons', label: 'Boutons' },
  { id: 'cards', label: 'Cards produit' },
  { id: 'hero', label: 'Hero' },
  { id: 'backgrounds', label: 'Fonds' },
  { id: 'header', label: 'Header' },
  { id: 'footer', label: 'Footer' },
  { id: 'home', label: 'Sections accueil' },
  { id: 'shop', label: 'Boutique' },
  { id: 'product', label: 'Fiche produit' },
  { id: 'wishlist', label: 'Favoris' },
  { id: 'cart', label: 'Panier' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'forms', label: 'Formulaires' },
  { id: 'notFound', label: 'Page 404' },
];

export function isPreviewHotspotSection(
  id: AppearanceSectionId,
): id is AppearancePreviewSection {
  return (
    id === 'typography' ||
    id === 'buttons' ||
    id === 'cards' ||
    id === 'hero' ||
    id === 'backgrounds' ||
    id === 'header' ||
    id === 'footer' ||
    id === 'cart' ||
    id === 'checkout' ||
    id === 'shop' ||
    id === 'product' ||
    id === 'wishlist' ||
    id === 'forms' ||
    id === 'notFound'
  );
}

/**
 * Page d’aperçu à afficher pour qu’une section soit visible.
 * `null` = visible sur toutes les pages (pas de redirection).
 */
export function previewPageForSection(id: AppearanceSectionId): string | null {
  switch (id) {
    case 'header':
    case 'footer':
      return null;
    case 'cart':
      return 'cart';
    case 'checkout':
      return 'checkout';
    case 'shop':
    case 'cards':
      return 'shop';
    case 'product':
      return 'product';
    case 'wishlist':
      return 'wishlist';
    case 'forms':
      return 'contact';
    case 'notFound':
      return 'notFound';
    case 'themes':
    case 'identity':
    case 'typography':
    case 'buttons':
    case 'hero':
    case 'backgrounds':
    case 'home':
    default:
      return 'home';
  }
}

/** Hotspot à scroller dans l’aperçu (null = pas de hotspot dédié). */
export function previewHotspotForSection(
  id: AppearanceSectionId,
): AppearancePreviewSection | null {
  if (isPreviewHotspotSection(id)) return id;
  if (id === 'themes' || id === 'identity' || id === 'home') return 'hero';
  return null;
}
