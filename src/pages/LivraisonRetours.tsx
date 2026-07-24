import Layout from '@/components/layout/Layout';
import { FREE_SHIPPING_THRESHOLD_MAD, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '@/config/site';
import { Link } from 'react-router-dom';

const LivraisonRetours = () => {
  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <section className="py-14 md:py-16 text-center border-b border-border">
          <div className="max-w-[1280px] mx-auto px-6">
            <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4 block">
              Service client
            </span>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Livraison & Retours
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Des conditions claires pour vos commandes d&apos;emballage e-commerce partout au Maroc.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6 space-y-10 font-body text-foreground/90 leading-relaxed">
            <div>
              <h2 className="font-display text-2xl mb-3">Livraison</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  Livraison gratuite à partir de{' '}
                  <strong className="text-foreground">{FREE_SHIPPING_THRESHOLD_MAD} DH</strong>.
                </li>
                <li>Expédition sous 24–72 h ouvrées selon stock et destination.</li>
                <li>Suivi de colis communiqué dès l&apos;expédition.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-3">Paiement</h2>
              <p className="text-muted-foreground">
                Paiement à la livraison (espèces) ou selon les options proposées au checkout.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-3">Retours</h2>
              <p className="text-muted-foreground mb-3">
                Les produits non utilisés, dans leur emballage d&apos;origine, peuvent faire l&apos;objet
                d&apos;un retour sous 7 jours après réception (sous réserve de validation).
              </p>
              <p className="text-muted-foreground">
                Contactez-nous à{' '}
                <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>{' '}
                ou au {CONTACT_PHONE_DISPLAY}.
              </p>
            </div>

            <p>
              <Link to="/boutique" className="text-primary font-medium hover:underline">
                Continuer vos achats →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LivraisonRetours;
