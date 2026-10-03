import { useRef, type ReactNode } from 'react';
import { platformApi } from '@/services/api/platform';
import { storePagesApi } from '@/services/api/storePages';
import { createLegalPages } from '@/utils/legalPages';
import { PAGE_TEMPLATES } from '@/config/pageTemplates';
import type { DesignWidget } from '@/config/assistantFlow';
import {
  HEADER_LAYOUTS,
  buildDesignFlow,
  buildThemePayload,
  normalizeSocialUrl,
  patchAppearance,
  themeOptions,
  validPromoText,
  type DesignStepId,
  type SocialKind,
} from '@/config/designFlow';
import { THEME_LOOK_DEFAULTS, normalizeThemeKey, type StoreThemeKey } from '@/config/storeThemes';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { StoreSettingsDTO, UpdateStoreSettingsRequest } from '@/types/api';
import type { StorePageBlock, UpsertStorePagePayload } from '@/types/store-pages';
import type { Entry } from './assistantTypes';
import { YesNoWidget } from './AssistantWidgets';
import { FieldWidget } from './AssistantCatalogWidgets';
import { ChipsWidget, ThemePickWidget } from './AssistantDesignWidgets';

type Translate = (key: AdminMessageKey, vars?: Record<string, string | number>) => string;

type Ctx = {
  t: Translate;
  busy: boolean;
  setBusy: (b: boolean) => void;
  push: (...entries: Entry[]) => void;
  clearWidgets: () => void;
  /** Étape en cours, transmise au modèle pour qu'il reste dans le contexte (lettres uniquement). */
  setStep: (step: string | null) => void;
  planCode?: string | null;
  /** Enregistre des réglages et renvoie la version à jour (cache, thème et session sont rafraîchis). */
  saveSettings: (payload: UpdateStoreSettingsRequest) => Promise<StoreSettingsDTO>;
  invalidate: () => void;
};

const SOCIAL: SocialKind[] = ['instagram', 'facebook', 'tiktok'];

const ASK_YESNO: Record<'search' | 'promo' | 'home' | 'about' | 'legal', AdminMessageKey> = {
  search: 'assistant.design.search.ask',
  promo: 'assistant.design.promo.ask',
  home: 'assistant.design.home.ask',
  about: 'assistant.design.about.ask',
  legal: 'assistant.design.legal.ask',
};

/**
 * Conversation « personnalisation » : thème (selon le plan), en-tête, page d'accueil, À propos, pages légales,
 * réseaux sociaux. L'assistant pose les questions et propose des suggestions ; les enregistrements passent par
 * l'API existante, jamais par le modèle.
 */
export function useDesignFlow(ctx: Ctx) {
  const { t, busy, setBusy, push, clearWidgets, setStep, planCode, saveSettings, invalidate } = ctx;
  const settings = useRef<StoreSettingsDTO | null>(null);
  const queue = useRef<DesignStepId[]>([]);
  /** Pages déjà créées pendant cette conversation : un nouvel essai après un échec ne les recrée pas. */
  const createdPages = useRef<Record<string, number>>({});

  const say = (content: string, widget?: DesignWidget) => push({ role: 'assistant', content, widget });
  const echo = (content: string) => push({ role: 'user', content });

  /** Exécute une action ; en cas d'échec le widget reste affiché pour réessayer. */
  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message.slice(0, 160) : '';
      say(t('assistant.design.error', { msg }));
    } finally {
      setBusy(false);
    }
  };

  const save = async (payload: UpdateStoreSettingsRequest) => {
    const updated = await saveSettings(payload);
    settings.current = updated;
    invalidate();
    return updated;
  };

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setStep(null);
      say(t('assistant.design.done'));
      return;
    }
    setStep(`design${next.charAt(0).toUpperCase()}${next.slice(1)}`);
    if (next === 'theme') return say(t('assistant.design.theme.ask'), { kind: 'themePick' });
    if (next === 'layout') return say(t('assistant.design.layout.ask'), { kind: 'layoutPick' });
    if (next === 'instagram' || next === 'facebook' || next === 'tiktok') {
      return say(t(`assistant.design.social.${next}`), { kind: 'dfield', field: next });
    }
    return say(t(ASK_YESNO[next]), { kind: 'dyesno', id: next });
  };

  const start = () =>
    act(async () => {
      const [current, pages] = await Promise.all([platformApi.getMyStoreSettings(), storePagesApi.list()]);
      settings.current = current;
      queue.current = buildDesignFlow(current, pages);
      createdPages.current = {};
      echo(t('assistant.design.start'));
      say(t('assistant.design.intro'));
      askNext();
    });

  const skip = () => {
    clearWidgets();
    echo(t('assistant.flow.skip'));
    askNext();
  };

  // ───────────── Thème ─────────────

  const onTheme = (key: StoreThemeKey) => {
    const name = t(`assistant.design.theme.${key}`);
    const option = themeOptions(planCode, settings.current?.themeKey).find((o) => o.key === key);
    if (option?.locked) {
      say(t('assistant.design.theme.locked'));
      return;
    }
    if (normalizeThemeKey(settings.current?.themeKey) === key) {
      clearWidgets();
      echo(name);
      say(t('assistant.design.theme.same', { name }));
      askNext();
      return;
    }
    void act(async () => {
      const hadPreset = Boolean(settings.current?.themePresets?.[key]);
      let updated = await save(buildThemePayload(key, hadPreset));
      const look = THEME_LOOK_DEFAULTS[key];
      // Même garde-fou que la page Réglages : si le serveur n'a pas initialisé le look du thème, on le renvoie.
      if (!hadPreset && (updated.primaryColor ?? '').toUpperCase() !== look.primaryColor.toUpperCase()) {
        const { themeKey: _ignored, ...lookOnly } = buildThemePayload(key, false);
        void _ignored;
        updated = await save(lookOnly);
      }
      clearWidgets();
      echo(name);
      say(t('assistant.design.theme.done', { name }));
      askNext();
    });
  };

  // ───────────── En-tête ─────────────

  const onLayout = (id: string) => {
    const layout = HEADER_LAYOUTS.find((l) => l === id);
    if (!layout) return;
    void act(async () => {
      await save({ appearance: patchAppearance(settings.current?.appearance, { headerLayout: layout }) });
      clearWidgets();
      echo(t(`assistant.design.layout.${layout}`));
      say(t('assistant.design.layout.done'));
      askNext();
    });
  };

  // ───────────── Pages ─────────────

  const createPageFromTemplate = async (key: string) => {
    const tpl = PAGE_TEMPLATES.find((p) => p.key === key);
    if (!tpl) throw new Error('Modèle introuvable');
    let id = createdPages.current[key];
    if (id === undefined) {
      const meta: UpsertStorePagePayload = { ...tpl.meta, published: true };
      id = (await storePagesApi.create(meta)).id;
      createdPages.current[key] = id;
    }
    await storePagesApi.replaceBlocks(id, tpl.blocks as StorePageBlock[], 'Assistant de configuration');
  };

  const onYesNo = (id: 'search' | 'promo' | 'home' | 'about' | 'legal', yes: boolean) => {
    const answer = t(yes ? 'assistant.flow.yes' : 'assistant.flow.no');
    const done = (message?: string) => {
      clearWidgets();
      echo(answer);
      if (message) say(message);
      askNext();
    };

    if (!yes && id !== 'search') return done();

    switch (id) {
      case 'search':
        return void act(async () => {
          await save({ appearance: patchAppearance(settings.current?.appearance, { headerShowSearch: yes }) });
          done(t('assistant.design.search.done'));
        });
      case 'promo':
        clearWidgets();
        echo(answer);
        return say(t('assistant.design.promo.text'), { kind: 'dfield', field: 'promo' });
      case 'home':
        return void act(async () => {
          await createPageFromTemplate('home-complete');
          invalidate();
          done(t('assistant.design.home.done'));
        });
      case 'about':
        return void act(async () => {
          await createPageFromTemplate('a-propos');
          invalidate();
          done(t('assistant.design.about.done'));
        });
      case 'legal':
        return void act(async () => {
          const s = settings.current;
          const created = await createLegalPages({
            storeName: s?.siteName ?? '',
            contactEmail: s?.contactEmail ?? undefined,
            contactPhone: s?.contactPhone ?? undefined,
            contactCity: s?.contactCity ?? undefined,
          });
          invalidate();
          done(created.length ? t('assistant.design.legal.done', { n: created.length }) : t('assistant.flow.saved'));
        });
    }
  };

  // ───────────── Saisies ─────────────

  const onField = (field: 'promo' | 'instagram' | 'facebook' | 'tiktok', value: string) => {
    const invalid = () => say(t('assistant.flow.invalid'));
    if (field === 'promo') {
      if (!validPromoText(value)) return invalid();
      return void act(async () => {
        await save({
          appearance: patchAppearance(settings.current?.appearance, {
            headerPromoEnabled: true,
            headerPromoText: value.trim(),
          }),
        });
        clearWidgets();
        echo(value);
        say(t('assistant.design.promo.done'));
        askNext();
      });
    }
    const url = normalizeSocialUrl(field, value);
    if (!url) return invalid();
    const payload: UpdateStoreSettingsRequest =
      field === 'instagram' ? { instagramUrl: url } : field === 'facebook' ? { facebookUrl: url } : { tiktokUrl: url };
    void act(async () => {
      await save(payload);
      clearWidgets();
      echo(url);
      say(t('assistant.flow.saved'));
      askNext();
    });
  };

  const renderWidget = (w: DesignWidget): ReactNode => {
    switch (w.kind) {
      case 'themePick':
        return <ThemePickWidget busy={busy} options={themeOptions(planCode, settings.current?.themeKey)} onPick={onTheme} />;
      case 'layoutPick':
        return (
          <ChipsWidget
            busy={busy}
            options={HEADER_LAYOUTS.map((l) => ({ id: l, label: t(`assistant.design.layout.${l}`) }))}
            onPick={onLayout}
          />
        );
      case 'dyesno':
        return <YesNoWidget busy={busy} onYes={() => onYesNo(w.id, true)} onNo={() => onYesNo(w.id, false)} />;
      case 'dfield':
        return (
          <FieldWidget
            key={w.field}
            busy={busy}
            inputMode="text"
            onSkip={skip}
            onSubmit={(value) => onField(w.field, value)}
            suggestions={
              w.field === 'promo'
                ? [t('assistant.design.promo.s1'), t('assistant.design.promo.s2'), t('assistant.design.promo.s3')]
                : undefined
            }
            placeholder={
              w.field === 'promo'
                ? t('assistant.design.promo.placeholder')
                : t(`assistant.design.social.placeholder.${w.field}`)
            }
          />
        );
    }
  };

  return { start, renderWidget, socialKinds: SOCIAL };
}
