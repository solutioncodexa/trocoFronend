import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ImageUpload from '@/components/admin/ImageUpload';
import { storeBlogApi } from '@/services/api/storeBlog';
import { uploadImage } from '@/services/api/upload';
import type { StoreBlogPost, UpsertBlogPostPayload } from '@/types/store-blog';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { useAdmin } from '@/contexts/AdminContext';

const emptyForm = (): UpsertBlogPostPayload => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverUrl: '',
  seoTitle: '',
  seoDescription: '',
  lang: 'fr',
  published: false,
});

const AdminBlog = () => {
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StoreBlogPost | null>(null);
  const [form, setForm] = useState<UpsertBlogPostPayload>(emptyForm());

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['store-blog'],
    queryFn: () => storeBlogApi.list(),
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setForm({
        title: editing.title,
        slug: editing.slug,
        excerpt: editing.excerpt ?? '',
        content: editing.content,
        coverUrl: editing.coverUrl ?? '',
        seoTitle: editing.seoTitle ?? '',
        seoDescription: editing.seoDescription ?? '',
        lang: editing.lang ?? 'fr',
        published: editing.published,
      });
    } else {
      setForm(emptyForm());
    }
  }, [dialogOpen, editing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? storeBlogApi.update(editing.id, form)
        : storeBlogApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-blog'] });
      toast.success(editing ? 'Article mis à jour' : 'Article créé');
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (err) => toastError(err, 'Enregistrement impossible'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => storeBlogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-blog'] });
      toast.success('Article supprimé');
    },
    onError: (err) => toastError(err, 'Suppression impossible'),
  });

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (post: StoreBlogPost) => {
    setEditing(post);
    setDialogOpen(true);
  };

  return (
    <AdminLayout
      title="Blog"
      breadcrumbs={[{ label: 'Blog' }]}
      description="Articles publiés sur /blog de votre boutique."
      actions={
        <Button className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nouvel article
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Aucun article. Créez votre premier contenu.
        </p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display font-semibold">{post.title}</p>
                  <Badge variant={post.published ? 'default' : 'outline'}>
                    {post.published ? 'Publié' : 'Brouillon'}
                  </Badge>
                  <Badge variant="secondary">{post.lang ?? 'fr'}</Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">/blog/{post.slug}</p>
                {post.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.excerpt}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => openEdit(post)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Éditer
                </Button>
                {isAdmin ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (window.confirm(`Supprimer « ${post.title} » ?`)) {
                        deleteMutation.mutate(post.id);
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier l’article' : 'Nouvel article'}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
          >
            <div>
              <Label>Titre</Label>
              <Input
                className="mt-1.5"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input
                className="mt-1.5 font-mono text-sm"
                value={form.slug ?? ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="mon-article"
              />
            </div>
            <div>
              <Label>Extrait</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={form.excerpt ?? ''}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label>Contenu</Label>
              <Textarea
                className="mt-1.5 font-mono text-sm"
                rows={10}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Image de couverture</Label>
              <ImageUpload
                value={form.coverUrl ?? ''}
                onChange={(v) => setForm({ ...form, coverUrl: v })}
                onUpload={uploadImage}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Langue</Label>
                <Input
                  className="mt-1.5"
                  value={form.lang ?? 'fr'}
                  onChange={(e) => setForm({ ...form, lang: e.target.value })}
                />
              </div>
              <label className="flex items-center justify-between gap-3 pt-6 text-sm">
                <span>Publié</span>
                <Switch
                  checked={!!form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
              </label>
            </div>
            <div>
              <Label>SEO — titre</Label>
              <Input
                className="mt-1.5"
                value={form.seoTitle ?? ''}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              />
            </div>
            <div>
              <Label>SEO — description</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={form.seoDescription ?? ''}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} className="gap-1.5">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlog;
