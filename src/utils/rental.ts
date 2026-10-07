/**
 * Location : durées, prix et libellés. Une période est exprimée en jours INCLUS (du 10 au 10 = 1 jour),
 * l'unité de facturation du produit est le jour (par défaut) ou la semaine commencée.
 * Mêmes règles que le backend (`RentalRules`).
 */
export type RentalUnit = 'DAY' | 'WEEK';

export type RentalInfo = {
  /** Premier jour, `YYYY-MM-DD`. */
  start: string;
  /** Dernier jour inclus, `YYYY-MM-DD`. */
  end: string;
  unit: RentalUnit;
  deposit?: number | null;
};

export const normalizeRentalUnit = (u?: string | null): RentalUnit => (u?.toUpperCase() === 'WEEK' ? 'WEEK' : 'DAY');

/** `Date` locale → `YYYY-MM-DD` (sans passer par l'UTC, qui décalerait d'un jour). */
export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function rentalDays(start: string, end: string): number {
  const ms = fromISODate(end).getTime() - fromISODate(start).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function rentalUnits(unit: RentalUnit, start: string, end: string): number {
  const days = rentalDays(start, end);
  return unit === 'WEEK' ? Math.ceil(days / 7) : days;
}

/** « 1 jour », « 3 jours », « 2 semaines ». */
export function formatRentalDuration(unit: RentalUnit, units: number): string {
  if (unit === 'WEEK') return `${units} semaine${units > 1 ? 's' : ''}`;
  return `${units} jour${units > 1 ? 's' : ''}`;
}

export function unitSuffix(unit: RentalUnit): string {
  return unit === 'WEEK' ? 'semaine' : 'jour';
}

const fmt = (iso: string) =>
  fromISODate(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** « 10/10/2026 » ou « 10/10/2026 → 12/10/2026 ». */
export function formatRentalPeriod(start: string, end: string): string {
  return start === end ? fmt(start) : `${fmt(start)} → ${fmt(end)}`;
}

/** Une ligne de panier / commande est-elle une location ? */
export function isRentalLine(item: { rentalStart?: string | null; rentalEnd?: string | null }): boolean {
  return !!item.rentalStart && !!item.rentalEnd;
}

/** Total d'une ligne : prix × quantité, multiplié par les unités de location si c'est une location. */
export function lineTotal(item: {
  product: { price: number };
  quantity: number;
  rentalStart?: string | null;
  rentalEnd?: string | null;
  rentalUnit?: RentalUnit | null;
}): number {
  const units =
    item.rentalStart && item.rentalEnd ? rentalUnits(normalizeRentalUnit(item.rentalUnit), item.rentalStart, item.rentalEnd) : 1;
  return item.product.price * item.quantity * units;
}

/** Clé de ligne de panier : deux périodes différentes du même produit restent deux lignes. */
export function rentalLineKey(variantKey: string, start: string, end: string): string {
  return `${variantKey}|loc:${start}:${end}`;
}

/** Jours indisponibles pour la quantité demandée : `available < quantity` ou passé. */
export type RentalDay = { date: string; available: number };

/**
 * Location en retard : la dernière journée est passée et la commande n'est ni retournée ni annulée.
 * (Le statut « Retourné » libère les dates ; « Livrée » = remise du matériel, à récupérer à la fin.)
 */
export function isRentalOverdue(end: string, orderStatus?: string | null): boolean {
  const status = (orderStatus ?? '').toUpperCase();
  if (status === 'RETURNED' || status === 'CANCELLED') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return fromISODate(end).getTime() < today.getTime();
}
