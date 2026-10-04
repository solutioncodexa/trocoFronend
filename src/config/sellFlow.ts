/**
 * « Préparer la vente » : livraison et paiement par carte. Logique pure (validation, codes, secrets),
 * sans réseau. Les enregistrements passent par l'API existante, jamais par le modèle.
 */

// ───────────── Livraison ─────────────

// Transporteurs courants au Maroc (suggestions : la boutique reste libre d'en saisir un autre).
export const CARRIER_SUGGESTIONS = ['Amana', 'Ozon Express', 'Cathedis', 'Aramex', 'DHL'] as const;

/** Code transporteur : majuscules, chiffres et tirets bas, 30 caractères max, unique parmi les existants. */
export function carrierCode(name: string, existing: string[]): string {
  const base =
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 26) || 'TRANSPORTEUR';
  const used = new Set(existing.map((c) => c.toUpperCase()));
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}_${i}`)) i += 1;
  return `${base}_${i}`;
}

export const validCarrierName = (v: string) => {
  const t = v.trim();
  return t.length >= 2 && t.length <= 60 && !/[<>]/.test(t);
};

/** Frais en MAD : zéro accepté (livraison offerte), jusqu'à 100 000, virgule acceptée. */
export function parseFee(v: string): number | null {
  const n = Number(v.trim().replace(',', '.'));
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 100_000 ? n : null;
}

/** Délai en jours : « 3 », « 2-4 », « 2 à 4 », « 2–4 ». Minimum ≥ 1, maximum ≤ 60, min ≤ max. */
export function parseEta(v: string): { min: number; max: number } | null {
  const m = v.trim().match(/^(\d{1,2})\s*(?:[-–—]|à|a|to)?\s*(\d{1,2})?$/i);
  if (!m) return null;
  const min = Number(m[1]);
  const max = m[2] !== undefined ? Number(m[2]) : min;
  return min >= 1 && max <= 60 && min <= max ? { min, max } : null;
}

// ───────────── Paiement par carte ─────────────

export type Provider = 'stripe' | 'paypal' | 'cmi';
export type KeyField = 'stripePk' | 'stripeSk' | 'paypalId' | 'paypalSecret' | 'cmiId' | 'cmiKey';

/** Champs demandés, dans l'ordre, pour chaque prestataire. `secret` : jamais affiché ni conservé dans la conversation. */
export const PROVIDER_FIELDS: Record<Provider, { field: KeyField; secret: boolean }[]> = {
  stripe: [
    { field: 'stripePk', secret: false },
    { field: 'stripeSk', secret: true },
  ],
  paypal: [
    { field: 'paypalId', secret: false },
    { field: 'paypalSecret', secret: true },
  ],
  cmi: [
    { field: 'cmiId', secret: false },
    { field: 'cmiKey', secret: true },
  ],
};

const FIELD_PATTERN: Record<KeyField, RegExp> = {
  stripePk: /^pk_(live|test)_[A-Za-z0-9]{10,200}$/,
  stripeSk: /^(sk|rk)_(live|test)_[A-Za-z0-9]{10,200}$/,
  paypalId: /^[A-Za-z0-9_-]{20,200}$/,
  paypalSecret: /^[A-Za-z0-9_-]{20,200}$/,
  cmiId: /^[A-Za-z0-9_-]{3,100}$/,
  cmiKey: /^\S{8,200}$/,
};

export const validKeyField = (field: KeyField, value: string) => FIELD_PATTERN[field].test(value.trim());

export const PAYPAL_MODES = ['sandbox', 'live'] as const;

/** Repère un mode test ou réel d'après la clé Stripe (aucun paiement réel en mode test). */
export const stripeKeyIsLive = (key: string) => /^(sk|pk|rk)_live_/.test(key.trim());

// ───────────── Secrets ─────────────

const SECRET_PATTERNS: RegExp[] = [
  /\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9]{8,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/i,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /(?<![A-Za-z0-9/._-])[A-Za-z0-9_-]{40,}(?![A-Za-z0-9/._-])/,
];

/** Vrai si le texte ressemble à une clé ou un jeton : on ne l'envoie jamais au modèle ni ne le garde en historique. */
export const looksLikeSecret = (text: string) => SECRET_PATTERNS.some((re) => re.test(text));

export const MASK = '••••••••';
