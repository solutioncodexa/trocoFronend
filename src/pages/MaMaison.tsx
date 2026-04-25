import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const MaMaison = () => {
  return (
    <Layout>
      <main className="py-20">
        <div className="text-center mb-16 px-6">
          <h2 className="text-5xl md:text-6xl font-display text-secondary-dark mb-4">
            Maison & <span className="font-script text-primary text-6xl md:text-7xl">Histoire</span>
          </h2>
          <p className="text-accent-beige uppercase tracking-[0.3em] text-xs">
            Identite & Valeurs de la Maison
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">history</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Tradition</h4>
              <p className="text-sm text-secondary-dark/70">
                Une maison inspiree par la joaillerie marocaine et transmise avec passion.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">diamond</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Excellence</h4>
              <p className="text-sm text-secondary-dark/70">
                Une selection exigeante des matieres et des finitions realisees avec precision.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">auto_awesome</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Signature</h4>
              <p className="text-sm text-secondary-dark/70">
                Des creations intemporelles, equilibrees entre lignes modernes et esprit beldi.
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-secondary-dark/80 leading-relaxed space-y-4">
            <h3 className="text-2xl font-display text-secondary-dark mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary"></span> Notre Histoire
            </h3>
            <p>
              Depuis ses debuts, la Maison YaraGold place l'humain, la matiere et le geste au coeur
              de chaque creation. Nos collections sont pensees pour marquer les instants precieux:
              fiancailles, mariages, transmissions et souvenirs de vie.
            </p>
            <ul className="space-y-2 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Or 18 carats selectionne avec soin et controle de qualite a chaque etape.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Designs exclusifs concus pour allier elegance quotidienne et allure ceremonielle.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Accompagnement personnalise pour guider chaque client vers la piece ideale.</span>
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
            <span className="material-symbols-outlined text-primary text-5xl mb-6">storefront</span>
            <h3 className="text-3xl font-display text-secondary-dark mb-6">Visitez Notre Univers</h3>
            <p className="text-secondary-dark/70 leading-relaxed mb-8">
              Decouvrez les gestes et les secrets de fabrication qui donnent vie a nos bijoux en
              explorant la page dediee a nos ateliers.
            </p>
            <Link
              to="/nos-ateliers"
              className="bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 inline-block"
            >
              Decouvrir Nos Ateliers
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default MaMaison;
