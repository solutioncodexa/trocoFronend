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
import { useStorefrontTheme } from '@/hooks/useStorefrontTheme';
import {
  buildCartWhatsAppMessage,
  buildWhatsAppMessageUrl,
  resolveStoreWhatsAppNumber,
} from '@/utils/whatsappOrder';
import { toast } from 'sonner';

const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const recoverToken = searchParams.get('recover');
  const recoverStarted = useRef(false);

  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotal,
    clearCart,
    addToCart,
  } = useCart();
  const { freeShippingThreshold, contactWhatsapp, contactPhone } = useStoreBrand();
  const theme = useStorefrontTheme();

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
          <p className="text-muted-foreground">Restauration de votre panier…</p>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <EmptyState
            icon={ShoppingBag}
            title="Votre panier est vide"
            description="Découvrez nos solutions d'emballage e-commerce"
          >
            <Button asChild size="lg" className="mt-6 rounded-2xl font-body uppercase tracking-wider">
              <Link to="/boutique">
                Voir la boutique
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
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-2">Votre Panier</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-border"></div>
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs">Articles sélectionnés pour vous</p>
              <div className="h-px w-12 bg-border"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedVariantId ?? ''}-${item.selectedSize ?? ''}-${index}`} className="bg-card border border-border rounded-2xl shadow-soft p-6">
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
                            <p><span className="uppercase tracking-widest text-[10px] font-bold">Catégorie:</span> {item.product.category}</p>
                          )}
                          {item.selectedVariantId && item.product.variants && (
                            <p>
                              <span className="uppercase tracking-widest text-[10px] font-bold">Option:</span>{' '}
                              {item.product.variants.find((v) => String(v.id) === String(item.selectedVariantId))?.label
                                || item.product.variants.find((v) => String(v.id) === String(item.selectedVariantId))?.attributeValue
                                || '—'}
                              {' · '}{formatPrice(item.product.price)}
                            </p>
                          )}
                          {item.customLogoUrl && (
                            <p className="text-green-700">
                              <span className="uppercase tracking-widest text-[10px] font-bold">Logo:</span> joint
                            </p>
                          )}
                          {item.selectedSize && <p><span className="uppercase tracking-widest text-[10px] font-bold">Taille:</span> {item.selectedSize}</p>}
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
                  Continuer vos achats
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors border-b border-border pb-0.5"
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl shadow-card p-8">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-center text-foreground">Récapitulatif</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium text-foreground">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-foreground'}>
                      {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Plus que {formatPrice(freeShippingThreshold - getTotal())} pour la livraison gratuite
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex justify-between">
                  <span className="text-lg font-bold uppercase tracking-widest text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

               

                <Button asChild className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-2xl shadow-card mt-6">
                  <Link to="/checkout">
                    Passer la commande
                  </Link>
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
                      Commander le panier sur WhatsApp
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {crossSellProducts.length > 0 && (
          <section className="max-w-[1200px] mx-auto w-full mt-16 mb-4">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-px bg-border mb-3 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-border bg-card" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-1">
                Complétez votre commande
              </h3>
              <p className="text-muted-foreground uppercase tracking-widest text-[10px] sm:text-xs">
                Des emballages complémentaires pour votre e-commerce
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
