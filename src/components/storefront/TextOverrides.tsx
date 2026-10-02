import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Undo2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { normalizeAppearance, type StoreAppearance } from '@/config/storeAppearance';
import { useAdmin } from '@/contexts/AdminContext';
import { useTenant } from '@/contexts/TenantContext';
import { platformApi } from '@/services/api/platform';
import {
  isEditableTextNode,
  originalTextOf,
  sanitizeTextOverrides,
  startTextOverrides,
  textNodeAtPoint,
} from '@/utils/textOverrides';

/** `?edit=text` : mode d'édition des textes (réservé au propriétaire connecté). */
const EDIT_PARAM = 'edit';
const EDIT_VALUE = 'text';

type Editing = { original: string; current: string };

/**
 * Applique les textes personnalisés de la boutique (tous visiteurs) et, pour l'administrateur connecté
 * qui ouvre la vitrine avec `?edit=text`, permet de cliquer n'importe quel texte pour le modifier.
 */
export default function TextOverrides({ appearance }: { appearance: StoreAppearance }) {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { store, refresh } = useTenant();
  const overrides = useMemo(() => sanitizeTextOverrides(appearance.textOverrides), [appearance.textOverrides]);
  const editMode = isAdmin && new URLSearchParams(search).get(EDIT_PARAM) === EDIT_VALUE;

  const [editing, setEditing] = useState<Editing | null>(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const hoverEl = useRef<HTMLElement | null>(null);

  // Remplacements pour tous les visiteurs.
  useEffect(() => startTextOverrides(overrides), [overrides]);

  const persist = useCallback(
    async (next: Record<string, string>) => {
      setSaving(true);
      try {
        const base = normalizeAppearance(store?.appearance);
        await platformApi.updateMyStoreSettings({ appearance: { ...base, textOverrides: next } });
        await refresh();
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Enregistrement impossible');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [refresh, store?.appearance],
  );

  // Mode édition : survol + clic sur n'importe quel texte.
  useEffect(() => {
    if (!editMode) return;

    const clearHover = () => {
      hoverEl.current?.removeAttribute('data-text-edit-hover');
      hoverEl.current = null;
    };

    const inChrome = (el: Element | null) => Boolean(el?.closest('[data-text-edit-ui]'));

    const onMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || inChrome(el)) return clearHover();
      const node = textNodeAtPoint(e.clientX, e.clientY, el);
      const host = node?.parentElement ?? null;
      if (host === hoverEl.current) return;
      clearHover();
      if (host) {
        host.setAttribute('data-text-edit-hover', '');
        hoverEl.current = host;
      }
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || inChrome(el)) return;
      // On bloque la navigation / les actions : en mode édition, un clic sert à choisir un texte.
      e.preventDefault();
      e.stopPropagation();
      const node = textNodeAtPoint(e.clientX, e.clientY, el);
      if (!node || !isEditableTextNode(node)) return;
      const original = originalTextOf(node).trim();
      const current = (node.nodeValue ?? '').trim();
      setEditing({ original, current });
      setDraft(current);
    };

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
      clearHover();
    };
  }, [editMode]);

  const exitEditMode = () => {
    const params = new URLSearchParams(search);
    params.delete(EDIT_PARAM);
    const qs = params.toString();
    navigate({ pathname, search: qs ? `?${qs}` : '' }, { replace: true });
  };

  const save = async () => {
    if (!editing) return;
    const value = draft.trim();
    const next = { ...overrides };
    if (!value || value === editing.original) delete next[editing.original];
    else next[editing.original] = value;
    if (await persist(next)) {
      toast.success(value && value !== editing.original ? 'Texte enregistré' : 'Texte d’origine rétabli');
      setEditing(null);
    }
  };

  if (!editMode) return null;

  const isOverridden = editing ? editing.original in overrides : false;

  return (
    <>
      <style>{`[data-text-edit-hover]{outline:2px dashed #0ea5e9;outline-offset:2px;cursor:text!important;background:rgba(14,165,233,.08)}`}</style>
      <div
        data-text-edit-ui
        className="fixed inset-x-0 bottom-0 z-[100] flex flex-wrap items-center justify-between gap-2 border-t border-sky-700 bg-sky-600 px-4 py-2.5 text-sm text-white shadow-2xl"
      >
        <span className="flex items-center gap-2 font-medium">
          <Pencil className="h-4 w-4" aria-hidden />
          Mode édition des textes — cliquez sur n’importe quel texte pour le modifier
          {Object.keys(overrides).length ? (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {Object.keys(overrides).length} modifié{Object.keys(overrides).length > 1 ? 's' : ''}
            </span>
          ) : null}
        </span>
        <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={exitEditMode}>
          <X className="h-4 w-4" aria-hidden />
          Quitter
        </Button>
      </div>

      <Dialog open={editing != null} onOpenChange={(open) => !open && !saving && setEditing(null)}>
        <DialogContent data-text-edit-ui className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier ce texte</DialogTitle>
            <DialogDescription>
              Le nouveau texte remplace celui-ci partout où il apparaît à l’identique sur la boutique.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="space-y-3">
              <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <span className="font-semibold">Texte d’origine : </span>
                {editing.original}
              </p>
              <Textarea
                autoFocus
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={600}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') void save();
                }}
              />
              <p className="text-[11px] text-muted-foreground">Ctrl + Entrée pour enregistrer.</p>
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-between">
            {isOverridden ? (
              <Button
                type="button"
                variant="ghost"
                className="gap-1.5"
                disabled={saving}
                onClick={() => {
                  if (!editing) return;
                  setDraft(editing.original);
                  const next = { ...overrides };
                  delete next[editing.original];
                  void persist(next).then((ok) => {
                    if (ok) {
                      toast.success('Texte d’origine rétabli');
                      setEditing(null);
                    }
                  });
                }}
              >
                <Undo2 className="h-4 w-4" aria-hidden />
                Rétablir l’original
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={saving} onClick={() => setEditing(null)}>
                Annuler
              </Button>
              <Button type="button" disabled={saving} onClick={() => void save()}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
