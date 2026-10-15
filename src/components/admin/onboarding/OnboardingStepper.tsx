import { Check } from 'lucide-react';

type Props = {
  labels: string[];
  current: number;
  ariaLabel: string;
  /** Texte « Étape 2 sur 4 · environ 3 min » affiché sous le rail. */
  counter: string;
  onSelect: (index: number) => void;
};

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/** Un seul rail : étapes faites (coche), étape courante (anneau), étapes à venir. Remplace pastilles + barre + compteur. */
export function OnboardingStepper({ labels, current, ariaLabel, counter, onSelect }: Props) {
  return (
    <nav aria-label={ariaLabel} className="space-y-2">
      <ol className="flex items-start">
        {labels.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="relative flex min-w-0 flex-1 flex-col items-start gap-1.5 last:flex-none">
              {i < labels.length - 1 ? (
                <span
                  aria-hidden
                  className={`absolute start-8 end-1 top-4 h-0.5 -translate-y-1/2 rounded-full transition-colors motion-reduce:transition-none ${
                    done ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ) : null}
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={active ? 'step' : undefined}
                className={`group relative z-10 flex min-h-11 items-start gap-2 rounded-full pe-2 sm:min-h-9 ${FOCUS_RING}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold transition-colors motion-reduce:transition-none ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : done
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground group-hover:border-primary/50'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={`mt-1.5 truncate bg-background pe-1 text-xs font-semibold ${
                    active ? 'inline text-foreground' : 'hidden text-muted-foreground sm:inline'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground">{counter}</p>
    </nav>
  );
}
