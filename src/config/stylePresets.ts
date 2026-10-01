import type { StoreThemeKey } from '@/config/storeThemes';
import type { FontPairKey, RadiusPresetKey } from '@/config/storefrontTheme';
import type { StoreAppearance } from '@/config/storeAppearance';
import { APPEARANCE_LOOK_PRESETS } from '@/config/appearancePresets';

/**
 * Styles complets (1 clic) : thème + couleurs + polices + arrondis + agencement (look).
 * Là où les « looks » de l'éditeur d'apparence ne règlent que l'agencement, un style règle
 * l'identité visuelle entière d'une boutique.
 */
export type StylePreset = {
  key: string;
  label: string;
  description: string;
  themeKey: StoreThemeKey;
  fontPair: FontPairKey;
  radiusPreset: RadiusPresetKey;
  primaryColor: string;
  secondaryColor: string;
  /** Clé d'un look de `APPEARANCE_LOOK_PRESETS` (agencement : grille, cartes, en-tête, checkout…). */
  lookKey: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    key: 'classique',
    label: 'Classique',
    description: 'Équilibré et rassurant, pour tous les catalogues.',
    themeKey: 'classic',
    fontPair: 'display_sans',
    radiusPreset: 'soft',
    primaryColor: '#0F766E',
    secondaryColor: '#0369A1',
    lookKey: 'boutique',
  },
  {
    key: 'editorial',
    label: 'Éditorial',
    description: 'Aéré et élégant : mode, décoration, belles photos.',
    themeKey: 'elegant',
    fontPair: 'editorial_serif',
    radiusPreset: 'subtle',
    primaryColor: '#171717',
    secondaryColor: '#A16207',
    lookKey: 'editorial',
  },
  {
    key: 'nordique',
    label: 'Minimal',
    description: 'Épuré et moderne, le produit avant tout.',
    themeKey: 'minimal',
    fontPair: 'jakarta',
    radiusPreset: 'subtle',
    primaryColor: '#334155',
    secondaryColor: '#0EA5E9',
    lookKey: 'editorial',
  },
  {
    key: 'artisan',
    label: 'Artisan',
    description: 'Chaleureux et authentique : terroir, artisanat.',
    themeKey: 'classic',
    fontPair: 'editorial_serif',
    radiusPreset: 'soft',
    primaryColor: '#9A3412',
    secondaryColor: '#A8A29E',
    lookKey: 'boutique',
  },
  {
    key: 'flash',
    label: 'Flash',
    description: 'Contrasté et dynamique : promos, high-tech.',
    themeKey: 'bold',
    fontPair: 'friendly',
    radiusPreset: 'sharp',
    primaryColor: '#E11D48',
    secondaryColor: '#F97316',
    lookKey: 'bold-sale',
  },
  {
    key: 'marche',
    label: 'Marché',
    description: 'Dense et efficace : beaucoup de produits, filtres latéraux.',
    themeKey: 'classic',
    fontPair: 'display_sans',
    radiusPreset: 'subtle',
    primaryColor: '#3F6212',
    secondaryColor: '#B45309',
    lookKey: 'dense',
  },
];

/** Style conseillé selon le secteur choisi (clés de `STARTER_PACKS`). */
export const STYLE_FOR_SECTOR: Record<string, string> = {
  mode: 'editorial',
  beaute: 'nordique',
  alimentation: 'artisan',
  maison: 'artisan',
  electronique: 'flash',
  general: 'classique',
};

export function getStylePreset(key?: string | null): StylePreset | undefined {
  return STYLE_PRESETS.find((p) => p.key === key);
}

/** Réglages d'agencement (apparence partielle) du look associé au style. */
export function styleAppearanceOverride(preset: StylePreset): Partial<StoreAppearance> {
  return APPEARANCE_LOOK_PRESETS.find((l) => l.key === preset.lookKey)?.appearance ?? {};
}

/** Retrouve le style complet actuellement appliqué (thème + police + arrondi + couleur). */
export function matchStylePreset(input: {
  themeKey?: string | null;
  fontPair?: string | null;
  radiusPreset?: string | null;
  primaryColor?: string | null;
}): StylePreset | undefined {
  const primary = (input.primaryColor || '').trim().toUpperCase();
  return STYLE_PRESETS.find(
    (s) =>
      s.themeKey === input.themeKey &&
      s.fontPair === input.fontPair &&
      s.radiusPreset === input.radiusPreset &&
      s.primaryColor.toUpperCase() === primary,
  );
}
