import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ui/ProductCard';
import { productsApi } from '@/services/api/products';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const ModernCollection = () => {
  const { data: products } = useQuery({
    queryKey: ['products', 'modern'],
    queryFn: () => productsApi.filterProducts({ category: 'modern' }),
    ...staticCatalogQueryOptions,
  });

  const modernProducts = products ? mapProductListItemListToProducts(products).slice(0, 4) : [];
  const stagger = ANIMATIONS.homeCollectionStagger;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <RevealOnScroll>
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-16 h-px bg-primary/60 mb-4"></div>
          <h2 className="font-script text-6xl text-secondary-dark dark:text-white mb-2">Collection Moderne</h2>
          <p className="text-accent-beige uppercase tracking-widest text-sm">Minimalisme & Pureté</p>
          <div className="w-16 h-px bg-primary/60 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modernProducts.map((product, index) => (
            <RevealOnScroll
              key={product.id}
              enabled={stagger}
              delayMs={stagger ? index * 70 : 0}
            >
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            className="inline-block border-b border-primary pb-1 text-primary hover:text-accent-beige transition-colors text-sm uppercase tracking-widest font-medium"
            to="/boutique?category=modern"
          >
            Voir toute la collection Moderne
          </Link>
        </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default ModernCollection;
