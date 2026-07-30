import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
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
import { normalizeAppearance } from '@/config/storeAppearance';
import { useDesignDemo } from '@/demo/DesignDemoContext';

/**
 * Thème vitrine unifié (layout + catalogue + panier).
 */
export function useStorefrontTheme(forceThemeKey?: string) {
  const { store } = useTenant();
  const demo = useDesignDemo();

  return useMemo(() => {
    const themeKey = normalizeThemeKey(forceThemeKey ?? demo?.themeKey ?? store?.themeKey);
    const fontPair: FontPairKey = normalizeFontPair(store?.fontPair);
    const radiusPreset: RadiusPresetKey = normalizeRadiusPreset(store?.radiusPreset);
    const appearance = normalizeAppearance(store?.appearance);

    return {
      themeKey,
      fontPair,
      radiusPreset,
      appearance,
      shell: storefrontShellClass(themeKey),
      grid: storefrontGridClass(themeKey),
      chip: (extra?: string) => storefrontChipClass(themeKey, radiusPreset) + (extra ? ` ${extra}` : ''),
      productImage: storefrontProductImageClass(themeKey, radiusPreset),
      productCard: storefrontProductCardShell(themeKey, radiusPreset, appearance.cardStyle),
      pagePanel: storefrontPagePanelClass(themeKey, radiusPreset),
    };
  }, [forceThemeKey, demo?.themeKey, store?.themeKey, store?.fontPair, store?.radiusPreset, store?.appearance]);
}
