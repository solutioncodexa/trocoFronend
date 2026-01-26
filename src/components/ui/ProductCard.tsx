import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Product, goldTypeLabels } from '@/types/product';
import { formatPrice } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'new':
        return 'bg-primary text-primary-foreground';
      case 'bestseller':
        return 'bg-gradient-gold text-charcoal';
      default:
        return '';
    }
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'new':
        return 'Nouveau';
      case 'bestseller':
        return 'Best-seller';
      default:
        return badge;
    }
  };

  return (
    <Link
      to={`/produit/${product.id}`}
      className={cn(
        'group block luxury-card rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badges.map((badge) => (
            <Badge
              key={badge}
              className={cn('font-body text-xs uppercase tracking-wider', getBadgeClass(badge))}
            >
              {getBadgeLabel(badge)}
            </Badge>
          ))}
          <Badge
            className={cn(
              'font-body text-xs uppercase tracking-wider',
              product.category === 'beldi' ? 'bg-amber-800 text-white' : 'bg-charcoal text-white'
            )}
          >
            {product.category === 'beldi' ? 'Beldi' : 'Moderne'}
          </Badge>
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
            <span className="font-display text-lg text-white">Rupture de stock</span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Ajouté aux favoris');
            }}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* View button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-body uppercase tracking-wider text-sm py-3 rounded-lg flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Voir le produit
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="outline" className="font-body text-xs">
            {goldTypeLabels[product.goldType]}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-xl text-primary font-semibold">
            {formatPrice(product.price)}
          </span>
          <span className="font-body text-xs text-muted-foreground">
            {product.weight}g
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
