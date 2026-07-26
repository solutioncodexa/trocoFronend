import { PAGE_TEMPLATES, type PageTemplate } from '@/config/pageTemplates';
import {
  createEditorBlock,
  newBlockClientKey,
  type EditorBlock,
} from '@/components/admin/page-builder/editorBlock';
import type { StorePageBlock, StorePageBlockType } from '@/types/store-pages';
import { BLOCK_CATALOG } from '@/types/store-pages';

export type BuilderTheme = {
  key: string;
  label: string;
  /** Aperçu pastille */
  swatch: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  accentBg: string;
};

/** Palettes vendeur — hors clichés IA purple/cream. */
export const BUILDER_THEMES: BuilderTheme[] = [
  {
    key: 'teal',
    label: 'Teal boutique',
    swatch: '#0F766E',
    bgColor: '',
    textColor: '',
    buttonColor: '#0F766E',
    accentBg: '#0F766E',
  },
  {
    key: 'ink',
    label: 'Encre',
    swatch: '#1E293B',
    bgColor: '#0F172A',
    textColor: '#F8FAFC',
    buttonColor: '#F59E0B',
    accentBg: '#1E293B',
  },
  {
    key: 'sand',
    label: 'Sable',
    swatch: '#F5F0E8',
    bgColor: '#F5F0E8',
    textColor: '#292524',
    buttonColor: '#B45309',
    accentBg: '#B45309',
  },
  {
    key: 'rose',
    label: 'Cuivre rose',
    swatch: '#9F1239',
    bgColor: '#FFF1F2',
    textColor: '#4C0519',
    buttonColor: '#9F1239',
    accentBg: '#9F1239',
  },
  {
    key: 'reset',
    label: 'Neutre',
    swatch: '#E2E8F0',
    bgColor: '',
    textColor: '',
    buttonColor: '',
    accentBg: '',
  },
];

export function blocksFromTemplate(template: PageTemplate): EditorBlock[] {
  return template.blocks.map((b, i) => ({
    id: null,
    type: b.type,
    sortOrder: i,
    config: { ...(b.config ?? {}) },
    configAr: {},
    visibleMobile: b.visibleMobile !== false,
    visibleDesktop: b.visibleDesktop !== false,
    clientKey: newBlockClientKey(),
  }));
}

export function blocksFromTypes(types: StorePageBlockType[]): EditorBlock[] {
  return types
    .map((type, i) => {
      const block = createEditorBlock(type);
      return block ? { ...block, sortOrder: i } : null;
    })
    .filter((b): b is EditorBlock => b != null);
}

export function applyThemeToBlocks(blocks: EditorBlock[], theme: BuilderTheme): EditorBlock[] {
  return blocks.map((b) => {
    const type = b.type as StorePageBlockType;
    const next = { ...b.config };
    if (type === 'cta' || type === 'countdown') {
      next.bgColor = theme.accentBg || theme.bgColor;
      next.textColor = theme.textColor || (theme.accentBg ? '#FFFFFF' : '');
      next.buttonColor = theme.buttonColor;
    } else if (type === 'hero') {
      if (theme.bgColor) next.bgColor = theme.bgColor;
      if (theme.textColor) next.textColor = theme.textColor;
      next.buttonColor = theme.buttonColor;
    } else if (type === 'testimonials') {
      next.bgColor = theme.bgColor;
      next.textColor = theme.textColor;
    } else {
      if (theme.key === 'reset') {
        next.bgColor = '';
        next.textColor = '';
        next.buttonColor = '';
      } else if (theme.bgColor && ['rich_text', 'products', 'categories', 'faq', 'contact'].includes(type)) {
        next.bgColor = theme.bgColor;
        next.textColor = theme.textColor;
      }
      if (theme.buttonColor && (type === 'hero' || type === 'cta')) {
        next.buttonColor = theme.buttonColor;
      }
    }
    return { ...b, config: next };
  });
}

export const QUICK_STARTERS: {
  key: string;
  label: string;
  description: string;
  types: StorePageBlockType[];
}[] = [
  {
    key: 'vitrine',
    label: 'Vitrine express',
    description: 'Bannière + produits + bouton',
    types: ['hero', 'products', 'cta'],
  },
  {
    key: 'marque',
    label: 'Page marque',
    description: 'Histoire + avis + contact',
    types: ['hero', 'rich_text', 'testimonials', 'contact'],
  },
  {
    key: 'promo',
    label: 'Promo flash',
    description: 'Compte à rebours + produits',
    types: ['countdown', 'products', 'faq'],
  },
];

export function catalogLabel(type: string): string {
  return BLOCK_CATALOG.find((b) => b.type === type)?.label ?? type;
}

export { PAGE_TEMPLATES };
export type { PageTemplate, StorePageBlock };
