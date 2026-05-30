import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { categoriesApi } from '@/services/api/categories';
import { getImageUrl, uploadImage } from '@/services/api/upload';
import type { CategoryDTO, HeroCategoryPatchDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

type RowState = Record<
  number,
  {
    showOnHero: boolean;
    /** null = ordre automatique (affichage aléatoire sur le site) */
    heroSortOrder: number | null;
    heroImageUrl: string;
    dirty: boolean;
  }
>;

const defaultRow = (c: CategoryDTO): RowState[number] => ({
  showOnHero: Boolean(c.showOnHero),
  heroSortOrder: c.heroSortOrder == null ? null : c.heroSortOrder,
  heroImageUrl: c.heroImageUrl ?? '',
  dirty: false,
});

function buildHeroPatch(st: RowState[number]): HeroCategoryPatchDTO {
  const patch: HeroCategoryPatchDTO = {
    showOnHero: st.showOnHero,
    heroImageUrl: st.heroImageUrl.trim() === '' ? '' : st.heroImageUrl.trim(),
  };
  if (st.heroSortOrder === null || st.heroSortOrder === undefined) {
    patch.automaticHeroSortOrder = true;
  } else {
    patch.automaticHeroSortOrder = false;
    patch.heroSortOrder = st.heroSortOrder;
  }
  return patch;
}

const rowFromDto = (u: CategoryDTO): RowState[number] => ({
  showOnHero: Boolean(u.showOnHero),
  heroSortOrder: u.heroSortOrder == null ? null : u.heroSortOrder,
  heroImageUrl: u.heroImageUrl ?? '',
  dirty: false,
});

const AdminHeroCategories = () => {
  const queryClient = useQueryClient();
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  const rowStateRef = useRef<RowState>({});
  const sortedRef = useRef<CategoryDTO[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [categories]
  );

  const [rowState, setRowState] = useState<RowState>({});

  useEffect(() => {
    rowStateRef.current = rowState;
  }, [rowState]);

  useEffect(() => {
    sortedRef.current = sorted;
  }, [sorted]);

  useEffect(() => {
    const hasDirty = Object.values(rowState).some((r) => r?.dirty);
    if (!hasDirty) return;

    const timer = window.setTimeout(async () => {
      const cur = rowStateRef.current;
      const dirtyPairs = Object.entries(cur).filter(([, r]) => r?.dirty);
      if (!dirtyPairs.length) return;

      setSaving(true);
      const updates: Record<number, RowState[number]> = {};
      let err: unknown;
      for (const [idStr, st] of dirtyPairs) {
        const id = Number(idStr);
        const cat = sortedRef.current.find((c) => Number(c.id) === id);
        if (!cat) continue;
        try {
          const updated = await categoriesApi.patchCategoryHero(id, buildHeroPatch(st));
          updates[id] = rowFromDto(updated);
        } catch (e) {
          err = e;
          break;
        }
      }

      if (Object.keys(updates).length > 0) {
        setRowState((prev) => {
          const next = { ...prev };
          for (const [idStr, row] of Object.entries(updates)) {
            next[Number(idStr)] = row;
          }
          return next;
        });
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        await queryClient.invalidateQueries({ queryKey: ['heroCategories'] });
      }

      if (err) {
        toastError(err, 'Erreur lors de l\'enregistrement');
      }
      setSaving(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [rowState, queryClient]);

  const updateRow = (id: number, partial: Partial<RowState[number]>) => {
    setRowState((prev) => {
      const cat = sorted.find((c) => Number(c.id) === id);
      if (!cat) return prev;
      const base = prev[id] ?? defaultRow(cat);
      return {
        ...prev,
        [id]: { ...base, ...partial, dirty: true },
      };
    });
  };

  const applyOrderInput = (id: number, raw: string) => {
    const v = raw.trim();
    if (v === '') {
      updateRow(id, { heroSortOrder: null });
      return;
    }
    const n = parseInt(v, 10);
    if (!Number.isFinite(n) || n < 0 || n > 9999) {
      toast.error('Ordre : nombre entre 0 et 9999, ou vide pour automatique.');
      return;
    }
    updateRow(id, { heroSortOrder: n });
  };

  const onPickFile = async (c: CategoryDTO, file: File | null) => {
    if (!file) return;
    const id = Number(c.id);
    try {
      const url = await uploadImage(file);
      await categoriesApi.patchCategoryHero(id, { heroImageUrl: url });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['heroCategories'] });
      setRowState((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] ?? defaultRow(c)),
          heroImageUrl: url,
          dirty: false,
        },
      }));
      toast.success('Image mise à jour');
    } catch (e) {
      toastError(e, 'Erreur lors de l\'upload de l\'image');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Accueil — catégories" breadcrumbs={[{ label: 'Accueil catégories' }]}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Bandeau d’accueil (catégories)"
      breadcrumbs={[{ label: 'Accueil catégories' }]}
    >
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
        Les changements (affichage, ordre) sont enregistrés automatiquement après une courte pause. Ordre vide =
        automatique : ces catégories sont mélangées aléatoirement sur l’accueil avec les autres sans ordre manuel. Ordre
        numérique 0–9999 = position fixe (du plus petit au plus grand). Seules les catégories avec « Afficher » activé
        et une image apparaissent sur l’accueil.
      </p>
      {saving ? (
        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Enregistrement…
        </p>
      ) : null}

      {/* Mobile: card layout */}
      <div className="block md:hidden space-y-3">
        {sorted.map((c) => {
          const id = Number(c.id);
          const st = rowState[id] ?? defaultRow(c);
          const preview = st.heroImageUrl ? getImageUrl(st.heroImageUrl) : '';

          return (
            <div key={id} className="rounded-lg border border-border p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.slug}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    id={`hero-m-${id}`}
                    checked={st.showOnHero}
                    onCheckedChange={(v) => updateRow(id, { showOnHero: Boolean(v) })}
                  />
                  <Label htmlFor={`hero-m-${id}`} className="text-xs">Afficher</Label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                )}
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Ordre (auto)"
                  className="h-9 flex-1 font-mono text-xs"
                  value={st.heroSortOrder === null ? '' : String(st.heroSortOrder)}
                  onChange={(e) => applyOrderInput(id, e.target.value)}
                  aria-label="Ordre d'affichage"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputs.current[id] = el; }}
                  onChange={(e) => onPickFile(c, e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-9 w-9 p-0"
                  onClick={() => fileInputs.current[id]?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden md:block rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Catégorie</th>
              <th className="p-3 font-medium">Afficher</th>
              <th className="p-3 font-medium w-36">Ordre</th>
              <th className="p-3 font-medium">Aperçu</th>
              <th className="p-3 font-medium">Image</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const id = Number(c.id);
              const st = rowState[id] ?? defaultRow(c);
              const preview = st.heroImageUrl ? getImageUrl(st.heroImageUrl) : '';

              return (
                <tr key={id} className="border-t border-border align-middle">
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{c.slug}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`hero-${id}`}
                        checked={st.showOnHero}
                        onCheckedChange={(v) => updateRow(id, { showOnHero: Boolean(v) })}
                      />
                      <Label htmlFor={`hero-${id}`} className="sr-only">
                        Afficher sur l’accueil
                      </Label>
                    </div>
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Auto"
                      className="h-9 w-28 font-mono text-xs"
                      value={st.heroSortOrder === null ? '' : String(st.heroSortOrder)}
                      onChange={(e) => applyOrderInput(id, e.target.value)}
                      aria-label="Ordre d’affichage (vide = automatique)"
                    />
                  </td>
                  <td className="p-3">
                    {preview ? (
                      <img
                        src={preview}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => {
                        fileInputs.current[id] = el;
                      }}
                      onChange={(e) => onPickFile(c, e.target.files?.[0] ?? null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => fileInputs.current[id]?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroCategories;
