import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, X, Search, Verified } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { productsApi } from '@/services/api';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import ProductCard from '@/components/ui/ProductCard';

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotal,
    clearCart
  } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-3xl mb-4">Votre panier est vide</h1>
          <p className="font-body text-muted-foreground mb-8">
            Découvrez notre collection de bijoux en or
          </p>
          <Button asChild size="lg" className="font-body uppercase tracking-wider">
            <Link to="/boutique">
              Voir la boutique
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const cartCategories = [...new Set(items.map(i => i.product.category))];
  const cartTypes = [...new Set(items.map(i => i.product.type).filter(Boolean))];
  const cartProductIds = new Set(items.map(i => i.product.id));

  const complementaryTypes: Record<string, string[]> = {
    bague: ['bracelet', 'collier', 'boucles-oreilles'],
    bracelet: ['bague', 'collier', 'boucles-oreilles'],
    collier: ['bague', 'bracelet', 'boucles-oreilles'],
    'boucles-oreilles': ['collier', 'bague', 'bracelet'],
  };

  const suggestedTypes = cartTypes.length > 0
    ? [...new Set(cartTypes.flatMap(t => complementaryTypes[t] || []))]
    : [];

  const { data: crossSellProducts = [] } = useQuery({
    queryKey: ['cross-sell', cartCategories.join(','), cartTypes.join(',')],
    queryFn: async () => {
      const category = cartCategories[0];
      let products: ReturnType<typeof mapProductListItemListToProducts> = [];

      for (const type of suggestedTypes) {
        if (products.length >= 4) break;
        const res = await productsApi.getAllProducts({
          page: 0,
          size: 4,
          category,
          type,
        });
        const mapped = mapProductListItemListToProducts(res.content)
          .filter(p => !cartProductIds.has(p.id) && !products.some(e => e.id === p.id));
        products = [...products, ...mapped];
      }

      if (products.length < 4) {
        const res = await productsApi.getAllProducts({
          page: 0,
          size: 8,
          category,
          sortBy: 'createdAt',
          sortDir: 'DESC',
        });
        const mapped = mapProductListItemListToProducts(res.content)
          .filter(p => !cartProductIds.has(p.id) && !products.some(e => e.id === p.id));
        products = [...products, ...mapped];
      }

      return products.slice(0, 4);
    },
    enabled: items.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const shipping = getTotal() >= 2000 ? 0 : 50;
  const total = getTotal() + shipping;

  return (
    <Layout>
      <main className="flex-grow bg-paper-pattern py-12 px-4 sm:px-6 w-full min-w-0 overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto w-full min-w-0">
          <div className="text-center mb-12">
            <h2 className="font-script text-6xl text-primary mb-2">Votre Panier</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-accent-beige/30"></div>
              <p className="text-accent-beige uppercase tracking-[0.3em] text-xs">Articles sélectionnés pour vous</p>
              <div className="h-px w-12 bg-accent-beige/30"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedVariantId ?? ''}-${item.selectedSize ?? ''}-${index}`} className="bg-white/60 dark:bg-[#2a2515]/40 backdrop-blur-sm p-6 ornate-border rounded-sm">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 aspect-square border border-accent-beige/20 p-2 bg-white dark:bg-background-dark shrink-0">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.images[0]})` }}></div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-display font-bold text-secondary-dark dark:text-white">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedVariantId)}
                            className="text-accent-beige hover:text-red-800 transition-colors"
                          >
                            <X className="text-xl" />
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-accent-beige">
                          <p><span className="uppercase tracking-widest text-[10px] font-bold">Style:</span> {item.product.category === 'beldi' ? 'Beldi' : 'Moderne'}</p>
                          <p><span className="uppercase tracking-widest text-[10px] font-bold">Poids:</span> {item.product.weight}g</p>
                          {item.selectedSize && <p><span className="uppercase tracking-widest text-[10px] font-bold">Taille:</span> {item.selectedSize}</p>}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center border border-accent-beige/30">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedVariantId)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-accent-beige hover:bg-accent-beige/10 transition-colors border-r border-accent-beige/30"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-bold text-secondary-dark dark:text-white">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedVariantId)}
                            className="px-3 py-1 text-accent-beige hover:bg-accent-beige/10 transition-colors border-l border-accent-beige/30"
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
                <Link to="/boutique" className="text-xs uppercase tracking-widest text-accent-beige hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowLeft className="text-sm" />
                  Continuer vos achats
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest text-accent-beige hover:text-red-800 transition-colors border-b border-accent-beige/30 pb-0.5"
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-paper dark:bg-[#1e1a0d] p-8 ornate-border shadow-xl">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-center text-secondary-dark dark:text-white">Récapitulatif</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-beige">Sous-total</span>
                    <span className="font-medium text-secondary-dark dark:text-white">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-beige">Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-secondary-dark dark:text-white'}>
                      {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-accent-beige">
                      Plus que {formatPrice(2000 - getTotal())} pour la livraison gratuite
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-accent-beige/20 flex justify-between">
                  <span className="text-lg font-bold uppercase tracking-widest text-secondary-dark dark:text-white">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

               

                <Button asChild className="w-full bg-primary hover:bg-[#d9a50b] text-white py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-lg border border-white/10 mt-6">
                  <Link to="/checkout">
                    Passer la commande
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {crossSellProducts.length > 0 && (
          <section className="max-w-[1200px] mx-auto w-full mt-16 mb-4">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-px bg-accent-beige/40 mb-3 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-paper" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-secondary-dark dark:text-white mb-1">
                Complétez votre parure
              </h3>
              <p className="text-accent-beige uppercase tracking-widest text-[10px] sm:text-xs">
                Des pièces assorties pour sublimer votre collection
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
