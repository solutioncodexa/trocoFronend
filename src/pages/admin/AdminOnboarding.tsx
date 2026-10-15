import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ImagePlus,
  Loader2,
  MessageCircle,
  Monitor,
  Package,
  Rocket,
  Smartphone,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { QRCodeCanvas } from 'qrcode.react';
import { OnboardingStepper } from '@/components/admin/onboarding/OnboardingStepper';
import { PageWireframe } from '@/components/admin/onboarding/PageWireframe';
import { StyleSpecimen } from '@/components/admin/onboarding/StyleSpecimen';
import { QuickProductDialog, type QuickProductReplace } from '@/components/admin/QuickProductDialog';
import { StoreAppearanceLivePreview } from '@/components/admin/StoreAppearanceLivePreview';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import { appearanceOptLabel } from '@/i18n/admin/appearanceOptionI18n';
import { createStoreMessages, type CreateStoreKey } from '@/i18n/createStoreMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import { productsApi } from '@/services/api/products';
import { categoriesApi } from '@/services/api/categories';
import { getImageUrl, uploadImage } from '@/services/api/upload';
import { paletteFromFile, type Palette } from '@/config/paletteFromImage';
import { proposeCopy } from '@/config/copyProposal';
import type { DemoCategory } from '@/demo/mockCatalog';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { PAGE_TEMPLATES } from '@/config/pageTemplates';
import { TEMPLATES_COPY } from '@/config/siteTemplates';
import { APPEARANCE_LOOK_PRESETS } from '@/config/appearancePresets';
import { STORE_THEMES, normalizeThemeKey, type StoreThemeKey } from '@/config/storeThemes';
import { FONT_PAIRS, RADIUS_PRESETS } from '@/config/storefrontTheme';
import { normalizeAppearance, type StoreAppearance } from '@/config/storeAppearance';
import {
  STYLE_FOR_SECTOR,
  STYLE_PRESETS,
  getStylePreset,
  styleAppearanceOverride,
  type StylePreset,
} from '@/config/stylePresets';
import { isValidPhone, normalizePhone } from '@/utils/phone';
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
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import {
  clearOnboardingDraft,
  ONBOARDING_RETURN_QUERY,
  readOnboardingDraft,
  writeOnboardingDraft,
} from '@/utils/onboardingSession';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const STEPS = ['ob.step.style', 'ob.step.contact', 'ob.step.catalog', 'ob.step.publish'] as const satisfies readonly AdminMessageKey[];
const LAST_STEP = STEPS.length - 1;

/** Palettes rapides : un clic remplace couleur principale + secondaire. */
const PALETTES: { key: string; primary: string; secondary: string }[] = [
  { key: 'lagon', primary: '#0F766E', secondary: '#0369A1' },
  { key: 'terracotta', primary: '#B45309', secondary: '#78350F' },
  { key: 'bordeaux', primary: '#9F1239', secondary: '#4C0519' },
  { key: 'slate', primary: '#334155', secondary: '#0F172A' },
  { key: 'olive', primary: '#4D7C0F', secondary: '#365314' },
  { key: 'indigo', primary: '#4338CA', secondary: '#1E1B4B' },
];

/** 3 styles conseillés pour le secteur, en priorité ceux inclus dans le plan du marchand. */
function recommendedStyles(sector: string, planCode?: string | null): StylePreset[] {
  const keys = [STYLE_FOR_SECTOR[sector] ?? 'classique', 'classique', ...STYLE_PRESETS.map((p) => p.key)];
  const unique = [...new Set(keys)].map((k) => getStylePreset(k)).filter((p): p is StylePreset => !!p);
  const allowed = unique.filter((p) => isThemeAllowed(planCode, p.themeKey));
  return [...allowed, ...unique.filter((p) => !allowed.includes(p))].slice(0, 3);
}

/** Navigation aux flèches dans un groupe role="radiogroup" (inversée en RTL). */
function onRadioKeyDown(e: KeyboardEvent<HTMLElement>) {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])'));
  const i = radios.indexOf(document.activeElement as HTMLElement);
  if (i < 0) return;
  e.preventDefault();
  const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
  const forward = e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
  const next = radios[(i + (forward ? 1 : -1) + radios.length) % radios.length];
  next.focus();
  next.click();
}

function clampStep(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(LAST_STEP, Math.floor(value)));
}

const AdminOnboarding = () => {
  const { t, locale } = useAdminLocale();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { store, refresh, loadFromAdminSession } = useTenant();

  const draft = useRef(readOnboardingDraft()).current;
  const initialStep = clampStep(Number(searchParams.get('step') ?? draft?.step ?? 0));

  const [step, setStep] = useState(initialStep);
  const [published, setPublished] = useState(false);
  const [extraPages, setExtraPages] = useState<string[]>(draft?.extraPages ?? []);
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
    const look = APPEARANCE_LOOK_PRESETS.find((l) => l.key === draft?.look);
    if (look) return look.appearance;
    const preset = getStylePreset(draft?.style);
    return preset ? styleAppearanceOverride(preset) : null;
  });
  const [publishHome, setPublishHome] = useState(draft?.publishHome ?? true);
  const [createLegal, setCreateLegal] = useState(true);
  const [contact, setContact] = useState({ phone: '', whatsapp: '', city: '', email: '' });
  // WhatsApp = même numéro que le téléphone (cas le plus courant) : un seul champ à remplir.
  const [waSame, setWaSame] = useState(true);
  // Secteur déjà choisi à l'inscription : on l'affiche replié au lieu de redemander toute la grille.
  const [changeSector, setChangeSector] = useState(!draft?.sector);
  const [showAllStyles, setShowAllStyles] = useState(false);
  // Sections repliables pilotées par l'état : elles ne doivent pas se refermer pendant la saisie.
  const [brandOpen, setBrandOpen] = useState(!!draft?.tagline);
  const [extraOpen, setExtraOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [seeded, setSeeded] = useState(!!draft?.seeded);
  // Tant que le marchand n'a pas choisi lui-même un style, on applique celui conseillé pour son secteur.
  const styleTouched = useRef(!!draft?.style);
  // Couleurs extraites du logo envoyé : proposées, jamais appliquées sans clic.
  const [logoPalette, setLogoPalette] = useState<Palette | null>(null);
  const [suggestingTagline, setSuggestingTagline] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [quickOpen, setQuickOpen] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [quickReplace, setQuickReplace] = useState<QuickProductReplace | null>(null);

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

  // Vrais produits et catégories (y compris ceux d'exemple) dans l'aperçu, pour voir sa boutique remplie.
  const { data: previewProductsPage } = useQuery({
    queryKey: ['products', 'onboarding-preview'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 8 }),
    staleTime: 30_000,
  });
  const previewProducts = useMemo(
    () => mapProductListItemListToProducts(previewProductsPage?.content ?? []),
    [previewProductsPage?.content],
  );
  const { data: categoryCards = [] } = useQuery({
    queryKey: ['categories', 'cards', 'onboarding-preview'],
    queryFn: () => categoriesApi.getCardCategories(),
    staleTime: 30_000,
  });
  const previewCategories: DemoCategory[] = useMemo(
    () =>
      categoryCards
        .filter((c) => !c.parentId)
        .slice(0, 5)
        .map((c) => ({
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          image: c.heroImageUrl ? getImageUrl(c.heroImageUrl) : '',
          count: 0,
        })),
    [categoryCards],
  );

  // Préremplissage depuis les réglages existants (sans écraser ce que le marchand a déjà saisi).
  useEffect(() => {
    if (!settings) return;
    setSiteName((prev) => prev || settings.siteName || '');
    setTagline((prev) => prev || settings.tagline || '');
    setLogoUrl((prev) => prev || settings.logoUrl || '');
    if (settings.logoUrl || settings.tagline) setBrandOpen(true);
    setPrimaryColor((prev) => prev || settings.primaryColor || '#0F766E');
    setSecondaryColor((prev) => prev || settings.secondaryColor || '#0369A1');
    if (!draft?.themeKey) setThemeKey(normalizeThemeKey(settings.themeKey));
    if (!draft?.fontPair && settings.fontPair) setFontPair(settings.fontPair);
    if (!draft?.radiusPreset && settings.radiusPreset) setRadiusPreset(settings.radiusPreset);
    if (settings.contactWhatsapp && normalizePhone(settings.contactWhatsapp) !== normalizePhone(settings.contactPhone)) {
      setWaSame(false);
    }
    setContact((prev) => ({
      phone: prev.phone || settings.contactPhone || draft?.phone || '',
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

  // Écran de réussite : le focus passe sur le titre pour que le changement soit annoncé.
  useEffect(() => {
    if (published) requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }, [published]);

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
      style: styleTouched.current ? styleKey : undefined,
      phone: draft?.phone,
      seeded,
      template: draft?.template,
      look: draft?.look,
      extraPages,
      homeTemplate: draft?.homeTemplate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, themeKey, fontPair, radiusPreset, siteName, tagline, primaryColor, secondaryColor, publishHome, sector, styleKey, seeded, extraPages]);

  const pack = getStarterPack(sector || DEFAULT_STARTER_PACK_KEY);
  const sectorLabel = (key: string) =>
    createStoreMessages[locale][`sector.${key}` as CreateStoreKey] ?? getStarterPack(key).label;
  const sectorDesc = (key: string) => t(`ob.sector.${key}.desc` as AdminMessageKey);
  const styleLabel = (key: string) => t(`ob.stylePreset.${key}` as AdminMessageKey);
  const recommended = useMemo(() => recommendedStyles(sector, store?.planCode), [sector, store?.planCode]);
  const visibleStyles = showAllStyles
    ? STYLE_PRESETS
    : !styleKey || recommended.some((p) => p.key === styleKey)
      ? recommended
      : [...recommended.slice(0, 2), getStylePreset(styleKey)!];

  /** Applique un style complet : thème, couleurs, polices, arrondis et agencement. */
  const applyStyle = (key: string) => {
    const preset = getStylePreset(key);
    if (!preset) return;
    if (!isThemeAllowed(store?.planCode, preset.themeKey)) {
      toast.message(t('ob.planLocked.style', { name: styleLabel(preset.key) }));
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
    onError: (e) => toastError(e, t('ob.err.save')),
  });

  const phoneInvalid = !!contact.phone.trim() && !isValidPhone(contact.phone);
  const waInvalid = !waSame && !!contact.whatsapp.trim() && !isValidPhone(contact.whatsapp);

  const saveContact = useMutation({
    mutationFn: async () => {
      if (phoneInvalid || waInvalid) {
        setPhoneChecked(true);
        throw new Error(t('ob.err.phone'));
      }
      await platformApi.updateMyStoreSettings({
        contactPhone: normalizePhone(contact.phone) ?? undefined,
        contactWhatsapp: normalizePhone(waSame ? contact.phone : contact.whatsapp) ?? undefined,
        contactCity: contact.city.trim() || undefined,
        contactEmail: contact.email.trim() || undefined,
      });
    },
    onSuccess: syncStore,
    onError: (e) => toastError(e, t('ob.err.save')),
  });

  const createHome = useMutation({
    mutationFn: async () => {
      const tpl = PAGE_TEMPLATES.find((p) => p.key === (draft?.homeTemplate ?? 'home-complete'));
      if (!tpl) throw new Error(t('ob.err.template'));
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
    onError: (e) => toastError(e, t('ob.err.home')),
  });

  const addExtraPages = useMutation({
    mutationFn: async () => {
      const existing = await storePagesApi.list();
      const taken = new Set(existing.map((p) => (p.slug || '').toLowerCase()));
      for (const key of extraPages) {
        const tpl = PAGE_TEMPLATES.find((p) => p.key === key);
        if (!tpl || taken.has(tpl.meta.slug.toLowerCase())) continue;
        const page = await storePagesApi.create({ ...tpl.meta, isHome: false, published: true });
        await storePagesApi.replaceBlocks(page.id!, tpl.blocks, 'Assistant de création');
      }
    },
    onError: (e) => toastError(e, t('ob.err.extraPages')),
  });

  const addLegal = useMutation({
    mutationFn: () =>
      createLegalPages({
        storeName: siteName || settings?.siteName || store?.siteName || '',
        contactEmail: contact.email || undefined,
        contactPhone: contact.phone || undefined,
        contactCity: contact.city || undefined,
      }),
    onError: (e) => toastError(e, t('ob.err.legal')),
  });

  const refreshCatalog = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };

  const addDemo = useMutation({
    mutationFn: () => applyStarterPack(sector || DEFAULT_STARTER_PACK_KEY, locale),
    onSuccess: (res) => {
      refreshCatalog();
      toast.success(
        res.productsCreated > 0
          ? t('ob.demo.added', { count: res.productsCreated })
          : t('ob.demo.already'),
      );
    },
    onError: (e) => toastError(e, t('ob.err.demoAdd')),
  });

  const clearDemo = useMutation({
    mutationFn: () => removeDemoProducts(),
    onSuccess: (count) => {
      refreshCatalog();
      toast.success(t('ob.demo.removed', { count }));
    },
    onError: (e) => toastError(e, t('ob.err.delete')),
  });

  // Boutique jamais vide : produits d'exemple du secteur ajoutés une seule fois, en tâche de fond.
  const autoSeed = useMutation({
    mutationFn: () => applyStarterPack(sector, locale),
    onSuccess: (res) => {
      refreshCatalog();
      if (res.productsCreated > 0) {
        toast.success(t('ob.demo.auto', { count: res.productsCreated }));
      }
    },
  });

  useEffect(() => {
    if (seeded || !sector || !productPage || productCount > 0) return;
    setSeeded(true);
    autoSeed.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeded, sector, productPage, productCount]);

  // Style conseillé appliqué d'office (le marchand peut en changer en un clic).
  useEffect(() => {
    if (styleTouched.current || !settings || !store || !sector || styleKey) return;
    applyStyle(recommended[0].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, store, sector, styleKey, recommended]);

  const chooseSector = (key: string) => {
    setSector(key);
    setChangeSector(false);
    if (!styleTouched.current) setStyleKey('');
  };

  const chooseStyle = (key: string) => {
    styleTouched.current = true;
    applyStyle(key);
  };

  /** Envoi du logo : on en profite pour lire ses couleurs dominantes (proposées ensuite au marchand). */
  const uploadLogo = async (file: File) => {
    void paletteFromFile(file)
      .then((p) => setLogoPalette(p))
      .catch(() => setLogoPalette(null));
    return uploadImage(file);
  };

  const applyLogoPalette = () => {
    if (!logoPalette) return;
    setPrimaryColor(logoPalette.primary);
    setSecondaryColor(logoPalette.secondary);
    setLogoPalette(null);
    toast.success(t('ob.logoPalette.applied'));
  };

  /** Accroche proposée par l'IA (secteur + nom), avec une phrase simple si l'IA ne répond pas. */
  const suggestTagline = async () => {
    setSuggestingTagline(true);
    const topic = sector ? `${sectorLabel(sector)} — ${sectorDesc(sector)}` : siteName;
    const text = await proposeCopy('tagline', topic, { storeName: siteName, locale });
    setTagline(text || t('ob.tagline.fallback', { sector: sector ? sectorLabel(sector) : siteName }));
    setSuggestingTagline(false);
  };

  const publish = useMutation({
    mutationFn: async () => {
      if (publishHome) await createHome.mutateAsync();
      if (createLegal) await addLegal.mutateAsync();
      if (extraPages.length > 0) await addExtraPages.mutateAsync();
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
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
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

  const fullProductFormHref = `/admin/produits?action=new&${ONBOARDING_RETURN_QUERY}=1`;

  const openQuickProduct = (replace: QuickProductReplace | null) => {
    setQuickReplace(replace);
    setQuickOpen(true);
  };

  const storefrontUrl = buildStorefrontUrl(store?.slug ?? settings?.slug);
  const pendingActivation = (settings?.status || store?.status || '').toUpperCase() === 'PENDING';

  const appearance = useMemo(
    () => normalizeAppearance({ ...(settings?.appearance ?? {}), ...(appearanceOverride ?? {}) }),
    [settings?.appearance, appearanceOverride],
  );

  const preview = (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-1.5">
        <p className="text-sm font-semibold">{t('ob.preview')}</p>
        <div className="flex gap-1" role="group" aria-label={t('ob.preview')}>
          {(
            [
              ['desktop', Monitor, 'ob.device.desktop'],
              ['mobile', Smartphone, 'ob.device.mobile'],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={previewDevice === key}
              aria-label={t(label)}
              title={t(label)}
              onClick={() => setPreviewDevice(key)}
              className={`rounded-md p-2.5 transition sm:p-1.5 ${FOCUS_RING} ${
                previewDevice === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      <div
        className={`max-h-[70vh] overflow-auto ${
          previewDevice === 'mobile' ? 'mx-auto my-3 w-[390px] max-w-full rounded-2xl border-4 border-stone-800 dark:border-stone-500' : ''
        }`}
      >
        <StoreAppearanceLivePreview
          catalogProducts={previewProducts}
          catalogCategories={previewCategories}
          siteName={siteName || t('ob.myStore')}
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
          contactWhatsapp={waSame ? contact.phone : contact.whatsapp}
          contactCity={contact.city}
        />
      </div>
    </div>
  );

  const shareMessage = t('ob.share', { name: siteName || t('ob.myStore'), url: storefrontUrl });

  if (published) {
    return (
      <AdminLayout
        title={t('onboarding.title')}
        description={t('onboarding.description')}
        breadcrumbs={[{ label: t('ob.crumb') }]}
      >
        <div className="mx-auto max-w-2xl space-y-6 py-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Rocket className="h-7 w-7 rtl:-scale-x-100" aria-hidden />
            </span>
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold outline-none">{t('ob.done.title')}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {pendingActivation
              ? t('ob.done.pending')
              : t('ob.done.share')}
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-start">
            <span className="min-w-0 flex-1 truncate font-mono text-sm">{storefrontUrl}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(storefrontUrl)
                  .then(() => toast.success(t('ob.copied')))
                  .catch(() => toast.error(t('ob.copyFailed')));
              }}
            >
              <Copy className="h-3.5 w-3.5" /> {t('ob.copy')}
            </Button>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
            <QRCodeCanvas ref={qrRef} role="img" aria-label={t('ob.qr.title')} value={storefrontUrl} size={132} marginSize={2} className="shrink-0 rounded-lg" />
            <div className="space-y-2">
              <p className="font-display text-sm font-semibold">{t('ob.qr.title')}</p>
              <p className="text-xs text-muted-foreground">{t('ob.qr.hint')}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  const canvas = qrRef.current;
                  if (!canvas) return;
                  const a = document.createElement('a');
                  a.href = canvas.toDataURL('image/png');
                  a.download = `qr-${store?.slug ?? settings?.slug ?? 'boutique'}.png`;
                  a.click();
                }}
              >
                <Download className="h-3.5 w-3.5" /> {t('ob.qr.download')}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> {t('ob.viewStore')}
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> {t('ob.shareWa')}
              </a>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-start">
            <p className="font-display text-sm font-semibold">{t('ob.next.title')}</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-primary hover:underline" to="/admin/produits?action=new">
                  {t('ob.next.products')}
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/top-bar-messages">
                  {t('ob.next.topbar')}
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/sections">
                  {t('ob.next.menu')}
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/admin/pages">
                  {t('ob.next.pages')}
                </Link>
              </li>
            </ul>
          </div>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            {t('ob.toDashboard')}
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
        { label: t('ob.crumb') },
      ]}
      wide
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Étape 1 = choix du modèle (page dédiée) ; les étapes de l'assistant suivent. */}
        <OnboardingStepper
          labels={[TEMPLATES_COPY[locale].step, ...STEPS.map((label) => t(label))]}
          current={step + 1}
          ariaLabel={t('ob.stepsNav')}
          counter={t('ob.stepCounter', { n: step + 2, total: STEPS.length + 1, min: STEPS.length - step })}
          onSelect={(i) => (i === 0 ? navigate('/admin/modeles') : void go(i - 1))}
        />

        {pendingActivation ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950">
            {t('ob.pendingBanner')}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex justify-center py-16" role="status" aria-busy="true" aria-label={t('onboarding.title')}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-2 lg:hidden"
                aria-expanded={previewOpen}
                aria-controls="ob-preview"
                onClick={() => {
                  setPreviewOpen((v) => !v);
                  if (!previewOpen) requestAnimationFrame(() => document.getElementById('ob-preview')?.scrollIntoView({ block: 'start' }));
                }}
              >
                {previewOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewOpen ? t('ob.preview.hide') : t('ob.preview.show')}
              </Button>
              {step === 0 ? (
                <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold outline-none">{t('ob.style.title')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('ob.style.subtitle')}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ob-name">{t('ob.name')}</Label>
                    <Input id="ob-name" className="mt-1.5" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                  </div>

                  <div>
                    <Label className="mb-2 block">{t('ob.sector')}</Label>
                    {sector && !changeSector ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{sectorLabel(sector)}</p>
                          <p className="truncate text-xs text-muted-foreground">{sectorDesc(sector)}</p>
                        </div>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setChangeSector(true)}>
                          {t('ob.change')}
                        </Button>
                      </div>
                    ) : (
                      <div role="radiogroup" aria-label={t('ob.sector')} onKeyDown={onRadioKeyDown} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {STARTER_PACKS.map((p) => (
                          <button
                            key={p.key}
                            type="button"
                            role="radio"
                            aria-checked={sector === p.key}
                            tabIndex={sector && sector !== p.key ? -1 : 0}
                            onClick={() => chooseSector(p.key)}
                            className={`rounded-xl border p-3 text-start text-xs transition ${FOCUS_RING} ${
                              sector === p.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                            }`}
                          >
                            <span className="flex items-center gap-1 text-sm font-semibold">
                              {sector === p.key ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                              {sectorLabel(p.key)}
                            </span>
                            <span className="mt-0.5 block text-muted-foreground">{sectorDesc(p.key)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">{showAllStyles ? t('ob.styles.all') : t('ob.styles.recommended')}</Label>
                    <div role="radiogroup" aria-label={t('ob.styles.recommended')} onKeyDown={onRadioKeyDown} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {visibleStyles.map((preset) => {
                        return (
                          <button
                            key={preset.key}
                            type="button"
                            role="radio"
                            aria-checked={styleKey === preset.key}
                            tabIndex={styleKey && styleKey !== preset.key ? -1 : 0}
                            onClick={() => chooseStyle(preset.key)}
                            className={`rounded-xl border p-3 text-start transition ${FOCUS_RING} ${
                              styleKey === preset.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                            }`}
                          >
                            <div className="mb-2">
                              <StyleSpecimen preset={preset} label={styleLabel(preset.key)} />
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                              {styleKey === preset.key ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                              <p className="text-sm font-semibold">{styleLabel(preset.key)}</p>
                              {!isThemeAllowed(store?.planCode, preset.themeKey) ? (
                                <PlanLockBadge tone="light" plan={themeMinPlan(preset.themeKey)} />
                              ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground">{t(`ob.stylePreset.${preset.key}.desc` as AdminMessageKey)}</p>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className={`mt-2 inline-flex min-h-11 items-center text-xs font-medium text-primary hover:underline sm:min-h-0 ${FOCUS_RING}`}
                      onClick={() => setShowAllStyles((v) => !v)}
                    >
                      {showAllStyles ? t('ob.styles.showRecommended') : t('ob.styles.showAll', { count: STYLE_PRESETS.length })}
                    </button>
                  </div>

                  <details className="rounded-xl border border-border p-4" open={brandOpen} onToggle={(e) => setBrandOpen(e.currentTarget.open)}>
                    <summary className={`cursor-pointer rounded-md text-sm font-semibold ${FOCUS_RING}`}>{t('ob.brand.summary')}</summary>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor="ob-tagline">{t('ob.tagline')}</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-9 gap-1.5 text-xs text-primary sm:h-7"
                            disabled={suggestingTagline}
                            onClick={() => void suggestTagline()}
                          >
                            {suggestingTagline ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                            {t('ob.tagline.suggest')}
                          </Button>
                        </div>
                        <Input
                          id="ob-tagline"
                          className="mt-1.5"
                          value={tagline}
                          placeholder={t('ob.tagline.placeholder')}
                          onChange={(e) => setTagline(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 flex items-center gap-1.5">
                          <ImagePlus className="h-3.5 w-3.5" /> {t('ob.logo')}
                        </Label>
                        <ImageUpload value={logoUrl} onChange={setLogoUrl} onUpload={uploadLogo} />
                        {logoPalette && logoUrl ? (
                          <div role="status" className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                            <span
                              className="h-8 w-12 shrink-0 rounded-md border border-border"
                              style={{ background: `linear-gradient(135deg, ${logoPalette.primary} 50%, ${logoPalette.secondary} 50%)` }}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1 text-sm">{t('ob.logoPalette.title')}</span>
                            <Button type="button" size="sm" onClick={applyLogoPalette}>
                              {t('ob.logoPalette.apply')}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </details>

                  <details className="rounded-xl border border-border p-4">
                    <summary className={`cursor-pointer rounded-md text-sm font-semibold ${FOCUS_RING}`}>{t('ob.details')}</summary>
                    <div className="mt-4 space-y-6">
                  <div>
                    <Label className="mb-2 block">{t('ob.design')}</Label>
                    <div role="radiogroup" aria-label={t('ob.design')} onKeyDown={onRadioKeyDown} className="grid grid-cols-2 gap-2">
                      {STORE_THEMES.map((theme) => (
                        <button
                          key={theme.key}
                          type="button"
                          role="radio"
                          aria-checked={themeKey === theme.key}
                          tabIndex={themeKey !== theme.key ? -1 : 0}
                          onClick={() => {
                            if (!isThemeAllowed(store?.planCode, theme.key)) {
                              toast.message(t('ob.planLocked.theme', { name: t(`ob.theme.${theme.key}` as AdminMessageKey) }));
                              return;
                            }
                            setThemeKey(theme.key);
                          }}
                          className={`rounded-xl border p-3 text-start transition ${FOCUS_RING} ${
                            themeKey === theme.key ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <div
                            className="mb-2 h-8 rounded-md"
                            style={{ background: `linear-gradient(135deg, ${theme.demoPrimary}, ${theme.demoSecondary})` }}
                          />
                          <div className="flex flex-wrap items-center gap-1">
                            {themeKey === theme.key ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                            <p className="text-sm font-semibold">{t(`ob.theme.${theme.key}` as AdminMessageKey)}</p>
                            {!isThemeAllowed(store?.planCode, theme.key) ? (
                              <PlanLockBadge tone="light" plan={themeMinPlan(theme.key)} />
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">{t(`ob.theme.${theme.key}.desc` as AdminMessageKey)}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">{t('ob.colors')}</Label>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {PALETTES.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          title={t(`ob.pal.${p.key}` as AdminMessageKey)}
                          aria-pressed={primaryColor.toLowerCase() === p.primary.toLowerCase()}
                          aria-label={t('ob.palette', { name: t(`ob.pal.${p.key}` as AdminMessageKey) })}
                          onClick={() => {
                            setPrimaryColor(p.primary);
                            setSecondaryColor(p.secondary);
                          }}
                          className={`flex h-11 w-14 items-center justify-center rounded-lg border-2 transition sm:h-9 ${FOCUS_RING} ${
                            primaryColor.toLowerCase() === p.primary.toLowerCase() ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)` }}
                        >
                          {primaryColor.toLowerCase() === p.primary.toLowerCase() ? (
                            <Check className="h-4 w-4 text-white drop-shadow" aria-hidden />
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="ob-c1" className="text-xs">{t('ob.color.primary')}</Label>
                        <Input id="ob-c1" type="color" className="mt-1 h-10" value={primaryColor || '#0F766E'} onChange={(e) => setPrimaryColor(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="ob-c2" className="text-xs">{t('ob.color.secondary')}</Label>
                        <Input id="ob-c2" type="color" className="mt-1 h-10" value={secondaryColor || '#0369A1'} onChange={(e) => setSecondaryColor(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div role="radiogroup" aria-label={t('ob.fonts')} onKeyDown={onRadioKeyDown}>
                      <Label className="mb-2 block">{t('ob.fonts')}</Label>
                      {FONT_PAIRS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          role="radio"
                          aria-checked={fontPair === p.key}
                          tabIndex={fontPair !== p.key ? -1 : 0}
                          onClick={() => setFontPair(p.key)}
                          className={`mb-2 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-start text-sm sm:min-h-0 ${FOCUS_RING} ${
                            fontPair === p.key ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          {appearanceOptLabel(locale, 'font', p.key, p.label)}
                          {fontPair === p.key ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                        </button>
                      ))}
                    </div>
                    <div role="radiogroup" aria-label={t('ob.radius')} onKeyDown={onRadioKeyDown}>
                      <Label className="mb-2 block">{t('ob.radius')}</Label>
                      {RADIUS_PRESETS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          role="radio"
                          aria-checked={radiusPreset === p.key}
                          tabIndex={radiusPreset !== p.key ? -1 : 0}
                          onClick={() => setRadiusPreset(p.key)}
                          className={`mb-2 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-start text-sm sm:min-h-0 ${FOCUS_RING} ${
                            radiusPreset === p.key ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          {appearanceOptLabel(locale, 'radius', p.key, p.label)}
                          {radiusPreset === p.key ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
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
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold outline-none">{t('ob.contact.title')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('ob.contact.subtitle')}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ob-phone">{t('ob.phone')}</Label>
                      <Input id="ob-phone" type="tel" autoComplete="tel" dir="ltr" className="mt-1.5" value={contact.phone} placeholder="06 00 00 00 00" aria-invalid={phoneChecked && phoneInvalid} aria-describedby={phoneChecked && phoneInvalid ? 'ob-phone-err' : undefined} onBlur={() => setPhoneChecked(true)} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                      {phoneChecked && phoneInvalid ? <p id="ob-phone-err" role="alert" className="mt-1 text-xs text-destructive">{t('ob.err.phone')}</p> : null}
                      <label className="mt-1 flex min-h-11 items-center gap-2 text-xs text-muted-foreground sm:min-h-0 sm:py-1">
                        <input type="checkbox" className="h-5 w-5 accent-primary" checked={waSame} onChange={(e) => setWaSame(e.target.checked)} />
                        {t('ob.waSame')}
                      </label>
                    </div>
                    {waSame ? null : (
                      <div>
                        <Label htmlFor="ob-wa">{t('ob.whatsapp')}</Label>
                        <Input id="ob-wa" type="tel" autoComplete="tel" dir="ltr" className="mt-1.5" value={contact.whatsapp} placeholder="06 00 00 00 00" aria-invalid={phoneChecked && waInvalid} aria-describedby={phoneChecked && waInvalid ? 'ob-wa-err' : undefined} onBlur={() => setPhoneChecked(true)} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} />
                        {phoneChecked && waInvalid ? <p id="ob-wa-err" role="alert" className="mt-1 text-xs text-destructive">{t('ob.err.phone')}</p> : null}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="ob-city">{t('ob.city')}</Label>
                      <Input id="ob-city" autoComplete="address-level2" className="mt-1.5" value={contact.city} placeholder={t('ob.city.placeholder')} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="ob-email">{t('ob.email')}</Label>
                      <Input id="ob-email" type="email" autoComplete="email" dir="ltr" className="mt-1.5" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold outline-none">{t('ob.catalog.title')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('ob.catalog.subtitle', { pack: sectorLabel(pack.key) })}
                    </p>
                  </div>
                  {productCount > 0 ? (
                    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-200">
                      {demoProducts.length > 0
                        ? t('ob.catalog.countWithDemo', { count: productCount, demo: demoProducts.length })
                        : t('ob.catalog.count', { count: productCount })}
                    </p>
                  ) : null}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(
                      [
                        { key: 'demo', icon: Sparkles, onClick: () => addDemo.mutate(), pending: addDemo.isPending },
                        { key: 'quick', icon: Package, onClick: () => openQuickProduct(null) },
                        { key: 'instagram', icon: Camera, href: '/admin/produits/instagram' },
                        { key: 'csv', icon: FileSpreadsheet, href: '/admin/produits/import' },
                      ] as const
                    ).map((source) => {
                      const body = (
                        <>
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {'pending' in source && source.pending ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : (
                              <source.icon className="h-4 w-4" aria-hidden />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{t(`ob.source.${source.key}` as AdminMessageKey)}</span>
                            <span className="block text-xs text-muted-foreground">
                              {t(`ob.source.${source.key}.desc` as AdminMessageKey)}
                            </span>
                          </span>
                        </>
                      );
                      // Les produits d'exemple sont le chemin le plus rapide : carte pleine largeur, mise en avant.
                      const featured = source.key === 'demo';
                      const cls = `flex items-start gap-3 rounded-xl border p-3 text-start transition disabled:opacity-60 ${FOCUS_RING} ${
                        featured
                          ? 'border-primary/50 bg-primary/5 p-4 hover:bg-primary/10 sm:col-span-3'
                          : 'border-border hover:border-primary/40 hover:bg-muted/30'
                      }`;
                      return 'href' in source ? (
                        <Link key={source.key} to={source.href} className={cls}>
                          {body}
                        </Link>
                      ) : (
                        <button key={source.key} type="button" className={cls} disabled={busy} onClick={source.onClick}>
                          {body}
                        </button>
                      );
                    })}
                  </div>
                  {demoProducts.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{t('ob.demoList.title')}</p>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={busy}
                          onClick={() => clearDemo.mutate()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t('ob.catalog.removeDemo', { count: demoProducts.length })}
                        </Button>
                      </div>
                      <ul className="divide-y divide-border rounded-xl border border-border">
                        {demoProducts.map((p) => (
                          <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                            {p.images?.[0] ? (
                              <img src={getImageUrl(p.images[0])} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                            ) : (
                              <span className="h-10 w-10 shrink-0 rounded-md bg-muted" aria-hidden />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm">{p.name}</span>
                              <span className="block text-xs text-muted-foreground" dir="ltr">{p.price} MAD</span>
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openQuickProduct({ id: p.id, name: p.name, price: p.price, category: p.category })
                              }
                            >
                              {t('ob.demoList.replace')}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {step === 3 ? (
                <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold outline-none">{t('ob.publish.title')}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('ob.publish.subtitle')}
                    </p>
                  </div>
                  <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
                    <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-primary" checked={publishHome} onChange={(e) => setPublishHome(e.target.checked)} />
                    <span>
                      <strong>{t('ob.publish.home')}</strong>
                      <span className="mt-0.5 block text-muted-foreground">
                        {t('ob.publish.homeDesc')}
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
                    <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-primary" checked={createLegal} onChange={(e) => setCreateLegal(e.target.checked)} />
                    <span>
                      <strong>{t('ob.publish.legal')}</strong> {t('ob.publish.legalPages')}
                      <span className="mt-0.5 block text-xs text-muted-foreground">{t('ob.publish.legalDisclaimer')}</span>
                    </span>
                  </label>
                  <details className="space-y-2 rounded-xl border border-border p-4 text-sm" open={extraOpen} onToggle={(e) => setExtraOpen(e.currentTarget.open)}>
                    <summary className={`cursor-pointer rounded-md font-semibold ${FOCUS_RING}`}>
                      {t('ob.publish.extra')}{extraPages.length > 0 ? ` · ${extraPages.length}` : ''}
                    </summary>
                    <span className="mt-2 block text-xs text-muted-foreground">
                      {t('ob.publish.extraHint')}
                    </span>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {PAGE_TEMPLATES.filter((p) => !p.meta.isHome).map((tpl) => {
                        const checked = extraPages.includes(tpl.key);
                        return (
                          <label
                            key={tpl.key}
                            className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 ${
                              checked ? 'border-primary bg-primary/5 ring-2 ring-primary/25' : 'border-border hover:border-primary/40'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={checked}
                              onChange={(e) =>
                                setExtraPages((prev) => (e.target.checked ? [...prev, tpl.key] : prev.filter((k) => k !== tpl.key)))
                              }
                            />
                            <PageWireframe blocks={tpl.blocks} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold">{t(`ob.tpl.${tpl.key}` as AdminMessageKey)}</span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">{t(`ob.tpl.${tpl.key}.desc` as AdminMessageKey)}</span>
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
                      })}
                    </div>
                  </details>
                  {!settings?.logoUrl && !logoUrl ? (
                    <p className="text-xs text-amber-800 dark:text-amber-300">{t('ob.tip.logo')}</p>
                  ) : null}
                  {productCount === 0 ? (
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      {t('ob.tip.catalog')}
                    </p>
                  ) : null}
                  {publish.isError ? (
                    <p role="alert" className="text-sm text-destructive">{t('ob.publish.failed')}</p>
                  ) : null}
                  <Button
                    type="button"
                    size="lg"
                    className="w-full gap-2"
                    disabled={busy}
                    onClick={() => publish.mutate()}
                  >
                    {publish.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                    {t('ob.publish.cta')}
                  </Button>
                </section>
              ) : null}

              <div className="sticky bottom-0 z-20 flex justify-between gap-3 border-t border-border bg-background/95 py-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
                <Button type="button" variant="outline" className="h-11 gap-2 lg:h-10" disabled={step === 0 || busy} onClick={() => void go(step - 1)}>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('ob.back')}
                </Button>
                {step < LAST_STEP ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    {step <= 1 ? (
                      // Tout a une valeur par défaut correcte : on peut publier sans passer par Contact et Catalogue.
                      <Button type="button" variant="ghost" className="h-11 gap-1.5 lg:h-10" disabled={busy} onClick={() => void go(LAST_STEP)}>
                        <Rocket className="h-4 w-4" /> {t('ob.publishNow')}
                      </Button>
                    ) : null}
                    {step === 1 ? (
                      <Button type="button" variant="ghost" className="h-11 lg:h-10" disabled={busy} onClick={() => goToStep(step + 1)}>
                        {t('ob.skip')}
                      </Button>
                    ) : null}
                    <Button type="button" className="h-11 gap-2 lg:h-10" disabled={busy} onClick={() => void go(step + 1)}>
                      {saveStyle.isPending || saveContact.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {t('ob.continue')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            <div id="ob-preview" className={`lg:sticky lg:top-4 lg:self-start ${previewOpen ? '' : 'hidden lg:block'}`}>{preview}</div>
          </div>
        )}

        <QuickProductDialog
          open={quickOpen}
          onOpenChange={setQuickOpen}
          replace={quickReplace}
          fullFormHref={fullProductFormHref}
          onDone={refreshCatalog}
        />

        {step === 2 && productCount > 0 ? (
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/admin/produits" className="underline">{t('ob.catalog.manage')}</Link>
          </p>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminOnboarding;
