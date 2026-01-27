import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { getWishlistProducts, wishlistCount } = useWishlist();
  const wishlistProducts = getWishlistProducts();

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="font-display text-4xl md:text-5xl text-cream">
              Mes Favoris
            </h1>
          </div>
          <p className="font-body text-cream/80 max-w-2xl mx-auto">
            {wishlistCount > 0
              ? `Vous avez ${wishlistCount} produit${wishlistCount > 1 ? 's' : ''} dans vos favoris`
              : 'Votre liste de favoris est vide'}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {wishlistProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <p className="font-display text-2xl text-muted-foreground mb-4">
                Aucun produit dans vos favoris
              </p>
              <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
                Parcourez notre collection et cliquez sur le cœur pour ajouter des produits à vos favoris
              </p>
              <Button asChild size="lg" className="font-body">
                <Link to="/boutique">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Découvrir la boutique
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Wishlist;
