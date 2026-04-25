import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { categoriesApi } from '@/services/api';
import { CategoryDTO } from '@/types/api';
import { toast } from 'sonner';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; slug: string }) =>
      categoriesApi.createCategory({ name: data.name, description: data.description || '', slug: data.slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie créée avec succès');
      handleCloseModal();
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur lors de la création'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string; slug: string } }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie modifiée avec succès');
      handleCloseModal();
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur lors de la modification'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie supprimée');
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur lors de la suppression'),
  });

  const handleOpenModal = (category?: CategoryDTO) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        slug: category.slug,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        slug: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || generateSlug(formData.name);
    if (editingCategory) {
      updateMutation.mutate({
        id: Number(editingCategory.id),
        data: { name: formData.name, description: formData.description, slug },
      });
    } else {
      createMutation.mutate({ name: formData.name, description: formData.description, slug });
    }
  };

  const handleDelete = (category: CategoryDTO) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteMutation.mutate(Number(category.id));
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Catégories" breadcrumbs={[{ label: 'Catégories' }]}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Catégories" breadcrumbs={[{ label: 'Catégories' }]}>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-muted-foreground">
          Gérez les catégories de produits de votre boutique
        </p>
        <Button onClick={() => handleOpenModal()} className="font-body">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(category)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(category)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-display text-xl mb-2">{category.name}</h3>
            <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
              {category.description || '—'}
            </p>
            <p className="font-body text-xs text-muted-foreground">Slug: {category.slug}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="font-display text-lg mb-2">À propos des catégories</h4>
        <ul className="font-body text-sm text-muted-foreground space-y-1">
          <li>• Les catégories permettent de filtrer les produits (ex: Beldi, Moderne)</li>
          <li>• Le slug est utilisé dans les URLs et filtres (ex: beldi, modern)</li>
        </ul>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la catégorie *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value),
                  }))
                }
                placeholder="Ex: Beldi, Moderne..."
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="beldi, modern..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la catégorie..."
                rows={3}
                className="mt-1"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
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
