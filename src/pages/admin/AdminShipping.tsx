import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Truck } from 'lucide-react';
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
  trackingUrlTemplate: string;
  etaDaysMin: string;
  etaDaysMax: string;
};

type Draft = Omit<CarrierForm, 'enabled'>;

const PRESETS: { code: string; name: string; trackingUrlTemplate: string }[] = [
  { code: 'AMANA', name: 'Amana', trackingUrlTemplate: '' },
  { code: 'CHRONODIALI', name: 'Chronodiali', trackingUrlTemplate: '' },
  { code: 'GLOVO', name: 'Glovo', trackingUrlTemplate: '' },
  { code: 'CTM', name: 'CTM', trackingUrlTemplate: '' },
  { code: 'DHL', name: 'DHL', trackingUrlTemplate: 'https://www.dhl.com/ma-fr/home/tracking.html?tracking-id={tracking}' },
];

function emptyDraft(): Draft {
  return {
    code: '',
    name: '',
    baseFee: '35',
    freeAbove: '',
    trackingUrlTemplate: '',
    etaDaysMin: '2',
    etaDaysMax: '5',
  };
}

function toForm(c: ShippingCarrierDTO): CarrierForm {
  return {
    code: c.code,
    name: c.name,
    enabled: c.enabled ?? true,
    baseFee: c.baseFee != null ? String(c.baseFee) : '0',
    freeAbove: c.freeAbove != null ? String(c.freeAbove) : '',
    trackingUrlTemplate: c.trackingUrlTemplate ?? '',
    etaDaysMin: c.etaDaysMin != null ? String(c.etaDaysMin) : '2',
    etaDaysMax: c.etaDaysMax != null ? String(c.etaDaysMax) : '5',
  };
}

function parseMoney(raw: string, label: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) {
    toast.error(`${label} invalide`);
    return Number.NaN;
  }
  return n;
}

function parseDays(raw: string, label: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 0 || n > 60) {
    toast.error(`${label} invalide`);
    return Number.NaN;
  }
  return n;
}

const AdminShipping = () => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data: carriers = [], isLoading } = useQuery({
    queryKey: ['shipping-carriers-admin'],
    queryFn: () => shippingApi.listAdmin(),
  });

  const [forms, setForms] = useState<Record<string, CarrierForm>>({});
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [creating, setCreating] = useState(false);

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

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setCreating(true);
    setDraft((prev) => ({
      ...prev,
      code: preset.code,
      name: preset.name,
      trackingUrlTemplate: preset.trackingUrlTemplate,
    }));
  };

  const saveCarrier = (original: ShippingCarrierDTO) => {
    const f = forms[original.code];
    if (!f) return;
    const baseFee = parseMoney(f.baseFee, 'Frais de base');
    if (baseFee == null || Number.isNaN(baseFee)) {
      if (baseFee == null) toast.error('Frais de base invalides');
      return;
    }
    const freeAbove = parseMoney(f.freeAbove, 'Seuil livraison gratuite');
    if (Number.isNaN(freeAbove)) return;
    const etaDaysMin = parseDays(f.etaDaysMin, 'Délai minimum');
    if (Number.isNaN(etaDaysMin)) return;
    const etaDaysMax = parseDays(f.etaDaysMax, 'Délai maximum');
    if (Number.isNaN(etaDaysMax)) return;
    if (etaDaysMin != null && etaDaysMax != null && etaDaysMax < etaDaysMin) {
      toast.error('Le délai maximum doit être supérieur ou égal au minimum');
      return;
    }
    saveMutation.mutate({
      ...original,
      code: f.code,
      name: f.name.trim() || original.name,
      enabled: f.enabled,
      baseFee,
      freeAbove,
      trackingUrlTemplate: f.trackingUrlTemplate.trim() || null,
      etaDaysMin,
      etaDaysMax,
    });
  };

  const createCarrier = () => {
    const code = draft.code.trim().toUpperCase();
    const name = draft.name.trim();
    if (!/^[A-Z0-9_-]{2,40}$/.test(code)) {
      toast.error('Code : 2 à 40 caractères (lettres, chiffres, _ ou -)');
      return;
    }
    if (!name) {
      toast.error('Le nom affiché est obligatoire');
      return;
    }
    if (carriers.some((c) => c.code.toUpperCase() === code)) {
      toast.error('Ce code existe déjà');
      return;
    }
    const baseFee = parseMoney(draft.baseFee, 'Frais de base');
    if (baseFee == null || Number.isNaN(baseFee)) {
      if (baseFee == null) toast.error('Frais de base invalides');
      return;
    }
    const freeAbove = parseMoney(draft.freeAbove, 'Seuil livraison gratuite');
    if (Number.isNaN(freeAbove)) return;
    const etaDaysMin = parseDays(draft.etaDaysMin, 'Délai minimum') ?? 2;
    const etaDaysMax = parseDays(draft.etaDaysMax, 'Délai maximum') ?? 5;
    if (Number.isNaN(etaDaysMin) || Number.isNaN(etaDaysMax)) return;
    if (etaDaysMax < etaDaysMin) {
      toast.error('Le délai maximum doit être supérieur ou égal au minimum');
      return;
    }
    saveMutation.mutate(
      {
        code,
        name,
        enabled: true,
        baseFee,
        freeAbove,
        trackingUrlTemplate: draft.trackingUrlTemplate.trim() || null,
        etaDaysMin,
        etaDaysMax,
        sortOrder: carriers.length,
      },
      {
        onSuccess: () => {
          setDraft(emptyDraft());
          setCreating(false);
        },
      },
    );
  };

  const showForm = creating || carriers.length === 0;

  return (
    <AdminLayout title={t('shipping.title')} breadcrumbs={[{ label: t('shipping.title') }]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">Transporteurs</h1>
          </div>
          {carriers.length > 0 && !showForm ? (
            <Button type="button" className="gap-2" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" />
              Ajouter un transporteur
            </Button>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {carriers.length === 0 ? (
              <EmptyState title={t('shipping.empty')} description={t('shipping.emptyDesc')} />
            ) : null}

            {showForm ? (
              <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold">Nouveau transporteur</h2>
                  {carriers.length > 0 ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
                      Annuler
                    </Button>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  Choisissez un modèle ou saisissez le vôtre. Au checkout, le client verra le nom, les frais et le délai.
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.code}
                      type="button"
                      size="sm"
                      variant={draft.code === preset.code ? 'default' : 'outline'}
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <CarrierFields
                  idPrefix="new"
                  value={draft}
                  onChange={(partial) => setDraft((prev) => ({ ...prev, ...partial }))}
                  codeEditable
                />
                <Button
                  type="button"
                  className="gap-2"
                  disabled={saveMutation.isPending}
                  onClick={createCarrier}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Ajouter
                </Button>
              </section>
            ) : null}

            {carriers.length > 0 ? (
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
                      <CarrierFields
                        idPrefix={c.code}
                        value={f}
                        onChange={(partial) => patch(c.code, partial)}
                      />
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
            ) : null}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

function CarrierFields({
  idPrefix,
  value,
  onChange,
  codeEditable = false,
}: {
  idPrefix: string;
  value: Draft;
  onChange: (partial: Partial<Draft>) => void;
  codeEditable?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {codeEditable ? (
        <div>
          <Label htmlFor={`${idPrefix}-code`}>Code</Label>
          <Input
            id={`${idPrefix}-code`}
            className="mt-1.5 font-mono uppercase"
            value={value.code}
            maxLength={40}
            placeholder="AMANA"
            onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
          />
        </div>
      ) : null}
      <div className={codeEditable ? '' : 'sm:col-span-2'}>
        <Label htmlFor={`${idPrefix}-name`}>Nom affiché</Label>
        <Input
          id={`${idPrefix}-name`}
          className="mt-1.5"
          value={value.name}
          placeholder="Amana"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-fee`}>Frais de base (MAD)</Label>
        <Input
          id={`${idPrefix}-fee`}
          type="number"
          min={0}
          className="mt-1.5"
          value={value.baseFee}
          onChange={(e) => onChange({ baseFee: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-free`}>Gratuit à partir de (MAD)</Label>
        <Input
          id={`${idPrefix}-free`}
          type="number"
          min={0}
          className="mt-1.5"
          value={value.freeAbove}
          placeholder="Optionnel"
          onChange={(e) => onChange({ freeAbove: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-min`}>Délai min. (jours)</Label>
        <Input
          id={`${idPrefix}-min`}
          type="number"
          min={0}
          max={60}
          className="mt-1.5"
          value={value.etaDaysMin}
          onChange={(e) => onChange({ etaDaysMin: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-max`}>Délai max. (jours)</Label>
        <Input
          id={`${idPrefix}-max`}
          type="number"
          min={0}
          max={60}
          className="mt-1.5"
          value={value.etaDaysMax}
          onChange={(e) => onChange({ etaDaysMax: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-track`}>Lien de suivi</Label>
        <Input
          id={`${idPrefix}-track`}
          className="mt-1.5"
          value={value.trackingUrlTemplate}
          placeholder="https://exemple.ma/suivi/{tracking}"
          onChange={(e) => onChange({ trackingUrlTemplate: e.target.value })}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Optionnel. Écrivez {'{tracking}'} à l’endroit du numéro de suivi.
        </p>
      </div>
    </div>
  );
}

export default AdminShipping;
