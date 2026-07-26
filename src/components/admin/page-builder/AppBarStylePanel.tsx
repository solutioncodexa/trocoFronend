import { Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COLOR_PRESETS } from '@/components/admin/page-builder/blockAppearance';
import { cn } from '@/lib/utils';
import type { AppBarConfig } from '@/types/store-global-sections';

type AppBarStylePanelProps = {
  value: AppBarConfig;
  onChange: (patch: Partial<AppBarConfig>) => void;
  onSave: () => void;
  saving?: boolean;
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#0F766E';
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
          value={hex}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <Input
          className="h-9 font-mono text-xs"
          value={value}
          placeholder="Auto"
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <Button type="button" size="sm" variant="ghost" className="h-9 px-2 text-xs" onClick={() => onChange('')}>
            Auto
          </Button>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            title={p.label}
            className={cn(
              'h-6 w-6 rounded-md border border-border shadow-sm transition hover:scale-110',
              value?.toUpperCase() === p.value && 'ring-2 ring-sky-500 ring-offset-1',
            )}
            style={{ backgroundColor: p.value }}
            onClick={() => onChange(p.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AppBarStylePanel({ value, onChange, onSave, saving }: AppBarStylePanelProps) {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Paintbrush className="h-3.5 w-3.5" />
        Barre du haut (app bar)
      </p>
      <p className="text-xs text-muted-foreground">
        Ces réglages s’appliquent à l’aperçu et à la boutique (après enregistrement).
      </p>

      <ColorField label="Fond de la barre" value={value.bgColor} onChange={(v) => onChange({ bgColor: v })} />
      <ColorField label="Couleur du texte / icônes" value={value.textColor} onChange={(v) => onChange({ textColor: v })} />

      <div>
        <Label className="text-xs">Taille du logo</Label>
        <Select
          value={value.logoHeight}
          onValueChange={(v) => onChange({ logoHeight: v as AppBarConfig['logoHeight'] })}
        >
          <SelectTrigger className="mt-1.5 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Compact</SelectItem>
            <SelectItem value="md">Normal</SelectItem>
            <SelectItem value="lg">Grand</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Liens du menu (séparés par ·)</Label>
        <Input
          className="mt-1.5"
          value={value.navLabels.join(' · ')}
          onChange={(e) =>
            onChange({
              navLabels: e.target.value
                .split(/[·|,]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 6),
            })
          }
          placeholder="Boutique · Sur-mesure · Contact"
        />
      </div>

      <div className="space-y-2 rounded-lg border border-border/70 p-2.5">
        <p className="text-[11px] font-semibold text-muted-foreground">Icônes</p>
        {(
          [
            ['showSearch', 'Recherche'],
            ['showWishlist', 'Favoris'],
            ['showCart', 'Panier'],
            ['sticky', 'Barre collante'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <Label className="text-xs font-normal">{label}</Label>
            <Switch checked={value[key]} onCheckedChange={(v) => onChange({ [key]: v })} />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border border-border/70 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs font-normal">Bandeau au-dessus</Label>
          <Switch
            checked={value.topBarEnabled}
            onCheckedChange={(v) => onChange({ topBarEnabled: v })}
          />
        </div>
        {value.topBarEnabled ? (
          <>
            <div>
              <Label className="text-xs">Texte du bandeau</Label>
              <Input
                className="mt-1.5"
                value={value.topBarText}
                onChange={(e) => onChange({ topBarText: e.target.value })}
              />
            </div>
            <ColorField
              label="Fond du bandeau"
              value={value.topBarBg}
              onChange={(v) => onChange({ topBarBg: v })}
            />
            <ColorField
              label="Texte du bandeau"
              value={value.topBarTextColor}
              onChange={(v) => onChange({ topBarTextColor: v })}
            />
          </>
        ) : null}
      </div>

      <Button type="button" className="w-full" disabled={saving} onClick={onSave}>
        {saving ? 'Enregistrement…' : 'Enregistrer l’app bar'}
      </Button>
    </div>
  );
}
