import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

interface StripeCardSectionProps {
  publishableKey: string;
  onError: (message: string) => void;
}

function StripeCardForm({ onError }: { onError: (message: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const confirmPaymentMethod = async (): Promise<string | null> => {
    if (!stripe || !elements) {
      onError('Stripe n’est pas prêt');
      return null;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      onError('Formulaire carte introuvable');
      return null;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    if (error) {
      onError(error.message ?? 'Carte invalide');
      return null;
    }
    return paymentMethod?.id ?? null;
  };

  useEffect(() => {
    (
      window as unknown as { __trocoStripeConfirmPayment?: () => Promise<string | null> }
    ).__trocoStripeConfirmPayment = confirmPaymentMethod;
    return () => {
      delete (window as unknown as { __trocoStripeConfirmPayment?: () => Promise<string | null> })
        .__trocoStripeConfirmPayment;
    };
  });

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <CardElement
        options={{
          hidePostalCode: true,
          disableLink: true,
          style: {
            base: {
              fontSize: '16px',
              color: '#1a1a1a',
              '::placeholder': { color: '#9ca3af' },
            },
          },
        }}
      />
    </div>
  );
}

export function StripeCardSection({ publishableKey, onError }: StripeCardSectionProps) {
  const stripePromise = loadStripe(publishableKey);

  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm onError={onError} />
    </Elements>
  );
}

/** À appeler avant la soumission quand le formulaire Stripe est affiché. */
export async function confirmStripePaymentMethod(): Promise<string | null> {
  const fn = (
    window as unknown as { __trocoStripeConfirmPayment?: () => Promise<string | null> }
  ).__trocoStripeConfirmPayment;
  return fn ? fn() : null;
}
