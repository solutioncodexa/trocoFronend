import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { goldPricesApi } from '@/services/api/goldPrices';
import type { GoldPricePointDTO } from '@/types/api';
import { useGoldPriceUnit, OZ_TO_GRAM } from '@/hooks/useGoldPriceUnit';

const MAX_POINTS = 365;

function formatPrice(value: number, decimals = 0): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}

const GoldPriceChart = ({ data, unit, priceDecimals }: { data: GoldPricePointDTO[]; unit: 'oz' | 'gram'; priceDecimals: number }) => {
  const chartData = data
    .slice(-MAX_POINTS)
    .map((p) => ({ ...p, price: unit === 'gram' ? p.price / OZ_TO_GRAM : p.price }));

  return (
    <div className="w-full h-[320px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            tickFormatter={(v) => formatPrice(v, priceDecimals)}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            width={60}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload;
              return (
                <div className="rounded-lg border border-primary/30 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {formatDate(p.date)}
                  </p>
                  <p className="font-semibold text-primary">{formatPrice(p.price, priceDecimals)} MAD/{unit === 'gram' ? 'g' : 'oz'}</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(43, 70%, 47%)"
            strokeWidth={2}
            fill="url(#goldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const GoldPriceSection = () => {
  const { unit, setUnit, unitLabel, toDisplayPrice } = useGoldPriceUnit();
  const { data, isLoading, error } = useQuery({
    queryKey: ['gold-prices'],
    queryFn: () => goldPricesApi.getGoldPrices(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-secondary-dark dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-px bg-primary/60 mb-4"></div>
            <h2 className="font-script text-5xl text-primary mb-2">Cours de l&apos;Or</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              XAU / MAD par once
            </p>
            <div className="w-16 h-px bg-primary/60 mt-4"></div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-background/30 p-8 flex items-center justify-center h-[360px]">
            <p className="text-muted-foreground animate-pulse">Chargement du cours de l&apos;or…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-16 md:py-24 bg-secondary-dark dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-px bg-primary/60 mb-4"></div>
            <h2 className="font-script text-5xl text-primary mb-2">Cours de l&apos;Or</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              XAU / MAD par once
            </p>
            <div className="w-16 h-px bg-primary/60 mt-4"></div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-destructive text-sm">
              Impossible de charger les prix. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const history = data.history ?? [];
  const hasHistory = history.length > 0;
  const displayPrice = toDisplayPrice(data.currentPrice);
  const priceDecimals = unit === 'gram' ? 2 : 0;

  return (
    <section className="py-16 md:py-24 bg-secondary-dark dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-px bg-primary/60 mb-4"></div>
          <h2 className="font-script text-5xl text-primary mb-2">Cours de l&apos;Or</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            XAU / MAD par {unit === 'gram' ? 'gramme' : 'once'}
          </p>
          <div className="w-16 h-px bg-primary/60 mt-4"></div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-background/30 dark:bg-card/50 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Prix actuel
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                {formatPrice(displayPrice, priceDecimals)} {unitLabel}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex rounded-md border border-border p-0.5">
                <button
                  type="button"
                  onClick={() => setUnit('gram')}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${unit === 'gram' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  MAD/g
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('oz')}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${unit === 'oz' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  MAD/oz
                </button>
              </div>
              {data.source && (
                <p className="text-xs text-muted-foreground">
                  Source : {data.source}
                </p>
              )}
            </div>
          </div>

          {hasHistory ? (
            <GoldPriceChart data={history} unit={unit} priceDecimals={priceDecimals} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Historique indisponible
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoldPriceSection;
