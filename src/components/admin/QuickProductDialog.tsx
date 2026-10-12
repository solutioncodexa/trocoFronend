import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ImagePlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { categoriesApi } from '@/services/api/categories';
import { productsApi } from '@/services/api/products';
import { compressImage } from '@/utils/compressImage';
import { slugify } from '@/utils/slug';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const NEW_CATEGORY = '__new__';

export type QuickProductReplace = { id: string; name: string; price: number; category: string };

/**
 * Ajout d'un produit en 30 secondes (photo, nom, prix, catégorie) sans quitter l'assistant.
 * Avec `replace`, le nouveau produit prend la place d'un produit d'exemple (qui est ensuite supprimé).
 */
export function QuickProductDialog({
  open,
  onOpenChange,
  replace,
  fullFormHref,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replace?: QuickProductReplace | null;
  fullFormHref: string;
  onDone: () => void;
}) {
  const { t } = useAdminLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: categories = [], isFetched: categoriesLoaded } = useQuery({
    queryKey: ['categories', 'quick-product'],
    queryFn: () => categoriesApi.getAllCategories(),
    enabled: open,
  });

  // Réinitialisation à chaque ouverture (préremplie avec le produit d'exemple à remplacer).
  useEffect(() => {
    if (!open) return;
    setPhoto(null);
    setPhotoUrl('');
    setName('');
    setPrice(replace ? String(replace.price) : '');
    setCategory(replace?.category ?? '');
    setNewCategory('');
    setDescription('');
  }, [open, replace]);

  // Catégorie valide : celle du produit remplacé (slug ou nom), sinon la première existante, sinon une nouvelle.
  useEffect(() => {
    if (!open || !categoriesLoaded || category === NEW_CATEGORY) return;
    if (categories.some((c) => c.slug === category)) return;
    const byName = categories.find((c) => c.name === category);
    setCategory(byName?.slug ?? categories[0]?.slug ?? NEW_CATEGORY);
  }, [open, categoriesLoaded, categories, category]);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    const optimized = await compressImage(file).catch(() => file);
    setPhoto(optimized);
    setPhotoUrl(URL.createObjectURL(optimized));
  };

  const save = async () => {
    const priceValue = Number(price.replace(',', '.'));
    const isNewCategory = category === NEW_CATEGORY;
    const categoryName = newCategory.trim();
    if (!name.trim() || !(priceValue > 0) || (isNewCategory ? !categoryName : !category)) {
      toast.error(t('ob.quick.required'));
      return;
    }
    setSaving(true);
    try {
      let categorySlug = category;
      if (isNewCategory) {
        categorySlug = slugify(categoryName) || `categorie-${Date.now().toString(36)}`;
        if (!categories.some((c) => c.slug === categorySlug)) {
          await categoriesApi.createCategory({ name: categoryName, slug: categorySlug });
        }
      }
      await productsApi.createProduct(
        {
          name: name.trim(),
          description: description.trim() || name.trim(),
          price: priceValue,
          category: categorySlug,
          stockQuantity: 10,
        },
        photo ? [photo] : [],
      );
      if (replace) {
        // Le vrai produit existe déjà : un échec ici laisse seulement l'exemple en place.
        await productsApi.deleteProduct(replace.id).catch(() => undefined);
      }
      toast.success(t(replace ? 'ob.quick.replaced' : 'ob.quick.done', { name: name.trim() }));
      onDone();
      onOpenChange(false);
    } catch (e) {
      toastError(e, t('ob.quick.err'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{replace ? t('ob.quick.replaceTitle', { name: replace.name }) : t('ob.quick.title')}</DialogTitle>
          <DialogDescription>{t('ob.quick.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">{t('ob.quick.photo')}</Label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground transition hover:border-primary/50"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5">
                  <ImagePlus className="h-6 w-6" aria-hidden />
                  {t('ob.quick.photoPick')}
                </span>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void pickPhoto(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>

          <div>
            <Label htmlFor="qp-name">{t('ob.quick.name')}</Label>
            <Input id="qp-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="qp-price">{t('ob.quick.price')}</Label>
              <Input
                id="qp-price"
                className="mt-1.5"
                inputMode="decimal"
                dir="ltr"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d.,]/g, ''))}
              />
            </div>
            <div>
              <Label htmlFor="qp-category">{t('ob.quick.category')}</Label>
              <select
                id="qp-category"
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.parentName ? `${c.parentName} › ${c.name}` : c.name}
                  </option>
                ))}
                <option value={NEW_CATEGORY}>+ {t('ob.quick.newCategory')}</option>
              </select>
            </div>
          </div>

          {category === NEW_CATEGORY ? (
            <Input
              aria-label={t('ob.quick.newCategory')}
              value={newCategory}
              placeholder={t('ob.quick.categoryPlaceholder')}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          ) : null}

          <div>
            <Label htmlFor="qp-desc">{t('ob.quick.description')}</Label>
            <Textarea id="qp-desc" className="mt-1.5" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <Link to={fullFormHref} className="text-xs text-muted-foreground underline hover:text-foreground">
            {t('ob.quick.more')}
          </Link>
          <Button type="button" className="gap-2" disabled={saving} onClick={() => void save()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('ob.quick.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
