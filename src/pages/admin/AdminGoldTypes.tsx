import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Gem, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { goldTypesApi } from '@/services/api';
import type { GoldTypeDTO } from '@/types/api';
import { toast } from 'sonner';

const GOLD_COLORS: Record<string, string> = {
  YELLOW: '#FFD700',
  WHITE: '#E5E4E2',
  ROSE: '#B76E79',
};

const AdminGoldTypes = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<GoldTypeDTO | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    sortOrder: 0,
  });

  const { data: goldTypes = [], isLoading } = useQuery({
    queryKey: ['goldTypes'],
    queryFn: () => goldTypesApi.getAllGoldTypes(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<GoldTypeDTO, 'id'>) => goldTypesApi.createGoldType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldTypes'] });
      toast.success('Type d\'or créé avec succès');
      handleCloseModal();
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GoldTypeDTO> }) =>
      goldTypesApi.updateGoldType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldTypes'] });
      toast.success('Type d\'or modifié avec succès');
      handleCloseModal();
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => goldTypesApi.deleteGoldType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldTypes'] });
      toast.success('Type d\'or supprimé');
    },
    onError: (e: Error) => toast.error(e.message || 'Erreur'),
  });

  const handleOpenModal = (type?: GoldTypeDTO) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        code: type.code,
        sortOrder: type.sortOrder ?? 0,
      });
    } else {
      setEditingType(null);
      setFormData({ name: '', code: '', sortOrder: goldTypes.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase() || formData.name.trim().toUpperCase().replace(/\s+/g, '_'),
      sortOrder: formData.sortOrder,
    };
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type d\'or ? Les produits qui l\'utilisent pourront être impactés.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Types d'or" breadcrumbs={[{ label: "Types d'or" }]}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Types d'or" breadcrumbs={[{ label: "Types d'or" }]}>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-muted-foreground">
          Gérez les types d'or (Or Jaune, Or Blanc, Or Rose) proposés sur les produits
        </p>
        <Button onClick={() => handleOpenModal()} className="font-body">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau type d'or
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goldTypes.map((type) => (
          <div
            key={type.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-border"
                style={{ backgroundColor: GOLD_COLORS[type.code] ?? '#CCCCCC' }}
              >
                <Gem className="w-6 h-6 text-charcoal/80" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(type)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(type.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="font-display text-xl mb-1">{type.name}</h3>
            <p className="font-body text-sm text-muted-foreground">Code: {type.code}</p>
            <p className="font-body text-xs text-muted-foreground mt-2">Ordre: {type.sortOrder ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="font-display text-lg mb-2">À propos des types d'or</h4>
        <ul className="font-body text-sm text-muted-foreground space-y-1">
          <li>• Le code est utilisé dans les produits (ex: YELLOW, WHITE, ROSE)</li>
          <li>• L'ordre détermine l'affichage dans les listes et filtres</li>
        </ul>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingType ? "Modifier le type d'or" : "Nouveau type d'or"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    code: prev.code || e.target.value.toUpperCase().replace(/\s+/g, '_'),
                  }))
                }
                placeholder="Ex: Or Jaune, Or Blanc..."
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="code">Code (ex: YELLOW, WHITE, ROSE)</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="YELLOW"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Ordre d'affichage</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 0 }))}
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
                {editingType ? 'Enregistrer' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminGoldTypes;
