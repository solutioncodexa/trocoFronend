import type { ReactNode } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  COLOR_PRESETS,
  readBlockStyle,
  type BlockAlign,
  type BlockColumns,
  type BlockHeroHeight,
  type BlockMaxWidth,
  type BlockOverlay,
  type BlockPaddingY,
  type BlockVAlign,
} from '@/components/admin/page-builder/blockAppearance';

type BlockStylePanelProps = {
  blockType: string;
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
};

function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            size="sm"
            variant={value === opt.value ? 'secondary' : 'outline'}
            className={cn('h-8 gap-1 px-2.5 text-xs', opt.icon && 'px-2')}
            onClick={() => onChange(opt.value)}
            title={opt.label}
          >
            {opt.icon}
            {opt.icon ? null : opt.label}
            {opt.icon ? <span className="sr-only">{opt.label}</span> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}

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
          aria-label={label}
          className="h-9 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
          value={hex}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <Input
          className="h-9 font-mono text-xs"
          placeholder="#0F766E"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <Button type="button" size="sm" variant="ghost" className="h-9 px-2 text-xs" onClick={() => onChange('')}>
            Effacer
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

/**
 * Panneau Style / Position / Couleurs — commun à toutes les sections du constructeur.
 */
export default function BlockStylePanel({ blockType, config, onChange }: BlockStylePanelProps) {
  const style = readBlockStyle(config);
  const isHero = blockType === 'hero';
  const isSpacer = blockType === 'spacer';
  const showButton = ['hero', 'cta', 'countdown'].includes(blockType);
  const showOverlay = isHero;
  const showColumns = blockType === 'products' || blockType === 'categories';

  if (isSpacer) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Paintbrush className="h-3.5 w-3.5" />
        Style & position
      </p>

      <ChoiceRow<BlockAlign>
        label="Alignement du contenu"
        value={style.align}
        onChange={(v) => onChange('align', v)}
        options={[
          { value: 'left', label: 'Gauche', icon: <AlignLeft className="h-3.5 w-3.5" /> },
          { value: 'center', label: 'Centre', icon: <AlignCenter className="h-3.5 w-3.5" /> },
          { value: 'right', label: 'Droite', icon: <AlignRight className="h-3.5 w-3.5" /> },
        ]}
      />

      {isHero ? (
        <ChoiceRow<BlockVAlign>
          label="Position verticale"
          value={style.vAlign}
          onChange={(v) => onChange('vAlign', v)}
          options={[
            { value: 'top', label: 'Haut' },
            { value: 'center', label: 'Milieu' },
            { value: 'bottom', label: 'Bas' },
          ]}
        />
      ) : null}

      {isHero ? (
        <div>
          <Label className="text-xs">Hauteur de la bannière</Label>
          <Select
            value={style.heroHeight}
            onValueChange={(v) => onChange('heroHeight', v as BlockHeroHeight)}
          >
            <SelectTrigger className="mt-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Compacte</SelectItem>
              <SelectItem value="md">Moyenne</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="full">Presque plein écran</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {showColumns ? (
        <div>
          <Label className="text-xs">Colonnes (bureau)</Label>
          <Select
            value={String(style.columns)}
            onValueChange={(v) => onChange('columns', Number(v) as BlockColumns)}
          >
            <SelectTrigger className="mt-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div>
        <Label className="text-xs">Espacement vertical</Label>
        <Select
          value={style.paddingY}
          onValueChange={(v) => onChange('paddingY', v as BlockPaddingY)}
        >
          <SelectTrigger className="mt-1.5 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Compact</SelectItem>
            <SelectItem value="md">Normal</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Très large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Largeur du contenu</Label>
        <Select
          value={style.maxWidth}
          onValueChange={(v) => onChange('maxWidth', v as BlockMaxWidth)}
        >
          <SelectTrigger className="mt-1.5 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Étroit</SelectItem>
            <SelectItem value="md">Moyen</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="full">Pleine largeur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showOverlay ? (
        <div>
          <Label className="text-xs">Voile sur la photo</Label>
          <Select
            value={style.overlay}
            onValueChange={(v) => onChange('overlay', v as BlockOverlay)}
          >
            <SelectTrigger className="mt-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              <SelectItem value="light">Léger</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="dark">Fort</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <ColorField
        label="Couleur de fond"
        value={style.bgColor}
        onChange={(v) => onChange('bgColor', v)}
      />
      <ColorField
        label="Couleur du texte"
        value={style.textColor}
        onChange={(v) => onChange('textColor', v)}
      />
      {showButton ? (
        <ColorField
          label="Couleur du bouton"
          value={style.buttonColor}
          onChange={(v) => onChange('buttonColor', v)}
        />
      ) : null}
    </div>
  );
}
