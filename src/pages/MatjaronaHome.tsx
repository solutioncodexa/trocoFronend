import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, Layers, Zap } from 'lucide-react';
import { platformApi } from '@/services/api/platform';

const MatjaronaHome = () => {
  const { data: plans = [] } = useQuery({
    queryKey: ['platform', 'plans'],
    queryFn: () => platformApi.getPlans(),
    staleTime: 10 * 60 * 1000,
  });

  const sortedPlans = [...plans].sort(
    (a, b) => Number(a.priceMad ?? 0) - Number(b.priceMad ?? 0),
  );

  return (
    <div className="matjarona-root min-h-screen text-[var(--mj-ink)]">
      <style>{`
        .matjarona-root {
          --mj-ink: #0a1628;
          --mj-foam: #e8f4f2;
          --mj-lagoon: #0d9488;
          --mj-lagoon-deep: #0f766e;
          --mj-saffron: #e8a317;
          --mj-mist: rgba(232, 244, 242, 0.08);
          font-family: 'Figtree', ui-sans-serif, sans-serif;
          background:
            radial-gradient(120% 80% at 10% -10%, #134e4a 0%, transparent 55%),
            radial-gradient(90% 60% at 100% 0%, #1e3a5f 0%, transparent 50%),
            linear-gradient(165deg, #071018 0%, #0a1628 42%, #0c1f2e 100%);
          color: var(--mj-foam);
        }
        .matjarona-root .font-mj {
          font-family: 'Syne', ui-sans-serif, sans-serif;
        }
        @keyframes mj-drift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.45; }
          50% { transform: translate3d(2%, -3%, 0) scale(1.06); opacity: 0.7; }
        }
        @keyframes mj-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mj-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .mj-orb {
          animation: mj-drift 14s ease-in-out infinite;
        }
        .mj-rise {
          animation: mj-rise 0.85s ease-out both;
        }
        .mj-rise-2 { animation-delay: 0.12s; }
        .mj-rise-3 { animation-delay: 0.24s; }
        .mj-rise-4 { animation-delay: 0.36s; }
        .mj-line {
          background: linear-gradient(90deg, transparent, var(--mj-saffron), var(--mj-lagoon), transparent);
          background-size: 200% 100%;
          animation: mj-shimmer 8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mj-orb, .mj-rise, .mj-line { animation: none !important; }
          .mj-rise { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="mj-orb absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full bg-teal-500/20 blur-3xl" />
        <div
          className="mj-orb absolute -right-16 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sky-600/15 blur-3xl"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e8f4f2\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <span className="font-mj text-xl font-extrabold tracking-tight text-[var(--mj-foam)] sm:text-2xl">
          Matjarona
        </span>
        <Link
          to="/admin"
          className="text-sm font-medium text-[var(--mj-foam)]/70 transition-colors hover:text-[var(--mj-foam)]"
        >
          Connexion admin
        </Link>
      </header>

      {/* Hero — brand first, one composition */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-6 sm:px-8 sm:pb-28">
        <p className="mj-rise font-mj text-[clamp(3.5rem,12vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight text-[var(--mj-foam)]">
          Matjarona
        </p>
        <div className="mj-line mj-rise mj-rise-2 mt-5 h-px w-full max-w-md opacity-80" />
        <h1 className="mj-rise mj-rise-2 mt-8 max-w-xl font-mj text-2xl font-bold leading-snug tracking-tight text-[var(--mj-foam)] sm:text-3xl md:text-4xl">
          Votre boutique en ligne, prête en quelques minutes
        </h1>
        <p className="mj-rise mj-rise-3 mt-4 max-w-md text-base leading-relaxed text-[var(--mj-foam)]/70 sm:text-lg">
          Créez, personnalisez et vendez — hébergé pour le marché marocain.
        </p>
        <div className="mj-rise mj-rise-4 mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            to="/creer-boutique"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--mj-saffron)] px-5 py-3 text-sm font-semibold text-[var(--mj-ink)] transition hover:brightness-110"
          >
            Créer ma boutique
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#tarifs"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--mj-foam)]/25 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--mj-foam)] backdrop-blur-sm transition hover:border-[var(--mj-foam)]/45 hover:bg-white/10"
          >
            Voir le plan
          </a>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[var(--mj-foam)]/65 underline-offset-4 transition hover:text-[var(--mj-foam)] hover:underline"
          >
            Connexion admin
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="relative z-10 border-t border-white/10 bg-black/20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-mj text-3xl font-bold tracking-tight sm:text-4xl">Choisissez votre plan</h2>
          <p className="mt-3 max-w-lg text-[var(--mj-foam)]/65">
            Starter, Pro ou Business — évoluez quand votre boutique grandit. Paiement CMI sécurisé.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(sortedPlans.length > 0
              ? sortedPlans
              : [
                  { code: 'basic', name: 'Starter', priceMad: 150, description: 'Pour démarrer' },
                  { code: 'pro', name: 'Pro', priceMad: 299, description: 'Pour croître' },
                  { code: 'business', name: 'Business', priceMad: 599, description: 'Pour scaler' },
                ]
            ).map((plan, index) => (
              <div
                key={plan.code}
                className={`rounded-2xl border p-6 ${
                  index === 1
                    ? 'border-[var(--mj-lagoon)] bg-[var(--mj-lagoon)]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <p className="font-mj text-sm font-semibold uppercase tracking-[0.2em] text-[var(--mj-lagoon)]">
                  {plan.name}
                </p>
                <p className="mt-3 font-mj text-4xl font-extrabold tracking-tight">
                  {Number(plan.priceMad)}{' '}
                  <span className="text-xl font-bold">DHS</span>
                  <span className="ml-1 text-sm font-medium text-[var(--mj-foam)]/55">/mois</span>
                </p>
                <p className="mt-4 min-h-[3rem] text-sm text-[var(--mj-foam)]/65">
                  {plan.description || 'Boutique en ligne Matjarona'}
                </p>
                <Link
                  to={`/creer-boutique?plan=${encodeURIComponent(plan.code)}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--mj-lagoon)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--mj-lagoon-deep)]"
                >
                  Choisir {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-mj text-3xl font-bold tracking-tight sm:text-4xl">Comment ça marche</h2>
          <p className="mt-3 max-w-lg text-[var(--mj-foam)]/65">
            Trois étapes pour ouvrir votre espace de vente.
          </p>
          <ol className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Store,
                title: 'Créez votre espace',
                text: 'Choisissez un nom et un slug. Votre boutique est prête à personnaliser.',
              },
              {
                icon: Layers,
                title: 'Personnalisez',
                text: 'Couleurs, logo, sections accueil — votre identité, votre rythme.',
              },
              {
                icon: Zap,
                title: 'Vendez',
                text: 'Ajoutez vos produits, recevez les commandes, gérez tout depuis l’admin.',
              },
            ].map((step, i) => (
              <li key={step.title} className="relative">
                <span className="font-mj text-xs font-bold uppercase tracking-[0.25em] text-[var(--mj-saffron)]">
                  0{i + 1}
                </span>
                <step.icon className="mt-4 h-7 w-7 text-[var(--mj-lagoon)]" aria-hidden />
                <h3 className="mt-4 font-mj text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--mj-foam)]/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 className="font-mj text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à ouvrir votre boutique ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--mj-foam)]/65">
            Créez votre boutique en quelques minutes, ou connectez-vous si elle existe déjà.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/creer-boutique"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--mj-lagoon)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mj-lagoon-deep)]"
            >
              Créer ma boutique
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--mj-foam)]/25 px-6 py-3 text-sm font-semibold text-[var(--mj-foam)] transition hover:bg-white/5"
            >
              Connexion admin
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-[var(--mj-foam)]/40">
        © {new Date().getFullYear()} Matjarona
      </footer>
    </div>
  );
};

export default MatjaronaHome;
