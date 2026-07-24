import { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { promoModalsApi } from '@/services/api/promoModals';
import { PromoModalDTO } from '@/types/promo-modals';
import { getImageUrl } from '@/services/api/upload';
import { Button } from '@/components/ui/button';

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [promoData, setPromoData] = useState<PromoModalDTO | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;

    const hasSeenModal = sessionStorage.getItem('hasSeenPromoModal');
    if (!hasSeenModal) {
      const fetchPromoData = async () => {
        try {
          const data = await promoModalsApi.getActivePromoModal();

          if (data && data.isActive) {
            setPromoData(data);
            setCountdown(data.autoCloseSeconds || 5);

            const timer = setTimeout(() => {
              setIsOpen(true);
              startCountdown(data.autoCloseSeconds || 5);
            }, 1500);
            return () => clearTimeout(timer);
          }
        } catch (error) {
          console.error('❌ PromoModal: Erreur lors de la récupération des données:', error);
        }
      };

      fetchPromoData();
    }
  }, [location.pathname]);

  const startCountdown = (seconds: number) => {
    let remainingSeconds = seconds;
    setCountdown(remainingSeconds);

    countdownRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setCountdown(remainingSeconds);

      if (remainingSeconds <= 0) {
        handleClose();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const handleClose = () => {
    stopCountdown();
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPromoModal', 'true');
  };

  const handleViewCollection = () => {
    handleClose();
    if (promoData?.buttonUrl) {
      navigate(promoData.buttonUrl);
    }
  };

  if (!isOpen || !promoData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary-dark/50 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-elegant md:flex-row"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 flex flex-col items-center gap-0.5 rounded-xl bg-card/90 p-2 text-muted-foreground shadow-soft transition-colors hover:bg-muted hover:text-foreground md:right-4 md:top-4"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
          <span className="font-mono text-[10px] text-primary">{countdown}s</span>
        </button>

        <div className="relative hidden min-h-[420px] w-1/2 md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: promoData.imageUrl ? `url('${getImageUrl(promoData.imageUrl)}')` : undefined,
              backgroundColor: promoData.imageUrl ? undefined : 'hsl(var(--primary) / 0.12)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/90" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="relative flex w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 p-8 text-center sm:p-10 md:w-1/2 md:p-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-sky/20 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10">
            <div className="mb-5 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                <Sparkles className="h-6 w-6" aria-hidden />
              </span>
            </div>

            <h2
              id="promo-modal-title"
              className="mb-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {promoData.title}
            </h2>

            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Offre Troco · fermeture dans {countdown}s
            </p>

            <div className="mx-auto mb-6 h-px w-12 bg-primary/40" />

            <p className="mx-auto mb-8 max-w-sm text-base leading-relaxed text-muted-foreground">
              {promoData.description}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                onClick={handleViewCollection}
                className="w-full rounded-xl uppercase tracking-widest"
              >
                {promoData.buttonText}
              </Button>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Continuer sans cette offre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
