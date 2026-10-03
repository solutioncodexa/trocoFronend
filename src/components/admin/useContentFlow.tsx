import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import type { ContentWidget } from '@/config/assistantFlow';
import {
  aboutProposal,
  buildContentFlow,
  contactPage,
  faqPage,
  isEmail,
  validAbout,
  validCity,
  type ContentStepId,
} from '@/config/contentFlow';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';

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
  invalidate: () => void;
};

/**
 * Conversation « contenu de base » : email, ville, présentation, page FAQ (réponses tirées des réglages) et page
 * Contact. Les collaborateurs ne sont pas gérés ici : leur mot de passe ne doit pas transiter par le chat.
 */
export function useContentFlow(ctx: Ctx) {
  const { t, lang, busy, setBusy, push, clearWidgets, setStep, saveSettings, invalidate } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const queue = useRef<ContentStepId[]>([]);

  const say = (content: string, widget?: ContentWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.content.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setStep(null);
      say(t('assistant.content.team'));
      say(t('assistant.content.done'));
      return;
    }
    setStep(`content${next.charAt(0).toUpperCase()}${next.slice(1)}`);
    if (next === 'faq' || next === 'contactPage') {
      return say(t(`assistant.content.${next}.ask`), { kind: 'kyesno', id: next });
    }
    say(t(`assistant.content.${next}.ask`), { kind: 'kfield', field: next });
  };

  const start = () =>
    act(async () => {
      const [current, pages] = await Promise.all([platformApi.getMyStoreSettings(), storePagesApi.list()]);
      settings.current = current;
      queue.current = buildContentFlow(
        current,
        pages.map((p) => p.slug || ''),
      );
      echo(t('assistant.content.start'));
      if (queue.current.length === 0) return void say(t('assistant.content.nothing'));
      say(t('assistant.content.intro'));
      askNext();
    });

  const skip = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askNext();
  };

  const saveField = (field: 'email' | 'city' | 'about', value: string) => {
    const ok = field === 'email' ? isEmail(value) : field === 'city' ? validCity(value) : validAbout(value);
    if (!ok) return say(t('assistant.flow.invalid'), { kind: 'kfield', field });
    const text = value.trim();
    const payload: UpdateStoreSettingsRequest =
      field === 'email' ? { contactEmail: text } : field === 'city' ? { contactCity: text } : { aboutText: text };
    void act(async () => {
      settings.current = await saveSettings(payload);
      invalidate();
      clearWidgets();
      echo(text);
      say(t(`assistant.content.${field}.saved`));
      askNext();
    });
  };

  const createPage = (id: 'faq' | 'contactPage') =>
    act(async () => {
      const s = settings.current;
      const tpl = id === 'faq' ? faqPage(lang, s ?? {}) : contactPage(lang);
      const page = await storePagesApi.create(tpl.meta);
      await storePagesApi.replaceBlocks(page.id as number, tpl.blocks, 'Assistant');
      invalidate();
      clearWidgets();
      echo(t('assistant.flow.yes'));
      say(t(`assistant.content.${id}.done`));
      askNext();
    });

  const onYesNo = (id: 'faq' | 'contactPage', yes: boolean) => (yes ? void createPage(id) : skip());

  const renderWidget = (w: ContentWidget): ReactNode => {
    if (w.kind === 'kyesno') {
      return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
    }
    const s = settings.current;
    return (
      <FieldWidget
        key={w.field}
        busy={busy}
        inputMode="text"
        multiline={w.field === 'about'}
        onSubmit={(v) => saveField(w.field, v)}
        onSkip={skip}
        placeholder={t(`assistant.content.${w.field}.placeholder`)}
        proposal={
          w.field === 'about' ? aboutProposal(lang, s?.siteName ?? '', s?.tagline, s?.contactCity) : undefined
        }
      />
    );
  };

  return { start, renderWidget };
}
