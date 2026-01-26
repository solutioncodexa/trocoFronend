import { useState } from 'react';
import { Plus, Pencil, Trash2, Ruler, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ProductTypeDefinition, defaultProductTypes } from '@/types/product';
import { toast } from 'sonner';

const AdminProductTypes = () => {
  const [productTypes, setProductTypes] = useState<ProductTypeDefinition[]>(defaultProductTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductTypeDefinition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    requiresSize: false,
    sizeOptions: '',
  });

  const handleOpenModal = (type?: ProductTypeDefinition) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        requiresSize: type.requiresSize,
        sizeOptions: type.sizeOptions?.join(', ') || '',
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        requiresSize: false,
        sizeOptions: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sizeOptionsArray = formData.sizeOptions
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingType) {
      setProductTypes(prev =>
        prev.map(t =>
          t.id === editingType.id
            ? {
                ...t,
                name: formData.name,
                requiresSize: formData.requiresSize,
                sizeOptions: formData.requiresSize ? sizeOptionsArray : undefined,
              }
            : t
        )
      );
      toast.success('Type de produit modifié avec succès');
    } else {
      const newType: ProductTypeDefinition = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: formData.name,
        requiresSize: formData.requiresSize,
        sizeOptions: formData.requiresSize ? sizeOptionsArray : undefined,
      };
      setProductTypes(prev => [...prev, newType]);
      toast.success('Type de produit créé avec succès');
    }

    handleCloseModal();
  };

  const handleDelete = (typeId: string) => {
    const defaultIds = ['bracelet', 'ring', 'necklace', 'earrings', 'set'];
    if (defaultIds.includes(typeId)) {
      toast.error('Ce type de produit par défaut ne peut pas être supprimé');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de produit ?')) {
      setProductTypes(prev => prev.filter(t => t.id !== typeId));
      toast.success('Type de produit supprimé');
    }
  };

  const isDefaultType = (id: string) => ['bracelet', 'ring', 'necklace', 'earrings', 'set'].includes(id);

  return (
    <AdminLayout title="Types de Produits" breadcrumbs={[{ label: 'Types de Produits' }]}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-muted-foreground">
          Gérez les types de produits (bracelet, bague, collier, etc.) et leurs options de tailles
        </p>
        <Button onClick={() => handleOpenModal()} className="font-body">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau type
        </Button>
      </div>

      {/* Types Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productTypes.map((type) => (
          <div
            key={type.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenModal(type)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                {!isDefaultType(type.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <h3 className="font-display text-xl mb-2">{type.name}</h3>
            <p className="font-body text-sm text-muted-foreground mb-4">
              ID: {type.id}
            </p>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm">Taille requise</span>
                </div>
                <span className={`font-body text-sm font-medium ${type.requiresSize ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  {type.requiresSize ? 'Oui' : 'Non'}
                </span>
              </div>

              {type.requiresSize && type.sizeOptions && (
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-2">Tailles disponibles:</p>
                  <div className="flex flex-wrap gap-1">
                    {type.sizeOptions.slice(0, 5).map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-muted rounded text-xs font-body"
                      >
                        {size}
                      </span>
                    ))}
                    {type.sizeOptions.length > 5 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs font-body text-muted-foreground">
                        +{type.sizeOptions.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isDefaultType(type.id) && (
                <span className="inline-block font-body text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  Par défaut
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="font-display text-lg mb-2">À propos des types de produits</h4>
        <ul className="font-body text-sm text-muted-foreground space-y-1">
          <li>• Les types par défaut (Bracelet, Bague, Collier, Boucles d'oreilles, Parure) ne peuvent pas être supprimés</li>
          <li>• Vous pouvez créer des types personnalisés pour organiser vos produits</li>
          <li>• Les tailles sont optionnelles et peuvent être personnalisées par type</li>
          <li>• Pour les tailles, séparez les valeurs par des virgules (ex: 16cm, 17cm, 18cm)</li>
        </ul>
      </div>

      {/* Product Type Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingType ? 'Modifier le type de produit' : 'Nouveau type de produit'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du type *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Montre, Chevillère..."
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="requiresSize" className="font-body font-medium">
                  Taille requise
                </Label>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Le client devra sélectionner une taille
                </p>
              </div>
              <Switch
                id="requiresSize"
                checked={formData.requiresSize}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresSize: checked }))}
              />
            </div>

            {formData.requiresSize && (
              <div>
                <Label htmlFor="sizeOptions">Options de tailles</Label>
                <Input
                  id="sizeOptions"
                  value={formData.sizeOptions}
                  onChange={(e) => setFormData(prev => ({ ...prev, sizeOptions: e.target.value }))}
                  placeholder="16cm, 17cm, 18cm, 19cm, 20cm"
                  className="mt-1"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Séparez les tailles par des virgules
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit">
                {editingType ? 'Enregistrer' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProductTypes;
