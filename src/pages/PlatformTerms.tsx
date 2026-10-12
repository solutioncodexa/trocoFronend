import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
  </section>
);

/** Conditions d'utilisation de la plateforme (adresse publique demandée par Meta pour la validation de l'app). */
const PlatformTerms = () => (
  <Layout>
    <main className="page-section-y animate-fade-in">
      <div className="mx-auto max-w-3xl space-y-8 page-padding">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-sm text-muted-foreground">Get STORE — dernière mise à jour : octobre 2026</p>
        </header>

        <Section title="Le service">
          <p>
            Get STORE permet à des commerçants de créer, personnaliser et gérer une boutique en ligne : catalogue, commandes,
            livraison, paiement à la livraison et communication avec leurs clients. En créant une boutique ou en utilisant
            la plateforme, vous acceptez ces conditions.
          </p>
        </Section>

        <Section title="Votre compte">
          <ul className="list-disc space-y-1 ps-6">
            <li>Vous fournissez des informations exactes et gardez vos identifiants confidentiels.</li>
            <li>Vous êtes responsable de l&apos;activité réalisée depuis votre compte et de celle de vos collaborateurs.</li>
            <li>Vous devez avoir la capacité légale de conclure un contrat et d&apos;exercer une activité commerciale.</li>
          </ul>
        </Section>

        <Section title="Votre boutique et vos contenus">
          <ul className="list-disc space-y-1 ps-6">
            <li>Vous restez propriétaire de vos produits, photos et textes, et garantissez disposer des droits nécessaires pour les publier.</li>
            <li>Vous êtes seul responsable de la conformité de vos produits, de vos prix, de vos livraisons et de vos relations avec vos clients.</li>
            <li>Sont interdits : les produits illicites ou contrefaits, les contenus trompeurs, haineux ou portant atteinte aux droits d&apos;autrui.</li>
          </ul>
        </Section>

        <Section title="Connexion à Instagram">
          <p>
            Vous pouvez connecter votre compte Instagram professionnel pour importer vos publications comme brouillons de
            produits. Cette connexion est facultative, en lecture seule, et peut être retirée à tout moment. Vous restez
            soumis aux conditions d&apos;Instagram et de Meta. Le détail du traitement de vos données figure dans notre{' '}
            <Link className="underline" to="/confidentialite">politique de confidentialité</Link>.
          </p>
        </Section>

        <Section title="Abonnement et disponibilité">
          <p>
            Les fonctionnalités et limites dépendent de l&apos;offre choisie. Nous nous efforçons d&apos;assurer un service
            continu, sans garantie d&apos;absence d&apos;interruption, notamment lors des maintenances. Nous pouvons suspendre une
            boutique qui enfreint ces conditions ou la loi.
          </p>
        </Section>

        <Section title="Responsabilité">
          <p>
            Get STORE fournit un outil et n&apos;est pas partie aux ventes conclues entre un commerçant et ses clients. Notre
            responsabilité est limitée aux dommages directs et prévisibles, dans la mesure permise par la loi.
          </p>
        </Section>

        <Section title="Fin du contrat et données">
          <p>
            Vous pouvez fermer votre boutique à tout moment. Vos données sont conservées le temps nécessaire à la fourniture
            du service et aux obligations légales, puis supprimées ou anonymisées.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Pour toute question, utilisez la <Link className="underline" to="/contact">page de contact</Link>.
          </p>
        </Section>
      </div>
    </main>
  </Layout>
);

export default PlatformTerms;
