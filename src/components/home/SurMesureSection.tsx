import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { FeaturedProductDTO } from '@/types/featured-products';
import { RevealOnScroll } from '@/components/animations';
import { ANIMATIONS } from '@/config/animations';
import { cn } from '@/lib/utils';

const SurMesureSection = () => {
  const { data: featuredProducts = [], isLoading, error } = useQuery({
    queryKey: ['featured-products', 'sur-mesure'],
    queryFn: () => featuredProductsApi.getAllFeaturedProducts(),
    // refetchInterval: 30000, // Désactivé pour éviter la boucle d'erreurs
    select: (data) => data.filter(product => product.section === 'sur-mesure')
  });

  // Filtrer les produits actifs de la section "sur-mesure" et trier par ordre d'affichage
  const activeProducts = Array.isArray(featuredProducts)
    ? featuredProducts
        .filter(p => p.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  // Debug: afficher les données dans la console
  console.log('🔍 SurMesureSection - featuredProducts:', featuredProducts);
  console.log('🔍 SurMesureSection - activeProducts:', activeProducts);
  if (activeProducts.length > 0) {
    console.log('🔍 Premier produit:', activeProducts[0]);
    console.log('🔍 Image URL:', activeProducts[0].imageUrl);
    console.log('🔍 Product image URL:', activeProducts[0].product?.imageUrl);
  }
  return (
    <section className="w-full min-w-0 min-h-0 sm:min-h-[100dvh] flex flex-col justify-center max-sm:justify-start py-6 sm:py-8 md:py-10 lg:py-12 bg-background-light dark:bg-background-dark overflow-x-clip border-y border-accent-beige/10">
      <RevealOnScroll className="w-full">
      <div className="w-full max-w-[1280px] mx-auto page-padding shrink-0">
        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-center gap-5 sm:gap-8 lg:gap-12 min-w-0">
          {/* Image — hauteur liée au viewport, un peu plus grande sur desktop */}
          <div className="w-full min-w-0 lg:w-1/2 shrink-0 flex justify-center lg:justify-end min-h-0">
            <div className="relative p-2.5 sm:p-5 lg:p-6 border border-accent-beige/30 rounded-b-full w-full max-w-full min-w-0 lg:max-w-none">
              <div className="relative z-10 w-full min-h-0 aspect-[3/4] max-h-[min(48vh,400px)] sm:max-h-[min(58vh,540px)] md:max-h-[min(54vh,520px)] lg:max-h-[min(50vh,500px)] xl:max-h-[min(54vh,560px)] 2xl:max-h-[min(58vh,600px)] rounded-b-full overflow-hidden shadow-2xl">
                {activeProducts.length > 0 ? (
                  <Link to={`/produit/${activeProducts[0].productId}`} className="block h-full w-full min-h-0">
                    <img
                      src={
                        // Priorité: imageUrl personnalisée > product.imageUrl > placeholder
                        activeProducts[0].imageUrl 
                          ? (activeProducts[0].imageUrl.startsWith('http') 
                              ? activeProducts[0].imageUrl 
                              : (activeProducts[0].imageUrl.startsWith('/uploads/')
                                  ? `http://localhost:8080/api${activeProducts[0].imageUrl}`
                                  : `http://localhost:8080${activeProducts[0].imageUrl}`))
                          : (activeProducts[0].product?.imageUrl 
                              ? (activeProducts[0].product.imageUrl.startsWith('http') 
                                  ? activeProducts[0].product.imageUrl 
                                  : (activeProducts[0].product.imageUrl.startsWith('/uploads/')
                                      ? `http://localhost:8080/api${activeProducts[0].product.imageUrl}`
                                      : `http://localhost:8080${activeProducts[0].product.imageUrl}`))
                              : 'https://picsum.photos/400/600?random=1')
                      }
                      alt={activeProducts[0].title || activeProducts[0].product?.name || 'Produit sélectionné'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log('❌ Image load error, using external placeholder');
                        // Utiliser une image externe pour éviter la boucle
                        e.currentTarget.src = 'https://picsum.photos/400/600?random=1';
                        e.currentTarget.onerror = null; // Empêcher la boucle
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully');
                      }}
                    />
                  </Link>
                ) : (
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANeZjM2Nd2BTUarfEC5v5c5mj_2tDf5f6rndMsfkwa5YJzXfeoX5dYQF8p_SMpojI-9WdlL1rSXnwJvEAi0OLReU3KRTX7wrA6u3toFw0klmtyihXHwC6ZvfahHG_lIRlGuDyPhEUzqMBf39uKhLksAcBv9QC0Q4HbL4sI2lfvb5EvliEZ1Bo1nkFl86eq3WFVcDxgiEGZ8MAADjx1k-VDZleQfjMkT7UPffFrAUoB8U5bJ7dZ3hZmmkHZkBEDqxN5Zmhk1QDNzSem')"
                    }}
                  />
                )}
              </div>
              {/* Decorative elements — desktop uniquement (évite débordement horizontal) */}
              <div className="hidden lg:block absolute -top-4 -right-4 w-32 h-32 border-r-2 border-t-2 border-primary/40 rounded-tr-3xl -z-0"></div>
              <div className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 border-l-2 border-b-2 border-primary/40 rounded-bl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full min-w-0 lg:w-1/2 text-center lg:text-left max-sm:pt-1">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-12 sm:w-16 h-px bg-primary/60 mb-4 sm:mb-6"></div>
              <h4 className="text-accent-beige uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4">Création Unique</h4>
              {activeProducts.length > 0 ? (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-4 sm:mb-6 break-words px-1 sm:px-0">
                    {activeProducts[0].title || 'L\'Art du'} <br/>
                    <span className="font-script text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                      {activeProducts[0].title?.includes('Sur-Mesure') || activeProducts[0].title?.includes('sur-mesure') 
                        ? activeProducts[0].title 
                        : 'Sur-Mesure'
                      }
                    </span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg italic max-w-full break-words px-0.5 sm:px-0">
                    {activeProducts[0].description || '"L\'imagination est le seul guide de votre élégance."'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-4 sm:mb-6 break-words px-1 sm:px-0">
                    L'Art du <br/>
                    <span className="font-script text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Sur-Mesure</span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-4 sm:mb-6 font-light text-[0.9375rem] sm:text-base md:text-lg italic max-w-full break-words px-0.5 sm:px-0">
                    "L'imagination est le seul guide de votre élégance."
                  </p>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8 font-light text-[0.9375rem] sm:text-base md:text-lg max-w-full break-words px-0.5 sm:px-0">
                    Chaque création est une histoire unique. Nos maîtres artisans mettent leur savoir-faire au service de votre vision, transformant vos idées en pièces d'exception qui portent votre empreinte.
                  </p>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-stretch sm:items-center w-full max-w-md sm:max-w-none mx-auto lg:mx-0">
                {activeProducts.length > 0 ? (
                  <Link 
                    to={`/produit/${activeProducts[0].productId}`} 
                    className={cn(
                      'group relative bg-primary hover:bg-secondary-dark text-white w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                      ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                    )}
                  >
                    <span className="relative z-10">Voir le Produit</span>
                    <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </Link>
                ) : (
                  <Link 
                    to="/sur-mesure"
                    className={cn(
                      'group relative bg-primary hover:bg-secondary-dark text-white w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block min-h-[48px] sm:min-h-0 flex items-center justify-center',
                      ANIMATIONS.ctaShineOnHover && 'cta-shine-hover'
                    )}
                  >
                    <span className="relative z-10">Démarrer un Projet</span>
                    <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
};

export default SurMesureSection;
