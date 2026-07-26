import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Package,
  PackageX,
  CalendarClock,
  Settings2,
  History,
  Warehouse,
  ShoppingCart,
  Truck,
  ClipboardList,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stockApi } from '@/services/api/stock';
import type { StockMovementDTO, StockVariantRowDTO } from '@/types/stock';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAdmin } from '@/contexts/AdminContext';
import { PERMISSIONS } from '@/config/permissions';

type Tab = 'settings' | 'alerts' | 'list' | 'movements';
type AdjustMode = 'purchase' | 'direct-sale' | 'adjust';

const PURCHASE_REASONS = [
  'Achat fournisseur',
  'Réapprovisionnement',
  'Retour client',
  'Autre entrée',
];

const SALE_REASONS = [
  'Vente directe (comptoir)',
  'Vente WhatsApp / téléphone',
  'Échantillon / don',
  'Perte / casse',
  'Autre sortie',
];

const ADJUST_REASONS = [
  'Correction inventaire',
  'Inventaire physique',
  'Autre correction',
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    OK: 'bg-emerald-100 text-emerald-800',
    LOW: 'bg-amber-100 text-amber-800',
    OUT: 'bg-red-100 text-red-800',
    EXPIRING: 'bg-orange-100 text-orange-800',
  };
  const labels: Record<string, string> = {
    OK: 'OK',
    LOW: 'Bas',
    OUT: 'Rupture',
    EXPIRING: 'Expire bientôt',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', map[status] ?? 'bg-muted')}>
      {labels[status] ?? status}
    </span>
  );
};

function movementLabel(m: StockMovementDTO): { label: string; className: string } {
  const reason = (m.reason || '').toLowerCase();
  if (m.type === 'IN') {
    return { label: 'Achat / entrée', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  if (m.type === 'RESTORE') {
    return { label: 'Annulation commande', className: 'bg-blue-100 text-blue-800 border-blue-200' };
  }
  if (m.type === 'ADJUST') {
    return { label: 'Correction inventaire', className: 'bg-slate-100 text-slate-800 border-slate-200' };
  }
  if (m.type === 'OUT') {
    if (reason.includes('commande') || m.orderId != null) {
      return { label: 'Vente site', className: 'bg-violet-100 text-violet-800 border-violet-200' };
    }
    return { label: 'Vente directe / sortie', className: 'bg-amber-100 text-amber-900 border-amber-200' };
  }
  return { label: m.type, className: 'bg-muted' };
}

function formatQtyDelta(m: StockMovementDTO): string {
  if (m.type === 'IN' || m.type === 'RESTORE') return `+${m.quantity}`;
  if (m.type === 'OUT') return `−${m.quantity}`;
  const delta = m.stockAfter - m.stockBefore;
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `−${Math.abs(delta)}`;
  return '0';
}

const AdminStock = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAdmin();
  const canAdjust = hasPermission(PERMISSIONS.STOCK_ADJUST);
  const [searchParams] = useSearchParams();
  const highlightVariant = searchParams.get('variant');
  const filterFromUrl = searchParams.get('filter');
  const [tab, setTab] = useState<Tab>(highlightVariant || filterFromUrl ? 'list' : 'alerts');
  const [filter, setFilter] = useState(filterFromUrl || 'all');
  const [search, setSearch] = useState('');
  const [movPage, setMovPage] = useState(0);
  const [movTypeFilter, setMovTypeFilter] = useState('all');
  const [movVariantFilter, setMovVariantFilter] = useState<string>('all');

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<StockVariantRowDTO | null>(null);
  const [adjustMode, setAdjustMode] = useState<AdjustMode>('purchase');
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustReasonPreset, setAdjustReasonPreset] = useState(PURCHASE_REASONS[0]);
  const [adjustReasonExtra, setAdjustReasonExtra] = useState('');
  const [editSafety, setEditSafety] = useState('');
  const [editReorder, setEditReorder] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [useDefaultSafety, setUseDefaultSafety] = useState(true);

  const { data: overview } = useQuery({
    queryKey: ['stock', 'overview'],
    queryFn: () => stockApi.getOverview(),
  });

  const { data: settings } = useQuery({
    queryKey: ['stock', 'settings'],
    queryFn: () => stockApi.getSettings(),
  });

  const [settingsForm, setSettingsForm] = useState({
    defaultSafetyStock: 10,
    expiryAlertDays: 30,
    alertsEnabled: true,
    lowStockAlertsEnabled: true,
    expiryAlertsEnabled: true,
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        defaultSafetyStock: settings.defaultSafetyStock,
        expiryAlertDays: settings.expiryAlertDays,
        alertsEnabled: settings.alertsEnabled,
        lowStockAlertsEnabled: settings.lowStockAlertsEnabled,
        expiryAlertsEnabled: settings.expiryAlertsEnabled,
      });
    }
  }, [settings]);

  const [variantsPage, setVariantsPage] = useState(0);

  const { data: variantsData, isLoading: loadingVariants } = useQuery({
    queryKey: ['stock', 'variants', filter, variantsPage],
    queryFn: () => stockApi.listVariants(filter, variantsPage, 50),
  });
  const variants = variantsData?.content ?? [];

  const { data: allVariantsData } = useQuery({
    queryKey: ['stock', 'variants', 'all-options'],
    queryFn: () => stockApi.listVariants('all', 0, 200),
    enabled: tab === 'movements',
  });
  const allVariants = allVariantsData?.content ?? [];

  const movVariantId =
    movVariantFilter !== 'all' ? Number(movVariantFilter) : undefined;

  const { data: movementsPage, isLoading: loadingMovements } = useQuery({
    queryKey: ['stock', 'movements', movPage, movTypeFilter, movVariantFilter],
    queryFn: () =>
      stockApi.listMovements({
        page: movPage,
        size: 20,
        type: movTypeFilter,
        variantId: movVariantId,
      }),
    enabled: tab === 'movements',
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['stock'] });
  };

  const saveSettingsMutation = useMutation({
    mutationFn: () => stockApi.updateSettings(settingsForm),
    onSuccess: () => {
      toast.success('Paramètres enregistrés');
      invalidate();
    },
    onError: (e) => toastError(e, 'Erreur enregistrement'),
  });

  const bulkClearMutation = useMutation({
    mutationFn: () => stockApi.bulkSafety({ clearOverrides: true }),
    onSuccess: (r) => {
      toast.success(`${r.updated} variante(s) héritent désormais du seuil défaut`);
      invalidate();
    },
    onError: (e) => toastError(e, 'Erreur'),
  });

  const buildReason = () => {
    const extra = adjustReasonExtra.trim();
    return extra ? `${adjustReasonPreset} — ${extra}` : adjustReasonPreset;
  };

  const adjustMutation = useMutation({
    mutationFn: () => {
      const type = adjustMode === 'purchase' ? 'IN' : adjustMode === 'direct-sale' ? 'OUT' : 'ADJUST';
      return stockApi.adjust({
        variantId: selected!.variantId,
        quantity: parseInt(adjustQty, 10),
        type,
        reason: buildReason(),
      });
    },
    onSuccess: () => {
      const msg =
        adjustMode === 'purchase'
          ? 'Achat stock enregistré'
          : adjustMode === 'direct-sale'
            ? 'Vente directe enregistrée'
            : 'Stock corrigé';
      toast.success(msg);
      setAdjustOpen(false);
      invalidate();
    },
    onError: (e) => toastError(e, 'Erreur ajustement'),
  });

  const patchMutation = useMutation({
    mutationFn: () => {
      if (useDefaultSafety) {
        return stockApi.patchVariant(selected!.variantId, {
          clearSafetyStock: true,
          reorderQty: editReorder ? parseInt(editReorder, 10) : undefined,
          expiryDate: editExpiry || undefined,
          clearExpiryDate: !editExpiry,
        });
      }
      return stockApi.patchVariant(selected!.variantId, {
        safetyStock: editSafety ? parseInt(editSafety, 10) : 0,
        reorderQty: editReorder ? parseInt(editReorder, 10) : undefined,
        expiryDate: editExpiry || undefined,
        clearExpiryDate: !editExpiry,
      });
    },
    onSuccess: () => {
      toast.success('Variante mise à jour');
      setEditOpen(false);
      invalidate();
    },
    onError: (e) => toastError(e, 'Erreur'),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return variants;
    return variants.filter(
      (v) =>
        v.productName?.toLowerCase().includes(q) ||
        v.variantLabel?.toLowerCase().includes(q) ||
        v.sku?.toLowerCase().includes(q)
    );
  }, [variants, search]);

  const openMovementDialog = (row: StockVariantRowDTO, mode: AdjustMode) => {
    setSelected(row);
    setAdjustMode(mode);
    if (mode === 'purchase') {
      setAdjustQty(String(row.reorderQty || 10));
      setAdjustReasonPreset(PURCHASE_REASONS[0]);
    } else if (mode === 'direct-sale') {
      setAdjustQty('1');
      setAdjustReasonPreset(SALE_REASONS[0]);
    } else {
      setAdjustQty(String(row.stock));
      setAdjustReasonPreset(ADJUST_REASONS[0]);
    }
    setAdjustReasonExtra('');
    setAdjustOpen(true);
  };

  const openEdit = (row: StockVariantRowDTO) => {
    setSelected(row);
    setUseDefaultSafety(row.usesDefaultSafety);
    setEditSafety(row.safetyStock != null ? String(row.safetyStock) : '');
    setEditReorder(row.reorderQty != null ? String(row.reorderQty) : '');
    setEditExpiry(row.expiryDate ?? '');
    setEditOpen(true);
  };

  const reasonOptions =
    adjustMode === 'purchase' ? PURCHASE_REASONS : adjustMode === 'direct-sale' ? SALE_REASONS : ADJUST_REASONS;

  const dialogTitle =
    adjustMode === 'purchase'
      ? 'Achat / entrée stock'
      : adjustMode === 'direct-sale'
        ? 'Vente directe (hors site)'
        : 'Correction inventaire';

  const dialogDesc =
    adjustMode === 'purchase'
      ? 'Augmente le stock (réapprovisionnement fournisseur). L’opération est historisée avec la date.'
      : adjustMode === 'direct-sale'
        ? 'Diminue le stock pour une vente hors site (comptoir, WhatsApp…). Historisé comme une sortie.'
        : 'Définit le stock exact après inventaire physique. Historisé comme correction.';

  const tabs: { id: Tab; label: string; icon: typeof Settings2 }[] = [
    { id: 'settings', label: 'Réglages', icon: Settings2 },
    { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
    { id: 'list', label: 'Liste stock', icon: Warehouse },
    { id: 'movements', label: 'Historique', icon: History },
  ];

  const qtyNum = parseInt(adjustQty, 10);
  const canSubmit =
    selected != null &&
    Number.isFinite(qtyNum) &&
    qtyNum >= 0 &&
    (adjustMode === 'adjust' || qtyNum > 0) &&
    !(adjustMode === 'direct-sale' && selected != null && qtyNum > selected.stock);

  return (
    <AdminLayout title="Stock" breadcrumbs={[{ label: 'Stock' }]}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Stock bas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-display">{overview?.lowStockCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PackageX className="w-4 h-4" /> Ruptures
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-display">{overview?.outOfStockCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarClock className="w-4 h-4" /> Expire bientôt
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-display">{overview?.expiringSoonCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" /> Valeur stock
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-display">{formatPrice(overview?.stockValue ?? 0)}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-3">
        {tabs.map((t) => (
          <Button
            key={t.id}
            variant={tab === t.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab(t.id)}
            className="gap-1.5"
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </Button>
        ))}
      </div>

      {tab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres d&apos;alerte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 max-w-xl">
            <div>
              <Label>Seuil d&apos;alerte par défaut</Label>
              <Input
                type="number"
                min={0}
                className="mt-1"
                value={settingsForm.defaultSafetyStock}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, defaultSafetyStock: parseInt(e.target.value, 10) || 0 }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Utilisé pour les variantes sans seuil personnalisé
              </p>
            </div>
            <div>
              <Label>Jours avant alerte péremption</Label>
              <Input
                type="number"
                min={1}
                className="mt-1"
                value={settingsForm.expiryAlertDays}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, expiryAlertDays: parseInt(e.target.value, 10) || 30 }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alertes actives</Label>
              <Switch
                checked={settingsForm.alertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, alertsEnabled: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alertes stock bas</Label>
              <Switch
                checked={settingsForm.lowStockAlertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, lowStockAlertsEnabled: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alertes péremption</Label>
              <Switch
                checked={settingsForm.expiryAlertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, expiryAlertsEnabled: v }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending}>
                Enregistrer
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkClearMutation.mutate()}
                disabled={bulkClearMutation.isPending}
              >
                Appliquer le défaut aux variantes sans override
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(tab === 'alerts' || tab === 'list') && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Les commandes du site déduisent le stock automatiquement. Utilisez{' '}
            <strong>Achat stock</strong> pour réapprovisionner, ou{' '}
            <strong>Vente directe</strong> pour une vente hors site — chaque action est enregistrée dans l’historique.
          </p>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Rechercher produit, variante, SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            {tab === 'list' && (
              <Select
                value={filter}
                onValueChange={(v) => {
                  setFilter(v);
                  setVariantsPage(0);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="alert">En alerte</SelectItem>
                  <SelectItem value="low">Stock bas</SelectItem>
                  <SelectItem value="out">Rupture</SelectItem>
                  <SelectItem value="expiring">Expire bientôt</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {loadingVariants ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : (
            <div className="space-y-2">
              {(tab === 'alerts' ? filtered.filter((v) => v.status !== 'OK') : filtered).map((row) => (
                <div
                  key={row.variantId}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-4 bg-card',
                    highlightVariant === String(row.variantId) && 'ring-2 ring-primary'
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium truncate">{row.productName}</span>
                      {statusBadge(row.status)}
                      {row.usesDefaultSafety ? (
                        <Badge variant="outline" className="text-xs">
                          Seuil défaut
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Personnalisé
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {row.variantLabel}
                      {row.sku ? ` · ${row.sku}` : ''} · Stock {row.stock} · Seuil {row.effectiveSafetyStock}
                      {row.expiryDate ? ` · Exp. ${row.expiryDate}` : ''}
                      {row.lastRestockedAt
                        ? ` · Dernier achat ${new Date(row.lastRestockedAt).toLocaleDateString('fr-FR')}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {canAdjust && (
                      <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                        Seuil / date
                      </Button>
                    )}
                    {canAdjust && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => openMovementDialog(row, 'purchase')}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Achat stock
                      </Button>
                    )}
                    {canAdjust && (
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => openMovementDialog(row, 'direct-sale')}
                        disabled={row.stock <= 0}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Vente directe
                      </Button>
                    )}
                    {canAdjust && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={() => openMovementDialog(row, 'adjust')}
                        title="Correction inventaire"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        Inventaire
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(tab === 'alerts' ? filtered.filter((v) => v.status !== 'OK') : filtered).length === 0 && (
                <EmptyState icon={Warehouse} title="Aucune ligne à afficher" />
              )}
              {tab !== 'alerts' && variantsData && variantsData.totalPages > 1 ? (
                <AdminPagination
                  page={variantsPage}
                  totalPages={variantsData.totalPages}
                  totalElements={variantsData.totalElements}
                  size={50}
                  onPageChange={setVariantsPage}
                />
              ) : null}
            </div>
          )}
        </div>
      )}

      {tab === 'movements' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Historique de tous les mouvements : achats, ventes directes, commandes site et corrections.
          </p>
          <div className="flex flex-wrap gap-3">
            <Select
              value={movTypeFilter}
              onValueChange={(v) => {
                setMovTypeFilter(v);
                setMovPage(0);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="IN">Achats / entrées</SelectItem>
                <SelectItem value="OUT">Sorties (site + direct)</SelectItem>
                <SelectItem value="ADJUST">Corrections inventaire</SelectItem>
                <SelectItem value="RESTORE">Annulations commande</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={movVariantFilter}
              onValueChange={(v) => {
                setMovVariantFilter(v);
                setMovPage(0);
              }}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les produits</SelectItem>
                {allVariants.map((v) => (
                  <SelectItem key={v.variantId} value={String(v.variantId)}>
                    {v.productName} — {v.variantLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingMovements ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : (
            <>
              <div className="space-y-2">
                {(movementsPage?.content ?? []).length === 0 && (
                  <EmptyState icon={History} title="Aucun mouvement" description="Les achats, ventes et commandes apparaîtront ici." />
                )}
                {(movementsPage?.content ?? []).map((m) => {
                  const meta = movementLabel(m);
                  return (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border p-3 flex flex-wrap justify-between gap-2 bg-card"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={cn('border', meta.className)}>
                            {meta.label}
                          </Badge>
                          <span className="font-medium">{m.productName ?? '—'}</span>
                          <span className="text-muted-foreground text-sm">{m.variantLabel}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stock {m.stockBefore} → {m.stockAfter}{' '}
                          <span className="font-medium text-foreground">({formatQtyDelta(m)})</span>
                          {m.reason ? ` · ${m.reason}` : ''}
                          {m.createdBy ? ` · par ${m.createdBy}` : ''}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <div>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : ''}
                        </div>
                        <div>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {movementsPage && movementsPage.totalPages > 0 && (
                <AdminPagination
                  page={movPage}
                  totalPages={movementsPage.totalPages}
                  totalElements={movementsPage.totalElements}
                  size={20}
                  onPageChange={setMovPage}
                />
              )}
            </>
          )}
        </div>
      )}

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selected?.productName} — {selected?.variantLabel}{' '}
              <span className="font-medium text-foreground">(stock actuel : {selected?.stock})</span>
            </p>
            <div>
              <Label>
                {adjustMode === 'adjust' ? 'Nouveau stock (absolu)' : 'Quantité'}
              </Label>
              <Input
                type="number"
                min={0}
                className="mt-1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
              />
              {adjustMode === 'direct-sale' && selected != null && qtyNum > selected.stock && (
                <p className="text-xs text-destructive mt-1">
                  Quantité supérieure au stock disponible ({selected.stock})
                </p>
              )}
              {adjustMode !== 'adjust' && selected != null && Number.isFinite(qtyNum) && qtyNum > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Stock après opération :{' '}
                  {adjustMode === 'purchase' ? selected.stock + qtyNum : Math.max(0, selected.stock - qtyNum)}
                </p>
              )}
            </div>
            <div>
              <Label>Motif</Label>
              <Select
                value={adjustReasonPreset}
                onValueChange={setAdjustReasonPreset}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Détail (optionnel)</Label>
              <Input
                className="mt-1"
                placeholder="Ex: fournisseur X, client Y…"
                value={adjustReasonExtra}
                onChange={(e) => setAdjustReasonExtra(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => adjustMutation.mutate()}
              disabled={adjustMutation.isPending || !canSubmit}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seuil & péremption</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Utiliser le seuil défaut global</Label>
              <Switch checked={useDefaultSafety} onCheckedChange={setUseDefaultSafety} />
            </div>
            {!useDefaultSafety && (
              <div>
                <Label>Seuil d&apos;alerte personnalisé</Label>
                <Input
                  type="number"
                  min={0}
                  className="mt-1"
                  value={editSafety}
                  onChange={(e) => setEditSafety(e.target.value)}
                />
              </div>
            )}
            <div>
              <Label>Qté réappro suggérée</Label>
              <Input
                type="number"
                min={0}
                className="mt-1"
                value={editReorder}
                onChange={(e) => setEditReorder(e.target.value)}
              />
            </div>
            <div>
              <Label>Date de péremption</Label>
              <Input
                type="date"
                className="mt-1"
                value={editExpiry}
                onChange={(e) => setEditExpiry(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => patchMutation.mutate()} disabled={patchMutation.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminStock;
