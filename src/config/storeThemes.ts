export type StoreThemeKey = 'classic' | 'minimal' | 'bold' | 'elegant';

export type StoreThemeDefinition = {
  key: StoreThemeKey;
  label: string;
  description: string;
  /** Couleurs d’exemple pour la démo (pas celles du vendeur). */
  demoPrimary: string;
  demoSecondary: string;
  demoSiteName: string;
  demoTagline: string;
};

export const STORE_THEMES: StoreThemeDefinition[] = [
  {
    key: 'classic',
    label: 'Classique',
    description:
      'Vitrine e-commerce classique : hero photo, bénéfices, grilles catégories & produits arrondis.',
    demoPrimary: '#0F766E',
    demoSecondary: '#0369A1',
    demoSiteName: 'Atelier Nord',
    demoTagline: 'Votre boutique en ligne, soignée et claire',
  },
  {
    key: 'minimal',
    label: 'Minimal',
    description:
      'Look éditorial blanc : typo géante, peu de sections, grille produit épurée sans cartes.',
    demoPrimary: '#171717',
    demoSecondary: '#737373',
    demoSiteName: 'Ligne Pure',
    demoTagline: 'Moins de bruit, plus de produit',
  },
  {
    key: 'bold',
    label: 'Bold',
    description:
      'Ambiance dark flash-sale : angles droits, bannières, gros CTA et mosaïque asymétrique.',
    demoPrimary: '#E11D48',
    demoSecondary: '#F97316',
    demoSiteName: 'Pulse Market',
    demoTagline: 'Des offres qui se voient',
  },
  {
    key: 'elegant',
    label: 'Élégant',
    description:
      'Magazine luxe : hero centré, italiques, cercles catégories et mise en page éditoriale.',
    demoPrimary: '#7851A9',
    demoSecondary: '#A78BFA',
    demoSiteName: 'Maison Céleste',
    demoTagline: 'L’élégance au quotidien',
  },
];

export function normalizeThemeKey(raw?: string | null): StoreThemeKey {
  const k = (raw || 'classic').trim().toLowerCase();
  if (k === 'minimal' || k === 'bold' || k === 'elegant' || k === 'classic') return k;
  return 'classic';
}

export function getThemeDefinition(key?: string | null): StoreThemeDefinition {
  const k = normalizeThemeKey(key);
  return STORE_THEMES.find((t) => t.key === k) ?? STORE_THEMES[0];
}

export function designDemoPath(themeKey: StoreThemeKey): string {
  return `/design-demo/${themeKey}`;
}
