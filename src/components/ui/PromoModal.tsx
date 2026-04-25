import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { promoModalsApi } from '@/services/api/promoModals';
import { PromoModalDTO } from '@/types/promo-modals';
import { getImageUrl } from '@/services/api/upload';

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [promoData, setPromoData] = useState<PromoModalDTO | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // N'afficher que sur la page d'accueil
    if (location.pathname !== '/') return;
    
    // Vérifier si le modal a déjà été montré dans cette session
    const hasSeenModal = sessionStorage.getItem('hasSeenPromoModal');
    if (!hasSeenModal) {
      // Récupérer les données depuis l'API
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
    // Marquer que l'utilisateur a vu le modal dans cette session
    sessionStorage.setItem('hasSeenPromoModal', 'true');
  };

  const handleViewCollection = () => {
    handleClose();
    // Rediriger vers l'URL du bouton
    if (promoData?.buttonUrl) {
      navigate(promoData.buttonUrl);
    }
  };

  if (!isOpen || !promoData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative bg-charcoal max-w-4xl w-full flex flex-col md:flex-row shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-primary/40 rounded-sm overflow-hidden">
        {/* Bouton fermer avec countdown */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-primary hover:text-white transition-colors flex flex-col items-center gap-1"
        >
          <X className="w-6 h-6" />
          <span className="text-xs font-mono">{countdown}s</span>
        </button>

        {/* Image côté gauche */}
        <div className="hidden md:block w-1/2 relative min-h-[550px]">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: promoData.imageUrl ? `url('${getImageUrl(promoData.imageUrl)}')` : undefined,
              backgroundColor: promoData.imageUrl ? undefined : '#1a1a1a'
            }}
            onError={(e) => {
              console.error('Error loading promo modal image:', promoData.imageUrl);
              // Fallback to solid background color if image fails to load
              e.currentTarget.style.backgroundImage = 'none';
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/20 via-transparent to-charcoal/40"></div>
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        </div>

        {/* Contenu côté droit */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center text-center relative overflow-hidden bg-charcoal">
          {/* Cadres décoratifs */}
          <div className="absolute top-4 left-4 right-4 bottom-4 border border-primary/30 pointer-events-none"></div>
          <div className="absolute top-6 left-6 right-6 bottom-6 border border-primary/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Icône */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 text-primary opacity-90">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
                </svg>
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-primary font-script text-5xl mb-6 tracking-wide">
              {promoData.title}
            </h2>
            
            {/* Compte à rebours */}
            <div className="text-accent-beige/60 text-xs uppercase tracking-[0.2em] mb-4">
              Fermeture automatique dans {countdown} secondes
            </div>
            
            {/* Ligne décorative */}
            <div className="w-12 h-px bg-primary/40 mx-auto mb-8"></div>
            
            {/* Description */}
            <p className="text-white/90 font-display text-lg mb-10 leading-relaxed max-w-xs mx-auto">
              {promoData.description}
            </p>

            {/* Boutons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleViewCollection}
                className="w-full bg-primary hover:bg-[#d9a50b] text-charcoal py-4 text-xs uppercase tracking-[0.3em] font-bold transition-all shadow-[0_4px_20px_rgba(242,185,13,0.3)] border border-primary/50"
              >
                {promoData.buttonText}
              </button>
              
              <p className="text-[10px] text-accent-beige uppercase tracking-[0.2em] font-medium mt-4">
                Excellence & Prestige depuis 1952
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
