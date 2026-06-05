import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { createEmptyVariantRow, type ProductVariantFormRow } from '@/types/product-variant';

type Props = {
  rows: ProductVariantFormRow[];
  onChange: (rows: ProductVariantFormRow[]) => void;
  isPromo: boolean;
  pricePerGram?: number;
  defaultMarginGain?: string;
};

export function ProductVariantEditor({ rows, onChange, isPromo, pricePerGram, defaultMarginGain = '500' }: Props) {
  const updateRow = (index: number, patch: Partial<ProductVariantFormRow>) => {
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const setDefault = (index: number) => {
    onChange(rows.map((r, i) => ({ ...r, isDefault: i === index })));
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    if (next.length === 0) {
      onChange([createEmptyVariantRow(defaultMarginGain, true)]);
      return;
    }
    if (!next.some((r) => r.isDefault)) next[0].isDefault = true;
    onChange(next);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Label className="text-base">Variantes poids / prix *</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ex. 12 g, 15 g, 18 g — le client choisit sur la fiche ; le prix se met à jour automatiquement.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...rows, createEmptyVariantRow(defaultMarginGain, rows.length === 0)])}
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter un poids
        </Button>
      </div>
      {pricePerGram != null && !isPromo && (
        <p className="text-xs text-muted-foreground">
          Formule : (grammes × {pricePerGram} + marge) MAD
        </p>
      )}
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.id ?? `new-${index}`}
            className="grid gap-3 rounded-md border border-border/60 bg-muted/20 p-3 md:grid-cols-[auto_1fr_1fr_1fr_1fr_auto]"
          >
            <div className="flex items-center text-muted-foreground pt-6">
              <GripVertical className="w-4 h-4" />
            </div>
            <div>
              <Label>Poids (g) *</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={row.weight}
                onChange={(e) => updateRow(index, { weight: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Marge (MAD)</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={row.marginGain}
                onChange={(e) => updateRow(index, { marginGain: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{isPromo ? 'Prix promo (MAD)' : 'Prix (MAD)'}</Label>
              <Input
                type="number"
                min={0}
                value={row.price}
                readOnly={!isPromo}
                onChange={isPromo ? (e) => updateRow(index, { price: e.target.value }) : undefined}
                className={cn('mt-1', !isPromo && 'bg-muted')}
              />
            </div>
            {isPromo ? (
              <div>
                <Label>Prix barré (MAD)</Label>
                <Input
                  type="number"
                  min={0}
                  value={row.originalPrice}
                  onChange={(e) => updateRow(index, { originalPrice: e.target.value })}
                  className="mt-1"
                />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
            <div className="flex flex-col gap-2 pt-5 md:pt-6">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="defaultVariant"
                  checked={row.isDefault}
                  onChange={() => setDefault(index)}
                />
                Par défaut
              </label>
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={() => removeRow(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
