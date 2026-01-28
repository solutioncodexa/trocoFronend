import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-20">
        <span className="text-primary text-sm md:text-base font-medium tracking-[0.2em] mb-4 uppercase animate-pulse">
          Nouvelle Campagne
        </span>
        
        <h1 className="text-white text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-8 mix-blend-overlay opacity-90">
          L'ART<br/>DE L'OR
        </h1>
        
        <p className="text-white text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto font-body">
          Une élégance intemporelle sculptée dans la matière pure. Découvrez notre vision de la haute joaillerie moderne.
        </p>
        
        <Button
          asChild
          className="group flex items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-8 bg-transparent border border-primary text-primary hover:bg-primary hover:text-background-dark transition-all duration-300"
        >
          <Link to="/boutique">
            <span className="text-sm font-bold uppercase tracking-widest">Découvrir Notre Collection</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
