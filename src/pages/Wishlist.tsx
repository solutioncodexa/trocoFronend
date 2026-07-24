import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';

const Wishlist = () => {
  const navigate = useNavigate();
  const {
    getWishlistProducts,
    wishlistCount,
    removeFromWishlist,
    clearWishlist
  } = useWishlist();
  const { addToCart } = useCart();
  const wishlistProducts = getWishlistProducts();

  return (
    <Layout>
      <main className="max-w-[1280px] mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="mb-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Vos Favoris</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-accent-beige/30"></div>
            <p className="text-accent-beige uppercase tracking-[0.3em] text-xs">Articles favoris pour vous</p>
            <div className="h-px w-12 bg-accent-beige/30"></div>
          </div>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistProducts.map((product, index) => (
              <div key={product.id} className="group bg-white p-4 border border-accent-beige/20 shadow-sm transition-all duration-500 hover:shadow-xl">
                <div className="relative overflow-hidden aspect-[4/5] mb-4 bg-background-light">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 text-primary bg-white/80 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link 
                      to={`/produit/${product.id}`}
                      className="text-[10px] text-accent-beige uppercase tracking-[0.2em] hover:text-secondary-dark transition-colors font-bold underline underline-offset-4"
                    >
                      Aperçu rapide
                    </Link>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-base font-bold text-secondary-dark mb-1 font-display tracking-tight">{product.name}</h4>
                  <div className="mb-4">
                    <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!product.inStock) {
                        toast.error('Ce produit n’est pas disponible');
                        return;
                      }
                      const needsSize =
                        Array.isArray(product.availableSizes) && product.availableSizes.length > 0;
                      if (needsSize) {
                        toast.info('Choisissez une taille sur la fiche produit');
                        navigate(`/produit/${product.id}`);
                        return;
                      }
                      addToCart(product, 1);
                    }}
                    className="w-full bg-secondary-dark text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-primary transition-colors duration-300"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden flex-col items-center py-20 text-center animate-fade-in">
            <Heart className="w-16 h-16 text-accent-beige/40 mb-6" />
            <p className="text-xl font-display text-secondary-dark mb-4 italic">Votre liste est vide pour le moment.</p>
            <p className="text-accent-beige text-sm tracking-wide mb-10">Laissez-vous séduire par nos dernières créations.</p>
            <Button 
              asChild 
              className="bg-primary text-white px-10 py-4 text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-secondary-dark transition-all"
            >
              <Link to="/boutique">
                Parcourir la boutique
              </Link>
            </Button>
          </div>
        )}

        {wishlistProducts.length > 0 && (
          <div className="flex justify-center mt-12 gap-4">
            <Link to="/boutique" className="text-xs uppercase tracking-widest text-accent-beige hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="text-sm" />
              Continuer vos achats
            </Link>
            <button 
              onClick={clearWishlist}
              className="text-xs uppercase tracking-widest text-accent-beige hover:text-red-800 transition-colors border-b border-accent-beige/30 pb-0.5"
            >
              Vider les favoris
            </button>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Wishlist;