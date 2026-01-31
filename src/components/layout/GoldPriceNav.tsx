import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { goldPricesApi } from '@/services/api/goldPrices';
import type { GoldPricePointDTO } from '@/types/api';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'react-router-dom';
import { useGoldPriceUnit, OZ_TO_GRAM } from '@/hooks/useGoldPriceUnit';
import { TrendingUp, BarChart3 } from 'lucide-react';

const SPARKLINE_POINTS = 30;

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
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

const GoldPriceNav = () => {
  const { unit, setUnit, unitLabel, toDisplayPrice } = useGoldPriceUnit();
  const { data, isLoading } = useQuery({
    queryKey: ['gold-prices'],
    queryFn: () => goldPricesApi.getGoldPrices(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !data) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/5 text-muted-foreground text-xs animate-pulse">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>OR...</span>
      </div>
    );
  }

  const history = data.history ?? [];
  const displayPrice = toDisplayPrice(data.currentPrice);
  const priceDecimals = unit === 'gram' ? 2 : 0;
  const sparklineData = history.slice(-SPARKLINE_POINTS).map((p) => ({
    ...p,
    price: unit === 'gram' ? p.price / OZ_TO_GRAM : p.price,
  }));

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors group"
          aria-label="Cours de l'or - voir le graphique"
        >
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground group-hover:text-primary">
            OR {formatPrice(displayPrice, priceDecimals)} {unitLabel}
          </span>
          {sparklineData.length > 1 && (
            <div className="w-16 h-6 -mr-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                  <defs>
                    <linearGradient id="goldNavGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(43, 70%, 47%)"
                    strokeWidth={1.5}
                    fill="url(#goldNavGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="center" className="w-[340px] p-0 overflow-hidden">
        <div className="p-4 pb-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cours de l&apos;or XAU/MAD</p>
            <p className="text-xl font-semibold text-primary">{formatPrice(displayPrice, priceDecimals)} {unitLabel}</p>
          </div>
          <div className="flex rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setUnit('gram'); }}
              className={`px-2 py-1 text-xs rounded transition-colors ${unit === 'gram' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              g
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setUnit('oz'); }}
              className={`px-2 py-1 text-xs rounded transition-colors ${unit === 'oz' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              oz
            </button>
          </div>
        </div>
        {history.length > 0 ? (
          <div className="h-[200px] px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history.slice(-90).map((p) => ({ ...p, price: unit === 'gram' ? p.price / OZ_TO_GRAM : p.price }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldHoverGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(43, 70%, 47%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickFormatter={(v) => formatPrice(v, priceDecimals)}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  width={45}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload;
                    return (
                      <div className="rounded border border-primary/30 bg-background px-2 py-1.5 text-xs shadow-lg">
                        <p className="text-muted-foreground">{formatDate(p.date)}</p>
                        <p className="font-semibold text-primary">{formatPrice(p.price, priceDecimals)} {unitLabel}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(43, 70%, 47%)"
                  strokeWidth={2}
                  fill="url(#goldHoverGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
            Historique indisponible
          </div>
        )}
        <div className="p-3 border-t border-border">
          <Link
            to="/prix-or-maroc"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Voir le graphique complet
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default GoldPriceNav;
