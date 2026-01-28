import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoldType } from '@/types/product';

const PRODUCTS_PER_PAGE = 12;

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popularity';

const sortOptions = [
  { value: 'newest', label: 'Les plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'popularity', label: 'Meilleures ventes' }
];

const productTypes = [
  { id: 'bracelet', label: 'Bracelets' },
  { id: 'ring', label: 'Bagues' },
  { id: 'necklace', label: 'Colliers' },
  { id: 'earrings', label: 'Boucles d\'oreilles' },
  { id: 'set', label: 'Parures' }
];

const goldTypes = [
  { id: 'yellow', label: 'Or Jaune', color: '#FFD700' },
  { id: 'white', label: 'Or Blanc', color: '#E5E4E2' },
  { id: 'rose', label: 'Or Rose', color: '#B76E79' }
];

const Boutique = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGoldTypes, setSelectedGoldTypes] = useState<GoldType[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(query) && !product.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) return false;
      if (selectedGoldTypes.length > 0 && !selectedGoldTypes.includes(product.goldType)) return false;
      if (selectedCollections.length > 0 && !selectedCollections.includes(product.collection || '')) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (inStockOnly && !product.inStock) return false;
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
        result = [...result].sort((a, b) => {
          const aScore = (a.badges.includes('bestseller') ? 2 : 0) + (a.badges.includes('new') ? 1 : 0);
          const bScore = (b.badges.includes('bestseller') ? 2 : 0) + (b.badges.includes('new') ? 1 : 0);
          return bScore - aScore;
        });
        break;
    }
    return result;
  }, [selectedCategory, selectedTypes, selectedGoldTypes, selectedCollections, priceRange, inStockOnly, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTypes, selectedGoldTypes, selectedCollections, priceRange, inStockOnly, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]);
  };

  const handleGoldTypeToggle = (goldTypeId: string) => {
    setSelectedGoldTypes(prev => prev.includes(goldTypeId as GoldType) ? prev.filter(t => t !== goldTypeId) : [...prev, goldTypeId] as GoldType[]);
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => prev.includes(collectionId) ? prev.filter(t => t !== collectionId) : [...prev, collectionId]);
  };

  return (
    <Layout>
      {/* Hero Section */}
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
          <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPwS7jO8A1t0pR7RdBRWLxuk5M-uQ2Pr5sW8bsJJcNxvG1WjyJVuf3Pw62lMnrvRlnI0OSSnOOmqkHjofPmZwy84ILuzFh3Bf9LPjbHlxKpPFJ44lZUsEi3Z5RqcFfOdBR0weUDXezHrCdJj5e0v_2LgVafALx3D7vMyIqOlMTAsp2URper5YYhweiF-d3AaD4a4RiPWcQEE1wIiivezdK0m1vlJ4uekuDFJ4ueIfuJdbF8j_roqacvNCt57ff2oW2UHxk6dcx6Hla')"}}></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-10">
            {/* Category Filter */}
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
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCategory === 'beldi'} 
                      onCheckedChange={() => handleCategoryChange('beldi')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Beldi
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCategory === 'modern'} 
                      onCheckedChange={() => handleCategoryChange('modern')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Moderne
                  </label>
                </li>
              </ul>
            </div>

            {/* Collection Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Collection
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCollections.includes('mariage')} 
                      onCheckedChange={() => handleCollectionToggle('mariage')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Mariage
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCollections.includes('homme')} 
                      onCheckedChange={() => handleCollectionToggle('homme')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Homme
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCollections.includes('femme')} 
                      onCheckedChange={() => handleCollectionToggle('femme')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Femme
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedCollections.includes('promo')} 
                      onCheckedChange={() => handleCollectionToggle('promo')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    En promotion
                  </label>
                </li>
              </ul>
            </div>

            {/* Type de Bijou Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Type de bijou
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedTypes.includes('bracelet')} 
                      onCheckedChange={() => handleTypeToggle('bracelet')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Bracelets
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedTypes.includes('ring')} 
                      onCheckedChange={() => handleTypeToggle('ring')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Bagues
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedTypes.includes('necklace')} 
                      onCheckedChange={() => handleTypeToggle('necklace')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Colliers
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedTypes.includes('earrings')} 
                      onCheckedChange={() => handleTypeToggle('earrings')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Boucles d'oreilles
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 text-sm text-accent-beige hover:text-primary cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedTypes.includes('set')} 
                      onCheckedChange={() => handleTypeToggle('set')}
                      className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                    />
                    Parures
                  </label>
                </li>
              </ul>
            </div>

            {/* Gold Type Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Type d'Or
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <div className="flex gap-4">
                {goldTypes.map(goldType => (
                  <button
                    key={goldType.id}
                    onClick={() => handleGoldTypeToggle(goldType.id)}
                    className={`size-8 rounded-full border-2 border-white shadow-sm ring-1 ring-accent-beige/20 hover:scale-110 transition-transform ${selectedGoldTypes.includes(goldType.id) ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: goldType.color }}
                    title={goldType.label}
                  />
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-secondary-dark dark:text-white mb-6 flex items-center gap-2">
                Prix (MAD)
                <div className="h-px flex-grow bg-accent-beige/20"></div>
              </h3>
              <Slider 
                value={priceRange} 
                onValueChange={value => setPriceRange(value as [number, number])} 
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

            {/* Stock Filter */}
            <div>
              <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-secondary-dark cursor-pointer">
                <Checkbox 
                  checked={inStockOnly} 
                  onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                  className="rounded border-accent-beige/30 text-primary focus:ring-primary size-4" 
                />
                En stock uniquement
              </label>
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-grow">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-accent-beige/10 pb-6">
              <p className="text-xs text-accent-beige uppercase tracking-widest">
                Affichage de {filteredProducts.length} produits
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-accent-beige uppercase tracking-widest">Trier par :</span>
                <Select value={sortBy} onValueChange={value => setSortBy(value as SortOption)}>
                  <SelectTrigger className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-secondary-dark focus:ring-0 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {paginatedProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="size-10 border border-accent-beige/20 flex items-center justify-center text-accent-beige hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 rotate-180" />
                </button>
                <button className={`size-10 ${currentPage === 1 ? 'bg-primary text-white' : 'border border-accent-beige/20 text-accent-beige hover:border-primary hover:text-primary'} flex items-center justify-center text-xs font-bold transition-colors`}>
                  1
                </button>
                {totalPages > 1 && (
                  <button 
                    onClick={() => handlePageChange(2)}
                    className={`size-10 ${currentPage === 2 ? 'bg-primary text-white' : 'border border-accent-beige/20 text-accent-beige hover:border-primary hover:text-primary'} flex items-center justify-center text-xs font-bold transition-colors`}
                  >
                    2
                  </button>
                )}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="size-10 border border-accent-beige/20 flex items-center justify-center text-accent-beige hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Boutique;