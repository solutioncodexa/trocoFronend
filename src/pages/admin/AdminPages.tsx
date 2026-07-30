import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Copy,
  Download,
  FilePlus2,
  GripVertical,
  Home,
  LayoutTemplate,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  Trophy,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BoutiqueWorkspaceLinks } from '@/components/admin/BoutiqueWorkspaceLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
} from '@/types/store-pages';
import { EmptyState } from '@/components/ui/EmptyState';
import BlockPalettePreview from '@/components/admin/page-builder/BlockPalettePreview';
import { cn } from '@/lib/utils';

const AdminPages = () => {
  const { isAdmin, hasPermission } = useAdmin();
  const canPublish = isAdmin || hasPermission(PERMISSIONS.PAGES_PUBLISH);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [asHome, setAsHome] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);
  const [starterTypes, setStarterTypes] = useState<StorePageBlockType[]>([]);
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
      toast.success(
        starterTypes.length
          ? `Page créée avec ${starterTypes.length} composant${starterTypes.length > 1 ? 's' : ''}`
          : 'Page créée',
      );
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

  const togglePublish = useMutation({
    mutationFn: (page: { id: number; published: boolean; title: string }) =>
      storePagesApi.update(page.id, { title: page.title, published: !page.published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Statut mis à jour');
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
      const page = await storePagesApi.create({
        title: tpl.meta.title,
        slug: tpl.meta.slug,
        isHome: !!tpl.meta.isHome,
        showInNav: tpl.meta.showInNav !== false && !tpl.meta.isHome,
        published: !!tpl.meta.published,
      });
      await storePagesApi.replaceBlocks(page.id, tpl.blocks);
      // Re-apply meta in case create overwrote (home flag etc.)
      await storePagesApi.update(page.id, {
        title: tpl.meta.title,
        slug: tpl.meta.slug,
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

  return (
    <AdminLayout
      title="Pages"
      breadcrumbs={[
        { label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' },
        { label: 'Pages' },
      ]}
      description="Templates, starters, puis édition drag & drop des composants."
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <BoutiqueWorkspaceLinks current="/admin/pages" />
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Après création, vos pages apparaissent dans{' '}
          <Link to="/admin/parametres" className="font-medium text-primary hover:underline">
            Apparence → Header
          </Link>{' '}
          comme destinations de menu, et dans{' '}
          <Link to="/admin/sections" className="font-medium text-primary hover:underline">
            Navigation
          </Link>{' '}
          (mega menu / footer).
        </div>
        {!canPublish ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
            Compte équipe : vous pouvez créer et éditer les pages. La publication et la suppression
            nécessitent la permission « Publier les pages » ou un compte administrateur.
          </p>
        ) : null}

        {!abTestingAllowed ? (
          <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Plan <strong>{planCode}</strong> : tests A/B et historique de versions réservés au plan Pro
            ou Business. Passez à un plan supérieur dans Paramètres boutique.
          </p>
        ) : null}

        {!fullPageBuilder ? (
          <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Page builder « simple » : tous les blocs essentiels sont disponibles. Le plan Business débloque
            l’import/export JSON et les blocs avancés.
          </p>
        ) : null}

        <section className="flex flex-wrap items-center gap-3">
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
            className="gap-1.5"
            disabled={importMutation.isPending}
            onClick={() => importInputRef.current?.click()}
          >
            {importMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Importer JSON
          </Button>
        </section>
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Templates prêts
          </h2>
          <p className="text-sm text-muted-foreground">
            Un clic crée la page avec ses composants. Vous pourrez ensuite personnaliser.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAGE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.key}
                className="flex flex-col rounded-xl border border-border bg-card p-4"
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
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <FilePlus2 className="h-5 w-5 text-primary" />
            Nouvelle page
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choisissez des composants de démarrage (clic ou glisser pour réordonner), puis créez.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="page-title">Titre</Label>
              <Input
                id="page-title"
                className="mt-1.5"
                placeholder="Ex. Notre histoire, Lookbook…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

          <div className="mt-5">
            <Label className="mb-2 block">Composants de démarrage (optionnel)</Label>
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

          <label className="mt-4 flex items-center gap-3 text-sm">
            <Switch checked={asHome} onCheckedChange={setAsHome} />
            Utiliser comme page d’accueil (remplace le design thème)
          </label>
          <p className="mt-3 text-xs text-muted-foreground">
            Pour remplacer Contact / FAQ / Sur-mesure dans le menu : publiez une page avec le slug
            exact (<code>contact</code>, <code>faq</code>, <code>sur-mesure</code>…).
          </p>
        </section>

        {analytics.length > 0 ? (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analytics (30 j)
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
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
                    const showPromote = isHomeAb && row.pageId === abWinnerPageId && canPublish && abTestingAllowed;
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
                              className="gap-1 h-8 text-xs"
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

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Vos pages</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : pages.length === 0 ? (
            <EmptyState
              icon={LayoutTemplate}
              title="Aucune page"
              description="Choisissez un template ci-dessus ou créez une page vide pour démarrer votre vitrine."
            />
          ) : (
            <ul className="space-y-2">
              {pages.map((page) => (
                <li
                  key={page.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-semibold">{page.title}</p>
                      {page.isHome ? (
                        <Badge variant="secondary" className="gap-1">
                          <Home className="h-3 w-3" /> Accueil
                        </Badge>
                      ) : null}
                      {page.isHome && page.abVariant ? (
                        <Badge variant="outline">Variante {page.abVariant}</Badge>
                      ) : null}
                      <Badge variant={page.published ? 'default' : 'outline'}>
                        {page.published ? 'Publiée' : 'Brouillon'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      /page/{page.slug}
                      {page.isHome ? ' · remplace /' : ''}
                      {page.currentlyLive === false && page.published ? ' · planifié' : ''}
                      {' · '}
                      {page.blockCount ?? 0} composant
                      {(page.blockCount ?? 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canPublish ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish.mutate(page)}
                      >
                        {page.published ? 'Dépublier' : 'Publier'}
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => void handleExport(page.id, page.title)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={cloneMutation.isPending}
                      onClick={() => cloneMutation.mutate(page.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Dupliquer
                    </Button>
                    <Button size="sm" variant="secondary" asChild className="gap-1.5">
                      <Link to={`/admin/pages/${page.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Éditer
                      </Link>
                    </Button>
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          if (window.confirm(`Supprimer « ${page.title} » ?`)) {
                            deleteMutation.mutate(page.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
