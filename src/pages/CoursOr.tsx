import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import Layout from '@/components/layout/Layout';

const PERIODS = [
  { key: '7j', label: '7 jours', days: 7 },
  { key: '1M', label: '1 mois', days: 30 },
  { key: '3M', label: '3 mois', days: 90 },
  { key: '6M', label: '6 mois', days: 180 },
  { key: '1an', label: '1 an', days: 365 },
] as const;

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

const GoldPriceChart = ({
  data,
  unit,
  priceDecimals,
}: {
  data: GoldPricePointDTO[];
  unit: 'oz' | 'gram';
  priceDecimals: number;
}) => {
  const chartData = useMemo(
    () => data.map((p) => ({ ...p, price: unit === 'gram' ? p.price / OZ_TO_GRAM : p.price })),
    [data, unit],
  );

  return (
    <div className="w-full h-[400px] md:h-[480px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGradientPage" x1="0" y1="0" x2="0" y2="1">
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
            width={70}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload;
              return (
                <div className="rounded-lg border border-primary/30 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{formatDate(p.date)}</p>
                  <p className="font-semibold text-primary">
                    {formatPrice(p.price, priceDecimals)} MAD/{unit === 'gram' ? 'g' : 'oz'}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(43, 70%, 47%)"
            strokeWidth={2}
            fill="url(#goldGradientPage)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ARTICLES = [
  {
    title: 'Comment investir dans l\'or en 2025',
    excerpt: 'Découvrez les différentes façons d\'investir dans l\'or : physique, ETF, miner...',
  },
  {
    title: 'L\'or : une valeur refuge face à l\'inflation',
    excerpt: 'Pourquoi l\'or reste un actif privilégié en période d\'incertitude économique.',
  },
  {
    title: 'Prix de l\'or : tendances et prévisions',
    excerpt: 'Analyse des facteurs qui influencent le cours de l\'or en dirham marocain.',
  },
];

const CoursOr = () => {
  const { unit, setUnit, unitLabel, toDisplayPrice } = useGoldPriceUnit();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['key']>('3M');

  const { data, isLoading, error } = useQuery({
    queryKey: ['gold-prices'],
    queryFn: () => goldPricesApi.getGoldPrices(),
    staleTime: 5 * 60 * 1000,
  });

  const history = data?.history ?? [];
  const priceDecimals = unit === 'gram' ? 2 : 0;

  const filteredHistory = useMemo(() => {
    if (history.length === 0) return [];
    const days = PERIODS.find((p) => p.key === period)?.days ?? 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return history.filter((p) => new Date(p.date) >= cutoff);
  }, [history, period]);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-12 md:py-20 bg-background">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground animate-pulse">Chargement du cours de l&apos;or…</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <section className="py-12 md:py-20 bg-background">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
              <p className="text-destructive">Impossible de charger les prix. Veuillez réessayer plus tard.</p>
              <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const displayPrice = toDisplayPrice(data.currentPrice);

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-px bg-primary/60 mx-auto mb-4"></div>
            <h1 className="font-script text-4xl md:text-6xl text-primary mb-2">Cours de l&apos;Or</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">XAU / MAD</p>
            <div className="w-16 h-px bg-primary/60 mx-auto mt-4"></div>
          </div>

          {/* Articles */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {ARTICLES.map((article, i) => (
              <article
                key={i}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </article>
            ))}
          </div>

          {/* Graph card */}
          <div className="rounded-xl border border-primary/20 bg-card/50 p-6 md:p-8 shadow-lg">
            {/* Filters & Price */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Prix actuel</p>
                <p className="text-2xl md:text-3xl font-semibold text-primary">
                  {formatPrice(displayPrice, priceDecimals)} {unitLabel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Period filter */}
                <div className="flex rounded-md border border-border p-0.5">
                  {PERIODS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPeriod(p.key)}
                      className={`px-3 py-1.5 text-sm rounded transition-colors ${
                        period === p.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Unit filter */}
                <div className="flex rounded-md border border-border p-0.5">
                  <button
                    type="button"
                    onClick={() => setUnit('gram')}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      unit === 'gram' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    MAD/g
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('oz')}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      unit === 'oz' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    MAD/oz
                  </button>
                </div>

                {data.source && (
                  <p className="text-xs text-muted-foreground">Source : {data.source}</p>
                )}
              </div>
            </div>

            {/* Chart */}
            {filteredHistory.length > 0 ? (
              <GoldPriceChart data={filteredHistory} unit={unit} priceDecimals={priceDecimals} />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Aucune donnée pour cette période
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursOr;
