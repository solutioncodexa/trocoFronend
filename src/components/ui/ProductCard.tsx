import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import type { ProductDetailDTO } from '@/types/product-dtos';
import { productsApi } from '@/services/api';
import { mapProductDetailToProduct } from '@/utils/productMapper';
import { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { ANIMATIONS } from '@/config/animations';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const queryClient = useQueryClient();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const prefetchProductDetail = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: async () => {
        const dto: ProductDetailDTO = await productsApi.getProductById(product.id);
        return mapProductDetailToProduct(dto);
      },
    });
  }, [queryClient, product.id]);

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

  const hover = ANIMATIONS.productCardHover;

  return (
    <div
      className={cn(
        'group bg-paper dark:bg-[#2a2515] p-4 border border-accent-beige/20 shadow-sm transition-all duration-500 h-full min-h-0 flex flex-col',
        hover && 'hover:shadow-lg hover:-translate-y-1',
        !hover && 'hover:shadow-md',
        className
      )}
    >
      <Link
        to={`/produit/${product.id}`}
        className="flex flex-col flex-1 min-h-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        onMouseEnter={prefetchProductDetail}
        onFocus={prefetchProductDetail}
      >
        {/* Image container */}
        <div className="relative w-full shrink-0 overflow-hidden aspect-[4/5] mb-4 border border-accent-beige/10">
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
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              hover && 'group-hover:scale-105'
            )}
            onError={(e) => {
              // Fallback to generic placeholder if specific placeholder fails
              const currentSrc = e.currentTarget.src;
              if (currentSrc.includes('placeholder-beldi-fixed.svg') || currentSrc.includes('placeholder-modern-fixed.svg')) {
                e.currentTarget.src = '/placeholder-jewelry.svg';
              } else {
                e.currentTarget.src = product.category === 'beldi' ? '/placeholder-beldi-fixed.svg' : '/placeholder-modern-fixed.svg';
              }
            }}
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

        {/* Product info — hauteur de titre fixe (2 lignes) + prix alignés en bas pour cartes homogènes */}
        <div className="flex flex-1 flex-col min-h-0 text-center">
          <h4 className="text-lg font-bold text-secondary-dark dark:text-white mb-1 font-display group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem] leading-snug">
            {product.name}
          </h4>
          <div className="mt-auto flex flex-col items-center gap-1 pt-2">
            <div className="flex min-h-[1.5rem] flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span className="text-primary font-medium text-lg tabular-nums">
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
            {product.showWeight !== false && (
              <span className="text-xs text-muted-foreground tabular-nums">{product.weight}g</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
