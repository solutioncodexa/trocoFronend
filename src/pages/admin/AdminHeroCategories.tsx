import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, Loader2, Upload, Plus, RotateCcw, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { categoriesApi } from '@/services/api/categories';
import { homeHeroApi } from '@/services/api/homeHero';
import { getImageUrl, uploadImage, uploadImages } from '@/services/api/upload';
import type { CategoryDTO, HeroCategoryPatchDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const DEFAULT_HOME_HERO =
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=2000&h=1400&fit=crop&q=85';
const MAX_HOME_HERO_IMAGES = 8;

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
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  const homeHeroFileRef = useRef<HTMLInputElement | null>(null);
  const rowStateRef = useRef<RowState>({});
  const sortedRef = useRef<CategoryDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingHomeHero, setUploadingHomeHero] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const { data: homeHero } = useQuery({
    queryKey: ['homeHero'],
    queryFn: () => homeHeroApi.getPublic(),
    ...staticCatalogQueryOptions,
  });

  const homeHeroUrls = useMemo(() => {
    const list = homeHero?.imageUrls?.filter(Boolean) ?? [];
    if (list.length > 0) return list;
    if (homeHero?.imageUrl) return [homeHero.imageUrl];
    return [DEFAULT_HOME_HERO];
  }, [homeHero]);

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

  const saveHomeHeroUrls = async (urls: string[], successMsg: string) => {
    const next = urls.length > 0 ? urls : [DEFAULT_HOME_HERO];
    await homeHeroApi.update({ imageUrls: next, imageUrl: next[0] });
    await queryClient.invalidateQueries({ queryKey: ['homeHero'] });
    toast.success(successMsg);
  };

  const onPickHomeHero = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = MAX_HOME_HERO_IMAGES - homeHeroUrls.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_HOME_HERO_IMAGES} images`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    setUploadingHomeHero(true);
    try {
      const urls =
        selected.length === 1
          ? [await uploadImage(selected[0])]
          : await uploadImages(selected);
      await saveHomeHeroUrls([...homeHeroUrls, ...urls], 'Photos du hero mises à jour');
    } catch (e) {
      toastError(e, 'Erreur lors de l\'upload des photos du hero');
    } finally {
      setUploadingHomeHero(false);
      if (homeHeroFileRef.current) homeHeroFileRef.current.value = '';
    }
  };

  const removeHomeHeroAt = async (index: number) => {
    setUploadingHomeHero(true);
    try {
      const next = homeHeroUrls.filter((_, i) => i !== index);
      await saveHomeHeroUrls(next, 'Image retirée');
    } catch (e) {
      toastError(e, 'Erreur lors de la suppression');
    } finally {
      setUploadingHomeHero(false);
    }
  };

  const moveHomeHero = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= homeHeroUrls.length) return;
    const next = [...homeHeroUrls];
    [next[index], next[target]] = [next[target], next[index]];
    setUploadingHomeHero(true);
    try {
      await saveHomeHeroUrls(next, 'Ordre mis à jour');
    } catch (e) {
      toastError(e, 'Erreur lors du réordonnancement');
    } finally {
      setUploadingHomeHero(false);
    }
  };

  const resetHomeHero = async () => {
    setUploadingHomeHero(true);
    try {
      await saveHomeHeroUrls([DEFAULT_HOME_HERO], 'Photos du hero réinitialisées');
    } catch (e) {
      toastError(e, 'Erreur lors de la réinitialisation');
    } finally {
      setUploadingHomeHero(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title={t('heroCategories.title')}
        breadcrumbs={[
          { label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' },
          { label: t('heroCategories.title') },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={t('heroCategories.title')}
      breadcrumbs={[
        { label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' },
        { label: t('heroCategories.title') },
      ]}
    >
      <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-2xl">
          Configurez le hero de l&apos;accueil : <strong>photo de fond</strong>, catégories du{' '}
          <strong>bandeau</strong> et section <strong>Nos catégories</strong>. Pour{' '}
          <strong>créer</strong> une catégorie, allez dans Catalogue → Catégories.
        </p>
        <Button asChild className="shrink-0">
          <Link to="/admin/categories?action=new">
            <Plus className="w-4 h-4 mr-2" />
            Créer une catégorie
          </Link>
        </Button>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-foreground">Photos du hero</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Ajoutez jusqu&apos;à {MAX_HOME_HERO_IMAGES} images. Elles défilent en fondu sur
              l&apos;accueil. Préférez des photos paysage avec de l&apos;espace à gauche pour le
              texte.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <input
              ref={homeHeroFileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onPickHomeHero(e.target.files)}
            />
            <Button
              type="button"
              disabled={uploadingHomeHero || homeHeroUrls.length >= MAX_HOME_HERO_IMAGES}
              onClick={() => homeHeroFileRef.current?.click()}
            >
              {uploadingHomeHero ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Ajouter des photos
            </Button>
            <Button type="button" variant="outline" disabled={uploadingHomeHero} onClick={resetHomeHero}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {homeHeroUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={getImageUrl(url)}
                alt={`Hero ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-foreground/70 to-transparent p-2">
                <span className="text-[10px] font-medium text-primary-foreground tabular-nums">
                  {index + 1}/{homeHeroUrls.length}
                </span>
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={uploadingHomeHero || index === 0}
                    onClick={() => moveHomeHero(index, -1)}
                    aria-label={t('common.moveUp')}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={uploadingHomeHero || index === homeHeroUrls.length - 1}
                    onClick={() => moveHomeHero(index, 1)}
                    aria-label={t('common.moveDown')}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7"
                    disabled={uploadingHomeHero || homeHeroUrls.length <= 1}
                    onClick={() => removeHomeHeroAt(index)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
        Les changements sont enregistrés automatiquement. Ordre vide = automatique (mélange
        aléatoire). Ordre 0–9999 = position fixe. Activez « Afficher » et ajoutez une image pour
        qu&apos;une catégorie apparaisse sur l&apos;accueil.
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
