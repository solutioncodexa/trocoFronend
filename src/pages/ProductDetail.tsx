import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, Verified, Loader2, X, ZoomIn, Share2, Link as LinkIcon, Mail, MessageCircle, Instagram, Check, CloudUpload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatPrice } from '@/utils/formatPrice';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ProductDetailDTO } from '@/types/product-dtos';
import { productsApi } from '@/services/api';
import {
  applyVariantToProduct,
  getDefaultVariant,
  getVariantKey,
  mapProductDetailToProduct,
  mapProductListItemListToProducts,
  normalizeAvailableSizes,
} from '@/utils/productMapper';
import {
  buildAttributeAxes,
  findVariantByAttributes,
  getVariantAttributes,
  valuesForAxis,
} from '@/types/product-variant';
import {
  buildProductShareMessage,
  buildProductShareTitle,
  copyProductLink,
  shareViaEmail,
  shareViaMessenger,
  shareViaInstagram,
  shareViaWhatsApp,
} from '@/utils/shareProduct';
import { applyProductMeta, resetProductMeta } from '@/utils/productMeta';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import { buildApiUrl } from '@/config/api';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';

function isPersonalizedProduct(p: {
  customizable?: boolean;
  name?: string;
  description?: string;
  shortDescription?: string;
}) {
  if (p.customizable === true) return true;
  // Fallback legacy tant que la migration n'a pas flaggé tous les anciens produits
  const text = `${p.name ?? ''} ${p.description ?? ''} ${p.shortDescription ?? ''}`.toLowerCase();
  return /personnalis|votre logo|impression de votre logo|avec logo/.test(text);
}

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
          loading="eager"
          fetchPriority="high"
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

const MAX_ORDER_QUANTITY = 99;

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isEnabled } = useSocialNetworks();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  /** `undefined` = aucune taille (requis pour Radix Select + validation explicite) */
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedVariantKey, setSelectedVariantKey] = useState<string>('');
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  /** Message inline (mobile) si taille obligatoire non choisie */
  const [sizeError, setSizeError] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sizeFieldRef = useRef<HTMLDivElement>(null);

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
    queryKey: ['related-products', product?.category, id],
    queryFn: async () => {
      const sameCatRes = await productsApi.getAllProducts({
        page: 0,
        size: 8,
        category: product!.category,
      });
      return mapProductListItemListToProducts(sameCatRes.content)
        .filter((p) => p.id !== id)
        .slice(0, 4);
    },
    enabled: !!product,
    staleTime: 5 * 60 * 1000,
  });

  const relatedProducts = relatedProductsData || [];

  /** Réinitialise les choix quand on change de produit */
  useEffect(() => {
    if (!product) return;
    setSelectedSize(undefined);
    setSizeError(false);
    setQuantity(1);
    setSelectedImageIndex(0);
    setLogoPreview(null);
    setLogoUrl(undefined);
    setLogoError(false);
    const def = getDefaultVariant(product);
    setSelectedVariantKey(getVariantKey(def));
    const initialAttrs: Record<string, string> = {};
    for (const a of getVariantAttributes(def)) {
      initialAttrs[a.name] = a.value;
    }
    setSelectedAttrs(initialAttrs);
  }, [product?.id]);

  /** Open Graph / Twitter : aperçu riche quand le lien est partagé */
  useEffect(() => {
    if (!product || !id) return;
    const imageUrl = product.images[0] ? resolvePublicImageUrl(product.images[0]) : undefined;
    const v = getDefaultVariant(product);
    const variantsList = product.variants ?? [];
    const active =
      variantsList.find((variant) => getVariantKey(variant) === selectedVariantKey) ?? v;
    applyProductMeta({
      id,
      name: product.name,
      description: product.description,
      price: active.price,
      imageUrl,
    });
    return () => resetProductMeta();
  }, [product, id, selectedVariantKey]);

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

  const availableSizesList = normalizeAvailableSizes(product.availableSizes);
  const variants = product.variants ?? [];
  const attributeAxes = buildAttributeAxes(variants);
  const hasVariantAttributes = attributeAxes.length > 0 && variants.length > 0;
  /** Legacy jewelry sizes — only if no Woo Taille attribute */
  const hasTailleAxis = attributeAxes.some((a) => /taille|dimension|format/i.test(a));
  const requiresSize = !hasTailleAxis && availableSizesList.length > 0;

  const selectedVariant =
    (hasVariantAttributes
      ? findVariantByAttributes(variants, selectedAttrs)
      : undefined) ??
    variants.find((v) => getVariantKey(v) === selectedVariantKey) ??
    getDefaultVariant(product);
  const cartProduct = applyVariantToProduct(product, selectedVariant);
  const unitPrice = selectedVariant.price;
  const unitOriginalPrice = selectedVariant.originalPrice;
  const displayPrice = unitPrice * quantity;
  const displayOriginalPrice =
    unitOriginalPrice != null ? unitOriginalPrice * quantity : undefined;
  const attributeLabel = getVariantAttributes(selectedVariant)
    .map((a) => `${a.name} : ${a.value}`)
    .join(' · ') || selectedVariant.label || '';
  const hasPackQtyAxis = attributeAxes.some((a) => /quantit/i.test(a));
  const packStepperLabel = hasPackQtyAxis ? 'Nombre de packs' : 'Quantité';

  const handleAttrChange = (axis: string, value: string) => {
    const next = { ...selectedAttrs, [axis]: value };
    setSelectedAttrs(next);
    const match = findVariantByAttributes(variants, next);
    if (match) {
      setSelectedVariantKey(getVariantKey(match));
    }
  };

  const showSizeRequired = () => {
    setSizeError(true);
    requestAnimationFrame(() => {
      sizeFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };
  const images = product.images;
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const needsLogo = isPersonalizedProduct(product);

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo max 5 Mo');
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setLogoPreview(localPreview);
    setLogoUploading(true);
    setLogoError(false);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(buildApiUrl('/upload/logo'), { method: 'POST', body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || 'Upload impossible');
      }
      const url = json?.data?.url ?? json?.url;
      if (!url) throw new Error('URL logo manquante');
      setLogoUrl(url);
      toast.success('Logo ajouté');
    } catch (err) {
      setLogoPreview(null);
      setLogoUrl(undefined);
      toast.error(err instanceof Error ? err.message : 'Erreur upload logo');
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const clearLogo = () => {
    setLogoPreview(null);
    setLogoUrl(undefined);
    setLogoError(false);
  };

  const ensureCanOrder = () => {
    if (requiresSize && !String(selectedSize ?? '').trim()) {
      showSizeRequired();
      return false;
    }
    setSizeError(false);
    if (needsLogo && !logoUrl) {
      setLogoError(true);
      toast.error('Veuillez télécharger votre logo');
      return false;
    }
    setLogoError(false);
    if (quantity < 1) {
      toast.error('La quantité doit être au moins 1');
      return false;
    }
    if (quantity > MAX_ORDER_QUANTITY) {
      toast.error(`Quantité maximale : ${MAX_ORDER_QUANTITY}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!ensureCanOrder()) return;
    addToCart(cartProduct, quantity, selectedSize || undefined, selectedVariant.id, logoUrl);
  };

  const handleWishlistToggle = () => {
    const wasInList = isWishlisted;
    toggleWishlist(product.id);
    if (wasInList) toast.info('Retiré des favoris');
    else toast.success('Ajouté aux favoris');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = buildProductShareTitle(product.name);
  const shareMessage = buildProductShareMessage({
    name: product.name,
    url: shareUrl,
    price: unitPrice,
    originalPrice: unitOriginalPrice,
    description: product.description,
    weight: undefined,
    category: product.category,
    availableSizes: availableSizesList.length > 0 ? availableSizesList : undefined,
  });
  const shareImageUrl = product.images[0] ? resolvePublicImageUrl(product.images[0]) : undefined;
  const shareRichPayload = {
    title: shareTitle,
    text: shareMessage,
    url: shareUrl,
    imageUrl: shareImageUrl,
  };

  const handleCopyLink = async () => {
    const ok = await copyProductLink(shareUrl);
    if (ok) {
      setLinkCopied(true);
      toast.success('Lien copié');
      setTimeout(() => setLinkCopied(false), 2000);
    } else {
      toast.error('Impossible de copier le lien');
    }
  };

  const handleShareWhatsApp = () => {
    shareViaWhatsApp(shareMessage);
    setShareOpen(false);
  };

  const handleShareMessenger = async () => {
    setShareOpen(false);
    const result = await shareViaMessenger(shareRichPayload);
    if (result === 'shared') {
      toast.success('Choisissez Messenger pour envoyer le produit');
      return;
    }
    if (result === 'aborted') return;
    if (result === 'sharesheet') {
      toast.info('Choisissez la conversation Messenger — le message est déjà copié', {
        duration: 6000,
      });
      return;
    }
    toast.info('Message copié — ouvrez Messenger et choisissez une conversation', {
      duration: 6000,
    });
  };

  const handleShareInstagram = async () => {
    setShareOpen(false);
    const result = await shareViaInstagram(shareRichPayload);
    if (result === 'shared') {
      toast.success('Choisissez Instagram pour partager le produit');
      return;
    }
    if (result === 'aborted') return;
    if (result === 'sharesheet') {
      toast.info('Choisissez la conversation Instagram — le message est déjà copié', {
        duration: 6000,
      });
      return;
    }
    toast.info('Message copié — ouvrez Instagram et choisissez une conversation', {
      duration: 6000,
    });
  };

  const handleShareEmail = () => {
    shareViaEmail(shareTitle, shareMessage);
    setShareOpen(false);
  };

  const handleBuyNow = () => {
    if (!ensureCanOrder()) return;
    addToCart(cartProduct, quantity, selectedSize || undefined, selectedVariant.id, logoUrl);
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
      <div className="bg-muted/40 w-full">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <nav className="flex flex-wrap text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-medium gap-x-1 sm:gap-x-2 gap-y-1">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span className="mx-1">/</span>
            <Link to="/boutique" className="hover:text-primary">Boutique</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground truncate max-w-[40vw]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ============ PRODUCT SECTION ============ */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 sm:py-5 lg:py-6 w-full animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-start">

          {/* ---- LEFT: Thumbnails (desktop only) ---- */}
          {hasMultipleImages && (
            <div className="hidden lg:flex flex-col gap-2 w-[72px] shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    'w-[72px] h-[72px] rounded-xl border overflow-hidden transition-all',
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
              className="aspect-square overflow-hidden bg-card border border-border rounded-2xl cursor-zoom-in relative"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              {/* Flèches dans la zone image uniquement (évite chevauchement / taps bloqués sur mobile sous les miniatures) */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background sm:h-8 sm:w-8"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background sm:h-8 sm:w-8"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

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
                      'w-14 h-14 sm:w-16 sm:h-16 rounded-lg border shrink-0 overflow-hidden transition-all',
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="font-display text-base sm:text-lg text-primary mt-0.5">
                {product.category}
              </p>
            </div>

            {/* Price + attribute row (total = unit × quantity) */}
            <div className="flex items-baseline gap-4 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(displayPrice)}</span>
                  {displayOriginalPrice != null && displayOriginalPrice > displayPrice && (
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(displayOriginalPrice)}</span>
                  )}
                </div>
                {quantity > 1 && (
                  <span className="text-[11px] text-muted-foreground">
                    {formatPrice(unitPrice)} × {quantity}
                  </span>
                )}
              </div>
              {attributeLabel && (
                <span className="text-xs text-muted-foreground">{attributeLabel}</span>
              )}
            </div>

            {hasVariantAttributes && (
              <div className="space-y-3">
                {attributeAxes.map((axis) => {
                  const values = valuesForAxis(variants, axis);
                  const isTaille = /taille|dimension|format/i.test(axis);
                  return (
                    <div key={axis} className="space-y-1.5">
                      <Label className="text-[11px] sm:text-xs">{axis} *</Label>
                      {isTaille && values.length > 4 ? (
                        <div className="flex flex-wrap gap-2">
                          {values.map((val) => {
                            const trial = { ...selectedAttrs, [axis]: val };
                            const match = findVariantByAttributes(variants, trial);
                            const active = selectedAttrs[axis] === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleAttrChange(axis, val)}
                                className={cn(
                                  'min-h-9 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
                                  active
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border text-foreground/80 hover:border-primary/40'
                                )}
                              >
                                <span>{val}</span>
                                {match && (
                                  <span className="ml-1.5 text-muted-foreground font-normal">
                                    {formatPrice(match.price)}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <Select
                          value={selectedAttrs[axis] || ''}
                          onValueChange={(v) => handleAttrChange(axis, v)}
                        >
                          <SelectTrigger className="h-9 text-xs max-w-xs">
                            <SelectValue placeholder={`Choisir ${axis.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent className="z-[10001]">
                            {values.map((val) => {
                              const trial = { ...selectedAttrs, [axis]: val };
                              const match = findVariantByAttributes(variants, trial);
                              return (
                                <SelectItem key={val} value={val}>
                                  {val}
                                  {match ? ` — ${formatPrice(match.price)}` : ''}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {needsLogo && (
              <div
                className={cn(
                  'space-y-2 rounded-xl border border-dashed p-3',
                  logoError ? 'border-destructive bg-destructive/5' : 'border-border'
                )}
              >
                <Label className="text-[11px] sm:text-xs">Téléchargez votre logo *</Label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
                {logoPreview || logoUrl ? (
                  <div className="flex items-center gap-3">
                    {(logoPreview || logoUrl) && (
                      <img
                        src={logoPreview?.startsWith('blob:') ? logoPreview : resolvePublicImageUrl(logoUrl)}
                        alt="Logo"
                        className="h-16 w-16 object-contain rounded-lg border border-border bg-card"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-green-700">Logo prêt</span>
                      <button
                        type="button"
                        onClick={clearLogo}
                        className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={logoUploading}
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full min-h-[88px] flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {logoUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <CloudUpload className="w-6 h-6 text-primary" />
                    )}
                    <span>Glissez votre logo ici ou</span>
                    <span className="text-primary font-semibold underline underline-offset-2">
                      Choisir un fichier
                    </span>
                  </button>
                )}
                {logoError && (
                  <p role="alert" className="text-sm font-medium text-destructive">
                    Logo requis pour ce produit personnalisé.
                  </p>
                )}
              </div>
            )}

            {/* Description (collapsed on small screens) */}
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 lg:line-clamp-none">
              {product.description}
            </p>

            {/* Options + actions */}
            <div className="flex w-full min-w-0 flex-col gap-2.5 mt-1">
                <div className={cn('grid gap-2', requiresSize ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
                  {requiresSize ? (
                    <div ref={sizeFieldRef} className="min-w-0">
                      <Label className="text-[11px] sm:text-xs mb-1 block">Taille *</Label>
                      <Select
                        key={`${product.id}-taille`}
                        value={selectedSize}
                        onValueChange={(v) => {
                          setSelectedSize(v);
                          setSizeError(false);
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            'h-9 text-xs',
                            sizeError && 'border-destructive ring-1 ring-destructive focus:ring-destructive'
                          )}
                          aria-invalid={sizeError}
                          aria-required
                        >
                          <SelectValue placeholder="Choisir une taille" />
                        </SelectTrigger>
                        <SelectContent className="z-[10001] max-h-[min(70dvh,22rem)]">
                          {availableSizesList.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {sizeError ? (
                        <p
                          role="alert"
                          className="mt-2 text-sm font-medium text-destructive leading-snug"
                        >
                          Veuillez sélectionner une taille avant de commander ou d’ajouter au panier.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <div>
                    <Label className="text-[11px] sm:text-xs mb-1 block">{packStepperLabel}</Label>
                    <div className="flex h-9 max-w-[12rem] items-center rounded-xl border border-border overflow-hidden">
                      <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-full touch-manipulation px-2.5 text-sm hover:bg-muted transition-colors">-</button>
                      <span className="min-w-[2rem] flex-1 px-2.5 text-center text-xs">{quantity}</span>
                      <button type="button" onClick={() => setQuantity(Math.min(MAX_ORDER_QUANTITY, quantity + 1))} className="h-full touch-manipulation px-2.5 text-sm hover:bg-muted transition-colors">+</button>
                    </div>
                    {hasPackQtyAxis && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Packs à commander (en plus du conditionnement ci-dessus)
                      </p>
                    )}
                  </div>
                </div>

                {/* BUY NOW — primary CTA */}
                <Button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold shadow-card rounded-2xl flex items-center justify-center gap-2 touch-manipulation"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Commander
                </Button>

                {/* Secondary CTAs */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-11 min-h-[44px] touch-manipulation text-[10px] sm:h-10 sm:min-h-0 sm:text-xs uppercase tracking-wider font-bold rounded-xl border-border text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    Panier
                  </Button>
                  <Button
                    type="button"
                    onClick={handleWishlistToggle}
                    variant="outline"
                    className={cn(
                      'h-11 min-h-[44px] touch-manipulation text-[10px] sm:h-10 sm:min-h-0 sm:text-xs uppercase tracking-wider font-bold rounded-xl border-border text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5',
                      isWishlisted && 'border-primary text-primary hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <Heart className={cn('w-3.5 h-3.5 shrink-0', isWishlisted && 'fill-current')} />
                    Favoris
                  </Button>
                  <Popover open={shareOpen} onOpenChange={setShareOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        aria-label="Partager ce produit"
                        aria-expanded={shareOpen}
                        className="h-11 min-h-[44px] touch-manipulation text-[10px] sm:h-10 sm:min-h-0 sm:text-xs uppercase tracking-wider font-bold rounded-xl border-border text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5 shrink-0" />
                        Partager
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      sideOffset={8}
                      className="w-56 p-1.5"
                    >
                      <div className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        Partager via
                      </div>
                      {isEnabled('whatsapp') ? (
                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path d="M19.05 4.91A10 10 0 0 0 4.27 18.3L3 22l3.79-1.24A10 10 0 1 0 19.05 4.91Zm-7.04 15.4h-.02a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-2.25.74.75-2.19-.2-.31a8.3 8.3 0 1 1 6.25 3.1Zm4.55-6.22c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.97-.15.17-.29.18-.54.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.39-1.73c-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.77-1.84-.2-.49-.41-.42-.56-.43h-.48a.93.93 0 0 0-.67.31c-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.43.54.6.19 1.15.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z" />
                            </svg>
                          </span>
                          <span>WhatsApp</span>
                        </button>
                      ) : null}
                      {isEnabled('instagram') ? (
                        <button
                          type="button"
                          onClick={handleShareInstagram}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
                            <Instagram className="h-4 w-4" />
                          </span>
                          <span>Instagram</span>
                        </button>
                      ) : null}
                      {isEnabled('facebook') ? (
                        <button
                          type="button"
                          onClick={handleShareMessenger}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0084FF]/10 text-[#0084FF]">
                            <MessageCircle className="h-4 w-4" />
                          </span>
                          <span>Messenger</span>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleShareEmail}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span>Email</span>
                      </button>
                      <div className="my-1 h-px bg-border" />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
                          {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
                        </span>
                        <span>{linkCopied ? 'Lien copié' : 'Copier le lien'}</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
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
            <div className="w-16 sm:w-24 h-px bg-border mb-3 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-border bg-card" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-foreground mb-1">Vous aimerez aussi</h3>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs">Produits similaires</p>
          </div>
          <div className="max-w-[1280px] mx-auto px-3 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/produit/${rp.id}`} className="group bg-card rounded-2xl p-2 sm:p-3 border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-500 block">
                  <div className="relative overflow-hidden rounded-xl aspect-square mb-2 border border-border/60">
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
                    <h4 className="text-xs sm:text-sm font-bold text-foreground font-display truncate">{rp.name}</h4>
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
