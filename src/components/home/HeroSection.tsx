import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-jewelry.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(43, 70%, 47%) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-gold/5 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full font-body text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Collection 2024
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-cream leading-tight">
              L'Art de la{' '}
              <span className="text-gold-gradient italic">Bijouterie</span>{' '}
              Marocaine
            </h1>
            
            <p className="font-body text-lg md:text-xl text-cream/80 max-w-xl mx-auto lg:mx-0">
              Découvrez notre collection exclusive de bijoux en or, alliant le savoir-faire traditionnel beldi à l'élégance moderne.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-body uppercase tracking-wider text-sm px-8 py-6 hover-gold"
              >
                <Link to="/boutique">
                  Découvrir la Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-cream/30 text-cream hover:bg-cream/10 font-body uppercase tracking-wider text-sm px-8 py-6"
              >
                <Link to="/commande-personnalisee">
                  Création Sur Mesure
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-8 border-t border-cream/10">
              <div className="text-center">
                <p className="font-display text-2xl text-gold">Or 18K</p>
                <p className="font-body text-xs text-cream/60 uppercase tracking-wider">Garanti</p>
              </div>
              <div className="w-px h-10 bg-cream/20" />
              <div className="text-center">
                <p className="font-display text-2xl text-gold">Artisanal</p>
                <p className="font-body text-xs text-cream/60 uppercase tracking-wider">Fait Main</p>
              </div>
              <div className="w-px h-10 bg-cream/20" />
              <div className="text-center">
                <p className="font-display text-2xl text-gold">Livraison</p>
                <p className="font-body text-xs text-cream/60 uppercase tracking-wider">Tout le Maroc</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 float">
              <img
                src={heroImage}
                alt="Bijoux en or"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
              {/* Decorative frame */}
              <div className="absolute -inset-4 border-2 border-gold/30 rounded-2xl -z-10" />
              <div className="absolute -inset-8 border border-gold/10 rounded-3xl -z-20" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-cream rounded-xl p-6 shadow-elegant animate-fade-in">
              <p className="font-display text-3xl text-gold">500+</p>
              <p className="font-body text-sm text-charcoal">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
