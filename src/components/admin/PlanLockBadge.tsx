import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAN_LABEL, type PlanCode } from '@/config/planGates';

/** Petite couronne affichée à côté des fonctions qui demandent un plan supérieur. */
export function PlanLockBadge({
  plan,
  className,
  tone = 'dark',
}: {
  plan: PlanCode;
  className?: string;
  /** « dark » pour la barre latérale sombre, « light » sur fond clair. */
  tone?: 'dark' | 'light';
}) {
  const label = `Réservé au plan ${PLAN_LABEL[plan]}`;
  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
        tone === 'dark' ? 'bg-amber-400/15 text-amber-400' : 'bg-amber-100 text-amber-700',
        className,
      )}
    >
      <Crown className="h-3 w-3" aria-hidden />
      {PLAN_LABEL[plan]}
    </span>
  );
}
