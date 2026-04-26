import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowLeft, Banknote, Trash2, Plus, Minus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { toast } from 'sonner';
import { PaymentMethod, goldTypeLabels } from '@/types/product';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    items,
    getTotal,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    clearCart();
  };

  if (items.length === 0 && !isSuccess) {
    navigate('/panier');
    return null;
  }

  if (isSuccess) {
    return <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl mb-4">Commande Confirmée!</h1>
          <p className="font-body text-muted-foreground mb-8">
            Merci pour votre commande, {formData.fullName}! 
            {` Nous vous contacterons au ${formData.phone} pour confirmer la livraison.`}
          </p>
          <div className="bg-card rounded-lg p-6 mb-8 text-left">
            <h3 className="font-display text-lg mb-4">Détails de livraison</h3>
            <div className="space-y-2 font-body text-sm">
              <p><span className="text-muted-foreground">Nom:</span> {formData.fullName}</p>
              <p><span className="text-muted-foreground">Téléphone:</span> {formData.phone}</p>
              <p><span className="text-muted-foreground">Adresse:</span> {formData.address}</p>
              <p><span className="text-muted-foreground">Ville:</span> {formData.city}</p>
              <p><span className="text-muted-foreground">Paiement:</span> À la livraison</p>
            </div>
          </div>
          <Button asChild size="lg" className="font-body uppercase tracking-wider">
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </Layout>;
  }

  const shipping = getTotal() >= 2000 ? 0 : 50;
  const total = getTotal() + shipping;

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-display text-secondary-dark dark:text-white">Votre Panier</h1>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-accent-beige border-accent-beige hover:bg-accent-beige hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider le panier
              </Button>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedGoldType}-${index}`} className="bg-paper dark:bg-[#2a2515] p-6 border border-accent-beige/20">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-paper flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display text-secondary-dark dark:text-white mb-2">{item.product.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-accent-beige mb-4">
                        <span>{item.product.category === 'beldi' ? 'Beldi' : 'Moderne'}</span>
                        <span>• {item.product.weight}g</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="text-primary font-medium">{goldTypeLabels[item.selectedGoldType]}</span>
                        {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedGoldType, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-accent-beige/40 flex items-center justify-center hover:bg-accent-beige hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-display">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedGoldType, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-accent-beige/40 flex items-center justify-center hover:bg-accent-beige hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                          <p className="text-sm text-accent-beige">{formatPrice(item.product.price)} par pièce</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-paper dark:bg-[#2a2515] p-6 border border-accent-beige/20 sticky top-8">
              <h2 className="text-2xl font-display text-secondary-dark dark:text-white mb-6">Récapitulatif</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-accent-beige">Sous-total</span>
                  <span className="font-medium">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent-beige">Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'font-medium'}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-accent-beige/20">
                  <span className="text-xl font-display">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-accent-beige">
                    Nom complet *
                  </Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Votre nom et prénom" 
                    className="mt-2 bg-background-light dark:bg-background-dark border-accent-beige/30" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-accent-beige">
                    Téléphone *
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="06 XX XX XX XX" 
                    className="mt-2 bg-background-light dark:bg-background-dark border-accent-beige/30" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-accent-beige">
                    Adresse *
                  </Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Votre adresse complète" 
                    className="mt-2 bg-background-light dark:bg-background-dark border-accent-beige/30" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-accent-beige">
                    Ville *
                  </Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="Casablanca, Rabat, Marrakech..." 
                    className="mt-2 bg-background-light dark:bg-background-dark border-accent-beige/30" 
                    required 
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="text-sm font-medium text-accent-beige mb-4 block">Mode de paiement *</Label>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-primary bg-primary/5">
                    <Banknote className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="font-medium">Paiement à la livraison</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-[#d9a50b] text-white py-4 text-sm uppercase tracking-[0.3em] font-bold transition-all shadow-lg border border-white/20" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Traitement en cours...' : 'Passer la commande'}
                </Button>
                
                <p className="text-xs text-accent-beige text-center">
                  Paiement à la livraison uniquement
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
