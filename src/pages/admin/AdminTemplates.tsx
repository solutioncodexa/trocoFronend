import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { OnboardingStepper } from '@/components/admin/onboarding/OnboardingStepper';
import { PageWireframe } from '@/components/admin/onboarding/PageWireframe';
import { StyleSpecimen } from '@/components/admin/onboarding/StyleSpecimen';
import { StoreAppearanceLivePreview } from '@/components/admin/StoreAppearanceLivePreview';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { useTenant } from '@/contexts/TenantContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import { paletteFromFile, type Palette } from '@/config/paletteFromImage';
import { PAGE_TEMPLATES } from '@/config/pageTemplates';
import { isThemeAllowed } from '@/config/planGates';
import {
  FOOTER_LAYOUT_LABELS,
  TEMPLATES_COPY,
  getSiteTemplate,
  resolveVariant,
  sortTemplatesForSector,
  type SiteTemplate,
} from '@/config/siteTemplates';
import { FOOTER_LAYOUT_KEYS, normalizeAppearance, type FooterLayoutKey } from '@/config/storeAppearance';
import { getStylePreset, styleAppearanceOverride } from '@/config/stylePresets';
import { platformApi } from '@/services/api/platform';
import { uploadImage } from '@/services/api/upload';
import { buildTemplateMock } from '@/demo/templateMock';
import { readOnboardingDraft, writeOnboardingDraft } from '@/utils/onboardingSession';
import { toastError } from '@/utils/toastMessages';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const ONBOARDING_PATH = '/admin/onboarding';
const WIZARD_STEPS = ['ob.step.style', 'ob.step.contact', 'ob.step.catalog', 'ob.step.publish'] as const satisfies readonly AdminMessageKey[];

const AdminTemplates = () => {
  const { t, locale } = useAdminLocale();
  const c = TEMPLATES_COPY[locale];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { store, refresh, loadFromAdminSession } = useTenant();
  const draft = useRef(readOnboardingDraft()).current;

  const [templateKey, setTemplateKey] = useState<string>(draft?.template ?? '');
  const [variantKey, setVariantKey] = useState<string>('');
  const [paletteKey, setPaletteKey] = useState<string>('');
  const [custom, setCustom] = useState<{ primary: string; secondary: string } | null>(null);
  const [siteName, setSiteName] = useState(draft?.siteName ?? '');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPalette, setLogoPalette] = useState<Palette | null>(null);
  const [pages, setPages] = useState<string[]>(draft?.extraPages ?? []);
  const [publishHome, setPublishHome] = useState(draft?.publishHome ?? true);
  const [footerLayout, setFooterLayout] = useState<FooterLayoutKey>('default');
  const [footerNewsletter, setFooterNewsletter] = useState(false);
  const [footerSocials, setFooterSocials] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const template = getSiteTemplate(templateKey);
  const baseStyle = getStylePreset(template?.styleKey);
  const resolved = template ? resolveVariant(template, variantKey) : undefined;
  // Style effectif : celui du modèle, avec les polices, arrondis et agencement de la variante.
  const preset = useMemo(
    () => (baseStyle && resolved ? { ...baseStyle, ...resolved.variant.style } : baseStyle),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templateKey, variantKey],
  );
  const palettes = resolved?.palettes ?? [];
  const palette = palettes.find((p) => p.key === paletteKey) ?? palettes[0];
  const primary = custom?.primary ?? palette?.primary ?? preset?.primaryColor ?? '#0F766E';
  const secondary = custom?.secondary ?? palette?.secondary ?? preset?.secondaryColor ?? '#0369A1';
  const ordered = useMemo(() => sortTemplatesForSector(draft?.sector), [draft?.sector]);

  const { data: settings } = useQuery({
    queryKey: ['store-settings', 'me'],
    queryFn: () => platformApi.getMyStoreSettings(),
  });
  // Données d'exemple du secteur du modèle : la boutique est déjà pleine, même sans produit.
  const mock = useMemo(
    () => buildTemplateMock(template?.sector ?? 'general', preset?.themeKey ?? 'classic', locale),
    [template?.sector, preset?.themeKey, locale],
  );

  const appearance = useMemo(
    () =>
      normalizeAppearance({
        ...(settings?.appearance ?? {}),
        ...(preset ? styleAppearanceOverride(preset) : {}),
        footerLayout,
        footerShowNewsletter: footerNewsletter,
        footerShowSocials: footerSocials,
      }),
    [settings?.appearance, preset, footerLayout, footerNewsletter, footerSocials],
  );

  /** Une variante est réservée (couronne) quand son thème dépasse le plan de la boutique. */
  const isLocked = (tpl: SiteTemplate, variant: SiteTemplate['variants'][number]) => {
    const base = getStylePreset(tpl.styleKey);
    return !!base && !isThemeAllowed(store?.planCode, variant.style.themeKey ?? base.themeKey);
  };

  const pick = (tpl: SiteTemplate, variant = tpl.variants[0]) => {
    const base = getStylePreset(tpl.styleKey);
    if (!base) return;
    if (isLocked(tpl, variant)) {
      toast.message(t('ob.planLocked.style', { name: tpl.name[locale] }));
      return;
    }
    setTemplateKey(tpl.key);
    setVariantKey(variant.key);
    setPaletteKey((variant.palettes ?? tpl.palettes)[0].key);
    setCustom(null);
    setPages(tpl.pages);
    setPublishHome(true);
    setFooterLayout(tpl.footer.layout);
    setFooterNewsletter(tpl.footer.newsletter);
    setFooterSocials(tpl.footer.socials);
    setDialogOpen(true);
  };

  const uploadLogo = async (file: File) => {
    void paletteFromFile(file)
      .then(setLogoPalette)
      .catch(() => setLogoPalette(null));
    return uploadImage(file);
  };

  const apply = useMutation({
    mutationFn: async () => {
      if (!template || !preset) return;
      await platformApi.updateMyStoreSettings({
        siteName: siteName.trim() || settings?.siteName,
        logoUrl: logoUrl || undefined,
        themeKey: preset.themeKey,
        fontPair: preset.fontPair,
        radiusPreset: preset.radiusPreset,
        primaryColor: primary,
        secondaryColor: secondary,
        appearance,
      });
      // L'assistant reprend ces choix : style déjà appliqué, pages cochées, secteur du modèle.
      writeOnboardingDraft({
        ...(draft ?? { step: 0 }),
        step: 0,
        themeKey: preset.themeKey,
        fontPair: preset.fontPair,
        radiusPreset: preset.radiusPreset,
        primaryColor: primary,
        secondaryColor: secondary,
        siteName: siteName.trim() || draft?.siteName,
        sector: draft?.sector || template.sector,
        style: template.styleKey,
        look: preset.lookKey,
        publishHome,
        template: template.key,
        extraPages: pages,
        homeTemplate: template.homeKey,
      });
    },
    onSuccess: async () => {
      await refresh();
      await loadFromAdminSession();
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      navigate(ONBOARDING_PATH);
    },
    onError: (e) => toastError(e, c.applyError),
  });

  const extraTemplates = PAGE_TEMPLATES.filter((p) => !p.meta.isHome);
  const homeTemplate = PAGE_TEMPLATES.find((p) => p.key === template?.homeKey);

  const preview = (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="max-h-[55vh] overflow-auto">
        <StoreAppearanceLivePreview
          catalogProducts={mock.products}
          catalogCategories={mock.categories}
          heroImageUrl={mock.heroImageUrl}
          siteName={siteName || template?.name[locale] || t('ob.myStore')}
          tagline={mock.tagline}
          logoUrl={logoUrl || undefined}
          primaryColor={primary}
          secondaryColor={secondary}
          fontPair={preset?.fontPair ?? 'display_sans'}
          radiusPreset={preset?.radiusPreset ?? 'soft'}
          appearance={appearance}
          themeKey={preset?.themeKey ?? 'classic'}
          contactEmail=""
          contactPhone=""
          contactWhatsapp=""
          contactCity=""
        />
      </div>
    </div>
  );

  return (
    <AdminLayout
      title={c.title}
      description={c.subtitle}
      breadcrumbs={[{ label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' }, { label: c.crumb }]}
      wide
    >
      <div className="mx-auto max-w-6xl">
        <div className="space-y-8">
          {/* Première étape de l'assistant de création. */}
          <OnboardingStepper
            labels={[c.step, ...WIZARD_STEPS.map((label) => t(label))]}
            current={0}
            ariaLabel={t('ob.stepsNav')}
            counter={t('ob.stepCounter', { n: 1, total: WIZARD_STEPS.length + 1, min: WIZARD_STEPS.length + 1 })}
            onSelect={(i) => navigate(i <= 1 ? ONBOARDING_PATH : `${ONBOARDING_PATH}?step=${i - 1}`)}
          />
          <div role="group" aria-label={c.title} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ordered.map((tpl) => {
              const base = getStylePreset(tpl.styleKey);
              if (!base) return null;
              const selected = tpl.key === templateKey;
              // La carte montre la variante choisie ; sinon la première.
              const shown = (selected && tpl.variants.find((x) => x.key === variantKey)) || tpl.variants[0];
                            const shownPalette = shown.palettes ?? tpl.palettes;
              const colors = selected ? { primary, secondary } : { primary: shownPalette[0].primary, secondary: shownPalette[0].secondary };
              const locked = isLocked(tpl, shown);
              return (
                <div
                  key={tpl.key}
                  className={`rounded-2xl border p-3 transition ${
                    selected ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => pick(tpl, shown)}
                    className={`block w-full rounded-lg text-start ${FOCUS_RING}`}
                  >
                    <span className="relative block">
                      <StyleSpecimen preset={base} layout={shown.layout} tweak={shown.style} label={tpl.name[locale]} primary={colors.primary} secondary={colors.secondary} />
                      {locked ? <CrownBadge label={t('ob.planLocked.style', { name: tpl.name[locale] })} /> : null}
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-1.5">
                      {selected ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                      <span className="font-display text-base font-semibold">{tpl.name[locale]}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{tpl.description[locale]}</span>
                  </button>
                  <div role="group" aria-label={c.variants} className="mt-3 grid grid-cols-3 gap-2">
                    {tpl.variants.map((variant) => {
                      const on = selected && variant.key === shown.key;
                      const vp = (variant.palettes ?? tpl.palettes)[0];
                      const vLocked = isLocked(tpl, variant);
                      return (
                        <button
                          key={variant.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => pick(tpl, variant)}
                          className={`rounded-lg border p-1.5 text-start text-xs transition ${FOCUS_RING} ${
                            on ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <span className="relative block">
                            <StyleSpecimen
                              preset={base}
                              layout={variant.layout}
                              tweak={variant.style}
                              label={variant.name[locale]}
                              primary={on ? primary : vp.primary}
                              secondary={on ? secondary : vp.secondary}
                            />
                            {vLocked ? <CrownBadge small label={t('ob.planLocked.style', { name: variant.name[locale] })} /> : null}
                          </span>
                          <span className="mt-1.5 block truncate">{variant.name[locale]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {template ? (
            <section aria-labelledby="tpl-quick" className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 id="tpl-quick" className="font-display text-xl font-semibold">{c.quick}</h2>

              <div className="space-y-3">
                <Label>{c.colors}</Label>
                <div role="radiogroup" aria-label={c.colors} className="flex flex-wrap gap-2">
                  {palettes.map((p) => {
                    const on = !custom && p.key === (palette?.key ?? '');
                    return (
                      <button
                        key={p.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          setPaletteKey(p.key);
                          setCustom(null);
                        }}
                        className={`flex min-h-11 items-center gap-2 rounded-full border py-1.5 pe-3.5 ps-2 text-sm transition sm:min-h-9 ${FOCUS_RING} ${
                          on ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full"
                          style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)` }}
                        >
                          {on ? <Check className="h-3.5 w-3.5 text-white drop-shadow" aria-hidden /> : null}
                        </span>
                        {p.name[locale]}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                  <div>
                    <Label htmlFor="tpl-c1" className="text-xs">{c.colorPrimary}</Label>
                    <Input id="tpl-c1" type="color" className="mt-1 h-10" value={primary} onChange={(e) => setCustom({ primary: e.target.value, secondary })} />
                  </div>
                  <div>
                    <Label htmlFor="tpl-c2" className="text-xs">{c.colorSecondary}</Label>
                    <Input id="tpl-c2" type="color" className="mt-1 h-10" value={secondary} onChange={(e) => setCustom({ primary, secondary: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="tpl-name">{c.storeName}</Label>
                  <Input id="tpl-name" className="mt-1.5" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">{c.logo}</Label>
                  <ImageUpload value={logoUrl} onChange={setLogoUrl} onUpload={uploadLogo} />
                  {logoPalette && logoUrl ? (
                    <div role="status" className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <span
                        className="h-8 w-12 shrink-0 rounded-md border border-border"
                        style={{ background: `linear-gradient(135deg, ${logoPalette.primary} 50%, ${logoPalette.secondary} 50%)` }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 text-sm">{c.logoColors}</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setCustom({ primary: logoPalette.primary, secondary: logoPalette.secondary });
                          setLogoPalette(null);
                        }}
                      >
                        {c.useLogoColors}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>{c.pages}</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.pagesHint}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {homeTemplate ? (
                    <PageChoice
                      checked={publishHome}
                      onChange={setPublishHome}
                      blocks={homeTemplate.blocks}
                      title={t(`ob.tpl.${homeTemplate.key}` as AdminMessageKey)}
                      desc={t(`ob.tpl.${homeTemplate.key}.desc` as AdminMessageKey)}
                    />
                  ) : null}
                  {extraTemplates.map((tpl) => (
                    <PageChoice
                      key={tpl.key}
                      checked={pages.includes(tpl.key)}
                      onChange={(on) => setPages((prev) => (on ? [...prev, tpl.key] : prev.filter((k) => k !== tpl.key)))}
                      blocks={tpl.blocks}
                      title={t(`ob.tpl.${tpl.key}` as AdminMessageKey)}
                      desc={t(`ob.tpl.${tpl.key}.desc` as AdminMessageKey)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>{c.footer}</Label>
                <div role="radiogroup" aria-label={c.footer} className="flex flex-wrap gap-2">
                  {FOOTER_LAYOUT_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={footerLayout === key}
                      onClick={() => setFooterLayout(key)}
                      className={`min-h-11 rounded-full border px-3.5 text-sm transition sm:min-h-9 ${FOCUS_RING} ${
                        footerLayout === key ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {FOOTER_LAYOUT_LABELS[key][locale]}
                    </button>
                  ))}
                </div>
                <label className="flex min-h-11 items-center gap-3 text-sm sm:min-h-0">
                  <input type="checkbox" className="h-5 w-5 accent-primary" checked={footerNewsletter} onChange={(e) => setFooterNewsletter(e.target.checked)} />
                  {c.footerNewsletter}
                </label>
                <label className="flex min-h-11 items-center gap-3 text-sm sm:min-h-0">
                  <input type="checkbox" className="h-5 w-5 accent-primary" checked={footerSocials} onChange={(e) => setFooterSocials(e.target.checked)} />
                  {c.footerSocials}
                </label>
              </div>
            </section>
          ) : null}

          <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/95 py-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
            <Button type="button" variant="ghost" className="h-11 lg:h-10" disabled={apply.isPending} onClick={() => navigate(ONBOARDING_PATH)}>
              {c.skip}
            </Button>
            <Button type="button" className="h-11 gap-2 lg:h-10" disabled={!template || apply.isPending} onClick={() => apply.mutate()}>
              {apply.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {c.apply} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen && !!template} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {template?.name[locale]}
              {resolved ? ` · ${resolved.variant.name[locale]}` : ''}
            </DialogTitle>
            <DialogDescription>{template?.description[locale]}</DialogDescription>
          </DialogHeader>
          <div role="radiogroup" aria-label={c.colors} className="flex flex-wrap gap-2">
            {palettes.map((p) => {
              const on = !custom && p.key === (palette?.key ?? '');
              return (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setPaletteKey(p.key);
                    setCustom(null);
                  }}
                  className={`flex min-h-11 items-center gap-2 rounded-full border py-1.5 pe-3.5 ps-2 text-sm transition sm:min-h-9 ${FOCUS_RING} ${
                    on ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)` }}
                  >
                    {on ? <Check className="h-3.5 w-3.5 text-white drop-shadow" aria-hidden /> : null}
                  </span>
                  {p.name[locale]}
                </button>
              );
            })}
          </div>
          {preview}
          <p className="text-xs text-muted-foreground">{c.mockNote}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.close')}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setDialogOpen(false);
                requestAnimationFrame(() => document.getElementById('tpl-quick')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
              }}
            >
              {c.pick}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

/** Couronne premium : la variante demande un plan supérieur. */
function CrownBadge({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`absolute end-1.5 top-1.5 flex items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-sm ring-1 ring-black/10 ${
        small ? 'h-5 w-5' : 'h-7 w-7'
      }`}
    >
      <Crown className={small ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden />
    </span>
  );
}

function PageChoice({
  checked,
  onChange,
  blocks,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (on: boolean) => void;
  blocks: Parameters<typeof PageWireframe>[0]['blocks'];
  title: string;
  desc: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 ${
        checked ? 'border-primary bg-primary/5 ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
      }`}
    >
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <PageWireframe blocks={blocks} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
        }`}
      >
        {checked ? <Check className="h-3 w-3" /> : null}
      </span>
    </label>
  );
}

export default AdminTemplates;
