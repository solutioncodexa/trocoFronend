import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, X, MessageCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { productsApi } from '@/services/api';
import { abandonedCartsApi } from '@/services/api/abandonedCarts';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { parseAbandonedCartJson } from '@/utils/abandonedCartItems';
import ProductCard from '@/components/ui/ProductCard';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useStoreAppearance } from '@/hooks/useStoreAppearance';
import { useStorefrontTheme } from '@/hooks/useStorefrontTheme';
import { appearanceButtonClass } from '@/config/storeAppearance';
import {
  buildCartWhatsAppMessage,
  buildWhatsAppMessageUrl,
  resolveStoreWhatsAppNumber,
} from '@/utils/whatsappOrder';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';

const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const recoverToken = searchParams.get('recover');
  const recoverStarted = useRef(false);
  const { t, locale } = useLocale();

  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotal,
    clearCart,
    addToCart,
  } = useCart();
  const { freeShippingThreshold, contactWhatsapp, contactPhone, siteName } = useStoreBrand();
  const theme = useStorefrontTheme();
  const appearance = useStoreAppearance();
  const cartPad =
    appearance.cartDensity === 'compact'
      ? 'p-4'
      : appearance.cartDensity === 'spacious'
        ? 'p-8'
        : 'p-6';
  const cartGap =
    appearance.cartDensity === 'compact'
      ? 'gap-4'
      : appearance.cartDensity === 'spacious'
        ? 'gap-16'
        : 'gap-12';
  const cartItemGap =
    appearance.cartDensity === 'compact'
      ? 'space-y-3'
      : appearance.cartDensity === 'spacious'
        ? 'space-y-8'
        : 'space-y-6';
  const cartCtaLabel =
    !appearance.cartCtaLabel?.trim() || appearance.cartCtaLabel.trim() === 'Passer la commande'
      ? t('placeOrder')
      : locale === 'fr'
        ? appearance.cartCtaLabel.trim()
        : t('placeOrder');

  const { data: recoveredCart, isLoading: recovering } = useQuery({
    queryKey: ['abandoned-cart-recover', recoverToken],
    queryFn: () => abandonedCartsApi.recover(recoverToken!),
    enabled: !!recoverToken?.trim(),
    retry: false,
  });

  useEffect(() => {
    if (!recoverToken || !recoveredCart || recoverStarted.current) return;
    recoverStarted.current = true;

    void (async () => {
      try {
        const lines = parseAbandonedCartJson(recoveredCart.cartJson);
        if (lines.length === 0) {
          toast.error('Panier de récupération vide ou invalide');
          return;
        }
        clearCart();
        const products = mapProductListItemListToProducts(
          await productsApi.getProductsByIds(lines.map((l) => l.productId)),
        );
        const byId = new Map(products.map((p) => [p.id, p]));
        for (const line of lines) {
          const product = byId.get(line.productId);
          if (!product) continue;
          addToCart(
            product,
            line.quantity,
            line.selectedSize,
            line.selectedVariantId,
            line.customLogoUrl,
          );
        }
        toast.success('Votre panier a été restauré');
        const next = new URLSearchParams(searchParams);
        next.delete('recover');
        setSearchParams(next, { replace: true });
      } catch {
        toast.error('Lien de récupération invalide');
      }
    })();
  }, [recoverToken, recoveredCart, addToCart, clearCart, searchParams, setSearchParams]);

  const waPhone = resolveStoreWhatsAppNumber(contactWhatsapp, contactPhone);
  const cartWhatsAppHref =
    waPhone && items.length > 0
      ? buildWhatsAppMessageUrl(waPhone, buildCartWhatsAppMessage(items, getTotal()))
      : null;

  const cartCategories = [...new Set(items.map(i => i.product.category))];
  const cartProductIds = new Set(items.map(i => i.product.id));

  const { data: crossSellProducts = [] } = useQuery({
    queryKey: ['cross-sell', cartCategories.join(',')],
    queryFn: async () => {
      const category = cartCategories[0];
      const res = await productsApi.getAllProducts({
        page: 0,
        size: 8,
        category,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      return mapProductListItemListToProducts(res.content)
        .filter((p) => !cartProductIds.has(p.id))
        .slice(0, 4);
    },
    enabled: items.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  if (recoverToken && recovering) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('restoringCart')}</p>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    const emptyBranded = appearance.cartEmptyStyle === 'branded';
    const emptyIllustrated = appearance.cartEmptyStyle === 'illustrated';
    return (
      <Layout>
        <div
          className={cn(
            'container mx-auto px-4 py-20',
            emptyBranded && 'rounded-3xl bg-primary/5',
          )}
        >
          {emptyIllustrated ? (
            <div className="mx-auto mb-8 h-32 max-w-md rounded-2xl bg-gradient-to-br from-primary/25 to-muted" />
          ) : null}
          <EmptyState
            icon={ShoppingBag}
            title={t('cartEmptyTitle')}
            description={
              emptyBranded
                ? t('cartEmptyDescBranded', { name: siteName || t('shop') })
                : t('cartEmptyDesc')
            }
          >
            <Button
              asChild
              size="lg"
              className={cn(
                appearanceButtonClass(appearance.buttonStyle, 'mt-6 font-body uppercase tracking-wider'),
              )}
            >
              <Link to="/boutique">
                {t('seeShop')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </EmptyState>
        </div>
      </Layout>
    );
  }

  const shipping = getTotal() >= freeShippingThreshold ? 0 : 50;
  const total = getTotal() + shipping;

  return (
    <Layout>
      <main className={cn('flex-grow bg-paper-pattern py-12 px-4 sm:px-6 w-full min-w-0 overflow-x-hidden animate-fade-in', theme.shell)}>
        <div className="max-w-[1200px] mx-auto w-full min-w-0">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-2">{t('cartTitle')}</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-border"></div>
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs">{t('cartSubtitle')}</p>
              <div className="h-px w-12 bg-border"></div>
            </div>
          </div>

          <div className={cn('grid grid-cols-1 items-start lg:grid-cols-3', cartGap)}>
            {/* Cart Items */}
            <div className={cn('lg:col-span-2', cartItemGap)}>
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedVariantId ?? ''}-${item.selectedSize ?? ''}-${index}`} className={cn('bg-card border border-border rounded-2xl shadow-soft', cartPad)}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 aspect-square rounded-xl border border-border/60 p-2 bg-muted/30 shrink-0">
                      <div className="w-full h-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.product.images[0]})` }}></div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-display font-bold text-foreground">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedVariantId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="text-xl" />
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {item.product.category && (
                            <p><span className="uppercase tracking-widest text-[10px] font-bold">{t('category')}:</span> {item.product.category}</p>
                          )}
                          {item.selectedVariantId && item.product.variants && (
                            <p>
                              <span className="uppercase tracking-widest text-[10px] font-bold">{t('option')}:</span>{' '}
                              {item.product.variants.find((v) => String(v.id) === String(item.selectedVariantId))?.label
                                || item.product.variants.find((v) => String(v.id) === String(item.selectedVariantId))?.attributeValue
                                || '—'}
                              {' · '}{formatPrice(item.product.price)}
                            </p>
                          )}
                          {item.customLogoUrl && (
                            <p className="text-green-700">
                              <span className="uppercase tracking-widest text-[10px] font-bold">{t('logoAttached')}</span>
                            </p>
                          )}
                          {item.selectedSize && <p><span className="uppercase tracking-widest text-[10px] font-bold">{t('size')}:</span> {item.selectedSize}</p>}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-border overflow-hidden">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedVariantId)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-muted-foreground hover:bg-muted transition-colors border-r border-border disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-bold text-foreground">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedVariantId)}
                            className="px-3 py-1 text-muted-foreground hover:bg-muted transition-colors border-l border-border"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center px-2">
                <Link to="/boutique" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowLeft className="text-sm" />
                  {t('continueShopping')}
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors border-b border-border pb-0.5"
                >
                  {t('clearCart')}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl shadow-card p-8">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-center text-foreground">{t('summary')}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span className="font-medium text-foreground">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('shipping')}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-foreground'}>
                      {shipping === 0 ? t('free') : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t('freeShippingRemaining', { amount: formatPrice(freeShippingThreshold - getTotal()) })}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex justify-between">
                  <span className="text-lg font-bold uppercase tracking-widest text-foreground">{t('total')}</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

               

                <Button
                  asChild
                  className={cn(
                    appearanceButtonClass(
                      appearance.buttonStyle,
                      'mt-6 w-full py-4 text-sm font-bold uppercase tracking-[0.2em]',
                    ),
                  )}
                >
                  <Link to="/checkout">{cartCtaLabel}</Link>
                </Button>

                {cartWhatsAppHref ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-3 rounded-2xl border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 gap-2 text-xs uppercase tracking-wider font-bold"
                    asChild
                  >
                    <a href={cartWhatsAppHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      {t('orderCartWhatsApp')}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {appearance.cartShowCrossSell && crossSellProducts.length > 0 && (
          <section className="max-w-[1200px] mx-auto w-full mt-16 mb-4">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-px bg-border mb-3 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-border bg-card" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-1">
                {t('youMayAlsoLike')}
              </h3>
              <p className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs">
                {t('complementaryPicks')}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
              {crossSellProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default Cart;
