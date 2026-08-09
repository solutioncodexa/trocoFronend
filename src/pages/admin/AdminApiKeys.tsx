import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Key, Loader2, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiKeysApi } from '@/services/api/apiKeys';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const AdminApiKeys = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState('products:read,orders:write');
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => apiKeysApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: () => apiKeysApi.create({ name: name.trim(), scopes: scopes.trim() }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setCreateOpen(false);
      setName('');
      setRevealedSecret(created.apiKey);
      toast.success('Clé API créée — copiez le secret maintenant');
    },
    onError: (e) => toastError(e, 'Création impossible'),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => apiKeysApi.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('Clé révoquée');
    },
    onError: (e) => toastError(e, 'Révocation impossible'),
  });

  return (
    <AdminLayout title={t('apiKeys.title')} breadcrumbs={[{ label: t('apiKeys.title') }]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">Clés API boutique</h1>
          </div>
          <Button type="button" className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Nouvelle clé
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : keys.length === 0 ? (
          <EmptyState title={t('apiKeys.empty')} description={t('apiKeys.emptyDesc')} />
        ) : (
          <ul className="space-y-3">
            {keys.map((k) => (
              <li
                key={k.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{k.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{k.keyPrefix}…</p>
                  <p className="mt-1 text-xs text-muted-foreground">{k.scopes}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {k.enabled && !k.revokedAt ? (
                    <Badge className="bg-emerald-600">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Révoquée</Badge>
                  )}
                  {k.enabled && !k.revokedAt ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive"
                      onClick={() => revokeMutation.mutate(k.id)}
                      disabled={revokeMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Révoquer
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle clé API</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="key-name">Nom</Label>
              <Input
                id="key-name"
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Intégration ERP"
              />
            </div>
            <div>
              <Label htmlFor="key-scopes">Scopes</Label>
              <Input
                id="key-scopes"
                className="mt-1.5 font-mono text-sm"
                value={scopes}
                onChange={(e) => setScopes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Création…' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revealedSecret} onOpenChange={(open) => !open && setRevealedSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secret affiché une seule fois</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Copiez cette clé maintenant. Elle ne sera plus visible ensuite.
          </p>
          <code className="block break-all rounded-lg bg-muted p-3 text-xs">{revealedSecret}</code>
          <DialogFooter>
            <Button
              type="button"
              className="gap-2"
              onClick={async () => {
                if (!revealedSecret) return;
                try {
                  await navigator.clipboard.writeText(revealedSecret);
                  toast.success('Clé copiée');
                } catch {
                  toast.error('Copie impossible');
                }
              }}
            >
              <Copy className="h-4 w-4" />
              Copier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminApiKeys;
