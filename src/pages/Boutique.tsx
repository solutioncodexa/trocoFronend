import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2, Package, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/product';
import type { ProductListItemDTO } from '@/types/product-dtos';
import { productsApi, categoriesApi } from '@/services/api';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { toast } from 'sonner';
import { sanitizeErrorMessage } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { cn } from '@/lib/utils';
import { useStoreBrand } from '@/hooks/useStoreBrand';

const PRODUCTS_PER_PAGE = 12;
const PRICE_MAX = 2000;

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
  const { siteName } = useStoreBrand();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFacetSize, setSelectedFacetSize] = useState<string | null>(null);

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

  const { data: facets } = useQuery({
    queryKey: ['products', 'facets'],
    queryFn: () => productsApi.getFacets(),
    retry: 1,
    ...staticCatalogQueryOptions,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getNavCategories(),
    retry: 1,
    ...staticCatalogQueryOptions,
  });

  const sortedCategories = useMemo(() => {
    type CategoryWithParent = (typeof categories)[number] & {
      parent?: unknown;
      parentId?: number | null;
    };
    const hasParentField = categories.some(
      (c) =>
        (c as CategoryWithParent).parent != null ||
        (c as CategoryWithParent).parentId != null
    );
    const isRoot = (c: CategoryWithParent) =>
      c.parent == null && (c.parentId == null || c.parentId === undefined);
    return [...categories].sort((a, b) => {
      if (hasParentField) {
        const aRoot = isRoot(a as CategoryWithParent);
        const bRoot = isRoot(b as CategoryWithParent);
        if (aRoot !== bRoot) return aRoot ? -1 : 1;
      }
      return a.name.localeCompare(b.name, 'fr');
    });
  }, [categories]);

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
      priceRange[0],
      priceRange[1],
      inStockOnly,
      searchQuery.trim(),
      selectedFacetSize,
      PRODUCTS_PER_PAGE,
    ],
    [
      currentPage,
      sortApi.sortBy,
      sortApi.sortDir,
      selectedCategory,
      priceRange,
      inStockOnly,
      searchQuery,
      selectedFacetSize,
    ]
  );

  const { data: pageResponse, isLoading, isError, error } = useQuery({
    queryKey: browseQueryKey,
    queryFn: async () =>
      productsApi.getAllProducts({
        page: currentPage - 1,
        size: PRODUCTS_PER_PAGE,
        sortBy: sortApi.sortBy,
        sortDir: sortApi.sortDir,
        category: selectedCategory ?? undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < PRICE_MAX ? priceRange[1] : undefined,
        inStock: inStockOnly ? true : undefined,
        keyword: searchQuery.trim() || undefined,
        facetSize: selectedFacetSize ?? undefined,
      }),
    retry: 1,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isError) return;
    const raw = error instanceof Error ? error.message : undefined;
    toast.error(sanitizeErrorMessage(raw), { id: 'boutique-products-error' });
  }, [isError, error]);

  const dtoList: ProductListItemDTO[] = pageResponse?.content ?? [];
  const products: Product[] = useMemo(() => mapProductListItemListToProducts(dtoList), [dtoList]);

  const totalPages = Math.max(1, pageResponse?.totalPages ?? 1);

  const hasActiveFilters = useMemo(
    () =>
      selectedCategory != null ||
      priceRange[0] > 0 ||
      priceRange[1] < PRICE_MAX ||
      inStockOnly ||
      searchQuery.trim().length > 0 ||
      selectedFacetSize != null,
    [selectedCategory, priceRange, inStockOnly, searchQuery, selectedFacetSize]
  );

  const resetBrowseFilters = useCallback(() => {
    searchQuerySourceRef.current = 'other';
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, PRICE_MAX]);
    setInStockOnly(false);
    setSelectedFacetSize(null);
    setCurrentPage(1);
    setSearchParams({});
  }, [setSearchParams]);

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
  }, [selectedCategory, priceRange, inStockOnly, sortBy, selectedFacetSize]);

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

  const filterSectionTitleClass =
    'text-xs uppercase tracking-[0.3em] font-bold text-foreground';
  const accordionTriggerClass = cn(
    filterSectionTitleClass,
    'py-4 hover:no-underline [&[data-state=open]]:text-primary'
  );

  const categoryFilterList = (
    <ul className="space-y-3">
      <li>
        <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
          <Checkbox
            checked={selectedCategory === null}
            onCheckedChange={() => handleCategoryChange(null)}
            className="rounded border-border text-primary focus:ring-primary size-4"
          />
          Toutes
        </label>
      </li>
      {sortedCategories.map((cat) => (
        <li key={cat.id}>
          <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
            <Checkbox
              checked={selectedCategory === cat.slug}
              onCheckedChange={() => handleCategoryChange(cat.slug)}
              className="rounded border-border text-primary focus:ring-primary size-4"
            />
            {cat.name}
          </label>
        </li>
      ))}
    </ul>
  );

  const priceFilterBlock = (
    <>
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange(value as [number, number])}
        onValueCommit={() => clearKeywordSearch()}
        min={0}
        max={PRICE_MAX}
        step={50}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground uppercase mt-2">
        <span>0 DH</span>
        <span>{PRICE_MAX.toLocaleString('fr-FR')}+ DH</span>
      </div>
    </>
  );

  const searchFilterBlock = (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
        Recherche :
      </span>
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
        className="w-full min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );

  const inStockFilterRow = (
    <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground cursor-pointer">
      <Checkbox
        checked={inStockOnly}
        onCheckedChange={(checked) => {
          clearKeywordSearch();
          setInStockOnly(checked as boolean);
        }}
        className="rounded border-border text-primary focus:ring-primary size-4"
      />
      En stock uniquement
    </label>
  );

  const sizeFilterList =
    facets?.sizes && facets.sizes.length > 0 ? (
      <ul className="space-y-3">
        {facets.sizes.map((bucket) => (
          <li key={bucket.value}>
            <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              <Checkbox
                checked={selectedFacetSize === bucket.value}
                onCheckedChange={(checked) => {
                  clearKeywordSearch();
                  setSelectedFacetSize(checked ? bucket.value : null);
                }}
                className="rounded border-border text-primary focus:ring-primary size-4"
              />
              <span>
                {bucket.label || bucket.value}
                <span className="text-muted-foreground/70"> ({bucket.count})</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-muted-foreground">Aucune taille disponible</p>
    );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (priceRange[0] > 0 || priceRange[1] < PRICE_MAX) count++;
    if (inStockOnly) count++;
    if (selectedFacetSize) count++;
    return count;
  }, [selectedCategory, priceRange, inStockOnly, selectedFacetSize]);

  const filterPanelContent = (
    <div className="flex flex-col gap-0">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['category']}
      >
        <AccordionItem value="category" className="border-border/60 border-b-0">
          <AccordionTrigger className={accordionTriggerClass}>Catégorie</AccordionTrigger>
          <AccordionContent>{categoryFilterList}</AccordionContent>
        </AccordionItem>
        {facets?.sizes && facets.sizes.length > 0 ? (
          <AccordionItem value="size" className="border-border/60 border-b-0">
            <AccordionTrigger className={accordionTriggerClass}>Taille</AccordionTrigger>
            <AccordionContent>{sizeFilterList}</AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>

      <div className="border-t border-border pt-6 px-0">
        <h3 className={`${filterSectionTitleClass} mb-6 flex items-center gap-2`}>
          Prix (DH)
          <div className="h-px flex-grow bg-border" />
        </h3>
        {priceFilterBlock}
      </div>

      <div className="mt-6">{inStockFilterRow}</div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            resetBrowseFilters();
            setFiltersOpen(false);
          }}
          className="mt-6 w-full inline-flex items-center justify-center rounded-xl border border-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605745341112-859dfc6dd42e?w=1600&h=600&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/90 to-primary/10" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 md:py-9">
          <div className="flex flex-col items-start gap-2 sm:items-center sm:text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Boutique {siteName}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Solutions d&apos;emballage
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Sachets, cartons, protections et consommables pour vos envois e-commerce.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full min-w-0 max-w-[1400px] overflow-x-hidden px-0 py-5 sm:px-6 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-w-0">

          {/* Desktop sidebar — hidden on mobile */}
          <aside className="hidden lg:block w-72 shrink-0">
            {filterPanelContent}
          </aside>

          <div className="flex-grow min-w-0 px-4 sm:px-0">
            {/* Toolbar: Filter button (mobile) + Search + Sort */}
            <div className="flex flex-col gap-4 mb-6 border-b border-border pb-6">
              {/* Row 1: Filter button + Sort */}
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden flex items-center gap-2 border-border text-foreground hover:border-primary hover:text-primary shrink-0"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Filtres</span>
                      {activeFilterCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] sm:w-[360px] overflow-y-auto scrollbar-app p-0">
                    <SheetHeader className="px-5 pt-5 pb-4 border-b border-border sticky top-0 bg-background z-10">
                      <div className="flex items-center justify-between">
                        <SheetTitle className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-primary" />
                          Filtres
                          {activeFilterCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                              {activeFilterCount}
                            </span>
                          )}
                        </SheetTitle>
                      </div>
                    </SheetHeader>
                    <div className="px-5 py-4">
                      {filterPanelContent}
                    </div>
                    {/* Sticky apply button */}
                    <div className="sticky bottom-0 bg-background border-t border-border p-4">
                      <Button
                        onClick={() => setFiltersOpen(false)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-widest rounded-xl"
                      >
                        Voir les résultats
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex-1" />

                {/* Sort — always visible */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:inline">Trier par :</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      clearKeywordSearch();
                      setSortBy(value as SortOption);
                    }}
                  >
                    <SelectTrigger className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-foreground focus:ring-0 cursor-pointer w-auto max-w-[180px]">
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

              {/* Row 2: Search */}
              <div className="w-full">{searchFilterBlock}</div>

              {/* Active filter tags (mobile) */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 lg:hidden">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {sortedCategories.find(c => c.slug === selectedCategory)?.name ?? selectedCategory}
                      <button type="button" onClick={() => handleCategoryChange(null)} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < PRICE_MAX) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {priceRange[0]}–{priceRange[1]} DH
                      <button type="button" onClick={() => setPriceRange([0, PRICE_MAX])} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      En stock
                      <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={resetBrowseFilters}
                    className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
                  >
                    Tout effacer
                  </button>
                </div>
              )}
            </div>

            {isLoading && !pageResponse ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={hasActiveFilters ? SlidersHorizontal : Package}
                title={
                  hasActiveFilters
                    ? 'Aucun produit ne correspond à ces critères'
                    : 'Catalogue en préparation'
                }
                description={
                  hasActiveFilters
                    ? 'Retirez une catégorie, élargissez la fourchette de prix ou videz la recherche.'
                    : 'Les produits de cette boutique seront bientôt disponibles.'
                }
                className="my-6"
              >
                {hasActiveFilters ? (
                  <Button
                    variant="outline"
                    onClick={resetBrowseFilters}
                    className="mt-6 rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <Button variant="outline" className="mt-6 rounded-xl" asChild>
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                )}
              </EmptyState>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 items-stretch">
                {products.map((product, index) => (
                  <RevealOnScroll
                    key={product.id}
                    className="h-full min-h-0"
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
                  className="size-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-xl"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {visiblePages.map((item, idx) =>
                  item === 'gap' ? (
                    <span key={`gap-${idx}`} className="px-1 text-muted-foreground text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      disabled={isLoading}
                      className={`min-w-10 h-10 px-2 rounded-xl flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-50 ${
                        currentPage === item
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
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
                  className="size-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-xl"
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
