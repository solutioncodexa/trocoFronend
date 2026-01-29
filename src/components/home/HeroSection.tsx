import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[calc(100vh-7rem)] min-h-[450px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center text-center">
        <span className="text-primary text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] mb-3 sm:mb-4 uppercase animate-pulse">
          Nouvelle Campagne
        </span>
        
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-6 sm:mb-8 mix-blend-overlay opacity-90">
          L'ART<br/>DE L'OR
        </h1>
        
        <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-lg sm:max-w-xl mx-auto font-body">
          Une élégance intemporelle sculptée dans la matière pure. Découvrez notre vision de la haute joaillerie moderne.
        </p>
        
        <Button
          asChild
          className="group flex items-center justify-center gap-3 overflow-hidden rounded-full h-12 sm:h-14 px-6 sm:px-8 bg-transparent border border-primary text-primary hover:bg-primary hover:text-background-dark transition-all duration-300"
        >
          <Link to="/boutique">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Découvrir Notre Collection</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
