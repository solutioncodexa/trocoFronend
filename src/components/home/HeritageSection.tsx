import { Quote, Users, Facebook, Instagram } from 'lucide-react';
import { FACEBOOK_PAGE_URL, INSTAGRAM_URL, TIKTOK_URL } from '@/config/site';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { FeaturedProductDTO } from '@/types/featured-products';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { cn } from '@/lib/utils';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { getImageUrl } from '@/services/api/upload';

const HeritageSection = () => {
  const { data: featuredProducts = [], isLoading, error } = useQuery({
    queryKey: ['featured-products', 'heritage'],
    queryFn: () => featuredProductsApi.getAllFeaturedProducts(),
    ...staticCatalogQueryOptions,
  });

  // Filtrer les produits actifs de la section "heritage" et trier par ordre d'affichage
  const activeProducts = Array.isArray(featuredProducts)
    ? featuredProducts
        .filter((p) => p.isActive && p.section === 'heritage')
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  // Fallback : si aucun produit heritage, prendre le premier produit actif disponible
  const fallbackProducts =
    activeProducts.length === 0 && Array.isArray(featuredProducts)
      ? featuredProducts
          .filter((p) => p.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, 1)
      : [];

  const displayProducts = activeProducts.length > 0 ? activeProducts : fallbackProducts;
  return (
    <section className="w-full min-w-0 min-h-0 sm:min-h-[100dvh] flex flex-col justify-center max-sm:justify-start py-6 sm:py-8 md:py-10 lg:py-12 bg-paper dark:bg-[#2a2515] overflow-x-clip">
      <RevealOnScroll className="w-full">
      <div className="w-full max-w-[1280px] mx-auto page-padding shrink-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-5 sm:gap-8 lg:gap-12 min-w-0">
          {/* Image — même logique que Sur-Mesure : hauteur viewport + plein écran */}
          <div className="w-full min-w-0 lg:w-1/2 shrink-0 flex justify-center lg:justify-start min-h-0">
            <div className="relative p-2.5 sm:p-5 lg:p-6 border border-accent-beige/30 rounded-t-full w-full max-w-full min-w-0 lg:max-w-none">
              {/* w-full + aspect + max-h : l’image remplit la largeur du cadre (plus de bande vide latérale) */}
              <div className="relative z-10 w-full min-h-0 aspect-[3/4] max-h-[min(48vh,400px)] sm:max-h-[min(58vh,540px)] md:max-h-[min(54vh,520px)] lg:max-h-[min(50vh,500px)] xl:max-h-[min(54vh,560px)] 2xl:max-h-[min(58vh,600px)] rounded-t-full overflow-hidden">
                {displayProducts.length > 0 ? (
                  <Link to={`/produit/${displayProducts[0].productId}`} className="block h-full w-full min-h-0">
                    <img
                      src={getImageUrl(
                        displayProducts[0].imageUrl ||
                          displayProducts[0].product?.imageUrl ||
                          '/uploads/placeholder.jpg'
                      )}
                      alt={displayProducts[0].title || displayProducts[0].product?.name || 'Produit sélectionné'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full bg-cover bg-center" 
                       style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7-aLgGSZQV64bxRSynXXolsArrjJbCAD7cNZa_PYgdnEkyPf_GF7OZy8zi2QM5ZuAkBKk6_etuUn2-11cWQPoAYtrfAtQQH6h6h_U2Cu-5t-taRP4_t6oJDxMSzzwtsXmKF7MahexLyXUxfP1b30GPzfueBMTvGNspRQ3LZBBey41OlvJ5W1BbEkCpgVbmxPWvq9h0au-AzB5UyjDaYFbFSu2FTi9NmkWOYQiunBce_wp4hi9McoVaqooVCIAphYmIxlegE-SQXB6')"}}>
                  </div>
                )}
              </div>
              {/* Decorative elements — masqués sur mobile pour éviter tout débordement horizontal */}
              <div className="hidden lg:block absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-3xl -z-0"></div>
              <div className="hidden lg:block absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full min-w-0 lg:w-1/2 text-center lg:text-left max-sm:pt-1">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-12 sm:w-16 h-px bg-primary/60 mb-4 sm:mb-6"></div>
              <h4 className="text-accent-beige uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4">Savoir-faire</h4>
              {displayProducts.length > 0 ? (
                <>
                  {displayProducts[0].title && displayProducts[0].title.trim().split(' ').length === 1 ? (
                    // Titre à un mot : afficher seulement le mot avec le style spécial
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-4 sm:mb-6 break-words px-1 sm:px-0">
                      <span className="font-script text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {displayProducts[0].title}
                      </span>
                    </h2>
                  ) : (
                    // Titre à plusieurs mots : garder le design actuel
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-4 sm:mb-6 break-words px-1 sm:px-0">
                      Notre Histoire & <br/>
                      <span className="font-script text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {displayProducts[0].title || 'Passion'}
                      </span>
                    </h2>
                  )}
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg max-w-full break-words px-0.5 sm:px-0">
                    {displayProducts[0].description || 'Inspirée par l\'héritage beldi, Naz célèbre l\'art de la joaillerie marocaine dans toute sa noblesse. Chaque bijou est travaillé avec soin, dans le respect du geste artisanal et de la tradition.'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-4 sm:mb-6 break-words px-1 sm:px-0">
                    Notre Histoire & <br/>
                    <span className="font-script text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Passion</span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg max-w-full break-words px-0.5 sm:px-0">
                    Inspirée par l'héritage beldi, Naz célèbre l'art de la joaillerie marocaine dans toute sa noblesse. Chaque bijou est travaillé avec soin, dans le respect du geste artisanal et de la tradition.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-stretch sm:items-center w-full max-w-md sm:max-w-none mx-auto lg:mx-0">
              {displayProducts.length > 0 ? (
                <Link 
                  to={`/produit/${displayProducts[0].productId}`} 
                  className={cn(
                    'group relative bg-primary hover:bg-secondary-dark text-white w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                    ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                  )}
                >
                  <span className="relative z-10">Voir Le Produit</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              ) : (
                <Link 
                  to="/boutique" 
                  className={cn(
                    'group relative bg-primary hover:bg-secondary-dark text-white w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                    ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                  )}
                >
                  <span className="relative z-10">Voir Tous Les Produits</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 pt-1 sm:pt-0">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  <a 
                    href={FACEBOOK_PAGE_URL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href={INSTAGRAM_URL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-secondary-dark hover:bg-black transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </a>
                </div>
                <span className="text-xs sm:text-sm italic text-accent-beige flex items-center justify-center gap-1.5 text-center max-w-[16rem] sm:max-w-none leading-snug">
                  <Users className="w-4 h-4 shrink-0" />
                  Découvrir Notre Platforms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
};

export default HeritageSection;
