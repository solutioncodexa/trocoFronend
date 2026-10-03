import { Check, Crown } from 'lucide-react';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { ThemeOption } from '@/config/designFlow';
import { cn } from '@/lib/utils';

const chip =
  'rounded-full border px-3 py-1 text-xs transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50';

/** Cartes de thèmes : les thèmes que le plan n'inclut pas portent une couronne et expliquent comment les obtenir. */
export function ThemePickWidget({
  options,
  onPick,
  busy,
}: {
  options: ThemeOption[];
  onPick: (key: ThemeOption['key']) => void;
  busy?: boolean;
}) {
  const { t } = useAdminLocale();
  return (
    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          disabled={busy}
          onClick={() => onPick(o.key)}
          aria-label={t(`assistant.design.theme.${o.key}`)}
          className={cn(
            'rounded-lg border bg-background p-2 text-start transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50',
            o.active && 'border-primary ring-1 ring-primary',
            o.locked && 'opacity-80',
          )}
        >
          <span className="mb-1.5 flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: o.primary }} aria-hidden />
            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: o.secondary }} aria-hidden />
            <span className="ms-auto flex items-center gap-1 text-[10px] font-medium">
              {o.active ? (
                <span className="flex items-center gap-0.5 text-primary">
                  <Check className="h-3 w-3" aria-hidden />
                  {t('assistant.design.theme.active')}
                </span>
              ) : null}
              {o.locked ? (
                <span className="flex items-center gap-0.5 text-amber-600">
                  <Crown className="h-3 w-3" aria-hidden />
                  {t('assistant.design.theme.pro')}
                </span>
              ) : null}
            </span>
          </span>
          <span className="block text-sm font-semibold">{t(`assistant.design.theme.${o.key}`)}</span>
          <span className="block text-xs text-muted-foreground">{t(`assistant.design.theme.${o.key}.desc`)}</span>
        </button>
      ))}
    </div>
  );
}

export function ChipsWidget({
  options,
  onPick,
  busy,
}: {
  options: { id: string; label: string }[];
  onPick: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.id} type="button" className={chip} disabled={busy} onClick={() => onPick(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
