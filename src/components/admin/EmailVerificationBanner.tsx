import { useState } from 'react';
import { MailWarning } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '@/contexts/AdminContext';
import { resendVerificationEmail } from '@/services/api/auth';
import { toastError } from '@/utils/toastMessages';

/** Rappel non bloquant : l'email du compte admin n'est pas encore confirmé. */
const EmailVerificationBanner = () => {
  const { user } = useAdmin();
  const [pending, setPending] = useState(false);

  if (!user || user.role !== 'ADMIN' || user.emailVerified !== false) return null;

  const resend = async () => {
    setPending(true);
    try {
      await resendVerificationEmail();
      toast.success(`Email de vérification envoyé à ${user.email}`);
    } catch (err) {
      toastError(err, 'Envoi impossible');
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-amber-950">Confirmez votre adresse email</p>
          <p className="text-sm text-amber-900/80">
            Nous avons envoyé un lien à {user.email}. Il nous permet de vous prévenir avant la fin de votre essai.
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => void resend()}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-600/40 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
      >
        {pending ? 'Envoi…' : 'Renvoyer l’email'}
      </button>
    </div>
  );
};

export default EmailVerificationBanner;
