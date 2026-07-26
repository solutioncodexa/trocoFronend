import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStoreBrand } from '@/hooks/useStoreBrand';

const FAQ = () => {
  const { siteName, freeShippingThreshold } = useStoreBrand();

  return (
    <Layout>
      <main className="page-section-y animate-fade-in">
        <div className="mx-auto max-w-4xl page-padding">
          <div className="mb-14 text-center sm:mb-16">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Questions fréquentes
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Tout savoir sur les commandes, la livraison et les produits de {siteName}.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-14">
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden>
                  payments
                </span>
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Commandes &amp; paiement
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Quels sont les modes de paiement acceptés ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Nous acceptons le paiement à la livraison (espèces) partout au Maroc. Notre équipe
                      vous contacte par téléphone pour confirmer votre commande avant expédition.
                    </p>
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Puis-je annuler ou modifier ma commande ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Oui, vous pouvez annuler ou modifier votre commande dans les 24 h après validation,
                      tant qu&apos;elle n&apos;a pas été préparée ou expédiée. Contactez-nous rapidement pour
                      toute modification.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden>
                  local_shipping
                </span>
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Livraison
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Quels sont les délais de livraison ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Pour les produits en stock, la livraison s&apos;effectue généralement sous 2 à 5 jours
                      ouvrés partout au Maroc. Les commandes en gros ou sur-mesure peuvent nécessiter un
                      délai supplémentaire, précisé lors de la confirmation.
                    </p>
                  </div>
                </details>
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      La livraison est-elle gratuite ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Oui, la livraison est gratuite dès {freeShippingThreshold} DH d&apos;achat. En
                      dessous de ce seuil, des frais de livraison sont indiqués au panier avant validation.
                    </p>
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Ma commande est-elle suivie pendant le transport ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Oui. Une fois expédiée, votre commande est suivie jusqu&apos;à la livraison. Notre équipe
                      reste joignable pour tout retard ou problème de réception.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden>
                  inventory_2
                </span>
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Produits &amp; qualité
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Quels types de produits proposez-vous ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      {siteName} propose une sélection de produits adaptés à vos besoins. Consultez la
                      boutique pour découvrir les articles, formats et options disponibles.
                    </p>
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Puis-je retourner un produit ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Les retours sont possibles pour les produits non utilisés, dans leur emballage
                      d&apos;origine, selon les conditions indiquées sur la page{' '}
                      <Link to="/livraison-retours" className="font-medium text-primary hover:underline">
                        Livraison &amp; Retours
                      </Link>
                      . Contactez-nous pour ouvrir une demande.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden>
                  design_services
                </span>
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Sur-mesure &amp; devis
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Comment passer une demande personnalisée ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Rendez-vous sur la page{' '}
                      <Link to="/sur-mesure" className="font-medium text-primary hover:underline">
                        Sur-mesure
                      </Link>{' '}
                      ou{' '}
                      <Link to="/devis" className="font-medium text-primary hover:underline">
                        Devis
                      </Link>
                      . Décrivez votre besoin, joignez vos fichiers si besoin : nous vous recontactons avec
                      une proposition adaptée.
                    </p>
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40 focus:outline-none sm:p-6">
                    <span className="text-base font-medium text-foreground">
                      Quel est le délai pour un projet sur-mesure ?
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    <p>
                      Le délai dépend du volume et de la personnalisation demandée. Nous vous communiquons
                      une estimation claire après étude de votre devis.
                    </p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-soft sm:p-10">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Notre équipe est disponible pour vous accompagner.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
