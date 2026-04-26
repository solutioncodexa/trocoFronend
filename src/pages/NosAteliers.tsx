import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NosAteliers = () => {
  return (
    <Layout>
      <main className="py-20">
        <div className="text-center mb-16 px-6">
          <h2 className="text-5xl md:text-6xl font-display text-secondary-dark mb-4">
            Ateliers & <span className="font-script text-primary text-6xl md:text-7xl">Savoir-Faire</span>
          </h2>
          <p className="text-accent-beige uppercase tracking-[0.3em] text-xs">
            Le Geste Artisanal de la Maison
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">draw</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Conception</h4>
              <p className="text-sm text-secondary-dark/70">
                Chaque piece debute par un dessin precis pour respecter la vision du client.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">precision_manufacturing</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Fabrication</h4>
              <p className="text-sm text-secondary-dark/70">
                Fonte, assemblage et sertissage executes avec des gestes maitrises et reguliers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">verified</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Controle</h4>
              <p className="text-sm text-secondary-dark/70">
                Chaque bijou est verifie avant livraison pour garantir eclat, solidite et confort.
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-secondary-dark/80 leading-relaxed space-y-4">
            <h3 className="text-2xl font-display text-secondary-dark mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary"></span> Le Travail d'Atelier
            </h3>
            <p>
              Nos artisans joailliers associent techniques traditionnelles et outils modernes pour
              donner naissance a des pieces d'exception. Chaque etape est realisee en interne pour
              conserver une exigence constante de qualite.
            </p>
            <ul className="space-y-2 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Sertissage delicat pour sublimer les pierres et assurer leur tenue dans le temps.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Polissage et finition manuels pour reveler toute la brillance de l'or.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Controle final detaille avant remise, avec verification du confort au porter.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="flex justify-center py-12">
          <div className="w-48 h-px bg-accent-beige/20 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-primary text-5xl mb-6">auto_fix_high</span>
            <h3 className="text-3xl font-display text-secondary-dark mb-6">Votre Piece Sur Mesure</h3>
            <p className="text-secondary-dark/70 leading-relaxed mb-8">
              Notre atelier peut realiser des creations uniques selon vos envies, vos pierres et votre
              budget avec un accompagnement pas a pas.
            </p>
            <Link
              to="/commande-personnalisee"
              className="bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 inline-block"
            >
              Lancer Mon Projet
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default NosAteliers;
