import { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getImageUrl, uploadImage } from '@/services/api/upload';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { productsApi } from '@/services/api/products';
import { FeaturedProductDTO, CreateFeaturedProductRequest, UpdateFeaturedProductRequest } from '@/types/featured-products';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

const AdminFeaturedProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState<'all' | 'heritage' | 'sur-mesure'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProductDTO | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Récupérer tous les produits sélectionnés
  const { data: featuredProducts = [], isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => featuredProductsApi.getAllFeaturedProducts(),
    retry: 3,
    retryDelay: 1000,
  });

  // Récupérer tous les produits disponibles
  const { data: allProductsData } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 100 }),
  });

  const allProducts = Array.isArray(allProductsData) ? allProductsData : allProductsData?.content || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateFeaturedProductRequest) => 
      featuredProductsApi.createFeaturedProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Produit sélectionné ajouté avec succès');
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => toastError(error, 'Erreur lors de l\'ajout'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeaturedProductRequest }) =>
      featuredProductsApi.updateFeaturedProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Produit sélectionné mis à jour avec succès');
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => toastError(error, 'Erreur lors de la mise à jour'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => featuredProductsApi.deleteFeaturedProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Produit sélectionné supprimé avec succès');
    },
    onError: (error: Error) => toastError(error, 'Erreur lors de la suppression'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      featuredProductsApi.toggleFeaturedProduct(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Statut mis à jour avec succès');
    },
    onError: (error: Error) => toastError(error, 'Erreur lors du changement de statut'),
  });

  // Filtrer les produits
  const filteredProducts = featuredProducts.filter((product) => {
    const matchesSearch = 
      product.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = filterSection === 'all' || product.section === filterSection;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);
    
    return matchesSearch && matchesSection && matchesStatus;
  });

  // Trier par section et ordre d'affichage
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }
    return a.displayOrder - b.displayOrder;
  });

  const getSectionLabel = (section: string) => {
    const labels = {
      heritage: 'Notre Histoire & Passion',
      'sur-mesure': "L'Art du Sur-Mesure"
    };
    return labels[section as keyof typeof labels] || section;
  };

  const getSectionBadgeColor = (section: string) => {
    const colors = {
      heritage: 'bg-blue-100 text-blue-800',
      'sur-mesure': 'bg-purple-100 text-purple-800'
    };
    return colors[section as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreate = (data: CreateFeaturedProductRequest) => {
    createMutation.mutate(data);
  };

  const handleEdit = (product: FeaturedProductDTO) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: UpdateFeaturedProductRequest) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit sélectionné ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive });
  };

  const handleImageUpload = async (file: File, setFormData: any) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success('Image uploadée avec succès');
    } catch (error) {
      console.error('Erreur upload image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Produits Sélectionnés" breadcrumbs={[{ label: 'Produits Sélectionnés' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Produits Sélectionnés" breadcrumbs={[{ label: 'Produits Sélectionnés' }]}>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Erreur de chargement</h3>
            <p className="text-red-600">
              Impossible de charger les produits sélectionnés. Veuillez vérifier que le serveur backend est en cours d'exécution.
            </p>
            <details className="mt-2">
              <summary className="text-red-500 cursor-pointer">Détails techniques</summary>
              <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap">
                {error instanceof Error ? error.message : 'Erreur inconnue'}
              </pre>
            </details>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits Sélectionnés" breadcrumbs={[{ label: 'Produits Sélectionnés' }]}>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total</p>
          <p className="font-display text-xl sm:text-2xl">{featuredProducts.length}</p>
        </div>
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Heritage</p>
          <p className="font-display text-xl sm:text-2xl">
            {featuredProducts.filter(p => p.section === 'heritage').length}
          </p>
        </div>
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border col-span-2 sm:col-span-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Sur-Mesure</p>
          <p className="font-display text-xl sm:text-2xl">
            {featuredProducts.filter(p => p.section === 'sur-mesure').length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSection} onValueChange={(value: any) => setFilterSection(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sections</SelectItem>
            <SelectItem value="heritage">Notre Histoire & Passion</SelectItem>
            <SelectItem value="sur-mesure">L'Art du Sur-Mesure</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {['heritage', 'sur-mesure'].map((section) => {
          const sectionProducts = sortedProducts.filter(p => p.section === section);
          if (sectionProducts.length === 0) return null;

          return (
            <div key={section} className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border bg-muted/50">
                <h3 className="font-display text-lg">{getSectionLabel(section)}</h3>
              </div>
              <div className="divide-y divide-border">
                {sectionProducts.map((product) => (
                  <div key={product.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-move shrink-0 mt-1 sm:mt-0" />
                      
                      {/* Image */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.imageUrl || product.product?.imageUrl ? (
                          <img
                            src={getImageUrl(product.imageUrl || product.product?.imageUrl)}
                            alt={product.title || product.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <h4 className="font-medium text-sm sm:text-base truncate">
                            {product.title || product.product?.name}
                          </h4>
                          <Badge className={cn('text-[10px] sm:text-xs', getSectionBadgeColor(product.section))}>
                            {getSectionLabel(product.section)}
                          </Badge>
                          {!product.isActive && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs text-muted-foreground">
                              Inactif
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                          {product.description || product.product?.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ordre: {product.displayOrder}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <Switch
                          checked={product.isActive}
                          onCheckedChange={(checked) => handleToggleActive(product.id, checked)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {sortedProducts.length === 0 && (
        <div className="bg-card rounded-lg p-8 text-center border border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun produit sélectionné trouvé</p>
        </div>
      )}

      {/* Create Dialog */}
      <CreateFeaturedProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        availableProducts={allProducts}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
      />

      {/* Edit Dialog */}
      <EditFeaturedProductDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={selectedProduct}
        onSubmit={handleUpdate}
        availableProducts={allProducts}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
      />
    </AdminLayout>
  );
};

// Dialog pour créer un produit sélectionné
const CreateFeaturedProductDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  availableProducts,
  uploadingImage,
  onImageUpload
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFeaturedProductRequest) => void;
  availableProducts: any[];
  uploadingImage: boolean;
  onImageUpload: (file: File, setFormData: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<CreateFeaturedProductRequest>({
    productId: '',
    section: 'heritage',
    title: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
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
          <DialogTitle className="text-lg">Ajouter un produit sélectionné</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productId">Produit</Label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Select 
              value={formData.section} 
              onValueChange={(value: any) => setFormData({ ...formData, section: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heritage">Notre Histoire & Passion</SelectItem>
                <SelectItem value="sur-mesure">L'Art du Sur-Mesure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Titre personnalisé</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Laisser vide pour utiliser le nom du produit"
            />
          </div>

          <div>
            <Label htmlFor="description">Description personnalisée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Laisser vide pour utiliser la description du produit"
              rows={3}
            />
          </div>

          <div>
            <Label>Image personnalisée</Label>
            <div className="space-y-3">
              {/* Upload d'image */}
              <div className="flex items-center gap-3">
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleLocalImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </label>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {uploadingImage ? 'Upload en cours...' : 'Cliquez pour uploader une image'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats: JPEG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
              
              {/* OU URL manuelle */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">OU</span>
                </div>
              </div>
              
              {/* Champ URL */}
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="Entrez l'URL de l'image manuellement"
              />
              
              {/* Aperçu de l'image */}
              {formData.imageUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Aperçu:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-border">
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Actif</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog pour éditer un produit sélectionné
const EditFeaturedProductDialog = ({ 
  open, 
  onOpenChange, 
  product, 
  onSubmit, 
  availableProducts,
  uploadingImage,
  onImageUpload
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: FeaturedProductDTO | null;
  onSubmit: (data: UpdateFeaturedProductRequest) => void;
  availableProducts: any[];
  uploadingImage: boolean;
  onImageUpload: (file: File, setFormData: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<UpdateFeaturedProductRequest>({
    productId: product?.productId || '',
    section: product?.section as 'heritage' | 'sur-mesure',
    title: product?.title || '',
    description: product?.description || '',
    imageUrl: product?.imageUrl || '',
    displayOrder: product?.displayOrder || 0,
    isActive: product?.isActive,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.productId || '',
        section: product.section as 'heritage' | 'sur-mesure',
        title: product.title || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        displayOrder: product.displayOrder || 0,
        isActive: product.isActive,
      });
    }
  }, [product]);

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
          <DialogTitle className="text-lg">Modifier le produit sélectionné</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productId">Produit</Label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Select 
              value={formData.section} 
              onValueChange={(value: any) => setFormData({ ...formData, section: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heritage">Notre Histoire & Passion</SelectItem>
                <SelectItem value="sur-mesure">L'Art du Sur-Mesure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Titre personnalisé</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Laisser vide pour utiliser le nom du produit"
            />
          </div>

          <div>
            <Label htmlFor="description">Description personnalisée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Laisser vide pour utiliser la description du produit"
              rows={3}
            />
          </div>

          <div>
            <Label>Image personnalisée</Label>
            <div className="space-y-3">
              {/* Upload d'image */}
              <div className="flex items-center gap-3">
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleLocalImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </label>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {uploadingImage ? 'Upload en cours...' : 'Cliquez pour uploader une image'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats: JPEG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
              
              {/* OU URL manuelle */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">OU</span>
                </div>
              </div>
              
              {/* Champ URL */}
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="Entrez l'URL de l'image manuellement"
              />
              
              {/* Aperçu de l'image */}
              {formData.imageUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Aperçu:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-border">
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFeaturedProducts;
