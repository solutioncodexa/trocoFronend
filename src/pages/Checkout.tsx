import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, Banknote, CheckCircle, Verified, Tag, X, Loader2, ArrowRight, Sparkles, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { PaymentMethod } from '@/types/product';
import { ordersApi, productsApi, shippingApi, loyaltyApi } from '@/services/api';
import { platformApi, submitCmiCheckout } from '@/services/api/platform';
import {
  StripeCardSection,
  confirmStripePaymentMethod,
} from '@/components/payments/StripeCardSection';
import {
  CmiPaymentSection,
  clearCmiPending,
  confirmCmiCardDetails,
  readCmiPending,
  saveCmiPending,
} from '@/components/payments/CmiPaymentSection';
import type { CmiCheckoutDTO } from '@/types/api';
import { promoCodesApi } from '@/services/api/promoCodes';
import { abandonedCartsApi } from '@/services/api/abandonedCarts';
import { OrderDTO, CartItemDTO } from '@/types/api';
import { DiscountType } from '@/types/promo-codes';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useTenant } from '@/contexts/TenantContext';
import { getOrCreateCartSessionKey } from '@/utils/cartSession';
import { cartItemsToCapturePayload } from '@/utils/abandonedCartItems';
import { trackPurchase } from '@/components/storefront/TrackingPixels';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import ProductCard from '@/components/ui/ProductCard';
import { useLocale } from '@/contexts/LocaleContext';
import { useStoreAppearance } from '@/hooks/useStoreAppearance';
import { useStorefrontTheme } from '@/hooks/useStorefrontTheme';
import { checkoutCtaClass } from '@/config/storeAppearance';
import type { ShippingCarrierDTO } from '@/types/api';
import { cn } from '@/lib/utils';

function etaLabel(carrier: ShippingCarrierDTO): string | null {
  const min = carrier.etaDaysMin;
  const max = carrier.etaDaysMax;
  if (min != null && max != null && min !== max) return `${min}–${max} jours ouvrés`;
  if (min != null) return `${min} jour(s) ouvrés`;
  if (max != null) return `${max} jour(s) ouvrés`;
  return null;
}

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  description: string;
  badge?: string;
  icon: ReactNode;
  accentClass: string;
};

function paymentSubmitLabel(method: PaymentMethod): string {
  switch (method) {
    case 'card_stripe':
      return 'Payer par carte (Stripe)';
    case 'card_cmi':
      return 'Payer par carte';
    case 'paypal':
      return 'Continuer vers PayPal';
    case 'bnpl':
      return 'Continuer le paiement échelonné';
    default:
      return 'Confirmer la commande';
  }
}

function paymentConfirmCopy(method: PaymentMethod): { title: string; body: string } {
  switch (method) {
    case 'card_stripe':
      return {
        title: 'Paiement par carte',
        body: 'Saisissez vos infos carte ci-dessus. La commande n’est créée qu’après paiement réussi.',
      };
    case 'card_cmi':
      return {
        title: 'Paiement par carte',
        body: 'Saisissez vos infos carte ci-dessus. La commande n’est créée qu’après paiement réussi.',
      };
    case 'paypal':
      return {
        title: 'Redirection PayPal',
        body: 'Vous serez redirigé vers PayPal pour approuver le paiement, puis ramené automatiquement vers la boutique.',
      };
    case 'bnpl':
      return {
        title: 'Paiement en plusieurs fois',
        body: 'Après validation, notre équipe vous contactera pour finaliser le paiement échelonné.',
      };
    default:
      return {
        title: 'Confirmation immédiate',
        body: 'En cliquant sur confirmer, votre commande sera enregistrée. Notre service client vous contactera par téléphone pour confirmer la livraison.',
      };
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    items,
    getTotal,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();
  const { freeShippingThreshold: brandFreeShipping } = useStoreBrand();
  const { store } = useTenant();
  const { formatPrice: formatStorePrice, t } = useLocale();
  const theme = useStorefrontTheme();
  const appearance = useStoreAppearance();
  const subtotal = getTotal();
  const cmiReturnHandled = useRef(false);
  const [cmiSession, setCmiSession] = useState<CmiCheckoutDTO | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const stepsMode = appearance.checkoutLayout === 'steps';
  const summaryPos = appearance.checkoutSummaryPosition;
  const checkoutDense = appearance.checkoutDensity;
  const formPad =
    checkoutDense === 'compact'
      ? 'space-y-5 p-5 md:p-6'
      : checkoutDense === 'spacious'
        ? 'space-y-10 p-8 md:p-12'
        : 'space-y-8 p-8 md:p-10';
  const formChrome =
    appearance.checkoutFormStyle === 'flat'
      ? 'bg-transparent shadow-none border-0'
      : appearance.checkoutFormStyle === 'bordered'
        ? 'border-2 border-border bg-card shadow-none'
        : cn('shadow-card', theme.pagePanel);
  const mainGap =
    checkoutDense === 'compact' ? 'gap-8' : checkoutDense === 'spacious' ? 'gap-20' : 'gap-16';
  const headingAlign =
    appearance.checkoutHeadingAlign === 'center' ? 'text-center' : 'text-center lg:text-left';

  const { data: checkoutStore } = useQuery({
    queryKey: ['store-checkout', store?.slug],
    queryFn: () => platformApi.getStoreCheckout(store?.slug ?? undefined),
    enabled: !!store?.slug,
    staleTime: 60_000,
  });
  const freeShippingThreshold =
    checkoutStore?.freeShippingThreshold != null && Number(checkoutStore.freeShippingThreshold) > 0
      ? Number(checkoutStore.freeShippingThreshold)
      : brandFreeShipping;

  const firstCartProductId = items[0]?.product.id;
  const { data: checkoutUpsell = [] } = useQuery({
    queryKey: ['frequently-bought-checkout', firstCartProductId],
    queryFn: () => productsApi.frequentlyBought(firstCartProductId!, 4),
    enabled: !!firstCartProductId,
    staleTime: 5 * 60 * 1000,
  });
  const upsellProducts = mapProductListItemListToProducts(checkoutUpsell)
    .filter((p) => !items.some((i) => i.product.id === p.id))
    .slice(0, 3);

  const { data: promoSuggestions = [] } = useQuery({
    queryKey: ['promo-suggestions', subtotal],
    queryFn: () => promoCodesApi.getSuggestions(subtotal),
    enabled: subtotal > 0,
    staleTime: 30_000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [selectedCarrierCode, setSelectedCarrierCode] = useState<string | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountType: DiscountType;
    discountValue: number;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async (codeOverride?: string) => {
    const code = (codeOverride ?? promoCodeInput).trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await promoCodesApi.validate(code, getTotal());
      if (res.valid && res.discountType && res.discountValue) {
        setAppliedPromo({
          code: res.code ?? code,
          discountType: res.discountType,
          discountValue: res.discountValue,
        });
        toast.success('Code promo appliqué !');
      } else {
        setPromoError(res.message || 'Code invalide');
      }
    } catch {
      setPromoError('Erreur lors de la vérification');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = getTotal();
    if (appliedPromo.discountType === 'percentage') {
      return Math.round(subtotal * (appliedPromo.discountValue / 100));
    }
    return Math.min(appliedPromo.discountValue, subtotal);
  };

  const discount = calculateDiscount();
  const afterDiscount = subtotal - discount;

  const { data: carriers = [] } = useQuery({
    queryKey: ['shipping-carriers-public', afterDiscount],
    queryFn: () => shippingApi.getPublic(afterDiscount),
    enabled: afterDiscount >= 0,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!carriers.length) return;
    setSelectedCarrierCode((prev) => {
      if (prev && carriers.some((c) => c.code === prev)) return prev;
      const def = checkoutStore?.shippingDefaultCarrier?.trim();
      if (def && carriers.some((c) => c.code === def)) return def;
      return carriers[0]?.code ?? null;
    });
  }, [carriers, checkoutStore?.shippingDefaultCarrier]);

  const selectedCarrier = carriers.find((c) => c.code === selectedCarrierCode) ?? null;
  const shippingFee =
    selectedCarrier?.quotedFee != null
      ? Number(selectedCarrier.quotedFee)
      : afterDiscount >= freeShippingThreshold
        ? 0
        : 50;

  const phoneForLoyalty = formData.phone.trim();
  const { data: loyaltyBalance } = useQuery({
    queryKey: ['loyalty-balance', phoneForLoyalty],
    queryFn: () => loyaltyApi.getBalance(phoneForLoyalty),
    enabled: !!checkoutStore?.loyaltyEnabled && phoneForLoyalty.length >= 8,
    staleTime: 30_000,
  });

  const codEnabled = checkoutStore?.paymentCodEnabled !== false;
  const stripeReady = !!checkoutStore?.stripeReady;
  const paypalReady = !!checkoutStore?.paypalReady;
  /** Uniquement si clés + test réussis (pas le simple toggle). */
  const cmiEnabled = !!checkoutStore?.cmiReady;
  const bnplEnabled = !!checkoutStore?.paymentBnplEnabled;
  const paymentOptionsAvailable =
    codEnabled || cmiEnabled || bnplEnabled || stripeReady || paypalReady;

  useEffect(() => {
    const options: PaymentMethod[] = [];
    if (codEnabled) options.push('cash_on_delivery');
    if (stripeReady) options.push('card_stripe');
    if (cmiEnabled) options.push('card_cmi');
    if (paypalReady) options.push('paypal');
    if (bnplEnabled) options.push('bnpl');
    if (options.length && !options.includes(paymentMethod)) {
      setPaymentMethod(options[0]);
    }
  }, [codEnabled, cmiEnabled, bnplEnabled, stripeReady, paypalReady, paymentMethod]);

  const loyaltyRedeemNum = (() => {
    const n = Number(loyaltyPointsToRedeem.trim());
    if (!Number.isFinite(n) || n <= 0) return 0;
    const maxPts = loyaltyBalance?.points ?? 0;
    return Math.min(Math.floor(n), maxPts);
  })();

  const total = afterDiscount + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (!checkoutStore?.abandonedCartEnabled) return;
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    if (!email && !phone) return;
    if (items.length === 0) return;

    const timer = window.setTimeout(() => {
      void abandonedCartsApi
        .capture({
          sessionKey: getOrCreateCartSessionKey(),
          customerEmail: email || undefined,
          customerPhone: phone || undefined,
          customerName: formData.fullName.trim() || undefined,
          items: cartItemsToCapturePayload(items),
          cartTotal: getTotal(),
        })
        .catch(() => {
          /* silencieux — relance optionnelle */
        });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [
    checkoutStore?.abandonedCartEnabled,
    formData.email,
    formData.phone,
    formData.fullName,
    items,
    getTotal,
  ]);

  // Succès commande uniquement après POST /orders réussi (await).
  const finalizeOrder = async (orderData: OrderDTO) => {
    await ordersApi.createOrder(orderData);
    setIsSubmitting(false);
    setIsSuccess(true);
    setCmiSession(null);
    clearCmiPending();
    clearCart();
    toast.success('Commande créée avec succès!');
    void abandonedCartsApi.markRecovered(getOrCreateCartSessionKey()).catch(() => {});
    trackPurchase({ value: orderData.total, currency: 'MAD' });
  };

  const fallbackCmiRedirect = useCallback((checkout: CmiCheckoutDTO) => {
    setCmiSession(null);
    submitCmiCheckout(checkout);
  }, []);

  // Retour CMI (ok/fail) — commande créée uniquement après succès.
  useEffect(() => {
    const status = searchParams.get('cmi');
    if (!status || cmiReturnHandled.current) return;
    cmiReturnHandled.current = true;

    const cleanParams = () => {
      const next = new URLSearchParams(searchParams);
      next.delete('cmi');
      setSearchParams(next, { replace: true });
    };

    if (status === 'fail') {
      clearCmiPending();
      setCmiSession(null);
      setIsSubmitting(false);
      toast.error('Paiement CMI annulé ou échoué.');
      cleanParams();
      return;
    }

    if (status !== 'ok') {
      cleanParams();
      return;
    }

    const pending = readCmiPending();
    if (!pending?.draft) {
      toast.error('Session de paiement introuvable. Réessayez votre commande.');
      cleanParams();
      return;
    }

    clearCmiPending();
    setIsSubmitting(true);
    setPaymentMethod('card_cmi');
    void (async () => {
      try {
        await finalizeOrder({ ...pending.draft, paymentMethod: 'card_cmi' });
      } catch (err) {
        setIsSubmitting(false);
        toastError(err, 'Erreur lors de la création de la commande');
      } finally {
        cleanParams();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on return URL
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setIsSubmitting(true);
    const discount = calculateDiscount();
    const afterDiscountSubmit = getTotal() - discount;

    const cartItems: CartItemDTO[] = items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        weight: item.product.weight ?? 0,
        images: item.product.images?.slice(0, 1),
        sku: item.product.sku,
      },
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedVariantId: item.selectedVariantId,
      customLogoUrl: item.customLogoUrl,
    }));

    const orderTotal = afterDiscountSubmit + shippingFee;

    const baseOrder: OrderDTO = {
      id: '',
      items: cartItems,
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email.trim() || undefined,
        address: formData.address,
        city: formData.city,
      },
      total: orderTotal,
      paymentMethod,
      status: 'new',
      createdAt: new Date().toISOString(),
      shippingFee,
      carrierCode: selectedCarrierCode ?? undefined,
      ...(loyaltyRedeemNum > 0 && checkoutStore?.loyaltyEnabled
        ? { loyaltyPointsToRedeem: loyaltyRedeemNum }
        : {}),
      ...(appliedPromo && {
        promoCode: appliedPromo.code,
        discount,
      }),
    };

    try {
      if (paymentMethod === 'card_stripe') {
        if (!checkoutStore?.stripePublishableKey?.trim()) {
          throw new Error('Clé Stripe publique manquante. Configurez Stripe dans Paramètres → Paiements.');
        }
        const paymentMethodId = await confirmStripePaymentMethod();
        if (!paymentMethodId) {
          setIsSubmitting(false);
          return;
        }
        const cents = Math.round(orderTotal * 100);
        const charge = await platformApi.chargeStoreStripe({
          paymentMethodId,
          amountCents: cents,
          currency: (store?.currency || 'mad').toLowerCase(),
          description: `Commande ${formData.fullName}`,
        });
        if (charge?.status !== 'succeeded' || !charge.paymentIntentId) {
          throw new Error('Le paiement Stripe n’a pas abouti.');
        }
        await finalizeOrder({ ...baseOrder, paymentMethod: 'card_stripe' });
        return;
      }

      if (paymentMethod === 'paypal') {
        const paypal = await platformApi.createStorePaypalOrder({
          amount: orderTotal,
          currency: (store?.currency || 'MAD').toUpperCase(),
          description: `Commande ${formData.fullName}`,
        });
        if (paypal.approveUrl) {
          sessionStorage.setItem(
            'troco_paypal_pending',
            JSON.stringify({
              orderId: paypal.orderId,
              draft: baseOrder,
            }),
          );
          window.location.href = paypal.approveUrl;
          return;
        }
        await platformApi.captureStorePaypalOrder(paypal.orderId);
        await finalizeOrder({ ...baseOrder, paymentMethod: 'paypal' });
        return;
      }

      if (paymentMethod === 'card_cmi') {
        const card = confirmCmiCardDetails();
        if (!card) {
          setIsSubmitting(false);
          return;
        }

        // Carte test 4242… — confirme sans gateway (comme le mock Grammar).
        if (card.isTestCard) {
          await finalizeOrder({ ...baseOrder, paymentMethod: 'card_cmi' });
          return;
        }

        const origin = window.location.origin;
        const cmi = await platformApi.initStoreCmiCheckout({
          amount: orderTotal,
          currency: store?.currency || 'MAD',
          description: `Commande ${formData.fullName}`,
          okUrl: `${origin}/cmi-return.html?status=ok`,
          failUrl: `${origin}/cmi-return.html?status=fail`,
        });
        saveCmiPending(cmi.oid, { ...baseOrder, paymentMethod: 'card_cmi' });
        setCmiSession(cmi);
        setIsSubmitting(false);
        return;
      }

      await finalizeOrder(baseOrder);
    } catch (err) {
      setIsSubmitting(false);
      toastError(err, 'Erreur lors du paiement');
    }
  };

  const paymentLabel =
    paymentMethod === 'card_cmi'
      ? t('payCard')
      : paymentMethod === 'card_stripe'
        ? 'Carte (Stripe)'
        : paymentMethod === 'paypal'
          ? 'PayPal'
          : paymentMethod === 'bnpl'
            ? t('payBnpl')
            : t('payCod');

  const cmiReturnStatus = searchParams.get('cmi');
  const awaitingCmiReturn = cmiReturnStatus === 'ok' || cmiReturnStatus === 'fail';

  const confirmCopy = paymentConfirmCopy(paymentMethod);
  const submitLabel =
    appearance.checkoutCtaLabel?.trim() || paymentSubmitLabel(paymentMethod);

  const paymentOptions: PaymentOption[] = [
    ...(codEnabled
      ? [
          {
            id: 'cash_on_delivery' as const,
            title: t('payCod'),
            description: 'Payez en espèces à la réception',
            badge: 'Sans carte',
            icon: <Banknote className="size-5" aria-hidden />,
            accentClass: 'text-emerald-700 bg-emerald-50',
          },
        ]
      : []),
    ...(stripeReady
      ? [
          {
            id: 'card_stripe' as const,
            title: 'Carte · Stripe',
            description: 'Visa, Mastercard — paiement sécurisé international',
            badge: 'En ligne',
            icon: <CreditCard className="size-5" aria-hidden />,
            accentClass: 'text-indigo-700 bg-indigo-50',
          },
        ]
      : []),
    ...(cmiEnabled
      ? [
          {
            id: 'card_cmi' as const,
            title: 'Carte · CMI',
            description: 'Visa, Mastercard — paiement sécurisé marocain',
            badge: 'En ligne',
            icon: <ShieldCheck className="size-5" aria-hidden />,
            accentClass: 'text-sky-700 bg-sky-50',
          },
        ]
      : []),
    ...(paypalReady
      ? [
          {
            id: 'paypal' as const,
            title: 'PayPal',
            description: 'Compte PayPal ou carte via PayPal',
            badge: 'Redirection',
            icon: (
              <span className="text-[11px] font-black tracking-tight text-[#003087]" aria-hidden>
                PP
              </span>
            ),
            accentClass: 'text-[#003087] bg-[#FFC439]/25',
          },
        ]
      : []),
    ...(bnplEnabled
      ? [
          {
            id: 'bnpl' as const,
            title: t('payBnpl'),
            description: checkoutStore?.bnplProvider || 'Paiement en plusieurs fois',
            badge: 'Échelonné',
            icon: <CreditCard className="size-5" aria-hidden />,
            accentClass: 'text-amber-800 bg-amber-50',
          },
        ]
      : []),
  ];

  if (items.length === 0 && !isSuccess && !awaitingCmiReturn && !cmiSession) {
    navigate('/panier');
    return null;
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl mb-4">Commande Confirmée!</h1>
          <p className="font-body text-muted-foreground mb-8">
            Merci pour votre commande, {formData.fullName}!
            {` Nous vous contacterons au ${formData.phone} pour confirmer la livraison.`}
          </p>
          <div className="bg-card border border-border rounded-2xl shadow-soft p-6 mb-8 text-left">
            <h3 className="font-display text-lg mb-4">Détails de livraison</h3>
            <div className="space-y-2 font-body text-sm">
              <p>
                <span className="text-muted-foreground">Nom:</span> {formData.fullName}
              </p>
              <p>
                <span className="text-muted-foreground">Téléphone:</span> {formData.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Adresse:</span> {formData.address}
              </p>
              <p>
                <span className="text-muted-foreground">Ville:</span> {formData.city}
              </p>
              <p>
                <span className="text-muted-foreground">Paiement:</span> {paymentLabel}
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="font-body uppercase tracking-wider rounded-2xl">
            <Link to="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className={cn('max-w-[1280px] mx-auto px-6 py-12 animate-fade-in', theme.shell)}>
        <div
          className={cn(
            'flex',
            summaryPos === 'bottom' ? 'flex-col gap-10' : cn('flex-col lg:flex-row', mainGap),
            summaryPos === 'left' && 'lg:flex-row-reverse',
          )}
        >
          {/* Left Column - Form */}
          <div className={cn('flex-1', summaryPos !== 'bottom' && 'max-w-2xl')}>
            <div className={cn('mb-10', headingAlign)}>
              <h2 className="text-3xl font-display text-foreground mb-2">Validation de votre Commande</h2>
              <p className="text-primary font-display text-3xl">
                {paymentLabel}
              </p>
              {stepsMode ? (
                <div
                  className={cn(
                    'mt-6 flex items-center gap-2',
                    appearance.checkoutHeadingAlign === 'center' && 'mx-auto max-w-md',
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                      checkoutStep === 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                    onClick={() => setCheckoutStep(1)}
                  >
                    1 · Livraison
                  </button>
                  <div className="h-px flex-1 bg-border" />
                  <button
                    type="button"
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                      checkoutStep === 2
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                    onClick={() => setCheckoutStep(2)}
                  >
                    2 · Paiement
                  </button>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className={cn(formPad, formChrome, 'rounded-2xl')}>
              <div
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 gap-6',
                  stepsMode && checkoutStep !== 1 && 'hidden',
                )}
              >
                <div className="col-span-full md:col-span-1">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="fullname">Nom Complet</Label>
                  <Input 
                    id="fullname"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Jean Dupont" 
                    className="rounded-xl"
                    required 
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6..." 
                    className="rounded-xl"
                    required 
                  />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="email">Email (optionnel)</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vous@exemple.ma" 
                    className="rounded-xl"
                  />
                </div>
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="address">Adresse de livraison</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rue, n° d'appartement..." 
                    className="rounded-xl"
                    required 
                  />
                </div>
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="city">Ville</Label>
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Casablanca" 
                    className="rounded-xl"
                    required 
                  />
                </div>
                {appearance.checkoutShowNotes ? (
                <div className="col-span-full">
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold" htmlFor="notes">Notes de commande (Optionnel)</Label>
                  <textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Précisions pour le livreur..." 
                    rows={3}
                    className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-soft placeholder:text-muted-foreground/80 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary transition-colors resize-none" 
                  />
                </div>
                ) : null}
              </div>

              {carriers.length > 0 ? (
                <div className={cn(stepsMode && checkoutStep !== 1 && 'hidden')}>
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                    {t('shipping')} *
                  </Label>
                  <div className="space-y-3">
                    {carriers.map((carrier) => {
                      const fee =
                        carrier.quotedFee != null
                          ? Number(carrier.quotedFee)
                          : shippingFee;
                      const eta = etaLabel(carrier);
                      return (
                        <div
                          key={carrier.code}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedCarrierCode === carrier.code ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                          onClick={() => setSelectedCarrierCode(carrier.code)}
                        >
                          <div
                            className={`mt-1 w-4 h-4 rounded-full border-2 shrink-0 ${selectedCarrierCode === carrier.code ? 'border-primary bg-primary' : 'border-border'} flex items-center justify-center`}
                          >
                            {selectedCarrierCode === carrier.code && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium">{carrier.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {fee === 0 ? t('freeShipping') : formatStorePrice(fee)}
                              {eta ? ` · ${eta}` : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {checkoutStore?.loyaltyEnabled ? (
                <div className={cn(stepsMode && checkoutStep !== 1 && 'hidden')}>
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                    {t('loyaltyPoints')}
                  </Label>
                  {phoneForLoyalty.length >= 8 ? (
                    <p className="text-xs text-muted-foreground mb-2">
                      Solde :{' '}
                      <span className="font-semibold text-foreground">
                        {loyaltyBalance?.points ?? 0} pts
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-2">
                      Saisissez votre téléphone pour consulter vos points.
                    </p>
                  )}
                  <Input
                    type="number"
                    min={0}
                    max={loyaltyBalance?.points ?? undefined}
                    value={loyaltyPointsToRedeem}
                    onChange={(e) => setLoyaltyPointsToRedeem(e.target.value)}
                    placeholder="Points à utiliser (optionnel)"
                    className="rounded-xl"
                    disabled={!loyaltyBalance?.points}
                  />
                </div>
              ) : null}

              {stepsMode && checkoutStep === 1 ? (
                <Button
                  type="button"
                  className="w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wider"
                  onClick={() => setCheckoutStep(2)}
                >
                  Continuer vers le paiement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}

              {/* Mode de paiement */}
              <div className={cn(stepsMode && checkoutStep !== 2 && 'hidden')}>
                <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                  Mode de paiement *
                </Label>
                {!paymentOptionsAvailable ? (
                  <p className="rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    Aucun mode de paiement n’est activé pour cette boutique. Contactez le vendeur ou réessayez plus tard.
                  </p>
                ) : (
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className={cn(
                      'grid gap-3',
                      appearance.checkoutPaymentStyle === 'compact' && 'grid-cols-1 sm:grid-cols-2 gap-2',
                      appearance.checkoutPaymentStyle === 'list' && 'gap-2',
                    )}
                    aria-label="Choisir un mode de paiement"
                  >
                    {paymentOptions.map((opt) => {
                      const selected = paymentMethod === opt.id;
                      const payStyle = appearance.checkoutPaymentStyle;
                      return (
                        <label
                          key={opt.id}
                          htmlFor={`pay-${opt.id}`}
                          className={cn(
                            'relative flex cursor-pointer items-start gap-3 transition-all',
                            payStyle === 'compact'
                              ? 'rounded-lg border p-3'
                              : payStyle === 'list'
                                ? 'rounded-lg border px-3 py-2.5'
                                : 'rounded-xl border-2 p-4',
                            selected
                              ? 'border-primary bg-primary/[0.06] shadow-sm'
                              : 'border-border hover:border-primary/40 hover:bg-muted/30',
                          )}
                        >
                          <RadioGroupItem
                            id={`pay-${opt.id}`}
                            value={opt.id}
                            className="mt-1 shrink-0"
                          />
                          {payStyle !== 'list' ? (
                          <div
                            className={cn(
                              'mt-0.5 flex shrink-0 items-center justify-center rounded-lg',
                              payStyle === 'compact' ? 'size-8' : 'size-10',
                              opt.accentClass,
                            )}
                          >
                            {opt.icon}
                          </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={cn('font-semibold text-foreground', payStyle === 'compact' && 'text-sm')}>
                                {opt.title}
                              </span>
                              {opt.badge ? (
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                  {opt.badge}
                                </span>
                              ) : null}
                            </div>
                            {payStyle !== 'compact' ? (
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {opt.description}
                            </p>
                            ) : null}
                          </div>
                          {selected ? (
                            <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                          ) : null}
                        </label>
                      );
                    })}
                  </RadioGroup>
                )}

                {paymentMethod === 'card_stripe' && stripeReady ? (
                  <div className="mt-4">
                    {checkoutStore?.stripePublishableKey?.trim() ? (
                      <StripeCardSection
                        publishableKey={checkoutStore.stripePublishableKey.trim()}
                        onError={(msg) => toast.error(msg)}
                      />
                    ) : (
                      <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        Clé Stripe publique absente. Ajoutez-la dans Paramètres → Paiements, puis
                        « Tester & activer ».
                      </p>
                    )}
                  </div>
                ) : null}

                {paymentMethod === 'card_cmi' && cmiEnabled ? (
                  <div className="mt-4">
                    <CmiPaymentSection
                      session={cmiSession}
                      onCloseSession={() => {
                        setCmiSession(null);
                        clearCmiPending();
                        setIsSubmitting(false);
                      }}
                      onFallbackRedirect={fallbackCmiRedirect}
                      onError={(msg) => toast.error(msg)}
                    />
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  'flex items-center justify-center py-4',
                  stepsMode && checkoutStep !== 2 && 'hidden',
                )}
              >
                <div className="w-full h-px bg-border"></div>
                <div className="mx-4 size-2 rotate-45 border border-border bg-card"></div>
                <div className="w-full h-px bg-border"></div>
              </div>

              <div
                className={cn(
                  'bg-muted/40 p-4 border border-border rounded-xl',
                  stepsMode && checkoutStep !== 2 && 'hidden',
                )}
              >
                <div className="flex gap-4 items-start">
                  <Verified className="text-primary shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-1">
                      {confirmCopy.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{confirmCopy.body}</p>
                  </div>
                </div>
              </div>

              <div className={cn(stepsMode && checkoutStep !== 2 && 'hidden')}>
                <Button
                  type="submit"
                  className={checkoutCtaClass(appearance.checkoutCtaEmphasis)}
                  disabled={isSubmitting || !paymentOptionsAvailable}
                >
                  <CheckCircle className="size-5 shrink-0 justify-self-start sm:size-[1.35rem]" aria-hidden />
                  <span className="min-w-0 text-center text-balance">
                    {isSubmitting ? 'Traitement en cours…' : submitLabel}
                  </span>
                </Button>
                {appearance.checkoutShowTrustBadges ? (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Paiement sécurisé
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-primary" /> Livraison suivie
                    </span>
                  </div>
                ) : null}
                {stepsMode ? (
                  <button
                    type="button"
                    className="mt-3 w-full text-center text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
                    onClick={() => setCheckoutStep(1)}
                  >
                    ← Retour livraison
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div
            className={cn(
              'w-full',
              summaryPos === 'bottom' ? 'max-w-2xl' : 'lg:w-[400px]',
            )}
          >
            <div
              className={cn(
                'bg-card border border-border rounded-2xl shadow-card',
                checkoutDense === 'compact' ? 'p-5' : checkoutDense === 'spacious' ? 'p-10' : 'p-8',
                appearance.checkoutStickySummary && summaryPos !== 'bottom' && 'sticky top-24',
              )}
            >
              <h3 className="text-xl font-display text-foreground mb-6 border-b border-border pb-4 uppercase tracking-widest text-sm font-bold">Résumé du Panier</h3>
              
              <div className="space-y-6 mb-8">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedSize ?? ''}-${index}`} className="flex gap-4">
                    <div className="size-20 bg-muted border border-border overflow-hidden rounded-xl flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold font-display text-foreground leading-tight">{item.product.name}</h4>
                        {item.product.category && (
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                            {item.product.category}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-muted-foreground">Qté: {item.quantity}</span>
                        <span className="text-sm font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              {appearance.checkoutShowPromoField ? (
              <div className="border-t border-border pt-6 mb-4">
                <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                  Code Promo
                </Label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-mono font-bold text-sm text-green-700 dark:text-green-400">
                        {appliedPromo.code}
                      </span>
                      <span className="text-xs text-green-600">
                        (−{appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}%` : formatPrice(appliedPromo.discountValue)})
                      </span>
                    </div>
                    <button onClick={removePromo} className="text-green-600 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      placeholder="Entrez votre code"
                      className="font-mono uppercase rounded-xl"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleApplyPromo()}
                      disabled={promoLoading || !promoCodeInput.trim()}
                      className="rounded-xl shrink-0"
                    >
                      {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Appliquer'}
                    </Button>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-destructive mt-1.5">{promoError}</p>
                )}
              </div>
              ) : null}

              {/* Promo suggestions — AliExpress style */}
              {appearance.checkoutShowPromoField && promoSuggestions.length > 0 && !appliedPromo && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      Offres disponibles
                    </span>
                  </div>
                  {promoSuggestions.map((s) => (
                    <Link
                      key={s.code}
                      to="/codes-promo"
                      className={`block rounded-xl border px-3 py-2.5 transition-all hover:shadow-card ${
                        s.qualified
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {s.qualified ? (
                            <p className="text-xs font-bold text-green-700 dark:text-green-400">
                              🎉 Vous bénéficiez de{' '}
                              {s.discountType === 'percentage'
                                ? `${s.discountValue}%`
                                : `${s.discountValue} DH`}{' '}
                              de réduction !
                            </p>
                          ) : (
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              <span className="font-bold">
                                Plus que {formatPrice(s.amountNeeded)}
                              </span>{' '}
                              pour obtenir{' '}
                              <span className="font-bold">
                                {s.discountType === 'percentage'
                                  ? `${s.discountValue}%`
                                  : `${formatPrice(s.discountValue)}`}
                              </span>{' '}
                              de réduction
                            </p>
                          )}
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${
                          s.qualified ? 'text-green-600' : 'text-amber-500'
                        }`} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground uppercase tracking-wider">Sous-total</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 uppercase tracking-wider">Réduction</span>
                    <span className="text-green-600 font-medium">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground uppercase tracking-wider">Livraison</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-medium' : 'text-foreground'}>
                    {shippingFee === 0 ? 'Offerte' : formatStorePrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                  <span className="text-base font-bold uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatStorePrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 py-4 border-y border-border/60">
                <Verified className="text-primary text-xl" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed">
                  Certificat d'authenticité inclus & Garantie à vie
                </p>
              </div>

              {upsellProducts.length > 0 && (
                <div className="mt-6 pt-2 border-t border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
                    Souvent achetés ensemble
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {upsellProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Checkout;
