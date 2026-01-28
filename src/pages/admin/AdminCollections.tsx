import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { Collection, defaultCollections } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>(defaultCollections);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        isActive: collection.isActive,
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const collectionData: Collection = {
      id: editingCollection?.id || Date.now().toString(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      isActive: formData.isActive,
      createdAt: editingCollection?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingCollection) {
      setCollections(prev => prev.map(c => c.id === editingCollection.id ? collectionData : c));
      toast.success('Collection modifiée avec succès');
    } else {
      setCollections(prev => [...prev, collectionData]);
      toast.success('Collection ajoutée avec succès');
    }

    handleCloseModal();
  };

  const handleDelete = (collectionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      setCollections(prev => prev.filter(c => c.id !== collectionId));
      toast.success('Collection supprimée');
    }
  };

  const toggleActive = (collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, isActive: !c.isActive } : c
    ));
    toast.success('Statut de la collection modifié');
  };

  return (
    <AdminLayout title="Collections">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gérez les collections de produits</h1>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle collection
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-background rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Collection</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCollections.map((collection) => (
                <tr key={collection.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {collection.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{collection.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Créée le {new Date(collection.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {collection.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {collection.description || 'Aucune description'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(collection.id)}
                      className="flex items-center gap-2 text-sm"
                    >
                      {collection.isActive ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(collection)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(collection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCollections.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Aucune collection trouvée</p>
            </div>
          )}
        </div>

        {/* Collection Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Modifier la collection' : 'Nouvelle collection'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la collection *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  className="mt-1"
                  placeholder="url-de-la-collection"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Utilisé dans les URLs. Auto-généré à partir du nom.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1"
                  placeholder="Description de la collection..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isActive">Collection active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingCollection ? 'Enregistrer' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
