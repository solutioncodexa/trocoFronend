import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, X, Settings2, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductCategory, ProductType } from '@/types/product';
import { categoriesApi, productTypesApi, collectionsApi, goldPriceSettingsApi, calculatePrice, getImageUrl } from '@/services/api';
import { ProductFormData } from '@/services/api/products';
import { productsApi } from '@/services/api/products';
import { mapProductDetailListToProducts } from '@/utils/productMapper';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { cn } from '@/lib/utils';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { data: productsPage, isLoading } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => productsApi.getAllProductsFullPage({ page: 0, size: 500 }),
  });
  const products = mapProductDetailListToProducts(productsPage?.content);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });
  const { data: productTypes = [] } = useQuery({
    queryKey: ['productTypes'],
    queryFn: () => productTypesApi.getAllProductTypes(),
    ...staticCatalogQueryOptions,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.getAllCollections(),
    ...staticCatalogQueryOptions,
  });
  const { data: goldPriceSettings } = useQuery({
    queryKey: ['goldPriceSettings'],
    queryFn: () => goldPriceSettingsApi.getSettings(),
    ...staticCatalogQueryOptions,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isPriceSettingsOpen, setIsPriceSettingsOpen] = useState(false);
  const [priceSettingsForm, setPriceSettingsForm] = useState({ pricePerGram: '' });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    weight: '',
    marginGain: '500',
    category: 'beldi' as ProductCategory,
    type: 'bracelet' as ProductType,
    collection: '',
    badges: [] as string[],
  });
  // Fichiers images à envoyer (nouveaux uploads)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // URLs des images existantes (pour affichage en mode édition)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // Prix calculé : (grammes × prix au gramme) + marge du produit
  useEffect(() => {
    if (!goldPriceSettings) return;
    const weight = parseFloat(formData.weight);
    const marginGain = parseFloat(formData.marginGain);
    if (Number.isNaN(weight) || weight <= 0) return;
    const margin = Number.isNaN(marginGain) || marginGain < 0 ? 500 : marginGain;
    const calculated = Math.round(
      calculatePrice(weight, goldPriceSettings.pricePerGram, margin)
    );
    setFormData((prev) => {
      if (prev.price === String(calculated)) return prev;
      return { ...prev, price: String(calculated) };
    });
  }, [formData.weight, formData.marginGain, goldPriceSettings?.pricePerGram]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailableSizes = (typeCode: string) => {
    const pt = productTypes.find((p) => p.code.toLowerCase() === typeCode.toLowerCase());
    return pt?.sizeOptions;
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: (product.originalPrice ?? '').toString(),
        weight: product.weight.toString(),
        marginGain: (product.marginGain ?? 500).toString(),
        category: product.category,
        type: product.type,
        collection: product.collection || '',
        badges: product.badges,
      });
      setExistingImageUrls(product.images || []);
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        weight: '',
        marginGain: '500',
        category: 'beldi',
        type: 'bracelet',
        collection: '',
        badges: [],
      });
      setExistingImageUrls([]);
      setImageFiles([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFiles([]);
    setExistingImageUrls([]);
  };

  const createMutation = useMutation({
    mutationFn: ({ product, images }: { product: ProductFormData; images: File[] }) =>
      productsApi.createProduct(product, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit ajouté avec succès');
      handleCloseModal();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, product, images }: { id: string; product: ProductFormData; images?: File[] }) =>
      productsApi.updateProduct(id, product, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit modifié avec succès');
      handleCloseModal();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updatePriceSettingsMutation = useMutation({
    mutationFn: (pricePerGram: number) => goldPriceSettingsApi.updateSettings(pricePerGram),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goldPriceSettings'] });
      toast.success('Paramètres de prix enregistrés');
      setIsPriceSettingsOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: au moins une image (nouvelle ou existante)
    if (imageFiles.length === 0 && existingImageUrls.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      return;
    }

    const weightNum = parseFloat(formData.weight);
    const marginGainNum = parseFloat(formData.marginGain);
    const margin = Number.isNaN(marginGainNum) || marginGainNum < 0 ? 500 : marginGainNum;
    let priceValue = parseFloat(formData.price);
    if ((Number.isNaN(priceValue) || priceValue <= 0) && goldPriceSettings && !Number.isNaN(weightNum) && weightNum > 0) {
      priceValue = Math.round(calculatePrice(weightNum, goldPriceSettings.pricePerGram, margin));
    }

    const typeCode = productTypes.find((pt) => pt.code.toLowerCase() === formData.type)?.code ?? (formData.type as string).toUpperCase();
    const isPromo = formData.badges.includes('promo');
    const originalPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
    const productPayload: ProductFormData = {
      name: formData.name,
      description: formData.description,
      price: priceValue,
      originalPrice: isPromo && originalPriceNum && originalPriceNum > priceValue ? originalPriceNum : undefined,
      weight: parseFloat(formData.weight),
      marginGain: margin,
      category: formData.category,
      type: typeCode,
      /** Valeur fixe : le backend conserve le champ ; plus géré côté UI */
      goldType: 'yellow',
      collection: formData.collection || undefined,
      availableSizes: (() => {
        const sizes = getAvailableSizes(formData.type);
        if (!sizes) return undefined;
        return Array.isArray(sizes) ? sizes : String(sizes).split(',').map((s) => s.trim());
      })(),
      stockQuantity: 1,
      badges: formData.badges,
    };

    if (editingProduct) {
      // En mise à jour : envoie les nouveaux fichiers seulement si ajoutés
      updateMutation.mutate({ id: editingProduct.id, product: productPayload, images: imageFiles.length > 0 ? imageFiles : undefined });
    } else {
      createMutation.mutate({ product: productPayload, images: imageFiles });
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteMutation.mutate(productId);
    }
  };

  const toggleBadge = (badge: string) => {
    setFormData(prev => {
      const isAdding = !prev.badges.includes(badge);
      const newBadges = isAdding ? [...prev.badges, badge] : prev.badges.filter(b => b !== badge);
      if (badge === 'promo' && isAdding && !prev.originalPrice) {
        return { ...prev, badges: newBadges, originalPrice: prev.price };
      }
      if (badge === 'promo' && !isAdding) {
        return { ...prev, badges: newBadges, originalPrice: '' };
      }
      return { ...prev, badges: newBadges };
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    toast.success(newFiles.length === 1 ? 'Image ajoutée' : `${newFiles.length} images ajoutées`);
    e.target.value = '';
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExistingImage = (from: number, to: number) => {
    setExistingImageUrls((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const moveNewImage = (from: number, to: number) => {
    setImageFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const setAsPrimary = (type: 'existing' | 'new', index: number) => {
    if (type === 'existing') {
      setExistingImageUrls((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(index, 1);
        arr.unshift(item);
        return arr;
      });
    } else {
      if (existingImageUrls.length > 0) {
        toast.info('Les images existantes sont affichées en premier. Supprimez-les ou réordonnez-les.');
        return;
      }
      setImageFiles((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(index, 1);
        arr.unshift(item);
        return arr;
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Produits" breadcrumbs={[{ label: 'Produits' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Produits" breadcrumbs={[{ label: 'Produits' }]}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="beldi">Beldi</SelectItem>
            <SelectItem value="modern">Moderne</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => handleOpenModal()} className="font-body">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (goldPriceSettings) {
              setPriceSettingsForm({ pricePerGram: String(goldPriceSettings.pricePerGram) });
            }
            setIsPriceSettingsOpen(true);
          }}
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Paramètres prix
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Produit</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Catégorie</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Collection</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Prix</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Badges</th>
                <th className="px-4 py-3 text-right font-body text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] ? getImageUrl(product.images[0]) : 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-body font-medium">{product.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{product.weight}g</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.category === 'beldi' ? 'default' : 'secondary'}>
                      {product.category === 'beldi' ? 'Beldi' : 'Moderne'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {product.collection ? (
                      <Badge variant="outline">
                        {collections.find((c) => c.slug === product.collection)?.name || product.collection}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Aucune</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-body">
                    <div>
                      <span className={product.originalPrice && product.originalPrice > product.price ? 'text-green-600 font-medium' : ''}>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.badges.map(badge => (
                        <Badge key={badge} variant={badge === 'promo' ? 'destructive' : 'outline'} className="text-xs">
                          {badge === 'new' ? 'Nouveau' : badge === 'bestseller' ? 'Best-seller' : 'Promo'}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ProductType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((pt) => (
                      <SelectItem key={pt.id} value={pt.code.toLowerCase()}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="weight">Poids (g) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  required
                  min={0.1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">
                  {formData.badges.includes('promo') ? 'Prix promo (MAD) *' : 'Prix (MAD) *'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  readOnly={!formData.badges.includes('promo')}
                  onChange={formData.badges.includes('promo') ? (e) => setFormData(prev => ({ ...prev, price: e.target.value })) : undefined}
                  className={formData.badges.includes('promo') ? 'mt-1' : 'mt-1 bg-muted'}
                />
                {goldPriceSettings && !formData.badges.includes('promo') && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculé : (grammes × {goldPriceSettings.pricePerGram} + marge) MAD
                  </p>
                )}
              </div>
              {formData.badges.includes('promo') && (
                <div>
                  <Label htmlFor="originalPrice">Prix original avant réduction (MAD)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Prix affiché barré sur la fiche produit
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="marginGain">Marge / gain (MAD)</Label>
                <Input
                  id="marginGain"
                  type="number"
                  min={0}
                  step={1}
                  value={formData.marginGain}
                  onChange={(e) => setFormData(prev => ({ ...prev, marginGain: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Par produit (ex: 500, 200…)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ProductCategory) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Collection</Label>
                <Select
                  value={formData.collection || '__none__'}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, collection: value === '__none__' ? '' : value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Aucune" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucune</SelectItem>
                    {collections.filter((c) => c.isActive).map((col) => (
                      <SelectItem key={col.id} value={col.slug}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
              <div>
                <Label>Badges</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Badges affichés sur la fiche produit
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={formData.badges.includes('new') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleBadge('new')}
                  >
                    Nouveau
                  </Button>
                  <Button
                    type="button"
                    variant={formData.badges.includes('bestseller') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleBadge('bestseller')}
                  >
                    Best-seller
                  </Button>
                  <Button
                    type="button"
                    variant={formData.badges.includes('promo') ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => toggleBadge('promo')}
                  >
                    Promo
                  </Button>
                </div>
              </div>

            {/* Images */}
            <div>
              <Label>Images du produit *</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                La première image sera l'image principale. Cliquez sur l'étoile pour définir l'image principale, ou les flèches pour réordonner.
              </p>
              <div className="mt-2 space-y-3">
                {/* Existing images */}
                {existingImageUrls.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Images actuelles</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImageUrls.map((url, index) => (
                        <div
                          key={`existing-${index}`}
                          className={cn(
                            'relative group rounded-lg overflow-hidden',
                            index === 0 && imageFiles.length === 0 && 'ring-2 ring-primary'
                          )}
                        >
                          <img
                            src={getImageUrl(url)}
                            alt={`Image ${index + 1}`}
                            className="w-20 h-20 object-cover"
                          />
                          {index === 0 && imageFiles.length === 0 && (
                            <div className="absolute top-0.5 left-0.5 bg-primary text-white text-[8px] font-bold px-1 py-0.5 rounded">
                              1ère
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {index > 0 && (
                              <button type="button" onClick={() => moveExistingImage(index, index - 1)} className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                                <ArrowLeft className="w-3 h-3 text-black" />
                              </button>
                            )}
                            {index > 0 && (
                              <button type="button" onClick={() => setAsPrimary('existing', index)} className="w-5 h-5 bg-primary rounded flex items-center justify-center" title="Définir comme principale">
                                <Star className="w-3 h-3 text-white" />
                              </button>
                            )}
                            {index < existingImageUrls.length - 1 && (
                              <button type="button" onClick={() => moveExistingImage(index, index + 1)} className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-black" />
                              </button>
                            )}
                            <button type="button" onClick={() => removeExistingImage(index)} className="w-5 h-5 bg-destructive rounded flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New images to upload */}
                {imageFiles.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Nouvelles images à envoyer</p>
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.map((file, index) => (
                        <div
                          key={`new-${index}`}
                          className={cn(
                            'relative group rounded-lg overflow-hidden border-2 border-primary/40',
                            index === 0 && existingImageUrls.length === 0 && 'ring-2 ring-primary'
                          )}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Nouvelle ${index + 1}`}
                            className="w-20 h-20 object-cover"
                          />
                          {index === 0 && existingImageUrls.length === 0 && (
                            <div className="absolute top-0.5 left-0.5 bg-primary text-white text-[8px] font-bold px-1 py-0.5 rounded">
                              1ère
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {index > 0 && (
                              <button type="button" onClick={() => moveNewImage(index, index - 1)} className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                                <ArrowLeft className="w-3 h-3 text-black" />
                              </button>
                            )}
                            {index > 0 && existingImageUrls.length === 0 && (
                              <button type="button" onClick={() => setAsPrimary('new', index)} className="w-5 h-5 bg-primary rounded flex items-center justify-center" title="Définir comme principale">
                                <Star className="w-3 h-3 text-white" />
                              </button>
                            )}
                            {index < imageFiles.length - 1 && (
                              <button type="button" onClick={() => moveNewImage(index, index + 1)} className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-black" />
                              </button>
                            )}
                            <button type="button" onClick={() => removeImageFile(index)} className="w-5 h-5 bg-destructive rounded flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer inline-flex">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="sr-only"
                    onChange={handleImageSelect}
                  />
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit">
                {editingProduct ? 'Enregistrer' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Paramètres : prix au gramme (la marge est par produit) */}
      <Dialog open={isPriceSettingsOpen} onOpenChange={setIsPriceSettingsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Prix au gramme</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Prix produit = (grammes × prix au gramme) + marge. La marge est définie par produit.
          </p>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="pricePerGram">Prix au gramme (MAD)</Label>
              <Input
                id="pricePerGram"
                type="number"
                min={0}
                step={1}
                value={priceSettingsForm.pricePerGram}
                onChange={(e) => setPriceSettingsForm((prev) => ({ ...prev, pricePerGram: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriceSettingsOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                const pricePerGram = parseFloat(priceSettingsForm.pricePerGram);
                if (Number.isNaN(pricePerGram) || pricePerGram <= 0) {
                  toast.error('Prix au gramme invalide');
                  return;
                }
                updatePriceSettingsMutation.mutate(pricePerGram);
              }}
              disabled={updatePriceSettingsMutation.isPending}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
