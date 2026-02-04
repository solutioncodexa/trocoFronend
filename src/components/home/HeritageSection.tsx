import { Quote, Users, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { FeaturedProductDTO } from '@/types/featured-products';

const HeritageSection = () => {
  const { data: featuredProducts = [], isLoading, error } = useQuery({
    queryKey: ['featured-products', 'heritage'],
    queryFn: () => featuredProductsApi.getAllFeaturedProducts(),
    // refetchInterval: 30000, // Désactivé pour éviter la boucle d'erreurs
  });

  // Filtrer les produits actifs de la section "heritage" et trier par ordre d'affichage
  const activeProducts = Array.isArray(featuredProducts)
    ? featuredProducts
        .filter(p => {
          console.log('🔍 HeritageSection - Product:', { id: p.id, section: p.section, isActive: p.isActive });
          return p.isActive && p.section === 'heritage';
        })
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
    
  // Fallback : si aucun produit heritage, prendre le premier produit actif disponible
  const fallbackProducts = activeProducts.length === 0 && Array.isArray(featuredProducts)
    ? featuredProducts
        .filter(p => p.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 1)
    : [];
    
  console.log('📊 HeritageSection - All featured products:', featuredProducts);
  console.log('📊 HeritageSection - Active heritage products:', activeProducts);
  console.log('📊 HeritageSection - Fallback products:', fallbackProducts);
  
  const displayProducts = activeProducts.length > 0 ? activeProducts : fallbackProducts;
  return (
    <section className="py-20 bg-paper dark:bg-[#2a2515] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Grid */}
          <div className="w-full lg:w-1/2">
            <div className="relative p-6 border border-accent-beige/30 rounded-t-full">
              <div className="aspect-[3/4] rounded-t-full overflow-hidden relative z-10">
                {displayProducts.length > 0 ? (
                  <>
                    {console.log('🖼️ HeritageSection - Image sources:', {
                      customImageUrl: displayProducts[0].imageUrl,
                      productImageUrl: displayProducts[0].product?.imageUrl,
                      productId: displayProducts[0].productId
                    })}
                    <Link to={`/produit/${displayProducts[0].productId}`}>
                      <img
                        src={`http://localhost:8080/api${displayProducts[0].imageUrl || displayProducts[0].product?.imageUrl || '/uploads/placeholder.jpg'}`}
                        alt={displayProducts[0].title || displayProducts[0].product?.name || 'Produit sélectionné'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log('❌ Image load error - stopping fallback loop');
                          e.currentTarget.onerror = null; // Arrêter la boucle immédiatement
                        }}
                        onLoad={(e) => {
                          console.log('✅ Image loaded successfully:', e.currentTarget.src);
                        }}
                      />
                    </Link>
                  </>
                ) : (
                  <div className="w-full h-full bg-cover bg-center" 
                       style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7-aLgGSZQV64bxRSynXXolsArrjJbCAD7cNZa_PYgdnEkyPf_GF7OZy8zi2QM5ZuAkBKk6_etuUn2-11cWQPoAYtrfAtQQH6h6h_U2Cu-5t-taRP4_t6oJDxMSzzwtsXmKF7MahexLyXUxfP1b30GPzfueBMTvGNspRQ3LZBBey41OlvJ5W1BbEkCpgVbmxPWvq9h0au-AzB5UyjDaYFbFSu2FTi9NmkWOYQiunBce_wp4hi9McoVaqooVCIAphYmIxlegE-SQXB6')"}}>
                  </div>
                )}
              </div>
              {/* Decorative elements behind */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-3xl -z-0"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-16 h-px bg-primary/60 mb-6"></div>
              <h4 className="text-accent-beige uppercase tracking-[0.3em] text-sm mb-4">Savoir-faire</h4>
              {displayProducts.length > 0 ? (
                <>
                  {console.log('🎯 HeritageSection - Displaying product:', displayProducts[0])}
                  {displayProducts[0].title && displayProducts[0].title.trim().split(' ').length === 1 ? (
                    // Titre à un mot : afficher seulement le mot avec le style spécial
                    <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                      <span className="font-script text-primary text-5xl lg:text-6xl">
                        {displayProducts[0].title}
                      </span>
                    </h2>
                  ) : (
                    // Titre à plusieurs mots : garder le design actuel
                    <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                      Notre Histoire & <br/>
                      <span className="font-script text-primary text-5xl lg:text-6xl">
                        {displayProducts[0].title || 'Passion'}
                      </span>
                    </h2>
                  )}
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg">
                    {displayProducts[0].description || 'Inspirée par l\'héritage beldi, Naz célèbre l\'art de la joaillerie marocaine dans toute sa noblesse. Chaque bijou est travaillé avec soin, dans le respect du geste artisanal et de la tradition.'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                    Notre Histoire & <br/>
                    <span className="font-script text-primary text-5xl lg:text-6xl">Passion</span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg">
                    Inspirée par l'héritage beldi, Naz célèbre l'art de la joaillerie marocaine dans toute sa noblesse. Chaque bijou est travaillé avec soin, dans le respect du geste artisanal et de la tradition.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              {displayProducts.length > 0 ? (
                <Link 
                  to={`/produit/${displayProducts[0].productId}`} 
                  className="group relative bg-primary hover:bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block"
                >
                  <span className="relative z-10">Voir Le Produit</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              ) : (
                <Link 
                  to="/boutique" 
                  className="group relative bg-primary hover:bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block"
                >
                  <span className="relative z-10">Voir Tous Les Produits</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <a 
                    href="https://www.facebook.com/votrefacebook" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href="https://www.instagram.com/votreinstagram" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
                <span className="text-sm italic text-accent-beige flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Découvrir Notre Platforms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
