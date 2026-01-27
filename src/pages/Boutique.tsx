import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { GoldType, goldTypeLabels } from '@/types/product';

const productTypes = [
  { id: 'bracelet', label: 'Bracelets' },
  { id: 'ring', label: 'Bagues' },
  { id: 'necklace', label: 'Colliers' },
  { id: 'earrings', label: 'Boucles d\'oreilles' },
  { id: 'set', label: 'Parures' },
];

const goldTypes: { id: GoldType; label: string; color: string }[] = [
  { id: 'yellow', label: 'Or Jaune', color: 'bg-yellow-400' },
  { id: 'white', label: 'Or Blanc', color: 'bg-gray-200' },
  { id: 'rose', label: 'Or Rose', color: 'bg-rose-300' },
];

const Boutique = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGoldTypes, setSelectedGoldTypes] = useState<GoldType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const maxPrice = Math.max(...products.map(p => p.price));

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) return false;
      
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) return false;
      
      // Gold type filter
      if (selectedGoldTypes.length > 0 && !selectedGoldTypes.includes(product.goldType)) return false;
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Stock filter
      if (inStockOnly && !product.inStock) return false;
      
      return true;
    });
  }, [selectedCategory, selectedTypes, selectedGoldTypes, priceRange, inStockOnly]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGoldTypeToggle = (goldTypeId: GoldType) => {
    setSelectedGoldTypes(prev =>
      prev.includes(goldTypeId)
        ? prev.filter(t => t !== goldTypeId)
        : [...prev, goldTypeId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTypes([]);
    setSelectedGoldTypes([]);
    setPriceRange([0, maxPrice]);
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    selectedTypes.length + 
    selectedGoldTypes.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="font-display text-lg mb-4">Catégorie</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(null)}
            className="font-body"
          >
            Toutes
          </Button>
          <Button
            variant={selectedCategory === 'beldi' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('beldi')}
            className="font-body"
          >
            Beldi
          </Button>
          <Button
            variant={selectedCategory === 'modern' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('modern')}
            className="font-body"
          >
            Moderne
          </Button>
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="font-display text-lg mb-4">Type de bijou</h3>
        <div className="space-y-3">
          {productTypes.map(type => (
            <div key={type.id} className="flex items-center space-x-3">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => handleTypeToggle(type.id)}
              />
              <Label htmlFor={type.id} className="font-body cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Type Filter */}
      <div>
        <h3 className="font-display text-lg mb-4">Type d'or</h3>
        <div className="space-y-3">
          {goldTypes.map(goldType => (
            <div key={goldType.id} className="flex items-center space-x-3">
              <Checkbox
                id={`gold-${goldType.id}`}
                checked={selectedGoldTypes.includes(goldType.id)}
                onCheckedChange={() => handleGoldTypeToggle(goldType.id)}
              />
              <Label htmlFor={`gold-${goldType.id}`} className="font-body cursor-pointer flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${goldType.color} border border-border`} />
                {goldType.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-display text-lg mb-4">Prix (MAD)</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={maxPrice}
            step={1000}
            className="py-4"
          />
          <div className="flex justify-between font-body text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} MAD</span>
            <span>{priceRange[1].toLocaleString()} MAD</span>
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="font-body cursor-pointer">
            En stock uniquement
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full font-body"
        >
          <X className="w-4 h-4 mr-2" />
          Effacer les filtres ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
            Notre Collection
          </h1>
          <p className="font-body text-cream/80 max-w-2xl mx-auto">
            Découvrez notre sélection de bijoux en or, fabriqués avec passion par nos artisans
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-lg p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl">Filtres</h2>
                  <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button & Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-body text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </p>

                {/* Active filters badges */}
                <div className="hidden md:flex items-center gap-2">
                  {selectedCategory && (
                    <Badge variant="secondary" className="font-body">
                      {selectedCategory === 'beldi' ? 'Beldi' : 'Moderne'}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => handleCategoryChange(null)}
                      />
                    </Badge>
                  )}
                  {selectedTypes.map(type => (
                    <Badge key={type} variant="secondary" className="font-body">
                      {productTypes.find(t => t.id === type)?.label}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => handleTypeToggle(type)}
                      />
                    </Badge>
                  ))}
                  {selectedGoldTypes.map(goldType => (
                    <Badge key={goldType} variant="secondary" className="font-body flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${goldTypes.find(g => g.id === goldType)?.color}`} />
                      {goldTypes.find(g => g.id === goldType)?.label}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => handleGoldTypeToggle(goldType)}
                      />
                    </Badge>
                  ))}
                  {inStockOnly && (
                    <Badge variant="secondary" className="font-body">
                      En stock
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => setInStockOnly(false)}
                      />
                    </Badge>
                  )}
                </div>

                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden font-body">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="font-display">Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-display text-2xl text-muted-foreground mb-4">
                    Aucun produit trouvé
                  </p>
                  <p className="font-body text-muted-foreground mb-6">
                    Essayez de modifier vos filtres
                  </p>
                  <Button onClick={clearFilters} className="font-body">
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Boutique;
