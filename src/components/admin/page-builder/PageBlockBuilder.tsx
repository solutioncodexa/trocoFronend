import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  GripVertical,
  Keyboard,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Monitor,
  MousePointer2,
  PanelLeft,
  PanelRight,
  Redo2,
  Save,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBlockView } from '@/components/storefront/PageRenderer';
import BlockPalettePreview from '@/components/admin/page-builder/BlockPalettePreview';
import StorePreviewChrome from '@/components/admin/page-builder/StorePreviewChrome';
import {
  BLOCK_CATALOG,
  type StorePage,
  type StorePageBlock,
  type StorePageBlockType,
} from '@/types/store-pages';
import type { AppBarConfig } from '@/types/store-global-sections';
import { DEFAULT_APP_BAR } from '@/types/store-global-sections';
import { cn } from '@/lib/utils';
import AppBarStylePanel from '@/components/admin/page-builder/AppBarStylePanel';
import {
  createEditorBlock,
  newBlockClientKey,
  type EditorBlock,
} from '@/components/admin/page-builder/editorBlock';
import {
  applyThemeToBlocks,
  blocksFromTemplate,
  blocksFromTypes,
  BUILDER_THEMES,
  PAGE_TEMPLATES,
  QUICK_STARTERS,
} from '@/components/admin/page-builder/builderPresets';

const DND_NEW = 'application/x-matjarona-block-type';
const DND_MOVE = 'application/x-matjarona-block-index';
const ZOOM_STEPS = [50, 75, 90, 100, 125] as const;

export type { EditorBlock };
export { createEditorBlock, newBlockClientKey };

type PageBlockBuilderProps = {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  onSave: () => void;
  saving?: boolean;
  editLang: 'fr' | 'ar';
  previewPage: StorePage;
  renderFields: (block: EditorBlock, index: number) => ReactNode;
  toolbarExtra?: ReactNode;
  /** Notifié quand le mode agrandi (plein écran) change. */
  onExpandedChange?: (expanded: boolean) => void;
  appBar?: AppBarConfig;
  onAppBarChange?: (patch: Partial<AppBarConfig>) => void;
  onAppBarSave?: () => void;
  appBarSaving?: boolean;
};

function DropSlot({
  active,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  active: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'relative z-20 flex items-center justify-center transition-all',
        active
          ? 'my-1 h-12 border-y-2 border-dashed border-sky-500 bg-sky-500/15'
          : 'h-1.5',
      )}
    >
      {active ? (
        <span className="rounded-full bg-sky-600 px-3 py-0.5 text-[11px] font-semibold text-white shadow">
          Déposer ici
        </span>
      ) : null}
    </div>
  );
}

/**
 * Constructeur type GenCodex / UI Bakery :
 * composants · canvas live boutique · propriétés · zoom · aperçu live · undo.
 */
export default function PageBlockBuilder({
  blocks,
  onChange,
  onSave,
  saving,
  editLang,
  previewPage,
  renderFields,
  toolbarExtra,
  onExpandedChange,
  appBar = DEFAULT_APP_BAR,
  onAppBarChange,
  onAppBarSave,
  appBarSaving,
}: PageBlockBuilderProps) {
  const moveFrom = useRef<number | null>(null);
  const historyRef = useRef<{ past: EditorBlock[][]; future: EditorBlock[][] }>({
    past: [],
    future: [],
  });
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [draggingNew, setDraggingNew] = useState(false);
  const [draggingMove, setDraggingMove] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedChrome, setSelectedChrome] = useState<'header' | 'footer' | null>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(90);
  const [viewMode, setViewMode] = useState<'edit' | 'live'>('edit');
  const [leftTab, setLeftTab] = useState<'components' | 'layers'>('components');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  const [showComponents, setShowComponents] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const setExpandedMode = (next: boolean) => {
    setExpanded(next);
    onExpandedChange?.(next);
  };

  const catalogByType = useMemo(
    () => Object.fromEntries(BLOCK_CATALOG.map((b) => [b.type, b])),
    [],
  );

  const selected = selectedIndex != null && !selectedChrome ? blocks[selectedIndex] : null;
  const selectedMeta =
    selected != null ? catalogByType[selected.type as StorePageBlockType] : null;

  const selectBlock = (index: number | null) => {
    setSelectedChrome(null);
    setSelectedIndex(index);
    setViewMode('edit');
  };

  const selectChrome = (part: 'header' | 'footer' | null) => {
    setSelectedIndex(null);
    setSelectedChrome(part);
    setViewMode('edit');
    if (part && !showProperties) setShowProperties(true);
  };

  const syncHistoryFlags = () => {
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  };

  const commit = useCallback(
    (next: EditorBlock[], recordHistory = true) => {
      if (recordHistory) {
        historyRef.current.past = [...historyRef.current.past.slice(-39), blocks];
        historyRef.current.future = [];
        syncHistoryFlags();
      }
      onChange(next);
      setLivePulse(true);
    },
    [blocks, onChange],
  );

  useEffect(() => {
    if (!livePulse) return;
    const t = window.setTimeout(() => setLivePulse(false), 700);
    return () => window.clearTimeout(t);
  }, [livePulse]);

  const undo = () => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    historyRef.current.past = past.slice(0, -1);
    historyRef.current.future = [blocks, ...future].slice(0, 40);
    syncHistoryFlags();
    onChange(prev);
    setSelectedIndex(null);
  };

  const redo = () => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    const next = future[0];
    historyRef.current.future = future.slice(1);
    historyRef.current.past = [...past, blocks].slice(-40);
    syncHistoryFlags();
    onChange(next);
    setSelectedIndex(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === 'Escape') {
        if (showShortcuts) {
          e.preventDefault();
          setShowShortcuts(false);
          return;
        }
        if (expanded) {
          e.preventDefault();
          setExpandedMode(false);
          return;
        }
      }
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (mod && e.key === 's') {
        e.preventDefault();
        onSave();
      } else if (mod && e.key === '\\') {
        e.preventDefault();
        setShowComponents((v) => !v);
      } else if (mod && e.key === '/') {
        e.preventDefault();
        setShowProperties((v) => !v);
      } else if (mod && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setExpandedMode(!expanded);
      } else if (mod && e.key.toLowerCase() === 'd' && selectedIndex != null && !selectedChrome) {
        e.preventDefault();
        duplicateAt(selectedIndex);
      } else if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedIndex != null &&
        !selectedChrome &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        removeAt(selectedIndex);
      } else if (e.altKey && e.key === 'ArrowUp' && selectedIndex != null && !selectedChrome) {
        e.preventDefault();
        moveBy(selectedIndex, -1);
      } else if (e.altKey && e.key === 'ArrowDown' && selectedIndex != null && !selectedChrome) {
        e.preventDefault();
        moveBy(selectedIndex, 1);
      } else if (mod && e.key === '?') {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- undo/redo close over latest blocks via refs pattern
  }, [blocks, onSave, expanded, selectedIndex, selectedChrome, showShortcuts]);

  const renderBlockForCanvas = (block: EditorBlock, index: number): StorePageBlock => {
    const config =
      editLang === 'ar' && block.configAr && Object.keys(block.configAr).length
        ? { ...block.config, ...block.configAr }
        : block.config;
    return {
      id: block.id,
      type: block.type,
      sortOrder: index,
      config,
      configAr: block.configAr,
      visibleMobile: block.visibleMobile,
      visibleDesktop: block.visibleDesktop,
    };
  };

  const insertAt = (type: StorePageBlockType, index: number) => {
    const block = createEditorBlock(type);
    if (!block) return;
    const next = [...blocks];
    const at = Math.max(0, Math.min(index, next.length));
    next.splice(at, 0, { ...block, sortOrder: at });
    commit(next.map((b, i) => ({ ...b, sortOrder: i })));
    setSelectedIndex(at);
    setViewMode('edit');
  };

  const append = (type: StorePageBlockType) => insertAt(type, blocks.length);

  const moveTo = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    const insertIndex = from < to ? to - 1 : to;
    next.splice(Math.max(0, Math.min(insertIndex, next.length)), 0, item);
    const mapped = next.map((b, i) => ({ ...b, sortOrder: i }));
    commit(mapped);
    setSelectedIndex(Math.max(0, Math.min(insertIndex, mapped.length - 1)));
  };

  const removeAt = (index: number) => {
    commit(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, sortOrder: i })));
    setSelectedIndex(null);
    setSelectedChrome(null);
  };

  const duplicateAt = (index: number) => {
    const source = blocks[index];
    if (!source) return;
    const copy: EditorBlock = {
      ...source,
      id: null,
      clientKey: newBlockClientKey(),
      config: { ...source.config },
      configAr: { ...(source.configAr ?? {}) },
    };
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    commit(next.map((b, i) => ({ ...b, sortOrder: i })));
    setSelectedIndex(index + 1);
    setSelectedChrome(null);
    setViewMode('edit');
  };

  const moveBy = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    commit(next.map((b, i) => ({ ...b, sortOrder: i })));
    setSelectedIndex(target);
  };

  const replaceAllBlocks = (next: EditorBlock[]) => {
    commit(next.map((b, i) => ({ ...b, sortOrder: i })));
    setSelectedIndex(next.length ? 0 : null);
    setSelectedChrome(null);
    setViewMode('edit');
  };

  const applyTheme = (themeKey: string) => {
    const theme = BUILDER_THEMES.find((t) => t.key === themeKey);
    if (!theme) return;
    setActiveTheme(themeKey);
    commit(applyThemeToBlocks(blocks, theme));
  };

  const patchMeta = (index: number, patch: Partial<EditorBlock>) => {
    commit(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  /** Mise à jour champs sans empiler l’historique à chaque frappe — parent gère via onChange direct. */
  const acceptDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newType = e.dataTransfer.getData(DND_NEW) as StorePageBlockType;
    if (newType && BLOCK_CATALOG.some((b) => b.type === newType)) {
      insertAt(newType, index);
    } else {
      const fromRaw = e.dataTransfer.getData(DND_MOVE);
      const from = fromRaw !== '' ? Number(fromRaw) : moveFrom.current;
      if (from != null && Number.isFinite(from)) moveTo(from, index);
    }
    moveFrom.current = null;
    setDropIndex(null);
    setDraggingNew(false);
    setDraggingMove(false);
  };

  const onSlotDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingNew ? 'copy' : 'move';
    setDropIndex(index);
  };

  const showSlots = viewMode === 'edit' && (draggingNew || draggingMove);
  const isLive = viewMode === 'live';

  const deviceMax =
    device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[1100px]';

  const zoomIn = () => {
    const i = ZOOM_STEPS.indexOf(zoom as (typeof ZOOM_STEPS)[number]);
    setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, i < 0 ? 3 : i + 1)]);
  };
  const zoomOut = () => {
    const i = ZOOM_STEPS.indexOf(zoom as (typeof ZOOM_STEPS)[number]);
    setZoom(ZOOM_STEPS[Math.max(0, i < 0 ? 3 : i - 1)]);
  };

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[hsl(222_14%_92%)]',
        expanded && 'fixed inset-0 z-[80]',
      )}
    >
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-white px-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-2">
          <Layers className="h-4 w-4 shrink-0 text-sky-600" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              Constructeur{expanded ? ' · plein écran' : ''}
            </p>
          </div>
          <span
            className={cn(
              'ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              livePulse || isLive
                ? 'bg-emerald-500/15 text-emerald-700'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                livePulse || isLive ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground/50',
              )}
            />
            Live
          </span>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <div className="hidden items-center gap-0.5 rounded-lg border border-border p-0.5 md:flex">
            <Button
              type="button"
              size="icon"
              variant={showComponents ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setShowComponents((v) => !v)}
              title={showComponents ? 'Masquer les composants (Ctrl+\\)' : 'Afficher les composants'}
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={showProperties ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setShowProperties((v) => !v)}
              title={showProperties ? 'Masquer les propriétés (Ctrl+/)' : 'Afficher les propriétés'}
            >
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={expanded ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setExpandedMode(!expanded)}
              title={expanded ? 'Réduire (Échap)' : 'Agrandir l’édition (Ctrl+Shift+F)'}
            >
              {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant={showShortcuts ? 'secondary' : 'ghost'}
              className="h-8 w-8"
              onClick={() => setShowShortcuts((v) => !v)}
              title="Raccourcis clavier"
            >
              <Keyboard className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="hidden items-center gap-1 rounded-lg border border-border px-1.5 py-0.5 lg:flex" title="Thème rapide">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            {BUILDER_THEMES.map((theme) => (
              <button
                key={theme.key}
                type="button"
                title={theme.label}
                disabled={blocks.length === 0}
                className={cn(
                  'h-5 w-5 rounded-full border border-border transition hover:scale-110 disabled:opacity-40',
                  activeTheme === theme.key && 'ring-2 ring-sky-500 ring-offset-1',
                )}
                style={{ backgroundColor: theme.swatch }}
                onClick={() => applyTheme(theme.key)}
              />
            ))}
          </div>

          <div className="flex rounded-lg border border-border p-0.5">
            <Button
              type="button"
              size="sm"
              variant={!isLive ? 'default' : 'ghost'}
              className="h-8 gap-1 px-2"
              onClick={() => setViewMode('edit')}
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Éditer</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant={isLive ? 'default' : 'ghost'}
              className="h-8 gap-1 px-2"
              onClick={() => {
                setViewMode('live');
                setSelectedIndex(null);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Aperçu</span>
            </Button>
          </div>

          <div className="hidden items-center gap-0.5 rounded-lg border border-border p-0.5 sm:flex">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={undo} disabled={!canUndo} title="Annuler (Ctrl+Z)">
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={redo} disabled={!canRedo} title="Rétablir">
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="hidden items-center gap-0.5 rounded-lg border border-border p-0.5 md:flex">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={zoomOut} title="Zoom −">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="min-w-[2.5rem] text-center text-[11px] font-medium tabular-nums">{zoom}%</span>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={zoomIn} title="Zoom +">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          {toolbarExtra}

          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <Button type="button" size="sm" variant={device === 'desktop' ? 'default' : 'ghost'} className="h-8 px-2" onClick={() => setDevice('desktop')} title="Bureau">
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="sm" variant={device === 'tablet' ? 'default' : 'ghost'} className="h-8 px-2" onClick={() => setDevice('tablet')} title="Tablette">
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="sm" variant={device === 'mobile' ? 'default' : 'ghost'} className="h-8 px-2" onClick={() => setDevice('mobile')} title="Mobile">
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            type="button"
            size="icon"
            variant={expanded ? 'secondary' : 'outline'}
            className="h-8 w-8 md:hidden"
            onClick={() => setExpandedMode(!expanded)}
            title={expanded ? 'Réduire' : 'Agrandir'}
          >
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>

          <Button className="h-8 gap-1.5" disabled={saving} onClick={onSave}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">Enregistrer</span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Gauche */}
        <aside
          className={cn(
            'w-[240px] shrink-0 flex-col border-r border-border/80 bg-white',
            showComponents ? 'hidden md:flex' : 'hidden',
          )}
        >
          <div className="flex items-center gap-1 border-b border-border/70 p-1">
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-xs font-semibold',
                leftTab === 'components' ? 'bg-sky-50 text-sky-800' : 'text-muted-foreground',
              )}
              onClick={() => setLeftTab('components')}
            >
              Composants
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-xs font-semibold',
                leftTab === 'layers' ? 'bg-sky-50 text-sky-800' : 'text-muted-foreground',
              )}
              onClick={() => setLeftTab('layers')}
            >
              Structure
            </button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={() => setShowComponents(false)}
              title="Masquer les composants"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          </div>

          {leftTab === 'components' ? (
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5 scrollbar-app">
              <p className="px-0.5 text-[11px] text-muted-foreground">
                Glissez sur la page — affichage live boutique
              </p>
              {BLOCK_CATALOG.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DND_NEW, item.type);
                    e.dataTransfer.effectAllowed = 'copy';
                    setDraggingNew(true);
                    setViewMode('edit');
                  }}
                  onDragEnd={() => {
                    setDraggingNew(false);
                    setDropIndex(null);
                  }}
                  onClick={() => append(item.type)}
                  className={cn(
                    'w-full cursor-grab rounded-xl border border-border/80 bg-[hsl(220_20%_98%)] p-2 text-left transition',
                    'hover:border-sky-400 hover:bg-sky-50/60 active:cursor-grabbing',
                  )}
                  title={item.description}
                >
                  <BlockPalettePreview type={item.type} />
                  <p className="mt-1.5 text-xs font-semibold leading-tight">{item.label}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2.5 scrollbar-app">
              <p className="mb-2 px-0.5 text-[11px] text-muted-foreground">
                Cliquez une section · glissez pour réordonner
              </p>
              {blocks.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">Aucune section</p>
              ) : (
                blocks.map((block, index) => {
                  const meta = catalogByType[block.type as StorePageBlockType];
                  return (
                    <button
                      key={block.clientKey}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        moveFrom.current = index;
                        e.dataTransfer.setData(DND_MOVE, String(index));
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggingMove(true);
                        setViewMode('edit');
                      }}
                      onDragEnd={() => {
                        moveFrom.current = null;
                        setDraggingMove(false);
                        setDropIndex(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropIndex(index);
                      }}
                      onDrop={(e) => acceptDrop(e, index)}
                      onClick={() => selectBlock(index)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs transition',
                        selectedIndex === index
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-border/70 hover:border-sky-300',
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {meta?.label || block.type}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">#{index + 1}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </aside>

        {/* Canvas live */}
        <section
          className="relative min-w-0 flex-1 overflow-auto"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(220 12% 76%) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
          onClick={() => {
            if (isLive) return;
            setSelectedIndex(null);
            setSelectedChrome(null);
          }}
        >
          <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/50 bg-white/90 px-3 py-1.5 text-[11px] backdrop-blur">
            <span className="font-medium text-muted-foreground">
              {isLive ? 'Aperçu live — comme en boutique' : 'Mode édition — cliquez une section'}
            </span>
            <div className="flex items-center gap-2">
              {!showComponents ? (
                <button
                  type="button"
                  className="hidden rounded-md border border-border bg-white px-2 py-0.5 font-medium text-sky-700 hover:bg-sky-50 md:inline-flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComponents(true);
                  }}
                >
                  Afficher composants
                </button>
              ) : null}
              {!showProperties ? (
                <button
                  type="button"
                  className="hidden rounded-md border border-border bg-white px-2 py-0.5 font-medium text-sky-700 hover:bg-sky-50 lg:inline-flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProperties(true);
                  }}
                >
                  Afficher propriétés
                </button>
              ) : null}
              <span className="tabular-nums text-muted-foreground">
                {device === 'desktop' ? 'Bureau' : device === 'tablet' ? 'Tablette' : 'Mobile'} · {zoom}%
              </span>
            </div>
          </div>

          {/* Palette mobile */}
          {!isLive ? (
            <div className="sticky top-8 z-30 flex gap-2 overflow-x-auto border-b border-border/60 bg-white/95 p-2 backdrop-blur md:hidden">
              {BLOCK_CATALOG.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    append(item.type);
                  }}
                  className="w-28 shrink-0 rounded-lg border border-border bg-white p-1.5 text-left"
                >
                  <BlockPalettePreview type={item.type} />
                  <p className="mt-1 truncate text-[10px] font-medium">{item.label}</p>
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex justify-center px-3 py-6" onClick={(e) => e.stopPropagation()}>
            <div
              className={cn(
                'origin-top transition-transform',
                deviceMax,
                'w-full',
              )}
              style={{
                transform: `scale(${zoom / 100})`,
                width:
                  device === 'mobile' ? 390 : device === 'tablet' ? 768 : Math.min(1100, 960),
              }}
            >
            <div
              className={cn(
                'overflow-hidden border border-border/80 bg-background shadow-[0_22px_60px_-28px_rgba(15,23,42,0.5)]',
                device === 'mobile' ? 'rounded-[1.75rem]' : 'rounded-xl',
              )}
              dir={editLang === 'ar' ? 'rtl' : 'ltr'}
            >
              {device === 'mobile' ? (
                <div className="flex h-7 items-center justify-center bg-stone-900">
                  <div className="h-1.5 w-16 rounded-full bg-stone-600" />
                </div>
              ) : null}

              <StorePreviewChrome
                pageTitle={previewPage.title}
                appBar={appBar}
                selectedChrome={isLive ? null : selectedChrome}
                onSelectChrome={isLive ? undefined : selectChrome}
              >
                {blocks.length === 0 ? (
                  <div
                    onDragOver={(e) => {
                      if (isLive) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'copy';
                      setDropIndex(0);
                    }}
                    onDragLeave={() => setDropIndex(null)}
                    onDrop={(e) => !isLive && acceptDrop(e, 0)}
                    className={cn(
                      'flex min-h-[420px] flex-col items-stretch gap-6 px-5 py-10 sm:px-8',
                      dropIndex === 0 ? 'bg-sky-500/10' : 'bg-muted/15',
                    )}
                  >
                    <div className="text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-sky-600/70" />
                      <p className="mt-3 font-display text-xl font-semibold">Démarrez votre page</p>
                      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                        Choisissez un modèle, un démarrage rapide, ou glissez un composant depuis la gauche.
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Modèles prêts
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {PAGE_TEMPLATES.map((tpl) => (
                          <button
                            key={tpl.key}
                            type="button"
                            onClick={() => replaceAllBlocks(blocksFromTemplate(tpl))}
                            className="rounded-xl border border-border bg-white p-3 text-left transition hover:border-sky-400 hover:bg-sky-50/50"
                          >
                            <p className="text-sm font-semibold">{tpl.label}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                              {tpl.description}
                            </p>
                            <p className="mt-2 text-[10px] font-medium text-sky-700">
                              {tpl.blocks.length} sections · Appliquer
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Démarrage rapide
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_STARTERS.map((s) => (
                          <Button
                            key={s.key}
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-auto flex-col items-start gap-0.5 px-3 py-2"
                            onClick={() => replaceAllBlocks(blocksFromTypes(s.types))}
                          >
                            <span className="font-semibold">{s.label}</span>
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {s.description}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {showSlots ? (
                      <DropSlot
                        active={dropIndex === 0}
                        onDragOver={(e) => onSlotDragOver(e, 0)}
                        onDragLeave={() => setDropIndex(null)}
                        onDrop={(e) => acceptDrop(e, 0)}
                      />
                    ) : null}

                    {blocks.map((block, index) => {
                      const meta = catalogByType[block.type as StorePageBlockType];
                      const isSelected = !isLive && selectedIndex === index;
                      return (
                        <div key={block.clientKey}>
                          <div
                            role={isLive ? undefined : 'button'}
                            tabIndex={isLive ? undefined : 0}
                            onClick={() => {
                              if (isLive) return;
                              selectBlock(index);
                            }}
                            onKeyDown={(e) => {
                              if (isLive) return;
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                selectBlock(index);
                              }
                            }}
                            className={cn(
                              'group relative outline-none transition',
                              !isLive &&
                                (isSelected
                                  ? 'ring-2 ring-inset ring-sky-500'
                                  : 'hover:ring-2 hover:ring-inset hover:ring-sky-400/40'),
                            )}
                          >
                            <div className={cn(!isLive && 'pointer-events-none select-none')}>
                              <PageBlockView
                                block={renderBlockForCanvas(block, index)}
                                page={previewPage}
                                pageId={undefined}
                                isLcpHero={index === 0 && block.type === 'hero'}
                                usePreviewMocks
                              />
                            </div>

                            {!isLive ? (
                              <div
                                className={cn(
                                  'absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md border border-sky-500/30 bg-sky-600 px-1.5 py-1 text-white shadow-md',
                                  isSelected
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                                )}
                              >
                                <span
                                  draggable
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    moveFrom.current = index;
                                    e.dataTransfer.setData(DND_MOVE, String(index));
                                    e.dataTransfer.effectAllowed = 'move';
                                    setDraggingMove(true);
                                  }}
                                  onDragEnd={() => {
                                    moveFrom.current = null;
                                    setDraggingMove(false);
                                    setDropIndex(null);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex h-6 w-6 cursor-grab items-center justify-center rounded active:cursor-grabbing"
                                >
                                  <GripVertical className="h-3.5 w-3.5" />
                                </span>
                                <span className="max-w-[8rem] truncate pr-1 text-[11px] font-semibold">
                                  {meta?.label || 'Section'}
                                </span>
                                <button
                                  type="button"
                                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/15"
                                  title="Dupliquer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateAt(index);
                                  }}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/15"
                                  title="Retirer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAt(index);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : null}
                          </div>

                          {showSlots ? (
                            <DropSlot
                              active={dropIndex === index + 1}
                              onDragOver={(e) => onSlotDragOver(e, index + 1)}
                              onDragLeave={() => setDropIndex(null)}
                              onDrop={(e) => acceptDrop(e, index + 1)}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </StorePreviewChrome>
            </div>
            </div>
          </div>
        </section>

        {/* Propriétés */}
        <aside
          className={cn(
            'w-[300px] shrink-0 flex-col border-l border-border/80 bg-white',
            showProperties ? 'hidden lg:flex' : 'hidden',
          )}
        >
          <div className="flex items-start justify-between gap-2 border-b border-border/70 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Propriétés
              </p>
            <p className="mt-0.5 truncate text-sm font-semibold">
              {isLive
                ? 'Aperçu live'
                : selectedChrome === 'header'
                  ? 'En-tête global'
                  : selectedChrome === 'footer'
                    ? 'Pied de page'
                    : selectedMeta?.label || 'Aucune sélection'}
            </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={() => setShowProperties(false)}
              title="Masquer les propriétés"
            >
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 scrollbar-app">
            {isLive ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-4 text-center">
                <Eye className="h-8 w-8 text-emerald-600/50" />
                <p className="mt-3 text-sm font-semibold">Page affichée en live</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Passez en « Éditer » pour modifier une section. Les changements s’affichent
                  immédiatement sur le canvas.
                </p>
                <Button className="mt-4" size="sm" onClick={() => setViewMode('edit')}>
                  Revenir à l’édition
                </Button>
              </div>
            ) : selectedChrome === 'header' && onAppBarChange && onAppBarSave ? (
              <AppBarStylePanel
                value={appBar}
                onChange={onAppBarChange}
                onSave={onAppBarSave}
                saving={appBarSaving}
              />
            ) : selectedChrome === 'footer' ? (
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Le pied de page se personnalise dans{' '}
                  <span className="font-medium text-foreground">Boutique en ligne → Navigation</span>{' '}
                  (liens footer).
                </p>
                <Button type="button" variant="outline" size="sm" asChild>
                  <Link to="/admin/sections">Ouvrir la navigation</Link>
                </Button>
              </div>
            ) : selected && selectedIndex != null ? (
              <>
                <p className="text-xs text-muted-foreground">{selectedMeta?.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 px-2"
                    disabled={selectedIndex <= 0}
                    onClick={() => moveBy(selectedIndex, -1)}
                    title="Monter (Alt+↑)"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 px-2"
                    disabled={selectedIndex >= blocks.length - 1}
                    onClick={() => moveBy(selectedIndex, 1)}
                    title="Descendre (Alt+↓)"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 px-2"
                    onClick={() => duplicateAt(selectedIndex)}
                    title="Dupliquer (Ctrl+D)"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Dupliquer
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={selected.visibleMobile !== false ? 'secondary' : 'outline'}
                    className="gap-1.5"
                    onClick={() =>
                      patchMeta(selectedIndex, {
                        visibleMobile: !(selected.visibleMobile !== false),
                      })
                    }
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Mobile
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={selected.visibleDesktop !== false ? 'secondary' : 'outline'}
                    className="gap-1.5"
                    onClick={() =>
                      patchMeta(selectedIndex, {
                        visibleDesktop: !(selected.visibleDesktop !== false),
                      })
                    }
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Bureau
                  </Button>
                </div>
                <div className="space-y-3 border-t border-border/70 pt-3">
                  {renderFields(selected, selectedIndex)}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-1.5 text-destructive"
                  onClick={() => removeAt(selectedIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                  Retirer
                </Button>
              </>
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-4 text-center">
                <MousePointer2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-semibold">Sélectionnez un composant</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cliquez aussi l’en-tête en haut de l’aperçu — c’est l’en-tête global de toute la
                  boutique.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => selectChrome('header')}
                >
                  Personnaliser l’en-tête global
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {selectedChrome === 'header' && onAppBarChange && onAppBarSave && !isLive ? (
        <div className="max-h-[42vh] shrink-0 space-y-3 overflow-y-auto border-t border-border bg-white p-3 lg:hidden">
          <AppBarStylePanel
            value={appBar}
            onChange={onAppBarChange}
            onSave={onAppBarSave}
            saving={appBarSaving}
          />
        </div>
      ) : selected && selectedIndex != null && !isLive ? (
        <div className="max-h-[42vh] shrink-0 space-y-3 overflow-y-auto border-t border-border bg-white p-3 lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold">{selectedMeta?.label}</p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => removeAt(selectedIndex)}
            >
              Retirer
            </Button>
          </div>
          {renderFields(selected, selectedIndex)}
        </div>
      ) : null}

      {showShortcuts ? (
        <div
          className="absolute inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-[2px]"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-display text-lg font-semibold">
                <Keyboard className="h-5 w-5 text-sky-600" />
                Raccourcis
              </p>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowShortcuts(false)}>
                Fermer
              </Button>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ['Ctrl + S', 'Enregistrer'],
                ['Ctrl + Z / Y', 'Annuler / Rétablir'],
                ['Ctrl + D', 'Dupliquer la section'],
                ['Suppr', 'Retirer la section'],
                ['Alt + ↑ / ↓', 'Réordonner'],
                ['Ctrl + Shift + F', 'Plein écran'],
                ['Ctrl + \\', 'Panneau composants'],
                ['Ctrl + /', 'Panneau propriétés'],
                ['Échap', 'Quitter plein écran'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5">
                  <span className="text-muted-foreground">{v}</span>
                  <kbd className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px]">
                    {k}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
