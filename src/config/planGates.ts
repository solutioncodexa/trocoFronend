/** Ordre des plans : un plan donne accès à tout ce que les plans inférieurs incluent. */
const PLAN_RANK: Record<string, number> = { basic: 0, pro: 1, business: 2 };

export type PlanCode = 'basic' | 'pro' | 'business';

export const PLAN_LABEL: Record<PlanCode, string> = { basic: 'Basic', pro: 'Pro', business: 'Business' };

export function planRank(code?: string | null): number {
  return PLAN_RANK[(code || 'basic').toLowerCase()] ?? 0;
}

export function isPlanAtLeast(current: string | null | undefined, required: PlanCode): boolean {
  return planRank(current) >= planRank(required);
}

/**
 * Pages admin réservées à un plan supérieur (le backend renvoie 402 sinon).
 * Clé = préfixe d'URL admin.
 */
export const ADMIN_PLAN_GATES: Record<string, { plan: PlanCode; feature: string }> = {
  '/admin/paniers-abandonnes': { plan: 'pro', feature: 'La relance des paniers abandonnés' },
  '/admin/webhooks': { plan: 'pro', feature: 'Les webhooks' },
  '/admin/api-keys': { plan: 'pro', feature: 'L’API headless' },
};

export function adminPlanGate(href: string) {
  return ADMIN_PLAN_GATES[href];
}

/** Plan minimal d'un thème : Basic = Classique + Minimal, le reste demande Pro (cf. PlanFeatures côté backend). */
export function themeMinPlan(themeKey?: string | null): PlanCode {
  const k = (themeKey || 'classic').toLowerCase();
  return k === 'classic' || k === 'minimal' ? 'basic' : 'pro';
}

export function isThemeAllowed(planCode: string | null | undefined, themeKey?: string | null): boolean {
  return isPlanAtLeast(planCode, themeMinPlan(themeKey));
}
