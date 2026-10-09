import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Instagram, Loader2, Sparkles, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { categoriesApi } from '@/services/api/categories';
import { instagramImportApi, type InstagramDraft, type InstagramImportItem } from '@/services/api/instagramImport';

const DRAFTS_KEY = ['instagram-import', 'drafts'] as const;
const INSTAGRAM_LINK = /https?:\/\/(www\.)?instagram\.com\/\S+/i;
const inputClass =
  'w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Une carte de brouillon : chaque champ s'enregistre dès qu'on le quitte. */
const DraftCard = ({
  draft,
  categories,
  selected,
  onSelect,
  onSave,
  onDiscard,
}: {
  draft: InstagramDraft;
  categories: { slug: string; name: string }[];
  selected: boolean;
  onSelect: (on: boolean) => void;
  onSave: (patch: Parameters<typeof instagramImportApi.update>[1]) => void;
  onDiscard: () => void;
}) => {
  const { t } = useAdminLocale();
  const blocking = draft.issues;
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card p-3">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelect(e.target.checked)}
        aria-label={draft.name ?? ''}
        className="mt-1 h-4 w-4 shrink-0"
      />
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        {draft.images[0] ? <img src={draft.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="grid gap-2 sm:grid-cols-[1fr_7rem_5rem_11rem]">
          <label className="space-y-0.5 text-xs text-muted-foreground">
            {t('ig.field.name')}
            <input
              className={inputClass}
              defaultValue={draft.name ?? ''}
              onBlur={(e) => e.target.value !== (draft.name ?? '') && onSave({ name: e.target.value })}
            />
          </label>
          <label className="space-y-0.5 text-xs text-muted-foreground">
            {t('ig.field.price')}
            <input
              className={inputClass}
              inputMode="decimal"
              defaultValue={draft.price ?? ''}
              onBlur={(e) => {
                const v = Number(e.target.value.replace(',', '.'));
                if (v > 0 && v !== draft.price) onSave({ price: v });
              }}
            />
          </label>
          <label className="space-y-0.5 text-xs text-muted-foreground">
            {t('ig.field.stock')}
            <input
              className={inputClass}
              inputMode="numeric"
              defaultValue={draft.stock}
              onBlur={(e) => {
                const v = Math.floor(Number(e.target.value));
                if (v >= 0 && v !== draft.stock) onSave({ stock: v });
              }}
            />
          </label>
          <label className="space-y-0.5 text-xs text-muted-foreground">
            {t('ig.field.category')}
            <select
              className={inputClass}
              value={draft.categorySlug ?? ''}
              onChange={(e) => onSave({ categorySlug: e.target.value })}
            >
              <option value="">{t('ig.noCategory')}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {blocking.map((i) => (
            <span key={i} className="rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
              {t(`ig.issue.${i}` as 'ig.issue.name')}
            </span>
          ))}
          {draft.aiExtracted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              <Sparkles className="h-3 w-3" aria-hidden />
              {t('ig.ai')}
            </span>
          ) : null}
          {draft.sourceUrl ? (
            <a href={draft.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline">
              Instagram
            </a>
          ) : null}
          <button type="button" onClick={onDiscard} className="ms-auto inline-flex items-center gap-1 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            {t('ig.discard')}
          </button>
        </div>
      </div>
    </li>
  );
};

const AdminInstagramImport = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const photosRef = useRef<HTMLInputElement>(null);
  const [links, setLinks] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [defaultCategory, setDefaultCategory] = useState('');
  const [publishedCount, setPublishedCount] = useState<number | null>(null);

  const { data: drafts = [] } = useQuery({ queryKey: DRAFTS_KEY, queryFn: instagramImportApi.drafts });
  const { data: categories = [] } = useQuery({ queryKey: ['categories', 'all'], queryFn: () => categoriesApi.getAllCategories() });
  const categoryChoices = useMemo(() => categories.map((c) => ({ slug: c.slug, name: c.name })), [categories]);

  // Les brouillons prêts (rien à compléter) sont cochés d'office : « Publier » est alors un seul clic.
  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(drafts.map((d) => d.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      drafts.forEach((d) => {
        if (d.issues.length === 0 && !prev.has(d.id)) next.add(d.id);
      });
      return next;
    });
  }, [drafts]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: DRAFTS_KEY });
  const fail = () => setError(t('ig.error'));

  const summarize = (items: InstagramImportItem[]) => {
    const count = (r: InstagramImportItem['result']) => items.filter((i) => i.result === r).length;
    const notes = items.filter((i) => i.message).map((i) => i.message);
    setFeedback(
      [t('ig.summary', { created: count('CREATED'), dup: count('DUPLICATE'), bad: count('INVALID') }), ...notes.slice(0, 3)].join(' '),
    );
  };

  const importLinks = useMutation({
    mutationFn: (urls: string[]) => instagramImportApi.importLinks(urls),
    onSuccess: (items) => {
      setLinks('');
      summarize(items);
      void refresh();
    },
    onError: fail,
  });

  const importUpload = useMutation({
    mutationFn: () => instagramImportApi.importUpload(photos, caption),
    onSuccess: (item) => {
      setPhotos([]);
      setCaption('');
      if (photosRef.current) photosRef.current.value = '';
      summarize([item]);
      void refresh();
    },
    onError: fail,
  });

  const save = useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Parameters<typeof instagramImportApi.update>[1] }) =>
      instagramImportApi.update(id, patch),
    onSuccess: (draft) => {
      queryClient.setQueryData<InstagramDraft[]>(DRAFTS_KEY, (old) => old?.map((d) => (d.id === draft.id ? draft : d)));
      // Un brouillon devenu complet se coche tout seul.
      if (draft.issues.length === 0) setSelected((s) => new Set(s).add(draft.id));
    },
    onError: fail,
  });

  const discard = useMutation({
    mutationFn: (id: number) => instagramImportApi.discard(id),
    onSuccess: () => void refresh(),
    onError: fail,
  });

  const publish = useMutation({
    mutationFn: () => instagramImportApi.publish([...selected], defaultCategory || undefined),
    onSuccess: (items) => {
      const ok = items.filter((i) => i.published).length;
      const failed = items.filter((i) => !i.published);
      setPublishedCount(ok);
      setError(failed.length ? t('ig.publishFailed', { n: failed.length, first: failed[0].message ?? '' }) : null);
      void refresh();
      void queryClient.invalidateQueries({ predicate: (q) => /product/i.test(JSON.stringify(q.queryKey)) });
    },
    onError: fail,
  });

  const onLinksChange = (value: string) => {
    setLinks(value);
    setError(null);
  };

  /** Coller un lien lance l'import tout de suite, sans second clic. */
  const onLinksPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!INSTAGRAM_LINK.test(pasted)) return;
    e.preventDefault();
    const urls = pasted.split(/\s+/).filter((u) => INSTAGRAM_LINK.test(u));
    setFeedback(null);
    importLinks.mutate(urls);
  };

  const submitLinks = () => {
    const urls = links.split(/\s+/).filter(Boolean);
    if (urls.length) importLinks.mutate(urls);
  };

  const busy = importLinks.isPending || importUpload.isPending;
  const allSelected = drafts.length > 0 && drafts.every((d) => selected.has(d.id));
  const toggleAll = (on: boolean) => setSelected(on ? new Set(drafts.map((d) => d.id)) : new Set());

  return (
    <AdminLayout
      title={t('ig.title')}
      description={t('ig.description')}
      breadcrumbs={[{ label: t('ig.title') }]}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="ig-links" className="flex items-center gap-2 font-display text-base font-semibold">
              <Instagram className="h-4 w-4" aria-hidden />
              {t('ig.links.label')}
            </label>
            <textarea
              id="ig-links"
              rows={5}
              value={links}
              placeholder={t('ig.links.placeholder')}
              onChange={(e) => onLinksChange(e.target.value)}
              onPaste={onLinksPaste}
              className={inputClass}
            />
            <Button type="button" onClick={submitLinks} disabled={busy || !links.trim()}>
              {importLinks.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
              {t('ig.links.import')}
            </Button>
          </div>

          <div className="space-y-2">
            <p className="font-display text-base font-semibold">{t('ig.upload.label')}</p>
            <textarea
              rows={3}
              value={caption}
              placeholder={t('ig.upload.caption')}
              onChange={(e) => setCaption(e.target.value)}
              className={inputClass}
            />
            <input
              ref={photosRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 10))}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={() => photosRef.current?.click()} disabled={busy}>
                <ImagePlus className="me-2 h-4 w-4" aria-hidden />
                {t('ig.upload.pick')}
              </Button>
              {photos.length > 0 ? <span className="text-sm text-muted-foreground">{t('ig.upload.photos', { n: photos.length })}</span> : null}
              <Button type="button" onClick={() => importUpload.mutate()} disabled={busy || photos.length === 0}>
                {importUpload.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                {t('ig.upload.add')}
              </Button>
            </div>
          </div>

          {feedback ? <p className="text-sm md:col-span-2">{feedback}</p> : null}
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive md:col-span-2">
              {error}
            </p>
          ) : null}
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">{t('ig.review.title')}</h2>
            {drafts.length > 0 ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={allSelected} onChange={(e) => toggleAll(e.target.checked)} className="h-4 w-4" />
                {t('ig.selectAll')}
              </label>
            ) : null}
          </div>

          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('ig.empty')}</p>
          ) : (
            <>
              <ul className="space-y-3">
                {drafts.map((d) => (
                  <DraftCard
                    key={`${d.id}-${d.name}-${d.price}-${d.categorySlug}`}
                    draft={d}
                    categories={categoryChoices}
                    selected={selected.has(d.id)}
                    onSelect={(on) =>
                      setSelected((s) => {
                        const next = new Set(s);
                        if (on) next.add(d.id);
                        else next.delete(d.id);
                        return next;
                      })
                    }
                    onSave={(patch) => save.mutate({ id: d.id, patch })}
                    onDiscard={() => discard.mutate(d.id)}
                  />
                ))}
              </ul>

              <div className="flex flex-wrap items-end gap-3 border-t pt-4">
                <label className="space-y-0.5 text-xs text-muted-foreground">
                  {t('ig.defaultCategory')}
                  <select className={inputClass} value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value)}>
                    <option value="">{t('ig.noCategory')}</option>
                    {categoryChoices.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="button" disabled={selected.size === 0 || publish.isPending} onClick={() => publish.mutate()}>
                  {publish.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                  {publish.isPending ? t('ig.publishing') : t('ig.publish', { n: selected.size })}
                </Button>
              </div>
            </>
          )}

          {publishedCount !== null && publishedCount > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              {t('ig.published', { n: publishedCount })}
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/produits">{t('ig.seeProducts')}</Link>
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminInstagramImport;
