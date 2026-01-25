import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts, formatPrice } from '@/data/products';
import { Product, ProductCategory, ProductType } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    category: 'beldi' as ProductCategory,
    type: 'bracelet' as ProductType,
    stockQuantity: '',
    badges: [] as string[],
    images: [] as string[],
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        weight: product.weight.toString(),
        category: product.category,
        type: product.type,
        stockQuantity: product.stockQuantity.toString(),
        badges: product.badges,
        images: product.images,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        weight: '',
        category: 'beldi',
        type: 'bracelet',
        stockQuantity: '',
        badges: [],
        images: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      weight: parseFloat(formData.weight),
      category: formData.category,
      type: formData.type,
      stockQuantity: parseInt(formData.stockQuantity),
      inStock: parseInt(formData.stockQuantity) > 0,
      badges: formData.badges as ('new' | 'bestseller')[],
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
      createdAt: editingProduct?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
      toast.success('Produit modifié avec succès');
    } else {
      setProducts(prev => [...prev, productData]);
      toast.success('Produit ajouté avec succès');
    }

    handleCloseModal();
  };

  const handleDelete = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Produit supprimé');
    }
  };

  const toggleBadge = (badge: string) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  const addImageUrl = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Produit</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Catégorie</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Prix</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Stock</th>
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
                        src={product.images[0]}
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
                  <td className="px-4 py-3 font-body">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'font-body',
                      product.stockQuantity === 0 ? 'text-destructive' : 
                      product.stockQuantity < 3 ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.badges.map(badge => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          {badge === 'new' ? 'Nouveau' : 'Best-seller'}
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
                    <SelectItem value="bracelet">Bracelet</SelectItem>
                    <SelectItem value="ring">Bague</SelectItem>
                    <SelectItem value="necklace">Collier</SelectItem>
                    <SelectItem value="earrings">Boucles d'oreilles</SelectItem>
                    <SelectItem value="set">Parure</SelectItem>
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

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Prix (MAD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Poids (g) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  required
                  className="mt-1"
                />
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
                    <SelectItem value="beldi">Beldi</SelectItem>
                    <SelectItem value="modern">Moderne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Badges</Label>
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
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Images du produit</Label>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
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
    </AdminLayout>
  );
};

export default AdminProducts;
