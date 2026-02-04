import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { featuredProductsApi } from '@/services/api/featuredProducts';
import { FeaturedProductDTO } from '@/types/featured-products';

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
    <section className="py-20 bg-background-light dark:bg-background-dark overflow-hidden border-y border-accent-beige/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative p-6 border border-accent-beige/30 rounded-b-full">
              <div className="aspect-[3/4] rounded-b-full overflow-hidden relative z-10 shadow-2xl">
                {activeProducts.length > 0 ? (
                  <Link to={`/produit/${activeProducts[0].productId}`}>
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
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border-r-2 border-t-2 border-primary/40 rounded-tr-3xl -z-0"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-l-2 border-b-2 border-primary/40 rounded-bl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-16 h-px bg-primary/60 mb-6"></div>
              <h4 className="text-accent-beige uppercase tracking-[0.3em] text-sm mb-4">Création Unique</h4>
              {activeProducts.length > 0 ? (
                <>
                  <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                    {activeProducts[0].title || 'L\'Art du'} <br/>
                    <span className="font-script text-primary text-5xl lg:text-6xl">
                      {activeProducts[0].title?.includes('Sur-Mesure') || activeProducts[0].title?.includes('sur-mesure') 
                        ? activeProducts[0].title 
                        : 'Sur-Mesure'
                      }
                    </span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg italic">
                    {activeProducts[0].description || '"L\'imagination est le seul guide de votre élégance."'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                    L'Art du <br/>
                    <span className="font-script text-primary text-5xl lg:text-6xl">Sur-Mesure</span>
                  </h2>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 font-light text-lg italic">
                    "L'imagination est le seul guide de votre élégance."
                  </p>
                  <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg">
                    Chaque création est une histoire unique. Nos maîtres artisans mettent leur savoir-faire au service de votre vision, transformant vos idées en pièces d'exception qui portent votre empreinte.
                  </p>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                {activeProducts.length > 0 ? (
                  <Link 
                    to={`/produit/${activeProducts[0].productId}`} 
                    className="group relative bg-primary hover:bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block"
                  >
                    <span className="relative z-10">Voir le Produit</span>
                    <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </Link>
                ) : (
                  <Link 
                    to="/sur-mesure"
                    className="group relative bg-primary hover:bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block"
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
    </section>
  );
};

export default SurMesureSection;
