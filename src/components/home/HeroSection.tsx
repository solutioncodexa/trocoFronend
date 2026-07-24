import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ANIMATIONS } from '@/config/animations';
import { cn } from '@/lib/utils';
import HeroCategoriesRail from '@/components/home/HeroCategoriesRail';
import { homeHeroApi } from '@/services/api/homeHero';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

/**
 * Photo packaging claire (atelier / kraft) — fond edge-to-edge,
 * lisibilité via wash clair à gauche (pas d’overlay noir “dark mode”).
 */
const DEFAULT_HERO_PHOTO =
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=2000&h=1400&fit=crop&q=85';

const SLIDE_INTERVAL_MS = 6000;

const HeroSection = () => {
  const fade = ANIMATIONS.heroContentFadeIn;
  const ken = ANIMATIONS.heroKenBurns;
  const shine = ANIMATIONS.ctaShineOnHover;

  const { data: homeHero } = useQuery({
    queryKey: ['homeHero'],
    queryFn: () => homeHeroApi.getPublic(),
    ...staticCatalogQueryOptions,
  });

  const heroPhotos = useMemo(() => {
    const list = (homeHero?.imageUrls ?? [])
      .filter(Boolean)
      .map((u) => getImageUrl(u));
    if (list.length > 0) return list;
    if (homeHero?.imageUrl) return [getImageUrl(homeHero.imageUrl)];
    return [DEFAULT_HERO_PHOTO];
  }, [homeHero]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [heroPhotos]);

  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroPhotos.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [heroPhotos]);

  return (
    <section
      className="hero-surface relative flex min-h-[min(100dvh,760px)] w-full items-end overflow-hidden max-md:min-h-[560px] md:items-center"
      aria-label="Accueil Troco"
    >
      {/* Couche 1 — atmosphère marque rose / bleu ciel */}
      <div className="absolute inset-0 bg-[hsl(340_40%_98%)]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 12% 20%, hsl(344 70% 90% / 0.95) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 88% 10%, hsl(203 60% 90% / 0.85) 0%, transparent 50%),
            radial-gradient(ellipse 60% 45% at 70% 85%, hsl(344 55% 94% / 0.7) 0%, transparent 55%),
            linear-gradient(165deg, hsl(340 40% 99%) 0%, hsl(203 35% 97%) 50%, hsl(340 30% 96%) 100%)
          `,
        }}
      />

      {/* Couche 2 — photos full-bleed (diaporama) */}
      <div className="absolute inset-0 overflow-hidden">
        {heroPhotos.map((photo, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={`${photo}-${index}`}
              className={cn(
                'absolute inset-0 bg-cover bg-no-repeat will-change-transform transition-opacity duration-[1200ms] ease-in-out',
                'bg-[position:68%_center] max-md:bg-[position:72%_30%]',
                isActive ? 'opacity-100' : 'opacity-0',
                ken && isActive && heroPhotos.length === 1 && 'origin-[70%_50%] scale-[1.06] animate-ken-burns',
              )}
              style={{ backgroundImage: `url('${photo}')` }}
              role="img"
              aria-hidden={!isActive}
              aria-label={isActive ? 'Emballages kraft et cartons Troco' : undefined}
            />
          );
        })}
        {/* Wash clair : texte lisible sans assombrir la marque */}
        <div className="absolute inset-0 bg-[linear-gradient(105deg,hsl(340_45%_99%/0.97)_0%,hsl(340_40%_98%/0.88)_28%,hsl(203_40%_97%/0.45)_52%,hsl(203_30%_96%/0.12)_72%,transparent_88%)] max-md:bg-[linear-gradient(180deg,hsl(340_45%_99%/0.92)_0%,hsl(340_40%_98%/0.78)_38%,hsl(203_35%_97%/0.35)_62%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(340_40%_99%)] via-transparent to-transparent opacity-80 md:opacity-60" />
      </div>

      {/* Grain papier subtil */}
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      {/* Contenu */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 pb-8 pt-10 sm:px-6 sm:pb-10 md:pb-14 md:pt-6 lg:px-8">
          <div className="flex max-w-xl flex-col items-start text-left max-md:mx-auto max-md:max-w-lg max-md:items-center max-md:text-center">
            <p
              className={cn(
                'mb-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.32em] text-primary sm:mb-4 sm:text-xs',
                fade &&
                  'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]',
              )}
              style={fade ? { animationDelay: '0ms' } : undefined}
            >
              Troco
            </p>

            <h1
              className={cn(
                'mb-4 max-w-[14ch] font-display text-[2.35rem] font-extrabold leading-[1.02] tracking-tight text-foreground xs:text-5xl sm:mb-5 sm:text-6xl md:text-[3.75rem] lg:text-7xl',
                fade &&
                  'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]',
              )}
              style={fade ? { animationDelay: '80ms' } : undefined}
            >
              L&apos;emballage qui valorise vos produits
            </h1>

            <p
              className={cn(
                'mb-8 max-w-md font-body text-[0.95rem] leading-relaxed text-muted-foreground sm:mb-9 sm:text-lg',
                fade &&
                  'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]',
              )}
              style={fade ? { animationDelay: '160ms' } : undefined}
            >
              Sachets, cartons et protections — conçus pour un e-commerce net, rapide et soigné.
            </p>

            <div
              className={cn(
                'mb-10 flex flex-wrap items-center gap-3 max-md:justify-center sm:mb-12 sm:gap-4',
                fade &&
                  'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]',
              )}
              style={fade ? { animationDelay: '240ms' } : undefined}
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  'h-12 min-w-[10.5rem] rounded-2xl px-7 shadow-soft sm:h-14 sm:min-w-[12rem] sm:px-8',
                  shine && 'cta-shine-hover',
                )}
              >
                <Link to="/boutique" className="inline-flex items-center justify-center gap-2.5">
                  <span className="text-sm font-semibold tracking-wide">Notre boutique</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-[10.5rem] rounded-2xl border-border/80 bg-card/70 px-7 backdrop-blur-sm hover:border-primary/35 hover:bg-card sm:h-14 sm:min-w-[12rem] sm:px-8"
              >
                <Link to="/sur-mesure" className="inline-flex items-center justify-center">
                  <span className="text-sm font-semibold tracking-wide">Sur-mesure</span>
                </Link>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'w-full',
              fade &&
                'motion-safe:animate-fade-in-up motion-reduce:opacity-100 [animation-fill-mode:forwards]',
            )}
            style={fade ? { animationDelay: '320ms' } : undefined}
          >
            <HeroCategoriesRail tone="light" />
          </div>
        </div>
      </div>

      {heroPhotos.length > 1 && (
        <div
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2 max-md:bottom-4 max-md:right-4"
          role="tablist"
          aria-label="Images du hero"
        >
          {heroPhotos.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Image ${index + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-foreground/25 hover:bg-foreground/40',
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
