import { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CmiCheckoutDTO, OrderDTO } from '@/types/api';
import { submitCmiCheckout } from '@/services/api/platform';
import { cn } from '@/lib/utils';

export const CMI_IFRAME_NAME = 'troco_cmi_frame';
export const CMI_PENDING_KEY = 'troco_cmi_pending';

/** Carte test acceptée sans appel gateway (dev / démo). */
export const CMI_TEST_PAN = '4242424242424242';

export type CmiPendingDraft = {
  oid: string;
  draft: OrderDTO;
};

export type CmiCardDetails = {
  pan: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  /** true si carte de test 4242… */
  isTestCard: boolean;
};

export function saveCmiPending(oid: string, draft: OrderDTO): void {
  sessionStorage.setItem(CMI_PENDING_KEY, JSON.stringify({ oid, draft } satisfies CmiPendingDraft));
}

export function readCmiPending(): CmiPendingDraft | null {
  try {
    const raw = sessionStorage.getItem(CMI_PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CmiPendingDraft;
  } catch {
    return null;
  }
}

export function clearCmiPending(): void {
  sessionStorage.removeItem(CMI_PENDING_KEY);
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function formatPan(value: string): string {
  const d = digitsOnly(value).slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

interface CmiPaymentSectionProps {
  session: CmiCheckoutDTO | null;
  onCloseSession: () => void;
  onFallbackRedirect: (checkout: CmiCheckoutDTO) => void;
  onError: (message: string) => void;
}

/** Formulaire carte (test) + iframe CMI pour paiement réel. */
export function CmiPaymentSection({
  session,
  onCloseSession,
  onFallbackRedirect,
  onError,
}: CmiPaymentSectionProps) {
  const [pan, setPan] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const submittedOid = useRef<string | null>(null);

  const readCardDetails = (): CmiCardDetails | null => {
    const panDigits = digitsOnly(pan);
    const expDigits = digitsOnly(expiry);
    const cvvDigits = digitsOnly(cvv);

    if (panDigits.length < 13 || panDigits.length > 19) {
      onError('Numéro de carte invalide');
      return null;
    }
    if (expDigits.length !== 4) {
      onError('Date d’expiration invalide (MM/AA)');
      return null;
    }
    const expMonth = expDigits.slice(0, 2);
    const expYear = expDigits.slice(2, 4);
    const monthNum = Number(expMonth);
    if (monthNum < 1 || monthNum > 12) {
      onError('Mois d’expiration invalide');
      return null;
    }
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      onError('CVC invalide');
      return null;
    }

    return {
      pan: panDigits,
      expMonth,
      expYear: `20${expYear}`,
      cvv: cvvDigits,
      isTestCard: panDigits === CMI_TEST_PAN,
    };
  };

  useEffect(() => {
    (
      window as unknown as { __trocoCmiConfirmCard?: () => CmiCardDetails | null }
    ).__trocoCmiConfirmCard = readCardDetails;
    return () => {
      delete (window as unknown as { __trocoCmiConfirmCard?: () => CmiCardDetails | null })
        .__trocoCmiConfirmCard;
    };
  });

  useEffect(() => {
    if (!session) {
      submittedOid.current = null;
      return;
    }
    if (submittedOid.current === session.oid) return;
    submittedOid.current = session.oid;

    const t = window.setTimeout(() => {
      try {
        submitCmiCheckout(session, { target: CMI_IFRAME_NAME });
      } catch {
        onFallbackRedirect(session);
      }
    }, 80);

    return () => window.clearTimeout(t);
  }, [session, onFallbackRedirect]);

  return (
    <div className="space-y-3">
      {!session ? (
        <div className="space-y-3 rounded-lg border border-border bg-background p-4">
          <Input
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="Numéro de carte"
            className="rounded-lg"
            value={pan}
            onChange={(e) => setPan(formatPan(e.target.value))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              className="rounded-lg"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />
            <Input
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVC"
              className="rounded-lg"
              value={cvv}
              onChange={(e) => setCvv(digitsOnly(e.target.value).slice(0, 4))}
            />
          </div>
        </div>
      ) : null}

      {session ? (
        <div
          className={cn(
            'fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-sm',
            'sm:items-center sm:justify-center sm:p-6',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Paiement CMI"
        >
          <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden border border-border bg-card shadow-lg sm:h-[min(85vh,720px)] sm:rounded-xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                Paiement par carte
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => onFallbackRedirect(session)}
                >
                  Plein écran
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={onCloseSession}
                  aria-label="Fermer"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
            <iframe
              name={CMI_IFRAME_NAME}
              title="Paiement CMI"
              className="min-h-0 w-full flex-1 bg-white"
              sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation allow-popups"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Valide le formulaire carte CMI avant soumission. */
export function confirmCmiCardDetails(): CmiCardDetails | null {
  const fn = (
    window as unknown as { __trocoCmiConfirmCard?: () => CmiCardDetails | null }
  ).__trocoCmiConfirmCard;
  return fn ? fn() : null;
}
