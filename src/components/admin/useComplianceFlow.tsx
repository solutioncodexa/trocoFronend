import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import type { LegalWidget } from '@/config/assistantFlow';
import {
  CNDP_NOTICE_VERSION,
  RETENTION_CHOICES,
  buildComplianceFlow,
  retentionLabelKey,
  retentionValue,
  type ComplianceStepId,
} from '@/config/complianceFlow';
import { PRIVACY_PAGE_SLUG } from '@/config/legalPages';
import { pixelSlotsUsed } from '@/config/marketingFlow';
import { createLegalPages } from '@/utils/legalPages';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { ChipsWidget } from './AssistantDesignWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  saveSettings: (payload: UpdateStoreSettingsRequest) => Promise<StoreSettingsDTO>;
  invalidate: () => void;
};

/**
 * Conversation « conformité » : pages légales (modèles à relire), consentement aux cookies quand des pixels sont
 * actifs, durée de conservation des données. Les enregistrements passent par l'API existante.
 */
export function useComplianceFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, saveSettings, invalidate } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const queue = useRef<ComplianceStepId[]>([]);

  const say = (content: string, widget?: LegalWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.legal.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setStep(null);
      say(t('assistant.legal.done'));
      return;
    }
    setStep(`legal${next.charAt(0).toUpperCase()}${next.slice(1)}`);
    say(t(`assistant.legal.${next}.ask`), { kind: 'lyesno', id: next });
  };

  const start = () =>
    act(async () => {
      const [current, pages] = await Promise.all([platformApi.getMyStoreSettings(), storePagesApi.list()]);
      settings.current = current;
      queue.current = buildComplianceFlow({
        privacyPolicyUrl: current.privacyPolicyUrl,
        hasPrivacyPage: pages.some((p) => (p.slug || '').toLowerCase() === PRIVACY_PAGE_SLUG),
        cookieConsentRequired: current.cookieConsentRequired,
        usesPixels: pixelSlotsUsed(current) > 0,
        cndpNoticeVersion: current.cndpNoticeVersion,
      });

      echo(t('assistant.legal.start'));
      if (queue.current.length === 0) return void say(t('assistant.legal.nothing'));
      say(t('assistant.legal.intro'));
      askNext();
    });

  const skip = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askNext();
  };

  const createPages = () =>
    act(async () => {
      const s = settings.current;
      const created = await createLegalPages({
        storeName: s?.siteName?.trim() || '',
        contactEmail: s?.contactEmail ?? undefined,
        contactPhone: s?.contactPhone ?? undefined,
        contactCity: s?.contactCity ?? undefined,
      });
      invalidate();
      clearWidgets();
      echo(t('assistant.flow.yes'));
      say(created.length > 0 ? t('assistant.legal.pages.done', { n: created.length }) : t('assistant.legal.pages.none'));
      askNext();
    });

  const enableCookies = () =>
    act(async () => {
      settings.current = await saveSettings({ cookieConsentRequired: true });
      invalidate();
      clearWidgets();
      echo(t('assistant.flow.yes'));
      say(t('assistant.legal.cookies.done'));
      askNext();
    });

  const onRetention = (id: string) => {
    const days = Number(id);
    if (!RETENTION_CHOICES.some((d) => d === days)) return;
    void act(async () => {
      settings.current = await saveSettings({ dataRetentionDays: days, cndpNoticeVersion: CNDP_NOTICE_VERSION });
      invalidate();
      clearWidgets();
      echo(t(retentionLabelKey(days), { n: retentionValue(days) }));
      say(t('assistant.legal.retention.done'));
      askNext();
    });
  };

  const onYesNo = (id: Extract<LegalWidget, { kind: 'lyesno' }>['id'], yes: boolean) => {
    if (!yes) return skip();
    if (id === 'pages') return void createPages();
    if (id === 'cookies') return void enableCookies();
    clearWidgets();
    echo(t('assistant.flow.yes'));
    say(t('assistant.legal.retention.pick'), { kind: 'lpick' });
  };

  const renderWidget = (w: LegalWidget): ReactNode => {
    if (w.kind === 'lyesno') {
      return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
    }
    return (
      <ChipsWidget
        busy={busy}
        onPick={onRetention}
        options={RETENTION_CHOICES.map((d) => ({ id: String(d), label: t(retentionLabelKey(d), { n: retentionValue(d) }) }))}
      />
    );
  };

  return { start, renderWidget };
}
