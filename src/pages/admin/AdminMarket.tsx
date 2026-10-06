import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { marketApi, type SeasonalCampaign } from '@/services/api/market';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const AdminMarket = () => {
  const queryClient = useQueryClient();
  const configQuery = useQuery({ queryKey: ['market-config'], queryFn: () => marketApi.publicConfig() });
  const ratesQuery = useQuery({ queryKey: ['city-rates'], queryFn: () => marketApi.cityRates() });
  const campaignsQuery = useQuery({ queryKey: ['campaigns'], queryFn: () => marketApi.campaigns() });
  const referralsQuery = useQuery({ queryKey: ['referrals'], queryFn: () => marketApi.referrals() });
  const returnsQuery = useQuery({ queryKey: ['returns'], queryFn: () => marketApi.returns() });

  const [rate, setRate] = useState({ carrierCode: 'AMANA', city: 'Casablanca', fee: '35' });
  const [referral, setReferral] = useState({ code: '', rewardMad: '30', referrerLabel: '' });
  const [instructions, setInstructions] = useState('');

  const saveConfig = useMutation({
    mutationFn: marketApi.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-config'] });
      toast.success('Paiements enregistrés');
    },
    onError: (err: Error) => toastError(err, 'Enregistrement impossible'),
  });

  const saveRate = useMutation({
    mutationFn: () => marketApi.upsertCityRate({
      carrierCode: rate.carrierCode,
      city: rate.city,
      fee: Number(rate.fee),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city-rates'] });
      toast.success('Frais de ville enregistrés');
    },
    onError: (err: Error) => toastError(err, 'Frais invalides'),
  });

  const saveCampaign = useMutation({
    mutationFn: (body: SeasonalCampaign) => marketApi.saveCampaign(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    onError: (err: Error) => toastError(err, 'Campagne non enregistrée'),
  });

  const saveReferral = useMutation({
    mutationFn: () => marketApi.saveReferral({
      code: referral.code,
      rewardMad: Number(referral.rewardMad) || 0,
      referrerLabel: referral.referrerLabel,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      toast.success('Code parrain enregistré');
    },
    onError: (err: Error) => toastError(err, 'Code parrain invalide'),
  });

  const patchReturn = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => marketApi.updateReturn(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Retour mis à jour');
    },
    onError: (err: Error) => toastError(err, 'Mise à jour impossible'),
  });

  const cfg = configQuery.data;
  const catalogUrl = `${window.location.origin}/api/catalog/meta.csv`;

  return (
    <AdminLayout title="Marché marocain" breadcrumbs={[{ label: 'Marché' }]}>
      <div className="space-y-8 max-w-3xl">
        <section className="rounded-lg border border-border bg-card p-4 space-y-4">
          <h2 className="font-medium">PayZone et virement</h2>
          <p className="text-sm text-muted-foreground">
            Ces modes restent des drapeaux : la commande est enregistrée en attente, sans passerelle carte.
          </p>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="payzone">PayZone</Label>
            <Switch
              id="payzone"
              checked={!!cfg?.payzoneEnabled}
              onCheckedChange={(checked) => saveConfig.mutate({ payzoneEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="transfer">Virement</Label>
            <Switch
              id="transfer"
              checked={!!cfg?.transferEnabled}
              onCheckedChange={(checked) => saveConfig.mutate({ transferEnabled: checked, transferInstructions: instructions || cfg?.transferInstructions })}
            />
          </div>
          <div>
            <Label htmlFor="rib">Instructions de virement</Label>
            <textarea
              id="rib"
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              defaultValue={cfg?.transferInstructions ?? ''}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="RIB, banque, bénéficiaire"
            />
            <Button
              type="button"
              className="mt-2"
              size="sm"
              onClick={() => saveConfig.mutate({
                transferEnabled: cfg?.transferEnabled,
                transferInstructions: instructions || cfg?.transferInstructions || '',
              })}
            >
              Enregistrer les instructions
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-medium">Frais par ville</h2>
          <p className="text-sm text-muted-foreground">Amana, Chronodiali, Glovo : le barème de la ville remplace le forfait si elle est reconnue.</p>
          <form
            className="grid gap-2 sm:grid-cols-4"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              saveRate.mutate();
            }}
          >
            <Input value={rate.carrierCode} onChange={(e) => setRate({ ...rate, carrierCode: e.target.value.toUpperCase() })} placeholder="AMANA" />
            <Input value={rate.city} onChange={(e) => setRate({ ...rate, city: e.target.value })} placeholder="Ville" />
            <Input value={rate.fee} onChange={(e) => setRate({ ...rate, fee: e.target.value })} placeholder="MAD" />
            <Button type="submit" disabled={saveRate.isPending}>Ajouter</Button>
          </form>
          <ul className="text-sm divide-y divide-border">
            {(ratesQuery.data ?? []).map((row) => (
              <li key={row.id} className="flex items-center justify-between py-2">
                <span>{row.carrierCode} · {row.city}</span>
                <span className="flex items-center gap-3">
                  {row.fee} MAD
                  <button type="button" className="text-destructive" onClick={() => marketApi.deleteCityRate(row.id).then(() => queryClient.invalidateQueries({ queryKey: ['city-rates'] }))}>
                    Retirer
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-medium">Ramadan, Aïd, rentrée</h2>
          {(campaignsQuery.data ?? []).map((c) => (
            <div key={c.code} className="flex flex-wrap items-center gap-3 border-b border-border py-2">
              <div className="min-w-40">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.code}</p>
              </div>
              <Input
                className="w-24"
                type="number"
                defaultValue={c.discountPercent ?? 0}
                onBlur={(e) => saveCampaign.mutate({ ...c, discountPercent: Number(e.target.value) || 0, enabled: c.enabled })}
              />
              <span className="text-sm text-muted-foreground">%</span>
              <Switch
                checked={c.enabled}
                onCheckedChange={(checked) => saveCampaign.mutate({ ...c, enabled: checked })}
              />
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-medium">Parrainage</h2>
          <form
            className="grid gap-2 sm:grid-cols-4"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              saveReferral.mutate();
            }}
          >
            <Input value={referral.code} onChange={(e) => setReferral({ ...referral, code: e.target.value.toUpperCase() })} placeholder="CODE" />
            <Input value={referral.rewardMad} onChange={(e) => setReferral({ ...referral, rewardMad: e.target.value })} placeholder="MAD" />
            <Input value={referral.referrerLabel} onChange={(e) => setReferral({ ...referral, referrerLabel: e.target.value })} placeholder="Parrain" />
            <Button type="submit">Créer</Button>
          </form>
          <ul className="text-sm">
            {(referralsQuery.data ?? []).map((r) => (
              <li key={r.code} className="py-1">{r.code} · {r.rewardMad} MAD · {r.usesCount ?? 0} utilisations</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-medium">Retours et remboursements</h2>
          {(returnsQuery.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Aucune demande.</p>}
          {(returnsQuery.data ?? []).map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-sm">
              <div>
                <p>Commande #{row.orderId} · {row.status}</p>
                <p className="text-muted-foreground">{row.reason || 'Sans motif'} · {row.refundAmount ?? 0} MAD</p>
              </div>
              {row.status !== 'REFUNDED' && row.status !== 'REJECTED' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => patchReturn.mutate({ id: row.id, status: 'REJECTED' })}>Refuser</Button>
                  <Button size="sm" onClick={() => patchReturn.mutate({ id: row.id, status: 'REFUNDED' })}>Rembourser</Button>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-card p-4 space-y-2">
          <h2 className="font-medium">Catalogue Meta</h2>
          <p className="text-sm text-muted-foreground break-all">{catalogUrl}</p>
          <a className="text-sm text-primary underline" href={catalogUrl}>Télécharger le CSV</a>
        </section>

        {(configQuery.isLoading || ratesQuery.isLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
    </AdminLayout>
  );
};

export default AdminMarket;
