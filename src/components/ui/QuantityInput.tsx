import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Raccourcis « +5 / +10 » sous le champ (utile pour les grosses commandes). */
  quickSteps?: number[];
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Sélecteur de quantité : boutons −/+ et saisie directe (50 se tape en 2 touches),
 * avec raccourcis optionnels. La saisie est validée au blur / Entrée.
 */
export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  quickSteps,
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Quantité',
}: Props) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    const next = Number.isFinite(parsed) ? clamp(parsed, min, max) : value;
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const step = (delta: number) => onChange(clamp(value + delta, min, max));
  const btn = cn(
    'flex touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40',
    size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
  );

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      <div className="inline-flex items-center overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          aria-label="Diminuer la quantité"
          className={cn(btn, 'border-r border-border')}
          disabled={value <= min}
          onClick={() => step(-1)}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={ariaLabel}
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, String(max).length))}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(e.currentTarget.value);
              e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              step(1);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              step(-1);
            }
          }}
          className={cn(
            'bg-transparent text-center font-semibold tabular-nums outline-none focus:bg-muted/50',
            size === 'sm' ? 'h-9 w-12 text-sm' : 'h-11 w-16 text-base',
          )}
        />
        <button
          type="button"
          aria-label="Augmenter la quantité"
          className={cn(btn, 'border-l border-border')}
          disabled={value >= max}
          onClick={() => step(1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {quickSteps?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {quickSteps.map((n) => (
            <button
              key={n}
              type="button"
              disabled={value >= max}
              onClick={() => step(n)}
              className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground disabled:opacity-40"
            >
              +{n}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
