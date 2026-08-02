import { Quote, Users, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { cn } from '@/lib/utils';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { getImageUrl } from '@/services/api/upload';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useLocale } from '@/contexts/LocaleContext';

const HeritageSection = () => {
  const { isEnabled, getUrl } = useSocialNetworks();
  const { t } = useLocale();
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
    <section className="flex w-full min-h-0 min-w-0 flex-col justify-center overflow-x-clip bg-card py-8 sm:min-h-[100dvh] sm:py-10 md:py-12 lg:py-14 max-sm:justify-start">
      <RevealOnScroll className="w-full">
      <div className="w-full max-w-[1280px] mx-auto page-padding shrink-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-5 sm:gap-8 lg:gap-12 min-w-0">
          {/* Image — même logique que Sur-Mesure : hauteur viewport + plein écran */}
          <div className="w-full min-w-0 lg:w-1/2 shrink-0 flex justify-center lg:justify-start min-h-0">
            <div className="relative w-full min-w-0 max-w-full rounded-3xl border border-border/80 bg-muted/20 p-2.5 sm:p-5 lg:max-w-none lg:p-6">
              {/* w-full + aspect + max-h : l’image remplit la largeur du cadre (plus de bande vide latérale) */}
              <div className="relative z-10 aspect-[3/4] max-h-[min(48vh,400px)] w-full min-h-0 overflow-hidden rounded-2xl sm:max-h-[min(58vh,540px)] md:max-h-[min(54vh,520px)] lg:max-h-[min(50vh,500px)] xl:max-h-[min(54vh,560px)] 2xl:max-h-[min(58vh,600px)]">
                {displayProducts.length > 0 ? (
                  <Link to={`/produit/${displayProducts[0].productId}`} className="block h-full w-full min-h-0">
                    <img
                      src={getImageUrl(
                        displayProducts[0].imageUrl ||
                          displayProducts[0].product?.imageUrl ||
                          '/uploads/placeholder.jpg'
                      )}
                      alt={displayProducts[0].title || displayProducts[0].product?.name || t('selectedProduct')}
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
              <h4 className="text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 font-semibold">{t('selection')}</h4>
              {displayProducts.length > 0 ? (
                <>
                  {displayProducts[0].title && displayProducts[0].title.trim().split(' ').length === 1 ? (
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-4 sm:mb-6 break-words px-1 sm:px-0">
                      <span className="font-display text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {displayProducts[0].title}
                      </span>
                    </h2>
                  ) : (
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-4 sm:mb-6 break-words px-1 sm:px-0">
                      {t('shop')} <br/>
                      <span className="font-display text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {displayProducts[0].title || t('selectedProducts')}
                      </span>
                    </h2>
                  )}
                  <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg max-w-full break-words px-0.5 sm:px-0">
                    {displayProducts[0].description || t('featuredIntro')}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-4 sm:mb-6 break-words px-1 sm:px-0">
                    {t('shop')} <br/>
                    <span className="font-display text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">{t('selectedProducts')}</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg max-w-full break-words px-0.5 sm:px-0">
                    {t('featuredIntro')}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-stretch sm:items-center w-full max-w-md sm:max-w-none mx-auto lg:mx-0">
              {displayProducts.length > 0 ? (
                <Link 
                  to={`/produit/${displayProducts[0].productId}`} 
                  className={cn(
                    'group relative bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-card rounded-2xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                    ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                  )}
                >
                  <span className="relative z-10">{t('seeTheProduct')}</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              ) : (
                <Link 
                  to="/boutique" 
                  className={cn(
                    'group relative bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-card rounded-2xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                    ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                  )}
                >
                  <span className="relative z-10">{t('seeAllProducts')}</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 pt-1 sm:pt-0">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {isEnabled('facebook') && getUrl('facebook') ? (
                    <a
                      href={getUrl('facebook')}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-card bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                  ) : null}
                  {isEnabled('instagram') && getUrl('instagram') ? (
                    <a
                      href={getUrl('instagram')}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-card bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  ) : null}
                  {isEnabled('tiktok') && getUrl('tiktok') ? (
                    <a
                      href={getUrl('tiktok')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-foreground hover:bg-black transition-colors"
                      aria-label="TikTok"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                    </a>
                  ) : null}
                  {isEnabled('whatsapp') && getUrl('whatsapp') ? (
                    <a
                      href={getUrl('whatsapp')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-card bg-green-600 hover:bg-green-700 transition-colors"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  ) : null}
                </div>
                <span className="text-xs sm:text-sm italic text-muted-foreground flex items-center justify-center gap-1.5 text-center max-w-[16rem] sm:max-w-none leading-snug">
                  <Users className="w-4 h-4 shrink-0" />
                  {t('discoverPlatforms')}
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
