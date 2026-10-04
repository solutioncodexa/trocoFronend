import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  MessageCircle,
  Package,
  Rocket,
  Sparkles,
  Trash2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { StoreAppearanceLivePreview } from '@/components/admin/StoreAppearanceLivePreview';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import { productsApi } from '@/services/api/products';
import { uploadImage } from '@/services/api/upload';
import { PAGE_TEMPLATES } from '@/config/pageTemplates';
import { STORE_THEMES, normalizeThemeKey, type StoreThemeKey } from '@/config/storeThemes';
import { FONT_PAIRS, RADIUS_PRESETS } from '@/config/storefrontTheme';
import { normalizeAppearance, type StoreAppearance } from '@/config/storeAppearance';
import {
  STYLE_FOR_SECTOR,
  STYLE_PRESETS,
  getStylePreset,
  styleAppearanceOverride,
} from '@/config/stylePresets';
import { useTenant } from '@/contexts/TenantContext';
import { PlanLockBadge } from '@/components/admin/PlanLockBadge';
import { isThemeAllowed, themeMinPlan } from '@/config/planGates';
import {
  DEFAULT_STARTER_PACK_KEY,
  STARTER_PACKS,
  getStarterPack,
} from '@/config/starterPacks';
import { applyStarterPack, listDemoProducts, removeDemoProducts } from '@/utils/starterPack';
import { createLegalPages } from '@/utils/legalPages';
import { LEGAL_DISCLAIMER } from '@/config/legalPages';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import {
  clearOnboardingDraft,
  ONBOARDING_RETURN_QUERY,
  readOnboardingDraft,
  writeOnboardingDraft,
} from '@/utils/onboardingSession';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const STEPS = ['Style', 'Contact', 'Catalogue', 'Publication'] as const;
const LAST_STEP = STEPS.length - 1;

/** Palettes rapides : un clic remplace couleur principale + secondaire. */
const PALETTES: { label: string; primary: string; secondary: string }[] = [
  { label: 'Lagon', primary: '#0F766E', secondary: '#0369A1' },
  { label: 'Terre cuite', primary: '#B45309', secondary: '#78350F' },
  { label: 'Bordeaux', primary: '#9F1239', secondary: '#4C0519' },
  { label: 'Ardoise', primary: '#334155', secondary: '#0F172A' },
  { label: 'Olive', primary: '#4D7C0F', secondary: '#365314' },
  { label: 'Indigo', primary: '#4338CA', secondary: '#1E1B4B' },
];

function clampStep(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(LAST_STEP, Math.floor(value)));
}

const AdminOnboarding = () => {
  const { t } = useAdminLocale();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { store, refresh, loadFromAdminSession } = useTenant();

  const draft = useRef(readOnboardingDraft()).current;
  const initialStep = clampStep(Number(searchParams.get('step') ?? draft?.step ?? 0));

  const [step, setStep] = useState(initialStep);
  const [published, setPublished] = useState(false);
  const [themeKey, setThemeKey] = useState<StoreThemeKey>(normalizeThemeKey(draft?.themeKey) || 'classic');
  const [fontPair, setFontPair] = useState(draft?.fontPair || 'display_sans');
  const [radiusPreset, setRadiusPreset] = useState(draft?.radiusPreset || 'soft');
  const [siteName, setSiteName] = useState(draft?.siteName || '');
  const [tagline, setTagline] = useState(draft?.tagline || '');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState(draft?.primaryColor || '');
  const [secondaryColor, setSecondaryColor] = useState(draft?.secondaryColor || '');
  const [sector, setSector] = useState(draft?.sector || '');
  const [styleKey, setStyleKey] = useState(draft?.style || '');
  // Agencement (grille, cartes, en-tête…) apporté par le style choisi ; null = on garde l'existant.
  const [appearanceOverride, setAppearanceOverride] = useState<Partial<StoreAppearance> | null>(() => {
    const preset = getStylePreset(draft?.style);
    return preset ? styleAppearanceOverride(preset) : null;
  });
  const [publishHome, setPublishHome] = useState(draft?.publishHome ?? true);
  const [createLegal, setCreateLegal] = useState(true);
  const [contact, setContact] = useState({ phone: '', whatsapp: '', city: '', email: '' });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings', 'me'],
    queryFn: () => platformApi.getMyStoreSettings(),
  });

  const { data: productPage } = useQuery({
    queryKey: ['products', 'onboarding-count'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 1 }),
    staleTime: 30_000,
  });
  const productCount = productPage?.totalElements ?? 0;

  const { data: demoProducts = [] } = useQuery({
    queryKey: ['products', 'onboarding-demo'],
    queryFn: () => listDemoProducts(),
    staleTime: 15_000,
  });

  // Préremplissage depuis les réglages existants (sans écraser ce que le marchand a déjà saisi).
  useEffect(() => {
    if (!settings) return;
    setSiteName((prev) => prev || settings.siteName || '');
    setTagline((prev) => prev || settings.tagline || '');
    setLogoUrl((prev) => prev || settings.logoUrl || '');
    setPrimaryColor((prev) => prev || settings.primaryColor || '#0F766E');
    setSecondaryColor((prev) => prev || settings.secondaryColor || '#0369A1');
    if (!draft?.themeKey) setThemeKey(normalizeThemeKey(settings.themeKey));
    if (!draft?.fontPair && settings.fontPair) setFontPair(settings.fontPair);
    if (!draft?.radiusPreset && settings.radiusPreset) setRadiusPreset(settings.radiusPreset);
    setContact((prev) => ({
      phone: prev.phone || settings.contactPhone || '',
      whatsapp: prev.whatsapp || settings.contactWhatsapp || '',
      city: prev.city || settings.contactCity || '',
      email: prev.email || settings.contactEmail || '',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // Synchronise l'étape avec l'URL (retour après création d'un produit, liens du tableau de bord).
  useEffect(() => {
    const fromUrl = searchParams.get('step');
    if (fromUrl == null) return;
    setStep(clampStep(Number(fromUrl)));
  }, [searchParams]);

  // Brouillon local : on retrouve son avancement après un rechargement.
  useEffect(() => {
    writeOnboardingDraft({
      step,
      themeKey,
      fontPair,
      radiusPreset,
      siteName,
      tagline,
      primaryColor,
      secondaryColor,
      publishHome,
      sector,
      style: styleKey,
    });
  }, [step, themeKey, fontPair, radiusPreset, siteName, tagline, primaryColor, secondaryColor, publishHome, sector, styleKey]);

  const pack = getStarterPack(sector || DEFAULT_STARTER_PACK_KEY);

  /** Applique un style complet : thème, couleurs, polices, arrondis et agencement. */
  const applyStyle = (key: string) => {
    const preset = getStylePreset(key);
    if (!preset) return;
    if (!isThemeAllowed(store?.planCode, preset.themeKey)) {
      toast.message(`Le style « ${preset.label} » demande un plan supérieur.`);
      return;
    }
    setStyleKey(preset.key);
    setThemeKey(preset.themeKey);
    setFontPair(preset.fontPair);
    setRadiusPreset(preset.radiusPreset);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setAppearanceOverride(styleAppearanceOverride(preset));
  };

  const syncStore = async () => {
    await refresh();
    await loadFromAdminSession();
    queryClient.invalidateQueries({ queryKey: ['store-settings'] });
  };

  const saveStyle = useMutation({
    mutationFn: () =>
      platformApi.updateMyStoreSettings({
        siteName: siteName.trim() || settings?.siteName,
        tagline: tagline.trim(),
        logoUrl: logoUrl || undefined,
        themeKey,
        fontPair,
        radiusPreset,
        primaryColor,
        secondaryColor,
        ...(appearanceOverride ? { appearance } : {}),
      }),
    onSuccess: syncStore,
    onError: (e) => toastError(e, 'Enregistrement impossible'),
  });

  const saveContact = useMutation({
    mutationFn: () =>
      platformApi.updateMyStoreSettings({
        contactPhone: contact.phone.trim() || undefined,
        contactWhatsapp: contact.whatsapp.trim() || undefined,
        contactCity: contact.city.trim() || undefined,
        contactEmail: contact.email.trim() || undefined,
      }),
    onSuccess: syncStore,
    onError: (e) => toastError(e, 'Enregistrement impossible'),
  });

  const createHome = useMutation({
    mutationFn: async () => {
      const tpl = PAGE_TEMPLATES.find((p) => p.key === 'home-complete');
      if (!tpl) throw new Error('Modèle introuvable');
      const existing = await storePagesApi.list();
      const home =
        existing.find((p) => p.isHome) ||
        existing.find((p) => (p.slug || '').toLowerCase() === 'accueil-boutique');
      if (home?.id) {
        await storePagesApi.update(home.id, {
          title: tpl.meta.title || home.title || 'Accueil boutique',
          slug: home.slug || tpl.meta.slug,
          isHome: true,
          showInNav: false,
          published: true,
        });
        await storePagesApi.replaceBlocks(home.id, tpl.blocks, 'Assistant de création');
        return;
      }
      const page = await storePagesApi.create({ ...tpl.meta, title: tpl.meta.title || 'Accueil boutique', published: true });
      await storePagesApi.replaceBlocks(page.id!, tpl.blocks, 'Assistant de création');
    },
    onError: (e) => toastError(e, 'Création de la page d’accueil impossible'),
  });

  const addLegal = useMutation({
    mutationFn: () =>
      createLegalPages({
        storeName: siteName || settings?.siteName || store?.siteName || '',
        contactEmail: contact.email || undefined,
        contactPhone: contact.phone || undefined,
        contactCity: contact.city || undefined,
      }),
    onError: (e) => toastError(e, 'Création des pages légales impossible'),
  });

  const refreshCatalog = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };

  const addDemo = useMutation({
    mutationFn: () => applyStarterPack(sector || DEFAULT_STARTER_PACK_KEY),
    onSuccess: (res) => {
      refreshCatalog();
      toast.success(
        res.productsCreated > 0
          ? `${res.productsCreated} produit(s) d’exemple ajouté(s)`
          : 'Les produits d’exemple sont déjà présents',
      );
    },
    onError: (e) => toastError(e, 'Ajout des produits d’exemple impossible'),
  });

  const clearDemo = useMutation({
    mutationFn: () => removeDemoProducts(),
    onSuccess: (count) => {
      refreshCatalog();
      toast.success(`${count} produit(s) d’exemple supprimé(s)`);
    },
    onError: (e) => toastError(e, 'Suppression impossible'),
  });

  const publish = useMutation({
    mutationFn: async () => {
      if (publishHome) await createHome.mutateAsync();
      if (createLegal) await addLegal.mutateAsync();
      // « Publier ma boutique » la rend aussi visible des clients.
      await platformApi.setStorefrontLive(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      clearOnboardingDraft();
      setPublished(true);
    },
  });

  const busy =
    saveStyle.isPending ||
    saveContact.isPending ||
    addDemo.isPending ||
    clearDemo.isPending ||
    publish.isPending;

  /** Enregistre l'étape courante avant de la quitter (changement d'étape ou publication). */
  const saveCurrent = async () => {
    if (step === 0) await saveStyle.mutateAsync();
    if (step === 1) await saveContact.mutateAsync();
  };

  const goToStep = (nextStep: number) => {
    const clamped = clampStep(nextStep);
    setStep(clamped);
    setSearchParams(clamped === 0 ? {} : { step: String(clamped) }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const go = async (nextStep: number) => {
    if (nextStep === step || busy) return;
    try {
      await saveCurrent();
      goToStep(nextStep);
    } catch {
      // toast déjà affiché par onError
    }
  };

  const openAddProduct = () => {
    navigate(`/admin/produits?action=new&${ONBOARDING_RETURN_QUERY}=1`);
  };

  const storefrontUrl = buildStorefrontUrl(store?.slug ?? settings?.slug);
  const pendingActivation = (settings?.status || store?.status || '').toUpperCase() === 'PENDING';

  const appearance = useMemo(
    () => normalizeAppearance({ ...(settings?.appearance ?? {}), ...(appearanceOverride ?? {}) }),
    [settings?.appearance, appearanceOverride],
  );

  const preview = (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <p className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Aperçu en direct
      </p>
      <div className="max-h-[70vh] overflow-auto">
        <StoreAppearanceLivePreview
          siteName={siteName || 'Ma boutique'}
          tagline={tagline}
          logoUrl={logoUrl || undefined}
          primaryColor={primaryColor || '#0F766E'}
          secondaryColor={secondaryColor || '#0369A1'}
          fontPair={fontPair}
          radiusPreset={radiusPreset}
          appearance={appearance}
          themeKey={themeKey}
          contactEmail={contact.email}
          contactPhone={contact.phone}
          contactWhatsapp={contact.whatsapp}
          contactCity={contact.city}
        />
      </div>
    </div>
  );

  const shareMessage = `Découvrez ${siteName || 'ma boutique'} : ${storefrontUrl}`;

  if (published) {
    return (
      <AdminLayout
        title={t('onboarding.title')}
        description={t('onboarding.description')}
        breadcrumbs={[{ label: 'Assistant' }]}
      >
        <div className="mx-auto max-w-2xl space-y-6 py-4 text-center">
          <Rocket className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h2 className="font-display text-2xl font-semibold">Votre boutique est en ligne !</h2>
          <p className="text-sm text-muted-foreground">
            {pendingActivation
              ? 'Elle sera visible publiquement dès son activation par Get STORE. Vous pouvez déjà prévisualiser votre vitrine.'
              : 'Partagez-la dès maintenant avec vos premiers clients.'}
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-left">
            <span className="min-w-0 flex-1 truncate font-mono text-sm">{storefrontUrl}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(storefrontUrl)
                  .then(() => toast.success('Lien copié'))
                  .catch(() => toast.error('Copie impossible'));
              }}
            >
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="gap-2">
              <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Voir ma boutique
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Partager sur WhatsApp
              </a>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-left">
            <p className="font-display text-sm font-semibold">Pour aller plus loin</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-primary hover:underline" to="/admin/produits?action=new">
                  Ajouter vos vrais produits avec photos
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/top-bar-messages">
                  Ajouter un bandeau promo (livraison gratuite, offre…)
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/sections">
                  Personnaliser le menu et le pied de page
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/pages">
                  Modifier vos pages avec le constructeur
                </Link>
              </li>
            </ul>
          </div>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            Aller au tableau de bord
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={t('onboarding.title')}
      description={t('onboarding.description')}
      breadcrumbs={[
        { label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' },
        { label: 'Assistant' },
      ]}
      wide
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <nav aria-label="Étapes" className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => void go(i)}
              aria-current={i === step ? 'step' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                i === step
                  ? 'bg-primary text-primary-foreground'
                  : i < step
                    ? 'bg-primary/15 text-primary hover:bg-primary/25'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </nav>

        {pendingActivation ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950">
            Votre boutique est <strong>prête côté design</strong> mais reste{' '}
            <strong>en attente d’activation Get STORE</strong> avant d’être visible publiquement.
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className={step <= 1 ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]' : ''}>
            <div className="space-y-6">
              {step === 0 ? (
                <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold">Le style de votre boutique</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tout est modifiable plus tard. L’aperçu se met à jour en direct.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="ob-name">Nom de la boutique</Label>
                      <Input id="ob-name" className="mt-1.5" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="ob-tagline">Accroche</Label>
                      <Input
                        id="ob-tagline"
                        className="mt-1.5"
                        value={tagline}
                        placeholder="Ex. L’artisanat marocain livré chez vous"
                        onChange={(e) => setTagline(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="mb-1.5 flex items-center gap-1.5">
                        <ImagePlus className="h-3.5 w-3.5" /> Logo (optionnel)
                      </Label>
                      <ImageUpload value={logoUrl} onChange={setLogoUrl} onUpload={uploadImage} />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Votre activité</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {STARTER_PACKS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          aria-pressed={sector === p.key}
                          onClick={() => {
                            setSector(p.key);
                            if (!styleKey) {
                              const suggested = STYLE_FOR_SECTOR[p.key] ?? 'classique';
                              const sp = getStylePreset(suggested);
                              applyStyle(sp && isThemeAllowed(store?.planCode, sp.themeKey) ? suggested : 'classique');
                            } else if (isThemeAllowed(store?.planCode, p.suggestedTheme)) setThemeKey(p.suggestedTheme);
                          }}
                          className={`rounded-xl border p-3 text-left text-xs transition ${
                            sector === p.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <span className="block text-sm font-semibold">{p.label}</span>
                          <span className="mt-0.5 block text-muted-foreground">{p.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Style de la boutique</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {STYLE_PRESETS.map((preset) => {
                        const fonts = FONT_PAIRS.find((f) => f.key === preset.fontPair);
                        return (
                          <button
                            key={preset.key}
                            type="button"
                            aria-pressed={styleKey === preset.key}
                            onClick={() => applyStyle(preset.key)}
                            className={`rounded-xl border p-3 text-left transition ${
                              styleKey === preset.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                            }`}
                          >
                            <div
                              className="mb-2 flex h-10 items-center justify-between rounded-md px-2"
                              style={{ background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})` }}
                            >
                              <span className="text-lg font-semibold text-white" style={{ fontFamily: fonts?.display }}>
                                Aa
                              </span>
                              <span className="h-4 w-10 bg-white/90" style={{ borderRadius: preset.radiusPreset === 'sharp' ? 0 : preset.radiusPreset === 'subtle' ? 4 : 999 }} />
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                              <p className="text-sm font-semibold">{preset.label}</p>
                              {!isThemeAllowed(store?.planCode, preset.themeKey) ? (
                                <PlanLockBadge tone="light" plan={themeMinPlan(preset.themeKey)} />
                              ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground">{preset.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <details className="rounded-xl border border-border p-4">
                    <summary className="cursor-pointer text-sm font-semibold">Personnaliser en détail</summary>
                    <div className="mt-4 space-y-6">
                  <div>
                    <Label className="mb-2 block">Design</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {STORE_THEMES.map((theme) => (
                        <button
                          key={theme.key}
                          type="button"
                          aria-pressed={themeKey === theme.key}
                          onClick={() => {
                            if (!isThemeAllowed(store?.planCode, theme.key)) {
                              toast.message(`Le thème « ${theme.label} » demande un plan supérieur.`);
                              return;
                            }
                            setThemeKey(theme.key);
                          }}
                          className={`rounded-xl border p-3 text-left transition ${
                            themeKey === theme.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <div
                            className="mb-2 h-8 rounded-md"
                            style={{ background: `linear-gradient(135deg, ${theme.demoPrimary}, ${theme.demoSecondary})` }}
                          />
                          <div className="flex flex-wrap items-center gap-1">
                            <p className="text-sm font-semibold">{theme.label}</p>
                            {!isThemeAllowed(store?.planCode, theme.key) ? (
                              <PlanLockBadge tone="light" plan={themeMinPlan(theme.key)} />
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">{theme.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Couleurs</Label>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {PALETTES.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          title={p.label}
                          aria-label={`Palette ${p.label}`}
                          onClick={() => {
                            setPrimaryColor(p.primary);
                            setSecondaryColor(p.secondary);
                          }}
                          className={`h-9 w-14 rounded-lg border-2 transition ${
                            primaryColor.toLowerCase() === p.primary.toLowerCase() ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="ob-c1" className="text-xs">Principale</Label>
                        <Input id="ob-c1" type="color" className="mt-1 h-10" value={primaryColor || '#0F766E'} onChange={(e) => setPrimaryColor(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="ob-c2" className="text-xs">Secondaire</Label>
                        <Input id="ob-c2" type="color" className="mt-1 h-10" value={secondaryColor || '#0369A1'} onChange={(e) => setSecondaryColor(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-2 block">Polices</Label>
                      {FONT_PAIRS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setFontPair(p.key)}
                          className={`mb-2 w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            fontPair === p.key ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <Label className="mb-2 block">Arrondis</Label>
                      {RADIUS_PRESETS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setRadiusPreset(p.key)}
                          className={`mb-2 w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            radiusPreset === p.key ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                    </div>
                  </details>
                </section>
              ) : null}

              {step === 1 ? (
                <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold">Comment vos clients vous joignent</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Affiché dans le pied de page, la page contact et les pages légales. Le numéro WhatsApp ajoute le
                      bouton « Commander sur WhatsApp ».
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ob-phone">Téléphone</Label>
                      <Input id="ob-phone" type="tel" className="mt-1.5" value={contact.phone} placeholder="06 00 00 00 00" onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="ob-wa">WhatsApp</Label>
                      <Input id="ob-wa" type="tel" className="mt-1.5" value={contact.whatsapp} placeholder="212600000000" onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="ob-city">Ville</Label>
                      <Input id="ob-city" className="mt-1.5" value={contact.city} placeholder="Casablanca" onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="ob-email">Email de contact</Label>
                      <Input id="ob-email" type="email" className="mt-1.5" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold">Votre catalogue</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Démarrez avec des produits d’exemple ({pack.label}) puis remplacez-les, ou ajoutez directement vos
                      produits. Vous pouvez aussi passer cette étape.
                    </p>
                  </div>
                  {productCount > 0 ? (
                    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900">
                      {productCount} produit{productCount > 1 ? 's' : ''} dans le catalogue
                      {demoProducts.length > 0 ? ` (dont ${demoProducts.length} d’exemple)` : ''}.
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" className="gap-2" disabled={busy} onClick={() => addDemo.mutate()}>
                      {addDemo.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Ajouter des produits d’exemple
                    </Button>
                    <Button type="button" variant="outline" className="gap-2" onClick={openAddProduct}>
                      <Package className="h-4 w-4" />
                      {productCount > 0 ? 'Ajouter un autre produit' : 'Ajouter mon premier produit'}
                    </Button>
                    {demoProducts.length > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-destructive hover:text-destructive"
                        disabled={busy}
                        onClick={() => clearDemo.mutate()}
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer les {demoProducts.length} produits d’exemple
                      </Button>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold">Prêt à publier</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Un clic prépare votre page d’accueil et vos pages légales. Tout reste modifiable ensuite.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
                    <input type="checkbox" className="mt-1" checked={publishHome} onChange={(e) => setPublishHome(e.target.checked)} />
                    <span>
                      <strong>Page d’accueil complète</strong>
                      <span className="mt-0.5 block text-muted-foreground">
                        Bannière, avantages, catégories, produits, histoire, avis, blog et newsletter — modifiable bloc par
                        bloc.
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
                    <input type="checkbox" className="mt-1" checked={createLegal} onChange={(e) => setCreateLegal(e.target.checked)} />
                    <span>
                      <strong>Pages légales</strong> (mentions légales, CGV, retours, confidentialité)
                      <span className="mt-0.5 block text-xs text-muted-foreground">{LEGAL_DISCLAIMER}</span>
                    </span>
                  </label>
                  {!settings?.logoUrl && !logoUrl ? (
                    <p className="text-xs text-amber-800">Astuce : vous pouvez ajouter votre logo à l’étape Style.</p>
                  ) : null}
                  {productCount === 0 ? (
                    <p className="text-xs text-amber-800">
                      Astuce : votre catalogue est vide — ajoutez des produits à l’étape Catalogue.
                    </p>
                  ) : null}
                  {publish.isError ? (
                    <p className="text-sm text-destructive">La publication a échoué : réessayez (rien n’est perdu).</p>
                  ) : null}
                  <Button
                    type="button"
                    size="lg"
                    className="w-full gap-2"
                    disabled={busy}
                    onClick={() => publish.mutate()}
                  >
                    {publish.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                    Publier ma boutique
                  </Button>
                </section>
              ) : null}

              <div className="flex justify-between gap-3">
                <Button type="button" variant="outline" className="gap-2" disabled={step === 0 || busy} onClick={() => void go(step - 1)}>
                  <ArrowLeft className="h-4 w-4" /> Retour
                </Button>
                {step < LAST_STEP ? (
                  <div className="flex gap-2">
                    {step >= 1 ? (
                      <Button type="button" variant="ghost" disabled={busy} onClick={() => goToStep(step + 1)}>
                        Passer
                      </Button>
                    ) : null}
                    <Button type="button" className="gap-2" disabled={busy} onClick={() => void go(step + 1)}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Continuer <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {step <= 1 ? <div className="lg:sticky lg:top-4 lg:self-start">{preview}</div> : null}
          </div>
        )}

        {step === 2 && productCount > 0 ? (
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/admin/produits" className="underline">Gérer mon catalogue</Link>
          </p>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminOnboarding;
