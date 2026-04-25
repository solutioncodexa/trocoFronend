import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const LivraisonRetours = () => {
  return (
    <Layout>
      <main className="py-20">
        <div className="text-center mb-16 px-6">
          <h2 className="text-5xl md:text-6xl font-display text-secondary-dark mb-4">
            Livraison & <span className="font-script text-primary text-6xl md:text-7xl">Retours</span>
          </h2>
          <p className="text-accent-beige uppercase tracking-[0.3em] text-xs">Informations & Services de la Maison</p>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">local_shipping</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Délais Rapides</h4>
              <p className="text-sm text-secondary-dark/70">Livraison sécurisée sous 24h à 48h dans tout le Royaume.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">redeem</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Frais de Port</h4>
              <p className="text-sm text-secondary-dark/70">Offerts pour toute commande supérieure à 2000 MAD.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-primary/10 bg-white/50 backdrop-blur-sm rounded-sm">
              <span className="material-symbols-outlined text-primary mb-3 text-4xl">payments</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Paiement</h4>
              <p className="text-sm text-secondary-dark/70">Paiement uniquement à la livraison, en espèces.</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-secondary-dark/80 leading-relaxed space-y-4">
            <h3 className="text-2xl font-display text-secondary-dark mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary"></span> Livraison au Maroc
            </h3>
            <p>La Maison YaraGold assure la livraison de ses créations d'exception sur l'ensemble du territoire marocain. Nous collaborons avec des partenaires logistiques de confiance spécialisés dans le transport d'objets précieux pour vous garantir une sérénité totale.</p>
            <ul className="space-y-2 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Toutes nos expéditions sont assurées à hauteur de la valeur réelle du bijou.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Un numéro de suivi vous est communiqué dès le départ de notre atelier.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span>Remise du colis en mains propres contre signature uniquement.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="flex justify-center py-12">
          <div className="w-48 h-px bg-accent-beige/20 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-display text-secondary-dark mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span> Retours & Échanges
          </h3>
          <div className="bg-white p-8 border border-accent-beige/20 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4 text-sm leading-relaxed">
                <h4 className="font-bold text-primary uppercase tracking-widest">Politique de 14 Jours</h4>
                <p>Vous disposez d'un délai de 14 jours calendaires à compter de la date de réception de votre commande pour demander un échange ou un remboursement.</p>
                <h4 className="font-bold text-primary uppercase tracking-widest pt-4">Conditions de Retour</h4>
                <p>Pour être accepté, le bijou doit être :</p>
                <ul className="space-y-1 list-none p-0 italic">
                  <li className="flex items-center gap-2">• Dans son état neuf et non porté</li>
                  <li className="flex items-center gap-2">• Sans aucune trace de rayure ou modification</li>
                  <li className="flex items-center gap-2">• Accompagné de son packaging original complet</li>
                  <li className="flex items-center gap-2">• Accompagné de son certificat d'authenticité</li>
                </ul>
              </div>
              <div className="space-y-4 text-sm leading-relaxed border-l border-accent-beige/10 md:pl-12">
                <h4 className="font-bold text-primary uppercase tracking-widest">Le Processus</h4>
                <ol className="space-y-4 list-decimal pl-4">
                  <li>Contactez notre service client par téléphone ou via notre formulaire pour initier la demande.</li>
                  <li>Préparez le colis avec soin en utilisant l'emballage de protection d'origine.</li>
                  <li>Un coursier sera mandaté par nos soins pour récupérer le bijou à votre domicile.</li>
                  <li>Après inspection par nos experts en atelier, l'échange ou le remboursement est effectué sous 5 jours ouvrés.</li>
                </ol>
                <p className="text-xs text-accent-beige mt-6">* Note : Les créations sur-mesure ou gravées ne peuvent faire l'objet d'un retour.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center py-12">
          <div className="w-48 h-px bg-accent-beige/20 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-primary text-5xl mb-6">verified</span>
            <h3 className="text-3xl font-display text-secondary-dark mb-6">L'Engagement de la Maison</h3>
            <p className="text-secondary-dark/70 leading-relaxed mb-8">
              Toutes nos créations sont accompagnées d'un certificat d'authenticité garantissant l'utilisation exclusive d'<strong>Or 18 carats (750/1000)</strong>. Chaque bijou bénéficie d'une garantie à vie sur les vices de fabrication et d'un service de polissage offert la première année.
            </p>
            <button className="bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300">
              Contacter notre Conciergerie
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default LivraisonRetours;
