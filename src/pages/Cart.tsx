import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { goldTypeLabels } from '@/types/product';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

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

  return (
    <Layout>
      {/* Header */}
      <section className="bg-charcoal py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-cream">
            Votre Panier
          </h1>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedGoldType}-${index}`}
                  className="flex gap-4 p-4 bg-card rounded-lg shadow-card"
                >
                  {/* Image */}
                  <Link
                    to={`/produit/${item.product.id}`}
                    className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-cream"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/produit/${item.product.id}`}
                      className="font-display text-lg text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {item.product.category === 'beldi' ? 'Beldi' : 'Moderne'} • {item.product.weight}g
                    </p>
                    {item.selectedGoldType && (
                      <p className="font-body text-sm text-muted-foreground">
                        {goldTypeLabels[item.selectedGoldType]}
                      </p>
                    )}
                    {item.selectedSize && (
                      <p className="font-body text-sm text-muted-foreground">
                        Taille: {item.selectedSize}
                      </p>
                    )}
                    <p className="font-display text-lg text-primary mt-2">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedGoldType)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedGoldType)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-body">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedGoldType)}
                        className="p-2 hover:bg-muted transition-colors"
                        disabled={item.quantity >= item.product.stockQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="font-body text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider le panier
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-card sticky top-24">
                <h2 className="font-display text-xl mb-6">Récapitulatif</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className={getTotal() >= 5000 ? 'text-green-600' : ''}>
                      {getTotal() >= 5000 ? 'Gratuite' : formatPrice(50)}
                    </span>
                  </div>
                  {getTotal() < 5000 && (
                    <p className="font-body text-xs text-muted-foreground">
                      Plus que {formatPrice(5000 - getTotal())} pour la livraison gratuite
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-display text-xl text-primary">
                      {formatPrice(getTotal() + (getTotal() >= 5000 ? 0 : 50))}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body uppercase tracking-wider"
                  size="lg"
                >
                  <Link to="/checkout">
                    Passer la commande
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <p className="font-body text-xs text-muted-foreground text-center mt-4">
                  Paiement en ligne ou à la livraison
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
