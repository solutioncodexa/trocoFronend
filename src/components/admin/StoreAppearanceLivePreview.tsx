import { Banknote, CheckCircle, CloudUpload, Heart, Search, ShoppingBag, Truck, Shield, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { getImageUrl } from '@/services/api/upload';
import {
  appearanceButtonClass,
  appearanceCardClass,
  cardImageRatioClass,
  checkoutCtaClass,
  formsPanelClass,
  shopGridClass,
  wishlistGridClass,
  type StoreAppearance,
} from '@/config/storeAppearance';
import {
  RADIUS_PRESETS,
  normalizeFontPair,
  normalizeRadiusPreset,
} from '@/config/storefrontTheme';
import { storeThemeStyleVars } from '@/utils/storeTheme';
import { cn } from '@/lib/utils';
import type { TopBarMessageDTO } from '@/types/top-bar-messages';
import type { Product } from '@/types/product';
import type { DemoCategory } from '@/demo/mockCatalog';
import { formatPrice } from '@/utils/formatPrice';
import { useLocale } from '@/contexts/LocaleContext';
import {
  AppearancePreviewLivePages,
  isLiveStorefrontPreviewPage,
} from '@/components/admin/appearance/AppearancePreviewLivePages';

/** Convertit les breakpoints viewport en container queries (aperçu device). */
function cq(...parts: Array<string | false | null | undefined>): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .replace(/\b((?:max-)?(?:sm|md|lg|xl|2xl)):/g, '@$1:');
}

function badgeLabel(badge: Product['badges'][number]): string {
  if (badge === 'new') return 'Nouveau';
  if (badge === 'bestseller') return 'Best-seller';
  return 'Promo';
}

function PreviewProductImage({
  src,
  alt,
  className,
  fallbackStyle,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackStyle?: CSSProperties;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={cn('object-cover', className)}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <div className={cn('bg-muted', className)} style={fallbackStyle} />;
}

export type AppearancePreviewSection =
  | 'typography'
  | 'buttons'
  | 'cards'
  | 'hero'
  | 'backgrounds'
  | 'header'
  | 'footer'
  | 'cart'
  | 'checkout'
  | 'shop'
  | 'product'
  | 'wishlist'
  | 'forms'
  | 'notFound';

type Props = {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontPair: string;
  radiusPreset: string;
  appearance: StoreAppearance;
  /** Messages actifs (mêmes que page Bandeau / vitrine). */
  topBarMessages?: TopBarMessageDTO[];
  /** Pages custom affichées dans le menu (showInNav). */
  customNavPages?: Array<{ title: string; href: string }>;
  /** Shopify-like : clic sur une zone → focus l’édition correspondante. */
  onSelectSection?: (section: AppearancePreviewSection) => void;
  activeSection?: AppearancePreviewSection | null;
  /** Page affichée dans l’aperçu (nav 2ᵉ clic). */
  previewPage?: string;
  onPreviewNavigate?: (page: string) => void;
  /** Aperçu panier : vide ou rempli. */
  cartPreviewMode?: 'empty' | 'filled';
  onCartPreviewModeChange?: (mode: 'empty' | 'filled') => void;
  wishlistPreviewMode?: 'empty' | 'filled';
  onWishlistPreviewModeChange?: (mode: 'empty' | 'filled') => void;
  /** Catalogue réel de la boutique (même source que la vitrine). */
  catalogProducts?: Product[];
  catalogCategories?: DemoCategory[];
  heroImageUrl?: string | null;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactCity?: string;
  themeKey?: string;
  aboutText?: string;
  heroEnabled?: boolean;
  categoriesEnabled?: boolean;
};

function PreviewHotspot({
  section,
  activeSection,
  onSelect,
  className,
  label,
  children,
}: {
  section: AppearancePreviewSection;
  activeSection?: AppearancePreviewSection | null;
  onSelect?: (section: AppearancePreviewSection) => void;
  className?: string;
  label: string;
  children: ReactNode;
}) {
  const active = activeSection === section;
  const interactive = Boolean(onSelect);
  return (
    <div
      data-appearance-section={section}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Éditer : ${label}` : undefined}
      onClick={
        interactive
          ? (e) => {
              e.stopPropagation();
              onSelect?.(section);
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.(section);
              }
            }
          : undefined
      }
      className={cn(
        'group/hotspot relative outline-none transition-[box-shadow,background-color] duration-200',
        interactive &&
          'cursor-pointer hover:ring-2 hover:ring-sky-400/70 hover:ring-offset-1 hover:ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500',
        active && 'ring-2 ring-sky-500 ring-offset-1 ring-offset-background',
        className,
      )}
    >
      {children}
      {interactive ? (
        <span
          className={cn(
            'pointer-events-none absolute right-1.5 top-1.5 z-10 rounded bg-sky-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white opacity-0 shadow-sm transition-opacity group-hover/hotspot:opacity-100',
            active && 'opacity-100',
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Maquette vitrine 100 % pilotée par le formulaire (sans save / sans iframe).
 */
export function StoreAppearanceLivePreview({
  siteName,
  tagline,
  logoUrl,
  primaryColor,
  secondaryColor,
  fontPair,
  radiusPreset,
  appearance,
  topBarMessages = [],
  customNavPages = [],
  onSelectSection,
  activeSection,
  previewPage = 'home',
  onPreviewNavigate,
  cartPreviewMode = 'empty',
  onCartPreviewModeChange,
  wishlistPreviewMode = 'empty',
  onWishlistPreviewModeChange,
  catalogProducts = [],
  catalogCategories = [],
  heroImageUrl = null,
  contactEmail = '',
  contactPhone = '',
  contactWhatsapp = '',
  contactCity = '',
  themeKey = 'classic',
  aboutText = '',
  heroEnabled = true,
  categoriesEnabled = true,
}: Props) {
  const { t } = useLocale();
  const radius = RADIUS_PRESETS.find((p) => p.key === normalizeRadiusPreset(radiusPreset)) ?? RADIUS_PRESETS[1];
  const name = siteName.trim() || 'Nom de la boutique';
  const tag = tagline.trim() || 'Votre accroche apparaîtra ici';
  const cta = appearance.heroCtaLabel.trim() || 'Voir la boutique';
  const compactFooter = appearance.footerLayout === 'compact';
  const linksOnly = appearance.footerLayout === 'links_only';
  const centeredFooter = appearance.footerLayout === 'centered';
  const stackedFooter = appearance.footerLayout === 'stacked';
  const activeBanners = topBarMessages.filter((m) => m.isActive && m.message?.trim());
  const [bannerIndex, setBannerIndex] = useState(0);
  const [checkoutPreviewStep, setCheckoutPreviewStep] = useState<1 | 2>(1);

  const products = catalogProducts;
  const categories = catalogCategories;
  const shopLimit = appearance.shopGridColumns === '2' ? 4 : 6;
  const shopProducts = useMemo(() => products.slice(0, shopLimit), [products, shopLimit]);
  const featuredProduct = products[0] ?? null;
  const cartProducts = useMemo(() => products.slice(0, 2), [products]);
  const wishlistProducts = useMemo(() => {
    const n =
      appearance.wishlistGridColumns === '2'
        ? 2
        : appearance.wishlistGridColumns === '3'
          ? 3
          : 4;
    return products.slice(0, n);
  }, [products, appearance.wishlistGridColumns]);
  const checkoutTotal = cartProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const gradientFallback = useMemo(
    () => ({
      background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}40, ${secondaryColor || '#0369a1'}25)`,
    }),
    [primaryColor, secondaryColor],
  );
  const heroMediaStyle = useMemo((): CSSProperties => {
    if (heroImageUrl) {
      return {
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05)), url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
    };
  }, [heroImageUrl, primaryColor, secondaryColor]);

  const packagingCfg = useMemo(() => {
    const isSurMesure = previewPage === 'sur-mesure';
    if (isSurMesure) {
      return {
        eyebrow: t('smEyebrow'),
        title: t('smTitle'),
        subtitle: t('smSubtitle'),
        needLabel: t('smNeedLabel'),
        needOptions: [t('smNeedLogo'), t('smNeedUnique'), t('smNeedDims')],
        uploadTitle: t('smUploadTitle'),
        uploadHint: t('smUploadHint'),
        tip: t('smTip'),
        submitLabel: t('smSubmit'),
        processEyebrow: t('smProcessEyebrow'),
        steps: [
          { n: 1, title: t('smStep1Title'), desc: t('smStep1Desc') },
          { n: 2, title: t('smStep2Title'), desc: t('smStep2Desc') },
          { n: 3, title: t('smStep3Title'), desc: t('smStep3Desc') },
        ],
        altLabel: t('smAltLink'),
        altPage: 'devis' as const,
      };
    }
    return {
      eyebrow: t('dvEyebrow'),
      title: t('dvTitle'),
      subtitle: t('dvSubtitle'),
      needLabel: t('dvNeedLabel'),
      needOptions: [t('dvNeedBulk'), t('dvNeedRestock'), t('dvNeedMulti')],
      uploadTitle: t('dvUploadTitle'),
      uploadHint: t('dvUploadHint'),
      tip: t('dvTip'),
      submitLabel: t('dvSubmit'),
      processEyebrow: t('dvProcessEyebrow'),
      steps: [
        { n: 1, title: t('dvStep1Title'), desc: t('dvStep1Desc') },
        { n: 2, title: t('dvStep2Title'), desc: t('dvStep2Desc') },
        { n: 3, title: t('dvStep3Title'), desc: t('dvStep3Desc') },
      ],
      altLabel: t('dvAltLink'),
      altPage: 'sur-mesure' as const,
    };
  }, [previewPage, t]);

  useEffect(() => {
    setCheckoutPreviewStep(1);
  }, [appearance.checkoutLayout]);

  const handleNavClick = (page: string) => (e: MouseEvent) => {
    e.stopPropagation();
    // 1er clic : sélectionne Header. 2ᵉ clic (header déjà actif) : navigue comme Shopify.
    if (activeSection === 'header' && onPreviewNavigate) {
      onPreviewNavigate(page);
      return;
    }
    onSelectSection?.('header');
  };

  const previewPageLabel = (() => {
    if (previewPage === 'home') return appearance.headerLabelHome || 'Accueil';
    if (previewPage === 'shop') return appearance.headerLabelShop || 'Boutique';
    if (previewPage === 'sur-mesure') return appearance.headerLabelSurMesure || 'Sur-mesure';
    if (previewPage === 'devis') return appearance.headerLabelDevis || 'Devis';
    if (previewPage === 'contact') return appearance.headerLabelContact || 'Contact';
    if (previewPage === 'cart') return 'Panier';
    if (previewPage === 'checkout') return 'Checkout';
    if (previewPage === 'product') return 'Fiche produit';
    if (previewPage === 'wishlist') return 'Favoris';
    if (previewPage === 'notFound') return '404';
    const custom = customNavPages.find((p) => p.href === previewPage);
    return custom?.title || previewPage;
  })();

  const cartGap =
    appearance.cartDensity === 'compact'
      ? 'gap-2 p-2'
      : appearance.cartDensity === 'spacious'
        ? 'gap-4 p-4'
        : 'gap-3 p-3';

  useEffect(() => {
    setBannerIndex(0);
  }, [activeBanners.length, activeBanners.map((m) => m.id).join(',')]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const rawSec = Number(activeBanners[bannerIndex]?.displayDurationSeconds);
    const seconds = Number.isFinite(rawSec) && rawSec > 0 ? rawSec : 7;
    const timer = window.setTimeout(() => {
      setBannerIndex((i) => (i + 1) % activeBanners.length);
    }, Math.min(Math.max(seconds * 1000, 2000), 600_000));
    return () => window.clearTimeout(timer);
  }, [activeBanners, bannerIndex]);

  const activeBanner = activeBanners[bannerIndex] ?? activeBanners[0];
  const showFallbackPromo =
    activeBanners.length === 0 &&
    appearance.headerPromoEnabled &&
    Boolean(appearance.headerPromoText.trim());

  const hotspot = (section: AppearancePreviewSection, label: string, className: string | undefined, children: ReactNode) => (
    <PreviewHotspot
      section={section}
      label={label}
      activeSection={activeSection}
      onSelect={onSelectSection}
      className={cn('group/hotspot', className)}
    >
      {children}
    </PreviewHotspot>
  );

  return (
    <div
      className="@container storefront-skin store-theme border border-border transition-all duration-300"
      data-font-pair={normalizeFontPair(fontPair)}
      data-radius-preset={normalizeRadiusPreset(radiusPreset)}
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
        ...storeThemeStyleVars({
          primaryColor,
          secondaryColor,
          fontPair,
          radiusPreset,
        }),
        borderColor: primaryColor || undefined,
        borderRadius: 'var(--theme-radius-card)',
        backgroundColor: appearance.pageBgColor || undefined,
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
      }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/50 bg-card/40 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Live — 1ᵉʳ clic édite · 2ᵉ clic menu change de page
        </p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
          {previewPageLabel}
        </span>
      </div>

      <div className="max-h-[min(78vh,900px)] overflow-y-scroll scrollbar-app">
      {hotspot(
        'header',
        'Header',
        undefined,
        <>
          {activeBanner ? (
            <div
              className="px-3 py-1.5 text-center text-[11px] font-medium transition-opacity"
              style={{
                backgroundColor:
                  activeBanner.backgroundColor || primaryColor || '#0d9488',
                color: activeBanner.textColor || '#ffffff',
              }}
            >
              {activeBanner.message}
              {activeBanners.length > 1 ? (
                <span className="ml-2 opacity-70">
                  ({bannerIndex + 1}/{activeBanners.length})
                </span>
              ) : null}
            </div>
          ) : showFallbackPromo ? (
            <div
              className="px-3 py-1.5 text-center text-[11px] font-medium"
              style={{
                backgroundColor:
                  appearance.headerPromoBgColor || primaryColor || '#0d9488',
                color: appearance.headerPromoTextColor || '#ffffff',
              }}
            >
              {appearance.headerPromoText}
            </div>
          ) : null}

          <div
            className={cn(
              'relative border-b border-border/60 px-4 py-3',
              appearance.headerLayout === 'centered' && 'flex flex-col items-center gap-2',
              appearance.headerLayout === 'stacked' && 'flex flex-col gap-2',
              appearance.headerLayout === 'inline' && 'flex items-center justify-between gap-3',
            )}
            data-header-custom={
              appearance.headerBgColor || appearance.headerTextColor ? '1' : undefined
            }
            style={{
              backgroundColor: appearance.headerBgColor || undefined,
              color: appearance.headerTextColor || undefined,
              ...(appearance.headerBgColor
                ? ({ '--header-bg': appearance.headerBgColor } as CSSProperties)
                : {}),
              ...(appearance.headerTextColor
                ? ({ '--header-fg': appearance.headerTextColor } as CSSProperties)
                : {}),
            }}
          >
            <div
              className={cn(
                'flex min-w-0 items-center gap-2',
                appearance.headerLayout === 'centered' && 'flex-col',
                appearance.headerLayout === 'stacked' && 'w-full justify-between',
              )}
            >
              {appearance.headerShowLogo ? (
                <div
                  className={cn(
                    'flex h-9 w-16 shrink-0 items-center justify-center overflow-hidden bg-muted/40',
                    radius.card,
                  )}
                >
                  {logoUrl ? (
                    <img
                      src={getImageUrl(logoUrl)}
                      alt=""
                      className="max-h-full max-w-full object-contain p-0.5"
                    />
                  ) : (
                    <span className="font-display text-[10px] font-bold text-primary">
                      {name.slice(0, 8)}
                    </span>
                  )}
                </div>
              ) : null}
              {appearance.headerShowNav && appearance.headerLayout !== 'stacked' ? (
                <nav
                  className={cn(
                    'hidden min-w-0 gap-2 text-[10px] font-semibold @sm:flex',
                    appearance.headerLayout === 'centered' && 'justify-center',
                  )}
                >
                  {appearance.headerShowHome ? (
                    <button
                      type="button"
                      className={cn(
                        'hover:underline',
                        previewPage === 'home' && 'underline decoration-primary underline-offset-4',
                      )}
                      title={
                        activeSection === 'header'
                          ? '2ᵉ clic : ouvrir Accueil'
                          : appearance.headerHrefHome || '/'
                      }
                      onClick={handleNavClick('home')}
                    >
                      {appearance.headerLabelHome}
                    </button>
                  ) : null}
                  {appearance.headerShowShop ? (
                    <button
                      type="button"
                      className={cn(
                        'hover:underline',
                        previewPage === 'shop' && 'underline decoration-primary underline-offset-4',
                      )}
                      title={
                        activeSection === 'header'
                          ? '2ᵉ clic : ouvrir Boutique'
                          : appearance.headerHrefShop || '/boutique'
                      }
                      onClick={handleNavClick('shop')}
                    >
                      {appearance.headerLabelShop}
                    </button>
                  ) : null}
                  {appearance.headerShowSurMesure ? (
                    <button
                      type="button"
                      className={cn(
                        'hover:underline',
                        previewPage === 'sur-mesure' && 'underline decoration-primary underline-offset-4',
                      )}
                      title={
                        activeSection === 'header'
                          ? '2ᵉ clic : ouvrir Sur-mesure'
                          : appearance.headerHrefSurMesure || '/sur-mesure'
                      }
                      onClick={handleNavClick('sur-mesure')}
                    >
                      {appearance.headerLabelSurMesure}
                    </button>
                  ) : null}
                  {appearance.headerShowDevis ? (
                    <button
                      type="button"
                      className={cn(
                        'hover:underline',
                        previewPage === 'devis' && 'underline decoration-primary underline-offset-4',
                      )}
                      title={
                        activeSection === 'header'
                          ? '2ᵉ clic : ouvrir Devis'
                          : appearance.headerHrefDevis || '/devis'
                      }
                      onClick={handleNavClick('devis')}
                    >
                      {appearance.headerLabelDevis}
                    </button>
                  ) : null}
                  {appearance.headerShowContact ? (
                    <button
                      type="button"
                      className={cn(
                        'hover:underline',
                        previewPage === 'contact' && 'underline decoration-primary underline-offset-4',
                      )}
                      title={
                        activeSection === 'header'
                          ? '2ᵉ clic : ouvrir Contact'
                          : appearance.headerHrefContact || '/contact'
                      }
                      onClick={handleNavClick('contact')}
                    >
                      {appearance.headerLabelContact}
                    </button>
                  ) : null}
                  {customNavPages.map((p) => (
                    <button
                      key={p.href}
                      type="button"
                      className={cn(
                        'text-primary hover:underline',
                        previewPage === p.href && 'underline underline-offset-4',
                      )}
                      title={
                        activeSection === 'header' ? `2ᵉ clic : ${p.title}` : p.href
                      }
                      onClick={handleNavClick(p.href)}
                    >
                      {p.title}
                    </button>
                  ))}
                </nav>
              ) : null}
              {appearance.headerLayout === 'stacked' ? (
                <div className="flex items-center gap-2 opacity-90">
                  {appearance.headerShowSearch ? <Search className="h-4 w-4" /> : null}
                  {appearance.headerShowWishlist ? (
                    <button type="button" onClick={handleNavClick('wishlist')} aria-label="Favoris">
                      <Heart className="h-4 w-4" />
                    </button>
                  ) : null}
                  {appearance.headerShowCart ? (
                    <button type="button" onClick={handleNavClick('cart')}>
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            {appearance.headerShowNav && appearance.headerLayout === 'stacked' ? (
              <nav className="flex w-full flex-wrap justify-center gap-2 border-t border-border/40 pt-2 text-[10px] font-semibold">
                {appearance.headerShowHome ? (
                  <button type="button" onClick={handleNavClick('home')}>
                    {appearance.headerLabelHome}
                  </button>
                ) : null}
                {appearance.headerShowShop ? (
                  <button type="button" onClick={handleNavClick('shop')}>
                    {appearance.headerLabelShop}
                  </button>
                ) : null}
                {appearance.headerShowContact ? (
                  <button type="button" onClick={handleNavClick('contact')}>
                    {appearance.headerLabelContact}
                  </button>
                ) : null}
              </nav>
            ) : null}
            {appearance.headerLayout !== 'stacked' ? (
              <div
                className={cn(
                  'flex items-center gap-2 opacity-90',
                  appearance.headerLayout === 'centered' && 'absolute right-4 top-3',
                )}
              >
                {appearance.headerShowSearch ? (
                  <Search className="h-4 w-4" aria-label="Recherche" />
                ) : null}
                {appearance.headerShowWishlist ? (
                  <button type="button" aria-label="Favoris" onClick={handleNavClick('wishlist')}>
                    <Heart className="h-4 w-4" />
                  </button>
                ) : null}
                {appearance.headerShowCart ? (
                  <button
                    type="button"
                    aria-label="Panier"
                    onClick={handleNavClick('cart')}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </>,
      )}

      {isLiveStorefrontPreviewPage(previewPage) ? (
        <AppearancePreviewLivePages
          previewPage={previewPage}
          onPreviewNavigate={onPreviewNavigate}
          siteName={siteName}
          tagline={tagline}
          aboutText={aboutText}
          logoUrl={logoUrl}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          themeKey={themeKey}
          fontPair={fontPair}
          radiusPreset={radiusPreset}
          appearance={appearance}
          heroEnabled={heroEnabled}
          categoriesEnabled={categoriesEnabled}
          catalogProducts={products}
          catalogCategories={categories}
          heroImageUrl={heroImageUrl}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
          contactWhatsapp={contactWhatsapp}
          contactCity={contactCity}
        />
      ) : previewPage === 'cart' ? (
        hotspot(
          'cart',
          'Panier',
          cn('border-b border-border/40', cartGap),
          <div className={cn('space-y-3', cartGap)}>
            <div
              className="flex justify-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {(
                [
                  ['empty', 'Vide'],
                  ['filled', 'Rempli'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                    cartPreviewMode === mode
                      ? 'bg-sky-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                  onClick={() => onCartPreviewModeChange?.(mode)}
                >
                  {label}
                </button>
              ))}
            </div>

            {cartPreviewMode === 'empty' ? (
              <div
                className={cn(
                  'flex flex-col items-center px-3 py-8 text-center',
                  appearance.cartEmptyStyle === 'branded' && 'rounded-xl bg-primary/10',
                  radius.card,
                )}
              >
                {appearance.cartEmptyStyle === 'illustrated' ? (
                  <div
                    className={cn(
                      'mb-4 h-16 w-full max-w-[200px] bg-gradient-to-br from-primary/30 to-muted',
                      radius.card,
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                    }}
                  />
                ) : (
                  <ShoppingBag
                    className={cn(
                      'mb-3 h-10 w-10',
                      appearance.cartEmptyStyle === 'branded'
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    )}
                  />
                )}
                <p className="font-display text-sm font-semibold">Votre panier est vide</p>
                <p className="mt-1 max-w-[220px] text-[11px] text-muted-foreground">
                  {appearance.cartEmptyStyle === 'branded'
                    ? `Parcourez ${name} et ajoutez vos favoris.`
                    : 'Découvrez nos produits et commencez vos achats.'}
                </p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-4 text-[11px]'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewNavigate?.('shop');
                  }}
                >
                  Voir la boutique
                </button>
                <p className="mt-3 text-[9px] font-medium uppercase tracking-wider text-sky-700">
                  Style :{' '}
                  {appearance.cartEmptyStyle === 'simple'
                    ? 'Simple'
                    : appearance.cartEmptyStyle === 'illustrated'
                      ? 'Illustré'
                      : 'Marque'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-center font-display text-sm font-semibold">Votre panier</p>
                {(cartProducts.length > 0 ? cartProducts : [null, null]).map((product, i) => (
                  <div
                    key={product?.id ?? i}
                    className={cn(
                      appearanceCardClass(appearance.cardStyle, 'flex items-center gap-2'),
                      radius.card,
                      appearance.cartDensity === 'compact' ? 'p-2' : 'p-3',
                    )}
                  >
                    <PreviewProductImage
                      src={product?.images?.[0]}
                      alt={product?.name}
                      className={cn('h-10 w-10 shrink-0', radius.chip)}
                      fallbackStyle={gradientFallback}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {product?.name || `Produit ${i + 1}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {product ? formatPrice(product.price) : '99 DH'}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'w-full text-[11px]'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewNavigate?.('checkout');
                  }}
                >
                  {appearance.cartCtaLabel || 'Passer la commande'}
                </button>
                {appearance.cartShowCrossSell ? (
                  <p className="text-center text-[10px] text-muted-foreground">
                    + Cross-sell sous le panier
                  </p>
                ) : null}
              </>
            )}
          </div>,
        )
      ) : previewPage === 'checkout' ? (
        hotspot(
          'checkout',
          'Checkout',
          'border-b border-border/40 bg-muted/10 p-3 @sm:p-4',
          <div
            className="space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center @sm:text-left">
              <h2
                className={cn(
                  'font-display text-base font-semibold text-foreground @sm:text-lg',
                  appearance.checkoutHeadingAlign === 'center' && 'text-center',
                )}
              >
                Validation de votre Commande
              </h2>
              <p
                className={cn(
                  'mt-0.5 font-display text-lg text-primary @sm:text-xl',
                  appearance.checkoutHeadingAlign === 'center' && 'text-center',
                )}
              >
                {checkoutTotal > 0 ? formatPrice(checkoutTotal) : '198 DH'}
              </p>
            </div>

            {appearance.checkoutLayout === 'steps' ? (
              <div
                className={cn(
                  'flex items-center gap-2',
                  appearance.checkoutHeadingAlign === 'center' && 'mx-auto max-w-xs',
                )}
              >
                <button
                  type="button"
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider',
                    checkoutPreviewStep === 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                  onClick={() => setCheckoutPreviewStep(1)}
                >
                  1 · Livraison
                </button>
                <div className="h-px flex-1 bg-border" />
                <button
                  type="button"
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider',
                    checkoutPreviewStep === 2
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                  onClick={() => setCheckoutPreviewStep(2)}
                >
                  2 · Paiement
                </button>
              </div>
            ) : null}

            <div
              className={cn(
                'flex gap-3',
                appearance.checkoutSummaryPosition === 'bottom'
                  ? 'flex-col'
                  : 'flex-col @lg:flex-row @lg:items-start',
                appearance.checkoutSummaryPosition === 'left' && '@lg:flex-row-reverse',
                appearance.checkoutDensity === 'compact' && 'gap-2',
                appearance.checkoutDensity === 'spacious' && 'gap-4',
              )}
            >
              <div
                className={cn(
                  'min-w-0 flex-1 space-y-3 rounded-xl p-3 @sm:p-4',
                  radius.card,
                  appearance.checkoutFormStyle === 'flat' && 'bg-transparent',
                  appearance.checkoutFormStyle === 'bordered' &&
                    'border-2 border-border bg-card',
                  appearance.checkoutFormStyle === 'card' &&
                    'border border-border bg-card shadow-soft',
                  appearance.checkoutDensity === 'compact' && 'space-y-2 p-2.5',
                  appearance.checkoutDensity === 'spacious' && 'space-y-4 p-4',
                )}
              >
                {(appearance.checkoutLayout !== 'steps' || checkoutPreviewStep === 1) && (
                  <div className="space-y-2.5">
                    <div className="grid gap-2 @sm:grid-cols-2">
                      {(
                        [
                          ['Nom Complet', 'Ex: Jean Dupont'],
                          ['Téléphone', '+212 6...'],
                          ['Email (optionnel)', 'vous@exemple.ma'],
                          ['Ville', 'Ex: Casablanca'],
                        ] as const
                      ).map(([label, placeholder]) => (
                        <label key={label} className="block space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {label}
                          </span>
                          <div
                            className={cn(
                              'flex h-8 items-center rounded-lg border border-border bg-background px-2.5 text-[11px] text-muted-foreground/70',
                              radius.button,
                            )}
                          >
                            {placeholder}
                          </div>
                        </label>
                      ))}
                    </div>
                    <label className="block space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Adresse de livraison
                      </span>
                      <div
                        className={cn(
                          'flex h-8 items-center rounded-lg border border-border bg-background px-2.5 text-[11px] text-muted-foreground/70',
                          radius.button,
                        )}
                      >
                        Rue, n° d&apos;appartement...
                      </div>
                    </label>
                    {appearance.checkoutShowNotes ? (
                      <label className="block space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          Notes (optionnel)
                        </span>
                        <div
                          className={cn(
                            'flex h-12 items-start rounded-lg border border-border bg-background px-2.5 py-2 text-[11px] text-muted-foreground/70',
                            radius.button,
                          )}
                        >
                          Précisions pour le livreur...
                        </div>
                      </label>
                    ) : null}
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Livraison
                      </p>
                      <div
                        className={cn(
                          'flex items-start gap-2 rounded-lg border-2 border-primary bg-primary/5 p-2',
                          radius.card,
                        )}
                      >
                        <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold">Amana Express</p>
                          <p className="text-[10px] text-muted-foreground">Gratuite · 2–3 jours</p>
                        </div>
                      </div>
                    </div>
                    {appearance.checkoutLayout === 'steps' ? (
                      <button
                        type="button"
                        className={cn(
                          appearanceButtonClass(appearance.buttonStyle, 'w-full text-[10px]'),
                          radius.button,
                        )}
                        onClick={() => setCheckoutPreviewStep(2)}
                      >
                        Continuer vers le paiement
                      </button>
                    ) : null}
                  </div>
                )}

                {(appearance.checkoutLayout !== 'steps' || checkoutPreviewStep === 2) && (
                  <div className="space-y-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Mode de paiement
                    </p>
                    <div
                      className={cn(
                        'space-y-1.5',
                        appearance.checkoutPaymentStyle === 'compact' && 'grid grid-cols-2 gap-1.5 space-y-0',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-start gap-2 border-2 border-primary bg-primary/[0.06] p-2',
                          appearance.checkoutPaymentStyle === 'list' ? 'rounded-lg py-1.5' : 'rounded-lg',
                          radius.card,
                        )}
                      >
                        <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div>
                          <p className="text-[11px] font-semibold">Paiement à la livraison</p>
                          {appearance.checkoutPaymentStyle !== 'compact' ? (
                            <p className="text-[10px] text-muted-foreground">Payez en espèces au livreur</p>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-start gap-2 border border-border p-2 opacity-70',
                          appearance.checkoutPaymentStyle === 'list' ? 'rounded-lg py-1.5' : 'rounded-lg',
                          radius.card,
                        )}
                      >
                        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] font-semibold">Carte bancaire</p>
                          {appearance.checkoutPaymentStyle !== 'compact' ? (
                            <p className="text-[10px] text-muted-foreground">Paiement sécurisé en ligne</p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                      <div className="flex gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide">
                            Confirmation immédiate
                          </p>
                          <p className="mt-0.5 text-[9px] leading-relaxed text-muted-foreground">
                            Votre commande sera enregistrée. Notre service vous contactera pour
                            confirmer.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={cq(
                        checkoutCtaClass(
                          appearance.checkoutCtaEmphasis,
                          'min-h-[2.5rem] py-2 text-[10px] sm:min-h-[2.75rem] sm:text-[11px]',
                        ),
                      )}
                    >
                      <CheckCircle className="size-4 shrink-0" aria-hidden />
                      <span>
                        {appearance.checkoutCtaLabel?.trim() || 'Confirmer la commande'}
                      </span>
                    </button>

                    {appearance.checkoutShowTrustBadges ? (
                      <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-primary" /> Paiement sécurisé
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Truck className="h-3 w-3 text-primary" /> Livraison suivie
                        </span>
                      </div>
                    ) : null}

                    {appearance.checkoutLayout === 'steps' ? (
                      <button
                        type="button"
                        className="w-full text-center text-[9px] uppercase tracking-wider text-muted-foreground hover:text-primary"
                        onClick={() => setCheckoutPreviewStep(1)}
                      >
                        ← Retour livraison
                      </button>
                    ) : null}
                  </div>
                )}
              </div>

              <aside
                className={cn(
                  'w-full shrink-0 rounded-xl border border-border bg-card p-3 shadow-soft',
                  appearance.checkoutSummaryPosition === 'bottom' ? 'w-full' : '@lg:w-[38%]',
                  radius.card,
                  appearance.checkoutStickySummary &&
                    appearance.checkoutSummaryPosition !== 'bottom' &&
                    'ring-1 ring-primary/25',
                  appearance.checkoutDensity === 'compact' && 'p-2.5',
                  appearance.checkoutDensity === 'spacious' && 'p-4',
                )}
              >
                <p className="border-b border-border pb-2 text-[10px] font-bold uppercase tracking-wider">
                  Résumé du panier
                  {appearance.checkoutStickySummary &&
                  appearance.checkoutSummaryPosition !== 'bottom' ? (
                    <span className="ml-1.5 text-[8px] font-semibold normal-case tracking-normal text-sky-700">
                      · collant
                    </span>
                  ) : null}
                </p>
                <div className="mt-2.5 space-y-2.5">
                  {(cartProducts.length > 0 ? cartProducts : [null, null]).map((product, i) => (
                    <div key={product?.id ?? i} className="flex gap-2">
                      <PreviewProductImage
                        src={product?.images?.[0]}
                        alt={product?.name}
                        className={cn('h-11 w-11 shrink-0', radius.chip)}
                        fallbackStyle={gradientFallback}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold leading-tight">
                          {product?.name || (i === 0 ? 'Sachet kraft premium' : 'Carton renforcé')}
                        </p>
                        <div className="mt-1 flex justify-between text-[10px]">
                          <span className="text-muted-foreground">Qté: 1</span>
                          <span className="font-bold text-primary">
                            {product ? formatPrice(product.price) : '99 DH'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {appearance.checkoutShowPromoField ? (
                  <div className="mt-3 border-t border-border pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Code promo
                    </p>
                    <div className="mt-1 flex gap-1">
                      <div className="h-7 flex-1 rounded-md border border-border bg-background" />
                      <div className="h-7 w-16 rounded-md border border-border bg-muted/40" />
                    </div>
                  </div>
                ) : null}
                <div className="mt-3 space-y-1 border-t border-border pt-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{checkoutTotal > 0 ? formatPrice(checkoutTotal) : '198 DH'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium text-emerald-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between pt-1 text-[11px] font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {checkoutTotal > 0 ? formatPrice(checkoutTotal) : '198 DH'}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>,
        )
      ) : previewPage === 'shop' ? (
        hotspot(
          'shop',
          'Boutique',
          'px-3 py-4',
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Boutique</p>
              <p className="font-display text-lg font-semibold">
                {appearance.shopTitle || 'Catalogue'}
              </p>
              {appearance.shopSubtitle ? (
                <p className="mx-auto mt-1 max-w-xs text-[10px] text-muted-foreground">
                  {appearance.shopSubtitle}
                </p>
              ) : null}
            </div>
            <div
              className={cn(
                'gap-2',
                appearance.shopFilterLayout === 'top'
                  ? 'flex flex-col'
                  : appearance.shopFilterLayout === 'drawer'
                    ? 'relative'
                    : 'grid grid-cols-[1fr_2.2fr]',
              )}
            >
              {appearance.shopShowFilters && appearance.shopFilterLayout !== 'drawer' ? (
                <aside
                  className={cn(
                    'space-y-1.5 rounded-md border border-border/60 bg-muted/20 p-2',
                    appearance.shopFilterLayout === 'top' && 'flex flex-wrap gap-1.5',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('shop');
                  }}
                >
                  {appearance.shopFilterLayout === 'top' ? (
                    (categories.length > 0
                      ? categories.slice(0, 4).map((c) => c.name)
                      : ['Catégorie', 'Prix', 'Stock']
                    ).map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-[9px]"
                      >
                        {f}
                      </span>
                    ))
                  ) : (
                    <>
                      <div className="h-1.5 w-16 rounded-full bg-foreground/30" />
                      <div className="h-8 rounded bg-background/80" />
                      <div className="h-8 rounded bg-background/80" />
                    </>
                  )}
                </aside>
              ) : null}
              <div className="min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {appearance.shopShowFilters && appearance.shopFilterLayout === 'drawer' ? (
                    <span className="rounded-md border border-border px-2 py-1 text-[9px] font-bold uppercase">
                      Filtres
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {products.length > 0 ? `${products.length} produits` : '12 produits'}
                    </span>
                  )}
                  {appearance.shopShowSort ? (
                    <span className="rounded-md border border-border px-2 py-1 text-[9px]">Tri : Nouveautés</span>
                  ) : null}
                </div>
                {categories.length > 0 ? (
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {categories.slice(0, 6).map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-[9px] font-medium"
                      >
                        {cat.image ? (
                          <img src={cat.image} alt="" className="h-4 w-4 rounded-full object-cover" />
                        ) : null}
                        {cat.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div
                  className={cq('grid', shopGridClass(appearance.shopGridColumns, appearance.shopDensity))}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('cards');
                  }}
                >
                  {(shopProducts.length > 0
                    ? shopProducts
                    : Array.from({ length: shopLimit }, (_, i) => null)
                  ).map((product, i) => (
                    <div
                      key={product?.id ?? i}
                      className={cn(appearanceCardClass(appearance.cardStyle, 'overflow-hidden p-1.5'), radius.card)}
                    >
                      <PreviewProductImage
                        src={product?.images?.[0]}
                        alt={product?.name}
                        className={cn(
                          'mb-1.5 w-full',
                          cardImageRatioClass(appearance.cardImageRatio),
                          radius.chip,
                        )}
                        fallbackStyle={{
                          background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                        }}
                      />
                      <div
                        className={cn(
                          'space-y-0.5',
                          appearance.cardInfoAlign === 'center' ? 'text-center' : 'text-left',
                        )}
                      >
                        <p className="truncate font-display text-[11px] font-semibold">
                          {product?.name || `Produit ${i + 1}`}
                        </p>
                        <p className="text-[10px] text-primary">
                          {product ? formatPrice(product.price) : '99 DH'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
        )
      ) : previewPage === 'product' ? (
        hotspot(
          'product',
          'Fiche produit',
          'px-3 py-4',
          <div
            className={cn(
              'gap-3',
              appearance.productInfoPosition === 'below' ? 'flex flex-col' : 'grid @sm:grid-cols-2',
            )}
          >
            <div className="space-y-1.5">
              {appearance.productGalleryLayout === 'left_thumbs' ? (
                <div className="grid grid-cols-[auto_1fr] gap-1.5">
                  <div className="flex flex-col gap-1">
                    {(featuredProduct?.images?.length
                      ? featuredProduct.images.slice(0, 3)
                      : [null, null, null]
                    ).map((src, i) => (
                      <PreviewProductImage
                        key={i}
                        src={src}
                        className="h-8 w-8 rounded"
                        fallbackStyle={{ background: `${primaryColor || '#0d9488'}33` }}
                      />
                    ))}
                  </div>
                  <PreviewProductImage
                    src={featuredProduct?.images?.[0]}
                    alt={featuredProduct?.name}
                    className={cn('aspect-square w-full', radius.card)}
                    fallbackStyle={{
                      background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                    }}
                  />
                </div>
              ) : appearance.productGalleryLayout === 'bottom_thumbs' ? (
                <div className="space-y-1.5">
                  <PreviewProductImage
                    src={featuredProduct?.images?.[0]}
                    alt={featuredProduct?.name}
                    className={cn('aspect-square w-full', radius.card)}
                    fallbackStyle={{
                      background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                    }}
                  />
                  <div className="flex gap-1">
                    {(featuredProduct?.images?.length
                      ? featuredProduct.images.slice(0, 3)
                      : [null, null, null]
                    ).map((src, i) => (
                      <PreviewProductImage
                        key={i}
                        src={src}
                        className="h-8 flex-1 rounded"
                        fallbackStyle={{ background: `${primaryColor || '#0d9488'}33` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <PreviewProductImage
                    src={featuredProduct?.images?.[0]}
                    alt={featuredProduct?.name}
                    className={cn('aspect-[4/3] w-full', radius.card)}
                    fallbackStyle={{
                      background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                    }}
                  />
                  <PreviewProductImage
                    src={featuredProduct?.images?.[1] || featuredProduct?.images?.[0]}
                    className={cn('aspect-[4/3] w-full', radius.card)}
                    fallbackStyle={{
                      background: `linear-gradient(145deg, ${secondaryColor || '#0369a1'}40, ${primaryColor || '#0d9488'}25)`,
                    }}
                  />
                </div>
              )}
            </div>
            <div
              className={cn(
                'space-y-2',
                appearance.productStickyBuyBox && '@sm:sticky @sm:top-2 @sm:self-start',
              )}
            >
              <p className="font-display text-lg font-semibold">
                {featuredProduct?.name || 'Produit exemple'}
              </p>
              <p className="text-sm font-semibold text-primary">
                {featuredProduct ? formatPrice(featuredProduct.price) : '199 DH'}
              </p>
              <button
                type="button"
                className={cn(
                  appearanceButtonClass(appearance.buttonStyle, 'w-full text-xs'),
                  radius.button,
                )}
              >
                {appearance.productCtaLabel || 'Commander'}
              </button>
              {appearance.productShowTrust ? (
                <div className="flex gap-2 text-[9px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> Certifié
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Truck className="h-3 w-3" /> Livraison
                  </span>
                </div>
              ) : null}
            </div>
            {appearance.productShowRelated ? (
              <div className="col-span-full space-y-1.5 border-t border-border/50 pt-3">
                <p className="text-center font-display text-sm font-semibold">Vous aimerez aussi</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={cn(appearanceCardClass(appearance.cardStyle, 'p-1'), radius.card)}>
                      <div className="mb-1 aspect-square rounded bg-muted" />
                      <p className="truncate text-[10px]">Similaire {i + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>,
        )
      ) : previewPage === 'wishlist' ? (
        hotspot(
          'wishlist',
          'Favoris',
          'px-3 py-5 @sm:px-4',
          <div className="space-y-4">
            <div
              className="flex justify-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {(
                [
                  ['empty', 'Vide'],
                  ['filled', 'Rempli'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                    wishlistPreviewMode === mode
                      ? 'bg-sky-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                  onClick={() => onWishlistPreviewModeChange?.(mode)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="font-display text-lg font-semibold @sm:text-xl">Vos Favoris</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-border" />
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  {wishlistPreviewMode === 'filled'
                    ? '4 articles favoris pour vous'
                    : 'Articles favoris pour vous'}
                </p>
                <span className="h-px w-8 bg-border" />
              </div>
            </div>

            {wishlistPreviewMode === 'empty' ? (
              <div
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl px-4 py-10 text-center',
                  appearance.wishlistEmptyStyle === 'branded' && 'bg-primary/10',
                  appearance.wishlistEmptyStyle === 'illustrated' && 'bg-muted/40',
                  appearance.wishlistEmptyStyle === 'simple' && 'bg-transparent',
                )}
              >
                {appearance.wishlistEmptyStyle === 'illustrated' ? (
                  <div
                    className="mb-1 h-14 w-28 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                    }}
                  />
                ) : (
                  <Heart className="h-10 w-10 text-primary/35" />
                )}
                <p className="font-display text-sm font-semibold italic">
                  {appearance.wishlistEmptyTitle}
                </p>
                <p className="max-w-[220px] text-[11px] text-muted-foreground">
                  Laissez-vous séduire par nos dernières créations.
                </p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-2 text-[11px]'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewNavigate?.('shop');
                  }}
                >
                  {appearance.wishlistEmptyCtaLabel}
                </button>
              </div>
            ) : (
              <>
                <div className={cq('grid gap-3', wishlistGridClass(appearance.wishlistGridColumns))}>
                  {(wishlistProducts.length > 0
                    ? wishlistProducts
                    : Array.from({ length: appearance.wishlistGridColumns === '2' ? 2 : 4 }, () => null)
                  ).map((product, i) => {
                    const tone = primaryColor || '#0d9488';
                    const badge = product?.badges?.[0];
                    return (
                      <div
                        key={product?.id ?? i}
                        className={cn(
                          appearanceCardClass(appearance.cardStyle, 'overflow-hidden p-2.5'),
                          radius.card,
                        )}
                      >
                        <div
                          className={cn(
                            'relative mb-2.5 overflow-hidden bg-muted',
                            cardImageRatioClass(appearance.cardImageRatio),
                            radius.chip,
                          )}
                        >
                          <PreviewProductImage
                            src={product?.images?.[0]}
                            alt={product?.name}
                            className="absolute inset-0 h-full w-full"
                            fallbackStyle={{
                              background: `linear-gradient(145deg, ${tone}55 0%, ${tone}22 55%, #f5f5f4 100%)`,
                            }}
                          />
                          {badge ? (
                            <span className="absolute left-1.5 top-1.5 rounded bg-foreground/85 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-background">
                              {badgeLabel(badge)}
                            </span>
                          ) : null}
                          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm">
                            <Heart className="h-3 w-3 fill-current" />
                          </span>
                        </div>
                        <div
                          className={cn(
                            'space-y-1.5',
                            appearance.cardInfoAlign === 'center' ? 'text-center' : 'text-left',
                          )}
                        >
                          <p className="line-clamp-2 font-display text-[11px] font-semibold leading-snug">
                            {product?.name || `Produit favori ${i + 1}`}
                          </p>
                          <p className="text-xs font-semibold text-primary">
                            {product ? formatPrice(product.price) : '49 DH'}
                          </p>
                          <button
                            type="button"
                            className={cn(
                              appearanceButtonClass(
                                appearance.buttonStyle,
                                'w-full px-2 py-1.5 text-[9px] uppercase tracking-wider',
                              ),
                              radius.button,
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewNavigate?.('cart');
                            }}
                          >
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-border/50 pt-3 text-[10px]">
                  <button
                    type="button"
                    className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewNavigate?.('shop');
                    }}
                  >
                    ← Continuer vos achats
                  </button>
                  <button
                    type="button"
                    className="text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Vider les favoris
                  </button>
                </div>
              </>
            )}
          </div>,
        )
      ) : previewPage === 'contact' ? (
        hotspot(
          'forms',
          'Formulaires',
          'px-3 py-4',
          <div className="space-y-3">
            {appearance.formsShowHero ? (
              <div className="px-2 py-4 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-primary">
                  {t('contactEyebrow')}
                </p>
                <p className="mt-1.5 font-display text-lg font-semibold">{t('contactTitle')}</p>
                <div className="mx-auto my-2 flex max-w-[140px] items-center gap-2">
                  <span className="h-px flex-1 bg-border" />
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="mx-auto max-w-xs text-[10px] leading-relaxed text-muted-foreground">
                  {t('contactIntro')}
                </p>
              </div>
            ) : null}
            <div
              className={cn(
                'gap-2',
                appearance.formsLayout === 'split' && appearance.formsShowSidebar
                  ? 'grid @sm:grid-cols-2'
                  : 'flex flex-col',
                appearance.formsLayout === 'centered' && 'mx-auto max-w-sm',
              )}
            >
              {appearance.formsLayout === 'stacked' && appearance.formsShowSidebar ? (
                <aside className={cn('rounded-xl p-3', formsPanelClass(appearance.formsStyle), radius.card)}>
                  <p className="text-xs font-semibold">{t('contactQuickTitle')}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{t('contactQuickDesc')}</p>
                </aside>
              ) : null}
              <div className={cn('space-y-2 rounded-xl p-3', formsPanelClass(appearance.formsStyle), radius.card)}>
                <p className="border-b border-border pb-2 text-sm font-display font-semibold">
                  {t('yourRequest')}
                </p>
                <div className="grid gap-2 @sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('fullName')}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] leading-8 text-muted-foreground">
                      {t('phFullName')}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('emailAddress')}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] leading-8 text-muted-foreground">
                      {t('phEmail')}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                    {t('phone')}
                  </p>
                  <div className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] leading-8 text-muted-foreground">
                    {t('phPhone')}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                    {t('message')}
                  </p>
                  <div className="h-16 rounded-lg border border-border bg-background px-2 py-1.5 text-[10px] text-muted-foreground">
                    {t('phMessage')}
                  </div>
                </div>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'w-full text-[11px]'),
                    radius.button,
                  )}
                >
                  {appearance.formsCtaLabel || t('sendMessage')}
                </button>
              </div>
              {appearance.formsLayout === 'split' && appearance.formsShowSidebar ? (
                <aside className={cn('space-y-3 rounded-xl p-3', formsPanelClass(appearance.formsStyle), radius.card)}>
                  <div className="border-b border-border pb-2">
                    <p className="text-xs font-semibold">{t('contactQuickTitle')}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{t('contactQuickDescLong')}</p>
                  </div>
                  {contactPhone ? (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-primary">
                        {t('phone')}
                      </p>
                      <p className="mt-1 rounded-lg border border-border bg-muted/30 px-2 py-1.5 text-[11px] font-medium">
                        {contactPhone}
                      </p>
                    </div>
                  ) : null}
                  {contactEmail ? (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-primary">
                        {t('emailAddress')}
                      </p>
                      <p className="mt-1 break-all rounded-lg border border-border bg-muted/30 px-2 py-1.5 text-[11px] font-medium">
                        {contactEmail}
                      </p>
                    </div>
                  ) : null}
                  {contactWhatsapp || contactCity ? (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-primary">
                        {t('messaging')}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {[contactWhatsapp && `WhatsApp ${contactWhatsapp}`, contactCity]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">{t('messaging')}</p>
                  )}
                </aside>
              ) : null}
            </div>
          </div>,
        )
      ) : previewPage === 'sur-mesure' || previewPage === 'devis' ? (
        hotspot(
          'forms',
          'Formulaires',
          'px-3 py-4',
          <div className="space-y-3">
            {appearance.formsShowHero ? (
              <div className="relative overflow-hidden rounded-xl border border-border px-3 py-4 text-center">
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1605745341112-859dfc6dd42e?w=800&h=400&fit=crop&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="relative z-10">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {packagingCfg.eyebrow}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{packagingCfg.title}</p>
                  <p className="mx-auto mt-1 max-w-xs text-[10px] text-muted-foreground">
                    {packagingCfg.subtitle}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-[10px] font-medium text-primary underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewNavigate?.(packagingCfg.altPage);
                    }}
                  >
                    {packagingCfg.altLabel}
                  </button>
                </div>
              </div>
            ) : null}

            <div
              className={cn(
                'gap-2',
                appearance.formsLayout === 'split' ? 'grid @sm:grid-cols-2' : 'flex flex-col',
                appearance.formsLayout === 'centered' && 'mx-auto max-w-sm',
              )}
            >
              <div
                className={cn(
                  'space-y-2 p-3',
                  formsPanelClass(appearance.formsStyle),
                  appearance.formsStyle !== 'flat' && radius.card,
                  appearance.formsLayout === 'split' && 'order-2 @sm:order-1',
                  appearance.formsLayout === 'stacked' && 'order-2',
                )}
              >
                <p className="font-display text-sm font-semibold">{t('projectDetails')}</p>
                <div className="grid gap-2 @sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {packagingCfg.needLabel}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] leading-8 text-muted-foreground">
                      {packagingCfg.needOptions[0]}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('category')}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] leading-8 text-muted-foreground">
                      {categories[0]?.name || '—'}
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 @sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('dimensionsFormat')}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background" />
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('estimatedQty')}
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                    {t('description')}
                  </p>
                  <div className="h-12 rounded-lg border border-border bg-background" />
                </div>
                <div className="grid gap-2 @sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('fullName')} *
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background" />
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {t('phone')} *
                    </p>
                    <div className="h-8 rounded-lg border border-border bg-background" />
                  </div>
                </div>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'w-full text-[11px]'),
                    radius.button,
                  )}
                >
                  {appearance.formsCtaLabel || packagingCfg.submitLabel}
                </button>
              </div>

              <div
                className={cn(
                  'space-y-2 p-3',
                  formsPanelClass(appearance.formsStyle),
                  appearance.formsStyle !== 'flat' && radius.card,
                  appearance.formsLayout === 'split' && 'order-1 @sm:order-2',
                  appearance.formsLayout === 'stacked' && 'order-1',
                  appearance.formsLayout === 'centered' && 'mt-1',
                )}
              >
                <p className="font-display text-sm font-semibold">{packagingCfg.uploadTitle}</p>
                <div className="flex min-h-[110px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 px-3 py-4 text-center">
                  <CloudUpload className="mb-2 h-7 w-7 text-primary" />
                  <p className="text-[10px] font-semibold">{packagingCfg.uploadTitle}</p>
                  <p className="mt-1 text-[9px] text-muted-foreground">{packagingCfg.uploadHint}</p>
                </div>
                {appearance.formsShowSidebar ? (
                  <div className="rounded-xl border border-border bg-card p-2.5 shadow-soft">
                    <p className="text-[10px] font-semibold uppercase tracking-wide">{t('tipTitle')}</p>
                    <p className="mt-1 text-[10px] italic text-muted-foreground">{packagingCfg.tip}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 px-3 py-3">
              <p className="text-center font-display text-sm font-semibold">{t('processTitle')}</p>
              <p className="mt-0.5 text-center text-[9px] uppercase tracking-wider text-primary">
                {packagingCfg.processEyebrow}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {packagingCfg.steps.map((step) => (
                  <div
                    key={step.n}
                    className={cn('rounded-xl border border-border bg-card p-2 text-center', radius.card)}
                  >
                    <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                      {step.n}
                    </div>
                    <p className="text-[10px] font-semibold leading-tight">{step.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[8px] text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>,
        )
      ) : previewPage === 'notFound' ? (
        hotspot(
          'notFound',
          '404',
          'px-4 py-10 text-center',
          <div className="space-y-3">
            <p className="font-display text-5xl font-semibold text-primary">404</p>
            <p className="font-display text-lg font-semibold">{appearance.notFoundTitle}</p>
            <p className="mx-auto max-w-xs text-[11px] text-muted-foreground">
              {appearance.notFoundMessage}
            </p>
            <button
              type="button"
              className={cn(
                appearanceButtonClass(appearance.buttonStyle, 'inline-flex text-xs'),
                radius.button,
              )}
              onClick={(e) => {
                e.stopPropagation();
                onPreviewNavigate?.(
                  appearance.notFoundCtaHref === '/' ? 'home' : appearance.notFoundCtaHref.replace(/^\//, '') || 'home',
                );
              }}
            >
              {appearance.notFoundCtaLabel}
            </button>
          </div>,
        )
      ) : previewPage === 'home' ? (
        <>
      {hotspot(
        'hero',
        'Hero',
        undefined,
        <>
          {appearance.heroStyle === 'split' ? (
            <div className="grid gap-3 p-4 @sm:grid-cols-2">
              <div className="flex flex-col justify-center">
                <button
                  type="button"
                  className="text-left text-[10px] font-semibold uppercase tracking-wider text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('typography');
                  }}
                >
                  {name}
                </button>
                <button
                  type="button"
                  className="mt-1 text-left font-display text-lg font-semibold leading-snug"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('typography');
                  }}
                >
                  {tag}
                </button>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-3 w-fit text-xs'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
              <div
                className={cn('aspect-[4/3]', radius.card)}
                style={heroMediaStyle}
              />
            </div>
          ) : appearance.heroStyle === 'minimal' ? (
            <div className="px-4 py-10 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{name}</p>
              <p className="mt-2 font-display text-xl font-semibold">{tag}</p>
              <button
                type="button"
                className={cn(
                  appearanceButtonClass(appearance.buttonStyle, 'mt-4 inline-flex text-xs'),
                  radius.button,
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection?.('buttons');
                }}
              >
                {cta}
              </button>
            </div>
          ) : appearance.heroStyle === 'banner' ? (
            <div
              className="relative flex min-h-[120px] items-center px-4 py-6"
              style={
                heroImageUrl
                  ? {
                      ...heroMediaStyle,
                      backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.45), transparent), url(${heroImageUrl})`,
                    }
                  : {
                      background: `linear-gradient(90deg, ${primaryColor || '#0d9488'}33, transparent)`,
                    }
              }
            >
              <div>
                <p className="font-display text-base font-semibold">{tag}</p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-2 inline-flex text-xs'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
            </div>
          ) : appearance.heroStyle === 'stacked' ? (
            <div className="p-4">
              <div className={cn('aspect-[2.2/1]', radius.card)} style={heroMediaStyle} />
              <div className="mt-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{name}</p>
                <p className="mt-1 font-display text-lg font-semibold">{tag}</p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-2 inline-flex text-xs'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
            </div>
          ) : appearance.heroStyle === 'overlay' ? (
            <div
              className="relative flex min-h-[180px] items-center justify-center px-4 py-8 text-center text-primary-foreground"
              style={
                heroImageUrl
                  ? {
                      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url(${heroImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : {
                      background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}cc, ${secondaryColor || '#0369a1'}99)`,
                    }
              }
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-90">{name}</p>
                <p className="mt-1 font-display text-xl font-semibold">{tag}</p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-3 inline-flex text-xs'),
                    radius.button,
                    appearance.buttonStyle === 'solid' && 'bg-card text-foreground hover:bg-card/90',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
            </div>
          ) : appearance.heroStyle === 'asymmetric' ? (
            <div className="relative grid gap-3 p-4 @sm:grid-cols-12">
              <div className="flex flex-col justify-end @sm:col-span-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{name}</p>
                <p className="mt-1 font-display text-lg font-semibold leading-snug">{tag}</p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-3 w-fit text-xs'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
              <div
                className={cn('aspect-[5/4] @sm:col-span-7 @sm:translate-x-2', radius.card)}
                style={heroMediaStyle}
              />
            </div>
          ) : (
            <div
              className="relative flex min-h-[180px] items-end px-4 py-6"
              style={
                heroImageUrl
                  ? {
                      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.2)), url(${heroImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : {
                      background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}88, ${secondaryColor || '#0369a1'}44)`,
                    }
              }
            >
              <div className="relative text-primary-foreground">
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-90">{name}</p>
                <p className="mt-1 font-display text-xl font-semibold drop-shadow-sm">{tag}</p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-3 inline-flex text-xs'),
                    radius.button,
                    appearance.buttonStyle === 'solid' && 'bg-card text-foreground hover:bg-card/90',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  {cta}
                </button>
              </div>
            </div>
          )}

          {appearance.heroShowBenefits ? (
            <div className="grid grid-cols-3 gap-2 border-y border-border/50 bg-muted/30 px-3 py-3">
              {[
                { Icon: Truck, t: 'Livraison' },
                { Icon: Shield, t: 'Sécurisé' },
                { Icon: Star, t: 'Qualité' },
              ].map(({ Icon, t }) => (
                <div key={t} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-body">{t}</span>
                </div>
              ))}
            </div>
          ) : null}
        </>,
      )}

      {categories.length > 0 ? (
        <div className="border-b border-border/40 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Catégories
          </p>
          <div className="grid grid-cols-2 gap-2 @sm:grid-cols-4">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn('overflow-hidden text-left', radius.card)}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewNavigate?.('shop');
                }}
              >
                <PreviewProductImage
                  src={cat.image}
                  alt={cat.name}
                  className="aspect-[4/3] w-full"
                  fallbackStyle={gradientFallback}
                />
                <p className="mt-1 truncate text-[10px] font-semibold">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hotspot(
        'cards',
        'Cards',
        'p-4',
        <>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Produits en vedette
          </p>
          <div
            className={cq('grid gap-2', shopGridClass(appearance.shopGridColumns, appearance.shopDensity))}
          >
            {(shopProducts.length > 0
              ? shopProducts.slice(0, 4)
              : Array.from({ length: 2 }, () => null)
            ).map((product, i) => (
              <div
                key={product?.id ?? i}
                className={cn(
                  appearanceCardClass(appearance.cardStyle, 'overflow-hidden p-2'),
                  radius.card,
                )}
              >
                <PreviewProductImage
                  src={product?.images?.[0]}
                  alt={product?.name}
                  className={cn(
                    'mb-2 w-full',
                    cardImageRatioClass(appearance.cardImageRatio),
                    radius.chip,
                  )}
                  fallbackStyle={gradientFallback}
                />
                <p className="truncate font-display text-[11px] font-semibold">
                  {product?.name || `Produit ${i + 1}`}
                </p>
                <p className="text-[10px] text-primary">
                  {product ? formatPrice(product.price) : '199 DH'}
                </p>
                <button
                  type="button"
                  className={cn(
                    appearanceButtonClass(appearance.buttonStyle, 'mt-2 text-[10px] px-2.5 py-1'),
                    radius.button,
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.('buttons');
                  }}
                >
                  Ajouter
                </button>
              </div>
            ))}
          </div>
        </>,
      )}
        </>
      ) : (
        <div className="px-4 py-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Aperçu page
          </p>
          <p className="mt-2 font-display text-xl font-semibold">{previewPageLabel}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Cliquez une 2ᵉ fois un lien du header pour changer de page (comme Shopify).
          </p>
          <button
            type="button"
            className={cn(
              appearanceButtonClass(appearance.buttonStyle, 'mt-4 inline-flex text-xs'),
              radius.button,
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPreviewNavigate?.('home');
            }}
          >
            Retour accueil
          </button>
          <div className="mx-auto mt-8 max-w-sm space-y-2 text-left">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-md bg-muted/50" />
            ))}
          </div>
        </div>
      )}

      {hotspot(
        'backgrounds',
        'Fonds',
        'border-y border-dashed border-border/60 bg-muted/20 px-4 py-3',
        <div className="space-y-2">
          <p className="text-center text-[10px] text-muted-foreground">
            Fonds & scrollbar — faites défiler l’aperçu pour voir la barre
          </p>
          <div className="h-16 space-y-1.5 overflow-hidden opacity-60">
            <div className="h-3 rounded bg-muted" />
            <div className="h-3 rounded bg-muted/80" style={{ width: '80%' }} />
            <div className="h-3 rounded bg-muted/60" style={{ width: '60%' }} />
          </div>
        </div>,
      )}

      {hotspot(
        'footer',
        'Footer',
        undefined,
        <div
          className={cn('border-t border-border px-4', compactFooter ? 'py-3' : 'py-4')}
          data-footer-custom={
            appearance.footerBgColor || appearance.footerTextColor ? '1' : undefined
          }
          style={{
            backgroundColor: appearance.footerBgColor || undefined,
            color: appearance.footerTextColor || undefined,
            ...(appearance.footerBgColor
              ? ({ '--footer-bg': appearance.footerBgColor } as CSSProperties)
              : {}),
            ...(appearance.footerTextColor
              ? ({ '--footer-fg': appearance.footerTextColor } as CSSProperties)
              : {}),
          }}
        >
          <div
            className={cn(
              'grid gap-3 text-[11px]',
              centeredFooter && 'justify-items-center text-center',
              stackedFooter && 'grid-cols-1',
              !centeredFooter && !stackedFooter && (linksOnly ? 'grid-cols-2' : 'grid-cols-2 @sm:grid-cols-3'),
            )}
          >
            {appearance.footerShowBrand && !linksOnly ? (
              <div className={cn(centeredFooter && 'col-span-full')}>
                <p className="font-display font-semibold">{name}</p>
                <p className="mt-0.5 font-body text-muted-foreground line-clamp-2">{tag}</p>
                {appearance.footerShowSocials ? (
                  <p className="mt-1 text-muted-foreground">● ● ●</p>
                ) : null}
              </div>
            ) : null}
            <div>
              <p className="font-display font-semibold">Liens</p>
              <p className="mt-0.5 font-body text-muted-foreground">Boutique · Contact</p>
            </div>
            {appearance.footerShowNewsletter && !linksOnly ? (
              <div>
                <p className="font-display font-semibold">Newsletter</p>
                <div className={cn('mt-1 h-7 border border-border bg-card', radius.button)} />
              </div>
            ) : appearance.footerShowSocials && (linksOnly || !appearance.footerShowBrand) ? (
              <div>
                <p className="font-display font-semibold">Réseaux</p>
                <p className="mt-0.5 text-muted-foreground">● ● ●</p>
              </div>
            ) : null}
          </div>
        </div>,
      )}

      {/* Contenu supplémentaire pour forcer la scrollbar visible dans l’aperçu */}
      <div className="space-y-2 border-t border-dashed border-border/40 px-4 py-6" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-md bg-muted/40"
            style={{ width: `${92 - i * 8}%` }}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
