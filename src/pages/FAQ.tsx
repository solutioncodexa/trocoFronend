import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const FAQ = () => {
  return (
    <Layout>
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display text-secondary-dark mb-4">
              Questions <span className="font-script text-primary text-6xl md:text-7xl block md:inline">Fréquentes</span>
            </h2>
            <div className="flex justify-center py-12">
              <div className="w-48 h-px bg-accent-beige/20 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-accent-beige">Commandes & Paiement</h3>
              </div>
              <div className="space-y-2">
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Quels sont les modes de paiement acceptés ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Nous acceptons uniquement le paiement à la livraison (en espèces), partout au Maroc. Notre équipe vous contacte par téléphone pour confirmer votre commande avant expédition.</p>
                  </div>
                </details>
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Puis-je annuler ou modifier ma commande ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Oui, vous pouvez annuler ou modifier votre commande dans un délai de 24h après validation. Passé ce délai, la commande entre en fabrication et ne pourra plus être modifiée. Contactez-nous rapidement pour toute modification.</p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-accent-beige">Livraison</h3>
              </div>
              <div className="space-y-2">
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Quels sont les délais de livraison ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Pour les pièces en stock, la livraison s'effectue sous 3 à 5 jours ouvrés en France Métropolitaine. Pour les créations sur commande, un délai de 4 à 6 semaines est généralement requis pour le façonnage artisanal.</p>
                  </div>
                </details>
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Ma commande est-elle assurée pendant le transport ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Absolument. Toutes les expéditions YaraGold sont entièrement assurées à hauteur de la valeur réelle du bijou. La remise se fait exclusivement contre signature.</p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-primary">cleaning_services</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-accent-beige">Bijoux & Entretien</h3>
              </div>
              <div className="space-y-2">
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Comment entretenir mon bijou YaraGold ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Nous recommandons de nettoyer délicatement votre bijou à l'eau tiède savonneuse avec une brosse souple. Évitez le contact avec les produits chimiques et retirez vos bijoux avant de dormir ou de pratiquer une activité sportive.</p>
                  </div>
                </details>
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Vos bijoux sont-ils garantis ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Chaque pièce YaraGold bénéficie d'une garantie à vie contre tout vice de fabrication. Nous offrons également un polissage annuel gracieux pour redonner tout son éclat à votre or.</p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-accent-beige">Sur Mesure</h3>
              </div>
              <div className="space-y-2">
                <details className="group border-b border-accent-beige/20 bg-white/50">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none hover:bg-white transition-colors duration-300">
                    <span className="text-lg font-medium text-secondary-dark">Comment se déroule la création d'un bijou sur mesure ?</span>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300 expand-icon">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-dark/70 leading-relaxed font-light">
                    <p>Le processus débute par un rendez-vous avec l'un de nos artisans pour définir votre projet. Nous réalisons ensuite des croquis et une modélisation 3D avant de procéder à la fonte de l'or et au sertissage des pierres dans nos ateliers.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <div className="mt-20 p-10 bg-paper border border-accent-beige/20 text-center rounded-sm">
            <h4 className="text-xl font-display mb-4">Vous n'avez pas trouvé votre réponse ?</h4>
            <p className="text-accent-beige mb-8">Nos conseillers sont à votre disposition du lundi au samedi.</p>
            <div className="flex justify-center">
              <Link 
                to="/contact" 
                className="bg-secondary-dark text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary transition-colors inline-block"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default FAQ;
