import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { productsApi } from '@/services/api/products';
import { formatPrice } from '@/utils/formatPrice';
import {
  formatRentalDuration,
  formatRentalPeriod,
  rentalDays,
  rentalUnits,
  toISODate,
  unitSuffix,
  type RentalUnit,
} from '@/utils/rental';

/** Fenêtre de réservation proposée au client (le backend plafonne le calendrier à 120 jours). */
const WINDOW_DAYS = 119;

export type RentalSelection = {
  start: string;
  end: string;
  units: number;
  /** Quantité maximale réservable sur toute la période (min des disponibilités). */
  maxQuantity: number;
} | null;

type Props = {
  productId: string;
  variantId?: string;
  unit: RentalUnit;
  unitPrice: number;
  quantity: number;
  deposit?: number | null;
  minUnits?: number | null;
  maxUnits?: number | null;
  onChange: (selection: RentalSelection) => void;
};

/**
 * Choix de la période de location : calendrier de disponibilité (jours complets grisés) + récapitulatif.
 * Un seul clic = location d'un jour ; deux clics = période.
 */
export function RentalPicker({ productId, variantId, unit, unitPrice, quantity, deposit, minUnits, maxUnits, onChange }: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const lastDay = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + WINDOW_DAYS), [today]);
  const [range, setRange] = useState<DateRange | undefined>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rental-availability', productId, variantId ?? null],
    queryFn: () => productsApi.rentalAvailability(productId, toISODate(today), toISODate(lastDay), variantId),
    staleTime: 20_000,
  });

  const availableByDate = useMemo(() => new Map((data?.days ?? []).map((d) => [d.date, d.available])), [data]);
  const free = (d: Date) => availableByDate.get(toISODate(d)) ?? 0;

  const start = range?.from ? toISODate(range.from) : null;
  const end = range?.from ? toISODate(range.to ?? range.from) : null;
  const units = start && end ? rentalUnits(unit, start, end) : 0;

  const maxQuantity = useMemo(() => {
    if (!range?.from) return 0;
    const to = range.to ?? range.from;
    let min = Number.POSITIVE_INFINITY;
    for (let d = new Date(range.from); d <= to; d.setDate(d.getDate() + 1)) min = Math.min(min, free(d));
    return Number.isFinite(min) ? min : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, availableByDate]);

  useEffect(() => {
    onChange(start && end ? { start, end, units, maxQuantity } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, units, maxQuantity]);

  // Un autre exemplaire / variante a un autre stock : on repart d'une sélection vide.
  useEffect(() => setRange(undefined), [variantId]);

  const allFree = (from: Date, to: Date) => {
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) if (free(d) < quantity) return false;
    return true;
  };

  const handleSelect = (next: DateRange | undefined, clicked: Date) => {
    if (!next?.from) return setRange(undefined);
    const to = next.to ?? next.from;
    // Une période qui traverse un jour complet est refusée : on repart du jour cliqué.
    setRange(allFree(next.from, to) ? next : { from: clicked, to: undefined });
  };

  const unitLabel = unitSuffix(unit);
  const tooShort = units > 0 && minUnits != null && units < minUnits;
  const tooLong = units > 0 && maxUnits != null && units > maxUnits;
  const qtyTooHigh = units > 0 && quantity > maxQuantity;

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <CalendarDays className="h-4 w-4 text-primary" />
        Dates de location
        <span className="ml-auto text-xs font-normal text-muted-foreground">
          {formatPrice(unitPrice)} / {unitLabel}
        </span>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">Impossible de charger les disponibilités. Réessayez dans un instant.</p>
      ) : (
        <div className={isLoading ? 'pointer-events-none opacity-50' : undefined}>
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            fromDate={today}
            toDate={lastDay}
            disabled={(d) => d < today || d > lastDay || free(d) < quantity}
            modifiers={{ full: (d) => d >= today && d <= lastDay && free(d) < 1 }}
            modifiersClassNames={{ full: 'line-through opacity-40' }}
            className="mx-auto rounded-xl bg-background"
          />
        </div>
      )}

      <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <Info className="mt-px h-3 w-3 shrink-0" />
        Cliquez une date pour 1 {unit === 'WEEK' ? 'semaine' : 'jour'}, ou deux dates pour une période. Les jours barrés sont
        complets{quantity > 1 ? ` (pour ${quantity} exemplaires)` : ''}.
      </p>

      {start && end ? (
        <div className="space-y-1 rounded-xl bg-background p-3 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Période</span>
            <span className="font-medium">{formatRentalPeriod(start, end)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Durée</span>
            <span className="font-medium">
              {formatRentalDuration(unit, units)}
              {unit === 'WEEK' ? ` (${rentalDays(start, end)} j)` : ''}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Disponibles</span>
            <span className="font-medium">{maxQuantity}</span>
          </div>
          {deposit ? (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Caution (à la remise)</span>
              <span className="font-medium">{formatPrice(deposit * quantity)}</span>
            </div>
          ) : null}
          {tooShort ? <p className="pt-1 text-xs font-medium text-destructive">Durée minimale : {formatRentalDuration(unit, minUnits!)}.</p> : null}
          {tooLong ? <p className="pt-1 text-xs font-medium text-destructive">Durée maximale : {formatRentalDuration(unit, maxUnits!)}.</p> : null}
          {qtyTooHigh ? (
            <p className="pt-1 text-xs font-medium text-destructive">
              Seulement {maxQuantity} disponible{maxQuantity > 1 ? 's' : ''} sur cette période.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
