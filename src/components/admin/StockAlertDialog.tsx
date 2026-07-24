import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { PERMISSIONS } from '@/config/permissions';
import { stockApi } from '@/services/api/stock';
import type { StockVariantRowDTO } from '@/types/stock';
import { cn } from '@/lib/utils';
import { clearStockAlertPending, isStockAlertPending } from '@/utils/stockAlertSession';

function statusBadge(status: string) {
  if (status === 'OUT') {
    return <Badge variant="destructive">Rupture</Badge>;
  }
  if (status === 'LOW') {
    return (
      <Badge className="bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 border-0">
        Stock bas
      </Badge>
    );
  }
  return <Badge variant="outline">{status}</Badge>;
}

const StockAlertDialog = () => {
  const { isAuthenticated, hasPermission } = useAdmin();
  const canViewStock = hasPermission(PERMISSIONS.STOCK_VIEW);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const pending = typeof window !== 'undefined' && isStockAlertPending();
  const enabled = isAuthenticated && canViewStock && pending;

  const { data: overview, isFetched } = useQuery({
    queryKey: ['stock', 'overview', 'login-alert'],
    queryFn: () => stockApi.getOverview(),
    enabled,
    staleTime: 60_000,
  });

  const criticalAlerts = useMemo(() => {
    const rows = overview?.alerts ?? [];
    return rows.filter((r) => r.status === 'OUT' || r.status === 'LOW');
  }, [overview]);

  const outCount = criticalAlerts.filter((r) => r.status === 'OUT').length;
  const lowCount = criticalAlerts.filter((r) => r.status === 'LOW').length;

  useEffect(() => {
    if (!enabled || !isFetched || checked) return;
    setChecked(true);
    if (criticalAlerts.length > 0) {
      setOpen(true);
    } else {
      clearStockAlertPending();
    }
  }, [enabled, isFetched, criticalAlerts.length, checked]);

  const handleClose = () => {
    setOpen(false);
    clearStockAlertPending();
  };

  if (!enabled && !open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
        else setOpen(true);
      }}
    >
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Alertes stock
          </DialogTitle>
          <DialogDescription>
            {outCount > 0 && lowCount > 0
              ? `${outCount} rupture${outCount > 1 ? 's' : ''} et ${lowCount} stock${lowCount > 1 ? 's' : ''} bas détecté${outCount + lowCount > 1 ? 's' : ''}.`
              : outCount > 0
                ? `${outCount} produit${outCount > 1 ? 's' : ''} en rupture de stock.`
                : `${lowCount} produit${lowCount > 1 ? 's' : ''} en stock bas.`}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
          {criticalAlerts.slice(0, 12).map((row: StockVariantRowDTO) => (
            <Link
              key={row.variantId}
              to={`/admin/stock?variant=${row.variantId}`}
              onClick={handleClose}
              className={cn(
                'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50',
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  row.status === 'OUT' ? 'bg-destructive/10' : 'bg-amber-500/15',
                )}
              >
                {row.status === 'OUT' ? (
                  <Package className="h-4 w-4 text-destructive" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate">{row.productName}</p>
                  {statusBadge(row.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {row.variantLabel}
                  {row.sku ? ` · ${row.sku}` : ''} · stock {row.stock}
                  {row.effectiveSafetyStock != null ? ` / seuil ${row.effectiveSafetyStock}` : ''}
                </p>
              </div>
            </Link>
          ))}
          {criticalAlerts.length > 12 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{criticalAlerts.length - 12} autre{criticalAlerts.length - 12 > 1 ? 's' : ''}…
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Plus tard
          </Button>
          <Button asChild onClick={handleClose}>
            <Link to="/admin/stock">Voir le stock</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockAlertDialog;
