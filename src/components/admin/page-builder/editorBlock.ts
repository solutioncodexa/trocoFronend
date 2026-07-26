import { BLOCK_CATALOG, type StorePageBlock, type StorePageBlockType } from '@/types/store-pages';

export type EditorBlock = StorePageBlock & { clientKey: string };

export function newBlockClientKey() {
  return `b-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEditorBlock(type: StorePageBlockType): EditorBlock | null {
  const def = BLOCK_CATALOG.find((b) => b.type === type);
  if (!def) return null;
  return {
    type: def.type,
    sortOrder: 0,
    config: { ...def.defaults },
    configAr: {},
    visibleMobile: true,
    visibleDesktop: true,
    clientKey: newBlockClientKey(),
  };
}
