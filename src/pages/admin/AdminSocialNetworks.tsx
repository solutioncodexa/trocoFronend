import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Share2, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { socialNetworksApi } from '@/services/api/socialNetworks';
import type { SocialNetworkDTO } from '@/types/social-networks';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';

const AdminSocialNetworks = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<SocialNetworkDTO[]>([]);

  const { data: networks = [], isLoading, error } = useQuery({
    queryKey: ['social-networks', 'admin'],
    queryFn: () => socialNetworksApi.getAll(),
  });

  useEffect(() => {
    if (networks.length) {
      setDrafts(networks.map((n) => ({ ...n })));
    }
  }, [networks]);

  const saveMutation = useMutation({
    mutationFn: (updates: SocialNetworkDTO[]) =>
      socialNetworksApi.updateBatch(
        updates.map((n) => ({
          networkKey: n.networkKey,
          url: n.url,
          enabled: n.enabled,
          displayOrder: n.displayOrder,
          label: n.label,
        })),
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData(['social-networks', 'admin'], updated);
      queryClient.invalidateQueries({ queryKey: ['social-networks', 'public'] });
      toast.success('Réseaux sociaux mis à jour');
    },
    onError: (err: unknown) => {
      toastError(err, 'Erreur lors de la sauvegarde');
    },
  });

  const updateDraft = (networkKey: string, patch: Partial<SocialNetworkDTO>) => {
    setDrafts((prev) =>
      prev.map((n) => (n.networkKey === networkKey ? { ...n, ...patch } : n)),
    );
  };

  const handleSave = () => {
    const invalid = drafts.find((n) => n.enabled && (!n.url || !n.url.trim()));
    if (invalid) {
      toast.error(`URL requise pour ${invalid.label}`);
      return;
    }
    saveMutation.mutate(drafts);
  };

  if (isLoading) {
    return (
      <AdminLayout title={t('social.title')} breadcrumbs={[{ label: t('social.title') }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title={t('social.title')} breadcrumbs={[{ label: t('social.title') }]}>
        <div className="p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-medium text-red-800">Erreur de chargement</h3>
            <p className="text-red-600">Impossible de charger les réseaux sociaux.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('social.title')} breadcrumbs={[{ label: t('social.title') }]}>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
              <Share2 className="h-7 w-7 text-primary" />
              Réseaux sociaux
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
              Activez ou désactivez chaque réseau et modifiez son URL. Un réseau désactivé disparaît
              partout sur le site (footer, contact, accueil, WhatsApp flottant, partage produit).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Astuce : en renseignant Facebook / Instagram / TikTok / WhatsApp dans{' '}
              <Link to="/admin/parametres" className="text-primary underline-offset-2 hover:underline">
                Paramètres boutique
              </Link>
              , ces réseaux sont synchronisés automatiquement (activés + URL).
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="shrink-0 gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>

        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Aucun réseau social trouvé. Rechargez la page.
            </div>
          ) : null}
          {drafts.map((network) => (
            <div
              key={network.networkKey}
              className={cn(
                'rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5',
                !network.enabled && 'opacity-70',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{network.label}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {network.networkKey}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`enabled-${network.networkKey}`} className="text-sm text-muted-foreground">
                    {network.enabled ? 'Activé' : 'Désactivé'}
                  </Label>
                  <Switch
                    id={`enabled-${network.networkKey}`}
                    checked={network.enabled}
                    onCheckedChange={(checked) =>
                      updateDraft(network.networkKey, { enabled: checked })
                    }
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor={`url-${network.networkKey}`}>URL</Label>
                <Input
                  id={`url-${network.networkKey}`}
                  type="url"
                  value={network.url}
                  onChange={(e) => updateDraft(network.networkKey, { url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSocialNetworks;
