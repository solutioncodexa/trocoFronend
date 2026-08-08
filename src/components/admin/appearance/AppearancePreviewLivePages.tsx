import { useMemo, type MouseEvent, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import Boutique from '@/pages/Boutique';
import Contact from '@/pages/Contact';
import PackagingRequestForm from '@/components/custom-order/PackagingRequestForm';
import { ThemeHome } from '@/components/themes/ThemeHome';
import { PageRenderer } from '@/components/storefront/PageRenderer';
import {
  AppearancePreviewNavProvider,
  previewPageFromHref,
} from '@/contexts/AppearancePreviewNav';
import { StorefrontAppearanceOverrideProvider } from '@/contexts/StorefrontAppearanceOverride';
import { StorefrontBrandOverrideProvider } from '@/contexts/StorefrontBrandOverride';
import type { StoreAppearance } from '@/config/storeAppearance';
import { normalizeThemeKey } from '@/config/storeThemes';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useTenant } from '@/contexts/TenantContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useStoreLang } from '@/hooks/useStoreLang';
import { storePagesApi } from '@/services/api/storePages';
import { resolveStickyHomeAbVariant } from '@/utils/homeAbVariant';
import type { Product } from '@/types/product';
import type { DemoCategory } from '@/demo/mockCatalog';
import { cn } from '@/lib/utils';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&h=1400&fit=crop&q=85';

export function isLiveStorefrontPreviewPage(page: string): boolean {
  return (
    page === 'home' ||
    page === 'shop' ||
    page === 'contact' ||
    page === 'sur-mesure' ||
    page === 'devis'
  );
}

type Props = {
  previewPage: string;
  onPreviewNavigate?: (page: string) => void;
  siteName: string;
  tagline: string;
  aboutText?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  themeKey: string;
  fontPair: string;
  radiusPreset: string;
  appearance: StoreAppearance;
  heroEnabled?: boolean;
  categoriesEnabled?: boolean;
  catalogProducts: Product[];
  catalogCategories: DemoCategory[];
  heroImageUrl?: string | null;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactCity?: string;
  className?: string;
};

/**
 * Corps de pages vitrine réels (même composants que « Voir boutique »),
 * pilotés par le brouillon Apparence.
 */
export function AppearancePreviewLivePages({
  previewPage,
  onPreviewNavigate,
  siteName,
  tagline,
  aboutText,
  logoUrl,
  primaryColor,
  secondaryColor,
  themeKey,
  fontPair,
  radiusPreset,
  appearance,
  heroEnabled = true,
  categoriesEnabled = true,
  catalogProducts,
  catalogCategories,
  heroImageUrl,
  contactEmail,
  contactPhone,
  contactWhatsapp,
  contactCity,
  className,
}: Props) {
  const { store } = useTenant();
  const { lang, isAr } = useStoreLang();
  const { t } = useLocale();

  const { data: publicHomes } = useQuery({
    queryKey: ['store-pages', 'public-homes', 'appearance-preview', store?.slug, lang],
    queryFn: () => storePagesApi.publicHomes(lang),
    ...staticCatalogQueryOptions,
    enabled: previewPage === 'home',
  });

  const homeAbVariant = useMemo(
    () => resolveStickyHomeAbVariant(store?.slug, publicHomes),
    [store?.slug, publicHomes],
  );

  const { data: customHome, isLoading: loadingHome } = useQuery({
    queryKey: [
      'store-pages',
      'public-home',
      'appearance-preview',
      store?.slug,
      lang,
      homeAbVariant ?? 'default',
    ],
    queryFn: () => storePagesApi.publicHome(lang, homeAbVariant),
    ...staticCatalogQueryOptions,
    enabled: previewPage === 'home',
  });

  const brandOverride = useMemo(
    () => ({
      siteName,
      tagline,
      aboutText,
      logoUrl,
      primaryColor,
      secondaryColor,
      contactEmail,
      contactPhone,
      contactWhatsapp,
      contactCity,
    }),
    [
      siteName,
      tagline,
      aboutText,
      logoUrl,
      primaryColor,
      secondaryColor,
      contactEmail,
      contactPhone,
      contactWhatsapp,
      contactCity,
    ],
  );

  const appearanceOverride = useMemo(
    () => ({
      appearance,
      themeKey,
      fontPair,
      radiusPreset,
    }),
    [appearance, themeKey, fontPair, radiusPreset],
  );

  const navValue = useMemo(
    () => ({
      go: (page: string) => onPreviewNavigate?.(page),
    }),
    [onPreviewNavigate],
  );

  const interceptLinks = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const page = previewPageFromHref(href);
    if (!page) return;
    e.preventDefault();
    e.stopPropagation();
    onPreviewNavigate?.(page);
  };

  const heroImage = heroImageUrl || FALLBACK_HERO;
  const categories =
    catalogCategories.length > 0
      ? catalogCategories
      : [
          {
            id: 'all',
            name: t('shop'),
            slug: '',
            image: heroImage,
            count: catalogProducts.length,
          },
        ];

  let body: ReactNode = null;

  if (previewPage === 'home') {
    if (loadingHome) {
      body = (
        <div className="p-10 text-center text-sm text-muted-foreground">{t('loading')}</div>
      );
    } else if (customHome?.blocks?.length) {
      body = (
        <div dir={isAr ? 'rtl' : 'ltr'}>
          <PageRenderer page={customHome} />
        </div>
      );
    } else {
      body = (
        <ThemeHome
          themeKey={normalizeThemeKey(themeKey)}
          siteName={siteName.trim() || 'Boutique'}
          tagline={tagline.trim() || t('welcomeStore')}
          aboutText={aboutText?.trim() || t('discoverProducts')}
          heroImage={heroImage}
          products={catalogProducts}
          appearance={appearance}
          showHero={heroEnabled}
          showCategories={categoriesEnabled}
          categories={categories}
        />
      );
    }
  } else if (previewPage === 'shop') {
    body = <Boutique embed />;
  } else if (previewPage === 'contact') {
    body = <Contact embed />;
  } else if (previewPage === 'sur-mesure') {
    body = <PackagingRequestForm variant="sur-mesure" embed />;
  } else if (previewPage === 'devis') {
    body = <PackagingRequestForm variant="devis" embed />;
  }

  return (
    <StorefrontBrandOverrideProvider value={brandOverride}>
      <StorefrontAppearanceOverrideProvider value={appearanceOverride}>
        <AppearancePreviewNavProvider value={navValue}>
          <div
            className={cn('appearance-preview-live min-w-0', className)}
            onClickCapture={interceptLinks}
          >
            {body}
          </div>
        </AppearancePreviewNavProvider>
      </StorefrontAppearanceOverrideProvider>
    </StorefrontBrandOverrideProvider>
  );
}
