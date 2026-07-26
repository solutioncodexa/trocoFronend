import type { CSSProperties } from 'react';

/** Clés de style partagées dans `block.config` (indépendantes de la langue). */
export type BlockAlign = 'left' | 'center' | 'right';
export type BlockVAlign = 'top' | 'center' | 'bottom';
export type BlockPaddingY = 'sm' | 'md' | 'lg' | 'xl';
export type BlockMaxWidth = 'sm' | 'md' | 'lg' | 'full';
export type BlockOverlay = 'none' | 'light' | 'medium' | 'dark';
export type BlockHeroHeight = 'sm' | 'md' | 'lg' | 'full';
export type BlockColumns = 2 | 3 | 4;

export const STYLE_KEYS = [
  'align',
  'vAlign',
  'bgColor',
  'textColor',
  'buttonColor',
  'paddingY',
  'maxWidth',
  'overlay',
  'heroHeight',
  'columns',
] as const;

export type BlockStyleKey = (typeof STYLE_KEYS)[number];

export const COLOR_PRESETS = [
  { label: 'Blanc', value: '#FFFFFF' },
  { label: 'Sable', value: '#F5F0E8' },
  { label: 'Ardoise', value: '#1E293B' },
  { label: 'Teal', value: '#0F766E' },
  { label: 'Cuivre', value: '#B45309' },
  { label: 'Rose', value: '#9F1239' },
] as const;

function asStr(v: unknown, fallback = '') {
  return typeof v === 'string' ? v : fallback;
}

export function readBlockStyle(config: Record<string, unknown>) {
  const align = (['left', 'center', 'right'].includes(asStr(config.align))
    ? asStr(config.align)
    : 'left') as BlockAlign;
  const vAlign = (['top', 'center', 'bottom'].includes(asStr(config.vAlign))
    ? asStr(config.vAlign)
    : 'center') as BlockVAlign;
  const paddingY = (['sm', 'md', 'lg', 'xl'].includes(asStr(config.paddingY))
    ? asStr(config.paddingY)
    : 'md') as BlockPaddingY;
  const maxWidth = (['sm', 'md', 'lg', 'full'].includes(asStr(config.maxWidth))
    ? asStr(config.maxWidth)
    : 'lg') as BlockMaxWidth;
  const overlay = (['none', 'light', 'medium', 'dark'].includes(asStr(config.overlay))
    ? asStr(config.overlay)
    : 'medium') as BlockOverlay;
  const heroHeight = (['sm', 'md', 'lg', 'full'].includes(asStr(config.heroHeight))
    ? asStr(config.heroHeight)
    : 'lg') as BlockHeroHeight;
  const columnsRaw = typeof config.columns === 'number' ? config.columns : Number(config.columns);
  const columns = ([2, 3, 4].includes(columnsRaw) ? columnsRaw : 4) as BlockColumns;

  return {
    align,
    vAlign,
    bgColor: asStr(config.bgColor),
    textColor: asStr(config.textColor),
    buttonColor: asStr(config.buttonColor),
    paddingY,
    maxWidth,
    overlay,
    heroHeight,
    columns,
  };
}

export function heroHeightClass(height: BlockHeroHeight): string {
  switch (height) {
    case 'sm':
      return 'min-h-[min(42dvh,360px)]';
    case 'md':
      return 'min-h-[min(55dvh,460px)]';
    case 'full':
      return 'min-h-[min(88dvh,720px)]';
    default:
      return 'min-h-[min(70dvh,560px)]';
  }
}

export function columnsClass(columns: BlockColumns): string {
  switch (columns) {
    case 2:
      return 'sm:grid-cols-2';
    case 3:
      return 'sm:grid-cols-2 lg:grid-cols-3';
    default:
      return 'sm:grid-cols-2 lg:grid-cols-4';
  }
}

export function paddingYClass(paddingY: BlockPaddingY): string {
  switch (paddingY) {
    case 'sm':
      return 'py-8';
    case 'lg':
      return 'py-20';
    case 'xl':
      return 'py-28';
    default:
      return 'py-14';
  }
}

export function maxWidthClass(maxWidth: BlockMaxWidth): string {
  switch (maxWidth) {
    case 'sm':
      return 'max-w-xl';
    case 'md':
      return 'max-w-3xl';
    case 'full':
      return 'max-w-none';
    default:
      return 'max-w-6xl';
  }
}

export function alignClass(align: BlockAlign): string {
  switch (align) {
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      return 'text-left items-start';
  }
}

export function justifyClass(align: BlockAlign): string {
  switch (align) {
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    default:
      return 'justify-start';
  }
}

export function vAlignClass(vAlign: BlockVAlign): string {
  switch (vAlign) {
    case 'top':
      return 'justify-start';
    case 'bottom':
      return 'justify-end';
    default:
      return 'justify-center';
  }
}

export function overlayClass(overlay: BlockOverlay): string {
  switch (overlay) {
    case 'none':
      return '';
    case 'light':
      return 'bg-gradient-to-r from-background/70 via-background/40 to-transparent';
    case 'dark':
      return 'bg-gradient-to-r from-background via-background/90 to-background/20';
    default:
      return 'bg-gradient-to-r from-background via-background/80 to-transparent';
  }
}

export function sectionInlineStyle(style: ReturnType<typeof readBlockStyle>): CSSProperties {
  const out: CSSProperties = {};
  if (style.bgColor) out.backgroundColor = style.bgColor;
  if (style.textColor) out.color = style.textColor;
  return out;
}

export function buttonInlineStyle(buttonColor: string): CSSProperties | undefined {
  if (!buttonColor) return undefined;
  return {
    backgroundColor: buttonColor,
    borderColor: buttonColor,
    color: '#fff',
  };
}
