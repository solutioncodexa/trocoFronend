import { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, Verified, Loader2, X, ZoomIn } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/utils/formatPrice';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ProductDetailDTO } from '@/types/product-dtos';
import { GoldType } from '@/types/product';
import { productsApi } from '@/services/api';
import { useGoldTypes } from '@/hooks/useGoldTypes';
import { mapProductDetailToProduct, mapProductListItemListToProducts } from '@/utils/productMapper';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

/* ------------------------------------------------------------------ */
/*  Image lightbox                                                     */
/* ------------------------------------------------------------------ */
function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white">
          <X className="w-7 h-7" />
        </button>

        <img
          src={images[idx]}
          alt=""
          className="w-full max-h-[80vh] object-contain rounded-lg select-none"
          draggable={false}
          decoding="async"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/40 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/40 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition',
                  i === idx ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { goldTypesWithColors } = useGoldTypes();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedGoldType, setSelectedGoldType] = useState<GoldType | ''>('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const dto: ProductDetailDTO = await productsApi.getProductById(id);
      return mapProductDetailToProduct(dto);
    },
    enabled: !!id,
    retry: 1,
    onError: () => {
      toast.error('Erreur lors du chargement du produit');
    },
  });

  const { data: relatedProductsData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await productsApi.getAllProducts({ page: 0, size: 4 });
      return mapProductListItemListToProducts(response.content);
    },
    enabled: !!product,
    ...staticCatalogQueryOptions,
  });

  const relatedProducts = (relatedProductsData || []).filter(p => p.id !== id).slice(0, 4);

  if (isLoadingProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Chargement du produit...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Produit non trouvé</h1>
          <p className="font-body text-muted-foreground mb-8">Ce produit n'existe pas ou a été retiré.</p>
          <Button asChild><Link to="/boutique">Retour à la boutique</Link></Button>
        </div>
      </Layout>
    );
  }

  const requiresSize = product.availableSizes && product.availableSizes.length > 0;
  const images = product.images;
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) { toast.error('Veuillez sélectionner une taille'); return; }
    if (!selectedGoldType) { toast.error("Veuillez sélectionner un type d'or"); return; }
    addToCart(product, quantity, selectedSize || undefined, selectedGoldType);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleBuyNow = () => {
    if (requiresSize && !selectedSize) { toast.error('Veuillez sélectionner une taille'); return; }
    if (!selectedGoldType) { toast.error("Veuillez sélectionner un type d'or"); return; }
    addToCart(product, quantity, selectedSize || undefined, selectedGoldType);
    navigate('/panier');
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Layout>
      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          startIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-background-light dark:bg-background-dark w-full">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <nav className="flex flex-wrap text-[10px] sm:text-xs uppercase tracking-widest text-accent-beige font-medium gap-x-1 sm:gap-x-2 gap-y-1">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span className="mx-1">/</span>
            <Link to="/boutique" className="hover:text-primary">Boutique</Link>
            <span className="mx-1">/</span>
            <span className="text-secondary-dark dark:text-white truncate max-w-[40vw]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ============ PRODUCT SECTION ============ */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 sm:py-5 lg:py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">

          {/* ---- LEFT: Thumbnails (desktop only) ---- */}
          {hasMultipleImages && (
            <div className="hidden lg:flex flex-col gap-2 w-[72px] shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    'w-[72px] h-[72px] rounded border overflow-hidden transition-all',
                    i === selectedImageIndex
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-border/50 opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </button>
              ))}
            </div>
          )}

          {/* ---- CENTER: Main image ---- */}
          <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 relative group">
            <div
              className="aspect-square overflow-hidden bg-paper border border-primary/30 rounded cursor-zoom-in relative"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Nav arrows on main image */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  className={cn(
                    'font-body text-[10px] uppercase tracking-wider',
                    badge === 'new' ? 'bg-primary text-primary-foreground' : 'bg-gradient-gold text-charcoal'
                  )}
                >
                  {badge === 'new' ? 'Nouveau' : 'Best-seller'}
                </Badge>
              ))}
            </div>

            {/* Mobile thumbnail strip */}
            {hasMultipleImages && (
              <div className="lg:hidden flex gap-1.5 mt-2 overflow-x-auto pb-1 overscroll-x-contain scrollbar-app">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      'w-14 h-14 sm:w-16 sm:h-16 rounded border shrink-0 overflow-hidden transition-all',
                      i === selectedImageIndex
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border/50 opacity-60'
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---- RIGHT: Product info + buttons ---- */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
            {/* Title row */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display text-secondary-dark dark:text-white leading-tight">
                {product.name}
              </h1>
              <p className="font-script text-base sm:text-lg text-primary mt-0.5">
                Collection {product.category === 'beldi' ? 'Beldi' : 'Moderne'}
              </p>
            </div>

            {/* Price + weight row */}
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              <span className="text-xs text-accent-beige">{product.weight}g · Or 18 carats</span>
            </div>

            {/* Description (collapsed on small screens) */}
            <p className="text-secondary-dark/70 dark:text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3 lg:line-clamp-none">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', product.inStock ? 'bg-green-500' : 'bg-red-500')} />
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                {product.inStock
                  ? `En stock (${product.stockQuantity} disponible${product.stockQuantity > 1 ? 's' : ''})`
                  : 'Rupture de stock'}
              </span>
            </div>

            {/* Options + actions */}
            {product.inStock && (
              <div className="flex flex-col gap-2.5 mt-1">
                {/* Selectors row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] sm:text-xs mb-1 block">Type d'or *</Label>
                    <Select value={selectedGoldType} onValueChange={(v) => setSelectedGoldType(v as GoldType)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Type d'or" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white dark:bg-secondary-dark border border-accent-beige/30">
                        {goldTypesWithColors.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {requiresSize ? (
                    <div>
                      <Label className="text-[11px] sm:text-xs mb-1 block">Taille *</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Taille" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.availableSizes?.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-[11px] sm:text-xs mb-1 block">Quantité</Label>
                      <div className="flex items-center border border-border rounded h-9">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 h-full hover:bg-muted transition-colors text-sm">-</button>
                        <span className="px-2.5 text-xs text-center min-w-[2rem]">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="px-2.5 h-full hover:bg-muted transition-colors text-sm">+</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity if size selector is shown */}
                {requiresSize && (
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] sm:text-xs">Quantité:</span>
                    <div className="flex items-center border border-border rounded h-8">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 h-full hover:bg-muted transition-colors text-sm">-</button>
                      <span className="px-2.5 text-xs text-center min-w-[2rem]">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="px-2.5 h-full hover:bg-muted transition-colors text-sm">+</button>
                    </div>
                    <Link to="/guide-tailles" className="text-primary text-[11px] hover:underline ml-auto">Guide des tailles</Link>
                  </div>
                )}

                {/* BUY NOW — primary CTA */}
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-primary hover:bg-[#d9a50b] text-white h-11 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Commander
                </Button>

                {/* Secondary CTAs */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-10 text-[10px] sm:text-xs uppercase tracking-wider font-bold border-accent-beige/40 text-accent-beige hover:bg-accent-beige hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    Panier
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-10 text-[10px] sm:text-xs uppercase tracking-wider font-bold border-accent-beige/40 text-accent-beige hover:bg-accent-beige hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 shrink-0" />
                    Favoris
                  </Button>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-accent-beige mt-1">
              <div className="flex items-center gap-1.5"><Verified className="w-3.5 h-3.5" /> Certificat</div>
              <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Livraison sécurisée</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RELATED PRODUCTS ============ */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-16 lg:mt-24 mb-10 sm:mb-16 lg:mb-24">
          <div className="flex flex-col items-center mb-6 sm:mb-10 text-center px-3">
            <div className="w-16 sm:w-24 h-px bg-accent-beige/40 mb-3 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-secondary-dark dark:text-white mb-1">Vous aimerez aussi</h3>
            <p className="text-accent-beige uppercase tracking-widest text-[10px] sm:text-xs">Sélection pour compléter votre parure</p>
          </div>
          <div className="max-w-[1280px] mx-auto px-3 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/produit/${rp.id}`} className="group bg-paper dark:bg-[#2a2515] p-2 sm:p-3 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500 block">
                  <div className="relative overflow-hidden aspect-square mb-2 border border-accent-beige/10">
                    <img
                      src={rp.images[0]}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs sm:text-sm font-bold text-secondary-dark dark:text-white font-display truncate">{rp.name}</h4>
                    <p className="text-primary font-medium text-xs sm:text-sm">{formatPrice(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
