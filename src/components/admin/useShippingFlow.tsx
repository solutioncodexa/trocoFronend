import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import { shippingApi } from '@/services/api/shipping';
import type { ShippingWidget } from '@/config/assistantFlow';
import {
  CARRIER_SUGGESTIONS,
  carrierCode,
  parseEta,
  parseFee,
  validCarrierName,
} from '@/config/sellFlow';
import { parseAmount } from '@/config/assistantFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { ShippingCarrierDTO } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';
import { SummaryWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  /** Rafraîchit les listes déjà affichées dans l'admin. */
  invalidate: () => void;
};

type Draft = { name: string; code: string; fee: number; freeAbove: number | null; etaMin: number | null; etaMax: number | null };

const FEE_SUGGESTIONS = ['0', '20', '30', '40', '50'];
const FREE_SUGGESTIONS = ['300', '500', '1000'];
const ETA_SUGGESTIONS = ['1-2', '2-4', '3-5'];

/**
 * Conversation « livraison » : l'assistant demande le transporteur, ses frais, le seuil de gratuité et le délai,
 * puis l'ajoute via l'API existante. Le modèle n'écrit jamais en base.
 */
export function useShippingFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, invalidate } = ctx;
  const carriers = useRef<ShippingCarrierDTO[]>([]);
  const hasDefault = useRef(false);
  const draft = useRef<Draft>({ name: '', code: '', fee: 0, freeAbove: null, etaMin: null, etaMax: null });

  const say = (content: string, widget?: ShippingWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.ship.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const askName = () => {
    setStep('shippingName');
    draft.current = { name: '', code: '', fee: 0, freeAbove: null, etaMin: null, etaMax: null };
    say(t('assistant.ship.name.ask'), { kind: 'shfield', field: 'name' });
  };

  const finish = () => {
    setStep(null);
    say(t('assistant.ship.done'));
  };

  const start = () =>
    act(async () => {
      const [list, settings] = await Promise.all([shippingApi.listAdmin(), platformApi.getMyStoreSettings()]);
      carriers.current = list;
      hasDefault.current = Boolean(settings.shippingDefaultCarrier?.trim());
      echo(t('assistant.ship.start'));
      say(t('assistant.ship.intro'));
      if (list.length === 0) askName();
      else say(t('assistant.ship.have', { n: list.length }), { kind: 'shyesno', id: 'add' });
    });

  const onYesNo = (yes: boolean) => {
    clearWidgets();
    echo(t(yes ? 'assistant.flow.yes' : 'assistant.flow.no'));
    if (yes) askName();
    else finish();
  };

  const onField = (field: 'name' | 'fee' | 'free' | 'eta', value: string) => {
    const invalid = () => say(t('assistant.flow.invalid'));
    switch (field) {
      case 'name': {
        if (!validCarrierName(value)) return invalid();
        draft.current.name = value.trim();
        draft.current.code = carrierCode(value, carriers.current.map((c) => c.code));
        clearWidgets();
        echo(value);
        return say(t('assistant.ship.fee.ask'), { kind: 'shfield', field: 'fee' });
      }
      case 'fee': {
        const fee = parseFee(value);
        if (fee === null) return invalid();
        draft.current.fee = fee;
        clearWidgets();
        echo(`${fee} MAD`);
        // Frais à zéro : la livraison est déjà gratuite, inutile de demander un seuil.
        if (fee === 0) return say(t('assistant.ship.eta.ask'), { kind: 'shfield', field: 'eta' });
        return say(t('assistant.ship.free.ask'), { kind: 'shfield', field: 'free' });
      }
      case 'free': {
        const amount = parseAmount(value);
        if (amount === null) return invalid();
        draft.current.freeAbove = amount;
        clearWidgets();
        echo(`${amount} MAD`);
        return say(t('assistant.ship.eta.ask'), { kind: 'shfield', field: 'eta' });
      }
      case 'eta': {
        const eta = parseEta(value);
        if (!eta) return invalid();
        draft.current.etaMin = eta.min;
        draft.current.etaMax = eta.max;
        clearWidgets();
        echo(t('assistant.ship.summary.days', { min: eta.min, max: eta.max }));
        return say(t('assistant.ship.confirm'), { kind: 'shconfirm' });
      }
    }
  };

  const skipField = (field: 'free' | 'eta') => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    if (field === 'free') {
      draft.current.freeAbove = null;
      say(t('assistant.ship.eta.ask'), { kind: 'shfield', field: 'eta' });
    } else {
      draft.current.etaMin = null;
      draft.current.etaMax = null;
      say(t('assistant.ship.confirm'), { kind: 'shconfirm' });
    }
  };

  const create = () =>
    act(async () => {
      const d = draft.current;
      const created = await shippingApi.upsert({
        code: d.code,
        name: d.name,
        enabled: true,
        baseFee: d.fee,
        freeAbove: d.freeAbove,
        etaDaysMin: d.etaMin,
        etaDaysMax: d.etaMax,
        sortOrder: carriers.current.length,
      });
      carriers.current = [...carriers.current, created];
      clearWidgets();
      echo(t('assistant.ship.add'));
      say(t('assistant.ship.created', { name: d.name }));
      // Le premier transporteur devient le choix par défaut du checkout.
      if (!hasDefault.current) {
        await platformApi.updateMyStoreSettings({ shippingDefaultCarrier: created.code });
        hasDefault.current = true;
        say(t('assistant.ship.default'));
      }
      invalidate();
      say(t('assistant.ship.another'), { kind: 'shyesno', id: 'another' });
    });

  const cancel = () => {
    clearWidgets();
    echo(t('assistant.catalog.product.cancel'));
    say(t('assistant.ship.another'), { kind: 'shyesno', id: 'another' });
  };

  const renderWidget = (w: ShippingWidget): ReactNode => {
    switch (w.kind) {
      case 'shyesno':
        return <YesNoWidget busy={busy} onYes={() => onYesNo(true)} onNo={() => onYesNo(false)} />;
      case 'shfield':
        return (
          <FieldWidget
            key={w.field}
            busy={busy}
            inputMode={w.field === 'name' ? 'text' : w.field === 'eta' ? 'text' : 'decimal'}
            onSubmit={(value) => onField(w.field, value)}
            onSkip={w.field === 'free' || w.field === 'eta' ? () => skipField(w.field as 'free' | 'eta') : undefined}
            suggestions={
              w.field === 'name'
                ? [...CARRIER_SUGGESTIONS, t('assistant.ship.name.own')]
                : w.field === 'fee'
                  ? FEE_SUGGESTIONS
                  : w.field === 'free'
                    ? FREE_SUGGESTIONS
                    : ETA_SUGGESTIONS
            }
            placeholder={t(
              w.field === 'name'
                ? 'assistant.ship.name.placeholder'
                : w.field === 'fee'
                  ? 'assistant.ship.fee.placeholder'
                  : w.field === 'free'
                    ? 'assistant.ship.free.placeholder'
                    : 'assistant.ship.eta.placeholder',
            )}
          />
        );
      case 'shconfirm': {
        const d = draft.current;
        return (
          <SummaryWidget
            busy={busy}
            confirmLabel={t('assistant.ship.add')}
            cancelLabel={t('assistant.catalog.product.cancel')}
            onConfirm={() => void create()}
            onCancel={cancel}
            rows={[
              { label: t('assistant.ship.summary.name'), value: d.name },
              { label: t('assistant.ship.summary.fee'), value: `${d.fee} MAD` },
              { label: t('assistant.ship.summary.free'), value: d.freeAbove === null ? '—' : `${d.freeAbove} MAD` },
              {
                label: t('assistant.ship.summary.eta'),
                value: d.etaMin === null ? '—' : t('assistant.ship.summary.days', { min: d.etaMin, max: d.etaMax ?? d.etaMin }),
              },
            ]}
          />
        );
      }
    }
  };

  return { start, renderWidget };
}
