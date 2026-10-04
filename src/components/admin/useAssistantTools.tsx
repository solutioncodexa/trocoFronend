import type { ReactNode } from 'react';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assistantApi, type AssistantAction } from '@/services/api/assistant';
import type { ToolWidget } from '@/config/assistantFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { Entry } from './assistantTypes';
import { SummaryWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  /** Rafraîchit les données de l'admin après une action de l'assistant. */
  refresh: () => Promise<void>;
};

const DONE_KEYS = new Set([
  'update_store_texts',
  'update_contact',
  'set_free_shipping_threshold',
  'create_category',
  'delete_category',
  'delete_product',
  'set_theme',
  'create_promo_code',
]);
const CONFIRM_KEYS = new Set(['delete_category', 'delete_product', 'set_theme', 'create_promo_code']);

/**
 * Actions du modèle : celles déjà faites sont annoncées (avec un bouton d'annulation quand c'est possible), celles à
 * fort impact apparaissent comme une carte à confirmer. Le texte affiché vient de l'interface (traduit), pas du
 * modèle ; rien n'est exécuté sans le serveur.
 */
export function useAssistantTools(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, refresh } = ctx;

  const doneText = (a: AssistantAction) =>
    DONE_KEYS.has(a.tool)
      ? t(`assistant.tool.${a.tool}.done` as AdminMessageKey, a.display ?? {})
      : t('assistant.tool.done');

  const failText = (a: AssistantAction) => t('assistant.tool.failed', { msg: (a.error ?? '').slice(0, 160) });

  const confirmText = (tool: string, display: Record<string, string>) =>
    CONFIRM_KEYS.has(tool) ? t(`assistant.tool.${tool}.confirm` as AdminMessageKey, display) : t('assistant.tool.confirm');

  /** Réponse du serveur : actions faites, puis texte du modèle, puis éventuelle action à confirmer (en dernier). */
  const handleReply = (reply: string, actions: AssistantAction[] = []) => {
    const entries: Entry[] = [];
    let changed = false;
    for (const a of actions) {
      if (a.status === 'done') {
        changed = true;
        entries.push({ role: 'assistant', content: doneText(a) });
      } else if (a.status === 'failed') {
        entries.push({ role: 'assistant', content: failText(a) });
      }
    }
    // Un seul bouton d'annulation est actif à la fois : celui de la dernière action annulable.
    const lastUndo = [...actions].reverse().find((a) => a.status === 'done' && a.undoId);
    if (lastUndo?.undoId) {
      const idx = entries.findIndex((e) => e.content === doneText(lastUndo));
      if (idx >= 0) entries[idx] = { ...entries[idx], widget: { kind: 'tundo', undoId: lastUndo.undoId } };
    }
    entries.push({ role: 'assistant', content: reply });
    const pending = actions.find((a) => a.status === 'pending' && a.actionId);
    if (pending?.actionId) {
      const display = pending.display ?? {};
      entries.push({
        role: 'assistant',
        content: confirmText(pending.tool, display),
        widget: { kind: 'tpending', actionId: pending.actionId, tool: pending.tool, display },
      });
    }
    push(...entries);
    if (changed) void refresh();
  };

  const confirm = async (w: Extract<ToolWidget, { kind: 'tpending' }>) => {
    setBusy(true);
    try {
      const result = await assistantApi.confirmAction(w.actionId);
      clearWidgets();
      if (result.status === 'done') {
        const widget: ToolWidget | undefined = result.undoId ? { kind: 'tundo', undoId: result.undoId } : undefined;
        push({ role: 'assistant', content: doneText(result), widget });
        await refresh();
      } else {
        push({ role: 'assistant', content: failText(result) });
      }
    } catch {
      clearWidgets();
      push({ role: 'assistant', content: t('assistant.tool.expired') });
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (w: Extract<ToolWidget, { kind: 'tpending' }>) => {
    clearWidgets();
    push({ role: 'assistant', content: t('assistant.tool.cancelled') });
    try {
      await assistantApi.cancelAction(w.actionId);
    } catch {
      /* l'action expire d'elle-même */
    }
  };

  const undo = async (w: Extract<ToolWidget, { kind: 'tundo' }>) => {
    setBusy(true);
    try {
      const result = await assistantApi.undoAction(w.undoId);
      clearWidgets();
      if (result.status === 'done') {
        push({ role: 'assistant', content: t('assistant.tool.undone') });
        await refresh();
      } else {
        push({ role: 'assistant', content: failText(result) });
      }
    } catch {
      clearWidgets();
      push({ role: 'assistant', content: t('assistant.tool.expired') });
    } finally {
      setBusy(false);
    }
  };

  const renderWidget = (w: ToolWidget): ReactNode => {
    if (w.kind === 'tundo') {
      return (
        <Button type="button" size="sm" variant="outline" className="mt-2" disabled={busy} onClick={() => void undo(w)}>
          <Undo2 className="me-1.5 h-4 w-4" aria-hidden />
          {t('assistant.tool.undo')}
        </Button>
      );
    }
    return (
      <SummaryWidget
        busy={busy}
        confirmLabel={t('assistant.tool.confirm.yes')}
        cancelLabel={t('assistant.catalog.product.cancel')}
        onConfirm={() => void confirm(w)}
        onCancel={() => void cancel(w)}
        rows={Object.values(w.display).map((value) => ({ label: t('assistant.tool.summary.item'), value }))}
      />
    );
  };

  return { handleReply, renderWidget };
}
