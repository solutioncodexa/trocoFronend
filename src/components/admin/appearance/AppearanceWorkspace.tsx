import { useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ExternalLink,
  Loader2,
  Monitor,
  PanelLeft,
  PanelRight,
  Palette,
  Save,
  Smartphone,
  Tablet,
} from 'lucide-react';
import {
  AppearanceSectionEditors,
  type AppearanceFormSlice,
  type AppearanceSectionEditorsProps,
} from '@/components/admin/appearance/AppearanceSectionEditors';
import {
  APPEARANCE_OUTLINE,
  isPreviewHotspotSection,
  type AppearanceSectionId,
} from '@/components/admin/appearance/appearanceSections';
import { StoreAppearanceLivePreview } from '@/components/admin/StoreAppearanceLivePreview';
import { Button } from '@/components/ui/button';
import type { StoreAppearance } from '@/config/storeAppearance';
import type { StoreThemeKey } from '@/config/storeThemes';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { cn } from '@/lib/utils';

type Device = 'desktop' | 'tablet' | 'mobile';

type Props = {
  form: AppearanceFormSlice;
  patch: AppearanceSectionEditorsProps['patch'];
  patchAppearance: <K extends keyof StoreAppearance>(key: K, value: StoreAppearance[K]) => void;
  applyThemeNow: (themeKey: StoreThemeKey) => void;
  themePresets?: Record<string, unknown> | null;
  megaMenuEnabled: boolean;
  pageLinkOptions: AppearanceSectionEditorsProps['pageLinkOptions'];
  customHeaderPages: AppearanceSectionEditorsProps['customHeaderPages'];
  onTogglePageInNav: AppearanceSectionEditorsProps['onTogglePageInNav'];
  togglePagePending?: boolean;
  uploadingLogo: boolean;
  onLogoUpload: (file: File | null) => void;
  logoInputRef: RefObject<HTMLInputElement | null>;
  uploadingFavicon: boolean;
  onFaviconUpload: (file: File | null) => void;
  faviconInputRef: RefObject<HTMLInputElement | null>;
  publishedHomePage?: { id: number; title: string } | null;
  storefrontHref?: string | null;
  onSave: () => void;
  saving: boolean;
};

export function AppearanceWorkspace({
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
  storefrontHref,
  onSave,
  saving,
}: Props) {
  const [activeSection, setActiveSection] = useState<AppearanceSectionId>('themes');
  const [showOutline, setShowOutline] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [device, setDevice] = useState<Device>('desktop');

  const { data: topBarMessages = [] } = useQuery({
    queryKey: ['top-bar-messages'],
    queryFn: () => topBarMessagesApi.getAllMessages(),
  });
  const activeTopBarMessages = topBarMessages.filter((m) => m.isActive);

  const selectSection = (section: AppearanceSectionId) => {
    setActiveSection(section);
    setShowEditor(true);
  };

  const deviceMax =
    device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[960px]';

  const activeLabel =
    APPEARANCE_OUTLINE.find((s) => s.id === activeSection)?.label ?? 'Section';

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[hsl(222_14%_92%)]">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-white px-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-2">
          <Palette className="h-4 w-4 shrink-0 text-sky-600" />
          <p className="truncate text-sm font-semibold">Apparence</p>
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <div className="hidden items-center gap-0.5 rounded-lg border border-border p-0.5 md:flex">
            <Button
              type="button"
              size="icon"
              variant={showOutline ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setShowOutline((v) => !v)}
              title={showOutline ? 'Masquer les sections' : 'Afficher les sections'}
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={showEditor ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setShowEditor((v) => !v)}
              title={showEditor ? 'Masquer l’éditeur' : 'Afficher l’éditeur'}
            >
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <Button
              type="button"
              size="sm"
              variant={device === 'desktop' ? 'default' : 'ghost'}
              className="h-8 px-2"
              onClick={() => setDevice('desktop')}
              title="Bureau"
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={device === 'tablet' ? 'default' : 'ghost'}
              className="h-8 px-2"
              onClick={() => setDevice('tablet')}
              title="Tablette"
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={device === 'mobile' ? 'default' : 'ghost'}
              className="h-8 px-2"
              onClick={() => setDevice('mobile')}
              title="Mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>

          {storefrontHref ? (
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" asChild>
              <a href={storefrontHref} target="troco-storefront" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Voir boutique</span>
              </a>
            </Button>
          ) : null}

          <Button type="button" size="sm" asChild variant="outline" className="h-8 hidden sm:inline-flex">
            <Link to="/admin/reglages">Paramètres</Link>
          </Button>

          <Button className="h-8 gap-1.5" disabled={saving} onClick={onSave}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">Enregistrer</span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={cn(
            'w-[240px] shrink-0 flex-col border-r border-border/80 bg-white',
            showOutline ? 'hidden md:flex' : 'hidden',
          )}
        >
          <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground">Sections</p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setShowOutline(false)}
              title="Masquer"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2.5 scrollbar-app">
            <p className="mb-2 px-0.5 text-[11px] text-muted-foreground">
              Cliquez une section ou une zone de l’aperçu
            </p>
            {APPEARANCE_OUTLINE.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSection(item.id)}
                className={cn(
                  'flex w-full items-center rounded-lg border px-2.5 py-2 text-left text-xs transition',
                  activeSection === item.id
                    ? 'border-sky-500 bg-sky-50 font-semibold text-sky-900'
                    : 'border-border/70 hover:border-sky-300',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section
          className="relative min-w-0 flex-1 overflow-auto"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(220 12% 76%) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        >
          <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/50 bg-white/90 px-3 py-1.5 text-[11px] backdrop-blur">
            <span className="font-medium text-muted-foreground">
              Aperçu live — cliquez une zone pour éditer
            </span>
            <div className="flex items-center gap-2">
              {!showOutline ? (
                <button
                  type="button"
                  className="hidden rounded-md border border-border bg-white px-2 py-0.5 font-medium text-sky-700 hover:bg-sky-50 md:inline-flex"
                  onClick={() => setShowOutline(true)}
                >
                  Afficher sections
                </button>
              ) : null}
              {!showEditor ? (
                <button
                  type="button"
                  className="hidden rounded-md border border-border bg-white px-2 py-0.5 font-medium text-sky-700 hover:bg-sky-50 lg:inline-flex"
                  onClick={() => setShowEditor(true)}
                >
                  Afficher éditeur
                </button>
              ) : null}
              <span className="tabular-nums text-muted-foreground">
                {device === 'desktop' ? 'Bureau' : device === 'tablet' ? 'Tablette' : 'Mobile'}
              </span>
            </div>
          </div>

          <div className="sticky top-8 z-30 flex gap-2 overflow-x-auto border-b border-border/60 bg-white/95 p-2 backdrop-blur md:hidden">
            {APPEARANCE_OUTLINE.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSection(item.id)}
                className={cn(
                  'shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium',
                  activeSection === item.id
                    ? 'border-sky-500 bg-sky-50 text-sky-900'
                    : 'border-border bg-white',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center px-3 py-6">
            <div className={cn('w-full origin-top', deviceMax)}>
              <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-lg shadow-black/10">
                <StoreAppearanceLivePreview
                  siteName={form.siteName}
                  tagline={form.tagline}
                  logoUrl={form.logoUrl}
                  primaryColor={form.primaryColor}
                  secondaryColor={form.secondaryColor}
                  fontPair={form.fontPair}
                  radiusPreset={form.radiusPreset}
                  appearance={form.appearance}
                  topBarMessages={activeTopBarMessages}
                  customNavPages={customHeaderPages
                    .filter((p) => p.showInNav)
                    .map((p) => ({
                      title: p.title || p.slug,
                      href: `/page/${p.slug}`,
                    }))}
                  onSelectSection={(section) => selectSection(section)}
                  activeSection={
                    isPreviewHotspotSection(activeSection) ? activeSection : null
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <aside
          className={cn(
            'w-[320px] shrink-0 flex-col border-l border-border/80 bg-white',
            showEditor ? 'hidden lg:flex' : 'hidden',
          )}
        >
          <div className="flex items-start justify-between gap-2 border-b border-border/70 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Propriétés
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold">{activeLabel}</p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={() => setShowEditor(false)}
              title="Masquer"
            >
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 scrollbar-app">
            <AppearanceSectionEditors
              section={activeSection}
              form={form}
              patch={patch}
              patchAppearance={patchAppearance}
              applyThemeNow={applyThemeNow}
              themePresets={themePresets}
              megaMenuEnabled={megaMenuEnabled}
              pageLinkOptions={pageLinkOptions}
              customHeaderPages={customHeaderPages}
              onTogglePageInNav={onTogglePageInNav}
              togglePagePending={togglePagePending}
              uploadingLogo={uploadingLogo}
              onLogoUpload={onLogoUpload}
              logoInputRef={logoInputRef}
              uploadingFavicon={uploadingFavicon}
              onFaviconUpload={onFaviconUpload}
              faviconInputRef={faviconInputRef}
              publishedHomePage={publishedHomePage}
              topBarMessages={topBarMessages}
            />
          </div>
        </aside>
        </div>

        {/* Éditeur mobile / tablette en bas */}
        {showEditor ? (
          <div className="flex max-h-[42vh] shrink-0 flex-col border-t border-border/80 bg-white lg:hidden">
            <div className="flex items-start justify-between gap-2 border-b border-border/70 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Propriétés
                </p>
                <p className="truncate text-sm font-semibold">{activeLabel}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7"
                onClick={() => setShowEditor(false)}
              >
                Fermer
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-app">
              <AppearanceSectionEditors
                section={activeSection}
                form={form}
                patch={patch}
                patchAppearance={patchAppearance}
                applyThemeNow={applyThemeNow}
                themePresets={themePresets}
                megaMenuEnabled={megaMenuEnabled}
                pageLinkOptions={pageLinkOptions}
                customHeaderPages={customHeaderPages}
                onTogglePageInNav={onTogglePageInNav}
                togglePagePending={togglePagePending}
                uploadingLogo={uploadingLogo}
                onLogoUpload={onLogoUpload}
                logoInputRef={logoInputRef}
                uploadingFavicon={uploadingFavicon}
                onFaviconUpload={onFaviconUpload}
                faviconInputRef={faviconInputRef}
                publishedHomePage={publishedHomePage}
                topBarMessages={topBarMessages}
              />
            </div>
          </div>
        ) : (
          <div className="shrink-0 border-t border-border/80 bg-white p-2 lg:hidden">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setShowEditor(true)}
            >
              Éditer « {activeLabel} »
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
