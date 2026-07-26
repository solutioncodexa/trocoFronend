import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, ExternalLink, LogOut, Plus, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAdmin } from '@/contexts/AdminContext';
import { platformApi } from '@/services/api/platform';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSuperAdmin, isLoading: authLoading, logout, user } = useAdmin();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    adminEmail: '',
    adminPassword: '',
    adminFullName: '',
    planCode: 'basic',
  });

  const { data: fournisseurs = [], isLoading } = useQuery({
    queryKey: ['platform', 'fournisseurs'],
    queryFn: () => platformApi.listFournisseurs(),
    enabled: isAuthenticated && isSuperAdmin,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['platform', 'plans'],
    queryFn: () => platformApi.getPlans(),
    enabled: isAuthenticated && isSuperAdmin,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      platformApi.createFournisseur({
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        adminEmail: form.adminEmail.trim(),
        adminPassword: form.adminPassword,
        adminFullName: form.adminFullName.trim() || undefined,
        planCode: form.planCode || 'basic',
      }),
    onSuccess: (created) => {
      const url = buildStorefrontUrl(created.slug);
      toast.success(`Boutique « ${created.name} » créée — ${url}`);
      setCreateOpen(false);
      setSlugTouched(false);
      setForm({
        name: '',
        slug: '',
        adminEmail: '',
        adminPassword: '',
        adminFullName: '',
        planCode: 'basic',
      });
      queryClient.invalidateQueries({ queryKey: ['platform', 'fournisseurs'] });
    },
    onError: (err: unknown) => toastError(err, 'Création impossible'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      platformApi.updateFournisseurStatus(id, status),
    onSuccess: () => {
      toast.success('Statut mis à jour');
      queryClient.invalidateQueries({ queryKey: ['platform', 'fournisseurs'] });
    },
    onError: (err: unknown) => toastError(err, 'Mise à jour impossible'),
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/super-admin" replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background surface-mesh">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-display text-lg font-semibold">Matjarona</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Super Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/matjarona">Landing</Link>
            </Button>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => {
                logout();
                navigate('/super-admin');
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Tableau de bord</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Liste des boutiques (fournisseurs) sur la plateforme.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Nouveau fournisseur
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement des fournisseurs…</p>
        ) : fournisseurs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucun fournisseur"
            description="Créez la première boutique de la plateforme."
            actionLabel="Nouveau fournisseur"
            onAction={() => setCreateOpen(true)}
            className="border border-dashed border-border bg-muted/30"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fournisseurs.map((f) => {
                  const status = (f.status || '').toUpperCase();
                  const active = status === 'ACTIVE' || status === 'TRIAL';
                  const pending = status === 'PENDING';
                  const storeUrl = buildStorefrontUrl(f.slug);
                  return (
                    <tr key={f.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-medium">{f.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.slug}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={f.planCode || 'basic'}
                          onValueChange={(planCode) => {
                            void platformApi
                              .updateFournisseurPlan(f.id, planCode)
                              .then(() => {
                                toast.success('Plan mis à jour');
                                queryClient.invalidateQueries({ queryKey: ['platform', 'fournisseurs'] });
                              })
                              .catch((err: unknown) => toastError(err, 'Plan impossible'));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[9.5rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((p) => (
                              <SelectItem key={p.code} value={p.code}>
                                {p.name} ({Number(p.priceMad)} DHS)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={active ? 'default' : pending ? 'outline' : 'secondary'}
                          className={pending ? 'border-amber-500 text-amber-700' : undefined}
                        >
                          {f.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-1" asChild>
                            <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Boutique
                            </a>
                          </Button>
                          {pending ? (
                            <Button
                              size="sm"
                              className="gap-1"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                statusMutation.mutate({ id: f.id, status: 'ACTIVE' })
                              }
                            >
                              <Power className="h-3.5 w-3.5" />
                              Activer le compte
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                statusMutation.mutate({
                                  id: f.id,
                                  status: active ? 'SUSPENDED' : 'ACTIVE',
                                })
                              }
                            >
                              <Power className="h-3.5 w-3.5" />
                              {active ? 'Suspendre' : 'Activer'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau fournisseur</DialogTitle>
            <DialogDescription>
              Crée une boutique ACTIVE et un compte admin immédiatement.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
          >
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: slugTouched ? f.slug : slugify(name),
                  }));
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                className="mt-1.5"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({
                    ...f,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                  }));
                }}
                placeholder="ma-boutique"
                required
              />
              {form.slug ? (
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {buildStorefrontUrl(form.slug)}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="adminEmail">Email admin</Label>
              <Input
                id="adminEmail"
                type="email"
                className="mt-1.5"
                value={form.adminEmail}
                onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="adminPassword">Mot de passe admin</Label>
              <Input
                id="adminPassword"
                type="password"
                className="mt-1.5"
                value={form.adminPassword}
                onChange={(e) => setForm((f) => ({ ...f, adminPassword: e.target.value }))}
                minLength={8}
                required
              />
            </div>
            <div>
              <Label htmlFor="adminFullName">Nom complet admin (optionnel)</Label>
              <Input
                id="adminFullName"
                className="mt-1.5"
                value={form.adminFullName}
                onChange={(e) => setForm((f) => ({ ...f, adminFullName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="planCode">Plan</Label>
              <Select
                value={form.planCode}
                onValueChange={(value) => setForm((f) => ({ ...f, planCode: value }))}
              >
                <SelectTrigger id="planCode" className="mt-1.5">
                  <SelectValue placeholder="Choisir un plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name} — {Number(p.priceMad)} DHS / mois
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Création…' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminDashboard;
