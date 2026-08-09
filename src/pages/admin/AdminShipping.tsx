import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Truck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { shippingApi } from '@/services/api/shipping';
import type { ShippingCarrierDTO } from '@/types/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

type CarrierForm = {
  code: string;
  name: string;
  enabled: boolean;
  baseFee: string;
  freeAbove: string;
};

function toForm(c: ShippingCarrierDTO): CarrierForm {
  return {
    code: c.code,
    name: c.name,
    enabled: c.enabled ?? true,
    baseFee: c.baseFee != null ? String(c.baseFee) : '0',
    freeAbove: c.freeAbove != null ? String(c.freeAbove) : '',
  };
}

const AdminShipping = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data: carriers = [], isLoading } = useQuery({
    queryKey: ['shipping-carriers-admin'],
    queryFn: () => shippingApi.listAdmin(),
  });

  const [forms, setForms] = useState<Record<string, CarrierForm>>({});

  useEffect(() => {
    const next: Record<string, CarrierForm> = {};
    for (const c of carriers) {
      next[c.code] = toForm(c);
    }
    setForms(next);
  }, [carriers]);

  const saveMutation = useMutation({
    mutationFn: (body: ShippingCarrierDTO) => shippingApi.upsert(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-carriers-admin'] });
      toast.success('Transporteur enregistré');
    },
    onError: (e) => toastError(e, 'Enregistrement impossible'),
  });

  const patch = (code: string, partial: Partial<CarrierForm>) => {
    setForms((prev) => ({
      ...prev,
      [code]: { ...prev[code], ...partial },
    }));
  };

  const saveCarrier = (original: ShippingCarrierDTO) => {
    const f = forms[original.code];
    if (!f) return;
    const baseFee = Number(f.baseFee);
    const freeRaw = f.freeAbove.trim();
    let freeAbove: number | null = null;
    if (freeRaw) {
      const parsed = Number(freeRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error('Seuil livraison gratuite invalide');
        return;
      }
      freeAbove = parsed;
    }
    if (!Number.isFinite(baseFee) || baseFee < 0) {
      toast.error('Frais de base invalides');
      return;
    }
    saveMutation.mutate({
      ...original,
      code: f.code,
      name: f.name.trim() || original.name,
      enabled: f.enabled,
      baseFee,
      freeAbove,
    });
  };

  return (
    <AdminLayout title={t('shipping.title')} breadcrumbs={[{ label: t('shipping.title') }]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Transporteurs</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : carriers.length === 0 ? (
          <EmptyState title={t('shipping.empty')} description={t('shipping.emptyDesc')} />
        ) : (
          <ul className="space-y-4">
            {carriers.map((c) => {
              const f = forms[c.code] ?? toForm(c);
              return (
                <li key={c.code} className="space-y-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-sm font-semibold">{c.code}</p>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`enabled-${c.code}`} className="text-sm">
                        Actif
                      </Label>
                      <Switch
                        id={`enabled-${c.code}`}
                        checked={f.enabled}
                        onCheckedChange={(checked) => patch(c.code, { enabled: checked })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label>Nom affiché</Label>
                      <Input
                        className="mt-1.5"
                        value={f.name}
                        onChange={(e) => patch(c.code, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Frais de base (MAD)</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1.5"
                        value={f.baseFee}
                        onChange={(e) => patch(c.code, { baseFee: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Gratuit à partir de (MAD)</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1.5"
                        value={f.freeAbove}
                        onChange={(e) => patch(c.code, { freeAbove: e.target.value })}
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="gap-2"
                    disabled={saveMutation.isPending}
                    onClick={() => saveCarrier(c)}
                  >
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminShipping;
