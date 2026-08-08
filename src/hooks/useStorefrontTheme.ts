import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useStorefrontAppearanceOverride } from '@/contexts/StorefrontAppearanceOverride';
import { normalizeThemeKey } from '@/config/storeThemes';
import {
  normalizeFontPair,
  normalizeRadiusPreset,
  storefrontChipClass,
  storefrontGridClass,
  storefrontPagePanelClass,
  storefrontProductCardShell,
  storefrontProductImageClass,
  storefrontShellClass,
  type FontPairKey,
  type RadiusPresetKey,
} from '@/config/storefrontTheme';
import { normalizeAppearance, shopGridClass } from '@/config/storeAppearance';
import { useDesignDemo } from '@/demo/DesignDemoContext';

/**
 * Thème vitrine unifié (layout + catalogue + panier).
 */
export function useStorefrontTheme(forceThemeKey?: string) {
  const { store } = useTenant();
  const demo = useDesignDemo();
  const override = useStorefrontAppearanceOverride();

  return useMemo(() => {
    const themeKey = normalizeThemeKey(
      forceThemeKey ?? override?.themeKey ?? demo?.themeKey ?? store?.themeKey,
    );
    const fontPair: FontPairKey = normalizeFontPair(
      override?.fontPair ?? store?.fontPair,
    );
    const radiusPreset: RadiusPresetKey = normalizeRadiusPreset(
      override?.radiusPreset ?? store?.radiusPreset,
    );
    const appearance = normalizeAppearance(override?.appearance ?? store?.appearance);

    return {
      themeKey,
      fontPair,
      radiusPreset,
      appearance,
      shell: storefrontShellClass(themeKey),
      /** Grille catalogue : colonnes / densité Apparence (sinon fallback thème). */
      grid:
        shopGridClass(appearance.shopGridColumns, appearance.shopDensity) ||
        storefrontGridClass(themeKey),
      chip: (extra?: string) =>
        storefrontChipClass(themeKey, radiusPreset) + (extra ? ` ${extra}` : ''),
      productImage: storefrontProductImageClass(themeKey, radiusPreset),
      productCard: storefrontProductCardShell(themeKey, radiusPreset, appearance.cardStyle),
      pagePanel: storefrontPagePanelClass(themeKey, radiusPreset),
    };
  }, [
    forceThemeKey,
    demo?.themeKey,
    override?.themeKey,
    override?.fontPair,
    override?.radiusPreset,
    override?.appearance,
    store?.themeKey,
    store?.fontPair,
    store?.radiusPreset,
    store?.appearance,
  ]);
}
