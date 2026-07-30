import { Link } from 'react-router-dom';
import type { ReactNode, RefObject } from 'react';
import { Eye, FileText, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  StorePageHrefSelect,
  type StorePageLinkOption,
} from '@/components/admin/StorePageHrefSelect';
import { COLOR_PRESETS } from '@/components/admin/page-builder/blockAppearance';
import {
  BUTTON_STYLES,
  CARD_STYLES,
  FOOTER_LAYOUTS,
  HEADER_NAV_ITEMS,
  HERO_STYLES,
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
};

export type AppearanceSectionEditorsProps = {
  section: AppearanceSectionId;
  form: AppearanceFormSlice;
  patch: <K extends keyof AppearanceFormSlice>(key: K, value: AppearanceFormSlice[K]) => void;
  patchAppearance: <K extends keyof StoreAppearance>(key: K, value: StoreAppearance[K]) => void;
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
}: AppearanceSectionEditorsProps) {
  switch (section) {
    case 'themes':
      return (
        <div className="space-y-3">
          <Hint>
            Chaque thème conserve ses couleurs et réglages. Changer de thème sauvegarde l’actuel ;
            y revenir le restaure.
          </Hint>
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
                      <p className="text-sm font-semibold">{theme.label}</p>
                      {hasPreset ? (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Personnalisé
                        </span>
                      ) : null}
                      {selected ? (
                        <span className="rounded bg-sky-600/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sky-800">
                          Actif
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      {theme.description}
                    </p>
                    <div className="flex gap-1.5">
                      <Button type="button" size="sm" variant="outline" className="h-8 flex-1 gap-1 text-xs" asChild>
                        <Link to={designDemoPath(theme.key)} target="_blank" rel="noreferrer">
                          <Eye className="h-3.5 w-3.5" />
                          Démo
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
                        {selected ? 'Actif' : hasPreset ? 'Restaurer' : 'Appliquer'}
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
          <Hint>Polices et arrondis appliqués à toute la vitrine.</Hint>
          <div className="space-y-2">
            <GroupTitle>Paires de polices</GroupTitle>
            {FONT_PAIRS.map((pair) => (
              <OptionTile
                key={pair.key}
                selected={form.fontPair === pair.key}
                onClick={() => patch('fontPair', pair.key)}
              >
                <p className="text-sm font-semibold" style={{ fontFamily: pair.display }}>
                  {pair.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground" style={{ fontFamily: pair.body }}>
                  {pair.description}
                </p>
              </OptionTile>
            ))}
          </div>
          <div className="space-y-2">
            <GroupTitle>Arrondis</GroupTitle>
            {RADIUS_PRESETS.map((preset) => (
              <OptionTile
                key={preset.key}
                selected={form.radiusPreset === preset.key}
                onClick={() => patch('radiusPreset', preset.key)}
                className={preset.card}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{preset.label}</p>
                    <p className="text-[11px] text-muted-foreground">{preset.description}</p>
                  </div>
                  <span
                    className={cn(
                      'h-8 w-12 shrink-0 border-2 border-sky-500/40 bg-sky-500/10',
                      preset.card,
                    )}
                    aria-hidden
                  />
                </div>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'buttons':
      return (
        <div className="space-y-3">
          <Hint>Style des boutons CTA sur la vitrine.</Hint>
          <div className="space-y-2">
            {BUTTON_STYLES.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.buttonStyle === opt.key}
                onClick={() => patchAppearance('buttonStyle', opt.key)}
              >
                <span className={appearanceButtonClass(opt.key, 'mb-1.5 inline-flex text-[11px]')}>
                  {opt.label}
                </span>
                <p className="text-[11px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'cards':
      return (
        <div className="space-y-3">
          <Hint>Apparence des fiches produit.</Hint>
          <div className="space-y-2">
            {CARD_STYLES.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.cardStyle === opt.key}
                onClick={() => patchAppearance('cardStyle', opt.key)}
              >
                <div
                  className={cn(
                    appearanceCardClass(opt.key, 'mb-2 h-10 w-full'),
                    RADIUS_PRESETS.find((p) => p.key === form.radiusPreset)?.card,
                  )}
                />
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-4">
          <Hint>Style du bandeau d’accueil classique.</Hint>
          <div className="space-y-2">
            {HERO_STYLES.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.heroStyle === opt.key}
                onClick={() => patchAppearance('heroStyle', opt.key)}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
          <Field label="Libellé CTA" htmlFor="heroCtaLabel">
            <Input
              id="heroCtaLabel"
              className="h-9"
              value={form.appearance.heroCtaLabel}
              onChange={(e) => patchAppearance('heroCtaLabel', e.target.value)}
            />
          </Field>
          <ToggleRow
            id="heroShowBenefits"
            label="Bande bénéfices"
            checked={form.appearance.heroShowBenefits}
            onCheckedChange={(v) => patchAppearance('heroShowBenefits', v)}
          />
        </div>
      );

    case 'backgrounds':
      return (
        <div className="space-y-4">
          <Hint>« Auto » utilise la couleur du thème actif.</Hint>
          <GroupTitle>Fonds</GroupTitle>
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
          <GroupTitle>Textes</GroupTitle>
          <ColorControl
            label="Texte header"
            value={form.appearance.headerTextColor}
            fallback="#ffffff"
            allowAuto
            onChange={(v) => patchAppearance('headerTextColor', v)}
          />
          <ColorControl
            label="Texte footer"
            value={form.appearance.footerTextColor}
            fallback="#ffffff"
            allowAuto
            onChange={(v) => patchAppearance('footerTextColor', v)}
          />
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
          {megaMenuEnabled ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-amber-950">
              Mega menu actif : il remplace cette navigation. Éditez dans{' '}
              <Link to="/admin/sections" className="font-medium underline">
                Navigation → Menus
              </Link>
              .
            </div>
          ) : null}
          <GroupTitle>Éléments</GroupTitle>
          <div className="space-y-1.5">
            {(
              [
                ['headerShowLogo', 'Logo'],
                ['headerShowNav', 'Navigation'],
                ['headerShowSearch', 'Recherche'],
                ['headerShowWishlist', 'Favoris'],
                ['headerShowCart', 'Panier'],
              ] as const
            ).map(([key, label]) => (
              <ToggleRow
                key={key}
                id={key}
                label={label}
                checked={form.appearance[key]}
                onCheckedChange={(v) => patchAppearance(key, v)}
              />
            ))}
          </div>

          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between gap-2">
              <GroupTitle>Bandeaux promo</GroupTitle>
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
                      <span>{msg.isActive ? 'Actif' : 'Inactif'}</span>
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
              label="Bandeau fixe de secours (Apparence)"
              checked={form.appearance.headerPromoEnabled}
              onCheckedChange={(v) => patchAppearance('headerPromoEnabled', v)}
            />
            {form.appearance.headerPromoEnabled ? (
              <div className="space-y-2">
                <Field label="Texte de secours" htmlFor="headerPromoText">
                  <Input
                    id="headerPromoText"
                    className="h-9"
                    value={form.appearance.headerPromoText}
                    onChange={(e) => patchAppearance('headerPromoText', e.target.value)}
                  />
                </Field>
                <ColorControl
                  label="Fond (secours)"
                  value={form.appearance.headerPromoBgColor}
                  fallback={form.primaryColor || '#0d9488'}
                  allowAuto
                  onChange={(v) => patchAppearance('headerPromoBgColor', v)}
                />
                <ColorControl
                  label="Texte (secours)"
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
                <GroupTitle>Boutons système</GroupTitle>
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
                    <Field label="Texte" htmlFor={item.labelKey}>
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
                    <Field label="Destination" htmlFor={`${item.hrefKey}-page`}>
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
                    <Field label="Lien manuel" htmlFor={item.hrefKey}>
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

              <GroupTitle>Pages personnalisées</GroupTitle>
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
          <Hint>Blocs visibles et structure du pied de page.</Hint>
          <div className="space-y-1.5">
            {(
              [
                ['footerShowBrand', 'Brand'],
                ['footerShowNewsletter', 'Newsletter'],
                ['footerShowSocials', 'Réseaux'],
              ] as const
            ).map(([key, label]) => (
              <ToggleRow
                key={key}
                id={key}
                label={label}
                checked={form.appearance[key]}
                onCheckedChange={(v) => patchAppearance(key, v)}
              />
            ))}
          </div>
          <GroupTitle>Disposition</GroupTitle>
          <div className="space-y-2">
            {FOOTER_LAYOUTS.map((opt) => (
              <OptionTile
                key={opt.key}
                selected={form.appearance.footerLayout === opt.key}
                onClick={() => patchAppearance('footerLayout', opt.key)}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground">{opt.description}</p>
              </OptionTile>
            ))}
          </div>
        </div>
      );

    case 'identity':
      return (
        <div className="space-y-4">
          <Hint>Nom, logo, favicon et couleurs de marque.</Hint>
          <Field label="Nom du site" htmlFor="siteName">
            <Input
              id="siteName"
              className="h-9"
              value={form.siteName}
              onChange={(e) => patch('siteName', e.target.value)}
            />
          </Field>
          <Field label="Accroche" htmlFor="tagline">
            <Input
              id="tagline"
              className="h-9"
              value={form.tagline}
              onChange={(e) => patch('tagline', e.target.value)}
            />
          </Field>
          <Field label="À propos" htmlFor="aboutText">
            <Textarea
              id="aboutText"
              className="min-h-[88px] text-sm"
              value={form.aboutText}
              onChange={(e) => patch('aboutText', e.target.value)}
            />
          </Field>

          <GroupTitle>Logo</GroupTitle>
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

          <GroupTitle>Favicon</GroupTitle>
          <Hint>Icône de l’onglet du navigateur (.png, .ico, .svg — idéal 32×32 ou 64×64).</Hint>
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

          <GroupTitle>Couleurs</GroupTitle>
          <ColorControl
            label="Primaire"
            value={form.primaryColor}
            fallback="#0d9488"
            onChange={(v) => patch('primaryColor', v)}
          />
          <ColorControl
            label="Secondaire"
            value={form.secondaryColor}
            fallback="#0a1628"
            onChange={(v) => patch('secondaryColor', v)}
          />
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
              <Hint>Afficher ou masquer les blocs d’accueil classiques.</Hint>
              <div className="space-y-1.5">
                {(
                  [
                    ['heroEnabled', 'Hero'] as const,
                    ['categoriesEnabled', 'Catégories'] as const,
                    ['surMesureEnabled', 'Sur mesure'] as const,
                  ] as const
                ).map(([key, label]) => (
                  <ToggleRow
                    key={key}
                    id={key}
                    label={`Afficher « ${label} »`}
                    checked={form[key]}
                    onCheckedChange={(checked) => patch(key, checked)}
                  />
                ))}
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
