import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
  </section>
);

/**
 * Politique de confidentialité de la plateforme, avec le volet Instagram exigé par Meta
 * (adresse publique + suivi des demandes de suppression de données).
 */
const PlatformPrivacy = () => {
  const [params] = useSearchParams();
  const deletionCode = params.get('suppression');

  return (
    <Layout>
      <main className="page-section-y animate-fade-in">
        <div className="mx-auto max-w-3xl space-y-8 page-padding">
          <header className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Politique de confidentialité
            </h1>
            <p className="text-sm text-muted-foreground">Get STORE — dernière mise à jour : octobre 2026</p>
          </header>

          {deletionCode ? (
            <div role="status" className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium text-foreground">Demande de suppression enregistrée</p>
              <p className="mt-1 text-muted-foreground">
                Les données liées à votre compte Instagram ont été supprimées de Get STORE. Code de confirmation :{' '}
                <span className="font-mono text-foreground">{deletionCode}</span>
              </p>
            </div>
          ) : null}

          <Section title="Qui sommes-nous">
            <p>
              Get STORE est une plateforme qui permet à des commerçants de créer et de gérer leur boutique en ligne. Cette
              page décrit les données personnelles que nous traitons, en particulier lorsqu&apos;un commerçant connecte son
              compte Instagram pour importer ses produits.
            </p>
          </Section>

          <Section title="Connexion Instagram : ce que nous lisons">
            <p>
              La connexion est facultative et en <strong>lecture seule</strong>. Le commerçant autorise Get STORE à lire
              son compte Instagram professionnel avec la permission <em>instagram_business_basic</em>. Nous lisons :
            </p>
            <ul className="list-disc space-y-1 ps-6">
              <li>l&apos;identifiant et le nom d&apos;utilisateur du compte ;</li>
              <li>les publications du compte : légende, photos, lien et date, uniquement pour celles que le commerçant choisit d&apos;importer.</li>
            </ul>
            <p>Nous ne publions rien, ne modifions rien et n&apos;accédons ni aux messages privés ni aux abonnés.</p>
          </Section>

          <Section title="Pourquoi">
            <p>
              Transformer les publications choisies en brouillons de produits (nom, description, prix, photos) que le
              commerçant relit puis publie dans sa boutique. Ces données ne servent à aucune autre finalité : pas de
              publicité, pas de revente, pas de profilage.
            </p>
          </Section>

          <Section title="Conservation et sécurité">
            <ul className="list-disc space-y-1 ps-6">
              <li>Le jeton d&apos;accès Instagram est stocké chiffré et sert uniquement à lire le compte du commerçant ; il est renouvelé automatiquement et supprimé à la déconnexion.</li>
              <li>Les photos importées sont copiées dans l&apos;espace de stockage de la boutique, car les adresses d&apos;Instagram expirent. Les produits publiés appartiennent au commerçant.</li>
              <li>Les données ne sont partagées avec aucun tiers, hormis nos prestataires techniques d&apos;hébergement.</li>
            </ul>
          </Section>

          <Section title="Supprimer vos données">
            <p>Vous pouvez retirer l&apos;accès à tout moment, de trois façons :</p>
            <ul className="list-disc space-y-1 ps-6">
              <li>dans Get STORE : Administration, Produits, Importer depuis Instagram, bouton « Déconnecter » ;</li>
              <li>dans Instagram : Paramètres, Applications et sites web, puis retirer Get STORE ;</li>
              <li>
                en nous écrivant via la <Link className="underline" to="/contact">page de contact</Link>, en indiquant votre
                nom d&apos;utilisateur Instagram.
              </li>
            </ul>
            <p>
              Dans les deux premiers cas, le jeton, le nom d&apos;utilisateur et les brouillons non publiés issus du compte
              sont supprimés immédiatement. Les produits déjà publiés dans la boutique restent, car ils appartiennent au commerçant.
            </p>
          </Section>

          <Section title="Vos droits">
            <p>
              Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données personnelles (loi marocaine
              09-08 relative à la protection des données personnelles) en nous contactant via la{' '}
              <Link className="underline" to="/contact">page de contact</Link>.
            </p>
          </Section>
        </div>
      </main>
    </Layout>
  );
};

export default PlatformPrivacy;
