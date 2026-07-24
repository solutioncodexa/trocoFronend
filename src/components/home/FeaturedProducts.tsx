import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { productsApi } from '@/services/api/products';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import type { Product } from '@/types/product';
import type { FeaturedProductDTO } from '@/types/featured-products';

function mapFeaturedToProduct(fp: FeaturedProductDTO): Product {
  const image =
    resolvePublicImageUrl(fp.imageUrl || fp.product?.imageUrl) || '/placeholder-modern-fixed.svg';
  return {
    id: String(fp.productId),
    name: fp.title?.trim() || fp.product?.name || 'Produit',
    description: fp.description || fp.product?.description || '',
    price: fp.product?.price ?? 0,
    images: [image],
    category: fp.product?.category || '',
    inStock: fp.product?.isActive !== false,
    stockQuantity: 1,
    badges: ['bestseller'],
    createdAt: fp.createdAt || new Date().toISOString(),
  };
}

const FeaturedProducts = () => {
  const { data: featured = [] } = useQuery({
    queryKey: ['featured-products', 'home'],
    queryFn: () => featuredProductsApi.getAllFeaturedProducts(),
    ...staticCatalogQueryOptions,
  });

  const { data: productsPage } = useQuery({
    queryKey: ['products', 'featured-fallback'],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 8, sortBy: 'createdAt', sortDir: 'DESC' }),
    ...staticCatalogQueryOptions,
    enabled: !featured.some((p) => p.isActive),
  });

  const curated = (Array.isArray(featured) ? featured : [])
    .filter((p) => p.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8)
    .map(mapFeaturedToProduct);

  const fallback = productsPage ? mapProductListItemListToProducts(productsPage.content).slice(0, 8) : [];
  const displayProducts = curated.length > 0 ? curated : fallback;

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Produits sélectionnés
            </h2>
            <p className="font-body text-muted-foreground max-w-xl">
              Une sélection mise en avant depuis l&apos;admin — emballages préférés des e-commerçants au Maroc
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="animate-fade-in h-full min-h-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-8">
            Aucun produit sélectionné pour le moment. Ajoutez-en depuis l&apos;admin → Produits Sélectionnés.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
