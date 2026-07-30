import { Heart, Search, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { getImageUrl } from '@/services/api/upload';
import {
  appearanceButtonClass,
  appearanceCardClass,
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

export type AppearancePreviewSection =
  | 'typography'
  | 'buttons'
  | 'cards'
  | 'hero'
  | 'backgrounds'
  | 'header'
  | 'footer';

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
}: Props) {
  const radius = RADIUS_PRESETS.find((p) => p.key === normalizeRadiusPreset(radiusPreset)) ?? RADIUS_PRESETS[1];
  const name = siteName.trim() || 'Nom de la boutique';
  const tag = tagline.trim() || 'Votre accroche apparaîtra ici';
  const cta = appearance.heroCtaLabel.trim() || 'Voir la boutique';
  const compactFooter = appearance.footerLayout === 'compact';
  const linksOnly = appearance.footerLayout === 'links_only';
  const activeBanners = topBarMessages.filter((m) => m.isActive && m.message?.trim());
  const [bannerIndex, setBannerIndex] = useState(0);

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
      className="storefront-skin store-theme overflow-hidden border border-border transition-all duration-300"
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
      }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/50 bg-card/40 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Aperçu en direct — cliquez une zone pour éditer
        </p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
          Live
        </span>
      </div>

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
            className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3"
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
            <div className="flex min-w-0 items-center gap-2">
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
              {appearance.headerShowNav ? (
                <nav className="hidden min-w-0 gap-2 text-[10px] font-semibold sm:flex">
                  {appearance.headerShowHome ? (
                    <span
                      className="underline decoration-primary underline-offset-4"
                      title={appearance.headerHrefHome || '/'}
                    >
                      {appearance.headerLabelHome}
                    </span>
                  ) : null}
                  {appearance.headerShowShop ? (
                    <span title={appearance.headerHrefShop || '/boutique'}>
                      {appearance.headerLabelShop}
                    </span>
                  ) : null}
                  {appearance.headerShowSurMesure ? (
                    <span title={appearance.headerHrefSurMesure || '/sur-mesure'}>
                      {appearance.headerLabelSurMesure}
                    </span>
                  ) : null}
                  {appearance.headerShowDevis ? (
                    <span title={appearance.headerHrefDevis || '/devis'}>
                      {appearance.headerLabelDevis}
                    </span>
                  ) : null}
                  {appearance.headerShowContact ? (
                    <span title={appearance.headerHrefContact || '/contact'}>
                      {appearance.headerLabelContact}
                    </span>
                  ) : null}
                  {customNavPages.map((p) => (
                    <span key={p.href} title={p.href} className="text-primary">
                      {p.title}
                    </span>
                  ))}
                </nav>
              ) : null}
            </div>
            <div className="flex items-center gap-2 opacity-90">
              {appearance.headerShowSearch ? (
                <Search className="h-4 w-4" aria-label="Recherche" />
              ) : null}
              {appearance.headerShowWishlist ? (
                <Heart className="h-4 w-4" aria-label="Favoris" />
              ) : null}
              {appearance.headerShowCart ? (
                <ShoppingBag className="h-4 w-4" aria-label="Panier" />
              ) : null}
            </div>
          </div>
        </>,
      )}

      {hotspot(
        'hero',
        'Hero',
        undefined,
        <>
          {appearance.heroStyle === 'split' ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2">
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
                className={cn('aspect-[4/3] bg-gradient-to-br from-primary/30 to-muted', radius.card)}
                style={{
                  background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}55, ${secondaryColor || '#0369a1'}33)`,
                }}
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
              style={{
                background: `linear-gradient(90deg, ${primaryColor || '#0d9488'}33, transparent)`,
              }}
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
          ) : (
            <div
              className="relative flex min-h-[180px] items-end px-4 py-6"
              style={{
                background: `linear-gradient(135deg, ${primaryColor || '#0d9488'}88, ${secondaryColor || '#0369a1'}44)`,
              }}
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

      {hotspot(
        'cards',
        'Cards',
        'p-4',
        <>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Carte produit
          </p>
          <div
            className={cn(
              appearanceCardClass(appearance.cardStyle, 'flex gap-3 p-3'),
              radius.card,
              appearance.cardStyle !== 'minimal' && 'max-w-xs',
            )}
          >
            <div
              className={cn('h-16 w-16 shrink-0 bg-muted', radius.chip || radius.card)}
              style={{
                background: `linear-gradient(145deg, ${primaryColor || '#0d9488'}40, ${secondaryColor || '#0369a1'}25)`,
              }}
            />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold">Produit exemple</p>
              <p className="font-body text-xs text-muted-foreground">199 DH</p>
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
          </div>
        </>,
      )}

      {hotspot(
        'backgrounds',
        'Fonds',
        'border-y border-dashed border-border/60 bg-muted/20 px-4 py-2',
        <p className="text-center text-[10px] text-muted-foreground">
          Fond de page — cliquez pour éditer les couleurs
        </p>,
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
              linksOnly ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3',
            )}
          >
            {appearance.footerShowBrand && !linksOnly ? (
              <div>
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
            {appearance.footerShowNewsletter ? (
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
    </div>
  );
}
