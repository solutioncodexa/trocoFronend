import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Eye, EyeOff, Loader2, Save, Settings2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AppearanceWorkspace } from '@/components/admin/appearance/AppearanceWorkspace';
import { toStorePageLinkOptions } from '@/components/admin/StorePageHrefSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { platformApi } from '@/services/api/platform';
import { storeGlobalSectionsApi } from '@/services/api/storeGlobalSections';
import { storePagesApi } from '@/services/api/storePages';
import { uploadImage } from '@/services/api/upload';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { buildFreshStorefrontUrl, buildStorefrontUrl } from '@/utils/storefrontUrl';
import {
  normalizeFontPair,
  normalizeRadiusPreset,
} from '@/config/storefrontTheme';
import {
  DEFAULT_APPEARANCE,
  normalizeAppearance,
  type StoreAppearance,
} from '@/config/storeAppearance';
import {
  THEME_LOOK_DEFAULTS,
  getThemeDefinition,
  normalizeThemeKey,
  themeAppearanceDefaults,
  type StoreThemeKey,
} from '@/config/storeThemes';
import { localeStorageKey } from '@/i18n/localeStorage';
import { normalizeLocale, parseSupportedLocales } from '@/i18n/messages';

function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

type FormState = {
  siteName: string;
  tagline: string;
  aboutText: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactCity: string;
  freeShippingThreshold: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  heroEnabled: boolean;
  categoriesEnabled: boolean;
  surMesureEnabled: boolean;
  themeKey: string;
  fontPair: string;
  radiusPreset: string;
  appearance: StoreAppearance;
  metaPixelId: string;
  tiktokPixelId: string;
  googleAdsId: string;
  googleAnalyticsId: string;
  abandonedCartEnabled: boolean;
  abandonedCartDelayMinutes: string;
  whatsappOrderTemplate: string;
  defaultLocale: string;
  supportedLocales: string;
  currency: string;
  currencyRatesJson: string;
  paymentCodEnabled: boolean;
  paymentCmiEnabled: boolean;
  paymentBnplEnabled: boolean;
  bnplProvider: string;
  paymentStripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeSecretKeyConfigured: boolean;
  stripeReady: boolean;
  paymentPaypalEnabled: boolean;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalClientSecretConfigured: boolean;
  paypalMode: string;
  paypalReady: boolean;
  cmiClientId: string;
  cmiStoreKey: string;
  cmiStoreKeyConfigured: boolean;
  cmiReady: boolean;
  loyaltyEnabled: boolean;
  loyaltyPointsPerMad: string;
  loyaltyMadPerPoint: string;
  privacyPolicyUrl: string;
  cookieConsentRequired: boolean;
  dataRetentionDays: string;
  cndpNoticeVersion: string;
  shippingDefaultCarrier: string;
};

function formFingerprint(f: FormState): string {
  return JSON.stringify(f);
}

const emptyForm: FormState = {
  siteName: '',
  tagline: '',
  aboutText: '',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '',
  secondaryColor: '',
  customDomain: '',
  contactEmail: '',
  contactPhone: '',
  contactWhatsapp: '',
  contactCity: '',
  freeShippingThreshold: '',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  heroEnabled: true,
  categoriesEnabled: true,
  surMesureEnabled: true,
  themeKey: 'classic',
  fontPair: 'display_sans',
  radiusPreset: 'soft',
  appearance: { ...DEFAULT_APPEARANCE },
  metaPixelId: '',
  tiktokPixelId: '',
  googleAdsId: '',
  googleAnalyticsId: '',
  abandonedCartEnabled: false,
  abandonedCartDelayMinutes: '60',
  whatsappOrderTemplate: '',
  defaultLocale: 'fr',
  supportedLocales: 'fr,ar,en',
  currency: 'MAD',
  currencyRatesJson: '',
  paymentCodEnabled: true,
  paymentCmiEnabled: false,
  paymentBnplEnabled: false,
  bnplProvider: '',
  paymentStripeEnabled: false,
  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeSecretKeyConfigured: false,
  stripeReady: false,
  paymentPaypalEnabled: false,
  paypalClientId: '',
  paypalClientSecret: '',
  paypalClientSecretConfigured: false,
  paypalMode: 'sandbox',
  paypalReady: false,
  cmiClientId: '',
  cmiStoreKey: '',
  cmiStoreKeyConfigured: false,
  cmiReady: false,
  loyaltyEnabled: false,
  loyaltyPointsPerMad: '1',
  loyaltyMadPerPoint: '0.10',
  privacyPolicyUrl: '',
  cookieConsentRequired: true,
  dataRetentionDays: '365',
  cndpNoticeVersion: '1',
  shippingDefaultCarrier: '',
};

const AdminStoreSettings = () => {
  const location = useLocation();
  const settingsMode = location.pathname.includes('/reglages');
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { refresh: refreshTenant, loadFromAdminSession } = useTenant();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [testingGateway, setTestingGateway] = useState<'stripe' | 'paypal' | 'cmi' | null>(null);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  const [showCmiSecret, setShowCmiSecret] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const applyThemeHandled = useRef(false);
  const applyingThemeRef = useRef(false);
  /** Évite que l’auto-save couleurs (setQueryData) réécrase le formulaire (ex. langue). */
  const hydratedBoutiqueKey = useRef<string | null>(null);
  /** Empreinte du formulaire tel qu’enregistré (hydrate / save / auto-save partiel). */
  const savedSnapshotRef = useRef<string | null>(null);
  const [cleanEpoch, setCleanEpoch] = useState(0);

  const markFormClean = (next: FormState) => {
    savedSnapshotRef.current = formFingerprint(next);
    setCleanEpoch((n) => n + 1);
  };

  const patchSavedSnapshot = (partial: Partial<FormState>) => {
    if (!savedSnapshotRef.current) return;
    try {
      const base = JSON.parse(savedSnapshotRef.current) as FormState;
      savedSnapshotRef.current = formFingerprint({ ...base, ...partial });
      setCleanEpoch((n) => n + 1);
    } catch {
      /* ignore */
    }
  };

  const isDirty = useMemo(
    () =>
      savedSnapshotRef.current != null &&
      formFingerprint(form) !== savedSnapshotRef.current,
    [form, cleanEpoch],
  );

  const { dialog: unsavedDialog } = useUnsavedChangesGuard({ isDirty });

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-settings', 'me'],
    queryFn: () => platformApi.getMyStoreSettings(),
  });

  const { data: storePages = [] } = useQuery({
    queryKey: ['store-pages', 'nav-destinations'],
    queryFn: () => storePagesApi.list(),
  });

  const { data: globalSections = [] } = useQuery({
    queryKey: ['store-global-sections', 'admin'],
    queryFn: () => storeGlobalSectionsApi.listAdmin(),
    enabled: !settingsMode,
  });
  const megaMenuEnabled = globalSections.some(
    (s) => s.sectionKey === 'mega_menu' && s.enabled,
  );
  const publishedHomePage = storePages.find((p) => p.isHome && p.published);
  const pageLinkOptions = toStorePageLinkOptions(storePages);
  const customHeaderPages = storePages.filter((p) => Boolean(p.slug) && !p.isHome);

  const togglePageInNav = useMutation({
    mutationFn: (page: { id: number; title: string; showInNav: boolean }) =>
      storePagesApi.update(page.id, {
        title: page.title,
        showInNav: !page.showInNav,
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success(
        updated.showInNav
          ? `« ${updated.title} » ajoutée au header`
          : `« ${updated.title} » retirée du header`,
      );
    },
    onError: (err: unknown) => toastError(err, 'Impossible de mettre à jour le menu'),
  });

  useEffect(() => {
    if (!data) return;
    // Pendant un changement de thème, applyThemeNow pousse déjà le form — éviter un écrasement.
    if (applyingThemeRef.current) return;
    const key = `${data.fournisseurId ?? ''}:${data.slug ?? ''}`;
    if (hydratedBoutiqueKey.current === key) return;
    hydratedBoutiqueKey.current = key;
    const next: FormState = {
      siteName: data.siteName ?? '',
      tagline: data.tagline ?? '',
      aboutText: data.aboutText ?? '',
      logoUrl: data.logoUrl ?? '',
      faviconUrl: data.faviconUrl ?? '',
      primaryColor: data.primaryColor ?? '',
      secondaryColor: data.secondaryColor ?? '',
      customDomain: data.customDomain ?? '',
      contactEmail: data.contactEmail ?? '',
      contactPhone: data.contactPhone ?? '',
      contactWhatsapp: data.contactWhatsapp ?? '',
      contactCity: data.contactCity ?? '',
      freeShippingThreshold:
        data.freeShippingThreshold != null ? String(data.freeShippingThreshold) : '',
      facebookUrl: data.facebookUrl ?? '',
      instagramUrl: data.instagramUrl ?? '',
      tiktokUrl: data.tiktokUrl ?? '',
      heroEnabled: data.heroEnabled ?? true,
      categoriesEnabled: data.categoriesEnabled ?? true,
      surMesureEnabled: data.surMesureEnabled ?? true,
      themeKey: normalizeThemeKey(data.themeKey),
      fontPair: normalizeFontPair(data.fontPair),
      radiusPreset: normalizeRadiusPreset(data.radiusPreset),
      appearance: normalizeAppearance(data.appearance),
      metaPixelId: data.metaPixelId ?? '',
      tiktokPixelId: data.tiktokPixelId ?? '',
      googleAdsId: data.googleAdsId ?? '',
      googleAnalyticsId: data.googleAnalyticsId ?? '',
      abandonedCartEnabled: data.abandonedCartEnabled ?? false,
      abandonedCartDelayMinutes:
        data.abandonedCartDelayMinutes != null ? String(data.abandonedCartDelayMinutes) : '60',
      whatsappOrderTemplate: data.whatsappOrderTemplate ?? '',
      defaultLocale: normalizeLocale(data.defaultLocale),
      supportedLocales: parseSupportedLocales(data.supportedLocales).join(','),
      currency: data.currency ?? 'MAD',
      currencyRatesJson: data.currencyRatesJson ?? '',
      paymentCodEnabled: data.paymentCodEnabled ?? true,
      paymentCmiEnabled: data.paymentCmiEnabled ?? false,
      paymentBnplEnabled: data.paymentBnplEnabled ?? false,
      bnplProvider: data.bnplProvider ?? '',
      paymentStripeEnabled: data.paymentStripeEnabled ?? false,
      stripePublishableKey: data.stripePublishableKey ?? '',
      stripeSecretKey: '',
      stripeSecretKeyConfigured: data.stripeSecretKeyConfigured ?? false,
      stripeReady: data.stripeReady ?? false,
      paymentPaypalEnabled: data.paymentPaypalEnabled ?? false,
      paypalClientId: data.paypalClientId ?? '',
      paypalClientSecret: '',
      paypalClientSecretConfigured: data.paypalClientSecretConfigured ?? false,
      paypalMode: data.paypalMode === 'live' ? 'live' : 'sandbox',
      paypalReady: data.paypalReady ?? false,
      cmiClientId: data.cmiClientId ?? '',
      cmiStoreKey: '',
      cmiStoreKeyConfigured: data.cmiStoreKeyConfigured ?? false,
      cmiReady: data.cmiReady ?? false,
      loyaltyEnabled: data.loyaltyEnabled ?? false,
      loyaltyPointsPerMad:
        data.loyaltyPointsPerMad != null ? String(data.loyaltyPointsPerMad) : '1',
      loyaltyMadPerPoint:
        data.loyaltyMadPerPoint != null ? String(data.loyaltyMadPerPoint) : '0.10',
      privacyPolicyUrl: data.privacyPolicyUrl ?? '',
      cookieConsentRequired: data.cookieConsentRequired ?? true,
      dataRetentionDays:
        data.dataRetentionDays != null ? String(data.dataRetentionDays) : '365',
      cndpNoticeVersion: data.cndpNoticeVersion ?? '1',
      shippingDefaultCarrier: data.shippingDefaultCarrier ?? '',
    };
    markFormClean(next);
    setForm(next);
  }, [data]);

  // Depuis la démo : ?applyTheme=minimal → sélectionne le design (à enregistrer).
  useEffect(() => {
    const raw = searchParams.get('applyTheme');
    if (!raw || applyThemeHandled.current) return;
    applyThemeHandled.current = true;
    const key = normalizeThemeKey(raw);
    setForm((prev) => ({ ...prev, themeKey: key }));
    toast.message(`Design « ${key} » sélectionné — enregistrez pour l’appliquer à votre vitrine.`);
    const next = new URLSearchParams(searchParams);
    next.delete('applyTheme');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Persiste les couleurs dès qu’elles sont valides (vitrine du tenant uniquement).
  useEffect(() => {
    if (!data || applyingThemeRef.current) return;
    const primary = form.primaryColor.trim();
    const secondary = form.secondaryColor.trim();
    if (primary && !isHexColor(primary)) return;
    if (secondary && !isHexColor(secondary)) return;
    if (
      primary === (data.primaryColor ?? '').trim() &&
      secondary === (data.secondaryColor ?? '').trim()
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (applyingThemeRef.current) return;
      void (async () => {
        try {
          const updated = await platformApi.updateMyStoreSettings({
            primaryColor: primary,
            secondaryColor: secondary,
          });
          if (applyingThemeRef.current) return;
          queryClient.setQueryData(['store-settings', 'me'], (old: StoreSettingsDTO | undefined) =>
            old
              ? {
                  ...old,
                  primaryColor: updated.primaryColor,
                  secondaryColor: updated.secondaryColor,
                }
              : updated,
          );
          setForm((prev) => {
            const next = {
              ...prev,
              primaryColor: updated.primaryColor ?? prev.primaryColor,
              secondaryColor: updated.secondaryColor ?? prev.secondaryColor,
            };
            if (savedSnapshotRef.current) {
              try {
                const base = JSON.parse(savedSnapshotRef.current) as FormState;
                savedSnapshotRef.current = formFingerprint({
                  ...base,
                  primaryColor: next.primaryColor,
                  secondaryColor: next.secondaryColor,
                });
              } catch {
                /* ignore */
              }
            }
            return next;
          });
          await loadFromAdminSession();
        } catch {
          /* l’utilisateur peut encore cliquer Enregistrer */
        }
      })();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [data, form.primaryColor, form.secondaryColor, queryClient, loadFromAdminSession]);

  const saveMutation = useMutation({
    mutationFn: (payload: UpdateStoreSettingsRequest) =>
      platformApi.updateMyStoreSettings(payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(['store-settings', 'me'], updated);
      hydratedBoutiqueKey.current = `${updated.fournisseurId ?? ''}:${updated.slug ?? ''}`;
      setForm((prev) => {
        const clean: FormState = {
          ...prev,
          defaultLocale: normalizeLocale(updated.defaultLocale),
          supportedLocales: parseSupportedLocales(updated.supportedLocales).join(','),
          currency: updated.currency ?? prev.currency,
          stripeSecretKey: '',
          paypalClientSecret: '',
          cmiStoreKey: '',
          stripeSecretKeyConfigured:
            updated.stripeSecretKeyConfigured ?? prev.stripeSecretKeyConfigured,
          paypalClientSecretConfigured:
            updated.paypalClientSecretConfigured ?? prev.paypalClientSecretConfigured,
          cmiStoreKeyConfigured:
            updated.cmiStoreKeyConfigured ?? prev.cmiStoreKeyConfigured,
        };
        savedSnapshotRef.current = formFingerprint(clean);
        return clean;
      });
      setCleanEpoch((n) => n + 1);
      const rev = Date.now();
      setPreviewTick(rev);
      // Appliquer immédiatement la langue principale sur la vitrine ouverte
      const slug = updated.slug || data?.slug;
      const primary = normalizeLocale(updated.defaultLocale);
      if (slug) {
        try {
          localStorage.setItem(localeStorageKey(slug), primary);
        } catch {
          /* ignore */
        }
      }
      await refreshTenant();
      await loadFromAdminSession();
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });

      if (slug) {
        const url = buildFreshStorefrontUrl(slug, rev);
        // Force ?lang= pour la langue principale (sauf FR = défaut sans param)
        try {
          const u = new URL(url);
          if (primary === 'fr') u.searchParams.delete('lang');
          else u.searchParams.set('lang', primary);
          window.open(u.href, 'troco-storefront');
        } catch {
          window.open(url, 'troco-storefront');
        }
        toast.success('Enregistré — vitrine ouverte dans la langue principale');
      } else {
        toast.success('Paramètres boutique enregistrés');
      }
    },
    onError: (err: unknown) => toastError(err, 'Erreur lors de la sauvegarde'),
  });

  const storefrontHref = data?.slug
    ? previewTick
      ? buildFreshStorefrontUrl(data.slug, previewTick)
      : buildStorefrontUrl(data.slug)
    : null;

  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const patchAppearance = <K extends keyof StoreAppearance>(key: K, value: StoreAppearance[K]) => {
    setForm((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value },
    }));
  };

  const mergeAppearance = (partial: Partial<StoreAppearance>) => {
    setForm((prev) => ({
      ...prev,
      appearance: normalizeAppearance({ ...prev.appearance, ...partial }),
    }));
  };

  const replaceAppearance = (appearance: StoreAppearance) => {
    setForm((prev) => ({
      ...prev,
      appearance: normalizeAppearance(appearance),
    }));
  };

  const applyPaymentSettings = (s: StoreSettingsDTO) => {
    queryClient.setQueryData(['store-settings', 'me'], s);
    setForm((prev) => {
      const next = {
        ...prev,
        paymentStripeEnabled: s.paymentStripeEnabled ?? false,
        stripePublishableKey: s.stripePublishableKey ?? '',
        stripeSecretKey: '',
        stripeSecretKeyConfigured: s.stripeSecretKeyConfigured ?? false,
        stripeReady: s.stripeReady ?? false,
        paymentPaypalEnabled: s.paymentPaypalEnabled ?? false,
        paypalClientId: s.paypalClientId ?? '',
        paypalClientSecret: '',
        paypalClientSecretConfigured: s.paypalClientSecretConfigured ?? false,
        paypalMode: s.paypalMode === 'live' ? 'live' : 'sandbox',
        paypalReady: s.paypalReady ?? false,
        paymentCmiEnabled: s.paymentCmiEnabled ?? false,
        cmiClientId: s.cmiClientId ?? '',
        cmiStoreKey: '',
        cmiStoreKeyConfigured: s.cmiStoreKeyConfigured ?? false,
        cmiReady: s.cmiReady ?? false,
      };
      if (savedSnapshotRef.current) {
        try {
          const base = JSON.parse(savedSnapshotRef.current) as FormState;
          savedSnapshotRef.current = formFingerprint({
            ...base,
            paymentStripeEnabled: next.paymentStripeEnabled,
            stripePublishableKey: next.stripePublishableKey,
            stripeSecretKey: '',
            stripeSecretKeyConfigured: next.stripeSecretKeyConfigured,
            stripeReady: next.stripeReady,
            paymentPaypalEnabled: next.paymentPaypalEnabled,
            paypalClientId: next.paypalClientId,
            paypalClientSecret: '',
            paypalClientSecretConfigured: next.paypalClientSecretConfigured,
            paypalMode: next.paypalMode,
            paypalReady: next.paypalReady,
            paymentCmiEnabled: next.paymentCmiEnabled,
            cmiClientId: next.cmiClientId,
            cmiStoreKey: '',
            cmiStoreKeyConfigured: next.cmiStoreKeyConfigured,
            cmiReady: next.cmiReady,
          });
        } catch {
          /* ignore */
        }
      }
      return next;
    });
    setCleanEpoch((n) => n + 1);
  };

  const applyThemeNow = async (themeKey: StoreThemeKey) => {
    const previousKey = normalizeThemeKey(form.themeKey);
    if (previousKey === themeKey) {
      toast.message(`Le thème « ${getThemeDefinition(themeKey).label} » est déjà actif`);
      return;
    }
    const hadPreset = Boolean(
      data?.themePresets &&
        typeof data.themePresets === 'object' &&
        data.themePresets[themeKey],
    );
    const previousLabel = getThemeDefinition(previousKey).label;
    const nextLabel = getThemeDefinition(themeKey).label;
    const look = THEME_LOOK_DEFAULTS[themeKey];

    applyingThemeRef.current = true;
    patch('themeKey', themeKey);
    try {
      const cachedSnap =
        hadPreset && data?.themePresets && typeof data.themePresets === 'object'
          ? (data.themePresets[themeKey] as Record<string, unknown> | undefined)
          : undefined;

      // Envoie aussi le look attendu à l’init : évite une course avec l’autosave couleurs
      // et couvre le cas où le backend n’a pas encore la migration presets.
      let updated = await platformApi.updateMyStoreSettings(
        hadPreset
          ? { themeKey }
          : {
              themeKey,
              primaryColor: look.primaryColor,
              secondaryColor: look.secondaryColor,
              fontPair: look.fontPair,
              radiusPreset: look.radiusPreset,
              appearance: normalizeAppearance({
                ...DEFAULT_APPEARANCE,
                ...themeAppearanceDefaults(themeKey),
              }),
            },
      );

      const serverPrimary = (updated.primaryColor ?? '').trim().toUpperCase();
      const expectedPrimary = look.primaryColor.toUpperCase();
      if (!hadPreset && serverPrimary !== expectedPrimary) {
        updated = await platformApi.updateMyStoreSettings({
          primaryColor: look.primaryColor,
          secondaryColor: look.secondaryColor,
          fontPair: look.fontPair,
          radiusPreset: look.radiusPreset,
          appearance: normalizeAppearance({
            ...DEFAULT_APPEARANCE,
            ...themeAppearanceDefaults(themeKey),
          }),
        });
      }

      queryClient.setQueryData(['store-settings', 'me'], updated);

      const snapPrimary =
        typeof cachedSnap?.primaryColor === 'string' ? cachedSnap.primaryColor : undefined;
      const snapSecondary =
        typeof cachedSnap?.secondaryColor === 'string' ? cachedSnap.secondaryColor : undefined;

      // Appliquer immédiatement au formulaire (ne pas attendre useEffect).
      setForm((prev) => {
        const next: FormState = {
          ...prev,
          themeKey: normalizeThemeKey(updated.themeKey),
          primaryColor:
            updated.primaryColor ||
            snapPrimary ||
            (!hadPreset ? look.primaryColor : prev.primaryColor) ||
            '',
          secondaryColor:
            updated.secondaryColor ||
            snapSecondary ||
            (!hadPreset ? look.secondaryColor : prev.secondaryColor) ||
            '',
          fontPair: normalizeFontPair(
            updated.fontPair ||
              (typeof cachedSnap?.fontPair === 'string' ? cachedSnap.fontPair : undefined) ||
              look.fontPair,
          ),
          radiusPreset: normalizeRadiusPreset(
            updated.radiusPreset ||
              (typeof cachedSnap?.radiusPreset === 'string' ? cachedSnap.radiusPreset : undefined) ||
              look.radiusPreset,
          ),
          appearance: normalizeAppearance(
            updated.appearance ??
              cachedSnap?.appearance ?? {
                ...DEFAULT_APPEARANCE,
                ...themeAppearanceDefaults(themeKey),
              },
          ),
          heroEnabled:
            updated.heroEnabled ??
            (typeof cachedSnap?.heroEnabled === 'boolean' ? cachedSnap.heroEnabled : true),
          categoriesEnabled:
            updated.categoriesEnabled ??
            (typeof cachedSnap?.categoriesEnabled === 'boolean'
              ? cachedSnap.categoriesEnabled
              : true),
          surMesureEnabled:
            updated.surMesureEnabled ??
            (typeof cachedSnap?.surMesureEnabled === 'boolean' ? cachedSnap.surMesureEnabled : true),
        };
        savedSnapshotRef.current = formFingerprint(next);
        return next;
      });
      setCleanEpoch((n) => n + 1);

      const rev = Date.now();
      setPreviewTick(rev);
      await refreshTenant();
      await loadFromAdminSession();
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });

      if (publishedHomePage) {
        toast.success(
          `Réglages « ${previousLabel} » sauvegardés · « ${nextLabel} » ${
            hadPreset ? 'restauré' : 'initialisé'
          }. Accueil page builder actif — le thème change surtout le look global.`,
          { duration: 8000 },
        );
      } else {
        toast.success(
          `Réglages « ${previousLabel} » sauvegardés · « ${nextLabel} » ${
            hadPreset ? 'restauré' : 'initialisé'
          }`,
          { duration: 6000 },
        );
      }
    } catch (err) {
      patch('themeKey', previousKey);
      toastError(err, 'Impossible d’appliquer le design');
    } finally {
      window.setTimeout(() => {
        applyingThemeRef.current = false;
      }, 1200);
    }
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadImage(file);
      patch('logoUrl', url);
      // Persiste tout de suite : sinon la vitrine garde le wordmark sans image.
      const updated = await platformApi.updateMyStoreSettings({ logoUrl: url });
      queryClient.setQueryData(['store-settings', 'me'], updated);
      patchSavedSnapshot({ logoUrl: url });
      await refreshTenant();
      await loadFromAdminSession();
      toast.success('Logo enregistré');
    } catch (err) {
      toastError(err, "Erreur lors de l'upload du logo");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleFaviconUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const url = await uploadImage(file, { compress: false });
      patch('faviconUrl', url);
      const updated = await platformApi.updateMyStoreSettings({ faviconUrl: url });
      queryClient.setQueryData(['store-settings', 'me'], updated);
      patchSavedSnapshot({ faviconUrl: url });
      await refreshTenant();
      await loadFromAdminSession();
      toast.success('Favicon enregistré');
    } catch (err) {
      toastError(err, "Erreur lors de l'upload du favicon");
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) faviconInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!form.siteName.trim()) {
      toast.error('Le nom du site est requis');
      return;
    }
    const thresholdRaw = form.freeShippingThreshold.trim();
    let freeShippingThreshold: number | null = null;
    if (thresholdRaw) {
      const parsed = Number(thresholdRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error('Seuil de livraison gratuite invalide');
        return;
      }
      freeShippingThreshold = parsed;
    }
    saveMutation.mutate({
      siteName: form.siteName.trim(),
      tagline: form.tagline.trim(),
      aboutText: form.aboutText.trim(),
      logoUrl: form.logoUrl.trim(),
      faviconUrl: form.faviconUrl.trim(),
      primaryColor: form.primaryColor.trim(),
      secondaryColor: form.secondaryColor.trim(),
      customDomain: form.customDomain.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, ''),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      contactWhatsapp: form.contactWhatsapp.trim(),
      contactCity: form.contactCity.trim(),
      freeShippingThreshold,
      facebookUrl: form.facebookUrl.trim(),
      instagramUrl: form.instagramUrl.trim(),
      tiktokUrl: form.tiktokUrl.trim(),
      heroEnabled: form.heroEnabled,
      categoriesEnabled: form.categoriesEnabled,
      surMesureEnabled: form.surMesureEnabled,
      themeKey: normalizeThemeKey(form.themeKey),
      fontPair: normalizeFontPair(form.fontPair),
      radiusPreset: normalizeRadiusPreset(form.radiusPreset),
      appearance: normalizeAppearance(form.appearance),
      metaPixelId: form.metaPixelId.trim() || undefined,
      tiktokPixelId: form.tiktokPixelId.trim() || undefined,
      googleAdsId: form.googleAdsId.trim() || undefined,
      googleAnalyticsId: form.googleAnalyticsId.trim() || undefined,
      abandonedCartEnabled: form.abandonedCartEnabled,
      abandonedCartDelayMinutes: (() => {
        const raw = form.abandonedCartDelayMinutes.trim();
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? Math.max(15, Math.min(n, 7 * 24 * 60)) : 60;
      })(),
      whatsappOrderTemplate: form.whatsappOrderTemplate.trim() || undefined,
      defaultLocale: normalizeLocale(form.defaultLocale),
      supportedLocales: (() => {
        const list = parseSupportedLocales(form.supportedLocales);
        const primary = normalizeLocale(form.defaultLocale);
        if (!list.includes(primary)) list.unshift(primary);
        return list.join(',');
      })(),
      currency: form.currency.trim() || undefined,
      currencyRatesJson: form.currencyRatesJson.trim() || undefined,
      paymentCodEnabled: form.paymentCodEnabled,
      paymentCmiEnabled: form.paymentCmiEnabled,
      paymentBnplEnabled: form.paymentBnplEnabled,
      bnplProvider: form.bnplProvider.trim() || undefined,
      paymentStripeEnabled: form.paymentStripeEnabled,
      stripePublishableKey: form.stripePublishableKey.trim() || undefined,
      ...(form.stripeSecretKey.trim() ? { stripeSecretKey: form.stripeSecretKey.trim() } : {}),
      paymentPaypalEnabled: form.paymentPaypalEnabled,
      paypalClientId: form.paypalClientId.trim() || undefined,
      ...(form.paypalClientSecret.trim()
        ? { paypalClientSecret: form.paypalClientSecret.trim() }
        : {}),
      paypalMode: form.paypalMode === 'live' ? 'live' : 'sandbox',
      cmiClientId: form.cmiClientId.trim() || undefined,
      ...(form.cmiStoreKey.trim() ? { cmiStoreKey: form.cmiStoreKey.trim() } : {}),
      loyaltyEnabled: form.loyaltyEnabled,
      loyaltyPointsPerMad: (() => {
        const raw = form.loyaltyPointsPerMad.trim();
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      })(),
      loyaltyMadPerPoint: (() => {
        const raw = form.loyaltyMadPerPoint.trim();
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      })(),
      privacyPolicyUrl: form.privacyPolicyUrl.trim() || undefined,
      cookieConsentRequired: form.cookieConsentRequired,
      dataRetentionDays: (() => {
        const raw = form.dataRetentionDays.trim();
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : null;
      })(),
      cndpNoticeVersion: form.cndpNoticeVersion.trim() || undefined,
      shippingDefaultCarrier: form.shippingDefaultCarrier.trim() || undefined,
    });
  };

  const payPlan = async () => {
    try {
      // Mode test (défaut) : paiement simulé sans CMI
      const result = await platformApi.testPassPayment(data?.planCode || undefined);
      toast.success(
        `Paiement test OK — ${result.planName || result.planCode} (${Number(result.amountMad ?? 0)} DHS)`,
      );
      queryClient.invalidateQueries({ queryKey: ['store-settings', 'me'] });
      await loadFromAdminSession();
    } catch (err) {
      toastError(err, 'Paiement test impossible');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title={settingsMode ? 'Paramètres' : 'Apparence'}
        breadcrumbs={
          settingsMode
            ? [{ label: 'Paramètres' }]
            : [
                { label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' },
                { label: 'Apparence' },
              ]
        }
      >
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        title={settingsMode ? 'Paramètres' : 'Apparence'}
        breadcrumbs={
          settingsMode
            ? [{ label: 'Paramètres' }]
            : [
                { label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' },
                { label: 'Apparence' },
              ]
        }
      >
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 font-medium text-red-800">Erreur de chargement</h3>
          <p className="text-red-600">Impossible de charger les paramètres boutique.</p>
        </div>
      </AdminLayout>
    );
  }


  if (!settingsMode) {
    return (
      <AdminLayout
        workspace
        title="Apparence"
        breadcrumbs={[
          { label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' },
          { label: 'Apparence' },
        ]}
      >
        <AppearanceWorkspace
          form={{
            siteName: form.siteName,
            tagline: form.tagline,
            aboutText: form.aboutText,
            logoUrl: form.logoUrl,
            faviconUrl: form.faviconUrl,
            primaryColor: form.primaryColor,
            secondaryColor: form.secondaryColor,
            themeKey: form.themeKey,
            fontPair: form.fontPair,
            radiusPreset: form.radiusPreset,
            appearance: form.appearance,
            heroEnabled: form.heroEnabled,
            categoriesEnabled: form.categoriesEnabled,
            surMesureEnabled: form.surMesureEnabled,
            contactEmail: form.contactEmail,
            contactPhone: form.contactPhone,
            contactWhatsapp: form.contactWhatsapp,
            contactCity: form.contactCity,
          }}
          patch={patch}
          patchAppearance={patchAppearance}
          mergeAppearance={mergeAppearance}
          replaceAppearance={replaceAppearance}
          applyThemeNow={applyThemeNow}
          themePresets={data?.themePresets ?? null}
          megaMenuEnabled={megaMenuEnabled}
          pageLinkOptions={pageLinkOptions}
          customHeaderPages={customHeaderPages}
          onTogglePageInNav={(page) => togglePageInNav.mutate(page)}
          togglePagePending={togglePageInNav.isPending}
          uploadingLogo={uploadingLogo}
          onLogoUpload={handleLogoUpload}
          logoInputRef={logoInputRef}
          uploadingFavicon={uploadingFavicon}
          onFaviconUpload={handleFaviconUpload}
          faviconInputRef={faviconInputRef}
          publishedHomePage={
            publishedHomePage
              ? { id: publishedHomePage.id, title: publishedHomePage.title }
              : null
          }
          storefrontHref={storefrontHref}
          onSave={handleSave}
          saving={saveMutation.isPending}
        />
        {unsavedDialog}
      </AdminLayout>
    );
  }


  return (
    <AdminLayout
      title="Paramètres"
      breadcrumbs={[{ label: 'Paramètres' }]}
    >
      {unsavedDialog}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Settings2 className="h-7 w-7 text-primary" />
              Paramètres boutique
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Domaine, abonnement, paiements, tracking et conformité.
              {data?.slug ? (
                <span className="mt-1 block font-mono text-xs">slug : {data.slug}</span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data?.slug && storefrontHref ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(storefrontHref);
                      toast.success('Lien boutique copié');
                    } catch {
                      toast.error('Impossible de copier le lien');
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copier le lien
                </Button>
                <Button type="button" variant="outline" className="gap-2" asChild>
                  <a href={storefrontHref} target="troco-storefront" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Voir la boutique
                  </a>
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="shrink-0 gap-2"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </div>


        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link to="/admin/parametres">Apparence</Link>
          </Button>
          <Button type="button" variant="default" size="sm" asChild>
            <Link to="/admin/reglages">Paramètres boutique</Link>
          </Button>
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
<section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Réseaux sociaux</h2>
          <p className="text-sm text-muted-foreground">
            Ces liens sont synchronisés automatiquement vers{' '}
            <Link to="/admin/reseaux-sociaux" className="text-primary underline-offset-2 hover:underline">
              Réseaux sociaux
            </Link>{' '}
            (activation + URL) pour le footer et la page contact.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input
                id="facebookUrl"
                className="mt-1.5"
                value={form.facebookUrl}
                onChange={(e) => patch('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/…"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                className="mt-1.5"
                value={form.instagramUrl}
                onChange={(e) => patch('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/…"
              />
            </div>
            <div>
              <Label htmlFor="tiktokUrl">TikTok</Label>
              <Input
                id="tiktokUrl"
                className="mt-1.5"
                value={form.tiktokUrl}
                onChange={(e) => patch('tiktokUrl', e.target.value)}
                placeholder="https://tiktok.com/@…"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Domaine personnalisé</h2>
          <div>
            <Label htmlFor="customDomain">Domaine (sans https://)</Label>
            <Input
              id="customDomain"
              className="mt-1.5"
              value={form.customDomain}
              onChange={(e) => patch('customDomain', e.target.value)}
              placeholder="boutique.ma"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Vérification DNS :{' '}
              <span className={data?.domainVerified ? 'text-emerald-600' : 'text-amber-600'}>
                {data?.domainVerified ? 'vérifié' : 'en attente'}
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Configuration DNS + HTTPS</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li>
                Chez votre registrar (ou Cloudflare), créez un enregistrement{' '}
                <span className="font-mono text-foreground">CNAME</span> pour{' '}
                <span className="font-mono text-foreground">
                  {form.customDomain || 'votre-domaine.ma'}
                </span>{' '}
                pointant vers{' '}
                <span className="font-mono text-foreground">
                  {data?.slug || 'votre-slug'}.getstore.com
                </span>
                .
              </li>
              <li>
                <strong className="font-medium text-foreground">HTTPS / SSL</strong> — recommandé :
                proxy Cloudflare (nuage orange) pour un certificat automatique. Sans Cloudflare,
                le SSL est provisionné côté plateforme après validation DNS.
              </li>
              <li>Attendez la propagation DNS (souvent quelques minutes à 24 h).</li>
              <li>Enregistrez le domaine ci-dessus, puis cliquez sur « Vérifier le DNS ».</li>
            </ol>
            {data?.domainVerified ? (
              <p className="mt-3 text-xs text-emerald-700">
                DNS OK — votre boutique doit répondre en HTTPS sur{' '}
                <span className="font-mono">https://{form.customDomain || data.customDomain}</span>.
              </p>
            ) : null}
            {data?.slug ? (
              <p className="mt-3 text-xs">
                Lien temporaire Get STORE :{' '}
                <a
                  className="text-primary underline"
                  href={`/?tenant=${encodeURIComponent(data.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /?tenant={data.slug}
                </a>
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!form.customDomain.trim() || saveMutation.isPending}
            onClick={async () => {
              try {
                // Enregistrer d'abord le domaine saisi
                await saveMutation.mutateAsync({
                  customDomain: form.customDomain
                    .trim()
                    .replace(/^https?:\/\//i, '')
                    .replace(/\/+$/, ''),
                });
                const verified = await platformApi.verifyMyDomain();
                queryClient.setQueryData(['store-settings', 'me'], verified);
                toast.success(
                  verified.domainVerified
                    ? 'Domaine vérifié avec succès'
                    : 'Domaine enregistré — vérification en attente',
                );
                await refreshTenant();
              } catch (err) {
                toastError(err, 'Échec de la vérification DNS');
              }
            }}
          >
            Vérifier le DNS
          </Button>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Abonnement</h2>
          <p className="text-sm text-muted-foreground">
            Plan actuel : <strong>{data?.planName || data?.planCode || '—'}</strong>
            {data?.planPriceMad != null ? ` — ${Number(data.planPriceMad)} DHS / mois` : null}
            {data?.status ? (
              <>
                {' '}
                · Statut boutique : <strong>{data.status}</strong>
              </>
            ) : null}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Mode test : le paiement est simulé (pass) — aucune carte bancaire ni CMI.
          </p>
          <Button type="button" onClick={() => void payPlan()}>
            Simuler le paiement (test)
          </Button>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Pixels & conversion</h2>
          <p className="text-sm text-muted-foreground">
            Meta, TikTok et Google (Analytics / Ads), et relance panier abandonné.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
              <Input
                id="metaPixelId"
                className="mt-1.5"
                value={form.metaPixelId}
                onChange={(e) => patch('metaPixelId', e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label htmlFor="tiktokPixelId">TikTok Pixel ID</Label>
              <Input
                id="tiktokPixelId"
                className="mt-1.5"
                value={form.tiktokPixelId}
                onChange={(e) => patch('tiktokPixelId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="googleAnalyticsId">Google Analytics (GA4)</Label>
              <Input
                id="googleAnalyticsId"
                className="mt-1.5"
                value={form.googleAnalyticsId}
                onChange={(e) => patch('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="googleAdsId">Google Ads</Label>
              <Input
                id="googleAdsId"
                className="mt-1.5"
                value={form.googleAdsId}
                onChange={(e) => patch('googleAdsId', e.target.value)}
                placeholder="AW-XXXXXXXX"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
              <div>
                <Label htmlFor="abandonedCartEnabled" className="cursor-pointer font-medium">
                  Relance panier abandonné
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Capture email/téléphone au checkout et envoi de rappel après délai.
                </p>
              </div>
              <Switch
                id="abandonedCartEnabled"
                checked={form.abandonedCartEnabled}
                onCheckedChange={(checked) => patch('abandonedCartEnabled', checked)}
              />
            </div>
            <div>
              <Label htmlFor="abandonedCartDelayMinutes">Délai relance (minutes)</Label>
              <Input
                id="abandonedCartDelayMinutes"
                type="number"
                min={15}
                className="mt-1.5"
                value={form.abandonedCartDelayMinutes}
                onChange={(e) => patch('abandonedCartDelayMinutes', e.target.value)}
                disabled={!form.abandonedCartEnabled}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Langue de la vitrine</h2>
          <p className="text-sm text-muted-foreground">
            Définissez la langue principale affichée aux visiteurs. Ils pourront toujours changer de
            langue via le sélecteur du header (parmi les langues activées).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="defaultLocale">Langue principale</Label>
              <select
                id="defaultLocale"
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={normalizeLocale(form.defaultLocale)}
                onChange={(e) => {
                  const next = normalizeLocale(e.target.value);
                  setForm((prev) => {
                    const list = parseSupportedLocales(prev.supportedLocales);
                    if (!list.includes(next)) list.push(next);
                    return {
                      ...prev,
                      defaultLocale: next,
                      supportedLocales: list.join(','),
                    };
                  });
                }}
              >
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
            <div>
              <Label>Langues proposées aux visiteurs</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {(
                  [
                    { code: 'fr' as const, label: 'Français' },
                    { code: 'ar' as const, label: 'العربية' },
                    { code: 'en' as const, label: 'English' },
                  ]
                ).map(({ code, label }) => {
                  const primary = normalizeLocale(form.defaultLocale);
                  const active = parseSupportedLocales(form.supportedLocales).includes(code);
                  return (
                    <label
                      key={code}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        disabled={code === primary}
                        onChange={() => {
                          setForm((prev) => {
                            const primaryLocale = normalizeLocale(prev.defaultLocale);
                            const set = new Set(parseSupportedLocales(prev.supportedLocales));
                            if (set.has(code)) {
                              if (code === primaryLocale) return prev;
                              set.delete(code);
                            } else {
                              set.add(code);
                            }
                            set.add(primaryLocale);
                            return { ...prev, supportedLocales: [...set].join(',') };
                          });
                        }}
                      />
                      {label}
                      {code === primary ? (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          principale
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Les visiteurs peuvent changer de langue via le sélecteur du header. Après
                Enregistrer, la vitrine s’ouvre dans la langue principale.
              </p>
            </div>
            <div>
              <Label htmlFor="currency">Devise affichée</Label>
              <Input
                id="currency"
                className="mt-1.5"
                value={form.currency}
                onChange={(e) => patch('currency', e.target.value)}
                placeholder="MAD"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="currencyRatesJson">Taux de change (JSON, base MAD)</Label>
              <Textarea
                id="currencyRatesJson"
                className="mt-1.5 min-h-[72px] font-mono text-xs"
                value={form.currencyRatesJson}
                onChange={(e) => patch('currencyRatesJson', e.target.value)}
                placeholder='{"EUR":0.092,"USD":0.10}'
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-display text-lg font-semibold">Paiements</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajoutez vos clés Stripe, CMI ou PayPal. Le paiement n&apos;apparaît sur votre boutique
              qu&apos;après un test de connexion réussi.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
            <Label htmlFor="paymentCodEnabled" className="cursor-pointer font-medium">
              Paiement à la livraison (COD)
            </Label>
            <Switch
              id="paymentCodEnabled"
              checked={form.paymentCodEnabled}
              onCheckedChange={(checked) => patch('paymentCodEnabled', checked)}
            />
          </div>

          {/* Stripe */}
          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Stripe</p>
                <p className={cn('mt-0.5 flex items-center gap-2 text-xs font-medium', form.stripeReady ? 'text-emerald-600' : 'text-muted-foreground')}>
                  <span className={cn('inline-block h-2 w-2 rounded-full', form.stripeReady ? 'bg-emerald-500' : 'bg-slate-400')} />
                  {form.stripeReady
                    ? 'Actif — paiement vérifié'
                    : form.paymentStripeEnabled && (form.stripePublishableKey || form.stripeSecretKeyConfigured)
                      ? 'Clés à vérifier (Tester & activer)'
                      : 'Non configuré'}
                </p>
              </div>
              <Switch
                checked={form.paymentStripeEnabled}
                onCheckedChange={(checked) => patch('paymentStripeEnabled', checked)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Publishable key</Label>
                <Input
                  className="mt-1 font-mono text-xs"
                  value={form.stripePublishableKey}
                  onChange={(e) => patch('stripePublishableKey', e.target.value)}
                  placeholder="pk_test_…"
                  disabled={!form.paymentStripeEnabled}
                />
              </div>
              <div>
                <Label className="text-xs">Secret key</Label>
                <div className="relative mt-1">
                  <Input
                    type={showStripeSecret ? 'text' : 'password'}
                    className="font-mono text-xs pr-10"
                    value={form.stripeSecretKey}
                    onChange={(e) => patch('stripeSecretKey', e.target.value)}
                    placeholder={
                      form.stripeSecretKeyConfigured
                        ? 'Enregistrée — saisir pour remplacer'
                        : 'sk_test_…'
                    }
                    disabled={!form.paymentStripeEnabled}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowStripeSecret((v) => !v)}
                  >
                    {showStripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                !!testingGateway ||
                !form.paymentStripeEnabled ||
                (!form.stripePublishableKey.trim() && !form.stripeSecretKeyConfigured)
              }
              onClick={async () => {
                setTestingGateway('stripe');
                try {
                  const res = await platformApi.testStoreStripe({
                    stripePublishableKey: form.stripePublishableKey.trim() || undefined,
                    stripeSecretKey: form.stripeSecretKey.trim() || undefined,
                  });
                  applyPaymentSettings(res.settings);
                  toast.success(res.message);
                } catch (err) {
                  toastError(err, 'Test Stripe échoué');
                } finally {
                  setTestingGateway(null);
                }
              }}
            >
              {testingGateway === 'stripe' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tester & activer
            </Button>
          </div>

          {/* CMI */}
          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold">CMI (carte bancaire Maroc)</p>
                <p className={cn('mt-0.5 flex items-center gap-2 text-xs font-medium', form.cmiReady ? 'text-emerald-600' : 'text-muted-foreground')}>
                  <span className={cn('inline-block h-2 w-2 rounded-full', form.cmiReady ? 'bg-emerald-500' : 'bg-slate-400')} />
                  {form.cmiReady
                    ? 'Actif — paiement vérifié'
                    : form.paymentCmiEnabled && (form.cmiClientId || form.cmiStoreKeyConfigured)
                      ? 'Clés à vérifier (Tester & activer)'
                      : 'Non configuré'}
                </p>
              </div>
              <Switch
                checked={form.paymentCmiEnabled}
                onCheckedChange={(checked) => patch('paymentCmiEnabled', checked)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Client ID</Label>
                <Input
                  className="mt-1 font-mono text-xs"
                  value={form.cmiClientId}
                  onChange={(e) => patch('cmiClientId', e.target.value)}
                  disabled={!form.paymentCmiEnabled}
                />
              </div>
              <div>
                <Label className="text-xs">Store key</Label>
                <div className="relative mt-1">
                  <Input
                    type={showCmiSecret ? 'text' : 'password'}
                    className="font-mono text-xs pr-10"
                    value={form.cmiStoreKey}
                    onChange={(e) => patch('cmiStoreKey', e.target.value)}
                    placeholder={
                      form.cmiStoreKeyConfigured
                        ? 'Enregistrée — saisir pour remplacer'
                        : 'Store key NestPay'
                    }
                    disabled={!form.paymentCmiEnabled}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowCmiSecret((v) => !v)}
                  >
                    {showCmiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                !!testingGateway ||
                !form.paymentCmiEnabled ||
                (!form.cmiClientId.trim() && !form.cmiStoreKeyConfigured)
              }
              onClick={async () => {
                setTestingGateway('cmi');
                try {
                  const res = await platformApi.testStoreCmi({
                    cmiClientId: form.cmiClientId.trim() || undefined,
                    cmiStoreKey: form.cmiStoreKey.trim() || undefined,
                  });
                  applyPaymentSettings(res.settings);
                  toast.success(res.message);
                } catch (err) {
                  toastError(err, 'Test CMI échoué');
                } finally {
                  setTestingGateway(null);
                }
              }}
            >
              {testingGateway === 'cmi' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tester & activer
            </Button>
          </div>

          {/* PayPal */}
          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold">PayPal</p>
                <p className={cn('mt-0.5 flex items-center gap-2 text-xs font-medium', form.paypalReady ? 'text-emerald-600' : 'text-muted-foreground')}>
                  <span className={cn('inline-block h-2 w-2 rounded-full', form.paypalReady ? 'bg-emerald-500' : 'bg-slate-400')} />
                  {form.paypalReady
                    ? 'Actif — paiement vérifié'
                    : form.paymentPaypalEnabled && (form.paypalClientId || form.paypalClientSecretConfigured)
                      ? 'Clés à vérifier (Tester & activer)'
                      : 'Non configuré'}
                </p>
              </div>
              <Switch
                checked={form.paymentPaypalEnabled}
                onCheckedChange={(checked) => patch('paymentPaypalEnabled', checked)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Client ID</Label>
                <Input
                  className="mt-1 font-mono text-xs"
                  value={form.paypalClientId}
                  onChange={(e) => patch('paypalClientId', e.target.value)}
                  disabled={!form.paymentPaypalEnabled}
                />
              </div>
              <div>
                <Label className="text-xs">Client secret</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPaypalSecret ? 'text' : 'password'}
                    className="font-mono text-xs pr-10"
                    value={form.paypalClientSecret}
                    onChange={(e) => patch('paypalClientSecret', e.target.value)}
                    placeholder={
                      form.paypalClientSecretConfigured
                        ? 'Enregistré — saisir pour remplacer'
                        : 'Secret PayPal'
                    }
                    disabled={!form.paymentPaypalEnabled}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPaypalSecret((v) => !v)}
                  >
                    {showPaypalSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Mode</Label>
              <select
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.paypalMode}
                disabled={!form.paymentPaypalEnabled}
                onChange={(e) => patch('paypalMode', e.target.value)}
              >
                <option value="sandbox">Sandbox (test)</option>
                <option value="live">Live (production)</option>
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                !!testingGateway ||
                !form.paymentPaypalEnabled ||
                (!form.paypalClientId.trim() && !form.paypalClientSecretConfigured)
              }
              onClick={async () => {
                setTestingGateway('paypal');
                try {
                  const res = await platformApi.testStorePaypal({
                    paypalClientId: form.paypalClientId.trim() || undefined,
                    paypalClientSecret: form.paypalClientSecret.trim() || undefined,
                    paypalMode: form.paypalMode,
                  });
                  applyPaymentSettings(res.settings);
                  toast.success(res.message);
                } catch (err) {
                  toastError(err, 'Test PayPal échoué');
                } finally {
                  setTestingGateway(null);
                }
              }}
            >
              {testingGateway === 'paypal' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tester & activer
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
            <Label htmlFor="paymentBnplEnabled" className="cursor-pointer font-medium">
              Paiement fractionné (BNPL)
            </Label>
            <Switch
              id="paymentBnplEnabled"
              checked={form.paymentBnplEnabled}
              onCheckedChange={(checked) => patch('paymentBnplEnabled', checked)}
            />
          </div>
          <div>
            <Label htmlFor="bnplProvider">Fournisseur BNPL (libellé)</Label>
            <Input
              id="bnplProvider"
              className="mt-1.5"
              value={form.bnplProvider}
              onChange={(e) => patch('bnplProvider', e.target.value)}
              disabled={!form.paymentBnplEnabled}
            />
          </div>
          <div>
            <Label htmlFor="shippingDefaultCarrier">Transporteur par défaut (code)</Label>
            <Input
              id="shippingDefaultCarrier"
              className="mt-1.5 font-mono text-sm"
              value={form.shippingDefaultCarrier}
              onChange={(e) => patch('shippingDefaultCarrier', e.target.value)}
              placeholder="standard"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Fidélité</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
            <Label htmlFor="loyaltyEnabled" className="cursor-pointer font-medium">
              Programme de fidélité actif
            </Label>
            <Switch
              id="loyaltyEnabled"
              checked={form.loyaltyEnabled}
              onCheckedChange={(checked) => patch('loyaltyEnabled', checked)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="loyaltyPointsPerMad">Points par MAD dépensé</Label>
              <Input
                id="loyaltyPointsPerMad"
                className="mt-1.5"
                value={form.loyaltyPointsPerMad}
                onChange={(e) => patch('loyaltyPointsPerMad', e.target.value)}
                disabled={!form.loyaltyEnabled}
              />
            </div>
            <div>
              <Label htmlFor="loyaltyMadPerPoint">MAD par point échangé</Label>
              <Input
                id="loyaltyMadPerPoint"
                className="mt-1.5"
                value={form.loyaltyMadPerPoint}
                onChange={(e) => patch('loyaltyMadPerPoint', e.target.value)}
                disabled={!form.loyaltyEnabled}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Conformité CNDP</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
            <Label htmlFor="cookieConsentRequired" className="cursor-pointer font-medium">
              Bandeau cookies obligatoire
            </Label>
            <Switch
              id="cookieConsentRequired"
              checked={form.cookieConsentRequired}
              onCheckedChange={(checked) => patch('cookieConsentRequired', checked)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="privacyPolicyUrl">URL politique de confidentialité</Label>
              <Input
                id="privacyPolicyUrl"
                className="mt-1.5"
                value={form.privacyPolicyUrl}
                onChange={(e) => patch('privacyPolicyUrl', e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <Label htmlFor="dataRetentionDays">Conservation des données (jours)</Label>
              <Input
                id="dataRetentionDays"
                type="number"
                min={1}
                className="mt-1.5"
                value={form.dataRetentionDays}
                onChange={(e) => patch('dataRetentionDays', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cndpNoticeVersion">Version notice CNDP</Label>
              <Input
                id="cndpNoticeVersion"
                className="mt-1.5"
                value={form.cndpNoticeVersion}
                onChange={(e) => patch('cndpNoticeVersion', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">WhatsApp Business</h2>
          <p className="text-sm text-muted-foreground">
            Chaque boutique utilise son propre numéro WhatsApp Business. Les clients commandent via{' '}
            <code className="text-foreground">wa.me</code> (produit, panier, bouton flottant).
          </p>

          <aside className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Étapes sur Facebook / Meta (une fois par boutique)</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Créez ou ouvrez un compte{' '}
                <a
                  href="https://business.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Meta Business Suite
                </a>
                .
              </li>
              <li>
                Ajoutez WhatsApp →{' '}
                <strong className="font-medium text-foreground">Commencer</strong> / lier un numéro
                (SIM ou numéro existant) dans WhatsApp Business.
              </li>
              <li>
                Vérifiez le numéro (SMS / appel), puis confirmez le profil Business (nom, catégorie,
                horaires).
              </li>
              <li>
                Copiez le numéro international (ex. <code className="text-foreground">+2126…</code>) et
                collez-le ci-dessous. Get STORE ouvre WhatsApp chez le client — pas besoin de Cloud API.
              </li>
            </ol>
            <p className="text-xs">
              Optionnel : activez aussi WhatsApp dans{' '}
              <Link to="/admin/reseaux-sociaux" className="text-primary underline-offset-2 hover:underline">
                Réseaux sociaux
              </Link>{' '}
              si vous préférez une URL <code className="text-foreground">wa.me/…</code> dédiée.
            </p>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="contactWhatsapp">Numéro WhatsApp Business</Label>
              <Input
                id="contactWhatsapp"
                className="mt-1.5"
                value={form.contactWhatsapp}
                onChange={(e) => patch('contactWhatsapp', e.target.value)}
                placeholder="+212612345678"
                inputMode="tel"
                autoComplete="tel"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Format international avec indicatif pays. Si vide, le téléphone de contact est utilisé en
                secours.
              </p>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="whatsappOrderTemplate">Modèle message commande (fiche produit)</Label>
              <Textarea
                id="whatsappOrderTemplate"
                className="mt-1.5 min-h-[88px]"
                value={form.whatsappOrderTemplate}
                onChange={(e) => patch('whatsappOrderTemplate', e.target.value)}
                placeholder="Bonjour, je souhaite commander: {productName} ({url})"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Variables : {'{productName}'}, {'{url}'}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Livraison</h2>
          <div>
            <Label htmlFor="freeShippingThreshold">Seuil livraison gratuite (DH)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              min={0}
              step={1}
              className="mt-1.5"
              value={form.freeShippingThreshold}
              onChange={(e) => patch('freeShippingThreshold', e.target.value)}
              placeholder="750"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                className="mt-1.5"
                value={form.contactEmail}
                onChange={(e) => patch('contactEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input
                id="contactPhone"
                className="mt-1.5"
                value={form.contactPhone}
                onChange={(e) => patch('contactPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contactCity">Ville</Label>
              <Input
                id="contactCity"
                className="mt-1.5"
                value={form.contactCity}
                onChange={(e) => patch('contactCity', e.target.value)}
              />
            </div>
          </div>
        </section>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminStoreSettings;
