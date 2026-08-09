import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoriesApi } from '@/services/api';
import { CategoryDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

type CreateMode = 'parent' | 'child';
type ViewFilter = 'all' | 'parents' | 'children';

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const AdminCategories = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [createMode, setCreateMode] = useState<CreateMode>('parent');
  const [slugManual, setSlugManual] = useState(false);
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
    [categories]
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

  /** Uniquement les catégories racines comme parentes possibles (hiérarchie 1 niveau claire). */
  const parentOptions = useMemo(() => {
    return roots.filter((c) => !editingCategory || Number(c.id) !== Number(editingCategory.id));
  }, [roots, editingCategory]);

  const openCreateParent = () => {
    setEditingCategory(null);
    setCreateMode('parent');
    setSlugManual(false);
    setFormData({ name: '', description: '', slug: '', parentId: '' });
    setIsModalOpen(true);
  };

  const openCreateChild = (parentId?: number) => {
    setEditingCategory(null);
    setCreateMode('child');
    setSlugManual(false);
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

  // Expand all parents by default once loaded
  useEffect(() => {
    if (roots.length > 0 && expandedParents.size === 0) {
      setExpandedParents(new Set(roots.map((r) => Number(r.id))));
    }
  }, [roots]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (viewFilter === 'children') {
      return categories
        .filter((c) => c.parentId != null && matchesSearch(c, q))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    }

    return roots
      .map((root) => {
        const kids = (childrenByParent.get(Number(root.id)) ?? []).filter((c) => matchesSearch(c, q));
        const rootMatch = matchesSearch(root, q);
        if (viewFilter === 'parents') {
          return rootMatch ? { root, children: [] as CategoryDTO[] } : null;
        }
        if (!q) return { root, children: childrenByParent.get(Number(root.id)) ?? [] };
        if (rootMatch || kids.length > 0) {
          return { root, children: rootMatch && !q ? childrenByParent.get(Number(root.id)) ?? [] : kids.length ? kids : childrenByParent.get(Number(root.id)) ?? [] };
        }
        return null;
      })
      .filter(Boolean) as { root: CategoryDTO; children: CategoryDTO[] }[];
  }, [roots, childrenByParent, categories, search, viewFilter]);

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
    onSuccess: () => {
      invalidate();
      toast.success(createMode === 'parent' ? 'Catégorie parente créée' : 'Sous-catégorie créée');
      handleCloseModal();
    },
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
    },
    onError: (e: Error) => toastError(e, 'Erreur lors de la suppression'),
  });

  const handleOpenEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setCreateMode(category.parentId == null ? 'parent' : 'child');
    setSlugManual(true);
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
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = (formData.slug || generateSlug(formData.name)).trim();
    if (!formData.name.trim() || !slug) {
      toast.error('Nom et slug obligatoires');
      return;
    }

    const effectiveMode =
      editingCategory != null
        ? formData.parentId
          ? 'child'
          : 'parent'
        : createMode;

    if (effectiveMode === 'child' && !formData.parentId) {
      toast.error('Choisissez une catégorie parente');
      return;
    }

    const parentId = effectiveMode === 'parent' ? null : Number(formData.parentId);

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
    } else {
      createMutation.mutate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug,
        parentId: parentId ?? undefined,
      });
    }
  };

  const handleDelete = (category: CategoryDTO) => {
    const kids = childrenByParent.get(Number(category.id))?.length ?? 0;
    const count = category.productCount ?? 0;
    let msg = `Supprimer « ${category.name} » ?`;
    if (kids > 0) msg = `Cette catégorie parente a ${kids} sous-catégorie(s). La suppression sera refusée tant qu'elles existent. Continuer ?`;
    else if (count > 0) msg = `Cette catégorie contient ${count} produit(s). La suppression sera refusée si des produits y sont liés. Continuer ?`;
    if (confirm(msg)) deleteMutation.mutate(Number(category.id));
  };

  const toggleExpand = (id: number) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const CategoryCard = ({
    category,
    isChild = false,
  }: {
    category: CategoryDTO;
    isChild?: boolean;
  }) => {
    const kidCount = childrenByParent.get(Number(category.id))?.length ?? 0;
    const isRoot = category.parentId == null;

    return (
      <div
        className={cn(
          'bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow',
          isChild && 'ml-0 sm:ml-2 border-l-2 border-l-primary/30'
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', isRoot ? 'bg-primary/10' : 'bg-muted')}>
              {isRoot ? (
                <FolderTree className="w-5 h-5 text-primary" />
              ) : (
                <FolderOpen className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base truncate">{category.name}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {category.slug}
                </Badge>
                {isRoot ? (
                  <Badge className="text-[10px] bg-primary/15 text-primary hover:bg-primary/15">Parente</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    Sous · {category.parentName}
                  </Badge>
                )}
                {isRoot && kidCount > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    {kidCount} sous-cat.
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(category)} title={t('common.edit')}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(category)}
              title={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{category.description || '—'}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="w-3.5 h-3.5" />
            {category.productCount ?? 0} produit(s)
          </span>
          {isRoot && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => openCreateChild(Number(category.id))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Sous-catégorie
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title={t('categories.title')} breadcrumbs={[{ label: t('categories.breadcrumb') }]}>
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div>
          <p className="font-medium text-sm sm:text-base">Catégories parentes & sous-catégories</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Créez d&apos;abord une <strong>catégorie parente</strong> (ex. Sachets), puis des sous-catégories (ex. Kraft, Transparent).
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={openCreateParent} className="font-body w-full sm:w-auto">
            <FolderTree className="w-4 h-4 mr-2" />
            Nouvelle catégorie parente
          </Button>
          <Button
            onClick={() => openCreateChild()}
            variant="outline"
            className="font-body w-full sm:w-auto"
            disabled={roots.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle sous-catégorie
          </Button>
        </div>
        {roots.length === 0 && (
          <p className="text-xs text-amber-700">Créez au moins une catégorie parente avant d&apos;ajouter des sous-catégories.</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'all', label: 'Arborescence' },
              { id: 'parents', label: `Parentes (${roots.length})` },
              {
                id: 'children',
                label: `Sous-catégories (${categories.filter((c) => c.parentId != null).length})`,
              },
            ] as const
          ).map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={viewFilter === f.id ? 'default' : 'outline'}
              onClick={() => setViewFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Link
            to="/admin/accueil-categories"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Catégories accueil
          </Link>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <FolderTree className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium mb-1">Aucune catégorie</p>
          <p className="text-sm text-muted-foreground mb-4">
            Commencez par une catégorie parente pour structurer le catalogue.
          </p>
          <Button onClick={openCreateParent}>
            <FolderTree className="w-4 h-4 mr-2" />
            Créer une catégorie parente
          </Button>
        </div>
      ) : viewFilter === 'children' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .filter((c) => c.parentId != null && matchesSearch(c, search.trim().toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
            .map((c) => (
              <CategoryCard key={c.id} category={c} isChild />
            ))}
        </div>
      ) : viewFilter === 'parents' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roots
            .filter((c) => matchesSearch(c, search.trim().toLowerCase()))
            .map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(filteredTree as { root: CategoryDTO; children: CategoryDTO[] }[]).map(({ root, children }) => {
            const id = Number(root.id);
            const open = expandedParents.has(id);
            return (
              <div key={root.id} className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/30 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left min-w-0 flex-1"
                    onClick={() => toggleExpand(id)}
                  >
                    {open ? (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                    <FolderTree className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-display text-lg truncate">{root.name}</span>
                    <Badge className="text-[10px] bg-primary/15 text-primary hover:bg-primary/15 shrink-0">
                      Parente
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {children.length} sous-cat. · {root.productCount ?? 0} prod.
                    </span>
                  </button>
                  <div className="flex gap-1 sm:ml-auto shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openCreateChild(id)}>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Sous-catégorie
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(root)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(root)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {open && (
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-background">
                    {children.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-full py-2 px-1">
                        Aucune sous-catégorie.{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => openCreateChild(id)}
                        >
                          En ajouter une
                        </button>
                      </p>
                    ) : (
                      children.map((child) => <CategoryCard key={child.id} category={child} isChild />)
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {(filteredTree as { root: CategoryDTO; children: CategoryDTO[] }[]).length === 0 && (
            <p className="text-center text-muted-foreground py-8">Aucun résultat</p>
          )}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCategory
                ? 'Modifier la catégorie'
                : createMode === 'parent'
                  ? 'Nouvelle catégorie parente'
                  : 'Nouvelle sous-catégorie'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingCategory && (
              <div>
                <Label>Type</Label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={createMode === 'parent' ? 'default' : 'outline'}
                    onClick={() => {
                      setCreateMode('parent');
                      setFormData((p) => ({ ...p, parentId: '' }));
                    }}
                  >
                    Parente
                  </Button>
                  <Button
                    type="button"
                    variant={createMode === 'child' ? 'default' : 'outline'}
                    disabled={roots.length === 0}
                    onClick={() => setCreateMode('child')}
                  >
                    Sous-catégorie
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={
                  createMode === 'parent' || (!formData.parentId && editingCategory?.parentId == null)
                    ? 'Ex: Sachets, Cartons…'
                    : 'Ex: Kraft, Transparent…'
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="sachets"
                required
                className="mt-1 font-mono text-sm"
              />
            </div>

            {(createMode === 'child' ||
              (editingCategory != null && (formData.parentId || createMode === 'child')) ||
              editingCategory != null) && (
              <div>
                <Label>Catégorie parente {createMode === 'child' || formData.parentId ? '*' : ''}</Label>
                <Select
                  value={formData.parentId || 'none'}
                  onValueChange={(v) => {
                    setFormData((prev) => ({ ...prev, parentId: v === 'none' ? '' : v }));
                    if (v !== 'none') setCreateMode('child');
                    else setCreateMode('parent');
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir une parente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune — catégorie parente (racine)</SelectItem>
                    {parentOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  « Aucune » = catégorie parente. Sinon = sous-catégorie rattachée.
                </p>
              </div>
            )}

            {createMode === 'parent' && !editingCategory && (
              <p className="text-xs text-muted-foreground rounded-md bg-muted/50 p-2">
                Cette catégorie sera une <strong>parente</strong> (racine). Vous pourrez ensuite y ajouter des sous-catégories.
              </p>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description courte…"
                rows={3}
                className="mt-1"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingCategory ? 'Enregistrer' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
