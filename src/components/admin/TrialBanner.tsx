import { CalendarClock, Lock } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { CONTACT_EMAIL } from '@/config/site';
import { cn } from '@/lib/utils';

const DAY_MS = 24 * 60 * 60 * 1000;
/** En dessous de ce seuil (jours), la bannière passe en alerte. */
const ENDING_SOON_DAYS = 7;

/** Jours restants (arrondi au supérieur, min. 0) avant `trialEndsAt`. */
export function trialDaysLeft(trialEndsAt?: string | null, now = Date.now()): number | null {
  if (!trialEndsAt) return null;
  const end = new Date(trialEndsAt).getTime();
  if (Number.isNaN(end)) return null;
  return Math.max(0, Math.ceil((end - now) / DAY_MS));
}

/**
 * Bannière essai gratuit (admin) :
 * - TRIAL → jours restants (alerte sous 7 jours) ;
 * - PENDING avec `trialEndsAt` → essai terminé, vitrine fermée.
 */
const TrialBanner = () => {
  const { store } = useTenant();
  const { t } = useAdminLocale();
  const status = (store?.status || '').toUpperCase();
  const daysLeft = trialDaysLeft(store?.trialEndsAt);

  if (daysLeft == null) return null;
  const ended = status === 'PENDING';
  if (status !== 'TRIAL' && !ended) return null;

  const soon = !ended && daysLeft <= ENDING_SOON_DAYS;
  const title = ended
    ? t('trial.endedTitle')
    : soon
      ? t('trial.endingTitle', { count: daysLeft })
      : t('trial.activeTitle', { count: daysLeft });
  const body = ended ? t('trial.endedBody') : t('trial.activeBody');
  const Icon = ended ? Lock : CalendarClock;

  return (
    <div
      role={ended ? 'alert' : 'status'}
      className={cn(
        'mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5',
        ended
          ? 'border-destructive/40 bg-destructive/5'
          : soon
            ? 'border-amber-500/40 bg-amber-50'
            : 'border-primary/20 bg-primary/5',
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('mt-0.5 h-5 w-5 shrink-0', ended ? 'text-destructive' : soon ? 'text-amber-700' : 'text-primary')}
          aria-hidden
        />
        <div>
          <p className="font-display text-sm font-semibold sm:text-base">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
      {ended || soon ? (
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(store?.siteName ? `Plan – ${store.siteName}` : 'Choix du plan')}`}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {t('trial.contact')}
        </a>
      ) : null}
    </div>
  );
};

export default TrialBanner;
