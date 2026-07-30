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
  type BlockButtonSize,
  type BlockCardDensity,
  type BlockColumns,
  type BlockCtaLayout,
  type BlockFaqStyle,
  type BlockHeroHeight,
  type BlockHeroLayout,
  type BlockImageAspect,
  type BlockMaxWidth,
  type BlockMediaRadius,
  type BlockOverlay,
  type BlockPaddingY,
  type BlockTestimonialLayout,
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
  const isCta = blockType === 'cta';
  const isFaq = blockType === 'faq';
  const isTestimonials = blockType === 'testimonials';
  const showButton = ['hero', 'cta', 'countdown'].includes(blockType);
  const showOverlay = isHero && style.layout === 'overlay';
  const showColumns =
    blockType === 'products' || blockType === 'categories' || blockType === 'instagram';
  const showGridExtras = blockType === 'products' || blockType === 'categories';
  const showMediaRadius =
    blockType === 'image' ||
    blockType === 'video' ||
    blockType === 'instagram' ||
    showGridExtras;


  if (isSpacer) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Paintbrush className="h-3.5 w-3.5" />
        Style & position
      </p>

      {isHero ? (
        <div>
          <Label className="text-xs">Disposition</Label>
          <Select
            value={style.layout}
            onValueChange={(v) => onChange('layout', v as BlockHeroLayout)}
          >
            <SelectTrigger className="mt-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overlay">Plein écran (overlay)</SelectItem>
              <SelectItem value="split">Texte + image</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="banner">Bandeau</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {isCta ? (
        <ChoiceRow<BlockCtaLayout>
          label="Disposition"
          value={style.ctaLayout}
          onChange={(v) => onChange('ctaLayout', v)}
          options={[
            { value: 'inline', label: 'Côte à côte' },
            { value: 'stacked', label: 'Empilé' },
            { value: 'centered', label: 'Centré' },
          ]}
        />
      ) : null}

      {isFaq ? (
        <ChoiceRow<BlockFaqStyle>
          label="Style FAQ"
          value={style.faqStyle}
          onChange={(v) => onChange('faqStyle', v)}
          options={[
            { value: 'accordion', label: 'Accordéon' },
            { value: 'list', label: 'Liste' },
            { value: 'two_col', label: '2 colonnes' },
          ]}
        />
      ) : null}

      {isTestimonials ? (
        <ChoiceRow<BlockTestimonialLayout>
          label="Disposition"
          value={style.testimonialLayout}
          onChange={(v) => onChange('testimonialLayout', v)}
          options={[
            { value: 'grid2', label: '2 col.' },
            { value: 'grid3', label: '3 col.' },
            { value: 'stack', label: 'Pile' },
          ]}
        />
      ) : null}

      {showGridExtras ? (
        <>
          <ChoiceRow<BlockImageAspect>
            label="Ratio image"
            value={style.imageAspect}
            onChange={(v) => onChange('imageAspect', v)}
            options={[
              { value: 'portrait', label: 'Portrait' },
              { value: 'square', label: 'Carré' },
              { value: 'wide', label: 'Large' },
            ]}
          />
          <ChoiceRow<BlockCardDensity>
            label="Densité"
            value={style.cardDensity}
            onChange={(v) => onChange('cardDensity', v)}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Normal' },
              { value: 'airy', label: 'Aéré' },
            ]}
          />
        </>
      ) : null}

      {showMediaRadius ? (
        <ChoiceRow<BlockMediaRadius>
          label="Coins arrondis"
          value={style.mediaRadius}
          onChange={(v) => onChange('mediaRadius', v)}
          options={[
            { value: 'none', label: 'Aucun' },
            { value: 'md', label: 'Moyen' },
            { value: 'xl', label: 'Grand' },
            { value: 'full', label: 'Cercle' },
          ]}
        />
      ) : null}

      {showButton ? (
        <ChoiceRow<BlockButtonSize>
          label="Taille du bouton"
          value={style.buttonSize}
          onChange={(v) => onChange('buttonSize', v)}
          options={[
            { value: 'sm', label: 'S' },
            { value: 'md', label: 'M' },
            { value: 'lg', label: 'L' },
          ]}
        />
      ) : null}

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

      {isHero && style.layout === 'overlay' ? (
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
