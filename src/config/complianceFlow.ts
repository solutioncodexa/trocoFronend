/**
 * Conformité (loi 09-08 / CNDP) : pages légales, consentement aux cookies, durée de conservation des données.
 * Logique pure, sans réseau.
 */
export type ComplianceStepId = 'pages' | 'cookies' | 'retention';

type FlowInput = {
  privacyPolicyUrl?: string | null;
  /** La page « politique de confidentialité » existe déjà dans la boutique. */
  hasPrivacyPage: boolean;
  cookieConsentRequired?: boolean | null;
  /** Au moins un pixel publicitaire ou de mesure est renseigné. */
  usesPixels: boolean;
  cndpNoticeVersion?: string | null;
};

const blank = (v?: string | null) => !v || !v.trim();

export function buildComplianceFlow(i: FlowInput): ComplianceStepId[] {
  const steps: ComplianceStepId[] = [];
  const externalPolicy = /^https?:\/\//i.test((i.privacyPolicyUrl ?? '').trim());
  if (!i.hasPrivacyPage && !externalPolicy) steps.push('pages');
  if (i.usesPixels && i.cookieConsentRequired === false) steps.push('cookies');
  if (blank(i.cndpNoticeVersion)) steps.push('retention');
  return steps;
}

/** Durées de conservation proposées, en jours. */
export const RETENTION_CHOICES = [180, 365, 730, 1095] as const;

/** Version de l'information CNDP enregistrée une fois la durée choisie. */
export const CNDP_NOTICE_VERSION = '1';

export const retentionLabelKey = (days: number) =>
  days >= 365 ? ('assistant.legal.retention.years' as const) : ('assistant.legal.retention.months' as const);

export const retentionValue = (days: number) => (days >= 365 ? Math.round(days / 365) : Math.round(days / 30));
