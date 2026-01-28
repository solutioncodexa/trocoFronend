import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, Shield, RotateCcw, Search, Mail, Verified } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProductById, formatPrice, getFeaturedProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ui/ProductCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GoldType, goldTypeLabels } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedGoldType, setSelectedGoldType] = useState<GoldType | ''>('');

  const product = id ? getProductById(id) : undefined;
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Produit non trouvé</h1>
          <p className="font-body text-muted-foreground mb-8">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <Button asChild>
            <Link to="/boutique">Retour à la boutique</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const requiresSize = product.availableSizes && product.availableSizes.length > 0;
  const goldTypes: GoldType[] = ['yellow', 'white', 'rose'];

  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedGoldType) {
      toast.error('Veuillez sélectionner un type d\'or');
      return;
    }
    addToCart(product, quantity, selectedSize || undefined, selectedGoldType);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleBuyNow = () => {
    if (requiresSize && !selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedGoldType) {
      toast.error('Veuillez sélectionner un type d\'or');
      return;
    }
    addToCart(product, quantity, selectedSize || undefined, selectedGoldType);
    navigate('/panier');
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-background-light dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <nav className="flex text-xs uppercase tracking-widest text-accent-beige font-medium">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/boutique" className="hover:text-primary">Boutique</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-dark dark:text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Images */}
          <div className="relative group">
            <div className="border border-primary/40 p-3 bg-white dark:bg-[#1e1a10]">
              <div className="aspect-[4/5] overflow-hidden bg-paper">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  className={cn(
                    'font-body text-xs uppercase tracking-wider',
                    badge === 'new' ? 'bg-primary text-primary-foreground' : 'bg-gradient-gold text-charcoal'
                  )}
                >
                  {badge === 'new' ? 'Nouveau' : 'Best-seller'}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-display text-secondary-dark dark:text-white mb-2">{product.name}</h2>
                <p className="font-script text-3xl text-primary">Collection {product.category === 'beldi' ? 'Beldi' : 'Moderne'}</p>
              </div>
              <div className="classic-seal">
                <span>{product.category === 'beldi' ? 'Beldi' : 'Moderne'}</span>
              </div>
            </div>

            <div className="space-y-4 py-6 border-y border-accent-beige/20">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-accent-beige mb-1">Poids</span>
                  <span className="text-lg font-medium">{product.weight}g</span>
                </div>
                <div className="w-px h-8 bg-accent-beige/20"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-accent-beige mb-1">Qualité</span>
                  <span className="text-lg font-medium">Or 18 carats</span>
                </div>
                <div className="w-px h-8 bg-accent-beige/20"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-accent-beige mb-1">Prix</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-3 text-secondary-dark dark:text-white">Description</h4>
                <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed font-light text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-3 h-3 rounded-full',
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <span className="font-body text-sm">
                {product.inStock
                  ? `En stock (${product.stockQuantity} disponible${product.stockQuantity > 1 ? 's' : ''})`
                  : 'Rupture de stock'}
              </span>
            </div>

            {/* Options */}
            {product.inStock && (
              <div className="flex flex-col gap-4 pt-4">
                {/* Gold Type Selection */}
                <div>
                  <Label className="font-body mb-2 block">Type d'or *</Label>
                  <Select value={selectedGoldType} onValueChange={(value) => setSelectedGoldType(value as GoldType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner le type d'or" />
                    </SelectTrigger>
                    <SelectContent>
                      {goldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {goldTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Selection */}
                {requiresSize && (
                  <div>
                    <Label className="font-body mb-2 block">Taille *</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.availableSizes?.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="font-body text-sm">Quantité:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors font-body"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-body min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors font-body"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full bg-primary hover:bg-[#d9a50b] text-white py-5 px-8 text-sm uppercase tracking-[0.3em] font-bold transition-all shadow-lg border border-white/20 flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="text-lg" />
                    Commander cette pièce
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 py-4 px-6 border border-accent-beige/40 text-accent-beige hover:bg-accent-beige hover:text-white transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <Heart className="text-sm" />
                      Ajouter aux favoris
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 py-4 px-6 border border-accent-beige/40 text-accent-beige hover:bg-accent-beige hover:text-white transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <ShoppingBag className="text-sm" />
                      Ajouter au panier
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-6 text-[10px] uppercase tracking-widest text-accent-beige">
              <div className="flex items-center gap-2">
                <Verified className="text-base" />
                Certificat d'Authenticité
              </div>
              <div className="flex items-center gap-2">
                <Truck className="text-base" />
                Expédition Sécurisée
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-32 mb-32">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="w-24 h-px bg-accent-beige/40 mb-4 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light"></div>
            </div>
            <h3 className="font-display text-3xl text-secondary-dark dark:text-white mb-2">Vous aimerez aussi</h3>
            <p className="text-accent-beige uppercase tracking-widest text-xs">Sélection Héritage pour compléter votre parure</p>
          </div>
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <div key={product.id} className="group bg-paper dark:bg-[#2a2515] p-4 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="relative overflow-hidden aspect-[4/5] mb-4 border border-accent-beige/10">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    ></div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/produit/${product.id}`}>
                        <Button className="bg-white/90 text-secondary-dark px-6 py-2 text-xs uppercase tracking-wider font-bold shadow-md hover:bg-primary hover:text-white transition-colors">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-base font-bold text-secondary-dark dark:text-white mb-1 font-display">{product.name}</h4>
                    <p className="text-primary font-medium">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
