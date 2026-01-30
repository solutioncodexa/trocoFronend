import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ui/ProductCard';
import { productsApi } from '@/services/api/products';
import { mapProductDTOListToProducts } from '@/utils/productMapper';

const BeldiCollection = () => {
  const { data: products } = useQuery({
    queryKey: ['products', 'beldi'],
    queryFn: () => productsApi.filterProducts({ category: 'beldi' }),
  });

  const beldiProducts = products ? mapProductDTOListToProducts(products).slice(0, 4) : [];

  return (
    <section className="py-16 md:py-24 bg-bg-paper-pattern">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-24 h-px bg-accent-beige/40 mb-4 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light"></div>
          </div>
          <h2 className="font-script text-5xl text-primary mb-2">Collection Beldi</h2>
          <p className="text-accent-beige uppercase tracking-widest text-sm">L'artisanat marocain d'excellence</p>
          <div className="w-24 h-px bg-accent-beige/40 mt-4 relative">
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {beldiProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            className="inline-block border-b border-primary pb-1 text-primary hover:text-accent-beige transition-colors text-sm uppercase tracking-widest font-medium"
            to="/boutique?category=beldi"
          >
            Voir toute la collection Beldi
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeldiCollection;
