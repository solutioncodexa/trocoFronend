import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Pencil,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
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
type StockFilter = 'all' | 'alert' | 'low' | 'out' | 'expiring';

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

const statusBadge = (status: string, labels: Record<string, string>) => {
  const map: Record<string, string> = {
    OK: 'bg-emerald-100 text-emerald-800',
    LOW: 'bg-amber-100 text-amber-800',
    OUT: 'bg-red-100 text-red-800',
    EXPIRING: 'bg-orange-100 text-orange-800',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', map[status] ?? 'bg-muted')}>
      {labels[status] ?? status}
    </span>
  );
};

function RowActions({
  row,
  canAdjust,
  onEdit,
  onPurchase,
  onSale,
  onAdjust,
  labels,
}: {
  row: StockVariantRowDTO;
  canAdjust: boolean;
  onEdit: () => void;
  onPurchase: () => void;
  onSale: () => void;
  onAdjust: () => void;
  labels: {
    threshold: string;
    purchase: string;
    sale: string;
    inventory: string;
  };
}) {
  if (!canAdjust) return null;
  return (
    <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
      <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onEdit} title={labels.threshold}>
        <Pencil className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">{labels.threshold}</span>
      </Button>
      <Button size="sm" variant="outline" className="h-8 gap-1 px-2" onClick={onPurchase}>
        <Truck className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{labels.purchase}</span>
      </Button>
      <Button
        size="sm"
        className="h-8 gap-1 px-2"
        onClick={onSale}
        disabled={row.stock <= 0}
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{labels.sale}</span>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 gap-1 px-2"
        onClick={onAdjust}
        title={labels.inventory}
      >
        <ClipboardList className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

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
  const { t } = useAdminLocale();
  const navigate = useNavigate();
  const stockStatusLabels: Record<string, string> = {
    OK: 'OK',
    LOW: t('stock.statusLow'),
    OUT: t('common.outOfStock'),
    EXPIRING: t('stock.expiringSoon'),
  };
  const queryClient = useQueryClient();
  const { hasPermission } = useAdmin();
  const canAdjust = hasPermission(PERMISSIONS.STOCK_ADJUST);
  const [searchParams] = useSearchParams();
  const highlightVariant = searchParams.get('variant');
  const filterFromUrl = searchParams.get('filter');
  const [tab, setTab] = useState<Tab>('list');
  const [filter, setFilter] = useState<StockFilter>((filterFromUrl as StockFilter) || 'all');
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
    refetchOnMount: 'always',
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
  const listFilter = tab === 'alerts' ? 'alert' : filter;

  const { data: variantsData, isLoading: loadingVariants } = useQuery({
    queryKey: ['stock', 'variants', listFilter, variantsPage],
    queryFn: () => stockApi.listVariants(listFilter, variantsPage, 50),
    refetchOnMount: 'always',
  });
  const variants = variantsData?.content ?? [];

  const { data: allVariantsData } = useQuery({
    queryKey: ['stock', 'variants', 'all-options'],
    queryFn: () => stockApi.listVariants('all', 0, 200),
    enabled: tab === 'movements',
    refetchOnMount: 'always',
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

  const displayRows = useMemo(() => {
    if (tab === 'alerts') return filtered.filter((v) => v.status !== 'OK');
    return filtered;
  }, [filtered, tab]);

  const productCount = useMemo(
    () => new Set(displayRows.map((r) => r.productId).filter(Boolean)).size,
    [displayRows],
  );

  const groupedRows = useMemo(() => {
    const groups: { productId: number; productName: string; rows: StockVariantRowDTO[] }[] = [];
    const indexByProduct = new Map<number, number>();
    for (const row of displayRows) {
      const pid = row.productId ?? -1;
      const existing = indexByProduct.get(pid);
      if (existing == null) {
        indexByProduct.set(pid, groups.length);
        groups.push({
          productId: pid,
          productName: row.productName || '—',
          rows: [row],
        });
      } else {
        groups[existing].rows.push(row);
      }
    }
    return groups;
  }, [displayRows]);

  const openKpi = (nextFilter: StockFilter) => {
    setTab('list');
    setFilter(nextFilter);
    setVariantsPage(0);
  };

  const actionLabels = {
    threshold: t('stock.thresholdDate'),
    purchase: t('stock.actionPurchase'),
    sale: t('stock.actionDirectSale'),
    inventory: t('stock.inventoryCorrection'),
  };

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
      ? t('stock.dialogPurchaseTitle')
      : adjustMode === 'direct-sale'
        ? t('stock.dialogDirectSaleTitle')
        : t('stock.inventoryCorrection');

  const dialogDesc =
    adjustMode === 'purchase'
      ? 'Augmente le stock (réapprovisionnement fournisseur). L’opération est historisée avec la date.'
      : adjustMode === 'direct-sale'
        ? 'Diminue le stock pour une vente hors site (comptoir, WhatsApp…). Historisé comme une sortie.'
        : 'Définit le stock exact après inventaire physique. Historisé comme correction.';

  const tabs: { id: Tab; label: string; icon: typeof Settings2 }[] = [
    { id: 'settings', label: t('nav.settings'), icon: Settings2 },
    { id: 'alerts', label: t('stock.tabAlerts'), icon: AlertTriangle },
    { id: 'list', label: t('stock.tabList'), icon: Warehouse },
    { id: 'movements', label: t('stock.tabHistory'), icon: History },
  ];

  const qtyNum = parseInt(adjustQty, 10);
  const canSubmit =
    selected != null &&
    Number.isFinite(qtyNum) &&
    qtyNum >= 0 &&
    (adjustMode === 'adjust' || qtyNum > 0) &&
    !(adjustMode === 'direct-sale' && selected != null && qtyNum > selected.stock);

  return (
    <AdminLayout title={t('stock.title')} breadcrumbs={[{ label: t('stock.breadcrumb') }]}>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <button
          type="button"
          onClick={() => openKpi('low')}
          className={cn(
            'rounded-lg border border-border bg-card text-start transition hover:border-amber-300 hover:bg-amber-50/40',
            filter === 'low' && tab === 'list' && 'border-amber-400 ring-1 ring-amber-300',
          )}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> {t('stock.lowStock')}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl">{overview?.lowStockCount ?? 0}</CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => openKpi('out')}
          className={cn(
            'rounded-lg border border-border bg-card text-start transition hover:border-red-300 hover:bg-red-50/40',
            filter === 'out' && tab === 'list' && 'border-red-400 ring-1 ring-red-300',
          )}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <PackageX className="h-4 w-4 text-red-600" /> {t('stock.statOutOfStock')}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl">{overview?.outOfStockCount ?? 0}</CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => openKpi('expiring')}
          className={cn(
            'rounded-lg border border-border bg-card text-start transition hover:border-orange-300 hover:bg-orange-50/40',
            filter === 'expiring' && tab === 'list' && 'border-orange-400 ring-1 ring-orange-300',
          )}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarClock className="h-4 w-4 text-orange-600" /> {t('stock.expiringSoon')}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl">{overview?.expiringSoonCount ?? 0}</CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => openKpi('all')}
          className={cn(
            'rounded-lg border border-border bg-card text-start transition hover:border-primary/40 hover:bg-muted/40',
            filter === 'all' && tab === 'list' && 'border-primary/50 ring-1 ring-primary/30',
          )}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4" /> {t('stock.stockValue')}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl">{formatPrice(overview?.stockValue ?? 0)}</CardContent>
          </Card>
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tabItem) => (
          <Button
            key={tabItem.id}
            variant={tab === tabItem.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab(tabItem.id)}
            className="gap-1.5"
          >
            <tabItem.icon className="h-4 w-4" />
            {tabItem.label}
          </Button>
        ))}
      </div>

      {tab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('stock.settingsTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 max-w-xl">
            <div>
              <Label>{t('stock.defaultThreshold')}</Label>
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
                {t('stock.defaultThresholdHelp')}
              </p>
            </div>
            <div>
              <Label>{t('stock.expiryDaysLabel')}</Label>
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
              <Label>{t('stock.alertsEnabledLabel')}</Label>
              <Switch
                checked={settingsForm.alertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, alertsEnabled: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('stock.lowStockAlertsLabel')}</Label>
              <Switch
                checked={settingsForm.lowStockAlertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, lowStockAlertsEnabled: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('stock.expiryAlertsLabel')}</Label>
              <Switch
                checked={settingsForm.expiryAlertsEnabled}
                onCheckedChange={(v) => setSettingsForm((s) => ({ ...s, expiryAlertsEnabled: v }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending}>
                {t('common.save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => bulkClearMutation.mutate()}
                disabled={bulkClearMutation.isPending}
              >
                {t('stock.applyDefaultToAll')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(tab === 'alerts' || tab === 'list') && (
        <div className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('stock.sameCatalogHint')}</p>
              <p className="text-xs text-muted-foreground/80">{t('stock.listDescription')}</p>
            </div>
            {displayRows.length > 0 && (
              <p className="text-sm font-medium text-muted-foreground">
                {t('stock.variantsOfProducts', {
                  variants: displayRows.length,
                  products: productCount,
                })}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder={t('stock.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVariantsPage(0);
              }}
              className="max-w-xs"
            />
            {tab === 'list' && (
              <Select
                value={filter}
                onValueChange={(v) => {
                  setFilter(v as StockFilter);
                  setVariantsPage(0);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="alert">{t('stock.filterAlert')}</SelectItem>
                  <SelectItem value="low">{t('stock.lowStock')}</SelectItem>
                  <SelectItem value="out">{t('common.outOfStock')}</SelectItem>
                  <SelectItem value="expiring">{t('stock.expiringSoon')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {loadingVariants ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : displayRows.length === 0 ? (
            <EmptyState
              icon={tab === 'alerts' ? AlertTriangle : Warehouse}
              title={
                tab === 'alerts'
                  ? t('stock.noAlerts')
                  : search || filter !== 'all'
                    ? t('stock.emptyFiltered')
                    : t('stock.emptyCatalog')
              }
              description={
                tab === 'alerts'
                  ? t('stock.noAlertsDesc')
                  : search || filter !== 'all'
                    ? t('stock.emptyFilteredDesc')
                    : t('stock.emptyCatalogDesc')
              }
              actionLabel={
                tab === 'list' && !search && filter === 'all' ? t('stock.goToProducts') : undefined
              }
              onAction={
                tab === 'list' && !search && filter === 'all'
                  ? () => navigate('/admin/produits')
                  : undefined
              }
              className="my-4 border border-border bg-card"
            />
          ) : (
            <>
              {/* Mobile cards */}
              <div className="space-y-3 lg:hidden">
                {groupedRows.map((group) => (
                  <div key={group.productId} className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
                      <p className="truncate font-medium">{group.productName}</p>
                      <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 text-xs" asChild>
                        <Link to="/admin/produits">{t('stock.goToProducts')}</Link>
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {group.rows.map((row) => (
                        <div
                          key={row.variantId}
                          className={cn(
                            'space-y-3 p-3',
                            highlightVariant === String(row.variantId) && 'bg-primary/5 ring-1 ring-inset ring-primary',
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{row.variantLabel || '—'}</span>
                            {statusBadge(row.status, stockStatusLabels)}
                            <Badge variant="outline" className="text-xs">
                              {row.usesDefaultSafety
                                ? t('stock.thresholdDefault')
                                : t('stock.thresholdCustom')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {row.sku ? `SKU ${row.sku} · ` : ''}
                            {t('stock.colQty')} {row.stock} · {t('stock.colThreshold')}{' '}
                            {row.effectiveSafetyStock}
                            {row.expiryDate ? ` · Exp. ${row.expiryDate}` : ''}
                          </p>
                          <RowActions
                            row={row}
                            canAdjust={canAdjust}
                            labels={actionLabels}
                            onEdit={() => openEdit(row)}
                            onPurchase={() => openMovementDialog(row, 'purchase')}
                            onSale={() => openMovementDialog(row, 'direct-sale')}
                            onAdjust={() => openMovementDialog(row, 'adjust')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('common.product')}
                        </th>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('stock.colVariant')}
                        </th>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('stock.colSku')}
                        </th>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('stock.colQty')}
                        </th>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('stock.colThreshold')}
                        </th>
                        <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                          {t('stock.colStatus')}
                        </th>
                        <th className="px-4 py-3 text-end text-sm font-medium text-muted-foreground">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {groupedRows.map((group) =>
                        group.rows.map((row, idx) => (
                          <tr
                            key={row.variantId}
                            className={cn(
                              'hover:bg-muted/30',
                              highlightVariant === String(row.variantId) && 'bg-primary/5',
                            )}
                          >
                            <td className="px-4 py-3 align-middle">
                              {idx === 0 ? (
                                <div>
                                  <p className="font-medium">{group.productName}</p>
                                  {group.rows.length > 1 ? (
                                    <p className="text-xs text-muted-foreground">
                                      {group.rows.length} {t('stock.colVariant').toLowerCase()}
                                    </p>
                                  ) : null}
                                </div>
                              ) : (
                                <span className="ps-2 text-muted-foreground/40">·</span>
                              )}
                            </td>
                            <td className="px-4 py-3 align-middle">{row.variantLabel || '—'}</td>
                            <td className="px-4 py-3 align-middle text-sm text-muted-foreground">
                              {row.sku || '—'}
                            </td>
                            <td className="px-4 py-3 align-middle font-medium tabular-nums">{row.stock}</td>
                            <td className="px-4 py-3 align-middle">
                              <div className="flex flex-col gap-0.5">
                                <span className="tabular-nums">{row.effectiveSafetyStock}</span>
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  {row.usesDefaultSafety
                                    ? t('stock.thresholdDefault')
                                    : t('stock.thresholdCustom')}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <div className="flex flex-col gap-1">
                                {statusBadge(row.status, stockStatusLabels)}
                                {row.expiryDate ? (
                                  <span className="text-xs text-muted-foreground">Exp. {row.expiryDate}</span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <RowActions
                                row={row}
                                canAdjust={canAdjust}
                                labels={actionLabels}
                                onEdit={() => openEdit(row)}
                                onPurchase={() => openMovementDialog(row, 'purchase')}
                                onSale={() => openMovementDialog(row, 'direct-sale')}
                                onAdjust={() => openMovementDialog(row, 'adjust')}
                              />
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {tab !== 'alerts' && variantsData && variantsData.totalPages > 1 ? (
                <AdminPagination
                  page={variantsPage}
                  totalPages={variantsData.totalPages}
                  totalElements={variantsData.totalElements}
                  size={50}
                  onPageChange={setVariantsPage}
                />
              ) : null}
            </>
          )}
        </div>
      )}

      {tab === 'movements' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('stock.movementsDescription')}
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
                <SelectValue placeholder={t('common.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('stock.filterTypeAll')}</SelectItem>
                <SelectItem value="IN">{t('stock.filterTypeIn')}</SelectItem>
                <SelectItem value="OUT">{t('stock.filterTypeOut')}</SelectItem>
                <SelectItem value="ADJUST">{t('stock.filterTypeAdjust')}</SelectItem>
                <SelectItem value="RESTORE">{t('stock.filterTypeRestore')}</SelectItem>
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
                <SelectValue placeholder={t('common.product')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('stock.filterProductAll')}</SelectItem>
                {allVariants.map((v) => (
                  <SelectItem key={v.variantId} value={String(v.variantId)}>
                    {v.productName} — {v.variantLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingMovements ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : (
            <>
              <div className="space-y-2">
                {(movementsPage?.content ?? []).length === 0 && (
                  <EmptyState icon={History} title={t('stock.noMovements')} description={t('stock.noMovementsDesc')} />
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
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => adjustMutation.mutate()}
              disabled={adjustMutation.isPending || !canSubmit}
            >
              {t('stock.validate')}
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
              {t('common.cancel')}
            </Button>
            <Button onClick={() => patchMutation.mutate()} disabled={patchMutation.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminStock;
