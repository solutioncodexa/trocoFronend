import { useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { assistantApi } from '@/services/api/assistant';
import { platformApi } from '@/services/api/platform';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';
import type { LogoWidget } from '@/config/assistantFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { FieldWidget } from './AssistantCatalogWidgets';
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

type PickId = 'sector' | 'style' | 'symbol' | 'colors';

const OPTIONS: Record<PickId, string[]> = {
  sector: ['jewelry', 'fashion', 'beauty', 'food', 'craft', 'tech', 'home', 'other'],
  style: ['minimal', 'modern', 'luxury', 'moroccan', 'playful'],
  symbol: ['monogram', 'icon', 'text', 'surprise'],
  colors: ['shop', 'blue', 'green', 'red', 'blackgold', 'pink', 'purple', 'surprise'],
};
const NEXT: Record<PickId, PickId | null> = { sector: 'style', style: 'symbol', symbol: 'colors', colors: null };
const ASK: Record<PickId, AdminMessageKey> = {
  sector: 'assistant.logo.sector.ask',
  style: 'assistant.logo.style.ask',
  symbol: 'assistant.logo.symbol.ask',
  colors: 'assistant.logo.colors.ask',
};
const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Conversation « créer mon logo » : l'assistant pose quelques questions (nom, secteur, style, symbole, couleurs),
 * génère le logo avec l'IA puis le montre. Rien n'est appliqué à la boutique avant la validation du commerçant.
 */
export function useLogoFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, saveSettings, invalidate } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const answers = useRef<{ brandName: string; sector?: string; style?: string; symbol?: string; colors?: string }>({
    brandName: '',
  });

  const say = (content: string, widget?: LogoWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 200) : '';
      say(t('assistant.logo.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const ask = (id: PickId) => {
    setStep('logoCreate');
    say(t(ASK[id]), { kind: 'lpick', id });
  };

  const generate = () =>
    act(async () => {
      say(t('assistant.logo.generating'));
      const res = await assistantApi.generateLogo(answers.current);
      clearWidgets();
      say(t('assistant.logo.preview'), { kind: 'lpreview', logoUrl: res.logoUrl, faviconUrl: res.faviconUrl });
    });

  const start = () =>
    act(async () => {
      settings.current = await platformApi.getMyStoreSettings();
      answers.current = { brandName: '' };
      echo(t('assistant.logo.start'));
      say(t('assistant.logo.intro', { n: 3 }));
      setStep('logoCreate');
      say(t('assistant.logo.brand.ask'), { kind: 'lfield', field: 'brand' });
    });

  const onBrand = (value: string) => {
    const brand = value.trim();
    if (brand.length < 2 || brand.length > 40) return say(t('assistant.flow.invalid'));
    answers.current.brandName = brand;
    clearWidgets();
    echo(brand);
    ask('sector');
  };

  const optionValue = (id: PickId, option: string): string | undefined => {
    if (id === 'sector') return option === 'other' ? undefined : option;
    if (id === 'symbol') return option === 'surprise' ? undefined : option;
    if (id === 'colors') {
      if (option === 'surprise') return undefined;
      if (option === 'shop') {
        const c = settings.current?.primaryColor ?? '';
        return HEX.test(c) ? c : undefined;
      }
    }
    return option;
  };

  const onPick = (id: PickId, option: string) => {
    answers.current[id] = optionValue(id, option);
    clearWidgets();
    echo(t(`assistant.logo.${id}.${option}` as AdminMessageKey));
    const next = NEXT[id];
    if (next) return ask(next);
    void generate();
  };

  const onApply = (w: Extract<LogoWidget, { kind: 'lpreview' }>) =>
    act(async () => {
      await saveSettings({ logoUrl: w.logoUrl, faviconUrl: w.faviconUrl });
      invalidate();
      clearWidgets();
      echo(t('assistant.logo.apply'));
      say(t('assistant.logo.applied'));
      setStep(null);
    });

  const onAgain = () => {
    clearWidgets();
    echo(t('assistant.logo.again'));
    void generate();
  };

  const onRestart = () => {
    clearWidgets();
    echo(t('assistant.logo.restart'));
    say(t('assistant.logo.brand.ask'), { kind: 'lfield', field: 'brand' });
  };

  const renderWidget = (w: LogoWidget): ReactNode => {
    switch (w.kind) {
      case 'lfield':
        return (
          <FieldWidget
            key="logo-brand"
            busy={busy}
            inputMode="text"
            onSubmit={onBrand}
            suggestions={settings.current?.siteName ? [settings.current.siteName] : undefined}
            placeholder={t('assistant.logo.brand.placeholder')}
          />
        );
      case 'lpick':
        return (
          <ChipsWidget
            busy={busy}
            options={OPTIONS[w.id].map((o) => ({ id: o, label: t(`assistant.logo.${w.id}.${o}` as AdminMessageKey) }))}
            onPick={(o) => onPick(w.id, o)}
          />
        );
      case 'lpreview':
        return (
          <div className="mt-2 space-y-2">
            <img
              src={resolvePublicImageUrl(w.logoUrl)}
              alt={t('assistant.logo.previewAlt')}
              className="w-full max-w-[16rem] rounded-lg border bg-white"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" disabled={busy} onClick={() => void onApply(w)}>
                {t('assistant.logo.apply')}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onAgain}>
                {t('assistant.logo.again')}
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={onRestart}>
                {t('assistant.logo.restart')}
              </Button>
            </div>
          </div>
        );
    }
  };

  return { start, renderWidget };
}
