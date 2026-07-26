import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { History, Plus, UserCheck, UserX, KeyRound, Users, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { membersApi } from '@/services/api/members';
import type { MemberDTO, PermissionDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAdmin } from '@/contexts/AdminContext';
import { togglePermissionSet, expandPermissions, PERMISSIONS } from '@/config/permissions';

const ROLE_PRESETS: { key: string; label: string; permissions: string[] }[] = [
  {
    key: 'editor',
    label: 'Éditeur',
    permissions: [PERMISSIONS.PAGES_EDIT, PERMISSIONS.CONTENT_MANAGE],
  },
  {
    key: 'marketer',
    label: 'Marketer',
    permissions: [
      PERMISSIONS.CONTENT_MANAGE,
      PERMISSIONS.PAGES_EDIT,
      PERMISSIONS.STATS_VIEW,
      PERMISSIONS.WEBHOOKS_MANAGE,
    ],
  },
  {
    key: 'stock',
    label: 'Stock',
    permissions: [
      PERMISSIONS.STOCK_VIEW,
      PERMISSIONS.STOCK_ADJUST,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.ORDERS_VIEW,
    ],
  },
];

const AdminMembers = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAdmin();
  const [selected, setSelected] = useState<MemberDTO | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    active: true,
    permissions: [] as string[],
  });
  const [newPassword, setNewPassword] = useState('');

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['admin', 'members'],
    queryFn: () => membersApi.list(),
  });

  const { data: allPermissions = [] } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: () => membersApi.listPermissions(),
  });

  const byCategory = useMemo(() => {
    const map = new Map<string, PermissionDTO[]>();
    for (const p of allPermissions) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return [...map.entries()];
  }, [allPermissions]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'members'] });

  const createMutation = useMutation({
    mutationFn: () =>
      membersApi.create({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        active: form.active,
        permissions: form.permissions,
      }),
    onSuccess: () => {
      toast.success('Membre créé');
      setCreateOpen(false);
      setForm({ email: '', password: '', fullName: '', active: true, permissions: [] });
      invalidate();
    },
    onError: (e) => toastError(e, 'Création impossible'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      membersApi.update(selected!.id, {
        fullName: selected!.fullName,
        active: selected!.active,
        permissions: selected!.role === 'STAFF' ? selected!.permissions : undefined,
      }),
    onSuccess: (m) => {
      toast.success('Membre mis à jour');
      setSelected(m);
      invalidate();
    },
    onError: (e) => toastError(e, 'Mise à jour impossible'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (m: MemberDTO) => (m.active ? membersApi.deactivate(m.id) : membersApi.activate(m.id)),
    onSuccess: (m) => {
      toast.success(m.active ? 'Compte activé' : 'Compte désactivé');
      setSelected(m);
      invalidate();
    },
    onError: (e) => toastError(e, 'Action impossible'),
  });

  const passwordMutation = useMutation({
    mutationFn: () => membersApi.resetPassword(selected!.id, newPassword),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour');
      setPasswordOpen(false);
      setNewPassword('');
    },
    onError: (e) => toastError(e, 'Reset impossible'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => membersApi.delete(selected!.id),
    onSuccess: () => {
      toast.success('Compte supprimé');
      setDeleteOpen(false);
      setSelected(null);
      invalidate();
    },
    onError: (e) => toastError(e, 'Suppression impossible'),
  });

  const isSelf = selected != null && currentUser?.id === selected.id;

  const togglePerm = (code: string, checked: boolean) => {
    if (!selected || selected.role !== 'STAFF') return;
    setSelected({
      ...selected,
      permissions: togglePermissionSet(selected.permissions, code, checked),
    });
  };

  const toggleCreatePerm = (code: string, checked: boolean) => {
    setForm((f) => ({
      ...f,
      permissions: togglePermissionSet(f.permissions, code, checked),
    }));
  };

  const applyPresetToSelected = (permissions: string[]) => {
    if (!selected || selected.role !== 'STAFF') return;
    setSelected({ ...selected, permissions: expandPermissions(permissions) });
  };

  const applyPresetToCreate = (permissions: string[]) => {
    setForm((f) => ({ ...f, permissions: expandPermissions(permissions) }));
  };

  const PresetButtons = ({
    onApply,
  }: {
    onApply: (permissions: string[]) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {ROLE_PRESETS.map((preset) => (
        <Button
          key={preset.key}
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onApply(preset.permissions)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );

  return (
    <AdminLayout title="Membres" breadcrumbs={[{ label: 'Équipe' }, { label: 'Membres' }]}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-3">
          <div className="flex justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground">Comptes ADMIN et STAFF</p>
            <Button size="sm" className="gap-1" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4" /> Nouveau
            </Button>
          </div>
          {isLoading ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : members.length === 0 ? (
            <EmptyState icon={Users} title="Aucun membre" />
          ) : (
            members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected({ ...m, permissions: [...(m.permissions || [])] })}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  selected?.id === m.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{m.fullName || m.email}</span>
                  <Badge variant={m.active ? 'default' : 'secondary'}>{m.active ? 'Actif' : 'Inactif'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.email} · {m.role}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="flex-1 rounded-lg border border-border bg-card p-5 min-h-[320px]">
          {!selected ? (
            <p className="text-muted-foreground text-sm">Sélectionnez un membre pour gérer ses permissions.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">{selected.fullName || selected.email}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email} · {selected.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="gap-1">
                    <Link to={`/admin/audit?userId=${selected.id}`}>
                      <History className="w-3.5 h-3.5" /> Audit
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setPasswordOpen(true)}>
                    <KeyRound className="w-3.5 h-3.5" /> Mot de passe
                  </Button>
                  <Button
                    size="sm"
                    variant={selected.active ? 'destructive' : 'default'}
                    className="gap-1"
                    onClick={() => toggleActiveMutation.mutate(selected)}
                    disabled={toggleActiveMutation.isPending || isSelf}
                  >
                    {selected.active ? (
                      <>
                        <UserX className="w-3.5 h-3.5" /> Désactiver
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" /> Activer
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => setDeleteOpen(true)}
                    disabled={isSelf}
                    title={isSelf ? 'Impossible de supprimer votre propre compte' : undefined}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                  </Button>
                </div>
              </div>

              <div>
                <Label>Nom complet</Label>
                <Input
                  className="mt-1 max-w-md"
                  value={selected.fullName || ''}
                  onChange={(e) => setSelected({ ...selected, fullName: e.target.value })}
                />
              </div>

              {selected.role === 'ADMIN' ? (
                <p className="text-sm text-muted-foreground">
                  Les administrateurs ont automatiquement toutes les permissions.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Permissions</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cocher « ajuster / gérer » ajoute automatiquement « voir » (ex. vente directe stock → accès au menu Stock).
                    </p>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1.5">Profils rapides</p>
                      <PresetButtons onApply={applyPresetToSelected} />
                    </div>
                  </div>
                  {byCategory.map(([cat, perms]) => (
                    <div key={cat} className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{cat}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {perms.map((p) => (
                          <label
                            key={p.code}
                            className="flex items-start gap-2 rounded-md border border-border p-2 text-sm"
                          >
                            <Checkbox
                              checked={selected.permissions.includes(p.code)}
                              onCheckedChange={(v) => togglePerm(p.code, v === true)}
                            />
                            <span>
                              <span className="font-medium">{p.label}</span>
                              {p.description ? (
                                <span className="block text-xs text-muted-foreground">{p.description}</span>
                              ) : null}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau membre STAFF</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nom complet</Label>
              <Input
                className="mt-1"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                className="mt-1"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <PasswordInput
                className="mt-1"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Compte actif</Label>
              <Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Profils rapides</p>
              <PresetButtons onApply={applyPresetToCreate} />
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto border rounded-md p-3">
              {byCategory.map(([cat, perms]) => (
                <div key={cat}>
                  <p className="text-xs uppercase text-muted-foreground mb-1">{cat}</p>
                  {perms.map((p) => (
                    <label key={p.code} className="flex items-center gap-2 text-sm py-1">
                      <Checkbox
                        checked={form.permissions.includes(p.code)}
                        onCheckedChange={(v) => toggleCreatePerm(p.code, v === true)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={
                createMutation.isPending ||
                !form.email.trim() ||
                !form.password ||
                form.password.length < 6 ||
                !form.fullName.trim()
              }
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Nouveau mot de passe</Label>
            <PasswordInput
              className="mt-1"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => passwordMutation.mutate()}
              disabled={passwordMutation.isPending || newPassword.length < 6}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le compte</DialogTitle>
            <DialogDescription>
              Supprimer définitivement{' '}
              <strong>{selected?.fullName || selected?.email}</strong> ? Cette action est irréversible
              (sessions invalidées, permissions effacées). L’historique d’audit est conservé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending || isSelf}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMembers;
