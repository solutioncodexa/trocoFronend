import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  Sparkles,
  Trash2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import { productsApi } from '@/services/api/products';
import { PAGE_TEMPLATES } from '@/config/pageTemplates';
import { STORE_THEMES, designDemoPath, normalizeThemeKey, type StoreThemeKey } from '@/config/storeThemes';
import { FONT_PAIRS, RADIUS_PRESETS } from '@/config/storefrontTheme';
import { useTenant } from '@/contexts/TenantContext';
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

const STEPS = ['Thème', 'Identité', 'Accueil', 'Menu', 'Bandeau', 'Produits', 'Publication'] as const;
const LAST_STEP = STEPS.length - 1;

function clampStep(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(LAST_STEP, Math.floor(value)));
}

const AdminOnboarding = () => {
  const { t } = useAdminLocale();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { store, refresh } = useTenant();

  const draft = readOnboardingDraft();
  const initialStep = clampStep(
    Number(searchParams.get('step') ?? draft?.step ?? 0),
  );

  const [step, setStep] = useState(initialStep);
  const [themeKey, setThemeKey] = useState<StoreThemeKey>(
    normalizeThemeKey(draft?.themeKey) || 'classic',
  );
  const [fontPair, setFontPair] = useState(draft?.fontPair || 'display_sans');
  const [radiusPreset, setRadiusPreset] = useState(draft?.radiusPreset || 'soft');
  const [siteName, setSiteName] = useState(draft?.siteName || '');
  const [tagline, setTagline] = useState(draft?.tagline || '');
  const [primaryColor, setPrimaryColor] = useState(draft?.primaryColor || '#0F766E');
  const [secondaryColor, setSecondaryColor] = useState(draft?.secondaryColor || '#0369A1');
  const [publishHome, setPublishHome] = useState(draft?.publishHome ?? true);
  const [sector, setSector] = useState(draft?.sector || '');
  const [createLegal, setCreateLegal] = useState(true);

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

  useEffect(() => {
    if (!settings) return;
    setSiteName((prev) => prev || settings.siteName || '');
    setTagline((prev) => prev || settings.tagline || '');
    if (!draft?.themeKey) setThemeKey(normalizeThemeKey(settings.themeKey));
    setPrimaryColor((prev) => prev || settings.primaryColor || '#0F766E');
    setSecondaryColor((prev) => prev || settings.secondaryColor || '#0369A1');
    if (!draft?.fontPair && settings.fontPair) setFontPair(settings.fontPair);
    if (!draft?.radiusPreset && settings.radiusPreset) setRadiusPreset(settings.radiusPreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // Sync step depuis l’URL (ex. retour après création produit)
  useEffect(() => {
    const fromUrl = searchParams.get('step');
    if (fromUrl == null) return;
    const next = clampStep(Number(fromUrl));
    setStep(next);
  }, [searchParams]);

  const goToStep = (nextStep: number) => {
    const clamped = clampStep(nextStep);
    setStep(clamped);
    writeOnboardingDraft({
      step: clamped,
      themeKey,
      fontPair,
      radiusPreset,
      siteName,
      tagline,
      primaryColor,
      secondaryColor,
      publishHome,
      sector,
    });
    setSearchParams(
      clamped === 0 ? {} : { step: String(clamped) },
      { replace: true },
    );
  };

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
    });
  }, [
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
  ]);

  const saveSettings = useMutation({
    mutationFn: () =>
      platformApi.updateMyStoreSettings({
        siteName: siteName.trim() || settings?.siteName,
        tagline: tagline.trim(),
        themeKey,
        fontPair,
        radiusPreset,
        primaryColor,
        secondaryColor,
      }),
    onSuccess: async () => {
      await refresh();
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
    onError: (e) => toastError(e, 'Enregistrement impossible'),
  });

  const createHome = useMutation({
    mutationFn: async () => {
      const tpl = PAGE_TEMPLATES.find((t) => t.key === 'home-complete');
      if (!tpl) throw new Error('Modèle introuvable');

      const existing = await storePagesApi.list();
      const home =
        existing.find((p) => p.isHome) ||
        existing.find((p) => (p.slug || '').toLowerCase() === 'accueil-boutique');

      if (home?.id) {
        const updated = await storePagesApi.update(home.id, {
          title: tpl.meta.title || home.title || 'Accueil boutique',
          slug: home.slug || tpl.meta.slug,
          isHome: true,
          showInNav: false,
          published: publishHome,
        });
        await storePagesApi.replaceBlocks(home.id, tpl.blocks);
        return updated;
      }

      const page = await storePagesApi.create({
        ...tpl.meta,
        title: tpl.meta.title || 'Accueil boutique',
        published: publishHome,
      });
      await storePagesApi.replaceBlocks(page.id!, tpl.blocks);
      return page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page d’accueil prête');
    },
    onError: (e) => toastError(e, 'Création de la page impossible'),
  });

  const chooseSector = (key: string) => {
    setSector(key);
    // Thème conseillé pour le secteur (modifiable ensuite).
    setThemeKey(getStarterPack(key).suggestedTheme);
  };

  const { data: demoProducts = [] } = useQuery({
    queryKey: ['products', 'onboarding-demo'],
    queryFn: () => listDemoProducts(),
    staleTime: 15_000,
  });

  const refreshCatalogQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const addDemo = useMutation({
    mutationFn: () => applyStarterPack(sector || DEFAULT_STARTER_PACK_KEY),
    onSuccess: (res) => {
      refreshCatalogQueries();
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
      refreshCatalogQueries();
      toast.success(`${count} produit(s) d’exemple supprimé(s)`);
    },
    onError: (e) => toastError(e, 'Suppression impossible'),
  });

  const addLegal = useMutation({
    mutationFn: () =>
      createLegalPages({
        storeName: siteName || settings?.siteName || store?.siteName || '',
        contactEmail: settings?.contactEmail ?? undefined,
        contactPhone: settings?.contactPhone ?? undefined,
        contactCity: settings?.contactCity ?? undefined,
      }),
    onSuccess: (slugs) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      if (slugs.length > 0) toast.success(`${slugs.length} page(s) légale(s) créée(s)`);
    },
    onError: (e) => toastError(e, 'Création des pages légales impossible'),
  });

  const storefrontUrl = buildStorefrontUrl(store?.slug ?? settings?.slug);
  const pendingActivation = (settings?.status || store?.status || '').toUpperCase() === 'PENDING';

  const next = async () => {
    try {
      if (step === 0 || step === 1) {
        await saveSettings.mutateAsync();
      }
      if (step === 2 && publishHome) {
        await createHome.mutateAsync();
      }
      if (step === 5 && createLegal) {
        await addLegal.mutateAsync();
      }
      goToStep(step + 1);
    } catch {
      // toast déjà affiché par onError des mutations
    }
  };

  const back = () => {
    if (step <= 0) return;
    goToStep(step - 1);
  };

  const openAddProduct = () => {
    writeOnboardingDraft({
      step: 5,
      themeKey,
      fontPair,
      radiusPreset,
      siteName,
      tagline,
      primaryColor,
      secondaryColor,
      publishHome,
      sector,
    });
    navigate(`/admin/produits?action=new&${ONBOARDING_RETURN_QUERY}=1`);
  };

  const finish = () => {
    clearOnboardingDraft();
    navigate('/admin/dashboard');
  };

  const busy =
    saveSettings.isPending ||
    createHome.isPending ||
    addDemo.isPending ||
    clearDemo.isPending ||
    addLegal.isPending;

  return (
    <AdminLayout
      title={t('onboarding.title')}
      description={t('onboarding.description')}
      breadcrumbs={[
        { label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' },
        { label: 'Assistant' },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => i <= step && goToStep(i)}
              disabled={i > step}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                i === step
                  ? 'bg-primary text-primary-foreground'
                  : i < step
                    ? 'bg-primary/15 text-primary hover:bg-primary/25'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

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
        ) : null}

        {!isLoading && step === 0 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Votre secteur</h2>
            <p className="text-sm text-muted-foreground">
              Nous adaptons le thème conseillé et vous proposerons des catégories et des produits d’exemple.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STARTER_PACKS.map((pack) => (
                <button
                  key={pack.key}
                  type="button"
                  aria-pressed={sector === pack.key}
                  onClick={() => chooseSector(pack.key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    sector === pack.key ? 'border-primary ring-2 ring-primary/25' : 'border-border'
                  }`}
                >
                  <p className="font-semibold">{pack.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{pack.description}</p>
                </button>
              ))}
            </div>
            <h2 className="pt-2 font-display text-xl font-semibold">Choisissez un thème</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {STORE_THEMES.map((theme) => (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() => setThemeKey(theme.key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    themeKey === theme.key ? 'border-primary ring-2 ring-primary/25' : 'border-border'
                  }`}
                >
                  <div
                    className="mb-3 h-12 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.demoPrimary}, ${theme.demoSecondary})`,
                    }}
                  />
                  <p className="font-semibold">{theme.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.description}</p>
                  <Link
                    to={designDemoPath(theme.key)}
                    target="_blank"
                    className="mt-2 inline-block text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Voir la démo
                  </Link>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {!isLoading && step === 1 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Identité & style</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Nom de la boutique</Label>
                <Input className="mt-1.5" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Accroche</Label>
                <Input className="mt-1.5" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
              <div>
                <Label>Couleur principale</Label>
                <Input type="color" className="mt-1.5 h-11" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              </div>
              <div>
                <Label>Couleur secondaire</Label>
                <Input type="color" className="mt-1.5 h-11" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
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
          </section>
        ) : null}

        {!isLoading && step === 2 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Page d’accueil</h2>
            <p className="text-sm text-muted-foreground">
              Nous créons une page « Accueil boutique » (hero, avantages, catégories, produits, histoire, avis, blog et newsletter) que vous pourrez modifier bloc par bloc. Elle remplace le
              design thème par défaut.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publishHome}
                onChange={(e) => setPublishHome(e.target.checked)}
              />
              Publier immédiatement
            </label>
          </section>
        ) : null}

        {!isLoading && step === 3 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Menu de navigation</h2>
            <p className="text-sm text-muted-foreground">
              Configurez le menu principal (Menus) ou les liens simples du header. Un seul menu actif
              à la fois.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/sections">Ouvrir Navigation → Menus</Link>
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/parametres">Apparence → Header</Link>
              </Button>
            </div>
          </section>
        ) : null}

        {!isLoading && step === 4 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Bandeau promo</h2>
            <p className="text-sm text-muted-foreground">
              Ajoutez des messages rotatifs au-dessus de la boutique (livraison gratuite, promo…).
            </p>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/top-bar-messages">Configurer le bandeau</Link>
            </Button>
          </section>
        ) : null}

        {!isLoading && step === 5 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Premiers produits</h2>
            <p className="text-sm text-muted-foreground">
              Ajoutez au moins un produit pour remplir votre catalogue. Vous pouvez aussi passer cette étape.
            </p>
            {productCount > 0 ? (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900">
                {productCount} produit{productCount > 1 ? 's' : ''} déjà dans le catalogue — vous pouvez
                continuer.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" className="gap-2" onClick={openAddProduct}>
                <Package className="h-4 w-4" />
                {productCount > 0 ? 'Ajouter un autre produit' : 'Ajouter un produit'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={busy}
                onClick={() => addDemo.mutate()}
              >
                {addDemo.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Ajouter des produits d’exemple ({getStarterPack(sector).label})
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
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={createLegal}
                  onChange={(e) => setCreateLegal(e.target.checked)}
                />
                <span>
                  <strong>Créer les pages légales</strong> (mentions légales, CGV, retours, confidentialité) à
                  l’étape suivante.
                  <span className="mt-1 block text-xs text-muted-foreground">{LEGAL_DISCLAIMER}</span>
                </span>
              </label>
            </div>
          </section>
        ) : null}

        {!isLoading && step === 6 ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="font-display text-xl font-semibold">Boutique configurée</h2>
            <p className="text-sm text-muted-foreground">
              {pendingActivation
                ? 'En attente d’activation — vous pouvez déjà prévisualiser votre vitrine.'
                : 'Votre boutique est prête à accueillir des clients.'}
            </p>
            {productCount === 0 ? (
              <p className="text-sm text-amber-800">
                Astuce : aucun produit pour l’instant — ajoutez-en depuis l’étape Produits.
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild className="gap-2">
                <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Voir ma boutique
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/boutique-en-ligne">Boutique en ligne</Link>
              </Button>
            </div>
          </section>
        ) : null}

        <div className="flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={step === 0 || busy}
            onClick={back}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {step < LAST_STEP ? (
            <Button type="button" className="gap-2" disabled={busy} onClick={() => void next()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={finish}>
              Terminer
            </Button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOnboarding;
