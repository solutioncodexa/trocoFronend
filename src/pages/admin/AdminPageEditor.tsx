import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  History,
  Link2,
  Loader2,
  RefreshCw,
  Save,
  Settings2,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import ImageUpload from '@/components/admin/ImageUpload';
import PageBlockBuilder, {
  newBlockClientKey,
  type EditorBlock,
} from '@/components/admin/page-builder/PageBlockBuilder';
import BlockStylePanel from '@/components/admin/page-builder/BlockStylePanel';
import { storePagesApi } from '@/services/api/storePages';
import { storeGlobalSectionsApi } from '@/services/api/storeGlobalSections';
import {
  DEFAULT_APP_BAR,
  parseAppBarConfig,
  type AppBarConfig,
} from '@/types/store-global-sections';
import { uploadImage } from '@/services/api/upload';
import {
  type StorePage,
  type StorePageBlock,
  type StorePageAbVariant,
} from '@/types/store-pages';
import { SYSTEM_NAV_REPLACEMENTS } from '@/config/pageTemplates';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { useAdmin } from '@/contexts/AdminContext';
import { useTenant } from '@/contexts/TenantContext';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { aiCopyApi } from '@/services/api/aiCopy';
import { PERMISSIONS } from '@/config/permissions';

function toLocalInput(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const AdminPageEditor = () => {
  const { isAdmin, hasPermission } = useAdmin();
  const canPublish = isAdmin || hasPermission(PERMISSIONS.PAGES_PUBLISH);
  const { slug: tenantSlug, store } = useTenant();
  const { siteName } = useStoreBrand();
  const { id } = useParams<{ id: string }>();
  const pageId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editLang, setEditLang] = useState<'fr' | 'ar'>('fr');
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const sidebarBeforeExpandRef = useRef(true);
  const [appBar, setAppBar] = useState<AppBarConfig>(DEFAULT_APP_BAR);

  const { data: globalSections = [] } = useQuery({
    queryKey: ['store-global-sections', 'admin'],
    queryFn: () => storeGlobalSectionsApi.listAdmin(),
  });

  useEffect(() => {
    const section = globalSections.find((s) => s.sectionKey === 'app_bar');
    if (section?.config) setAppBar(parseAppBarConfig(section.config));
  }, [globalSections]);

  const appBarMutation = useMutation({
    mutationFn: () =>
      storeGlobalSectionsApi.upsert({
        sectionKey: 'app_bar',
        enabled: true,
        config: { ...appBar },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-global-sections'] });
      toast.success('En-tête global enregistré');
    },
    onError: (err: unknown) => toastError(err, 'Impossible d’enregistrer l’app bar'),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-pages', pageId],
    queryFn: () => storePagesApi.get(pageId),
    enabled: Number.isFinite(pageId),
  });

  const { data: versions = [], refetch: refetchVersions } = useQuery({
    queryKey: ['store-pages', pageId, 'versions'],
    queryFn: () => storePagesApi.versions(pageId),
    enabled: Number.isFinite(pageId),
  });

  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [slug, setSlug] = useState('');
  const [isHome, setIsHome] = useState(false);
  const [showInNav, setShowInNav] = useState(true);
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [seoTitleAr, setSeoTitleAr] = useState('');
  const [seoDescriptionAr, setSeoDescriptionAr] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [unpublishAt, setUnpublishAt] = useState('');
  const [abVariant, setAbVariant] = useState<StorePageAbVariant>(null);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const aiTopic = useMemo(() => title.trim() || slug.trim() || 'notre boutique', [title, slug]);

  const runAiCopy = async (kind: 'seo_title' | 'seo_description' | 'hero') => {
    setAiLoading(kind);
    try {
      const result = await aiCopyApi.generate({
        kind,
        topic: aiTopic,
        storeName: siteName,
        tone: 'friendly',
      });
      if (kind === 'seo_title') {
        const text = String(result.text ?? '');
        if (editLang === 'ar') setSeoTitleAr(text);
        else setSeoTitle(text);
      } else if (kind === 'seo_description') {
        const text = String(result.text ?? '');
        if (editLang === 'ar') setSeoDescriptionAr(text);
        else setSeoDescription(text);
      } else if (kind === 'hero') {
        const heroIndex = blocks.findIndex((b) => b.type === 'hero');
        if (heroIndex < 0) {
          toast.message('Ajoutez un bloc Hero pour remplir le contenu.');
          return;
        }
        const headline = String(result.headline ?? '');
        const subtext = String(result.subtext ?? '');
        const ctaLabel = String(result.ctaLabel ?? '');
        setBlocks((prev) =>
          prev.map((b, i) => {
            if (i !== heroIndex) return b;
            const patch =
              editLang === 'ar'
                ? {
                    configAr: {
                      ...(b.configAr ?? {}),
                      ...(headline ? { headline } : {}),
                      ...(subtext ? { subtext } : {}),
                      ...(ctaLabel ? { ctaLabel } : {}),
                    },
                  }
                : {
                    config: {
                      ...(b.config ?? {}),
                      ...(headline ? { headline } : {}),
                      ...(subtext ? { subtext } : {}),
                      ...(ctaLabel ? { ctaLabel } : {}),
                    },
                  };
            return { ...b, ...patch };
          }),
        );
        toast.success('Bloc hero rempli');
        return;
      }
      toast.success('Texte généré');
    } catch (err) {
      toastError(err, 'Génération impossible');
    } finally {
      setAiLoading(null);
    }
  };

  useEffect(() => {
    if (!data) return;
    setTitle(data.title);
    setTitleAr(data.titleAr ?? '');
    setSlug(data.slug);
    setIsHome(!!data.isHome);
    setShowInNav(!!data.showInNav);
    setPublished(!!data.published);
    setSeoTitle(data.seoTitle ?? '');
    setSeoDescription(data.seoDescription ?? '');
    setOgImageUrl(data.ogImageUrl ?? '');
    setSeoTitleAr(data.seoTitleAr ?? '');
    setSeoDescriptionAr(data.seoDescriptionAr ?? '');
    setPublishAt(toLocalInput(data.publishAt));
    setUnpublishAt(toLocalInput(data.unpublishAt));
    const v = data.abVariant?.toUpperCase();
    setAbVariant(v === 'A' || v === 'B' ? v : null);
    setBlocks(
      (data.blocks ?? []).map((b, i) => ({
        ...b,
        sortOrder: b.sortOrder ?? i,
        config: { ...(b.config ?? {}) },
        configAr: { ...(b.configAr ?? {}) },
        visibleMobile: b.visibleMobile !== false,
        visibleDesktop: b.visibleDesktop !== false,
        clientKey: b.id != null ? `id-${b.id}` : newBlockClientKey(),
      })),
    );
  }, [data]);

  const previewPage: StorePage = useMemo(
    () => ({
      id: pageId,
      title: editLang === 'ar' && titleAr ? titleAr : title || 'Aperçu',
      titleAr,
      slug: slug || 'apercu',
      isHome,
      showInNav,
      published,
      sortOrder: 0,
      seoTitle: editLang === 'ar' && seoTitleAr ? seoTitleAr : seoTitle,
      seoDescription: editLang === 'ar' && seoDescriptionAr ? seoDescriptionAr : seoDescription,
      ogImageUrl,
      blocks: blocks.map((b, i) => {
        const config =
          editLang === 'ar' && b.configAr && Object.keys(b.configAr).length
            ? { ...b.config, ...b.configAr }
            : b.config;
        return {
          id: b.id,
          type: b.type,
          sortOrder: i,
          config,
          configAr: b.configAr,
          visibleMobile: b.visibleMobile,
          visibleDesktop: b.visibleDesktop,
        };
      }),
    }),
    [
      pageId,
      title,
      titleAr,
      slug,
      isHome,
      showInNav,
      published,
      seoTitle,
      seoDescription,
      seoTitleAr,
      seoDescriptionAr,
      ogImageUrl,
      blocks,
      editLang,
    ],
  );

  const metaMutation = useMutation({
    mutationFn: () =>
      storePagesApi.update(pageId, {
        title: title.trim(),
        titleAr: titleAr.trim(),
        slug: slug.trim(),
        isHome,
        showInNav,
        published,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        ogImageUrl: ogImageUrl.trim(),
        seoTitleAr: seoTitleAr.trim(),
        seoDescriptionAr: seoDescriptionAr.trim(),
        publishAt: publishAt ? new Date(publishAt).toISOString() : null,
        unpublishAt: unpublishAt ? new Date(unpublishAt).toISOString() : null,
        clearPublishAt: !publishAt,
        clearUnpublishAt: !unpublishAt,
        abVariant: isHome ? abVariant : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      void refetchVersions();
      toast.success('Paramètres enregistrés');
    },
    onError: (err) => toastError(err, 'Enregistrement impossible'),
  });

  const blocksMutation = useMutation({
    mutationFn: () => storePagesApi.replaceBlocks(pageId, blocks, 'Éditeur'),
    onSuccess: (page) => {
      queryClient.setQueryData(['store-pages', pageId], page);
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      void refetchVersions();
      toast.success('Composants enregistrés');
    },
    onError: (err) => toastError(err, 'Enregistrement des composants impossible'),
  });

  const restoreMutation = useMutation({
    mutationFn: (versionId: number) => storePagesApi.restoreVersion(pageId, versionId),
    onSuccess: (page) => {
      queryClient.setQueryData(['store-pages', pageId], page);
      void refetchVersions();
      toast.success('Version restaurée');
    },
    onError: (err) => toastError(err, 'Restauration impossible'),
  });

  const buildPreviewUrl = (path: string) => {
    const slug = tenantSlug ?? store?.slug;
    const q = slug ? `?tenant=${encodeURIComponent(slug)}` : '';
    return `${window.location.origin}${path}${q}`;
  };

  const copyPreviewUrl = async (path: string) => {
    const url = buildPreviewUrl(path);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lien d’aperçu copié dans le presse-papiers');
    } catch {
      window.prompt('Lien d’aperçu (copiez-le)', url);
    }
  };

  const previewLinkMutation = useMutation({
    mutationFn: () => storePagesApi.issuePreviewLink(pageId),
    onSuccess: ({ path }) => {
      void copyPreviewUrl(path);
      queryClient.invalidateQueries({ queryKey: ['store-pages', pageId] });
    },
    onError: (err) => toastError(err, 'Impossible de générer le lien'),
  });

  const rotatePreviewMutation = useMutation({
    mutationFn: () => storePagesApi.rotatePreviewLink(pageId),
    onSuccess: ({ path }) => {
      void copyPreviewUrl(path);
      queryClient.invalidateQueries({ queryKey: ['store-pages', pageId] });
      toast.success('Nouveau lien d’aperçu généré');
    },
    onError: (err) => toastError(err, 'Impossible de régénérer le lien'),
  });

  const patchBlockConfig = (index: number, key: string, value: unknown) => {
    setBlocks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        if (editLang === 'ar') {
          return { ...b, configAr: { ...(b.configAr ?? {}), [key]: value } };
        }
        return { ...b, config: { ...b.config, [key]: value } };
      }),
    );
  };

  /** Style / position / couleurs : toujours sur config FR (partagé). */
  const patchBlockStyle = (index: number, key: string, value: unknown) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i !== index ? b : { ...b, config: { ...b.config, [key]: value } })),
    );
  };

  const replacesSystem = (SYSTEM_NAV_REPLACEMENTS as readonly string[]).includes(
    slug.trim().toLowerCase(),
  );

  if (!Number.isFinite(pageId)) {
    return (
      <AdminLayout title="Page">
        <p className="p-6">Page invalide</p>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout title="Éditer la page">
        <div className="p-8 text-center text-muted-foreground">Chargement…</div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout title="Éditer la page">
        <div className="p-6">
          <p className="text-destructive">Page introuvable</p>
          <Button className="mt-4" onClick={() => navigate('/admin/pages')}>
            Retour
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      workspace
      title={`Constructeur — ${data.title}`}
      breadcrumbs={[
        { label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' },
        { label: 'Pages', href: '/admin/pages' },
        { label: data.title },
      ]}
      sidebarOpen={adminSidebarOpen}
      onSidebarOpenChange={setAdminSidebarOpen}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link to="/admin/pages">
              <ArrowLeft className="h-3.5 w-3.5" />
              Liste
            </Link>
          </Button>
        </div>
      }
    >
      <>
        <PageBlockBuilder
          blocks={blocks}
          onChange={setBlocks}
          onSave={() => blocksMutation.mutate()}
          saving={blocksMutation.isPending}
          editLang={editLang}
          previewPage={previewPage}
          appBar={appBar}
          onAppBarChange={(patch) => setAppBar((prev) => ({ ...prev, ...patch }))}
          onAppBarSave={() => appBarMutation.mutate()}
          appBarSaving={appBarMutation.isPending}
          onExpandedChange={(expanded) => {
            if (expanded) {
              sidebarBeforeExpandRef.current = adminSidebarOpen;
              setAdminSidebarOpen(false);
            } else {
              setAdminSidebarOpen(sidebarBeforeExpandRef.current);
            }
          }}
          toolbarExtra={
            <>
              <div className="flex rounded-lg border border-border p-0.5">
                <Button
                  size="sm"
                  variant={editLang === 'fr' ? 'default' : 'ghost'}
                  className="h-8 px-2"
                  onClick={() => setEditLang('fr')}
                >
                  FR
                </Button>
                <Button
                  size="sm"
                  variant={editLang === 'ar' ? 'default' : 'ghost'}
                  className="h-8 px-2"
                  onClick={() => setEditLang('ar')}
                >
                  AR
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                disabled={previewLinkMutation.isPending}
                onClick={() => previewLinkMutation.mutate()}
              >
                {previewLinkMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Aperçu</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                title="Régénérer le lien d’aperçu"
                disabled={rotatePreviewMutation.isPending}
                onClick={() => rotatePreviewMutation.mutate()}
              >
                {rotatePreviewMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Réglages</span>
              </Button>
            </>
          }
          renderFields={(block, index) => (
            <div className="space-y-4">
              <BlockStylePanel
                blockType={String(block.type)}
                config={block.config ?? {}}
                onChange={(key, value) => patchBlockStyle(index, key, value)}
              />
              <div className="space-y-3 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contenu
                </p>
                <BlockFields
                  block={block}
                  lang={editLang}
                  onChange={(key, value) => patchBlockConfig(index, key, value)}
                />
              </div>
            </div>
          )}
        />

        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-display">Réglages de la page</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
          <h2 className="sr-only">Paramètres</h2>
          <div>
            <Label>Titre {editLang === 'ar' ? '(AR)' : ''}</Label>
            {editLang === 'ar' ? (
              <Input className="mt-1.5" dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
            ) : (
              <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} />
            )}
          </div>
          <div>
            <Label>Slug</Label>
            <Input className="mt-1.5 font-mono text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} />
            {replacesSystem ? (
              <p className="mt-2 rounded-lg bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800">
                Remplace /{slug} dans le menu
              </p>
            ) : null}
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO</p>
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  disabled={!!aiLoading}
                  onClick={() => void runAiCopy('seo_title')}
                >
                  {aiLoading === 'seo_title' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Titre IA
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  disabled={!!aiLoading}
                  onClick={() => void runAiCopy('seo_description')}
                >
                  {aiLoading === 'seo_description' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Desc. IA
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  disabled={!!aiLoading}
                  onClick={() => void runAiCopy('hero')}
                >
                  {aiLoading === 'hero' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Hero IA
                </Button>
              </div>
            </div>
            <div>
              <Label>Meta title {editLang === 'ar' ? 'AR' : ''}</Label>
              <Input
                className="mt-1.5"
                dir={editLang === 'ar' ? 'rtl' : undefined}
                value={editLang === 'ar' ? seoTitleAr : seoTitle}
                onChange={(e) =>
                  editLang === 'ar' ? setSeoTitleAr(e.target.value) : setSeoTitle(e.target.value)
                }
              />
            </div>
            <div>
              <Label>Meta description</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                dir={editLang === 'ar' ? 'rtl' : undefined}
                value={editLang === 'ar' ? seoDescriptionAr : seoDescription}
                onChange={(e) =>
                  editLang === 'ar'
                    ? setSeoDescriptionAr(e.target.value)
                    : setSeoDescription(e.target.value)
                }
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Image OG</Label>
              <ImageUpload value={ogImageUrl} onChange={setOgImageUrl} onUpload={uploadImage} />
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Planification
            </p>
            <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 px-3 py-2.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Conseils performance (Lighthouse)</p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5">
                <li>Images hors hero : chargement différé (lazy) côté vitrine</li>
                <li>Renseignez une image OG pour le partage social</li>
                <li>Utilisez la planification pour publier / dépublier automatiquement</li>
              </ul>
            </div>
            <div>
              <Label>Publier à</Label>
              <Input
                type="datetime-local"
                className="mt-1.5"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
              />
            </div>
            <div>
              <Label>Dépublier à</Label>
              <Input
                type="datetime-local"
                className="mt-1.5"
                value={unpublishAt}
                onChange={(e) => setUnpublishAt(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Page d’accueil</span>
            <Switch checked={isHome} onCheckedChange={setIsHome} />
          </label>
          {isHome ? (
            <div>
              <Label>Variante A/B (accueil)</Label>
              <Select
                value={abVariant ?? 'none'}
                onValueChange={(v) =>
                  setAbVariant(v === 'none' ? null : (v as StorePageAbVariant))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune (page unique)</SelectItem>
                  <SelectItem value="A">Variante A</SelectItem>
                  <SelectItem value="B">Variante B</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Deux pages d’accueil publiées (A et B) activent le test sticky visiteur.
              </p>
            </div>
          ) : null}
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Menu</span>
            <Switch checked={showInNav} onCheckedChange={setShowInNav} disabled={isHome} />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Publiée</span>
            <Switch
              checked={published}
              onCheckedChange={setPublished}
              disabled={!canPublish}
            />
          </label>
          {!canPublish ? (
            <p className="text-xs text-muted-foreground">
              Publication réservée aux comptes avec la permission « Publier les pages » ou administrateur.
            </p>
          ) : null}
          {data.currentlyLive != null ? (
            <p className="text-xs text-muted-foreground">
              Statut live : {data.currentlyLive ? 'visible' : 'hors ligne (planning)'}
            </p>
          ) : null}

          <Button className="w-full gap-2" disabled={metaMutation.isPending} onClick={() => metaMutation.mutate()}>
            {metaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer paramètres
          </Button>

          <div className="border-t border-border pt-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <History className="h-3.5 w-3.5" /> Versions
            </p>
            <ul className="max-h-40 space-y-1 overflow-y-auto text-xs">
              {versions.slice(0, 12).map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-2 py-1.5">
                  <span className="min-w-0 truncate">
                    {v.label}
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {new Date(v.createdAt).toLocaleString('fr-MA')}
                    </span>
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 shrink-0 px-2"
                    disabled={restoreMutation.isPending}
                    onClick={() => {
                      if (window.confirm('Restaurer cette version ?')) {
                        restoreMutation.mutate(v.id);
                      }
                    }}
                  >
                    OK
                  </Button>
                </li>
              ))}
              {versions.length === 0 ? (
                <li className="text-muted-foreground">Aucune version encore</li>
              ) : null}
            </ul>
          </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    </AdminLayout>
  );
};

function BlockFields({
  block,
  lang,
  onChange,
}: {
  block: StorePageBlock;
  lang: 'fr' | 'ar';
  onChange: (key: string, value: unknown) => void;
}) {
  const base = block.config ?? {};
  const ar = block.configAr ?? {};
  const c = lang === 'ar' ? { ...base, ...ar } : base;
  const dir = lang === 'ar' ? 'rtl' : undefined;

  const field = (key: string, label: string, multiline = false) => (
    <div key={key}>
      <Label>{label}</Label>
      {multiline ? (
        <Textarea
          className="mt-1.5"
          rows={3}
          dir={dir}
          value={String(c[key] ?? '')}
          onChange={(e) => onChange(key, e.target.value)}
        />
      ) : (
        <Input
          className="mt-1.5"
          dir={dir}
          value={String(c[key] ?? '')}
          onChange={(e) => onChange(key, e.target.value)}
        />
      )}
    </div>
  );

  const imageField = (key: string, label: string) => (
    <div key={key} className="sm:col-span-2">
      <Label className="mb-1.5 block">{label}</Label>
      <ImageUpload
        value={String(c[key] ?? '')}
        onChange={(url) => onChange(key, url)}
        onUpload={uploadImage}
      />
    </div>
  );

  switch (block.type) {
    case 'hero':
      return (
        <div className="grid gap-3">
          {field('headline', 'Grand titre')}
          {field('subtext', 'Phrase sous le titre', true)}
          {field('ctaLabel', 'Texte du bouton')}
          {field('ctaHref', 'Lien du bouton (ex. /boutique)')}
          {imageField('imageUrl', 'Photo de fond')}
        </div>
      );
    case 'rich_text':
      return (
        <div className="grid gap-3">
          {field('title', 'Titre de la section')}
          {field('body', 'Votre texte', true)}
        </div>
      );
    case 'products':
      return (
        <div className="grid gap-3">
          {field('title', 'Titre de la section')}
          <div>
            <Label>Combien de produits afficher ?</Label>
            <Input
              className="mt-1.5"
              type="number"
              min={1}
              max={24}
              value={Number(c.limit ?? 8)}
              onChange={(e) => onChange('limit', Number(e.target.value) || 8)}
            />
          </div>
        </div>
      );
    case 'categories':
      return <div className="grid gap-3">{field('title', 'Titre de la section')}</div>;
    case 'cta':
    case 'countdown':
      return (
        <div className="grid gap-3">
          {field('title', 'Titre')}
          {field(
            block.type === 'countdown' ? 'subtitle' : 'body',
            block.type === 'countdown' ? 'Sous-titre' : 'Message',
            true,
          )}
          {block.type === 'countdown' ? field('endsAt', 'Date et heure de fin') : null}
          {field('ctaLabel', 'Texte du bouton')}
          {field('ctaHref', 'Lien du bouton')}
        </div>
      );
    case 'image':
      return (
        <div className="grid gap-3">
          {imageField('imageUrl', 'Votre image')}
          {field('alt', 'Description courte (accessibilité)')}
          {field('caption', 'Légende sous l’image')}
        </div>
      );
    case 'video':
      return (
        <div className="grid gap-3">
          {field('title', 'Titre')}
          {field('url', 'Lien de la vidéo (YouTube, Vimeo…)')}
        </div>
      );
    case 'faq':
    case 'testimonials': {
      const items = Array.isArray(c.items) ? (c.items as Record<string, string>[]) : [];
      const isFaq = block.type === 'faq';
      return (
        <div className="space-y-3">
          {field('title', 'Titre de la section')}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {isFaq ? `Question ${i + 1}` : `Avis ${i + 1}`}
                </p>
                {isFaq ? (
                  <>
                    <Input
                      placeholder="Question"
                      value={String(item.q ?? '')}
                      onChange={(e) => {
                        const next = items.map((it, j) =>
                          j === i ? { ...it, q: e.target.value } : it,
                        );
                        onChange('items', next);
                      }}
                    />
                    <Textarea
                      placeholder="Réponse"
                      rows={2}
                      value={String(item.a ?? '')}
                      onChange={(e) => {
                        const next = items.map((it, j) =>
                          j === i ? { ...it, a: e.target.value } : it,
                        );
                        onChange('items', next);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Nom du client"
                      value={String(item.name ?? '')}
                      onChange={(e) => {
                        const next = items.map((it, j) =>
                          j === i ? { ...it, name: e.target.value } : it,
                        );
                        onChange('items', next);
                      }}
                    />
                    <Textarea
                      placeholder="Son avis"
                      rows={2}
                      value={String(item.text ?? '')}
                      onChange={(e) => {
                        const next = items.map((it, j) =>
                          j === i ? { ...it, text: e.target.value } : it,
                        );
                        onChange('items', next);
                      }}
                    />
                    <Input
                      placeholder="Ville ou rôle (optionnel)"
                      value={String(item.role ?? '')}
                      onChange={(e) => {
                        const next = items.map((it, j) =>
                          j === i ? { ...it, role: e.target.value } : it,
                        );
                        onChange('items', next);
                      }}
                    />
                  </>
                )}
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                onChange(
                  'items',
                  isFaq
                    ? [...items, { q: '', a: '' }]
                    : [...items, { name: '', text: '', role: '' }],
                )
              }
            >
              {isFaq ? 'Ajouter une question' : 'Ajouter un avis'}
            </Button>
          </div>
        </div>
      );
    }
    case 'instagram':
      return (
        <div className="space-y-3">
          {field('title', 'Titre')}
          {field('handle', 'Compte Instagram (sans @)')}
          <div>
            <Label>Liens des photos (une par ligne)</Label>
            <Textarea
              className="mt-1.5 text-xs"
              rows={5}
              placeholder="https://…"
              value={(Array.isArray(c.images) ? (c.images as string[]) : []).join('\n')}
              onChange={(e) =>
                onChange(
                  'images',
                  e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </div>
      );
    case 'spacer':
      return (
        <div>
          <Label>Taille de l’espace</Label>
          <Select value={String(c.size ?? 'md')} onValueChange={(v) => onChange('size', v)}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Petit</SelectItem>
              <SelectItem value="md">Moyen</SelectItem>
              <SelectItem value="lg">Grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case 'contact':
      return (
        <div className="grid gap-3">
          {field('title', 'Titre')}
          {field('body', 'Message d’introduction', true)}
          <div>
            <Label>À quoi sert ce formulaire ?</Label>
            <Select
              value={String(c.leadType ?? 'lead')}
              onValueChange={(v) => onChange('leadType', v)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Demande de contact</SelectItem>
                <SelectItem value="newsletter">Inscription e-mail</SelectItem>
                <SelectItem value="devis">Demande de devis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Cette section n’a pas encore de réglages simples.
        </p>
      );
  }
}

export default AdminPageEditor;
