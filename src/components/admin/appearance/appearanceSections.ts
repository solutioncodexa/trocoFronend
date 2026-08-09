import type { AppearancePreviewSection } from '@/components/admin/StoreAppearanceLivePreview';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';

/** Sections éditables dans l’atelier Apparence (outline + panneau droit). */
export type AppearanceSectionId =
  | 'themes'
  | 'identity'
  | AppearancePreviewSection
  | 'home';

export const APPEARANCE_OUTLINE: {
  id: AppearanceSectionId;
  labelKey: AdminMessageKey;
}[] = [
  { id: 'themes', labelKey: 'appearance.sec.themes' },
  { id: 'identity', labelKey: 'appearance.sec.identity' },
  { id: 'typography', labelKey: 'appearance.sec.typography' },
  { id: 'buttons', labelKey: 'appearance.sec.buttons' },
  { id: 'cards', labelKey: 'appearance.sec.cards' },
  { id: 'hero', labelKey: 'appearance.sec.hero' },
  { id: 'backgrounds', labelKey: 'appearance.sec.backgrounds' },
  { id: 'header', labelKey: 'appearance.sec.header' },
  { id: 'footer', labelKey: 'appearance.sec.footer' },
  { id: 'home', labelKey: 'appearance.sec.home' },
  { id: 'shop', labelKey: 'appearance.sec.shop' },
  { id: 'product', labelKey: 'appearance.sec.product' },
  { id: 'wishlist', labelKey: 'appearance.sec.wishlist' },
  { id: 'cart', labelKey: 'appearance.sec.cart' },
  { id: 'checkout', labelKey: 'appearance.sec.checkout' },
  { id: 'forms', labelKey: 'appearance.sec.forms' },
  { id: 'notFound', labelKey: 'appearance.sec.notFound' },
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
