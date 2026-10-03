import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import type { PaymentWidget } from '@/config/assistantFlow';
import {
  MASK,
  PAYPAL_MODES,
  PROVIDER_FIELDS,
  stripeKeyIsLive,
  validKeyField,
  type KeyField,
  type Provider,
} from '@/config/sellFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { ChipsWidget } from './AssistantDesignWidgets';
import { SecretWidget } from './AssistantSellWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  setStep: (step: string | null) => void;
  saveSettings: (payload: UpdateStoreSettingsRequest) => Promise<StoreSettingsDTO>;
  /** Met à jour le cache et la session avec des réglages déjà renvoyés par le serveur. */
  applySettings: (settings: StoreSettingsDTO) => Promise<void>;
};

const PROVIDERS: Provider[] = ['stripe', 'paypal', 'cmi'];
const NAME: Record<Provider, string> = { stripe: 'Stripe', paypal: 'PayPal', cmi: 'CMI' };

/**
 * Conversation « paiement par carte ». SÉCURITÉ : les clés sont saisies dans un champ masqué, gardées en mémoire le
 * temps de l'envoi à l'API de la boutique puis effacées. Elles ne sont jamais écrites dans la conversation (l'écho
 * est masqué), donc jamais stockées dans le navigateur ni envoyées au modèle.
 */
export function usePaymentsFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, saveSettings, applySettings } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const provider = useRef<Provider | null>(null);
  const index = useRef(0);
  const secrets = useRef<Partial<Record<KeyField | 'paypalMode', string>>>({});

  const say = (content: string, widget?: PaymentWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });
  const wipe = () => {
    secrets.current = {};
  };

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.pay.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    wipe();
    setStep(null);
    say(t('assistant.pay.done'));
  };

  const askProvider = () => {
    setStep('paymentProvider');
    say(t('assistant.pay.provider.ask'), { kind: 'payprovider' });
  };

  const askField = () => {
    const p = provider.current;
    if (!p) return;
    const fields = PROVIDER_FIELDS[p];
    const current = fields[index.current];
    if (current) {
      say(t(`assistant.pay.field.${current.field}`), { kind: 'payfield', provider: p, field: current.field, secret: current.secret });
    } else if (p === 'paypal') {
      say(t('assistant.pay.mode.ask'), { kind: 'paymode' });
    } else {
      void verify();
    }
  };

  const start = () =>
    act(async () => {
      settings.current = await platformApi.getMyStoreSettings();
      wipe();
      echo(t('assistant.pay.start'));
      say(t('assistant.pay.intro'));
      askProvider();
    });

  const onProvider = (id: string) => {
    clearWidgets();
    if (id === 'later') {
      echo(t('assistant.pay.provider.later'));
      return finish();
    }
    const p = PROVIDERS.find((x) => x === id);
    if (!p) return;
    provider.current = p;
    index.current = 0;
    wipe();
    echo(NAME[p]);
    say(t(`assistant.pay.help.${p}`));
    askField();
  };

  const onField = (field: KeyField, value: string) => {
    if (!validKeyField(field, value)) {
      // Le texte saisi n'est ni affiché ni conservé.
      say(t('assistant.pay.invalid'));
      return;
    }
    secrets.current[field] = value.trim();
    clearWidgets();
    echo(MASK);
    index.current += 1;
    askField();
  };

  const onMode = (mode: string) => {
    if (!PAYPAL_MODES.some((m) => m === mode)) return;
    secrets.current.paypalMode = mode;
    clearWidgets();
    echo(t(`assistant.pay.mode.${mode as 'sandbox' | 'live'}`));
    void verify();
  };

  /** Enregistre les clés, teste la connexion au prestataire, puis efface les clés de la mémoire. */
  const verify = async () => {
    const p = provider.current;
    if (!p) return;
    const s = secrets.current;
    const name = NAME[p];
    setBusy(true);
    say(t('assistant.pay.testing'));
    try {
      let res: { message: string; settings: StoreSettingsDTO };
      if (p === 'stripe') {
        await saveSettings({ paymentStripeEnabled: true, stripePublishableKey: s.stripePk, stripeSecretKey: s.stripeSk });
        res = await platformApi.testStoreStripe({ stripePublishableKey: s.stripePk, stripeSecretKey: s.stripeSk });
      } else if (p === 'paypal') {
        await saveSettings({
          paymentPaypalEnabled: true,
          paypalClientId: s.paypalId,
          paypalClientSecret: s.paypalSecret,
          paypalMode: s.paypalMode,
        });
        res = await platformApi.testStorePaypal({
          paypalClientId: s.paypalId,
          paypalClientSecret: s.paypalSecret,
          paypalMode: s.paypalMode,
        });
      } else {
        await saveSettings({ paymentCmiEnabled: true, cmiClientId: s.cmiId, cmiStoreKey: s.cmiKey });
        res = await platformApi.testStoreCmi({ cmiClientId: s.cmiId, cmiStoreKey: s.cmiKey });
      }
      const live = p === 'stripe' && stripeKeyIsLive(s.stripeSk ?? '');
      settings.current = res.settings;
      await applySettings(res.settings);
      say(t('assistant.pay.ok', { name, message: res.message ?? '' }));
      if (live) say(t('assistant.pay.live'));
      say(t('assistant.pay.another'), { kind: 'payyesno' });
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.pay.fail', { name, msg }));
      // On repart du premier champ pour ressaisir les clés.
      index.current = 0;
      askField();
    } finally {
      wipe();
      setBusy(false);
    }
  };

  const skipField = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    wipe();
    askProvider();
  };

  const onAnother = (yes: boolean) => {
    clearWidgets();
    echo(t(yes ? 'assistant.flow.yes' : 'assistant.flow.no'));
    if (yes) askProvider();
    else finish();
  };

  const renderWidget = (w: PaymentWidget): ReactNode => {
    switch (w.kind) {
      case 'payprovider': {
        const s = settings.current;
        const ready: Record<Provider, boolean> = {
          stripe: Boolean(s?.stripeReady),
          paypal: Boolean(s?.paypalReady),
          cmi: Boolean(s?.cmiReady),
        };
        return (
          <ChipsWidget
            busy={busy}
            options={[
              ...PROVIDERS.map((p) => ({
                id: p,
                label: `${t(`assistant.pay.provider.${p}`)}${ready[p] ? ` ✅ ${t('assistant.pay.provider.ready')}` : ''}`,
              })),
              { id: 'later', label: t('assistant.pay.provider.later') },
            ]}
            onPick={onProvider}
          />
        );
      }
      case 'payfield':
        return (
          <SecretWidget
            key={`${w.provider}-${w.field}`}
            busy={busy}
            secret={w.secret}
            placeholder={t('assistant.pay.field.placeholder')}
            onSubmit={(value) => onField(w.field, value)}
            onSkip={skipField}
          />
        );
      case 'paymode':
        return (
          <ChipsWidget
            busy={busy}
            options={PAYPAL_MODES.map((m) => ({ id: m, label: t(`assistant.pay.mode.${m}`) }))}
            onPick={onMode}
          />
        );
      case 'payyesno':
        return <YesNoWidget busy={busy} onYes={() => onAnother(true)} onNo={() => onAnother(false)} />;
    }
  };

  return { start, renderWidget };
}
