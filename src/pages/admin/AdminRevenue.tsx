import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Ban } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { statsApi } from '@/services/api/stats';
import { formatPrice } from '@/utils/formatPrice';

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const AdminRevenue = () => {
  const today = useMemo(() => new Date(), []);
  const [preset, setPreset] = useState<'7' | '30' | '90' | 'custom'>('30');
  const [from, setFrom] = useState(() => isoDate(new Date(Date.now() - 30 * 86400000)));
  const [to, setTo] = useState(() => isoDate(today));

  const applyPreset = (p: '7' | '30' | '90') => {
    setPreset(p);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(p, 10));
    setFrom(isoDate(start));
    setTo(isoDate(end));
  };

  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'revenue', from, to],
    queryFn: () => statsApi.getRevenue(from, to),
  });

  const chartData = (data?.daily ?? []).map((d) => ({
    date: d.date,
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <AdminLayout title="Revenus" breadcrumbs={[{ label: 'Revenus' }]}>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={preset === p ? 'default' : 'outline'}
              onClick={() => applyPreset(p)}
            >
              {p}j
            </Button>
          ))}
          <Button
            size="sm"
            variant={preset === 'custom' ? 'default' : 'outline'}
            onClick={() => setPreset('custom')}
          >
            Personnalisé
          </Button>
        </div>
        <div>
          <Label className="text-xs">Du</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setPreset('custom');
              setFrom(e.target.value);
            }}
            className="mt-1 w-[160px]"
          />
        </div>
        <div>
          <Label className="text-xs">Au</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => {
              setPreset('custom');
              setTo(e.target.value);
            }}
            className="mt-1 w-[160px]"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> CA livré
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-display">
                {formatPrice(data?.deliveredRevenue ?? 0)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Commandes livrées
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-display">{data?.deliveredOrders ?? 0}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Panier moyen
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-display">
                {formatPrice(data?.averageBasket ?? 0)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Ban className="w-4 h-4" /> Taux annulation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-display">
                {(data?.cancellationRate ?? 0).toFixed(1)}%
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>CA journalier (livré)</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                {chartData.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune donnée sur la période</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value: number) => [formatPrice(value), 'CA']}
                        labelFormatter={(l) => String(l)}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CA confirmé</span>
                  <span className="font-medium">{formatPrice(data?.confirmedRevenue ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nouvelles</span>
                  <span className="font-medium">{data?.newOrders ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmées</span>
                  <span className="font-medium">{data?.confirmedOrders ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annulées</span>
                  <span className="font-medium">{data?.cancelledOrders ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total commandes</span>
                  <span className="font-medium">{data?.totalOrders ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top produits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(data?.topProducts ?? []).length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun produit vendu sur la période</p>
              ) : (
                (data?.topProducts ?? []).map((p, i) => (
                  <div
                    key={p.productId}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-muted-foreground w-6">{i + 1}.</span>
                      <span className="font-medium truncate">{p.productName}</span>
                      <span className="text-xs text-muted-foreground shrink-0">×{p.quantitySold}</span>
                    </div>
                    <span className="font-medium shrink-0">{formatPrice(p.revenue)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminRevenue;
