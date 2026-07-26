import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building2, LogOut, Package, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';
import { platformApi } from '@/services/api/platform';
import type { PlanDTO, PlanFeaturesDTO, UpdatePlanRequest } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

type FormState = {
  id?: number;
  code: string;
  name: string;
  description: string;
  priceMad: string;
  maxProducts: string;
  maxStaff: string;
  maxOrdersPerMonth: string;
  maxPixels: string;
  storageMb: string;
  customDomain: boolean;
  active: boolean;
  features: Required<PlanFeaturesDTO>;
};

const defaultFeatures = (): Required<PlanFeaturesDTO> => ({
  themes: 'basic',
  pageBuilder: 'simple',
  abTesting: false,
  abandonedCart: false,
  abandonedCartAdvanced: false,
  whatsappBusiness: false,
  whatsappMultiTemplates: false,
  webhooks: 'none',
  blogSeo: 'basic',
  support: 'email',
  apiHeadless: false,
  loyalty: false,
  multiCurrency: false,
});

function toForm(p: PlanDTO): FormState {
  const f = { ...defaultFeatures(), ...(p.features ?? {}) };
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    description: p.description ?? '',
    priceMad: String(p.priceMad ?? 0),
    maxProducts: p.maxProducts == null ? '' : String(p.maxProducts),
    maxStaff: p.maxStaff == null ? '' : String(p.maxStaff),
    maxOrdersPerMonth: p.maxOrdersPerMonth == null ? '' : String(p.maxOrdersPerMonth),
    maxPixels: p.maxPixels == null ? '' : String(p.maxPixels),
    storageMb: p.storageMb == null ? '' : String(p.storageMb),
    customDomain: !!p.customDomain,
    active: p.active !== false,
    features: f as Required<PlanFeaturesDTO>,
  };
}

function emptyForm(): FormState {
  return {
    code: '',
    name: '',
    description: '',
    priceMad: '0',
    maxProducts: '',
    maxStaff: '',
    maxOrdersPerMonth: '',
    maxPixels: '',
    storageMb: '',
    customDomain: false,
    active: true,
    features: defaultFeatures(),
  };
}

/** Champ vide = illimité (-1 côté API → null en base). */
function parseLimit(raw: string): number {
  const t = raw.trim();
  if (!t || t === '-' || t.toLowerCase() === 'illimite' || t.toLowerCase() === 'illimité') return -1;
  const n = Number(t);
  if (Number.isNaN(n) || n < 0) return -1;
  return Math.floor(n);
}

function toPayload(form: FormState): UpdatePlanRequest {
  return {
    code: form.code.trim().toLowerCase(),
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    priceMad: Number(form.priceMad) || 0,
    maxProducts: parseLimit(form.maxProducts),
    maxStaff: parseLimit(form.maxStaff),
    maxOrdersPerMonth: parseLimit(form.maxOrdersPerMonth),
    maxPixels: parseLimit(form.maxPixels),
    storageMb: parseLimit(form.storageMb),
    customDomain: form.customDomain,
    active: form.active,
    features: form.features,
  };
}

const SuperAdminPlans = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSuperAdmin, isLoading: authLoading, logout, user } = useAdmin();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['platform', 'plans', 'admin'],
    queryFn: () => platformApi.listPlansAdmin(),
    enabled: isAuthenticated && isSuperAdmin,
  });

  useEffect(() => {
    if (selectedId === 'new') {
      setForm(emptyForm());
      return;
    }
    if (selectedId != null) {
      const p = plans.find((x) => x.id === selectedId);
      if (p) setForm(toForm(p));
    } else if (plans.length > 0 && selectedId === null) {
      setSelectedId(plans[0].id);
    }
  }, [selectedId, plans]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form);
      if (form.id == null) {
        return platformApi.createPlan(payload);
      }
      return platformApi.updatePlan(form.id, payload);
    },
    onSuccess: (saved) => {
      toast.success(`Pack « ${saved.name} » enregistré`);
      queryClient.invalidateQueries({ queryKey: ['platform', 'plans'] });
      setSelectedId(saved.id);
    },
    onError: (err: unknown) => toastError(err, 'Enregistrement impossible'),
  });

  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const patchFeature = <K extends keyof PlanFeaturesDTO>(key: K, value: PlanFeaturesDTO[K]) => {
    setForm((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }));
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/super-admin" replace />;
  if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background surface-mesh">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-display text-lg font-semibold">Matjarona</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Super Admin · Packs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/super-admin/dashboard" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Boutiques
              </Link>
            </Button>
            <span className="hidden text-xs text-muted-foreground sm:inline">{user?.email}</span>
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

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Packs
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 px-2"
              onClick={() => setSelectedId('new')}
            >
              <Plus className="h-3.5 w-3.5" />
              Nouveau
            </Button>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : (
            <ul className="space-y-1">
              {plans.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selectedId === p.id
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'border-transparent hover:bg-muted/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{Number(p.priceMad)} DH</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">
            Vide = illimité pour produits, staff, commandes, pixels, stockage.
          </p>
        </aside>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold sm:text-2xl">
                {form.id ? `Configurer « ${form.name || form.code} »` : 'Nouveau pack'}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Prix, limites et fonctionnalités — appliqués immédiatement aux boutiques du plan.
              </p>
            </div>
            <Button
              className="gap-2"
              disabled={saveMutation.isPending || !form.name.trim() || (!form.id && !form.code.trim())}
              onClick={() => saveMutation.mutate()}
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {!form.id && (
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => patch('code', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="ex. starter"
                  className="mt-1.5"
                />
              </div>
            )}
            <div>
              <Label htmlFor="name">Nom affiché</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => patch('name', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="priceMad">Prix (DH / mois)</Label>
              <Input
                id="priceMad"
                type="number"
                min={0}
                step="1"
                value={form.priceMad}
                onChange={(e) => patch('priceMad', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => patch('description', e.target.value)}
                className="mt-1.5"
                rows={2}
              />
            </div>
          </div>

          <h3 className="mb-3 mt-8 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Limites
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ['maxProducts', 'Produits'],
                ['maxStaff', 'Comptes STAFF'],
                ['maxOrdersPerMonth', 'Commandes / mois'],
                ['maxPixels', 'Pixels marketing'],
                ['storageMb', 'Stockage (Mo)'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => patch(key, e.target.value)}
                  placeholder="Illimité"
                  className="mt-1.5"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.customDomain} onCheckedChange={(v) => patch('customDomain', v)} />
              Domaine personnalisé
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.active} onCheckedChange={(v) => patch('active', v)} />
              Pack actif (visible à l’inscription)
            </label>
          </div>

          <h3 className="mb-3 mt-8 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Fonctionnalités
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Thèmes</Label>
              <Select value={form.features.themes} onValueChange={(v) => patchFeature('themes', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">2 thèmes (classic + minimal)</SelectItem>
                  <SelectItem value="all">Tous les thèmes</SelectItem>
                  <SelectItem value="all_early">Tous + accès anticipé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Page builder</Label>
              <Select
                value={form.features.pageBuilder}
                onValueChange={(v) => patchFeature('pageBuilder', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Éditeur simple</SelectItem>
                  <SelectItem value="full">Complet</SelectItem>
                  <SelectItem value="full_versions">Complet + versions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Webhooks</Label>
              <Select
                value={form.features.webhooks}
                onValueChange={(v) => patchFeature('webhooks', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="order_created">order.created</SelectItem>
                  <SelectItem value="all">Tous les events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Support</Label>
              <Select value={form.features.support} onValueChange={(v) => patchFeature('support', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="email_chat">Email + chat</SelectItem>
                  <SelectItem value="priority">Prioritaire + onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Blog / SEO</Label>
              <Select value={form.features.blogSeo} onValueChange={(v) => patchFeature('blogSeo', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basique</SelectItem>
                  <SelectItem value="full">Complet</SelectItem>
                  <SelectItem value="full_priority">Complet + sitemap prioritaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(
              [
                ['abTesting', 'A/B testing'],
                ['abandonedCart', 'Panier abandonné'],
                ['abandonedCartAdvanced', 'Relance panier avancée'],
                ['whatsappBusiness', 'WhatsApp Business'],
                ['whatsappMultiTemplates', 'WhatsApp multi-modèles'],
                ['apiHeadless', 'API headless'],
                ['loyalty', 'Fidélité'],
                ['multiCurrency', 'Multi-devise'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!!form.features[key]}
                  onCheckedChange={(v) => patchFeature(key, v)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SuperAdminPlans;
