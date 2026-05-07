import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Check, Banknote, CheckCircle, Verified } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types/product';
import { ordersApi } from '@/services/api';
import { OrderDTO, CartItemDTO } from '@/types/api';

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
    city: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mutation pour créer une commande
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderDTO) => {
      return await ordersApi.createOrder(orderData);
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      toast.success('Commande créée avec succès!');
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast.error(error.message || 'Erreur lors de la création de la commande');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setIsSubmitting(true);

    // Convertir les items du panier en CartItemDTO
    const cartItems: CartItemDTO[] = items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        weight: item.product.weight,
        images: item.product.images,
        category: item.product.category,
        type: item.product.type,
        collection: item.product.collection,
        availableSizes: item.product.availableSizes,
        inStock: item.product.inStock,
        stockQuantity: item.product.stockQuantity,
        badges: item.product.badges,
        createdAt: item.product.createdAt,
      },
      quantity: item.quantity,
      selectedSize: item.selectedSize,
    }));

    const shipping = getTotal() >= 2000 ? 0 : 50;
    const total = getTotal() + shipping;

    // Créer l'objet OrderDTO
    const orderDTO: OrderDTO = {
      id: '', // Sera généré par le backend
      items: cartItems,
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      },
      total: total,
      paymentMethod: paymentMethod,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    createOrderMutation.mutate(orderDTO);
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
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column - Form */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-display text-secondary-dark dark:text-white mb-2">Validation de votre Commande</h2>
              <p className="text-accent-beige font-script text-3xl">
                Paiement à la livraison
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-paper dark:bg-[#2a2515] p-8 md:p-10 border border-accent-beige/20 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full md:col-span-1">
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold" htmlFor="fullname">Nom Complet</Label>
                  <Input 
                    id="fullname"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Jean Dupont" 
                    className="w-full bg-transparent border-0 border-b border-accent-beige/30 focus:ring-0 focus:border-primary px-0 py-3 text-secondary-dark dark:text-white placeholder:text-gray-300 font-display italic" 
                    required 
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold" htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6..." 
                    className="w-full bg-transparent border-0 border-b border-accent-beige/30 focus:ring-0 focus:border-primary px-0 py-3 text-secondary-dark dark:text-white placeholder:text-gray-300 font-display italic" 
                    required 
                  />
                </div>
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold" htmlFor="address">Adresse de livraison</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rue, n° d'appartement..." 
                    className="w-full bg-transparent border-0 border-b border-accent-beige/30 focus:ring-0 focus:border-primary px-0 py-3 text-secondary-dark dark:text-white placeholder:text-gray-300 font-display italic" 
                    required 
                  />
                </div>
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold" htmlFor="city">Ville</Label>
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Casablanca" 
                    className="w-full bg-transparent border-0 border-b border-accent-beige/30 focus:ring-0 focus:border-primary px-0 py-3 text-secondary-dark dark:text-white placeholder:text-gray-300 font-display italic" 
                    required 
                  />
                </div>
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold" htmlFor="notes">Notes de commande (Optionnel)</Label>
                  <textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Précisions pour le livreur..." 
                    rows={3}
                    className="w-full bg-transparent border-0 border-b border-accent-beige/30 focus:ring-0 focus:border-primary px-0 py-3 text-secondary-dark dark:text-white placeholder:text-gray-300 font-display italic resize-none" 
                  />
                </div>
              </div>

              {/* Mode de paiement */}
              <div>
                <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">Mode de paiement *</Label>
                <div className="space-y-3">
                  <div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-accent-beige/30 hover:border-primary/50'}`}
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary' : 'border-accent-beige/30'} flex items-center justify-center`}>
                      {paymentMethod === 'cash_on_delivery' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <Banknote className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="font-medium cursor-pointer">
                        Paiement à la livraison
                      </span>
                      <p className="text-xs text-accent-beige leading-relaxed">Payez en espèces à la réception de votre commande</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="w-full h-px bg-accent-beige/20"></div>
                <div className="mx-4 size-2 rotate-45 border border-accent-beige bg-paper"></div>
                <div className="w-full h-px bg-accent-beige/20"></div>
              </div>

              <div className="bg-accent-beige/5 p-4 border border-accent-beige/10 rounded-sm">
                <div className="flex gap-4 items-start">
                  <Verified className="text-primary" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-secondary-dark dark:text-white mb-1">Confirmation Immédiate</h4>
                    <p className="text-xs text-accent-beige leading-relaxed">En cliquant sur confirmer, votre commande sera enregistrée. Notre service client vous contactera par téléphone pour confirmer les détails de livraison.</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full !h-auto min-h-[3.25rem] bg-primary px-4 py-3.5 hover:bg-[#d9a50b] text-primary-foreground text-xs sm:text-sm uppercase font-bold tracking-[0.12em] sm:tracking-[0.2em] transition-all shadow-xl grid grid-cols-[auto_1fr] items-center gap-2.5 sm:gap-3 sm:px-6 whitespace-normal leading-snug sm:min-h-[3.5rem] sm:py-4"
                disabled={isSubmitting}
              >
                <CheckCircle className="size-5 shrink-0 justify-self-start sm:size-[1.35rem]" aria-hidden />
                <span className="min-w-0 text-center text-balance">
                  {isSubmitting ? 'Traitement en cours…' : 'Confirmer la commande'}
                </span>
              </Button>
            </form>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 bg-white dark:bg-[#181611] border border-accent-beige/20 p-8 shadow-md">
              <h3 className="text-xl font-display text-secondary-dark dark:text-white mb-6 border-b border-accent-beige/10 pb-4 uppercase tracking-widest text-sm font-bold">Résumé du Panier</h3>
              
              <div className="space-y-6 mb-8">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedSize ?? ''}-${index}`} className="flex gap-4">
                    <div className="size-20 bg-background-light border border-accent-beige/10 overflow-hidden rounded-sm flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold font-display text-secondary-dark dark:text-white leading-tight">{item.product.name}</h4>
                        <p className="text-[10px] text-accent-beige uppercase tracking-widest mt-1">Or 18 carats</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400">Qté: {item.quantity}</span>
                        <span className="text-sm font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-accent-beige/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-accent-beige uppercase tracking-wider">Sous-total</span>
                  <span className="text-secondary-dark dark:text-white">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent-beige uppercase tracking-wider">Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-secondary-dark dark:text-white'}>
                    {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-accent-beige/10 mt-4">
                  <span className="text-base font-bold uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 py-4 border-y border-accent-beige/5">
                <Verified className="text-primary text-xl" />
                <p className="text-[10px] uppercase tracking-widest text-accent-beige leading-relaxed">
                  Certificat d'authenticité inclus & Garantie à vie
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Checkout;
