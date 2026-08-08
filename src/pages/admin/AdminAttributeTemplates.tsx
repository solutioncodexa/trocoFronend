import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil, SlidersHorizontal, Store } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { categoriesApi } from '@/services/api/categories';
import {
  attributeTemplatesApi,
  type ProductAttributeTemplate,
} from '@/services/api/attributeTemplates';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

type AxisForm = {
  name: string;
  valuesText: string;
  required: boolean;
};

type EditorTarget = {
  categoryId: number | null;
  label: string;
};

const BRAND_KEY = 'brand';

const AdminAttributeTemplates = () => {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['attribute-templates'],
    queryFn: () => attributeTemplatesApi.getAll(),
  });

  const brandTemplate = useMemo(
    () => templates.find((t) => t.categoryId == null) ?? null,
    [templates],
  );
  const templateByCategory = useMemo(() => {
    const map = new Map<number, ProductAttributeTemplate>();
    for (const t of templates) {
      if (t.categoryId != null) map.set(t.categoryId, t);
    }
    return map;
  }, [templates]);

  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [axes, setAxes] = useState<AxisForm[]>([]);

  const openEditor = (target: EditorTarget, existing: ProductAttributeTemplate | null) => {
    setEditorTarget(target);
    setAxes(
      (existing?.axes ?? []).map((a) => ({
        name: a.name,
        valuesText: (a.values ?? []).join(', '),
        required: Boolean(a.required),
      })),
    );
  };

  const closeEditor = () => {
    setEditorTarget(null);
    setAxes([]);
  };

  const saveMutation = useMutation({
    mutationFn: (payload: { categoryId: number | null; axes: AxisForm[] }) =>
      attributeTemplatesApi.save({
        categoryId: payload.categoryId,
        axes: payload.axes
          .filter((a) => a.name.trim())
          .map((a) => ({
            name: a.name.trim(),
            values: a.valuesText
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
            required: a.required,
          })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      toast.success('Modèle enregistré');
      closeEditor();
    },
    onError: (err: Error) => toastError(err, "Erreur lors de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => attributeTemplatesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      toast.success('Modèle supprimé');
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de la suppression'),
  });

  const handleDelete = (tpl: ProductAttributeTemplate | null) => {
    if (!tpl?.id) return;
    if (confirm('Supprimer ce modèle d’attributs ?')) {
      deleteMutation.mutate(tpl.id);
    }
  };

  const addAxis = () => setAxes((prev) => [...prev, { name: '', valuesText: '', required: false }]);
  const updateAxis = (index: number, patch: Partial<AxisForm>) =>
    setAxes((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  const removeAxis = (index: number) => setAxes((prev) => prev.filter((_, i) => i !== index));

  const renderRow = (
    key: string,
    label: string,
    icon: React.ReactNode,
    tpl: ProductAttributeTemplate | null,
    target: EditorTarget,
  ) => {
    const axisCount = tpl?.axes?.length ?? 0;
    return (
      <div
        key={key}
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{label}</p>
            {axisCount > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {tpl!.axes.map((a) => (
                  <Badge key={a.name} variant="secondary" className="text-[10px]">
                    {a.name}
                    {a.required ? ' *' : ''}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Non configuré</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditor(target, tpl)}>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            {axisCount > 0 ? 'Modifier' : 'Configurer'}
          </Button>
          {tpl?.id ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleDelete(tpl)}
              aria-label="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout
      title="Attributs & variantes"
      breadcrumbs={[{ label: 'Catalogue' }, { label: 'Attributs & variantes' }]}
    >
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Définissez les axes de variantes adaptés à votre boutique (ex. Bijoux → Matière, Carat,
        Taille ; Épicerie → Poids). Le modèle d’une catégorie prime ; sinon le modèle par défaut de
        la boutique s’applique. Ces axes pré-remplissent le formulaire produit.
      </p>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Chargement…</div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Modèle par défaut de la boutique
            </h3>
            {renderRow(
              BRAND_KEY,
              'Toutes les catégories (fallback)',
              <Store className="h-4 w-4" />,
              brandTemplate,
              { categoryId: null, label: 'Modèle par défaut de la boutique' },
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Par catégorie
            </h3>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune catégorie. Créez-en pour configurer des axes spécifiques.
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) =>
                  renderRow(
                    `cat-${cat.id}`,
                    cat.name,
                    <SlidersHorizontal className="h-4 w-4" />,
                    templateByCategory.get(cat.id) ?? null,
                    { categoryId: cat.id, label: cat.name },
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <Dialog open={editorTarget !== null} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Axes d’attributs — {editorTarget?.label}</DialogTitle>
            <DialogDescription>
              Chaque axe devient une dimension de variante (ex. Taille). Les valeurs suggérées
              accélèrent la saisie ; l’admin reste libre d’en saisir d’autres.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[55vh] space-y-3 overflow-y-auto py-1">
            {axes.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Aucun axe. Ajoutez-en un pour ce modèle.
              </p>
            ) : (
              axes.map((axis, index) => (
                <div key={index} className="rounded-xl border border-border bg-muted/20 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Axe {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeAxis(index)}
                      aria-label="Supprimer l’axe"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Nom de l’axe *</Label>
                      <Input
                        value={axis.name}
                        onChange={(e) => updateAxis(index, { name: e.target.value })}
                        placeholder="Taille, Matière, Couleur…"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Valeurs suggérées (séparées par des virgules)</Label>
                      <Input
                        value={axis.valuesText}
                        onChange={(e) => updateAxis(index, { valuesText: e.target.value })}
                        placeholder="S, M, L, XL"
                        className="mt-1"
                      />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
                      <Switch
                        checked={axis.required}
                        onCheckedChange={(checked) => updateAxis(index, { required: checked })}
                      />
                      Obligatoire sur chaque variante
                    </label>
                  </div>
                </div>
              ))
            )}
            <Button type="button" variant="outline" size="sm" onClick={addAxis}>
              <Plus className="mr-1 h-4 w-4" />
              Ajouter un axe
            </Button>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={closeEditor}>
              Annuler
            </Button>
            <Button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() =>
                editorTarget &&
                saveMutation.mutate({ categoryId: editorTarget.categoryId, axes })
              }
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAttributeTemplates;
