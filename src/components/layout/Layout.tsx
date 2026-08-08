import { ReactNode, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TopBar from './TopBar';
import PromoModal from '../ui/PromoModal';
import { ANIMATIONS } from '@/config/animations';
import { useProtectSiteImages } from '@/hooks/useProtectSiteImages';
import { resolveTenantSlug, useTenant } from '@/contexts/TenantContext';
import { StorefrontBrandOverrideProvider } from '@/contexts/StorefrontBrandOverride';
import { useDesignDemo } from '@/demo/DesignDemoContext';
import { normalizeThemeKey } from '@/config/storeThemes';
import { normalizeFontPair, normalizeRadiusPreset } from '@/config/storefrontTheme';
import { normalizeAppearance } from '@/config/storeAppearance';
import {
  applyDocumentBrand,
  clearRootStoreTheme,
  storeThemeStyleVars,
} from '@/utils/storeTheme';
import { cn } from '@/lib/utils';
import TrackingPixels from '@/components/storefront/TrackingPixels';
import CookieConsentBanner from '@/components/storefront/CookieConsentBanner';
import StickyCta from '@/components/layout/StickyCta';
import NeutralBootLoader from '@/components/layout/NeutralBootLoader';

interface LayoutProps {
  children: ReactNode;
  /** Force un thème (ex. page démo design). */
  forceThemeKey?: string;
  /** Branding forcé (démo) — sinon store du tenant. */
  forceBrand?: {
    siteName?: string | null;
    tagline?: string | null;
    logoUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    aboutText?: string | null;
  };
}

const Layout = ({ children, forceThemeKey, forceBrand }: LayoutProps) => {
  const { pathname } = useLocation();
  const { store, isLoading } = useTenant();
  const demo = useDesignDemo();
  const pageFade = ANIMATIONS.pageFadeOnRouteChange;
  const shellRef = useRef<HTMLDivElement>(null);
  const siteContentRef = useRef<HTMLDivElement>(null);
  useProtectSiteImages(siteContentRef);
  /** Barre outils démo design au-dessus du header vitrine (~2 rows) */
  const demoChromePx = demo ? 96 : 0;

  // Couleurs / thème / favicon : vitrine tenant (sous-domaine / ?tenant=)
  // ou boutique déjà résolue hors pages marketing/admin (ex. localhost après session).
  const path = pathname;
  const isAdminPath = path.startsWith('/admin') || path.startsWith('/superadmin');
  const isMarketingPath =
    path === '/' ||
    path.startsWith('/creer') ||
    path.startsWith('/create') ||
    path.startsWith('/pricing') ||
    path.startsWith('/design-demo');
  const onTenantStorefront =
    !!forceBrand ||
    !!resolveTenantSlug() ||
    (!!store && !isAdminPath && !isMarketingPath);
  const brand = forceBrand ?? (onTenantStorefront ? store : null);
  const themeKey = normalizeThemeKey(
    forceThemeKey ?? (onTenantStorefront ? store?.themeKey : null),
  );
  const fontPair = normalizeFontPair(store?.fontPair);
  const radiusPreset = normalizeRadiusPreset(store?.radiusPreset);
  const appearance = normalizeAppearance(store?.appearance);
  const themeBrand = useMemo(
    () =>
      brand
        ? {
            ...brand,
            fontPair,
            radiusPreset,
          }
        : null,
    [brand, fontPair, radiusPreset],
  );
  const themeVars = useMemo(() => storeThemeStyleVars(themeBrand), [themeBrand]);

  useEffect(() => {
    // Les couleurs restent sur le wrapper — jamais sur :root (admin / Matjarona).
    clearRootStoreTheme();
    if (brand) {
      applyDocumentBrand(brand);
    }
    return () => {
      clearRootStoreTheme();
      applyDocumentBrand(null);
    };
  }, [brand]);

  // Scrollbar page (html) : vars sur documentElement uniquement en vitrine tenant.
  useEffect(() => {
    if (!onTenantStorefront) return;
    const root = document.documentElement.style;
    const track = appearance.scrollbarTrackColor.trim();
    const thumb = appearance.scrollbarThumbColor.trim();
    if (track) root.setProperty('--scrollbar-track', track);
    else root.removeProperty('--scrollbar-track');
    if (thumb) root.setProperty('--scrollbar-thumb', thumb);
    else root.removeProperty('--scrollbar-thumb');
    return () => {
      root.removeProperty('--scrollbar-track');
      root.removeProperty('--scrollbar-thumb');
    };
  }, [
    onTenantStorefront,
    appearance.scrollbarTrackColor,
    appearance.scrollbarThumbColor,
  ]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const setOffset = () => {
      document.documentElement.style.setProperty(
        '--layout-top-offset',
        `${el.offsetHeight + demoChromePx}px`,
      );
    };
    setOffset();

    const ro = new ResizeObserver(setOffset);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--layout-top-offset');
    };
  }, [demoChromePx]);

  // Première visite sans cache : ne pas peindre le chrome Matjarona (rose / classic).
  if (onTenantStorefront && !forceBrand && !brand && isLoading) {
    return <NeutralBootLoader />;
  }

  return (
    <StorefrontBrandOverrideProvider value={forceBrand ?? null}>
      <div
        ref={siteContentRef}
        className={cn(
          'site-protected-media storefront-skin flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-hidden',
          `store-theme store-theme--${themeKey}`,
        )}
        data-store-theme={themeKey}
        data-font-pair={fontPair || 'display_sans'}
        data-radius-preset={radiusPreset || 'soft'}
        data-button-style={appearance.buttonStyle}
        data-card-style={appearance.cardStyle}
        data-hero-style={appearance.heroStyle}
        data-footer-layout={appearance.footerLayout}
        data-header-custom={
          appearance.headerBgColor || appearance.headerTextColor ? '1' : undefined
        }
        data-page-custom={appearance.pageBgColor ? '1' : undefined}
        data-footer-custom={
          appearance.footerBgColor || appearance.footerTextColor ? '1' : undefined
        }
        style={{
          ...themeVars,
          ...(appearance.headerBgColor
            ? ({ '--header-bg': appearance.headerBgColor } as CSSProperties)
            : {}),
          ...(appearance.headerTextColor
            ? ({ '--header-fg': appearance.headerTextColor } as CSSProperties)
            : {}),
          ...(appearance.pageBgColor
            ? ({ '--page-bg': appearance.pageBgColor } as CSSProperties)
            : {}),
          ...(appearance.footerBgColor
            ? ({ '--footer-bg': appearance.footerBgColor } as CSSProperties)
            : {}),
          ...(appearance.footerTextColor
            ? ({ '--footer-fg': appearance.footerTextColor } as CSSProperties)
            : {}),
          ...(appearance.scrollbarTrackColor
            ? ({ '--scrollbar-track': appearance.scrollbarTrackColor } as CSSProperties)
            : {}),
          ...(appearance.scrollbarThumbColor
            ? ({ '--scrollbar-thumb': appearance.scrollbarThumbColor } as CSSProperties)
            : {}),
          ...(appearance.pageBgColor
            ? ({ backgroundColor: appearance.pageBgColor } as CSSProperties)
            : {}),
        }}
      >
        <TrackingPixels />
        <div
          ref={shellRef}
          className="fixed inset-x-0 z-50 flex flex-col supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]"
          style={{ top: demoChromePx }}
        >
          <TopBar />
          <Header />
        </div>
        <main
          className="w-full min-w-0 flex-grow overflow-x-hidden"
          style={{
            paddingTop: 'var(--layout-top-offset, 4rem)',
            ...(appearance.pageBgColor
              ? { backgroundColor: appearance.pageBgColor }
              : {}),
          }}
        >
          {pageFade ? (
            <div
              key={pathname}
              className="animate-fade-in motion-reduce:animate-none"
              style={{ animationDuration: '0.35s' }}
            >
              {children}
            </div>
          ) : (
            children
          )}
        </main>
        <Footer />
        <StickyCta />
        <PromoModal />
        <CookieConsentBanner />
      </div>
    </StorefrontBrandOverrideProvider>
  );
};

export default Layout;
