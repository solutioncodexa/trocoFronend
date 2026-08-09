import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  FolderTree,
  Loader2,
  Search,
  Sparkles,
  Package,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  CornerDownRight,
  Power,
  PowerOff,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { categoriesApi } from '@/services/api';
import { CategoryDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

type CreateMode = 'parent' | 'child';

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const uniqueSlug = (base: string, existing: Set<string>) => {
  let slug = base || 'categorie';
  if (!existing.has(slug)) return slug;
  let i = 2;
  while (existing.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
};

const AdminCategories = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [createMode, setCreateMode] = useState<CreateMode>('parent');
  const [slugManual, setSlugManual] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [quickAddByParent, setQuickAddByParent] = useState<Record<number, string>>({});
  const [pendingDelete, setPendingDelete] = useState<CategoryDTO | null>(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const nameInputRef = useRef<HTMLInputElement>(null);
  const quickAddRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '' as string,
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
  });

  const roots = useMemo(
    () => categories.filter((c) => c.parentId == null).sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [categories],
  );

  const childrenByParent = useMemo(() => {
    const map = new Map<number, CategoryDTO[]>();
    for (const c of categories) {
      if (c.parentId == null) continue;
      const list = map.get(Number(c.parentId)) ?? [];
      list.push(c);
      map.set(Number(c.parentId), list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }
    return map;
  }, [categories]);

  const existingSlugs = useMemo(() => new Set(categories.map((c) => c.slug.toLowerCase())), [categories]);

  const parentOptions = useMemo(() => {
    return roots.filter((c) => !editingCategory || Number(c.id) !== Number(editingCategory.id));
  }, [roots, editingCategory]);

  const childCount = categories.filter((c) => c.parentId != null).length;

  const openCreateParent = () => {
    setEditingCategory(null);
    setCreateMode('parent');
    setSlugManual(false);
    setKeepOpen(false);
    setBulkNames('');
    setFormData({ name: '', description: '', slug: '', parentId: '' });
    setIsModalOpen(true);
  };

  const openCreateChild = (parentId?: number) => {
    setEditingCategory(null);
    setCreateMode('child');
    setSlugManual(false);
    setKeepOpen(true);
    setBulkNames('');
    setFormData({
      name: '',
      description: '',
      slug: '',
      parentId: parentId != null ? String(parentId) : '',
    });
    setIsModalOpen(true);
    if (parentId != null) {
      setExpandedParents((prev) => new Set(prev).add(parentId));
    }
  };

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' || action === 'new-parent') {
      openCreateParent();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    } else if (action === 'new-child') {
      const pid = searchParams.get('parentId');
      openCreateChild(pid ? Number(pid) : undefined);
      searchParams.delete('action');
      searchParams.delete('parentId');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roots.length > 0 && expandedParents.size === 0) {
      setExpandedParents(new Set(roots.map((r) => Number(r.id))));
    }
  }, [roots]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isModalOpen) {
      const t = window.setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [isModalOpen, createMode]);

  const matchesSearch = (c: CategoryDTO, q: string) => {
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.parentName || '').toLowerCase().includes(q)
    );
  };

  const filteredTree = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roots
      .map((root) => {
        const allKids = childrenByParent.get(Number(root.id)) ?? [];
        const kids = q ? allKids.filter((c) => matchesSearch(c, q)) : allKids;
        const rootMatch = matchesSearch(root, q);
        if (!q) return { root, children: allKids };
        if (rootMatch || kids.length > 0) {
          return { root, children: rootMatch && kids.length === 0 ? allKids : kids };
        }
        return null;
      })
      .filter(Boolean) as { root: CategoryDTO; children: CategoryDTO[] }[];
  }, [roots, childrenByParent, search]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['categories', 'hero'] });
    queryClient.invalidateQueries({ queryKey: ['heroCategories'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      slug: string;
      parentId?: number | null;
    }) => categoriesApi.createCategory(data),
    onError: (e: Error) => toastError(e, 'Erreur lors de la création'),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name: string;
        description?: string;
        slug: string;
        parentId?: number | null;
        clearParent?: boolean;
      };
    }) => categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      invalidate();
      toast.success('Catégorie modifiée');
      handleCloseModal();
    },
    onError: (e: Error) => toastError(e, 'Erreur lors de la modification'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success('Catégorie supprimée');
      setPendingDelete(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (pendingDelete) next.delete(Number(pendingDelete.id));
        return next;
      });
    },
    onError: (e: Error) => toastError(e, 'Erreur lors de la suppression'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => categoriesApi.bulkDeleteCategories(ids),
    onSuccess: (result) => {
      invalidate();
      setPendingBulkDelete(false);
      setSelectedIds(new Set());
      if (result.failureCount === 0) {
        toast.success(`${result.successCount} catégorie(s) supprimée(s)`);
      } else {
        toast.warning(
          `${result.successCount} OK, ${result.failureCount} échec(s)`,
          { description: result.errors?.slice(0, 3).join('\n') },
        );
      }
    },
    onError: (e: Error) => toastError(e, 'Erreur suppression multiple'),
  });

  const bulkActiveMutation = useMutation({
    mutationFn: ({ ids, active }: { ids: number[]; active: boolean }) =>
      categoriesApi.bulkSetActive(ids, active),
    onSuccess: (result, vars) => {
      invalidate();
      setSelectedIds(new Set());
      const label = vars.active ? 'activée(s)' : 'désactivée(s)';
      if (result.failureCount === 0) {
        toast.success(`${result.successCount} catégorie(s) ${label}`);
      } else {
        toast.warning(`${result.successCount} OK, ${result.failureCount} échec(s)`);
      }
    },
    onError: (e: Error) => toastError(e, 'Erreur mise à jour du statut'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      categoriesApi.setActive(id, active),
    onSuccess: (_dto, vars) => {
      invalidate();
      toast.success(vars.active ? 'Catégorie activée' : 'Catégorie désactivée');
    },
    onError: (e: Error) => toastError(e, 'Erreur statut'),
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectBranch = (rootId: number) => {
    const kids = childrenByParent.get(rootId) ?? [];
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = next.has(rootId) && kids.every((k) => next.has(Number(k.id)));
      if (allSelected) {
        next.delete(rootId);
        kids.forEach((k) => next.delete(Number(k.id)));
      } else {
        next.add(rootId);
        kids.forEach((k) => next.add(Number(k.id)));
      }
      return next;
    });
  };

  const visibleIds = useMemo(() => {
    const ids: number[] = [];
    for (const { root, children } of filteredTree) {
      ids.push(Number(root.id));
      children.forEach((c) => ids.push(Number(c.id)));
    }
    return ids;
  }, [filteredTree]);

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) return new Set();
      return new Set(visibleIds);
    });
  };

  const handleOpenEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setCreateMode(category.parentId == null ? 'parent' : 'child');
    setSlugManual(true);
    setKeepOpen(false);
    setBulkNames('');
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      parentId: category.parentId != null ? String(category.parentId) : '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setBulkNames('');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : generateSlug(name),
    }));
  };

  const resetFormKeepParent = () => {
    setSlugManual(false);
    setBulkNames('');
    setFormData((prev) => ({
      name: '',
      description: '',
      slug: '',
      parentId: prev.parentId,
    }));
    window.setTimeout(() => nameInputRef.current?.focus(), 40);
  };

  const parseBulkNames = (raw: string) =>
    raw
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveMode =
      editingCategory != null ? (formData.parentId ? 'child' : 'parent') : createMode;

    if (effectiveMode === 'child' && !formData.parentId) {
      toast.error('Choisissez une catégorie parente');
      return;
    }

    const parentId = effectiveMode === 'parent' ? null : Number(formData.parentId);
    const bulk = !editingCategory && effectiveMode === 'child' ? parseBulkNames(bulkNames) : [];

    // Bulk: plusieurs sous-catégories d’un coup
    if (bulk.length > 0) {
      const used = new Set(existingSlugs);
      let ok = 0;
      for (const name of bulk) {
        const slug = uniqueSlug(generateSlug(name), used);
        used.add(slug);
        try {
          await createMutation.mutateAsync({
            name,
            slug,
            parentId: parentId ?? undefined,
          });
          ok += 1;
        } catch {
          break;
        }
      }
      if (ok > 0) {
        invalidate();
        toast.success(`${ok} sous-catégorie${ok > 1 ? 's' : ''} créée${ok > 1 ? 's' : ''}`);
        if (keepOpen) resetFormKeepParent();
        else handleCloseModal();
      }
      return;
    }

    const slug = (formData.slug || generateSlug(formData.name)).trim();
    if (!formData.name.trim() || !slug) {
      toast.error(
        effectiveMode === 'child'
          ? 'Indiquez un nom, ou une liste de sous-catégories'
          : 'Indiquez un nom',
      );
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: Number(editingCategory.id),
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          slug,
          parentId: parentId ?? undefined,
          clearParent: parentId == null,
        },
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug: uniqueSlug(slug, existingSlugs),
        parentId: parentId ?? undefined,
      });
      invalidate();
      toast.success(effectiveMode === 'parent' ? 'Catégorie créée' : 'Sous-catégorie créée');
      if (keepOpen && effectiveMode === 'child') resetFormKeepParent();
      else handleCloseModal();
    } catch {
      /* toasted in mutation */
    }
  };

  const handleQuickAdd = async (parentId: number) => {
    const name = (quickAddByParent[parentId] || '').trim();
    if (!name) {
      toast.error('Indiquez un nom de sous-catégorie');
      quickAddRefs.current[parentId]?.focus();
      return;
    }
    const slug = uniqueSlug(generateSlug(name), existingSlugs);
    try {
      await createMutation.mutateAsync({ name, slug, parentId });
      invalidate();
      toast.success(`« ${name} » ajoutée`);
      setQuickAddByParent((prev) => ({ ...prev, [parentId]: '' }));
      setExpandedParents((prev) => new Set(prev).add(parentId));
      window.setTimeout(() => quickAddRefs.current[parentId]?.focus(), 40);
    } catch {
      /* toasted */
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedParents(new Set(roots.map((r) => Number(r.id))));
  const collapseAll = () => setExpandedParents(new Set());

  const selectedParentName =
    formData.parentId && roots.find((r) => String(r.id) === formData.parentId)?.name;

  const pendingKids = pendingDelete
    ? childrenByParent.get(Number(pendingDelete.id))?.length ?? 0
    : 0;

  return (
    <AdminLayout title={t('categories.title')} breadcrumbs={[{ label: t('categories.breadcrumb') }]}>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {roots.length} {t('categories.unit')} · {childCount} {t('categories.childUnit')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/accueil-categories"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1 mr-1"
          >
            <Sparkles className="w-3 h-3" /> {t('categories.homeLink')}
          </Link>
          <Button
            onClick={openCreateParent}
            className="font-body"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('categories.newCategory')}
          </Button>
        </div>
      </div>

      {/* Search + expand */}
      {categories.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={t('categories.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 items-center">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none mr-2">
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={() => toggleSelectAllVisible()}
              />
              {t('categories.selectAll')}
            </label>
            <Button type="button" size="sm" variant="ghost" onClick={expandAll} title={t('categories.expandAll')}>
              <ChevronsUpDown className="w-4 h-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={collapseAll} title={t('categories.collapseAll')}>
              <ChevronsDownUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="mb-3 sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-background/95 backdrop-blur px-3 py-2 shadow-sm">
          <span className="text-sm font-medium">{t('categories.selectedCount', { count: selectedIds.size })}</span>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={bulkActiveMutation.isPending}
              onClick={() =>
                bulkActiveMutation.mutate({ ids: [...selectedIds], active: true })
              }
            >
              <Power className="w-3.5 h-3.5 mr-1" />
              {t('common.activate')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={bulkActiveMutation.isPending}
              onClick={() =>
                bulkActiveMutation.mutate({ ids: [...selectedIds], active: false })
              }
            >
              <PowerOff className="w-3.5 h-3.5 mr-1" />
              {t('common.deactivate')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={bulkDeleteMutation.isPending}
              onClick={() => setPendingBulkDelete(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {t('common.delete')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FolderTree className="h-7 w-7 text-primary" />
          </div>
          <p className="font-display text-lg mb-1">{t('categories.emptyTitle')}</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            {t('categories.emptyDesc')}
          </p>
          <Button onClick={openCreateParent}>
            <Plus className="w-4 h-4 mr-2" />
            {t('categories.emptyAction')}
          </Button>
        </div>
      ) : filteredTree.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t('categories.noSearchResults', { query: search })}</p>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
          {filteredTree.map(({ root, children }) => {
            const id = Number(root.id);
            const open = expandedParents.has(id);
            const quickValue = quickAddByParent[id] ?? '';
            const rootActive = root.active !== false;
            const rootSelected = selectedIds.has(id);

            return (
              <div key={root.id} className={cn(!rootActive && 'opacity-60')}>
                {/* Parent row */}
                <div
                  className={cn(
                    'group flex items-center gap-2 px-3 py-2.5 sm:px-4 hover:bg-muted/40 transition-colors',
                    rootSelected && 'bg-primary/5',
                  )}
                >
                  <Checkbox
                    checked={rootSelected}
                    onCheckedChange={() => selectBranch(id)}
                    aria-label={`Sélectionner ${root.name}`}
                    className="shrink-0"
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    onClick={() => toggleExpand(id)}
                    aria-label={open ? 'Replier' : 'Déplier'}
                  >
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FolderTree className="h-4 w-4 text-primary" />
                  </div>
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => toggleExpand(id)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium truncate">{root.name}</span>
                      <Badge variant="outline" className="font-mono text-[10px] font-normal">
                        {root.slug}
                      </Badge>
                      {!rootActive && (
                        <Badge variant="secondary" className="text-[10px]">
                          {t('common.disabled')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {children.length} {t('categories.subcatAbbrev')} · {root.productCount ?? 0} {t('categories.prodAbbrev')}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title={rootActive ? t('common.deactivate') : t('common.activate')}
                      onClick={() =>
                        toggleActiveMutation.mutate({ id, active: !rootActive })
                      }
                    >
                      {rootActive ? (
                        <PowerOff className="h-3.5 w-3.5" />
                      ) : (
                        <Power className="h-3.5 w-3.5 text-primary" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                      onClick={() => openCreateChild(id)}
                      title={t('categories.addSubcategoriesTitle')}
                    >
                      <Plus className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">{t('categories.subcatAbbrev')}</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenEdit(root)}
                      title={t('common.edit')}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(root)}
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Children + quick add */}
                {open && (
                  <div className="bg-muted/20 border-t border-border/60">
                    {children.map((child) => {
                      const childId = Number(child.id);
                      const childActive = child.active !== false;
                      const childSelected = selectedIds.has(childId);
                      return (
                        <div
                          key={child.id}
                          className={cn(
                            'group/child flex items-center gap-2 pl-10 pr-3 py-2 sm:pl-14 sm:pr-4 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0',
                            !childActive && 'opacity-60',
                            childSelected && 'bg-primary/5',
                          )}
                        >
                          <Checkbox
                            checked={childSelected}
                            onCheckedChange={() => toggleSelect(childId)}
                            aria-label={`Sélectionner ${child.name}`}
                            className="shrink-0"
                          />
                          <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background border border-border">
                            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium truncate">{child.name}</span>
                              <Badge variant="outline" className="font-mono text-[10px] font-normal">
                                {child.slug}
                              </Badge>
                              {!childActive && (
                                <Badge variant="secondary" className="text-[10px]">
                                  {t('common.disabled')}
                                </Badge>
                              )}
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Package className="h-3 w-3" />
                              {child.productCount ?? 0} {t('common.productUnit')}
                            </span>
                          </div>
                          <div className="flex shrink-0 opacity-100 sm:opacity-0 sm:group-hover/child:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              title={childActive ? t('common.deactivate') : t('common.activate')}
                              onClick={() =>
                                toggleActiveMutation.mutate({
                                  id: childId,
                                  active: !childActive,
                                })
                              }
                            >
                              {childActive ? (
                                <PowerOff className="h-3.5 w-3.5" />
                              ) : (
                                <Power className="h-3.5 w-3.5 text-primary" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleOpenEdit(child)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => setPendingDelete(child)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick add inline */}
                    <div className="flex items-center gap-2 pl-12 pr-3 py-2.5 sm:pl-16 sm:pr-4">
                      <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <Input
                        ref={(el) => {
                          quickAddRefs.current[id] = el;
                        }}
                        value={quickValue}
                        onChange={(e) =>
                          setQuickAddByParent((prev) => ({ ...prev, [id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void handleQuickAdd(id);
                          }
                        }}
                        placeholder={t('categories.quickAddPlaceholder', { name: root.name })}
                        className="h-8 text-sm bg-background"
                        disabled={createMutation.isPending}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 shrink-0"
                        disabled={!quickValue.trim() || createMutation.isPending}
                        onClick={() => void handleQuickAdd(id)}
                      >
                        {createMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          t('common.add')
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
          else setIsModalOpen(true);
        }}
      >
        <DialogContent className="flex max-h-[90dvh] max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-h-[85vh]">
          <DialogHeader className="shrink-0 border-b border-border px-5 pb-3 pt-5 pr-12">
            <DialogTitle className="font-display text-xl">
              {editingCategory
                ? t('common.edit')
                : createMode === 'parent'
                  ? t('categories.newCategory')
                  : t('categories.subcategoriesTitle')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingCategory
                ? 'Modifiez le nom, le slug ou le rattachement.'
                : createMode === 'parent'
                  ? 'Niveau principal du catalogue (ex. Vêtements, Téléphones).'
                  : selectedParentName
                    ? `Sous « ${selectedParentName} » — ex. T-shirts, Robes (pas les tailles).`
                    : 'Rattachez-les à une catégorie parente.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4">
            {!editingCategory && (
              <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    createMode === 'parent'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setCreateMode('parent');
                    setKeepOpen(false);
                    setBulkNames('');
                    setFormData((p) => ({ ...p, parentId: '', name: '', slug: '' }));
                    setSlugManual(false);
                  }}
                >
                  Catégorie
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    createMode === 'child'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                    roots.length === 0 && 'opacity-40 pointer-events-none',
                  )}
                  onClick={() => {
                    setCreateMode('child');
                    setKeepOpen(true);
                  }}
                >
                  Sous-catégorie
                </button>
              </div>
            )}

            {(createMode === 'child' || editingCategory != null) && (
              <div>
                <Label>Catégorie parente {createMode === 'child' && !editingCategory ? '*' : ''}</Label>
                <Select
                  value={formData.parentId || 'none'}
                  onValueChange={(v) => {
                    setFormData((prev) => ({ ...prev, parentId: v === 'none' ? '' : v }));
                    if (!editingCategory) {
                      if (v !== 'none') setCreateMode('child');
                      else setCreateMode('parent');
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingCategory && (
                      <SelectItem value="none">Aucune — remonter en racine</SelectItem>
                    )}
                    {parentOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Single name — pour sous-cat. : optionnel si liste bulk remplie */}
            <div>
              <Label htmlFor="cat-name">
                Nom
                {createMode === 'child' && !editingCategory
                  ? bulkNames.trim()
                    ? ''
                    : ' *'
                  : ' *'}
              </Label>
              <Input
                ref={nameInputRef}
                id="cat-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={
                  createMode === 'parent' ? 'Ex. Vêtements, Téléphones…' : 'Ex. T-shirts, Robes…'
                }
                required={!(createMode === 'child' && !editingCategory)}
                className="mt-1"
              />
              {!editingCategory && createMode === 'child' && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  Facultatif si vous remplissez la liste ci-dessous.
                </p>
              )}
            </div>

            {/* Bulk names for subcategories */}
            {!editingCategory && createMode === 'child' && (
              <div className="space-y-2">
                <div className="rounded-lg border border-amber-500/30 bg-amber-50/80 px-3 py-2 text-[11px] leading-relaxed text-amber-950">
                  <strong>Tailles, couleurs, RAM…</strong> ne sont pas des sous-catégories. Configurez-les
                  dans{' '}
                  <Link to="/admin/attributs" className="underline font-medium" onClick={handleCloseModal}>
                    Attributs &amp; variantes
                  </Link>{' '}
                  (ex. axe « Taille » = XS / S / M / L / XL), puis sur le produit.
                </div>
                <div>
                  <Label htmlFor="bulk">Plusieurs sous-catégories (noms)</Label>
                  <Textarea
                    id="bulk"
                    value={bulkNames}
                    onChange={(e) => setBulkNames(e.target.value)}
                    placeholder={'Une par ligne, ex.\nT-shirts\nRobes\nPantalons\nVestes'}
                    rows={4}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Remplissez <em>soit</em> le Nom, <em>soit</em> cette liste (pas les deux
                    obligatoires). Ex. T-shirts / Robes — pas XS / S / M.
                  </p>
                </div>
              </div>
            )}

            <Collapsible>
              <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                Options avancées
                <ChevronDown className="h-3 w-3" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                {!bulkNames.trim() && (
                  <div>
                    <Label htmlFor="cat-slug">Slug (URL)</Label>
                    <Input
                      id="cat-slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setSlugManual(true);
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                      }}
                      placeholder="auto-généré"
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea
                    id="cat-desc"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Optionnel"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {!editingCategory && createMode === 'child' && (
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={(v) => setKeepOpen(v === true)}
                />
                Créer et en ajouter une autre
              </label>
            )}
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t border-border bg-background px-5 py-3 sm:gap-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingCategory
                  ? t('common.save')
                  : createMode === 'child' && parseBulkNames(bulkNames).length > 1
                    ? `${t('common.create')} ${parseBulkNames(bulkNames).length}`
                    : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {pendingDelete?.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingKids > 0
                ? `Cette catégorie a ${pendingKids} sous-catégorie(s). La suppression sera refusée tant qu’elles existent — sélectionnez aussi les sous-catégories pour tout supprimer.`
                : (pendingDelete?.productCount ?? 0) > 0
                  ? `Cette catégorie contient ${pendingDelete?.productCount} produit(s). La suppression peut être refusée s’ils y sont encore liés.`
                  : 'Cette action est définitive.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => pendingDelete && deleteMutation.mutate(Number(pendingDelete.id))}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingBulkDelete}
        onOpenChange={(open) => {
          if (!open) setPendingBulkDelete(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer {selectedIds.size} catégorie(s) ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Les sous-catégories sélectionnées sont supprimées avant les parentes. Les catégories
              encore liées à des produits (ou ayant des enfants non sélectionnés) seront refusées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => bulkDeleteMutation.mutate([...selectedIds])}
            >
              {bulkDeleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('categories.deleteSelection')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCategories;
