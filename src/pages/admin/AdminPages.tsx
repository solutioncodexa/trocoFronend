import { Link, useNavigate } from 'react-router-dom';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Copy,
  Download,
  ExternalLink,
  FilePlus2,
  GripVertical,
  Home,
  LayoutTemplate,
  Loader2,
  MoreHorizontal,
  Navigation,
  Pencil,
  Search,
  Trash2,
  Upload,
  Trophy,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { BoutiqueWorkspaceLinks } from '@/components/admin/BoutiqueWorkspaceLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storePagesApi } from '@/services/api/storePages';
import { PAGE_TEMPLATES, type PageTemplate } from '@/config/pageTemplates';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { useRef, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useTenant } from '@/contexts/TenantContext';
import { PERMISSIONS } from '@/config/permissions';
import {
  BLOCK_CATALOG,
  type StorePageBlockType,
  type StorePageExportPayload,
  type StorePageListItem,
} from '@/types/store-pages';
import { EmptyState } from '@/components/ui/EmptyState';
import BlockPalettePreview from '@/components/admin/page-builder/BlockPalettePreview';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'published' | 'draft';

const AdminPages = () => {
  const { t } = useAdminLocale();
  const { isAdmin, hasPermission } = useAdmin();
  const canPublish = isAdmin || hasPermission(PERMISSIONS.PAGES_PUBLISH);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const importInputRef = useRef<HTMLInputElement>(null);
  const createRef = useRef<HTMLElement>(null);
  const [title, setTitle] = useState('');
  const [asHome, setAsHome] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);
  const [starterTypes, setStarterTypes] = useState<StorePageBlockType[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const starterDragFrom = useRef<number | null>(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['store-pages'],
    queryFn: () => storePagesApi.list(),
  });

  const { store } = useTenant();
  const planCode = (store?.planCode || 'basic').toLowerCase();
  const abTestingAllowed = planCode !== 'basic';
  const fullPageBuilder = planCode === 'business' || planCode === 'pro';

  const { data: analytics = [] } = useQuery({
    queryKey: ['store-pages', 'analytics'],
    queryFn: () => storePagesApi.analytics(30),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const page = await storePagesApi.create({
        title: title.trim(),
        isHome: asHome,
        showInNav: !asHome,
        published: false,
      });
      if (starterTypes.length > 0) {
        const blocks = starterTypes.map((type, i) => {
          const def = BLOCK_CATALOG.find((b) => b.type === type)!;
          return {
            type: def.type,
            sortOrder: i,
            config: { ...def.defaults },
            visibleMobile: true,
            visibleDesktop: true,
          };
        });
        await storePagesApi.replaceBlocks(page.id, blocks, 'Démarrage');
      }
      return page;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page créée en brouillon', {
        description: canPublish
          ? 'Ajoutez votre contenu puis cliquez sur « Publier » en haut de l’éditeur.'
          : 'Demandez à un administrateur de la publier une fois prête.',
      });
      setTitle('');
      setAsHome(false);
      setStarterTypes([]);
      navigate(`/admin/pages/${page.id}`);
    },
    onError: (err) => toastError(err, 'Création impossible'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => storePagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page supprimée');
    },
    onError: (err) => toastError(err, 'Suppression impossible'),
  });

  const cloneMutation = useMutation({
    mutationFn: (id: number) => storePagesApi.clone(id),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page dupliquée');
      navigate(`/admin/pages/${page.id}`);
    },
    onError: (err) => toastError(err, 'Duplication impossible'),
  });

  /** Publication / affichage menu en un clic depuis la liste. */
  const patchPage = useMutation({
    mutationFn: (args: {
      page: StorePageListItem;
      patch: { published?: boolean; showInNav?: boolean };
    }) => storePagesApi.update(args.page.id, { title: args.page.title, ...args.patch }),
    onSuccess: (_res, { page, patch }) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      if (patch.published !== undefined) {
        toast.success(
          patch.published
            ? page.showInNav && !page.isHome
              ? 'Page publiée — visible dans le menu'
              : 'Page publiée'
            : 'Page repassée en brouillon',
        );
      } else {
        toast.success(patch.showInNav ? 'Ajoutée au menu' : 'Retirée du menu');
      }
    },
    onError: (err) => toastError(err, 'Mise à jour impossible'),
  });

  const promoteAbMutation = useMutation({
    mutationFn: (pageId: number) => storePagesApi.promoteAb(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      queryClient.invalidateQueries({ queryKey: ['store-pages', 'analytics'] });
      toast.success('Variante gagnante promue comme accueil unique');
    },
    onError: (err) => toastError(err, 'Promotion impossible'),
  });

  const homeById = useMemo(() => {
    const map = new Map<number, boolean>();
    for (const p of pages) map.set(p.id, !!p.isHome);
    return map;
  }, [pages]);

  const abWinnerPageId = useMemo(() => {
    const homeAb = analytics.filter(
      (row) =>
        homeById.get(row.pageId) &&
        row.abVariant &&
        (row.abVariant.toUpperCase() === 'A' || row.abVariant.toUpperCase() === 'B'),
    );
    if (homeAb.length === 0) return null;
    const best = [...homeAb].sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      return b.ctaClicks - a.ctaClicks;
    })[0];
    return best?.pageId ?? null;
  }, [analytics, homeById]);

  const counts = useMemo(
    () => ({
      all: pages.length,
      published: pages.filter((p) => p.published).length,
      draft: pages.filter((p) => !p.published).length,
    }),
    [pages],
  );

  const visiblePages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pages.filter((p) => {
      if (filter === 'published' && !p.published) return false;
      if (filter === 'draft' && p.published) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q);
    });
  }, [pages, filter, search]);

  const importMutation = useMutation({
    mutationFn: (payload: StorePageExportPayload) => storePagesApi.import(payload),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page importée (brouillon)');
      navigate(`/admin/pages/${page.id}`);
    },
    onError: (err) => toastError(err, 'Import impossible'),
  });

  const handleExport = async (id: number, title: string) => {
    try {
      const data = await storePagesApi.export(id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-export.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export JSON téléchargé');
    } catch (err) {
      toastError(err, 'Export impossible');
    }
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as StorePageExportPayload;
        importMutation.mutate(parsed);
      } catch {
        toast.error('Fichier JSON invalide');
      }
    };
    reader.readAsText(file);
  };

  const applyTemplate = async (tpl: PageTemplate) => {
    setApplyingTemplate(tpl.key);
    try {
      const wantedSlug = (tpl.meta.slug || '').toLowerCase();
      const existing = pages.find((p) => (p.slug || '').toLowerCase() === wantedSlug);
      if (existing) {
        toast.info(`« ${tpl.label} » existe déjà — ouverture de l’éditeur`);
        navigate(`/admin/pages/${existing.id}`);
        return;
      }

      const page = await storePagesApi.create({
        title: tpl.meta.title,
        slug: tpl.meta.slug,
        isHome: !!tpl.meta.isHome,
        showInNav: tpl.meta.showInNav !== false && !tpl.meta.isHome,
        published: !!tpl.meta.published,
      });
      await storePagesApi.replaceBlocks(page.id, tpl.blocks);
      // Garder le slug réellement attribué (éventuel suffixe -2 si collision).
      await storePagesApi.update(page.id, {
        title: tpl.meta.title,
        slug: page.slug,
        isHome: !!tpl.meta.isHome,
        showInNav: tpl.meta.showInNav !== false && !tpl.meta.isHome,
        published: !!tpl.meta.published,
      });
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success(`Template « ${tpl.label} » créé`);
      navigate(`/admin/pages/${page.id}`);
    } catch (err) {
      toastError(err, 'Impossible d’appliquer le template');
    } finally {
      setApplyingTemplate(null);
    }
  };

  const scrollToCreate = () =>
    createRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const storefrontUrl = (page: StorePageListItem) => {
    const q = store?.slug ? `?tenant=${encodeURIComponent(store.slug)}` : '';
    return `${window.location.origin}${page.isHome ? '/' : `/page/${page.slug}`}${q}`;
  };

  const filterTabs: Array<{ key: StatusFilter; label: string }> = [
    { key: 'all', label: 'Toutes' },
    { key: 'published', label: 'Publiées' },
    { key: 'draft', label: 'Brouillons' },
  ];

  return (
    <AdminLayout
      title={t('pages.title')}
      breadcrumbs={[
        { label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' },
        { label: 'Pages' },
      ]}
      description={t('pages.description')}
      actions={
        <div className="flex gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.target.value = '';
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={importMutation.isPending}
            onClick={() => importInputRef.current?.click()}
          >
            {importMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Importer JSON</span>
          </Button>
          <Button size="sm" className="gap-1.5" onClick={scrollToCreate}>
            <FilePlus2 className="h-4 w-4" />
            Nouvelle page
          </Button>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <BoutiqueWorkspaceLinks current="/admin/pages" />

        {/* ───────────── Liste des pages ───────────── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition',
                    filter === tab.key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs text-muted-foreground">{counts[tab.key]}</span>
                </button>
              ))}
            </div>
            {pages.length > 4 ? (
              <div className="relative w-full sm:w-60">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Rechercher une page…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            ) : null}
          </div>

          {!canPublish ? (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
              Compte équipe : vous pouvez créer et éditer les pages. La publication et la suppression
              nécessitent la permission « Publier les pages » ou un compte administrateur.
            </p>
          ) : null}

          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[76px] animate-pulse rounded-xl border border-border bg-muted/40" />
              ))}
            </div>
          ) : pages.length === 0 ? (
            <EmptyState
              icon={LayoutTemplate}
              title={t('pages.empty')}
              description={t('pages.emptyDesc')}
              actionLabel="Créer ma première page"
              onAction={scrollToCreate}
            />
          ) : visiblePages.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Aucune page ne correspond à ce filtre.
            </p>
          ) : (
            <ul className="space-y-2">
              {visiblePages.map((page) => {
                const busy =
                  patchPage.isPending && patchPage.variables?.page.id === page.id;
                return (
                  <li
                    key={page.id}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/admin/pages/${page.id}`}
                          className="truncate font-display font-semibold hover:text-primary"
                        >
                          {page.title}
                        </Link>
                        <Badge
                          variant="outline"
                          className={cn(
                            'gap-1.5',
                            page.published
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                              : 'border-amber-500/30 bg-amber-500/10 text-amber-700',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              page.published ? 'bg-emerald-500' : 'bg-amber-500',
                            )}
                          />
                          {page.published
                            ? page.currentlyLive === false
                              ? 'Planifiée'
                              : 'Publiée'
                            : 'Brouillon'}
                        </Badge>
                        {page.isHome ? (
                          <Badge variant="secondary" className="gap-1">
                            <Home className="h-3 w-3" /> Accueil
                          </Badge>
                        ) : null}
                        {page.isHome && page.abVariant ? (
                          <Badge variant="outline">Variante {page.abVariant}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                        {page.isHome ? '/ (remplace l’accueil)' : `/page/${page.slug}`}
                        {' · '}
                        {page.blockCount ?? 0} composant{(page.blockCount ?? 0) > 1 ? 's' : ''}
                      </p>
                      {!page.published && !page.isHome && page.showInNav ? (
                        <p className="mt-1 text-xs text-amber-700">
                          Dans le menu dès sa publication — pas encore visible par vos clients.
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                      {canPublish ? (
                        <label className="flex items-center gap-2 text-xs font-medium">
                          <Switch
                            checked={page.published}
                            disabled={busy}
                            onCheckedChange={(v) => patchPage.mutate({ page, patch: { published: v } })}
                            aria-label={page.published ? 'Dépublier' : 'Publier'}
                          />
                          Publiée
                        </label>
                      ) : null}
                      {!page.isHome ? (
                        <label
                          className="flex items-center gap-2 text-xs font-medium"
                          title="Afficher cette page dans le menu de la boutique (appbar)"
                        >
                          <Switch
                            checked={page.showInNav}
                            disabled={busy || !canPublish}
                            onCheckedChange={(v) => patchPage.mutate({ page, patch: { showInNav: v } })}
                            aria-label="Afficher dans le menu"
                          />
                          <Navigation className="h-3 w-3 text-muted-foreground" />
                          Menu
                        </label>
                      ) : null}
                      <Button size="sm" variant="secondary" asChild className="gap-1.5">
                        <Link to={`/admin/pages/${page.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                          Éditer
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Plus d’actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {page.published ? (
                            <DropdownMenuItem asChild>
                              <a href={storefrontUrl(page)} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Voir en ligne
                              </a>
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            disabled={cloneMutation.isPending}
                            onClick={() => cloneMutation.mutate(page.id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void handleExport(page.id, page.title)}>
                            <Download className="mr-2 h-4 w-4" />
                            Exporter (JSON)
                          </DropdownMenuItem>
                          {isAdmin ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  void confirm({ title: `Supprimer « ${page.title} » ?`, description: 'La page et ses versions seront supprimées. Les liens du menu vers cette page deviendront invalides.', tone: 'destructive' }).then((ok) => { if (ok) deleteMutation.mutate(page.id); });
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">
            Une page publiée avec « Menu » activé apparaît dans la barre de navigation de la boutique. Pour
            remplacer Contact / FAQ / Sur-mesure, utilisez le slug exact (<code>contact</code>,{' '}
            <code>faq</code>, <code>sur-mesure</code>…). Menus avancés :{' '}
            <Link to="/admin/sections" className="font-medium text-primary hover:underline">
              Navigation
            </Link>
            .
          </p>
        </section>

        {/* ───────────── Création ───────────── */}
        <section
          ref={createRef}
          className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <FilePlus2 className="h-5 w-5 text-primary" />
            Créer une page
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La page est créée en <strong>brouillon</strong> : vous la publierez depuis l’éditeur ou la liste.
          </p>

          <Tabs defaultValue="templates" className="mt-4">
            <TabsList>
              <TabsTrigger value="templates">Templates prêts</TabsTrigger>
              <TabsTrigger value="custom">Sur mesure</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Un clic crée la page avec ses composants. Vous pourrez ensuite personnaliser.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {PAGE_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.key}
                    className="flex flex-col rounded-xl border border-border bg-background p-4"
                  >
                    <p className="font-display font-semibold">{tpl.label}</p>
                    <p className="mt-1 flex-1 text-xs text-muted-foreground">{tpl.description}</p>
                    <Button
                      size="sm"
                      className="mt-4 gap-1.5"
                      disabled={!!applyingTemplate}
                      onClick={() => void applyTemplate(tpl)}
                    >
                      {applyingTemplate === tpl.key ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : null}
                      Utiliser
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-4 space-y-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <Label htmlFor="page-title">Titre</Label>
                  <Input
                    id="page-title"
                    className="mt-1.5"
                    placeholder="Ex. Notre histoire, Lookbook…"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && title.trim() && !createMutation.isPending) {
                        createMutation.mutate();
                      }
                    }}
                  />
                </div>
                <Button
                  disabled={!title.trim() || createMutation.isPending}
                  onClick={() => createMutation.mutate()}
                  className="gap-2"
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Créer & éditer
                </Button>
              </div>

              <div>
                <Label className="mb-1 block">Composants de démarrage (optionnel)</Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Cliquez pour ajouter, glissez pour réordonner.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {BLOCK_CATALOG.map((item) => {
                    const selected = starterTypes.includes(item.type);
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() =>
                          setStarterTypes((prev) =>
                            prev.includes(item.type)
                              ? prev.filter((t) => t !== item.type)
                              : [...prev, item.type],
                          )
                        }
                        className={cn(
                          'rounded-xl border p-2 text-left transition',
                          selected
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                            : 'border-border bg-background hover:border-primary/40',
                        )}
                      >
                        <BlockPalettePreview type={item.type} />
                        <p className="mt-1.5 text-xs font-medium leading-tight">{item.label}</p>
                      </button>
                    );
                  })}
                </div>
                {starterTypes.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {starterTypes.map((type, index) => {
                      const label = BLOCK_CATALOG.find((b) => b.type === type)?.label ?? type;
                      return (
                        <li
                          key={`${type}-${index}`}
                          draggable
                          onDragStart={() => {
                            starterDragFrom.current = index;
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            const from = starterDragFrom.current;
                            starterDragFrom.current = null;
                            if (from == null || from === index) return;
                            setStarterTypes((prev) => {
                              const next = [...prev];
                              const [item] = next.splice(from, 1);
                              next.splice(index, 0, item);
                              return next;
                            });
                          }}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
                        >
                          <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground" />
                          <span className="font-mono text-[11px] text-muted-foreground">#{index + 1}</span>
                          <span className="flex-1">{label}</span>
                          <button
                            type="button"
                            className="text-xs text-destructive"
                            onClick={() =>
                              setStarterTypes((prev) => prev.filter((_, i) => i !== index))
                            }
                          >
                            Retirer
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sans sélection : page vide — vous pourrez glisser-déposer les blocs dans l’éditeur.
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm">
                <Switch checked={asHome} onCheckedChange={setAsHome} />
                Utiliser comme page d’accueil (remplace le design thème)
              </label>
            </TabsContent>
          </Tabs>
        </section>

        {/* ───────────── Analytics ───────────── */}
        {analytics.length > 0 ? (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analytics (30 j)
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Page</th>
                    <th className="px-3 py-2 font-medium">A/B</th>
                    <th className="px-3 py-2 font-medium">Vues</th>
                    <th className="px-3 py-2 font-medium">Clics CTA</th>
                    {abWinnerPageId != null ? (
                      <th className="px-3 py-2 font-medium">Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((row) => {
                    const isHomeAb =
                      homeById.get(row.pageId) &&
                      row.abVariant &&
                      (row.abVariant.toUpperCase() === 'A' || row.abVariant.toUpperCase() === 'B');
                    const showPromote =
                      isHomeAb && row.pageId === abWinnerPageId && canPublish && abTestingAllowed;
                    return (
                      <tr key={row.pageId ?? row.pageSlug} className="border-t border-border">
                        <td className="px-3 py-2">
                          <span className="font-medium">{row.pageTitle}</span>
                          <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                            /{row.pageSlug}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                          {row.abVariant?.toUpperCase() || '—'}
                        </td>
                        <td className="px-3 py-2">{row.views}</td>
                        <td className="px-3 py-2">{row.ctaClicks}</td>
                        {abWinnerPageId != null ? (
                          <td className="px-3 py-2">
                            {showPromote ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 gap-1 text-xs"
                                disabled={promoteAbMutation.isPending}
                                onClick={() => promoteAbMutation.mutate(row.pageId)}
                              >
                                {promoteAbMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trophy className="h-3 w-3" />
                                )}
                                Promouvoir gagnant
                              </Button>
                            ) : (
                              '—'
                            )}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {/* Notes de plan, discrètes en bas */}
        {!abTestingAllowed || !fullPageBuilder ? (
          <div className="space-y-1 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            {!abTestingAllowed ? (
              <p>
                Plan <strong>{planCode}</strong> : tests A/B et historique de versions réservés au plan Pro
                ou Business.
              </p>
            ) : null}
            {!fullPageBuilder ? (
              <p>
                Page builder « simple » : blocs essentiels inclus. Le plan Business débloque l’import/export
                JSON et les blocs avancés.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
