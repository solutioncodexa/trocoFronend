import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ANIMATIONS } from '@/config/animations';
import { cn } from '@/lib/utils';
import HeroCategoriesRail from '@/components/home/HeroCategoriesRail';

const HeroSection = () => {
  const fade = ANIMATIONS.heroContentFadeIn;
  const ken = ANIMATIONS.heroKenBurns;
  const shine = ANIMATIONS.ctaShineOnHover;

  return (
    <section className="relative w-full min-h-[min(100dvh,820px)] h-[calc(100dvh-7rem)] max-md:min-h-[420px] max-md:h-[calc(100svh-5.5rem)] flex items-center justify-center overflow-hidden">
      {/* Fond image — Ken Burns optionnel */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform',
            ken && 'origin-center scale-105 animate-ken-burns'
          )}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Catégories (API) + visuel issu d’un produit de la catégorie — scroll horizontal sur mobile */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] pb-5 pt-2 max-md:pb-6 md:pb-8">
        <HeroCategoriesRail className="pointer-events-auto" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto flex flex-col items-center text-center px-4 pb-32 max-md:pb-36 md:pb-28">
        <span
          className={cn(
            'text-primary text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] mb-3 sm:mb-4 uppercase',
            fade ? 'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]' : 'animate-pulse'
          )}
          style={fade ? { animationDelay: '0ms' } : undefined}
        >
          Nouvelle Campagne
        </span>

        <h1
          className={cn(
            'text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-6 sm:mb-8 mix-blend-overlay opacity-90 px-2',
            fade && 'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]'
          )}
          style={fade ? { animationDelay: '90ms' } : undefined}
        >
          L&apos;ART
          <br />
          DE L&apos;OR
        </h1>

        <p
          className={cn(
            'text-white text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-lg sm:max-w-xl mx-auto font-body',
            fade && 'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]'
          )}
          style={fade ? { animationDelay: '180ms' } : undefined}
        >
          Une élégance intemporelle sculptée dans la matière pure. Découvrez notre vision de la haute joaillerie
          moderne.
        </p>

        <div
          className={cn(fade && 'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]')}
          style={fade ? { animationDelay: '260ms' } : undefined}
        >
          <Button
            asChild
            className={cn(
              'group flex items-center justify-center gap-3 overflow-hidden rounded-full h-12 sm:h-14 px-6 sm:px-8 bg-transparent border border-primary text-primary hover:bg-primary hover:text-background-dark transition-all duration-300',
              shine && 'cta-shine-hover'
            )}
          >
            <Link to="/boutique">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Découvrir Notre Collection</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
