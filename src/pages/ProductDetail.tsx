import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductById, formatPrice, getFeaturedProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ui/ProductCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
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
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 font-body text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Accueil</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/boutique" className="text-muted-foreground hover:text-primary">Boutique</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-cream">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
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

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-muted'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category badge */}
              <Badge
                className={cn(
                  'font-body text-xs uppercase tracking-wider',
                  product.category === 'beldi' ? 'bg-amber-800 text-primary-foreground' : 'bg-charcoal text-primary-foreground'
                )}
              >
                {product.category === 'beldi' ? 'Beldi' : 'Moderne'}
              </Badge>

              <h1 className="font-display text-3xl md:text-4xl text-foreground">
                {product.name}
              </h1>

              <p className="font-body text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Price & Weight */}
              <div className="flex items-center gap-6 py-4 border-y border-border">
                <div>
                  <p className="font-body text-sm text-muted-foreground">Prix</p>
                  <p className="font-display text-3xl text-primary">{formatPrice(product.price)}</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="font-body text-sm text-muted-foreground">Poids</p>
                  <p className="font-display text-xl text-foreground">{product.weight}g</p>
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

              {/* Quantity & Add to Cart */}
              {product.inStock && (
                <div className="space-y-4">
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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleBuyNow}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-body uppercase tracking-wider"
                      size="lg"
                    >
                      Commander
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body uppercase tracking-wider"
                      size="lg"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Ajouter au panier
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => toast.success('Ajouté aux favoris')}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="font-body text-sm">Livraison dans tout le Maroc</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-body text-sm">Or 18K garanti</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <span className="font-body text-sm">Retour sous 7 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">
              Vous aimerez aussi
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
