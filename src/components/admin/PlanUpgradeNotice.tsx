import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLAN_LABEL, type PlanCode } from '@/config/planGates';

/** Bandeau en tête d'une page réservée à un plan supérieur. */
export function PlanUpgradeNotice({ plan, feature }: { plan: PlanCode; feature: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Crown className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
      <p className="min-w-0 flex-1">
        <strong>{feature}</strong> {feature.startsWith('Les') ? 'sont' : 'est'} disponible
        {feature.startsWith('Les') ? 's' : ''} à partir du plan <strong>{PLAN_LABEL[plan]}</strong>. Vous pouvez
        parcourir la page, mais l’activation nécessite de changer de plan.
      </p>
      <Button asChild size="sm" className="shrink-0">
        <Link to="/admin/reglages">Passer au plan {PLAN_LABEL[plan]}</Link>
      </Button>
    </div>
  );
}
