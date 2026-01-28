import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Product, goldTypeLabels } from '@/types/product';
import { formatPrice } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (isFavorite) {
      toast.info('Retiré des favoris');
    } else {
      toast.success('Ajouté aux favoris');
    }
  };

  const getBadgeClass = (badge: string) => {
    return 'bg-secondary-dark text-white text-[10px] uppercase font-bold px-2 py-1';
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'new':
        return 'Nouveauté';
      case 'bestseller':
        return 'Best-seller';
      case 'promo':
        return 'Promo';
      default:
        return badge;
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={cn('group bg-paper dark:bg-[#2a2515] p-4 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1', className)}>
      <Link to={`/produit/${product.id}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden aspect-[4/5] mb-4 border border-accent-beige/10">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={getBadgeClass(badge)}
              >
                {getBadgeLabel(badge)}
              </span>
            ))}
            {product.category === 'beldi' && (
              <span className="bg-secondary-dark text-white text-[10px] uppercase font-bold px-2 py-1">
                Beldi
              </span>
            )}
          </div>

          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
              <span className="font-display text-lg text-white">Rupture de stock</span>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              className={cn(
                'w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-md',
                isFavorite 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/90 hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100'
              )}
              style={isFavorite ? { opacity: 1 } : undefined}
              onClick={handleWishlistToggle}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
          </div>

          {/* View button */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 text-secondary-dark px-6 py-2 text-xs uppercase tracking-wider font-bold shadow-md hover:bg-primary hover:text-white transition-colors">
              Aperçu
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="text-center">
          <h4 className="text-lg font-bold text-secondary-dark dark:text-white mb-1 font-display group-hover:text-primary transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-accent-beige mb-3 uppercase tracking-wide">
            {goldTypeLabels[product.goldType]}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary font-medium text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">
            {product.weight}g
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
