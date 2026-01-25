import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { categories as initialCategories } from '@/data/adminMockData';
import { products } from '@/data/products';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    // Calculate real product counts
    return initialCategories.map(cat => ({
      ...cat,
      productCount: products.filter(p => p.category === cat.id).length,
    }));
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Prevent editing default categories IDs
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? { ...c, name: formData.name, description: formData.description }
            : c
        )
      );
      toast.success('Catégorie modifiée avec succès');
    } else {
      const newCategory: Category = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        productCount: 0,
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Catégorie créée avec succès');
    }

    handleCloseModal();
  };

  const handleDelete = (categoryId: string) => {
    // Prevent deleting default categories
    if (['beldi', 'modern'].includes(categoryId)) {
      toast.error('Cette catégorie ne peut pas être supprimée');
      return;
    }

    const category = categories.find(c => c.id === categoryId);
    if (category && category.productCount > 0) {
      toast.error(`Cette catégorie contient ${category.productCount} produit(s)`);
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast.success('Catégorie supprimée');
    }
  };

  const isDefaultCategory = (id: string) => ['beldi', 'modern'].includes(id);

  return (
    <AdminLayout title="Gestion des Catégories" breadcrumbs={[{ label: 'Catégories' }]}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-muted-foreground">
          Gérez les catégories de produits de votre boutique
        </p>
        <Button onClick={() => handleOpenModal()} className="font-body">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Categories Grid */}
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
              {!isDefaultCategory(category.id) && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <h3 className="font-display text-xl mb-2">{category.name}</h3>
            <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
              {category.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="font-body text-sm text-muted-foreground">
                {category.productCount} produit{category.productCount > 1 ? 's' : ''}
              </span>
              {isDefaultCategory(category.id) && (
                <span className="font-body text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  Par défaut
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="font-display text-lg mb-2">À propos des catégories</h4>
        <ul className="font-body text-sm text-muted-foreground space-y-1">
          <li>• Les catégories "Beldi" et "Moderne" sont des catégories par défaut et ne peuvent pas être supprimées</li>
          <li>• Vous pouvez créer des catégories personnalisées pour organiser vos produits</li>
          <li>• Une catégorie ne peut être supprimée que si elle ne contient aucun produit</li>
        </ul>
      </div>

      {/* Category Modal */}
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
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Mariage, Fiançailles..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la catégorie..."
                rows={3}
                className="mt-1"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit">
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
