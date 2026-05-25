import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Image as ImageIcon,
  Package,
  MoveUp,
  MoveDown,
  Upload,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { uploadImage, getImageUrl } from '@/services/api/upload';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { promoModalsApi } from '@/services/api/promoModals';
import { PromoModalDTO, CreatePromoModalRequest, UpdatePromoModalRequest } from '@/types/promo-modals';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

const AdminPromoModals = () => {
  const queryClient = useQueryClient();
  const [selectedModal, setSelectedModal] = useState<PromoModalDTO | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handler pour l'upload d'image (logique FeaturedProducts)
  const handleImageUpload = async (file: File, setFormData: any) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success('Image uploadée avec succès');
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Récupérer tous les promo modals (admin)
  const { data: modals = [], isLoading, error } = useQuery({
    queryKey: ['promo-modals'],
    queryFn: () => promoModalsApi.getAllPromoModals(),
    retry: 3,
    retryDelay: 1000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: promoModalsApi.createPromoModal,
    onSuccess: (newModal) => {
      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['promo-modals'], (old: any) => {
        const currentModals = old || [];
        return [...currentModals, newModal];
      });
      
      // Invalider pour s'assurer que le serveur est synchronisé
      queryClient.invalidateQueries({ queryKey: ['promo-modals'] });
      
      toast.success('Promo modal créé avec succès');
      setIsCreateDialogOpen(false);
      
      sessionStorage.removeItem('hasSeenPromoModal');
    },
    onError: (error: any) => {
      console.error('❌ Erreur création:', error);
      toastError(error, 'Erreur lors de la création du promo modal');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromoModalRequest }) =>
      promoModalsApi.updatePromoModal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-modals'] });
      toast.success('Promo modal mis à jour avec succès');
      setIsEditDialogOpen(false);
      setSelectedModal(null);

      sessionStorage.removeItem('hasSeenPromoModal');
    },
    onError: (error: any) => {
      toastError(error, 'Erreur lors de la mise à jour du promo modal');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: promoModalsApi.deletePromoModal,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['promo-modals'], (old: any) => {
        const currentModals = old || [];
        return currentModals.filter((modal: any) => modal.id !== deletedId);
      });
      
      queryClient.invalidateQueries({ queryKey: ['promo-modals'] });
      
      sessionStorage.removeItem('hasSeenPromoModal');
      
      toast.success('Promo modal supprimé avec succès');
    },
    onError: (error: any) => {
      console.error('❌ Erreur suppression:', error);
      toastError(error, 'Erreur lors de la suppression du promo modal');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      promoModalsApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-modals'] });
      toast.success('Statut du promo modal mis à jour avec succès');
      
      sessionStorage.removeItem('hasSeenPromoModal');
    },
    onError: (error: any) => {
      toastError(error, 'Erreur lors de la mise à jour du statut');
    },
  });

  const moveModal = (index: number, direction: 'up' | 'down') => {
    const newModals = [...modals];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newModals.length) {
      // Échanger les positions
      const temp = newModals[index].displayOrder;
      newModals[index].displayOrder = newModals[targetIndex].displayOrder;
      newModals[targetIndex].displayOrder = temp;
      
      // Mettre à jour les deux modals en parallèle
      Promise.all([
        updateMutation.mutateAsync({ 
          id: newModals[index].id.toString(), 
          data: { 
            title: newModals[index].title,
            description: newModals[index].description,
            imageUrl: newModals[index].imageUrl,
            buttonText: newModals[index].buttonText,
            buttonUrl: newModals[index].buttonUrl,
            autoCloseSeconds: newModals[index].autoCloseSeconds,
            isActive: newModals[index].isActive,
            displayOrder: newModals[index].displayOrder
          } 
        }),
        updateMutation.mutateAsync({ 
          id: newModals[targetIndex].id.toString(), 
          data: { 
            title: newModals[targetIndex].title,
            description: newModals[targetIndex].description,
            imageUrl: newModals[targetIndex].imageUrl,
            buttonText: newModals[targetIndex].buttonText,
            buttonUrl: newModals[targetIndex].buttonUrl,
            autoCloseSeconds: newModals[targetIndex].autoCloseSeconds,
            isActive: newModals[targetIndex].isActive,
            displayOrder: newModals[targetIndex].displayOrder
          } 
        })
      ]).then(() => {
        toast.success('Ordre des promo modals mis à jour avec succès');
      }).catch((error) => {
        toast.error('Erreur lors de la mise à jour de l\'ordre');
        // Revenir à l'état précédent en cas d'erreur
        const tempBack = newModals[index].displayOrder;
        newModals[index].displayOrder = newModals[targetIndex].displayOrder;
        newModals[targetIndex].displayOrder = tempBack;
      });
    }
  };

  const handleCreate = (data: CreatePromoModalRequest) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: UpdatePromoModalRequest) => {
    if (selectedModal) {
      updateMutation.mutate({ id: selectedModal.id.toString(), data });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Promo Modals" breadcrumbs={[{ label: 'Promo Modals' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Promo Modals" breadcrumbs={[{ label: 'Promo Modals' }]}>
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">
            Impossible de charger les promo modals. Veuillez réessayer.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Promo Modals" breadcrumbs={[{ label: 'Promo Modals' }]}>
      <div className="p-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promo Modals</h1>
            <p className="text-muted-foreground mt-2">
              Gérez les modaux promotionnels affichés sur la page d'accueil
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un modal
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Promo Modals Actifs</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total: {modals.length}</span>
                <span>Actifs: {modals.filter(m => m.isActive).length}</span>
                <span>Inactifs: {modals.filter(m => !m.isActive).length}</span>
              </div>
            </div>
            
            {modals.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun promo modal trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créez votre premier promo modal pour l'afficher sur la page d'accueil
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {modals.map((modal, index) => (
                  <div key={modal.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{modal.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {modal.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={modal.isActive ? "default" : "secondary"}>
                          {modal.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Ordre: {modal.displayOrder}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Position: {index + 1}/{modals.length}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Auto-fermeture: {modal.autoCloseSeconds}s
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveModal(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveModal(index, 'down')}
                        disabled={index === modals.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMutation.mutate({ id: modal.id.toString(), isActive: !modal.isActive })}
                      >
                        {modal.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedModal(modal);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(modal.id.toString())}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <CreatePromoModalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
      />

      {/* Edit Dialog */}
      <EditPromoModalDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        modal={selectedModal}
        onSubmit={handleUpdate}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
      />
    </AdminLayout>
  );
};

const CreatePromoModalDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  uploadingImage,
  onImageUpload
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePromoModalRequest) => void;
  uploadingImage: boolean;
  onImageUpload: (file: File, setFormData: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<CreatePromoModalRequest>({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    autoCloseSeconds: 5,
    isActive: true,
    displayOrder: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLocalImageUpload = async (file: File) => {
    await onImageUpload(file, setFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Ajouter un promo modal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre du promo modal"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du promo modal"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image</Label>
            <Input
              id="imageUrl"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleLocalImageUpload(file);
                }
              }}
              disabled={uploadingImage}
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={getImageUrl(formData.imageUrl)}
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    console.error('Error loading image:', formData.imageUrl);
                    // Masquer l'image si elle ne charge pas
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="buttonText">Texte du bouton</Label>
            <Input
              id="buttonText"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="Texte du bouton"
              required
            />
          </div>

          <div>
            <Label htmlFor="buttonUrl">URL du bouton</Label>
            <Input
              id="buttonUrl"
              value={formData.buttonUrl}
              onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
              placeholder="URL du bouton"
              required
            />
          </div>

          <div>
            <Label htmlFor="autoCloseSeconds">Fermeture automatique (secondes)</Label>
            <Input
              id="autoCloseSeconds"
              type="number"
              min="1"
              max="60"
              value={formData.autoCloseSeconds}
              onChange={(e) => setFormData({ ...formData, autoCloseSeconds: parseInt(e.target.value) || 5 })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Actif</Label>
          </div>

          <div>
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditPromoModalDialog = ({ 
  open, 
  onOpenChange, 
  modal, 
  onSubmit,
  uploadingImage,
  onImageUpload
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: PromoModalDTO;
  onSubmit: (data: UpdatePromoModalRequest) => void;
  uploadingImage: boolean;
  onImageUpload: (file: File, setFormData: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<UpdatePromoModalRequest>({
    title: modal?.title || '',
    description: modal?.description || '',
    imageUrl: modal?.imageUrl || '',
    buttonText: modal?.buttonText || '',
    buttonUrl: modal?.buttonUrl || '',
    autoCloseSeconds: modal?.autoCloseSeconds || 5,
    isActive: modal?.isActive || true,
    displayOrder: modal?.displayOrder || 1,
  });

  // Mettre à jour formData quand le modal change
  React.useEffect(() => {
    if (modal) {
      setFormData({
        title: modal.title || '',
        description: modal.description || '',
        imageUrl: modal.imageUrl || '',
        buttonText: modal.buttonText || '',
        buttonUrl: modal.buttonUrl || '',
        autoCloseSeconds: modal.autoCloseSeconds || 5,
        isActive: modal.isActive || true,
        displayOrder: modal.displayOrder || 1,
      });
    }
  }, [modal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLocalImageUpload = async (file: File) => {
    await onImageUpload(file, setFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Modifier le promo modal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre du promo modal"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du promo modal"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image</Label>
            <Input
              id="imageUrl"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleLocalImageUpload(file);
                }
              }}
              disabled={uploadingImage}
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={getImageUrl(formData.imageUrl)}
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    console.error('Error loading image:', formData.imageUrl);
                    // Masquer l'image si elle ne charge pas
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="buttonText">Texte du bouton</Label>
            <Input
              id="buttonText"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="Texte du bouton"
              required
            />
          </div>

          <div>
            <Label htmlFor="buttonUrl">URL du bouton</Label>
            <Input
              id="buttonUrl"
              value={formData.buttonUrl}
              onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
              placeholder="URL du bouton"
              required
            />
          </div>

          <div>
            <Label htmlFor="autoCloseSeconds">Fermeture automatique (secondes)</Label>
            <Input
              id="autoCloseSeconds"
              type="number"
              min="1"
              max="60"
              value={formData.autoCloseSeconds}
              onChange={(e) => setFormData({ ...formData, autoCloseSeconds: parseInt(e.target.value) || 5 })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Actif</Label>
          </div>

          <div>
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Mettre à jour
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPromoModals;
