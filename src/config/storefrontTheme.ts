import type { StoreThemeKey } from '@/config/storeThemes';
import { cn } from '@/lib/utils';

export type FontPairKey =
  | 'display_sans'
  | 'editorial_serif'
  | 'modern_mono'
  | 'friendly'
  | 'jakarta';
export type RadiusPresetKey = 'sharp' | 'subtle' | 'soft' | 'round' | 'pill';

export const FONT_PAIRS: {
  key: FontPairKey;
  label: string;
  description: string;
  display: string;
  body: string;
}[] = [
  {
    key: 'display_sans',
    label: 'Display + Sans',
    description: 'Titres expressifs, texte lisible — polyvalent.',
    display: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
  },
  {
    key: 'editorial_serif',
    label: 'Éditorial',
    description: 'Serif élégant pour une boutique premium.',
    display: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
  },
  {
    key: 'modern_mono',
    label: 'Moderne',
    description: 'Géométrique et net, idéal minimal / tech.',
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  {
    key: 'friendly',
    label: 'Amical',
    description: 'Outfit + Figtree — chaleureux, lifestyle.',
    display: "'Outfit', sans-serif",
    body: "'Figtree', sans-serif",
  },
  {
    key: 'jakarta',
    label: 'Jakarta',
    description: 'Plus Jakarta + Inter — SaaS / fashion contemporain.',
    display: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
  },
];

export const RADIUS_PRESETS: {
  key: RadiusPresetKey;
  label: string;
  description: string;
  card: string;
  button: string;
  chip: string;
}[] = [
  { key: 'sharp', label: 'Angles droits', description: 'Look bold / flash sale.', card: 'rounded-none', button: 'rounded-none', chip: 'rounded-none' },
  { key: 'subtle', label: 'Léger', description: 'Coins discrets, look app moderne.', card: 'rounded-lg', button: 'rounded-md', chip: 'rounded' },
  { key: 'soft', label: 'Doux', description: 'Équilibre e-commerce classique.', card: 'rounded-2xl', button: 'rounded-xl', chip: 'rounded-lg' },
  { key: 'round', label: 'Arrondi', description: 'Boutons et cartes très doux.', card: 'rounded-3xl', button: 'rounded-full', chip: 'rounded-full' },
  { key: 'pill', label: 'Pilule', description: 'Maximum d’arrondi partout.', card: 'rounded-[2rem]', button: 'rounded-full', chip: 'rounded-full' },
];

export function normalizeFontPair(raw?: string | null): FontPairKey {
  const k = (raw || 'display_sans').trim().toLowerCase();
  if (
    k === 'editorial_serif' ||
    k === 'modern_mono' ||
    k === 'friendly' ||
    k === 'jakarta'
  ) {
    return k;
  }
  return 'display_sans';
}

export function normalizeRadiusPreset(raw?: string | null): RadiusPresetKey {
  const k = (raw || 'soft').trim().toLowerCase();
  if (k === 'sharp' || k === 'subtle' || k === 'round' || k === 'pill') return k;
  return 'soft';
}

export function fontPairVars(key: FontPairKey): Record<string, string> {
  const pair = FONT_PAIRS.find((p) => p.key === key) ?? FONT_PAIRS[0];
  return {
    '--font-display': pair.display,
    '--font-body': pair.body,
  };
}

/** Valeurs CSS réelles (pas des suffixes Tailwind). */
const RADIUS_CSS: Record<
  RadiusPresetKey,
  { card: string; button: string; chip: string }
> = {
  sharp: { card: '0px', button: '0px', chip: '0px' },
  subtle: { card: '0.5rem', button: '0.375rem', chip: '0.25rem' },
  soft: { card: '1rem', button: '0.75rem', chip: '0.5rem' },
  round: { card: '1.5rem', button: '9999px', chip: '9999px' },
  pill: { card: '2rem', button: '9999px', chip: '9999px' },
};

export function radiusPresetVars(key: RadiusPresetKey): Record<string, string> {
  const preset = RADIUS_CSS[key] ?? RADIUS_CSS.soft;
  return {
    '--theme-radius-card': preset.card,
    '--theme-radius-button': preset.button,
    '--theme-radius-chip': preset.chip,
  };
}

/** Classes shell catalogue / panier selon thème. */
export function storefrontShellClass(themeKey: StoreThemeKey): string {
  if (themeKey === 'bold') return 'text-white [&_.text-muted-foreground]:text-white/65';
  if (themeKey === 'minimal') return 'text-neutral-900';
  if (themeKey === 'elegant') return 'text-[hsl(280_20%_18%)]';
  return '';
}

export function storefrontGridClass(themeKey: StoreThemeKey): string {
  if (themeKey === 'minimal') return 'grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3';
  if (themeKey === 'bold') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
  if (themeKey === 'elegant') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10';
  return 'grid-cols-2 lg:grid-cols-4';
}

export function storefrontChipClass(themeKey: StoreThemeKey, radius: RadiusPresetKey): string {
  if (themeKey === 'bold' || radius === 'sharp') return 'rounded-none';
  if (themeKey === 'elegant' || radius === 'round' || radius === 'pill') return 'rounded-full';
  return RADIUS_PRESETS.find((p) => p.key === radius)?.chip ?? 'rounded-lg';
}

export function storefrontProductImageClass(themeKey: StoreThemeKey, radius: RadiusPresetKey): string {
  const r =
    radius === 'sharp' || themeKey === 'bold' || themeKey === 'minimal' || themeKey === 'elegant'
      ? 'rounded-none'
      : radius === 'pill'
        ? 'rounded-[2rem]'
        : radius === 'round'
          ? 'rounded-3xl'
          : radius === 'subtle'
            ? 'rounded-lg'
            : 'rounded-2xl';
  if (themeKey === 'minimal' || themeKey === 'elegant') return cn('aspect-[3/4]', r);
  if (themeKey === 'bold') return cn('aspect-square', r);
  return cn('aspect-[4/5]', r);
}

export function storefrontProductCardShell(
  themeKey: StoreThemeKey,
  radius: RadiusPresetKey,
  cardStyle:
    | 'elevated'
    | 'bordered'
    | 'flat'
    | 'minimal'
    | 'glass'
    | 'lifted'
    | 'soft' = 'elevated',
): string {
  const preset = RADIUS_PRESETS.find((p) => p.key === radius) ?? RADIUS_PRESETS[2];
  const styleChrome =
    cardStyle === 'bordered'
      ? 'border-2 border-border bg-card shadow-none'
      : cardStyle === 'flat'
        ? 'border-0 bg-muted/40 shadow-none'
        : cardStyle === 'minimal'
          ? 'border-0 bg-transparent shadow-none p-0'
          : cardStyle === 'glass'
            ? 'border border-white/40 bg-white/50 shadow-soft backdrop-blur-md'
            : cardStyle === 'lifted'
              ? 'border border-border/40 bg-card shadow-xl shadow-black/15'
              : cardStyle === 'soft'
                ? 'border-0 bg-primary/5 shadow-none'
                : 'border border-border/70 bg-card shadow-soft';

  if (themeKey === 'bold') {
    return cn(
      cardStyle === 'minimal' ? 'border-0 bg-transparent shadow-none p-0' : 'border-2 border-white/15 bg-[hsl(350_30%_12%)] shadow-none',
      preset.card,
    );
  }
  if (themeKey === 'minimal') {
    return cn(
      cardStyle === 'elevated' ? 'border border-border/50 bg-card shadow-soft p-3' : 'border-0 bg-transparent shadow-none p-0',
      preset.card,
    );
  }
  if (themeKey === 'elegant') {
    return cn(
      cardStyle === 'flat' || cardStyle === 'minimal'
        ? 'border-0 bg-transparent shadow-none text-center'
        : 'border border-[hsl(280_15%_88%)] bg-[hsl(40_30%_99%)] shadow-none text-center',
      preset.card,
    );
  }
  return cn(styleChrome, preset.card);
}

export function storefrontPagePanelClass(themeKey: StoreThemeKey, radius: RadiusPresetKey): string {
  const preset = RADIUS_PRESETS.find((p) => p.key === radius) ?? RADIUS_PRESETS[1];
  if (themeKey === 'bold') {
    return cn('border-2 border-white/15 bg-[hsl(350_30%_12%)]', preset.card);
  }
  return cn('border border-border bg-card', preset.card);
}
