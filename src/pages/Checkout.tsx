import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowLeft, CreditCard, Banknote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { toast } from 'sonner';
import { PaymentMethod, goldTypeLabels } from '@/types/product';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl mb-4">Commande Confirmée!</h1>
          <p className="font-body text-muted-foreground mb-8">
            Merci pour votre commande, {formData.fullName}! 
            {paymentMethod === 'cash_on_delivery' 
              ? ` Nous vous contacterons au ${formData.phone} pour confirmer la livraison.`
              : ' Vous recevrez un email de confirmation avec les instructions de paiement.'
            }
          </p>
          <div className="bg-card rounded-lg p-6 mb-8 text-left">
            <h3 className="font-display text-lg mb-4">Détails de livraison</h3>
            <div className="space-y-2 font-body text-sm">
              <p><span className="text-muted-foreground">Nom:</span> {formData.fullName}</p>
              <p><span className="text-muted-foreground">Téléphone:</span> {formData.phone}</p>
              <p><span className="text-muted-foreground">Adresse:</span> {formData.address}</p>
              <p><span className="text-muted-foreground">Ville:</span> {formData.city}</p>
              <p><span className="text-muted-foreground">Paiement:</span> {paymentMethod === 'cash_on_delivery' ? 'À la livraison' : 'En ligne'}</p>
            </div>
          </div>
          <Button asChild size="lg" className="font-body uppercase tracking-wider">
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const shipping = getTotal() >= 5000 ? 0 : 50;
  const total = getTotal() + shipping;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-charcoal py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-cream">
            Finaliser la Commande
          </h1>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <Link
                to="/panier"
                className="inline-flex items-center font-body text-sm text-muted-foreground hover:text-primary mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au panier
              </Link>

              <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="font-display text-xl mb-6">Informations de livraison</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="font-body">
                      Nom complet *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Votre nom et prénom"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-body">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="06 XX XX XX XX"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-body">
                      Adresse *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="font-body">
                      Ville *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Casablanca, Rabat, Marrakech..."
                      className="mt-2"
                      required
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="pt-4 border-t border-border">
                    <Label className="font-body mb-4 block text-lg">Mode de paiement *</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                      className="space-y-3"
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                          paymentMethod === 'cash_on_delivery' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setPaymentMethod('cash_on_delivery')}
                      >
                        <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                        <Banknote className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <Label htmlFor="cash_on_delivery" className="font-body font-semibold cursor-pointer">
                            Paiement à la livraison
                          </Label>
                          <p className="font-body text-sm text-muted-foreground">
                            Payez en espèces à la réception de votre commande
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                          paymentMethod === 'online' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setPaymentMethod('online')}
                      >
                        <RadioGroupItem value="online" id="online" />
                        <CreditCard className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <Label htmlFor="online" className="font-body font-semibold cursor-pointer">
                            Paiement en ligne
                          </Label>
                          <p className="font-body text-sm text-muted-foreground">
                            Payez par carte bancaire de manière sécurisée
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'online' && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="font-body text-sm text-muted-foreground">
                        💳 <strong>Paiement sécurisé</strong><br />
                        Vous serez redirigé vers notre plateforme de paiement sécurisée après confirmation.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body uppercase tracking-wider py-6"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg p-6 shadow-card sticky top-24">
                <h2 className="font-display text-xl mb-6">Votre commande</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedGoldType}-${index}`} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm line-clamp-1">{item.product.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          Qté: {item.quantity}
                          {item.selectedGoldType && ` • ${goldTypeLabels[item.selectedGoldType]}`}
                          {item.selectedSize && ` • Taille: ${item.selectedSize}`}
                        </p>
                      </div>
                      <p className="font-body text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-display text-xl text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
