import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Eye, ImagePlus, Loader2, Save, Settings2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { platformApi } from '@/services/api/platform';
import { getImageUrl, uploadImage } from '@/services/api/upload';
import type { UpdateStoreSettingsRequest } from '@/types/api';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { storeThemeStyleVars } from '@/utils/storeTheme';
import {
  STORE_THEMES,
  designDemoPath,
  normalizeThemeKey,
  type StoreThemeKey,
} from '@/config/storeThemes';

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
  metaPixelId: string;
  tiktokPixelId: string;
  googleAdsId: string;
  googleAnalyticsId: string;
  abandonedCartEnabled: boolean;
  abandonedCartDelayMinutes: string;
  whatsappOrderTemplate: string;
};

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
  metaPixelId: '',
  tiktokPixelId: '',
  googleAdsId: '',
  googleAnalyticsId: '',
  abandonedCartEnabled: false,
  abandonedCartDelayMinutes: '60',
  whatsappOrderTemplate: '',
};

const AdminStoreSettings = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { refresh: refreshTenant, loadFromAdminSession } = useTenant();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const applyThemeHandled = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-settings', 'me'],
    queryFn: () => platformApi.getMyStoreSettings(),
  });

  useEffect(() => {
    if (!data) return;
    setForm({
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
      metaPixelId: data.metaPixelId ?? '',
      tiktokPixelId: data.tiktokPixelId ?? '',
      googleAdsId: data.googleAdsId ?? '',
      googleAnalyticsId: data.googleAnalyticsId ?? '',
      abandonedCartEnabled: data.abandonedCartEnabled ?? false,
      abandonedCartDelayMinutes:
        data.abandonedCartDelayMinutes != null ? String(data.abandonedCartDelayMinutes) : '60',
      whatsappOrderTemplate: data.whatsappOrderTemplate ?? '',
    });
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
    if (!data) return;
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
      void (async () => {
        try {
          const updated = await platformApi.updateMyStoreSettings({
            primaryColor: primary,
            secondaryColor: secondary,
          });
          queryClient.setQueryData(['store-settings', 'me'], updated);
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
      toast.success('Paramètres boutique enregistrés');
      await refreshTenant();
      await loadFromAdminSession();
    },
    onError: (err: unknown) => toastError(err, 'Erreur lors de la sauvegarde'),
  });

  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyThemeNow = async (themeKey: StoreThemeKey) => {
    patch('themeKey', themeKey);
    try {
      const updated = await platformApi.updateMyStoreSettings({ themeKey });
      queryClient.setQueryData(['store-settings', 'me'], updated);
      toast.success(`Design « ${themeKey} » appliqué à votre vitrine`);
      await refreshTenant();
      await loadFromAdminSession();
    } catch (err) {
      toastError(err, 'Impossible d’appliquer le design');
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
      <AdminLayout title="Paramètres boutique" breadcrumbs={[{ label: 'Paramètres boutique' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Paramètres boutique" breadcrumbs={[{ label: 'Paramètres boutique' }]}>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 font-medium text-red-800">Erreur de chargement</h3>
          <p className="text-red-600">Impossible de charger les paramètres boutique.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Paramètres boutique" breadcrumbs={[{ label: 'Paramètres boutique' }]}>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Settings2 className="h-7 w-7 text-primary" />
              Paramètres boutique
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Identité, domaine personnalisé, contact et sections de l&apos;accueil.
              {data?.slug ? (
                <span className="mt-1 block font-mono text-xs">slug : {data.slug}</span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data?.slug ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    const url = buildStorefrontUrl(data.slug);
                    try {
                      await navigator.clipboard.writeText(url);
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
                  <a href={buildStorefrontUrl(data.slug)} target="_blank" rel="noopener noreferrer">
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

        {/* Aperçu live — couleurs scopées ici uniquement (pas l’admin / Matjarona). */}
        <div
          className="storefront-skin overflow-hidden rounded-2xl border border-border"
          style={{
            ...storeThemeStyleVars({
              primaryColor: form.primaryColor,
              secondaryColor: form.secondaryColor,
            }),
            borderColor: form.primaryColor || undefined,
            background: `linear-gradient(135deg, ${form.primaryColor || '#0d9488'}22, transparent 60%)`,
          }}
        >
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-14 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card/80">
              {form.logoUrl ? (
                <img
                  src={getImageUrl(form.logoUrl)}
                  alt=""
                  className="max-h-full max-w-full object-contain p-1"
                />
              ) : (
                <span
                  className="font-display text-sm font-bold text-primary"
                  style={{ color: form.primaryColor || undefined }}
                >
                  {(form.siteName || 'Boutique').slice(0, 12)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Aperçu vitrine (votre boutique seulement)
              </p>
              <p className="truncate font-display text-lg font-semibold">
                {form.siteName || 'Nom de la boutique'}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {form.tagline || 'Votre accroche apparaîtra ici'}
              </p>
              <div className="mt-2 flex gap-2">
                <span
                  className="inline-flex rounded-md px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  style={{ backgroundColor: form.primaryColor || '#0d9488' }}
                >
                  Bouton
                </span>
                <span
                  className="inline-flex rounded-md border px-2.5 py-1 text-xs font-medium"
                  style={{
                    borderColor: form.secondaryColor || '#0369a1',
                    color: form.secondaryColor || '#0369a1',
                  }}
                >
                  Secondaire
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Identité</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                className="mt-1.5"
                value={form.siteName}
                onChange={(e) => patch('siteName', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tagline">Accroche</Label>
              <Input
                id="tagline"
                className="mt-1.5"
                value={form.tagline}
                onChange={(e) => patch('tagline', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="aboutText">À propos</Label>
              <Textarea
                id="aboutText"
                className="mt-1.5 min-h-[100px]"
                value={form.aboutText}
                onChange={(e) => patch('aboutText', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <Label>Logo</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex h-20 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30">
                  {form.logoUrl ? (
                    <img
                      src={getImageUrl(form.logoUrl)}
                      alt="Aperçu logo"
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun logo</span>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Input
                    id="logoUrl"
                    value={form.logoUrl}
                    onChange={(e) => patch('logoUrl', e.target.value)}
                    placeholder="URL du logo ou upload"
                  />
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                      className="sr-only"
                      onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={uploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {uploadingLogo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                      {uploadingLogo ? 'Upload…' : 'Uploader un logo'}
                    </Button>
                    {form.logoUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => patch('logoUrl', '')}
                      >
                        Retirer
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="faviconUrl">URL du favicon</Label>
              <Input
                id="faviconUrl"
                className="mt-1.5"
                value={form.faviconUrl}
                onChange={(e) => patch('faviconUrl', e.target.value)}
                placeholder="https://… ou /uploads/…"
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Couleur primaire</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="primaryColor"
                  value={form.primaryColor}
                  onChange={(e) => patch('primaryColor', e.target.value)}
                  placeholder="#0d9488"
                />
                <input
                  type="color"
                  aria-label="Sélecteur couleur primaire"
                  className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                  value={/^#[0-9a-fA-F]{6}$/.test(form.primaryColor) ? form.primaryColor : '#0d9488'}
                  onChange={(e) => patch('primaryColor', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Couleur secondaire</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="secondaryColor"
                  value={form.secondaryColor}
                  onChange={(e) => patch('secondaryColor', e.target.value)}
                  placeholder="#0a1628"
                />
                <input
                  type="color"
                  aria-label="Sélecteur couleur secondaire"
                  className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                  value={
                    /^#[0-9a-fA-F]{6}$/.test(form.secondaryColor) ? form.secondaryColor : '#0a1628'
                  }
                  onChange={(e) => patch('secondaryColor', e.target.value)}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
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
          </div>
        </section>

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
                  {data?.slug || 'votre-slug'}.matjarona.ma
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
                Lien temporaire Matjarona :{' '}
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
          <h2 className="font-display text-lg font-semibold">Design de la vitrine</h2>
          <p className="text-sm text-muted-foreground">
            Explorez une démo, puis appliquez le design à <strong>votre</strong> boutique. Vos
            couleurs et logo restent les vôtres.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {STORE_THEMES.map((theme) => {
              const selected = form.themeKey === theme.key;
              return (
                <div
                  key={theme.key}
                  className={`rounded-xl border p-4 transition ${
                    selected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                      : 'border-border'
                  }`}
                >
                  <div
                    className="mb-3 h-14 overflow-hidden rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.demoPrimary}, ${theme.demoSecondary})`,
                    }}
                    aria-hidden
                  />
                  <p className="font-display font-semibold">{theme.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" className="gap-1.5" asChild>
                      <Link to={designDemoPath(theme.key)} target="_blank" rel="noreferrer">
                        <Eye className="h-3.5 w-3.5" />
                        Explorer la démo
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={selected ? 'default' : 'secondary'}
                      onClick={() => void applyThemeNow(theme.key)}
                    >
                      {selected ? 'Design actif' : 'Appliquer'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
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
                collez-le ci-dessous. Matjarona ouvre WhatsApp chez le client — pas besoin de Cloud API.
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

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Sections accueil</h2>
          <div className="space-y-4">
            {(
              [
                ['heroEnabled', 'Hero'] as const,
                ['categoriesEnabled', 'Catégories'] as const,
                ['surMesureEnabled', 'Sur mesure'] as const,
              ] as const
            ).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3"
              >
                <Label htmlFor={key} className="cursor-pointer font-medium">
                  Afficher « {label} »
                </Label>
                <Switch
                  id={key}
                  checked={form[key]}
                  onCheckedChange={(checked) => patch(key, checked)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminStoreSettings;
