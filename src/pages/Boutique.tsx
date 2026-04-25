import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/product';
import type { ProductListItemDTO } from '@/types/product-dtos';
import { productsApi, categoriesApi, productTypesApi, collectionsApi } from '@/services/api';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { sortProductTypesForDisplay } from '@/utils/productTypeSort';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { toast } from 'sonner';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const PRODUCTS_PER_PAGE = 12;

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popularity';

const sortOptions = [
  { value: 'newest', label: 'Les plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'popularity', label: 'Meilleures ventes' },
];

function buildVisiblePageNumbers(current: number, total: number): (number | 'gap')[] {
  if (total <= 1) return [1];
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) out.push('gap');
    out.push(p);
  }
  return out;
}

const Boutique = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  /** 'user-typing' => changement de mot-clé depuis le champ : repasser à la page 1. Autres sources : ne pas forcer la page. */
  const searchQuerySourceRef = useRef<'user-typing' | 'other'>('other');

  const clearKeywordSearch = useCallback(() => {
    searchQuerySourceRef.current = 'other';
    setSearchQuery('');
    setSearchParams((prev) => {
      if (!prev.has('keyword')) return prev;
      const next = new URLSearchParams(prev);
      next.delete('keyword');
      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (searchParams.has('keyword')) {
      searchQuerySourceRef.current = 'other';
      setSearchQuery(searchParams.get('keyword') ?? '');
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchQuerySourceRef.current !== 'user-typing') return;
    searchQuerySourceRef.current = 'other';
    setCurrentPage(1);
  }, [searchQuery]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    retry: 1,
    ...staticCatalogQueryOptions,
  });
  const { data: productTypes = [] } = useQuery({
    queryKey: ['productTypes'],
    queryFn: () => productTypesApi.getAllProductTypes(),
    retry: 1,
    ...staticCatalogQueryOptions,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.getActiveCollections(),
    retry: 1,
    ...staticCatalogQueryOptions,
  });

  const sortedProductTypes = useMemo(
    () => sortProductTypesForDisplay(productTypes, selectedCategory),
    [productTypes, selectedCategory]
  );

  const sortApi = useMemo(() => {
    switch (sortBy) {
      case 'price-asc':
        return { sortBy: 'price', sortDir: 'ASC' as const };
      case 'price-desc':
        return { sortBy: 'price', sortDir: 'DESC' as const };
      case 'popularity':
        return { sortBy: 'createdAt', sortDir: 'DESC' as const };
      default:
        return { sortBy: 'createdAt', sortDir: 'DESC' as const };
    }
  }, [sortBy]);

  const browseQueryKey = useMemo(
    () => [
      'products',
      'boutique',
      currentPage,
      sortApi.sortBy,
      sortApi.sortDir,
      selectedCategory,
      [...selectedTypes].sort().join(','),
      [...selectedCollections].sort().join(','),
      priceRange[0],
      priceRange[1],
      inStockOnly,
      searchQuery.trim(),
      PRODUCTS_PER_PAGE,
    ],
    [
      currentPage,
      sortApi.sortBy,
      sortApi.sortDir,
      selectedCategory,
      selectedTypes,
      selectedCollections,
      priceRange,
      inStockOnly,
      searchQuery,
    ]
  );

  const { data: pageResponse, isLoading, isError, error } = useQuery({
    queryKey: browseQueryKey,
    queryFn: async () => {
      const typeParam = selectedTypes.length > 0 ? selectedTypes[0] : undefined;
      const collectionParam = selectedCollections.length > 0 ? selectedCollections[0] : undefined;

      return productsApi.getAllProducts({
        page: currentPage - 1,
        size: PRODUCTS_PER_PAGE,
        sortBy: sortApi.sortBy,
        sortDir: sortApi.sortDir,
        category: selectedCategory ?? undefined,
        type: typeParam,
        collection: collectionParam,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
        inStock: inStockOnly ? true : undefined,
        keyword: searchQuery.trim() || undefined,
      });
    },
    retry: 1,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isError) return;
    const msg = error instanceof Error ? error.message : 'Erreur lors du chargement des produits';
    toast.error(msg, { id: 'boutique-products-error' });
  }, [isError, error]);

  const dtoList: ProductListItemDTO[] = pageResponse?.content ?? [];
  const products: Product[] = useMemo(() => mapProductListItemListToProducts(dtoList), [dtoList]);

  const totalPages = Math.max(1, pageResponse?.totalPages ?? 1);
  const totalElements = pageResponse?.totalElements ?? 0;
  const rangeStart = totalElements === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * PRODUCTS_PER_PAGE, totalElements);

  const visiblePages = useMemo(
    () => buildVisiblePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  useEffect(() => {
    if (isLoading) return;
    if (currentPage > totalPages && totalPages >= 1) {
      setCurrentPage(totalPages);
    }
  }, [isLoading, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTypes, selectedCollections, priceRange, inStockOnly, sortBy]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      clearKeywordSearch();
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string | null) => {
    searchQuerySourceRef.current = 'other';
    setSearchQuery('');
    setSelectedCategory(category);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('keyword');
      if (category) next.set('category', category);
      else next.delete('category');
      return next;
    });
  };

  const handleTypeToggle = (typeId: string) => {
    clearKeywordSearch();
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]));
  };

  const handleCollectionToggle = (collectionId: string) => {
    clearKeywordSearch();
    setSelectedCollections((prev) =>
      prev.includes(collectionId) ? prev.filter((t) => t !== collectionId) : [...prev, collectionId]
    );
  };

  return (
    <Layout>
      <section className="relative bg-paper py-16 md:py-24 border-b border-accent-beige/10 bg-paper-pattern overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-px bg-primary mb-6"></div>
            <h2 className="font-script text-6xl md:text-8xl text-primary mb-4">Notre Collection</h2>
            <p className="max-w-2xl text-accent-beige text-sm md:text-base leading-relaxed uppercase tracking-[0.2em] font-light">
              Explorez l'alliance parfaite entre tradition Beldi et modernité raffinée.
            </p>
            <div className="w-12 h-px bg-primary mt-6"></div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPwS7jO8A1t0pR7RdBRWLxuk5M-uQ2Pr5sW8bsJJcNxvG1WjyJVuf3Pw62lMnrvRlnI0OSSnOOmqkHjofPmZwy84ILuzFh3Bf9LPjbHlxKpPFJ44lZUsEi3Z5RqcFfOdBR0weUDXezHrCdJj5e0v_2LgVafALx3D7vMyIqOlMTAsp2URper5YYhweiF-d3AaD4a4RiPWcQEE1wIiivezdK0m1vlJ4uekuDFJ4ueIfuJdbF8j_roqacvNCt57ff2oW2UHxk6dcx6Hla')",
            }}
          ></div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto w-full min-w-0 px-0 sm:px-6 py-12 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-w-0">
          <aside className="w-full lg:w-72 shrink-0 space-y-10 max-lg:w-screen max-lg:ml-[calc(50%-50vw)] max-lg:mr-[calc(50%-50vw)] max-lg:px-4 max-lg:sm:px-6 max-lg:py-6 max-lg:border-b max-lg:border-accent-beige/15 max-lg:bg-paper dark:max-lg:bg-[#2a2515]">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Catégorie
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox
                      checked={selectedCategory === null}
                      onCheckedChange={() => handleCategoryChange(null)}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4"
                    />
                    Toutes
                  </label>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                      <Checkbox
                        checked={selectedCategory === cat.slug}
                        onCheckedChange={() => handleCategoryChange(cat.slug)}
                        className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4"
                      />
                      {cat.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Collection
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <ul className="space-y-3">
                {collections.map((col) => (
                  <li key={col.id}>
                    <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                      <Checkbox
                        checked={selectedCollections.includes(col.slug)}
                        onCheckedChange={() => handleCollectionToggle(col.slug)}
                        className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4"
                      />
                      {col.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Type de bijou
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              {selectedCategory === 'ensemble' && (
                <p className="text-[10px] text-muted-foreground mb-3 leading-snug">
                  Ordre d’affichage : bracelets & gourmettes, bagues, serties, puis colliers et autres.
                </p>
              )}
              <ul className="space-y-3">
                {sortedProductTypes.map((pt) => (
                  <li key={pt.id}>
                    <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                      <Checkbox
                        checked={selectedTypes.includes(pt.code.toLowerCase())}
                        onCheckedChange={() => handleTypeToggle(pt.code.toLowerCase())}
                        className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4"
                      />
                      {pt.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Prix (MAD)
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                onValueCommit={() => clearKeywordSearch()}
                min={0}
                max={50000}
                step={1000}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-accent-beige uppercase mt-2">
                <span>0 MAD</span>
                <span>50 000+ MAD</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-secondary-dark cursor-pointer">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) => {
                    clearKeywordSearch();
                    setInStockOnly(checked as boolean);
                  }}
                  className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4"
                />
                En stock uniquement
              </label>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-4 flex items-center gap-2">
                Recherche
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  searchQuerySourceRef.current = 'user-typing';
                  setSearchQuery(e.target.value);
                }}
                onBlur={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    const t = searchQuery.trim();
                    if (t) next.set('keyword', t);
                    else next.delete('keyword');
                    return next;
                  });
                }}
                placeholder="Nom ou description…"
                className="w-full rounded-md border border-accent-beige/30 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </aside>

          <div className="flex-grow min-w-0 px-4 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-accent-beige/10 pb-6">
              <p className="text-xs text-accent-beige uppercase tracking-widest text-center md:text-left">
                {totalElements === 0
                  ? 'Aucun produit'
                  : `Affichage ${rangeStart}–${rangeEnd} sur ${totalElements} produit${totalElements > 1 ? 's' : ''}`}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-accent-beige uppercase tracking-widest">Trier par :</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    clearKeywordSearch();
                    setSortBy(value as SortOption);
                  }}
                >
                  <SelectTrigger className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-secondary-dark focus:ring-0 cursor-pointer w-[min(100vw-2rem,220px)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && !pageResponse ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-accent-beige uppercase tracking-widest text-sm">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {products.map((product, index) => (
                  <RevealOnScroll
                    key={product.id}
                    enabled={ANIMATIONS.productGridStagger}
                    delayMs={ANIMATIONS.productGridStagger ? index * 55 : 0}
                  >
                    <ProductCard product={product} />
                  </RevealOnScroll>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="mt-20 flex flex-wrap justify-center items-center gap-2"
                aria-label="Pagination des produits"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  className="size-10 border border-accent-beige/20 flex items-center justify-center text-accent-beige hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-sm"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {visiblePages.map((item, idx) =>
                  item === 'gap' ? (
                    <span key={`gap-${idx}`} className="px-1 text-accent-beige text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      disabled={isLoading}
                      className={`min-w-10 h-10 px-2 rounded-sm flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-50 ${
                        currentPage === item
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-accent-beige/20 text-accent-beige hover:border-primary hover:text-primary'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  className="size-10 border border-accent-beige/20 flex items-center justify-center text-accent-beige hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-sm"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Boutique;
