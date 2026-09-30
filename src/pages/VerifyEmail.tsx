import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { verifyEmail } from '@/services/api/auth';

type State = 'loading' | 'ok' | 'error';

/** Page publique ouverte depuis le lien de l'email de vérification. */
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() || '';
  const [state, setState] = useState<State>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? '' : 'Lien de vérification invalide.');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    verifyEmail(token)
      .then(() => {
        if (!cancelled) setState('ok');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setMessage(err instanceof Error ? err.message : 'Vérification impossible.');
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        {state === 'loading' ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" aria-hidden />
            <p className="mt-4 text-sm text-muted-foreground">Vérification en cours…</p>
          </>
        ) : null}
        {state === 'ok' ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden />
            <h1 className="mt-4 font-display text-xl font-semibold">Adresse email confirmée</h1>
            <p className="mt-2 text-sm text-muted-foreground">Merci ! Votre compte est maintenant sécurisé.</p>
            <Link
              to="/admin"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Accéder à mon espace
            </Link>
          </>
        ) : null}
        {state === 'error' ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden />
            <h1 className="mt-4 font-display text-xl font-semibold">Vérification impossible</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous à votre espace admin pour recevoir un nouvel email.
            </p>
            <Link
              to="/admin"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Connexion admin
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyEmail;
