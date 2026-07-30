import type { CSSProperties } from 'react';

/** Clés de style partagées dans `block.config` (indépendantes de la langue). */
export type BlockAlign = 'left' | 'center' | 'right';
export type BlockVAlign = 'top' | 'center' | 'bottom';
export type BlockPaddingY = 'sm' | 'md' | 'lg' | 'xl';
export type BlockMaxWidth = 'sm' | 'md' | 'lg' | 'full';
export type BlockOverlay = 'none' | 'light' | 'medium' | 'dark';
export type BlockHeroHeight = 'sm' | 'md' | 'lg' | 'full';
export type BlockColumns = 2 | 3 | 4;
export type BlockHeroLayout = 'overlay' | 'split' | 'minimal' | 'banner';
export type BlockButtonSize = 'sm' | 'md' | 'lg';
export type BlockCtaLayout = 'inline' | 'stacked' | 'centered';
export type BlockImageAspect = 'portrait' | 'square' | 'wide';
export type BlockCardDensity = 'compact' | 'comfortable' | 'airy';
export type BlockFaqStyle = 'accordion' | 'list' | 'two_col';
export type BlockTestimonialLayout = 'grid2' | 'grid3' | 'stack';
export type BlockMediaRadius = 'none' | 'md' | 'xl' | 'full';

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
  'layout',
  'buttonSize',
  'ctaLayout',
  'imageAspect',
  'cardDensity',
  'faqStyle',
  'testimonialLayout',
  'mediaRadius',
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

function pickEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const s = asStr(value);
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

export function readBlockStyle(config: Record<string, unknown>) {
  const align = pickEnum(config.align, ['left', 'center', 'right'] as const, 'left');
  const vAlign = pickEnum(config.vAlign, ['top', 'center', 'bottom'] as const, 'center');
  const paddingY = pickEnum(config.paddingY, ['sm', 'md', 'lg', 'xl'] as const, 'md');
  const maxWidth = pickEnum(config.maxWidth, ['sm', 'md', 'lg', 'full'] as const, 'lg');
  const overlay = pickEnum(config.overlay, ['none', 'light', 'medium', 'dark'] as const, 'medium');
  const heroHeight = pickEnum(config.heroHeight, ['sm', 'md', 'lg', 'full'] as const, 'lg');
  const columnsRaw = typeof config.columns === 'number' ? config.columns : Number(config.columns);
  const columns = ([2, 3, 4].includes(columnsRaw) ? columnsRaw : 4) as BlockColumns;
  const layout = pickEnum(
    config.layout,
    ['overlay', 'split', 'minimal', 'banner'] as const,
    'overlay',
  );
  const buttonSize = pickEnum(config.buttonSize, ['sm', 'md', 'lg'] as const, 'lg');
  const ctaLayout = pickEnum(
    config.ctaLayout,
    ['inline', 'stacked', 'centered'] as const,
    'inline',
  );
  const imageAspect = pickEnum(
    config.imageAspect,
    ['portrait', 'square', 'wide'] as const,
    'portrait',
  );
  const cardDensity = pickEnum(
    config.cardDensity,
    ['compact', 'comfortable', 'airy'] as const,
    'comfortable',
  );
  const faqStyle = pickEnum(
    config.faqStyle,
    ['accordion', 'list', 'two_col'] as const,
    'accordion',
  );
  const testimonialLayout = pickEnum(
    config.testimonialLayout,
    ['grid2', 'grid3', 'stack'] as const,
    'grid2',
  );
  const mediaRadius = pickEnum(
    config.mediaRadius,
    ['none', 'md', 'xl', 'full'] as const,
    'xl',
  );

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
    layout,
    buttonSize,
    ctaLayout,
    imageAspect,
    cardDensity,
    faqStyle,
    testimonialLayout,
    mediaRadius,
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

export function imageAspectClass(aspect: BlockImageAspect): string {
  switch (aspect) {
    case 'square':
      return 'aspect-square';
    case 'wide':
      return 'aspect-[16/10]';
    default:
      return 'aspect-[4/5]';
  }
}

export function cardDensityClass(density: BlockCardDensity): string {
  switch (density) {
    case 'compact':
      return 'gap-3';
    case 'airy':
      return 'gap-8';
    default:
      return 'gap-6';
  }
}

export function mediaRadiusClass(radius: BlockMediaRadius): string {
  switch (radius) {
    case 'none':
      return 'rounded-none';
    case 'md':
      return 'rounded-xl';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-2xl';
  }
}

export function testimonialLayoutClass(layout: BlockTestimonialLayout): string {
  switch (layout) {
    case 'grid3':
      return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
    case 'stack':
      return 'mx-auto flex max-w-xl flex-col gap-4';
    default:
      return 'grid gap-4 md:grid-cols-2';
  }
}

export function buttonSizeProp(size: BlockButtonSize): 'sm' | 'default' | 'lg' {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    default:
      return 'default';
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
