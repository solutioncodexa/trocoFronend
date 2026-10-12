import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { assistantApi, type AiMeter } from '@/services/api/assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const nf = new Intl.NumberFormat('fr-FR');

function Meter({ label, meter }: { label: string; meter: AiMeter }) {
  const pct = meter.limit > 0 ? Math.min(100, Math.round((meter.used / meter.limit) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className={pct >= 90 ? 'font-medium text-destructive' : 'text-muted-foreground'}>
          {nf.format(meter.used)} / {nf.format(meter.limit)}
        </span>
      </div>
      <Progress value={pct} className="h-2" aria-label={label} />
    </div>
  );
}

/** Consommation IA du jour face aux limites du plan, et tendance sur 7 jours. */
export default function AiUsageCard() {
  const { data } = useQuery({
    queryKey: ['assistant-usage'],
    queryFn: assistantApi.usage,
    staleTime: 60_000,
    retry: false,
  });
  if (!data) return null;
  const maxTokens = Math.max(1, ...data.days.map((d) => d.tokens));
  const week = [...data.days].reverse();
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="h-4 w-4 text-primary" /> Utilisation de l’IA
        </CardTitle>
        <span className="text-xs text-muted-foreground">Plan {data.plan} · remis à zéro chaque jour</span>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Meter label="Messages" meter={data.messages} />
          <Meter label="Tokens" meter={data.tokens} />
          <Meter label="Logos générés" meter={data.images} />
        </div>
        {data.topupTokens > 0 ? (
          <p className="text-sm text-muted-foreground">
            Tokens supplémentaires disponibles : <strong>{nf.format(data.topupTokens)}</strong> (utilisés après le budget du jour)
          </p>
        ) : null}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Tokens sur 7 jours</p>
          <div className="flex h-16 items-end gap-1.5" role="img" aria-label="Tokens consommés par jour sur 7 jours">
            {week.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day} : ${nf.format(d.tokens)} tokens, ${d.messages} messages`}>
                <div
                  className="w-full rounded-sm bg-primary/70"
                  style={{ height: `${Math.max(4, Math.round((d.tokens / maxTokens) * 100))}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.day.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
