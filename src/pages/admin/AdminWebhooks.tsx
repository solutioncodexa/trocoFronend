import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2, Webhook } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { storeWebhooksApi } from '@/services/api/storeWebhooks';
import type { StoreWebhook, StoreWebhookEvent } from '@/types/store-webhooks';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { EmptyState } from '@/components/ui/EmptyState';

const EVENT_OPTIONS: { value: StoreWebhookEvent; label: string }[] = [
  { value: 'order.created', label: 'Commande créée' },
  { value: 'lead.created', label: 'Lead / formulaire' },
];

const EVENT_LABELS: Record<string, string> = {
  'order.created': 'Commande créée',
  'lead.created': 'Lead',
};

type FormState = {
  name: string;
  targetUrl: string;
  secret: string;
  events: StoreWebhookEvent[];
  enabled: boolean;
};

const emptyForm = (): FormState => ({
  name: '',
  targetUrl: '',
  secret: '',
  events: ['order.created'],
  enabled: true,
});

const AdminWebhooks = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StoreWebhook | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['store-webhooks'],
    queryFn: () => storeWebhooksApi.list(),
  });

  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
    queryKey: ['store-webhooks', 'deliveries'],
    queryFn: () => storeWebhooksApi.deliveries(),
  });

  const webhookNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const w of webhooks) map.set(w.id, w.name);
    return map;
  }, [webhooks]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['store-webhooks'] });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (w: StoreWebhook) => {
    setEditing(w);
    setForm({
      name: w.name,
      targetUrl: w.targetUrl,
      secret: '',
      events: [...w.events],
      enabled: w.enabled,
    });
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(),
        targetUrl: form.targetUrl.trim(),
        secret: form.secret.trim() || undefined,
        events: form.events,
        enabled: form.enabled,
      };
      if (editing) return storeWebhooksApi.update(editing.id, payload);
      return storeWebhooksApi.create(payload);
    },
    onSuccess: (created) => {
      if (!editing && created?.secret) {
        toast.success('Webhook créé — copiez le secret maintenant (il ne sera plus renvoyé).');
      } else {
        toast.success(editing ? 'Webhook mis à jour' : 'Webhook créé');
      }
      setDialogOpen(false);
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['store-webhooks', 'deliveries'] });
    },
    onError: (e) => toastError(e, 'Enregistrement impossible'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => storeWebhooksApi.delete(id),
    onSuccess: () => {
      toast.success('Webhook supprimé');
      invalidate();
    },
    onError: (e) => toastError(e, 'Suppression impossible'),
  });

  const toggleEvent = (ev: StoreWebhookEvent, checked: boolean) => {
    setForm((f) => {
      const set = new Set(f.events);
      if (checked) set.add(ev);
      else set.delete(ev);
      return { ...f, events: [...set] as StoreWebhookEvent[] };
    });
  };

  const canSave =
    form.name.trim() &&
    form.targetUrl.trim() &&
    form.events.length > 0 &&
    !saveMutation.isPending;

  return (
    <AdminLayout
      title={t('webhooks.title')}
      breadcrumbs={[{ label: t('nav.integrations') }, { label: t('webhooks.title') }]}
      description={t('webhooks.description')}
      actions={
        <Button className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nouveau webhook
        </Button>
      }
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <aside className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Zapier / n8n / Make</p>
          <p className="mt-1">
            Collez l’URL « Catch Hook », cochez <code className="text-foreground">order.created</code> ou{' '}
            <code className="text-foreground">lead.created</code>. Signature optionnelle : header{' '}
            <code className="text-foreground">X-Matjarona-Signature</code> (HMAC-SHA256).
          </p>
        </aside>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Endpoints configurés</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : webhooks.length === 0 ? (
            <EmptyState
              icon={Webhook}
              title={t('webhooks.empty')}
              description={t('webhooks.emptyDesc')}
            />
          ) : (
            <ul className="space-y-2">
              {webhooks.map((w) => (
                <li
                  key={w.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-semibold">{w.name}</p>
                      <Badge variant={w.enabled ? 'default' : 'secondary'}>
                        {w.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                      {w.hasSecret ? (
                        <Badge variant="outline" className="text-[10px]">
                          Secret configuré
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{w.targetUrl}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {w.events.map((ev) => (
                        <Badge key={ev} variant="outline" className="text-[10px]">
                          {EVENT_LABELS[ev] ?? ev}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(w)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Supprimer le webhook « ${w.name} » ?`)) {
                          deleteMutation.mutate(w.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Dernières livraisons</h2>
          <p className="text-sm text-muted-foreground">Les 50 envois les plus récents (succès ou échec).</p>
          {deliveriesLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : deliveries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Aucune livraison pour le moment.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Webhook</th>
                    <th className="px-3 py-2 font-medium">Événement</th>
                    <th className="px-3 py-2 font-medium">HTTP</th>
                    <th className="px-3 py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id} className="border-t border-border align-top">
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                        {d.createdAt ? new Date(d.createdAt).toLocaleString('fr-FR') : '—'}
                      </td>
                      <td className="px-3 py-2">{webhookNameById.get(d.webhookId) ?? `#${d.webhookId}`}</td>
                      <td className="px-3 py-2 font-mono text-xs">{d.eventType}</td>
                      <td className="px-3 py-2">{d.statusCode ?? '—'}</td>
                      <td className="px-3 py-2">
                        {d.success ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">OK</Badge>
                        ) : (
                          <span className="text-destructive text-xs">{d.errorMessage || 'Échec'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier le webhook' : 'Nouveau webhook'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input
                className="mt-1.5"
                placeholder="Ex. Zapier commandes"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>URL cible</Label>
              <Input
                className="mt-1.5 font-mono text-sm"
                placeholder="https://…"
                value={form.targetUrl}
                onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))}
              />
            </div>
            <div>
              <Label>Secret (optionnel)</Label>
              <Input
                className="mt-1.5 font-mono text-sm"
                type="password"
                autoComplete="new-password"
                placeholder={
                  editing?.hasSecret
                    ? 'Laisser vide pour conserver le secret actuel'
                    : 'Pour signature HMAC'
                }
                value={form.secret}
                onChange={(e) => setForm((f) => ({ ...f, secret: e.target.value }))}
              />
            </div>
            <div>
              <Label className="mb-2 block">Événements</Label>
              <div className="space-y-2">
                {EVENT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.events.includes(opt.value)}
                      onCheckedChange={(v) => toggleEvent(opt.value, v === true)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Actif</span>
              <Switch
                checked={form.enabled}
                onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button disabled={!canSave} onClick={() => saveMutation.mutate()}>
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminWebhooks;
