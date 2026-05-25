import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  RefreshCw,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { promoCodesApi } from '@/services/api/promoCodes';
import {
  PromoCodeDTO,
  CreatePromoCodeRequest,
  PromoCodeType,
  DiscountType,
} from '@/types/promo-codes';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function generateLocalCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const emptyPromoForm: CreatePromoCodeRequest = {
  code: '',
  type: 'reusable',
  discountType: 'percentage',
  discountValue: 10,
  minOrderAmount: undefined,
  maxUses: undefined,
  isActive: true,
  expiresAt: undefined,
};

const AdminPromoCodes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCodeDTO | null>(null);
  const [promoForm, setPromoForm] = useState<CreatePromoCodeRequest>(emptyPromoForm);

  const { data: promoCodes = [], isLoading: loadingCodes } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: promoCodesApi.getAll,
  });

  const createPromoMut = useMutation({
    mutationFn: (d: CreatePromoCodeRequest) => promoCodesApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      setIsPromoDialogOpen(false);
      toast.success('Code promo créé');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updatePromoMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePromoCodeRequest }) =>
      promoCodesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      setIsPromoDialogOpen(false);
      toast.success('Code promo mis à jour');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deletePromoMut = useMutation({
    mutationFn: (id: number) => promoCodesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast.success('Code promo supprimé');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePromoMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      promoCodesApi.toggleActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promo-codes'] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreatePromo = () => {
    setEditingPromo(null);
    setPromoForm({ ...emptyPromoForm, code: generateLocalCode() });
    setIsPromoDialogOpen(true);
  };

  const openEditPromo = (p: PromoCodeDTO) => {
    setEditingPromo(p);
    setPromoForm({
      code: p.code,
      type: p.type,
      discountType: p.discountType,
      discountValue: p.discountValue,
      minOrderAmount: p.minOrderAmount,
      maxUses: p.maxUses,
      isActive: p.isActive,
      expiresAt: p.expiresAt,
    });
    setIsPromoDialogOpen(true);
  };

  const handleSavePromo = () => {
    if (!promoForm.code.trim()) {
      toast.error('Le code est requis');
      return;
    }
    if (promoForm.discountValue <= 0) {
      toast.error('La valeur de réduction doit être positive');
      return;
    }
    if (editingPromo) {
      updatePromoMut.mutate({ id: editingPromo.id, data: promoForm });
    } else {
      createPromoMut.mutate(promoForm);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copié`);
  };

  const filteredCodes = promoCodes.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDiscount = (type: DiscountType, value: number) =>
    type === 'percentage' ? `${value}%` : formatPrice(value);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout
      title="Codes Promo"
      breadcrumbs={[{ label: 'Codes Promo' }]}
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreatePromo} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Code
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
          <p className="font-display text-2xl">{promoCodes.length}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Actifs</p>
          <p className="font-display text-2xl text-green-600">
            {promoCodes.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Usage unique</p>
          <p className="font-display text-2xl text-blue-600">
            {promoCodes.filter((p) => p.type === 'single_use').length}
          </p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Réutilisables</p>
          <p className="font-display text-2xl text-purple-600">
            {promoCodes.filter((p) => p.type === 'reusable').length}
          </p>
        </div>
      </div>

      {loadingCodes ? (
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Réduction</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Min. commande</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Utilisations</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Expire</th>
                  <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-right font-body text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCodes.map((promo) => (
                  <tr key={promo.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-sm bg-muted px-2 py-1 rounded">
                          {promo.code}
                        </code>
                        <button
                          onClick={() => copyCode(promo.code)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          promo.type === 'single_use'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        )}
                      >
                        {promo.type === 'single_use' ? 'Unique' : 'Réutilisable'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-body font-medium">
                      {formatDiscount(promo.discountType, promo.discountValue)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                      {promo.minOrderAmount ? formatPrice(promo.minOrderAmount) : '—'}
                    </td>
                    <td className="px-4 py-3 font-body text-sm">
                      {promo.currentUses}
                      {promo.maxUses ? ` / ${promo.maxUses}` : ' / ∞'}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                      {formatDate(promo.expiresAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={(checked) =>
                          togglePromoMut.mutate({ id: promo.id, isActive: checked })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditPromo(promo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm('Supprimer ce code promo ?'))
                              deletePromoMut.mutate(promo.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCodes.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucun code promo trouvé
            </div>
          )}
        </div>
      )}

      {/* ═══════════ Dialog: Create/Edit Promo Code ═══════════ */}
      <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingPromo ? 'Modifier le Code Promo' : 'Nouveau Code Promo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Code + generate */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                Code
              </Label>
              <div className="flex gap-2">
                <Input
                  value={promoForm.code}
                  onChange={(e) =>
                    setPromoForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="EX: GOLD20"
                  className="font-mono uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Générer automatiquement"
                  onClick={() =>
                    setPromoForm((f) => ({ ...f, code: generateLocalCode() }))
                  }
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Type */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                Type d'utilisation
              </Label>
              <Select
                value={promoForm.type}
                onValueChange={(v) =>
                  setPromoForm((f) => ({ ...f, type: v as PromoCodeType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_use">Usage unique (1 seule fois)</SelectItem>
                  <SelectItem value="reusable">Réutilisable (plusieurs fois)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount type + value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                  Type de réduction
                </Label>
                <Select
                  value={promoForm.discountType}
                  onValueChange={(v) =>
                    setPromoForm((f) => ({ ...f, discountType: v as DiscountType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (DH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                  Valeur
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={promoForm.discountValue}
                  onChange={(e) =>
                    setPromoForm((f) => ({
                      ...f,
                      discountValue: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder={promoForm.discountType === 'percentage' ? 'Ex: 10' : 'Ex: 500'}
                />
              </div>
            </div>

            {/* Min order + Max uses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                  Commande min. (DH)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={promoForm.minOrderAmount ?? ''}
                  onChange={(e) =>
                    setPromoForm((f) => ({
                      ...f,
                      minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  placeholder="Optionnel"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                  Nombre max. d'utilisations
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={promoForm.maxUses ?? ''}
                  onChange={(e) =>
                    setPromoForm((f) => ({
                      ...f,
                      maxUses: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  placeholder="Illimité"
                  disabled={promoForm.type === 'single_use'}
                />
              </div>
            </div>

            {/* Expiry */}
            <div>
              <Label className="text-xs uppercase tracking-widest font-bold mb-2 block">
                Date d'expiration
              </Label>
              <Input
                type="date"
                value={promoForm.expiresAt?.split('T')[0] ?? ''}
                onChange={(e) =>
                  setPromoForm((f) => ({
                    ...f,
                    expiresAt: e.target.value ? `${e.target.value}T23:59:59` : undefined,
                  }))
                }
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <Switch
                checked={promoForm.isActive}
                onCheckedChange={(checked) =>
                  setPromoForm((f) => ({ ...f, isActive: checked }))
                }
              />
              <Label>Actif immédiatement</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSavePromo}
              disabled={createPromoMut.isPending || updatePromoMut.isPending}
            >
              {editingPromo ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPromoCodes;
