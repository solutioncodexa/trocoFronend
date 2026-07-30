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
    id === 'footer'
  );
}
