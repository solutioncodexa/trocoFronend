import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import type { GrowthWidget } from '@/config/assistantFlow';
import {
  CART_DELAYS,
  MAD_PER_POINT,
  POINTS_PER_MAD,
  buildGrowthFlow,
  cnameTarget,
  delayLabelKey,
  delayValue,
  isCustomDomain,
  normalizeDomain,
  whatsappTemplates,
  type GrowthStepId,
} from '@/config/growthFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { PlanFeaturesDTO, StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';
import { ChipsWidget } from './AssistantDesignWidgets';
import { SummaryWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  lang: 'fr' | 'en' | 'ar';
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  saveSettings: (payload: UpdateStoreSettingsRequest) => Promise<StoreSettingsDTO>;
  /** Met le cache et la session à jour avec des réglages déjà renvoyés par le serveur (vérification du domaine). */
  applySettings: (settings: StoreSettingsDTO) => Promise<void>;
};

type LoyaltyDraft = { points: number; value: number };

/**
 * Conversation « fonctions Pro » : relance des paniers abandonnés, message WhatsApp, fidélité, domaine personnalisé.
 * Seules les options incluses dans le plan sont proposées ; le serveur revérifie chaque droit à l'enregistrement.
 */
export function useGrowthFlow(ctx: Ctx) {
  const { t, lang, busy, setBusy, push, clearWidgets, setStep, saveSettings, applySettings } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const queue = useRef<GrowthStepId[]>([]);
  const loyalty = useRef<LoyaltyDraft>({ points: 1, value: 0.1 });
  const host = useRef('');

  const say = (content: string, widget?: GrowthWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.growth.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const save = async (payload: UpdateStoreSettingsRequest) => {
    settings.current = await saveSettings(payload);
  };

  const target = () => cnameTarget(settings.current?.slug);

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setStep(null);
      say(t('assistant.growth.done'));
      return;
    }
    setStep(`growth${next.charAt(0).toUpperCase()}${next.slice(1)}`);
    if (next === 'verify') {
      host.current = settings.current?.customDomain ?? '';
      return say(t('assistant.growth.domain.verifyAsk', { host: host.current, target: target() }), { kind: 'gyesno', id: 'verify' });
    }
    say(t(`assistant.growth.${next}.ask`), { kind: 'gyesno', id: next });
  };

  const start = () =>
    act(async () => {
      const [current, plans] = await Promise.all([platformApi.getMyStoreSettings(), platformApi.getPlans()]);
      settings.current = current;
      const plan = plans.find((p) => p.code.toLowerCase() === (current.planCode ?? '').toLowerCase());
      const features: PlanFeaturesDTO | undefined = plan?.features;
      const customDomainAllowed = Boolean(plan?.customDomain);
      queue.current = buildGrowthFlow({ settings: current, features, customDomainAllowed });

      echo(t('assistant.growth.start'));
      if (queue.current.length > 0) {
        say(t('assistant.growth.intro'));
        return askNext();
      }
      const anyIncluded = Boolean(
        features?.abandonedCart || features?.whatsappBusiness || features?.loyalty || customDomainAllowed,
      );
      say(t(anyIncluded ? 'assistant.growth.nothing' : 'assistant.growth.locked'));
    });

  const skip = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askNext();
  };

  // ───────────── Paniers abandonnés ─────────────

  const onDelay = (id: string) => {
    const minutes = Number(id);
    if (!CART_DELAYS.some((d) => d === minutes)) return;
    void act(async () => {
      await save({ abandonedCartEnabled: true, abandonedCartDelayMinutes: minutes });
      clearWidgets();
      echo(t(delayLabelKey(minutes), { n: delayValue(minutes) }));
      say(t('assistant.growth.cart.done'));
      askNext();
    });
  };

  // ───────────── WhatsApp ─────────────

  const onTemplate = (id: string) => {
    const template = whatsappTemplates(lang)[Number(id)];
    if (!template) return;
    void act(async () => {
      await save({ whatsappOrderTemplate: template });
      clearWidgets();
      echo(template);
      say(t('assistant.growth.whatsapp.done'));
      askNext();
    });
  };

  // ───────────── Fidélité ─────────────

  const onPoints = (id: string) => {
    const n = Number(id);
    if (!POINTS_PER_MAD.some((p) => p === n)) return;
    loyalty.current.points = n;
    clearWidgets();
    echo(String(n));
    say(t('assistant.growth.loyalty.value'), { kind: 'gpick', id: 'value' });
  };

  const onValue = (id: string) => {
    const n = Number(id);
    if (!MAD_PER_POINT.some((v) => v === n)) return;
    loyalty.current.value = n;
    clearWidgets();
    echo(`${n} MAD`);
    say(t('assistant.growth.loyalty.confirm'), { kind: 'gconfirm' });
  };

  const enableLoyalty = () =>
    act(async () => {
      const d = loyalty.current;
      await save({ loyaltyEnabled: true, loyaltyPointsPerMad: d.points, loyaltyMadPerPoint: d.value });
      clearWidgets();
      echo(t('assistant.growth.loyalty.enable'));
      say(t('assistant.growth.loyalty.done'));
      askNext();
    });

  // ───────────── Domaine ─────────────

  const onDomain = (value: string) => {
    if (!isCustomDomain(value)) return say(t('assistant.flow.invalid'));
    const domain = normalizeDomain(value);
    void act(async () => {
      await save({ customDomain: domain });
      host.current = domain;
      clearWidgets();
      echo(domain);
      say(t('assistant.growth.domain.saved', { host: domain, target: target() }), { kind: 'gyesno', id: 'verify' });
    });
  };

  const verifyDomain = () =>
    act(async () => {
      const verified = await platformApi.verifyMyDomain();
      settings.current = verified;
      await applySettings(verified);
      clearWidgets();
      echo(t('assistant.flow.yes'));
      say(
        verified.domainVerified
          ? t('assistant.growth.domain.ok', { host: host.current })
          : t('assistant.growth.domain.pending'),
      );
      askNext();
    });

  const onYesNo = (id: Extract<GrowthWidget, { kind: 'gyesno' }>['id'], yes: boolean) => {
    if (!yes) return skip();
    if (id === 'verify') return void verifyDomain();
    clearWidgets();
    echo(t('assistant.flow.yes'));
    if (id === 'cart') return say(t('assistant.growth.cart.delay'), { kind: 'gpick', id: 'cartDelay' });
    if (id === 'whatsapp') return say(t('assistant.growth.whatsapp.pick'), { kind: 'gpick', id: 'template' });
    if (id === 'loyalty') return say(t('assistant.growth.loyalty.points'), { kind: 'gpick', id: 'points' });
    say(t('assistant.growth.domain.field'), { kind: 'gfield' });
  };

  const renderWidget = (w: GrowthWidget): ReactNode => {
    switch (w.kind) {
      case 'gyesno':
        return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
      case 'gpick': {
        if (w.id === 'cartDelay') {
          return (
            <ChipsWidget
              busy={busy}
              onPick={onDelay}
              options={CART_DELAYS.map((m) => ({ id: String(m), label: t(delayLabelKey(m), { n: delayValue(m) }) }))}
            />
          );
        }
        if (w.id === 'template') {
          return (
            <ChipsWidget
              busy={busy}
              onPick={onTemplate}
              options={whatsappTemplates(lang).map((label, i) => ({ id: String(i), label }))}
            />
          );
        }
        if (w.id === 'points') {
          return (
            <ChipsWidget
              busy={busy}
              onPick={onPoints}
              options={POINTS_PER_MAD.map((n) => ({ id: String(n), label: String(n) }))}
            />
          );
        }
        return (
          <ChipsWidget
            busy={busy}
            onPick={onValue}
            options={MAD_PER_POINT.map((n) => ({ id: String(n), label: `${n} MAD` }))}
          />
        );
      }
      case 'gfield':
        return (
          <FieldWidget
            busy={busy}
            inputMode="text"
            onSubmit={onDomain}
            onSkip={skip}
            placeholder={t('assistant.growth.domain.placeholder')}
          />
        );
      case 'gconfirm': {
        const d = loyalty.current;
        return (
          <SummaryWidget
            busy={busy}
            confirmLabel={t('assistant.growth.loyalty.enable')}
            cancelLabel={t('assistant.catalog.product.cancel')}
            onConfirm={() => void enableLoyalty()}
            onCancel={skip}
            rows={[
              { label: t('assistant.growth.loyalty.summary.points'), value: String(d.points) },
              { label: t('assistant.growth.loyalty.summary.value'), value: `${d.value} MAD` },
            ]}
          />
        );
      }
    }
  };

  return { start, renderWidget };
}
