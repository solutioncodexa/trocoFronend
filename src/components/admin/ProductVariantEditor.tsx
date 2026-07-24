import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEmptyVariantRow, type ProductVariantFormRow } from '@/types/product-variant';
import { cn } from '@/lib/utils';

type Props = {
  rows: ProductVariantFormRow[];
  onChange: (rows: ProductVariantFormRow[]) => void;
  isPromo: boolean;
};

export function ProductVariantEditor({ rows, onChange, isPromo }: Props) {
  const updateRow = (index: number, patch: Partial<ProductVariantFormRow>) => {
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const setDefault = (index: number) => {
    onChange(rows.map((r, i) => ({ ...r, isDefault: i === index })));
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    if (next.length === 0) {
      onChange([createEmptyVariantRow(true)]);
      return;
    }
    if (!next.some((r) => r.isDefault)) next[0].isDefault = true;
    onChange(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Label className="text-sm font-semibold">Variantes *</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Une ligne = une option (ex. Capacité · 1 kg). Le prix de la variante par défaut est celui affiché.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => onChange([...rows, createEmptyVariantRow(rows.length === 0)])}
        >
          <Plus className="mr-1 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.id ?? `new-${index}`}
            className={cn(
              'rounded-xl border bg-card p-3.5 shadow-soft sm:p-4',
              row.isDefault ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border',
            )}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Variante {index + 1}
              </span>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
                  <input
                    type="radio"
                    name="defaultVariant"
                    checked={row.isDefault}
                    onChange={() => setDefault(index)}
                    className="accent-primary"
                  />
                  Par défaut
                </label>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => removeRow(index)}
                    aria-label="Supprimer la variante"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Attribut</Label>
                <Input
                  value={row.attributeName}
                  onChange={(e) => updateRow(index, { attributeName: e.target.value })}
                  className="mt-1"
                  placeholder="Capacité, Taille…"
                />
              </div>
              <div>
                <Label className="text-xs">Valeur *</Label>
                <Input
                  value={row.attributeValue}
                  onChange={(e) =>
                    updateRow(index, { attributeValue: e.target.value, label: e.target.value })
                  }
                  className="mt-1"
                  placeholder="1 kg"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">{isPromo ? 'Prix promo (DH) *' : 'Prix (DH) *'}</Label>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              {isPromo ? (
                <div>
                  <Label className="text-xs">Prix barré (DH)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={row.originalPrice}
                    onChange={(e) => updateRow(index, { originalPrice: e.target.value })}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    min={0}
                    value={row.stock}
                    onChange={(e) => updateRow(index, { stock: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label className="text-xs">Seuil d&apos;alerte</Label>
                <Input
                  type="number"
                  min={0}
                  value={row.safetyStock}
                  onChange={(e) => updateRow(index, { safetyStock: e.target.value })}
                  className="mt-1"
                  placeholder="Défaut global"
                />
              </div>
              <div>
                <Label className="text-xs">SKU variante</Label>
                <Input
                  value={row.sku}
                  onChange={(e) => updateRow(index, { sku: e.target.value })}
                  className="mt-1"
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
