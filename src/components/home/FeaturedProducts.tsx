import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/data/products';

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Pièces Exceptionnelles
            </h2>
            <p className="font-body text-muted-foreground max-w-xl">
              Découvrez nos créations les plus prisées, choisies pour leur beauté et leur qualité exceptionnelle
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-6 md:mt-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body uppercase tracking-wider text-sm"
          >
            <Link to="/boutique">
              Voir tout
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
