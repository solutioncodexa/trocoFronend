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

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const hover = ANIMATIONS.productCardHover;

  return (
    <div
      className={cn(
        'group flex h-full min-h-0 flex-col rounded-2xl border border-border/70 bg-card p-3 shadow-soft transition-all duration-300 sm:p-4',
        hover && 'hover:-translate-y-1 hover:shadow-elegant hover:border-primary/20',
        !hover && 'hover:shadow-card',
        className,
      )}
    >
      <Link
        to={`/produit/${product.id}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-xl"
        onMouseEnter={prefetchProductDetail}
        onFocus={prefetchProductDetail}
      >
        <div className="relative mb-4 aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl bg-muted">
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-lg bg-secondary-dark px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft"
              >
                {getBadgeLabel(badge)}
              </span>
            ))}
          </div>

          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className={cn(
              'h-full w-full object-cover transition-transform duration-700 ease-premium',
              hover && 'group-hover:scale-105',
            )}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-modern-fixed.svg';
            }}
          />

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/55 backdrop-blur-[2px]">
              <span className="rounded-full bg-card/95 px-4 py-2 font-display text-sm font-semibold text-foreground">
                Rupture de stock
              </span>
            </div>
          )}

          <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
            <button
              type="button"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl shadow-soft backdrop-blur-sm transition-all',
                isFavorite
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/90 text-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground',
              )}
              style={isFavorite ? { opacity: 1 } : undefined}
              onClick={handleWishlistToggle}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-card/95 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground shadow-soft">
              Voir
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col text-center">
          <h4 className="mb-1 line-clamp-2 min-h-[3.25rem] font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {product.name}
          </h4>
          <div className="mt-auto flex flex-col items-center gap-1 pt-2">
            <div className="flex min-h-[1.5rem] flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span className="text-lg font-semibold tabular-nums text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
                  -{discountPercentage}%
                </span>
              )}
            </div>
            {product.category && (
              <span className="text-xs capitalize text-muted-foreground">
                {product.category.replace(/-/g, ' ')}
              </span>
            )}
            {product.variants && product.variants.length > 1 && (
              <span className="text-[11px] text-muted-foreground">
                À partir de {formatPrice(product.price)} · {product.variants.length} options
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
