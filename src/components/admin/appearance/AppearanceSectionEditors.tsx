import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import {
  Eye,
  FileText,
  Heart,
  ImagePlus,
  LayoutGrid,
  Loader2,
  Menu,
  PanelsTopLeft,
  Ruler,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import {
  appearanceOptDesc,
  appearanceOptLabel,
} from '@/i18n/admin/appearanceOptionI18n';
import {
  StorePageHrefSelect,
  type StorePageLinkOption,
} from '@/components/admin/StorePageHrefSelect';
import {
  CartDensitySketch,
  CartEmptySketch,
  CheckoutLayoutSketch,
  CheckoutSummaryPositionSketch,
  FooterLayoutSketch,
  FormsLayoutSketch,
  HeaderLayoutSketch,
  HeroLayoutSketch,
  ProductGallerySketch,
  ShopFilterLayoutSketch,
} from '@/components/admin/appearance/AppearanceChoiceSketches';
import { COLOR_PRESETS } from '@/components/admin/page-builder/blockAppearance';
import {
  APPEARANCE_LOOK_PRESETS,
  COLOR_SCHEMES,
  HEADER_CHROME_PRESETS,
  SURFACE_PRESETS,
} from '@/config/appearancePresets';
import {
  BUTTON_STYLES,
  CARD_HOVER_EFFECTS,
  CARD_IMAGE_RATIOS,
  CARD_INFO_ALIGNS,
  CARD_STYLES,
  CART_DENSITIES,
  CART_EMPTY_STYLES,
  CHECKOUT_CTA_EMPHASIS,
  CHECKOUT_DENSITIES,
  CHECKOUT_FORM_STYLES,
  CHECKOUT_HEADING_ALIGNS,
  CHECKOUT_LAYOUTS,
  CHECKOUT_PAYMENT_STYLES,
  CHECKOUT_SUMMARY_POSITIONS,
  FOOTER_LAYOUTS,
  FORMS_LAYOUTS,
  FORMS_STYLES,
  HEADER_LAYOUTS,
  HEADER_NAV_ITEMS,
  HERO_STYLES,
  HOME_DENSITIES,
  PRODUCT_GALLERY_LAYOUTS,
  PRODUCT_GALLERY_MOBILES,
  PRODUCT_INFO_POSITIONS,
  SHOP_DENSITIES,
  SHOP_EMPTY_STYLES,
  SHOP_FILTER_LAYOUTS,
  SHOP_FILTER_MOBILES,
  SHOP_GRID_COLUMNS,
  WISHLIST_EMPTY_STYLES,
  WISHLIST_GRID_COLUMNS,
  appearanceButtonClass,
  appearanceCardClass,
  type HeaderNavEnabledKey,
  type HeaderNavHrefKey,
  type HeaderNavLabelKey,
  type StoreAppearance,
} from '@/config/storeAppearance';
import { FONT_PAIRS, RADIUS_PRESETS } from '@/config/storefrontTheme';
import { STORE_THEMES, designDemoPath, type StoreThemeKey } from '@/config/storeThemes';
import { getImageUrl } from '@/services/api/upload';
import { cn } from '@/lib/utils';
import type { AppearanceSectionId } from '@/components/admin/appearance/appearanceSections';
import type { TopBarMessageDTO } from '@/types/top-bar-messages';

export type AppearanceFormSlice = {
  siteName: string;
  tagline: string;
  aboutText: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  themeKey: string;
  fontPair: string;
  radiusPreset: string;
  appearance: StoreAppearance;
  heroEnabled: boolean;
  categoriesEnabled: boolean;
  surMesureEnabled: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactCity?: string;
};

export type AppearanceSectionEditorsProps = {
  section: AppearanceSectionId;
  form: AppearanceFormSlice;
  patch: <K extends keyof AppearanceFormSlice>(key: K, value: AppearanceFormSlice[K]) => void;
  patchAppearance: <K extends keyof StoreAppearance>(key: K, value: StoreAppearance[K]) => void;
  mergeAppearance?: (partial: Partial<StoreAppearance>) => void;
  applyThemeNow: (themeKey: StoreThemeKey) => void;
  themePresets?: Record<string, unknown> | null;
  megaMenuEnabled: boolean;
  pageLinkOptions: StorePageLinkOption[];
  customHeaderPages: Array<{
    id: number;
    title: string;
    slug: string;
    showInNav: boolean;
    published?: boolean;
  }>;
  onTogglePageInNav: (page: { id: number; title: string; showInNav: boolean }) => void;
  togglePagePending?: boolean;
  uploadingLogo: boolean;
  onLogoUpload: (file: File | null) => void;
  logoInputRef: RefObject<HTMLInputElement | null>;
  uploadingFavicon: boolean;
  onFaviconUpload: (file: File | null) => void;
  faviconInputRef: RefObject<HTMLInputElement | null>;
  publishedHomePage?: { id: number; title: string } | null;
  /** Mêmes messages que la page Bandeau (admin). */
  topBarMessages?: TopBarMessageDTO[];
  /** Aperçu panier vide / rempli. */
  cartPreviewMode?: 'empty' | 'filled';
  onCartPreviewModeChange?: (mode: 'empty' | 'filled') => void;
  wishlistPreviewMode?: 'empty' | 'filled';
  onWishlistPreviewModeChange?: (mode: 'empty' | 'filled') => void;
};

function Hint({ children }: { children: ReactNode }) {
  return <p className="text-[11px] leading-relaxed text-muted-foreground">{children}</p>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

function OptionTile({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border p-2.5 text-left transition',
        selected
          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30'
          : 'border-border/80 hover:border-sky-300 hover:bg-sky-50/40',
        className,
      )}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/15 px-2.5 py-2',
        disabled && 'opacity-60',
      )}
    >
      <Label htmlFor={id} className="cursor-pointer text-xs font-medium leading-snug">
        {label}
      </Label>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  fallback = '#0F766E',
  allowAuto,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  fallback?: string;
  allowAuto?: boolean;
}) {
  const hex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          value={hex}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <Input
          className="h-9 font-mono text-xs"
          placeholder={allowAuto ? 'Auto' : fallback}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {allowAuto && value ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 shrink-0 px-2 text-xs"
            onClick={() => onChange('')}
          >
            Auto
          </Button>
        ) : null}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            title={p.label}
            className={cn(
              'h-5 w-5 rounded-md border border-border shadow-sm transition hover:scale-110',
              value?.toUpperCase() === p.value && 'ring-2 ring-sky-500 ring-offset-1',
            )}
            style={{ backgroundColor: p.value }}
            onClick={() => onChange(p.value)}
          />
        ))}
      </div>
    </Field>
  );
}

function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <p className="pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

export function AppearanceSectionEditors({
  section,
  form,
  patch,
  patchAppearance,
  applyThemeNow,
  themePresets,
  megaMenuEnabled,
  pageLinkOptions,
  customHeaderPages,
  onTogglePageInNav,
  togglePagePending,
  uploadingLogo,
  onLogoUpload,
  logoInputRef,
  uploadingFavicon,
  onFaviconUpload,
  faviconInputRef,
  publishedHomePage,
  topBarMessages = [],
  cartPreviewMode = 'empty',
  onCartPreviewModeChange,
  wishlistPreviewMode = 'empty',
  onWishlistPreviewModeChange,
  mergeAppearance,
}: AppearanceSectionEditorsProps) {
  const { t, locale } = useAdminLocale();

  const localizeOpts = <T extends { key: string; label: string; description?: string }>(
    group: string,
    opts: readonly T[],
  ): T[] =>
    opts.map((o) => ({
      ...o,
      label: appearanceOptLabel(locale, group, o.key, o.label),
      description:
        o.description != null
          ? appearanceOptDesc(locale, group, o.key, o.description)
          : o.description,
    }));

  const buttonStyles = localizeOpts('button', BUTTON_STYLES);
  const cardStyles = localizeOpts('card', CARD_STYLES);
  const heroStyles = localizeOpts('hero', HERO_STYLES);
  const footerLayouts = localizeOpts('footerLayout', FOOTER_LAYOUTS);
  const headerLayouts = localizeOpts('headerLayout', HEADER_LAYOUTS);
  const cartDensities = localizeOpts('cartDensity', CART_DENSITIES);
  const cartEmptyStyles = localizeOpts('cartEmpty', CART_EMPTY_STYLES);
  const checkoutLayouts = localizeOpts('checkoutLayout', CHECKOUT_LAYOUTS);
  const checkoutCtaEmphasis = localizeOpts('checkoutCta', CHECKOUT_CTA_EMPHASIS);
  const checkoutSummaryPositions = localizeOpts('checkoutSummary', CHECKOUT_SUMMARY_POSITIONS);
  const checkoutDensities = localizeOpts('checkoutDensity', CHECKOUT_DENSITIES);
  const checkoutFormStyles = localizeOpts('checkoutForm', CHECKOUT_FORM_STYLES);
  const checkoutPaymentStyles = localizeOpts('checkoutPayment', CHECKOUT_PAYMENT_STYLES);
  const checkoutHeadingAligns = localizeOpts('checkoutHeading', CHECKOUT_HEADING_ALIGNS);
  const shopFilterLayouts = localizeOpts('shopFilter', SHOP_FILTER_LAYOUTS);
  const shopGridColumns = localizeOpts('shopGrid', SHOP_GRID_COLUMNS);
  const shopDensities = localizeOpts('shopDensity', SHOP_DENSITIES);
  const shopEmptyStyles = localizeOpts('shopEmpty', SHOP_EMPTY_STYLES);
  const shopFilterMobiles = localizeOpts('shopFilterMobile', SHOP_FILTER_MOBILES);
  const productGalleryMobiles = localizeOpts('productGalleryMobile', PRODUCT_GALLERY_MOBILES);
  const homeDensities = localizeOpts('homeDensity', HOME_DENSITIES);
  const productGalleryLayouts = localizeOpts('productGallery', PRODUCT_GALLERY_LAYOUTS);
  const productInfoPositions = localizeOpts('productInfo', PRODUCT_INFO_POSITIONS);
  const cardImageRatios = localizeOpts('cardRatio', CARD_IMAGE_RATIOS);
  const cardInfoAligns = localizeOpts('cardAlign', CARD_INFO_ALIGNS);
  const cardHoverEffects = localizeOpts('cardHover', CARD_HOVER_EFFECTS);
  const wishlistEmptyStyles = localizeOpts('wishlistEmpty', WISHLIST_EMPTY_STYLES);
  const wishlistGridColumns = localizeOpts('wishlistGrid', WISHLIST_GRID_COLUMNS);
  const formsLayouts = localizeOpts('formsLayout', FORMS_LAYOUTS);
  const formsStyles = localizeOpts('formsStyle', FORMS_STYLES);
  const fontPairs = localizeOpts('font', FONT_PAIRS);
  const radiusPresets = localizeOpts('radius', RADIUS_PRESETS);
  const surfacePresets = localizeOpts('surface', SURFACE_PRESETS);
  const colorSchemes = localizeOpts('scheme', COLOR_SCHEMES);
  const headerChromePresets = localizeOpts('chrome', HEADER_CHROME_PRESETS);

  const themeLabel = (key: string): string => {
    const map: Record<string, AdminMessageKey> = {
      classic: 'appearance.theme.classic',
      minimal: 'appearance.theme.minimal',
      bold: 'appearance.theme.bold',
      elegant: 'appearance.theme.elegant',
    };
    return map[key] ? t(map[key]) : key;
  };
  const themeDesc = (key: string, fallback: string): string => {
    const map: Record<string, AdminMessageKey> = {
      classic: 'appearance.theme.classicDesc',
      minimal: 'appearance.theme.minimalDesc',
      bold: 'appearance.theme.boldDesc',
      elegant: 'appearance.theme.elegantDesc',
    };
    return map[key] ? t(map[key]) : fallback;
  };
  const lookLabel = (key: string, fallback: string): string => {
    const map: Record<string, AdminMessageKey> = {
      editorial: 'appearance.look.editorial',
      dense: 'appearance.look.dense',
      boutique: 'appearance.look.boutique',
      'bold-sale': 'appearance.look.flash',
    };
    return map[key] ? t(map[key]) : fallback;
  };
  const lookDesc = (key: string, fallback: string): string => {
    const map: Record<string, AdminMessageKey> = {
      editorial: 'appearance.look.editorialDesc',
      dense: 'appearance.look.denseDesc',
      boutique: 'appearance.look.boutiqueDesc',
      'bold-sale': 'appearance.look.flashDesc',
    };
    return map[key] ? t(map[key]) : fallback;
  };

  switch (section) {
    case 'themes':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.themesHint')}</Hint>
          {mergeAppearance ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('appearance.looksComplete')}
              </p>
              <Hint>{t('appearance.looksHint')}</Hint>
              <div className="grid grid-cols-2 gap-2">
                {APPEARANCE_LOOK_PRESETS.map((preset) => (
                  <OptionTile
                    key={preset.key}
                    selected={false}
                    onClick={() => {
                      if (preset.primaryColor) patch('primaryColor', preset.primaryColor);
                      if (preset.secondaryColor) patch('secondaryColor', preset.secondaryColor);
                      mergeAppearance(preset.appearance);
                    }}
                  >
                    <p className="text-xs font-semibold">{lookLabel(preset.key, preset.label)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {lookDesc(preset.key, preset.description)}
                    </p>
                  </OptionTile>
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            {STORE_THEMES.map((theme) => {
              const selected = form.themeKey === theme.key;
              const hasPreset = Boolean(
                themePresets && typeof themePresets === 'object' && themePresets[theme.key],
              );
              return (
                <div
                  key={theme.key}
                  className={cn(
                    'overflow-hidden rounded-lg border transition',
                    selected
                      ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/25'
                      : 'border-border/80',
                  )}
                >
                  <div
                    className="h-10"
                    style={{
                      background: `linear-gradient(135deg, ${theme.demoPrimary}, ${theme.demoSecondary})`,
                    }}
                    aria-hidden
                  />
                  <div className="space-y-2 p-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-sm font-semibold">{themeLabel(theme.key)}</p>
                      {hasPreset ? (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {t('common.customized')}
                        </span>
                      ) : null}
                      {selected ? (
                        <span className="rounded bg-sky-600/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sky-800">
                          {t('common.active')}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      {themeDesc(theme.key, theme.description)}
                    </p>
                    <div className="flex gap-1.5">
                      <Button type="button" size="sm" variant="outline" className="h-8 flex-1 gap-1 text-xs" asChild>
                        <Link to={designDemoPath(theme.key)} target="_blank" rel="noreferrer">
                          <Eye className="h-3.5 w-3.5" />
                          {t('common.demo')}
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 flex-1 text-xs"
                        variant={selected ? 'secondary' : 'default'}
                        onClick={() => void applyThemeNow(theme.key)}
                        disabled={selected}
                      >
                        {selected
                          ? t('common.active')
                          : hasPreset
                            ? t('common.restore')
                            : t('common.apply')}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'typography':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.typoHint')}</Hint>
          <div className="space-y-2">
            <GroupTitle>{t('appearance.fontPairs')}</GroupTitle>
            {fontPairs.map((pair) => (
              <OptionTile
                key={pair.key}
                selected={form.fontPair === pair.key}
                onClick={() => patch('fontPair', pair.key)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-tight" style={{ fontFamily: pair.display }}>
                      Aa — {pair.label}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground" style={{ fontFamily: pair.body }}>
                      Corps : {pair.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-md border border-border/70 bg-background px-2 py-1 text-center">
                    <p className="text-lg leading-none" style={{ fontFamily: pair.display }}>
                      Ag
                    </p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground" style={{ fontFamily: pair.body }}>
                      body
                    </p>
                  </div>
                </div>
              </OptionTile>
            ))}
          </div>
          <div className="space-y-2">
            <GroupTitle>{t('appearance.group.radius')}</GroupTitle>
            <div className="grid grid-cols-1 gap-2">
              {radiusPresets.map((preset) => (
                <OptionTile
                  key={preset.key}
                  selected={form.radiusPreset === preset.key}
                  onClick={() => patch('radiusPreset', preset.key)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{preset.label}</p>
                      <p className="text-[11px] text-muted-foreground">{preset.description}</p>
                    </div>
                    <div className="flex shrink-0 items-end gap-1.5" aria-hidden>
                      <span
                        className={cn(
                          'h-9 w-11 border border-sky-500/35 bg-sky-500/10',
                          preset.card,
                        )}
                      />
                      <span
                        className={cn(
                          'h-6 w-10 border border-sky-500/40 bg-sky-500/20',
                          preset.button,
                        )}
                      />
                      <span
                        className={cn(
                          'h-4 w-4 border border-sky-500/40 bg-sky-500/30',
                          preset.chip,
                        )}
                      />
                    </div>
                  </div>
                </OptionTile>
              ))}
            </div>
          </div>
        </div>
      );

    case 'buttons':
      return (
        <div className="space-y-3">
          <Hint>{t('appearance.buttonsHint')}</Hint>
          <div className="grid grid-cols-2 gap-2">
            {buttonStyles.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.buttonStyle === opt.key}
                onClick={() => patchAppearance('buttonStyle', opt.key)}
                className="flex flex-col items-start"
              >
                <span
                  className={appearanceButtonClass(
                    opt.key,
                    cn(
                      'mb-2 inline-flex text-[11px]',
                      RADIUS_PRESETS.find((p) => p.key === form.radiusPreset)?.button,
                    ),
                  )}
                >
                  {opt.label}
                </span>
                <p className="text-[10px] leading-snug text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'cards':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.cardsHint')}</Hint>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('appearance.group.cardStyle')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cardStyles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.cardStyle === opt.key}
                  onClick={() => patchAppearance('cardStyle', opt.key)}
                >
                  <div
                    className={cn(
                      appearanceCardClass(opt.key, 'mb-2 flex gap-1.5 p-1.5'),
                      RADIUS_PRESETS.find((p) => p.key === form.radiusPreset)?.card,
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 shrink-0 bg-sky-500/25',
                        RADIUS_PRESETS.find((p) => p.key === form.radiusPreset)?.chip,
                      )}
                    />
                    <div className="min-w-0 flex-1 space-y-1 self-center">
                      <div className="h-1.5 w-full rounded-full bg-foreground/40" />
                      <div className="h-1 w-[66%] rounded-full bg-foreground/20" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ratio image
            </p>
            <div className="grid grid-cols-3 gap-2">
              {cardImageRatios.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.cardImageRatio === opt.key}
                  onClick={() => patchAppearance('cardImageRatio', opt.key)}
                >
                  <div
                    className={cn(
                      'mx-auto mb-1.5 w-full max-w-[3.5rem] bg-sky-500/30',
                      opt.key === 'square' && 'aspect-square',
                      opt.key === 'portrait' && 'aspect-[4/5]',
                      opt.key === 'landscape' && 'aspect-[4/3]',
                    )}
                  />
                  <p className="text-center text-[11px] font-semibold">{opt.label}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Alignement infos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cardInfoAligns.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.cardInfoAlign === opt.key}
                  onClick={() => patchAppearance('cardInfoAlign', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Effet survol
            </p>
            <div className="grid grid-cols-3 gap-2">
              {cardHoverEffects.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.cardHoverEffect === opt.key}
                  onClick={() => patchAppearance('cardHoverEffect', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {(
              [
                ['cardShowBadges', 'Badges', form.appearance.cardShowBadges],
                ['cardShowWishlist', 'Favoris sur carte', form.appearance.cardShowWishlist],
                ['cardShowQuickAdd', 'Aperçu rapide / Voir', form.appearance.cardShowQuickAdd],
              ] as const
            ).map(([key, label, selected]) => (
              <OptionTile
                key={key}
                selected={selected}
                onClick={() => patchAppearance(key, !selected)}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm font-semibold">{label}</p>
                <Switch
                  checked={selected}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.heroHint')}</Hint>
          <div className="grid grid-cols-2 gap-2">
            {heroStyles.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.heroStyle === opt.key}
                onClick={() => patchAppearance('heroStyle', opt.key)}
                className="p-2"
              >
                <HeroLayoutSketch style={opt.key} />
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] leading-snug text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <Field label={t('appearance.ctaLabel')} htmlFor="heroCtaLabel">
            <Input
              id="heroCtaLabel"
              className="h-9"
              value={form.appearance.heroCtaLabel}
              onChange={(e) => patchAppearance('heroCtaLabel', e.target.value)}
            />
          </Field>
          <ToggleRow
            id="heroShowBenefits"
            label={t('appearance.benefitsStrip')}
            checked={form.appearance.heroShowBenefits}
            onCheckedChange={(v) => patchAppearance('heroShowBenefits', v)}
          />
        </div>
      );

    case 'backgrounds':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.autoSurfaceHint')}</Hint>
          <GroupTitle>{t('appearance.group.surfaces')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {surfacePresets.map((preset) => {
              const selected =
                form.appearance.pageBgColor === preset.pageBgColor &&
                form.appearance.headerBgColor === preset.headerBgColor &&
                form.appearance.footerBgColor === preset.footerBgColor &&
                form.appearance.headerTextColor === preset.headerTextColor &&
                form.appearance.footerTextColor === preset.footerTextColor;
              return (
                <OptionTile
                  key={preset.key}
                  selected={selected}
                  onClick={() => {
                    patchAppearance('pageBgColor', preset.pageBgColor);
                    patchAppearance('headerBgColor', preset.headerBgColor);
                    patchAppearance('footerBgColor', preset.footerBgColor);
                    patchAppearance('headerTextColor', preset.headerTextColor);
                    patchAppearance('footerTextColor', preset.footerTextColor);
                  }}
                  className="p-2"
                >
                  <div
                    className="overflow-hidden rounded-md border border-border/60"
                    aria-hidden
                  >
                    <div
                      className="h-3"
                      style={{
                        backgroundColor: preset.headerBgColor || form.primaryColor || '#171717',
                      }}
                    />
                    <div
                      className="h-7"
                      style={{ backgroundColor: preset.pageBgColor || '#ffffff' }}
                    />
                    <div
                      className="h-3"
                      style={{
                        backgroundColor: preset.footerBgColor || '#1a1a1a',
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground">{preset.description}</p>
                </OptionTile>
              );
            })}
          </div>
          <GroupTitle>{t('appearance.group.backgrounds')}</GroupTitle>
          {(
            [
              ['headerBgColor', 'Header', '#0f0c0c'],
              ['pageBgColor', 'Contenu', '#ffffff'],
              ['footerBgColor', 'Footer', '#1a1a1a'],
            ] as const
          ).map(([key, label, fallback]) => (
            <ColorControl
              key={key}
              label={label}
              value={form.appearance[key]}
              fallback={fallback}
              allowAuto
              onChange={(v) => patchAppearance(key, v)}
            />
          ))}
          <GroupTitle>{t('appearance.group.texts')}</GroupTitle>
          <ColorControl
            label={t('appearance.headerText')}
            value={form.appearance.headerTextColor}
            fallback="#ffffff"
            allowAuto
            onChange={(v) => patchAppearance('headerTextColor', v)}
          />
          <ColorControl
            label={t('appearance.footerText')}
            value={form.appearance.footerTextColor}
            fallback="#ffffff"
            allowAuto
            onChange={(v) => patchAppearance('footerTextColor', v)}
          />
          <GroupTitle>{t('appearance.group.scrollbar')}</GroupTitle>
          <Hint>
            Couleurs de la barre de défilement (page et zones internes). « Auto » = thème. Faites
            défiler la zone ci-dessous ou l’aperçu live pour juger le rendu.
          </Hint>
          <ColorControl
            label={t('appearance.track')}
            value={form.appearance.scrollbarTrackColor}
            fallback="#e5e7eb"
            allowAuto
            onChange={(v) => patchAppearance('scrollbarTrackColor', v)}
          />
          <ColorControl
            label={t('appearance.thumb')}
            value={form.appearance.scrollbarThumbColor}
            fallback="#0d9488"
            allowAuto
            onChange={(v) => patchAppearance('scrollbarThumbColor', v)}
          />
          <div
            className="h-28 overflow-y-scroll rounded-lg border border-border/70 p-2 scrollbar-app"
            style={{
              ...(form.appearance.scrollbarTrackColor
                ? ({
                    '--scrollbar-track': form.appearance.scrollbarTrackColor,
                  } as CSSProperties)
                : {}),
              ...(form.appearance.scrollbarThumbColor
                ? ({
                    '--scrollbar-thumb': form.appearance.scrollbarThumbColor,
                  } as CSSProperties)
                : {}),
            }}
          >
            <p className="text-[11px] text-muted-foreground">
              Démo scrollbar — faites défiler pour voir piste et curseur.
            </p>
            <div className="mt-2 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 rounded-md bg-muted/60"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'hsl(var(--muted) / 0.7)'
                        : 'hsl(var(--primary) / 0.12)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case 'header':
      return (
        <div className="space-y-3">
          <Hint>
            Liens simples ici. Mega menu / app bar →{' '}
            <Link to="/admin/sections" className="font-medium text-sky-700 hover:underline">
              Navigation
            </Link>
            . Messages rotatifs →{' '}
            <Link to="/admin/top-bar-messages" className="font-medium text-sky-700 hover:underline">
              Bandeau
            </Link>
            .
          </Hint>
          <GroupTitle>{t('appearance.group.layout')}</GroupTitle>
          <div className="grid grid-cols-1 gap-2">
            {headerLayouts.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.headerLayout === opt.key}
                onClick={() => patchAppearance('headerLayout', opt.key)}
                className="p-2"
              >
                <HeaderLayoutSketch layout={opt.key} />
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.headerStyle')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {headerChromePresets.map((preset) => {
              const selected =
                form.appearance.headerBgColor === preset.headerBgColor &&
                form.appearance.headerTextColor === preset.headerTextColor;
              const swatchBg =
                preset.key === 'brand'
                  ? form.primaryColor || '#0F766E'
                  : preset.headerBgColor || '#E5E7EB';
              const swatchFg =
                preset.headerTextColor || (preset.key === 'auto' ? '#171717' : '#FFFFFF');
              return (
                <OptionTile
                  key={preset.key}
                  selected={selected}
                  onClick={() => {
                    patchAppearance('headerBgColor', preset.headerBgColor);
                    patchAppearance('headerTextColor', preset.headerTextColor);
                  }}
                  className="p-2"
                >
                  <div
                    className="flex h-8 items-center justify-between rounded-md px-2 text-[10px] font-semibold"
                    style={{ backgroundColor: swatchBg, color: swatchFg }}
                    aria-hidden
                  >
                    <span>Logo</span>
                    <span className="opacity-80">···</span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground">{preset.description}</p>
                </OptionTile>
              );
            })}
          </div>
          {megaMenuEnabled ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-amber-950">
              Mega menu actif : il remplace cette navigation. Éditez dans{' '}
              <Link to="/admin/sections" className="font-medium underline">
                Navigation → Menus
              </Link>
              .
            </div>
          ) : null}
          <GroupTitle>{t('appearance.group.elements')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['headerShowLogo', 'Logo', ImagePlus],
                ['headerShowNav', 'Navigation', Menu],
                ['headerShowSearch', 'Recherche', Search],
                ['headerShowWishlist', 'Favoris', Heart],
                ['headerShowCart', 'Panier', ShoppingBag],
              ] as const
            ).map(([key, label, Icon]) => (
              <OptionTile
                key={key}
                selected={form.appearance[key]}
                onClick={() => patchAppearance(key, !form.appearance[key])}
                className="flex items-center gap-2 p-2"
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
                    form.appearance[key]
                      ? 'border-sky-500/40 bg-sky-500/10 text-sky-700'
                      : 'border-border bg-muted/40 text-muted-foreground',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {form.appearance[key] ? 'Visible' : 'Masqué'}
                  </p>
                </div>
                <Switch
                  checked={form.appearance[key]}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>

          <OptionTile
            selected={form.appearance.headerSticky}
            onClick={() => patchAppearance('headerSticky', !form.appearance.headerSticky)}
            className="mt-2 flex items-center justify-between gap-2"
          >
            <div>
              <p className="text-sm font-semibold">{t('appearance.headerSticky')}</p>
              <p className="text-[10px] text-muted-foreground">{t('appearance.headerStickyDesc')}</p>
            </div>
            <Switch
              checked={form.appearance.headerSticky}
              onCheckedChange={(v) => patchAppearance('headerSticky', v)}
              onClick={(e) => e.stopPropagation()}
            />
          </OptionTile>

          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between gap-2">
              <GroupTitle>{t('appearance.group.promoBars')}</GroupTitle>
              <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" asChild>
                <Link to="/admin/top-bar-messages">Gérer</Link>
              </Button>
            </div>
            <Hint>
              Les mêmes messages que la page Bandeau — actifs :{' '}
              {topBarMessages.filter((m) => m.isActive).length}/{topBarMessages.length}.
            </Hint>
            {topBarMessages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/15 px-2.5 py-2 text-[11px] text-muted-foreground">
                Aucun bandeau.{' '}
                <Link to="/admin/top-bar-messages" className="font-medium text-sky-700 hover:underline">
                  En ajouter
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {topBarMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'overflow-hidden rounded-lg border border-border/70',
                      !msg.isActive && 'opacity-55',
                    )}
                  >
                    <div
                      className="px-2.5 py-2 text-center text-[11px] font-medium"
                      style={{
                        backgroundColor: msg.backgroundColor || form.primaryColor || '#0d9488',
                        color: msg.textColor || '#ffffff',
                      }}
                    >
                      {msg.message}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 text-[10px] text-muted-foreground">
                      <span>{msg.isActive ? t('common.active') : t('common.inactive')}</span>
                      <span>·</span>
                      <span>{msg.displayDurationSeconds ?? 7}s</span>
                      <span>·</span>
                      <span>Ordre {msg.displayOrder}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {form.appearance.headerPromoEnabled ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-amber-950">
                Un <strong>bandeau fixe</strong> Apparence est aussi activé : sur la vitrine, les
                messages Bandeau ont la priorité s’il y en a d’actifs. Désactivez le fixe ci-dessous
                pour éviter la confusion.
              </div>
            ) : null}
            <ToggleRow
              id="headerPromoEnabled"
              label={t('appearance.fallbackBar')}
              checked={form.appearance.headerPromoEnabled}
              onCheckedChange={(v) => patchAppearance('headerPromoEnabled', v)}
            />
            {form.appearance.headerPromoEnabled ? (
              <div className="space-y-2">
                <Field label={t('appearance.fallbackText')} htmlFor="headerPromoText">
                  <Input
                    id="headerPromoText"
                    className="h-9"
                    value={form.appearance.headerPromoText}
                    onChange={(e) => patchAppearance('headerPromoText', e.target.value)}
                  />
                </Field>
                <ColorControl
                  label={t('appearance.fallbackBg')}
                  value={form.appearance.headerPromoBgColor}
                  fallback={form.primaryColor || '#0d9488'}
                  allowAuto
                  onChange={(v) => patchAppearance('headerPromoBgColor', v)}
                />
                <ColorControl
                  label={t('appearance.fallbackFg')}
                  value={form.appearance.headerPromoTextColor}
                  fallback="#ffffff"
                  allowAuto
                  onChange={(v) => patchAppearance('headerPromoTextColor', v)}
                />
              </div>
            ) : null}
          </div>

          {form.appearance.headerShowNav && !megaMenuEnabled ? (
            <div className="space-y-3 border-t border-border/60 pt-3">
              <div className="flex items-center justify-between gap-2">
                <GroupTitle>{t('appearance.group.systemButtons')}</GroupTitle>
                <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2 text-[11px]" asChild>
                  <Link to="/admin/pages">
                    <FileText className="h-3 w-3" />
                    Pages
                  </Link>
                </Button>
              </div>
              {HEADER_NAV_ITEMS.map((item) => {
                const enabled = form.appearance[item.enabledKey];
                const hrefValue = form.appearance[item.hrefKey];
                return (
                  <div
                    key={item.hrefKey}
                    className={cn(
                      'space-y-2 rounded-lg border border-border/70 bg-muted/10 p-2.5',
                      !enabled && 'opacity-55',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.title}
                      </p>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(v) =>
                          patchAppearance(item.enabledKey as HeaderNavEnabledKey, v)
                        }
                      />
                    </div>
                    <Field label={t('appearance.text')} htmlFor={item.labelKey}>
                      <Input
                        id={item.labelKey}
                        className="h-8 text-xs"
                        disabled={!enabled}
                        value={form.appearance[item.labelKey]}
                        onChange={(e) =>
                          patchAppearance(item.labelKey as HeaderNavLabelKey, e.target.value)
                        }
                      />
                    </Field>
                    <Field label={t('appearance.destination')} htmlFor={`${item.hrefKey}-page`}>
                      <StorePageHrefSelect
                        id={`${item.hrefKey}-page`}
                        className="mt-0"
                        disabled={!enabled}
                        value={hrefValue}
                        pages={[
                          {
                            value: item.defaultPath,
                            label: `Défaut (${item.defaultPath})`,
                            published: true,
                          },
                          ...pageLinkOptions,
                        ]}
                        onPick={(href, label) => {
                          patchAppearance(item.hrefKey as HeaderNavHrefKey, href);
                          if (href !== item.defaultPath) {
                            patchAppearance(item.labelKey as HeaderNavLabelKey, label);
                          }
                        }}
                      />
                    </Field>
                    <Field label={t('appearance.manualLink')} htmlFor={item.hrefKey}>
                      <Input
                        id={item.hrefKey}
                        className="h-8 font-mono text-xs"
                        disabled={!enabled}
                        placeholder={item.defaultPath}
                        value={hrefValue}
                        onChange={(e) =>
                          patchAppearance(item.hrefKey as HeaderNavHrefKey, e.target.value)
                        }
                      />
                    </Field>
                  </div>
                );
              })}

              <GroupTitle>{t('appearance.group.customPages')}</GroupTitle>
              {customHeaderPages.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground">
                  Aucune page.{' '}
                  <Link to="/admin/pages" className="font-medium text-sky-700 hover:underline">
                    Créer une page
                  </Link>
                </p>
              ) : (
                <div className="space-y-1.5">
                  {customHeaderPages.map((page) => (
                    <div
                      key={page.id}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-2',
                        !page.showInNav && 'opacity-65',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{page.title || page.slug}</p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          /page/{page.slug}
                          {!page.published ? ' · brouillon' : ''}
                        </p>
                      </div>
                      <Switch
                        checked={page.showInNav}
                        disabled={togglePagePending}
                        onCheckedChange={() =>
                          onTogglePageInNav({
                            id: page.id,
                            title: page.title || page.slug,
                            showInNav: page.showInNav,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            ) : null}
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-3">
          <Hint>{t('appearance.footerHint')}</Hint>
          <div className="grid grid-cols-1 gap-2">
            {(
              [
                ['footerShowBrand', 'Brand', 'Logo et accroche'],
                ['footerShowNewsletter', 'Newsletter', 'Champ d’inscription'],
                ['footerShowSocials', 'Réseaux', 'Icônes sociales'],
              ] as const
            ).map(([key, label, description]) => (
              <OptionTile
                key={key}
                selected={form.appearance[key]}
                onClick={() => patchAppearance(key, !form.appearance[key])}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{description}</p>
                </div>
                <Switch
                  checked={form.appearance[key]}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.layout')}</GroupTitle>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
            {footerLayouts.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.footerLayout === opt.key}
                onClick={() => patchAppearance('footerLayout', opt.key)}
                className="p-2"
              >
                <FooterLayoutSketch layout={opt.key} />
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'identity':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.identityHint')}</Hint>
          <Field label={t('appearance.siteName')} htmlFor="siteName">
            <Input
              id="siteName"
              className="h-9"
              value={form.siteName}
              onChange={(e) => patch('siteName', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.tagline')} htmlFor="tagline">
            <Input
              id="tagline"
              className="h-9"
              value={form.tagline}
              onChange={(e) => patch('tagline', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.about')} htmlFor="aboutText">
            <Textarea
              id="aboutText"
              className="min-h-[88px] text-sm"
              value={form.aboutText}
              onChange={(e) => patch('aboutText', e.target.value)}
            />
          </Field>

          <GroupTitle>{t('appearance.group.logo')}</GroupTitle>
          <div className="flex h-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/25">
            {form.logoUrl ? (
              <img
                src={getImageUrl(form.logoUrl)}
                alt="Aperçu logo"
                className="max-h-full max-w-full object-contain p-2"
              />
            ) : (
              <span className="text-[11px] text-muted-foreground">Aucun logo</span>
            )}
          </div>
          <Input
            id="logoUrl"
            className="h-9 text-xs"
            value={form.logoUrl}
            onChange={(e) => patch('logoUrl', e.target.value)}
            placeholder="URL ou upload"
          />
          <div className="flex gap-1.5">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(e) => onLogoUpload(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 flex-1 gap-1.5 text-xs"
              disabled={uploadingLogo}
              onClick={() => logoInputRef.current?.click()}
            >
              {uploadingLogo ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploadingLogo ? 'Upload…' : 'Uploader'}
            </Button>
            {form.logoUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => patch('logoUrl', '')}
              >
                Retirer
              </Button>
            ) : null}
          </div>

          <GroupTitle>{t('appearance.group.favicon')}</GroupTitle>
          <Hint>{t('appearance.faviconHint')}</Hint>
          <div className="flex h-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/25">
            {form.faviconUrl ? (
              <img
                src={getImageUrl(form.faviconUrl)}
                alt="Aperçu favicon"
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="text-[11px] text-muted-foreground">Aucun favicon</span>
            )}
          </div>
          <Input
            id="faviconUrl"
            className="h-9 text-xs"
            value={form.faviconUrl}
            onChange={(e) => patch('faviconUrl', e.target.value)}
            placeholder="URL ou upload"
          />
          <div className="flex gap-1.5">
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon,.ico"
              className="sr-only"
              onChange={(e) => onFaviconUpload(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 flex-1 gap-1.5 text-xs"
              disabled={uploadingFavicon}
              onClick={() => faviconInputRef.current?.click()}
            >
              {uploadingFavicon ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploadingFavicon ? 'Upload…' : 'Uploader'}
            </Button>
            {form.faviconUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => patch('faviconUrl', '')}
              >
                Retirer
              </Button>
            ) : null}
          </div>

          <GroupTitle>{t('appearance.group.colorSchemes')}</GroupTitle>
          <Hint>{t('appearance.colorSchemesHint')}</Hint>
          <div className="grid grid-cols-2 gap-2">
            {colorSchemes.map((scheme) => {
              const selected =
                form.primaryColor.toUpperCase() === scheme.primaryColor.toUpperCase() &&
                form.secondaryColor.toUpperCase() === scheme.secondaryColor.toUpperCase();
              return (
                <OptionTile
                  key={scheme.key}
                  selected={selected}
                  onClick={() => {
                    patch('primaryColor', scheme.primaryColor);
                    patch('secondaryColor', scheme.secondaryColor);
                  }}
                  className="p-2"
                >
                  <div className="flex h-8 overflow-hidden rounded-md border border-border/60" aria-hidden>
                    <div className="w-2/3" style={{ backgroundColor: scheme.primaryColor }} />
                    <div className="w-1/3" style={{ backgroundColor: scheme.secondaryColor }} />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold">{scheme.label}</p>
                  <p className="text-[10px] leading-snug text-muted-foreground">
                    {scheme.description}
                  </p>
                </OptionTile>
              );
            })}
          </div>
          <GroupTitle>{t('appearance.group.customize')}</GroupTitle>
          <ColorControl
            label={t('appearance.primary')}
            value={form.primaryColor}
            fallback="#0d9488"
            onChange={(v) => patch('primaryColor', v)}
          />
          <ColorControl
            label={t('appearance.secondary')}
            value={form.secondaryColor}
            fallback="#0a1628"
            onChange={(v) => patch('secondaryColor', v)}
          />
        </div>
      );

    case 'cart':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.cartHint')}</Hint>
          <GroupTitle>{t('appearance.group.preview')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['empty', 'Panier vide', 'Voir l’état vide'],
                ['filled', 'Panier rempli', 'Voir densité & CTA'],
              ] as const
            ).map(([mode, label, description]) => (
              <OptionTile
                key={mode}
                selected={cartPreviewMode === mode}
                onClick={() => onCartPreviewModeChange?.(mode)}
                className="p-2"
              >
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.density')}</GroupTitle>
          <div className="grid grid-cols-1 gap-2">
            {cartDensities.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.cartDensity === opt.key}
                onClick={() => {
                  onCartPreviewModeChange?.('filled');
                  patchAppearance('cartDensity', opt.key);
                }}
                className="p-2"
              >
                <CartDensitySketch density={opt.key} />
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.emptyCart')}</GroupTitle>
          <Hint>{t('appearance.cartEmptyHint')}</Hint>
          <div className="grid grid-cols-3 gap-2">
            {cartEmptyStyles.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.cartEmptyStyle === opt.key}
                onClick={() => {
                  onCartPreviewModeChange?.('empty');
                  patchAppearance('cartEmptyStyle', opt.key);
                }}
                className="p-2"
              >
                <CartEmptySketch style={opt.key} />
                <p className="mt-1.5 text-[11px] font-semibold">{opt.label}</p>
              </OptionTile>
            ))}
          </div>
          <OptionTile
            selected={form.appearance.cartShowCrossSell}
            onClick={() =>
              patchAppearance('cartShowCrossSell', !form.appearance.cartShowCrossSell)
            }
            className="flex items-center justify-between gap-2"
          >
            <div>
              <p className="text-xs font-semibold">{t('appearance.crossSell')}</p>
              <p className="text-[10px] text-muted-foreground">
                Produits complémentaires sous le panier
              </p>
            </div>
            <Switch
              checked={form.appearance.cartShowCrossSell}
              onCheckedChange={(v) => patchAppearance('cartShowCrossSell', v)}
              onClick={(e) => e.stopPropagation()}
            />
          </OptionTile>
          <Field label={t('appearance.ctaLabel')} htmlFor="cartCtaLabel">
            <Input
              id="cartCtaLabel"
              className="h-9"
              value={form.appearance.cartCtaLabel}
              onChange={(e) => patchAppearance('cartCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'checkout':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.checkoutHint')}</Hint>
          <GroupTitle>{t('appearance.group.layout')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {checkoutLayouts.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutLayout === opt.key}
                onClick={() => patchAppearance('checkoutLayout', opt.key)}
                className="p-2"
              >
                <CheckoutLayoutSketch layout={opt.key} />
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.summaryPos')}</GroupTitle>
          <div className="grid grid-cols-3 gap-2">
            {checkoutSummaryPositions.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutSummaryPosition === opt.key}
                onClick={() => patchAppearance('checkoutSummaryPosition', opt.key)}
                className="p-2"
              >
                <CheckoutSummaryPositionSketch position={opt.key} />
                <p className="mt-1.5 text-[11px] font-semibold">{opt.label}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.density')}</GroupTitle>
          <div className="grid grid-cols-3 gap-2">
            {checkoutDensities.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutDensity === opt.key}
                onClick={() => patchAppearance('checkoutDensity', opt.key)}
                className="p-2"
              >
                <p className="text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.formStyle')}</GroupTitle>
          <div className="grid grid-cols-3 gap-2">
            {checkoutFormStyles.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutFormStyle === opt.key}
                onClick={() => patchAppearance('checkoutFormStyle', opt.key)}
                className="p-2"
              >
                <div
                  className={cn(
                    'h-8 rounded-md',
                    opt.key === 'card' && 'border border-border/70 bg-card shadow-sm',
                    opt.key === 'flat' && 'bg-muted/40',
                    opt.key === 'bordered' && 'border-2 border-border bg-card',
                  )}
                />
                <p className="mt-1.5 text-[11px] font-semibold">{opt.label}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.paymentStyle')}</GroupTitle>
          <div className="grid grid-cols-3 gap-2">
            {checkoutPaymentStyles.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutPaymentStyle === opt.key}
                onClick={() => patchAppearance('checkoutPaymentStyle', opt.key)}
                className="p-2"
              >
                <p className="text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.title')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {checkoutHeadingAligns.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutHeadingAlign === opt.key}
                onClick={() => patchAppearance('checkoutHeadingAlign', opt.key)}
                className="p-2"
              >
                <p
                  className={cn(
                    'text-xs font-semibold',
                    opt.key === 'center' && 'text-center',
                  )}
                >
                  {opt.label}
                </p>
                <p
                  className={cn(
                    'text-[10px] text-muted-foreground',
                    opt.key === 'center' && 'text-center',
                  )}
                >
                  {opt.description}
                </p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.payButton')}</GroupTitle>
          <div className="grid grid-cols-2 gap-2">
            {checkoutCtaEmphasis.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.checkoutCtaEmphasis === opt.key}
                onClick={() => patchAppearance('checkoutCtaEmphasis', opt.key)}
                className="p-2"
              >
                <div
                  className={cn(
                    'flex h-8 items-center justify-center text-[10px] font-bold uppercase',
                    opt.key === 'soft' && 'rounded-md bg-sky-500/15 text-sky-700',
                    opt.key === 'pill' && 'rounded-full bg-sky-600 text-white',
                    opt.key === 'bold' && 'rounded-md bg-sky-700 text-white shadow-md',
                    opt.key === 'default' && 'rounded-md bg-sky-600 text-white',
                  )}
                >
                  Payer
                </div>
                <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <GroupTitle>{t('appearance.group.options')}</GroupTitle>
          {(
            [
              [
                'checkoutStickySummary',
                'Récapitulatif collant',
                'Reste visible au scroll',
              ],
              [
                'checkoutShowTrustBadges',
                'Badges confiance',
                'Sécurité / livraison sous le CTA',
              ],
              [
                'checkoutShowPromoField',
                'Code promo',
                'Champ promo dans le récap',
              ],
              [
                'checkoutShowNotes',
                'Notes de commande',
                'Champ notes optionnel',
              ],
            ] as const
          ).map(([key, label, description]) => (
            <OptionTile
              key={key}
              selected={form.appearance[key]}
              onClick={() => patchAppearance(key, !form.appearance[key])}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={form.appearance[key]}
                onCheckedChange={(v) => patchAppearance(key, v)}
                onClick={(e) => e.stopPropagation()}
              />
            </OptionTile>
          ))}
          <Field label={t('appearance.ctaLabel')} htmlFor="checkoutCtaLabel">
            <Input
              id="checkoutCtaLabel"
              className="h-9"
              placeholder="Ex: Confirmer ma commande"
              value={form.appearance.checkoutCtaLabel}
              onChange={(e) => patchAppearance('checkoutCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'shop':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.shopHint')}</Hint>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Disposition filtres
            </p>
            <div className="grid grid-cols-3 gap-2">
              {shopFilterLayouts.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.shopFilterLayout === opt.key}
                  onClick={() => patchAppearance('shopFilterLayout', opt.key)}
                  className="p-2"
                >
                  <ShopFilterLayoutSketch layout={opt.key} />
                  <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Colonnes grille
            </p>
            <div className="grid grid-cols-3 gap-2">
              {shopGridColumns.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.shopGridColumns === opt.key}
                  onClick={() => patchAppearance('shopGridColumns', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Densité
            </p>
            <div className="grid grid-cols-3 gap-2">
              {shopDensities.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.shopDensity === opt.key}
                  onClick={() => patchAppearance('shopDensity', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Catalogue vide
            </p>
            <div className="grid grid-cols-3 gap-2">
              {shopEmptyStyles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.shopEmptyStyle === opt.key}
                  onClick={() => patchAppearance('shopEmptyStyle', opt.key)}
                >
                  <CartEmptySketch style={opt.key} />
                  <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {(
              [
                ['shopShowFilters', 'Afficher les filtres', form.appearance.shopShowFilters],
                ['shopShowSort', 'Afficher le tri', form.appearance.shopShowSort],
              ] as const
            ).map(([key, label, selected]) => (
              <OptionTile
                key={key}
                selected={selected}
                onClick={() => patchAppearance(key, !selected)}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm font-semibold">{label}</p>
                <Switch
                  checked={selected}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Filtres mobile
            </p>
            <div className="grid grid-cols-3 gap-2">
              {shopFilterMobiles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.shopFilterMobile === opt.key}
                  onClick={() => patchAppearance('shopFilterMobile', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <Field label={t('appearance.shopTitle')} htmlFor="shopTitle">
            <Input
              id="shopTitle"
              className="h-9"
              value={form.appearance.shopTitle}
              onChange={(e) => patchAppearance('shopTitle', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.subtitle')} htmlFor="shopSubtitle">
            <Textarea
              id="shopSubtitle"
              className="min-h-[64px] text-sm"
              value={form.appearance.shopSubtitle}
              onChange={(e) => patchAppearance('shopSubtitle', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.shopEmptyTitle')} htmlFor="shopEmptyTitle">
            <Input
              id="shopEmptyTitle"
              className="h-9"
              value={form.appearance.shopEmptyTitle}
              onChange={(e) => patchAppearance('shopEmptyTitle', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.shopEmptyDesc')} htmlFor="shopEmptyDescription">
            <Textarea
              id="shopEmptyDescription"
              className="min-h-[64px] text-sm"
              value={form.appearance.shopEmptyDescription}
              onChange={(e) => patchAppearance('shopEmptyDescription', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.shopEmptyCta')} htmlFor="shopEmptyCtaLabel">
            <Input
              id="shopEmptyCtaLabel"
              className="h-9"
              value={form.appearance.shopEmptyCtaLabel}
              onChange={(e) => patchAppearance('shopEmptyCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'product':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.productHint')}</Hint>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Galerie
            </p>
            <div className="grid grid-cols-3 gap-2">
              {productGalleryLayouts.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.productGalleryLayout === opt.key}
                  onClick={() => patchAppearance('productGalleryLayout', opt.key)}
                  className="p-2"
                >
                  <ProductGallerySketch layout={opt.key} />
                  <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Galerie mobile
            </p>
            <div className="grid grid-cols-3 gap-2">
              {productGalleryMobiles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.productGalleryMobile === opt.key}
                  onClick={() => patchAppearance('productGalleryMobile', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Position infos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {productInfoPositions.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.productInfoPosition === opt.key}
                  onClick={() => patchAppearance('productInfoPosition', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {(
              [
                ['productStickyBuyBox', 'Buy box sticky', form.appearance.productStickyBuyBox],
                ['productShowRelated', 'Produits similaires', form.appearance.productShowRelated],
                ['productShowTrust', 'Badges confiance', form.appearance.productShowTrust],
              ] as const
            ).map(([key, label, selected]) => (
              <OptionTile
                key={key}
                selected={selected}
                onClick={() => patchAppearance(key, !selected)}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm font-semibold">{label}</p>
                <Switch
                  checked={selected}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>
          <Field label={t('appearance.productCta')} htmlFor="productCtaLabel">
            <Input
              id="productCtaLabel"
              className="h-9"
              value={form.appearance.productCtaLabel}
              onChange={(e) => patchAppearance('productCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'wishlist':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.wishlistHint')}</Hint>
          {onWishlistPreviewModeChange ? (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Aperçu
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['empty', 'Vide'],
                    ['filled', 'Rempli'],
                  ] as const
                ).map(([mode, label]) => (
                  <OptionTile
                    key={mode}
                    selected={wishlistPreviewMode === mode}
                    onClick={() => onWishlistPreviewModeChange(mode)}
                  >
                    <p className="text-xs font-semibold">{label}</p>
                  </OptionTile>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Colonnes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {wishlistGridColumns.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.wishlistGridColumns === opt.key}
                  onClick={() => patchAppearance('wishlistGridColumns', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Liste vide
            </p>
            <div className="grid grid-cols-3 gap-2">
              {wishlistEmptyStyles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.wishlistEmptyStyle === opt.key}
                  onClick={() => patchAppearance('wishlistEmptyStyle', opt.key)}
                >
                  <CartEmptySketch style={opt.key} />
                  <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <Field label={t('appearance.emptyTitle')} htmlFor="wishlistEmptyTitle">
            <Input
              id="wishlistEmptyTitle"
              className="h-9"
              value={form.appearance.wishlistEmptyTitle}
              onChange={(e) => patchAppearance('wishlistEmptyTitle', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.emptyCta')} htmlFor="wishlistEmptyCtaLabel">
            <Input
              id="wishlistEmptyCtaLabel"
              className="h-9"
              value={form.appearance.wishlistEmptyCtaLabel}
              onChange={(e) => patchAppearance('wishlistEmptyCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'forms':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.formsHint')}</Hint>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Disposition
            </p>
            <div className="grid grid-cols-3 gap-2">
              {formsLayouts.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.formsLayout === opt.key}
                  onClick={() => patchAppearance('formsLayout', opt.key)}
                  className="p-2"
                >
                  <FormsLayoutSketch layout={opt.key} />
                  <p className="mt-1.5 text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Style panneau
            </p>
            <div className="grid grid-cols-3 gap-2">
              {formsStyles.map((opt) => (
                <OptionTile
                  key={opt.key}
                  selected={form.appearance.formsStyle === opt.key}
                  onClick={() => patchAppearance('formsStyle', opt.key)}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </OptionTile>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {(
              [
                ['formsShowHero', 'Bandeau hero', form.appearance.formsShowHero],
                ['formsShowSidebar', 'Panneau latéral / infos', form.appearance.formsShowSidebar],
              ] as const
            ).map(([key, label, selected]) => (
              <OptionTile
                key={key}
                selected={selected}
                onClick={() => patchAppearance(key, !selected)}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm font-semibold">{label}</p>
                <Switch
                  checked={selected}
                  onCheckedChange={(v) => patchAppearance(key, v)}
                  onClick={(e) => e.stopPropagation()}
                />
              </OptionTile>
            ))}
          </div>
          <Field label={t('appearance.formsCta')} htmlFor="formsCtaLabel">
            <Input
              id="formsCtaLabel"
              className="h-9"
              placeholder="Ex: Envoyer ma demande"
              value={form.appearance.formsCtaLabel}
              onChange={(e) => patchAppearance('formsCtaLabel', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'notFound':
      return (
        <div className="space-y-4">
          <Hint>{t('appearance.notFoundHint')}</Hint>
          <Field label={t('appearance.titleField')} htmlFor="notFoundTitle">
            <Input
              id="notFoundTitle"
              className="h-9"
              value={form.appearance.notFoundTitle}
              onChange={(e) => patchAppearance('notFoundTitle', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.message')} htmlFor="notFoundMessage">
            <Textarea
              id="notFoundMessage"
              className="min-h-[72px] text-sm"
              value={form.appearance.notFoundMessage}
              onChange={(e) => patchAppearance('notFoundMessage', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.ctaLabel')} htmlFor="notFoundCtaLabel">
            <Input
              id="notFoundCtaLabel"
              className="h-9"
              value={form.appearance.notFoundCtaLabel}
              onChange={(e) => patchAppearance('notFoundCtaLabel', e.target.value)}
            />
          </Field>
          <Field label={t('appearance.ctaHref')} htmlFor="notFoundCtaHref">
            <Input
              id="notFoundCtaHref"
              className="h-9"
              placeholder="/"
              value={form.appearance.notFoundCtaHref}
              onChange={(e) => patchAppearance('notFoundCtaHref', e.target.value)}
            />
          </Field>
        </div>
      );

    case 'home':
      return (
        <div className="space-y-3">
          {publishedHomePage ? (
            <div className="rounded-lg border border-border bg-muted/20 px-2.5 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Accueil géré par le page builder (« {publishedHomePage.title} »).{' '}
              <Link
                to={`/admin/pages/${publishedHomePage.id}`}
                className="font-medium text-sky-700 hover:underline"
              >
                Éditer la page
              </Link>
            </div>
          ) : (
            <>
              <Hint>{t('appearance.homeBlocksHint')}</Hint>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Densité sections
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {homeDensities.map((opt) => (
                    <OptionTile
                      key={opt.key}
                      selected={form.appearance.homeDensity === opt.key}
                      onClick={() => patchAppearance('homeDensity', opt.key)}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                    </OptionTile>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {(
                  [
                    {
                      key: 'heroEnabled' as const,
                      label: 'Hero',
                      description: 'Bandeau principal + CTA.',
                      Icon: PanelsTopLeft,
                    },
                    {
                      key: 'categoriesEnabled' as const,
                      label: 'Catégories',
                      description: 'Grille des catégories mises en avant.',
                      Icon: LayoutGrid,
                    },
                    {
                      key: 'surMesureEnabled' as const,
                      label: 'Sur mesure',
                      description: 'Lien nav + accès Sur-mesure / Devis.',
                      Icon: Ruler,
                    },
                  ] as const
                ).map(({ key, label, description, Icon }) => (
                  <OptionTile
                    key={key}
                    selected={form[key]}
                    onClick={() => patch(key, !form[key])}
                    className="flex items-start gap-2.5"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                        form[key]
                          ? 'border-sky-500/40 bg-sky-500/10 text-sky-700'
                          : 'border-border bg-muted/40 text-muted-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{label}</p>
                        <Switch
                          checked={form[key]}
                          onCheckedChange={(checked) => patch(key, checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
                    </div>
                  </OptionTile>
                ))}
              </div>
              <div className="rounded-lg border border-dashed border-border/80 bg-muted/15 px-2.5 py-2 text-[11px] text-muted-foreground">
                <Sparkles className="mb-1 inline h-3.5 w-3.5 text-sky-600" /> Pour une page
                d’accueil avancée (sections, ordre, blocs), utilisez le{' '}
                <Link to="/admin/pages" className="font-medium text-sky-700 hover:underline">
                  page builder
                </Link>
                .
              </div>
            </>
          )}
        </div>
      );

    default:
      return (
        <p className="text-xs text-muted-foreground">
          Sélectionnez une section à gauche ou dans l’aperçu.
        </p>
      );
  }
}
