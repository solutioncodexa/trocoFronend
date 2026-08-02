import Layout from '@/components/layout/Layout';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';

const LivraisonRetours = () => {
  const { freeShippingThreshold, contactEmail, contactPhone } = useStoreBrand();
  const { t } = useLocale();

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <section className="py-14 md:py-16 text-center border-b border-border">
          <div className="max-w-[1280px] mx-auto px-6">
            <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4 block">
              {t('shipEyebrow')}
            </span>
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              {t('shipTitle')}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('shipIntro')}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6 space-y-10 font-body text-foreground/90 leading-relaxed">
            <div>
              <h2 className="font-display text-2xl mb-3">{t('shipSectionDelivery')}</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  {t('fastDeliveryDesc', { n: freeShippingThreshold })}.
                </li>
                <li>Expédition sous 24–72 h ouvrées selon stock et destination.</li>
                <li>Suivi de colis communiqué dès l&apos;expédition.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-3">{t('shipSectionPayment')}</h2>
              <p className="text-muted-foreground">
                Paiement à la livraison (espèces) ou selon les options proposées au checkout.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-3">{t('shipSectionReturns')}</h2>
              <p className="text-muted-foreground mb-3">
                Les produits non utilisés, dans leur emballage d&apos;origine, peuvent faire l&apos;objet
                d&apos;un retour sous 7 jours après réception (sous réserve de validation).
              </p>
              {(contactEmail || contactPhone) && (
                <p className="text-muted-foreground">
                  {t('shipContactPrefix')}
                  {contactEmail ? (
                    <>
                      {' '}
                      <a className="text-primary underline" href={`mailto:${contactEmail}`}>
                        {contactEmail}
                      </a>
                    </>
                  ) : null}
                  {contactEmail && contactPhone ? ` ${t('shipContactOr')} ` : null}
                  {contactPhone ? (
                    <>
                      {' '}
                      {t('shipContactAt')} {contactPhone}
                    </>
                  ) : null}
                  .
                </p>
              )}
            </div>

            <p>
              <Link to="/boutique" className="text-primary font-medium hover:underline">
                {t('continueShopping')} →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LivraisonRetours;
