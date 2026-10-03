import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, Sparkles, Trash2, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assistantApi, type AssistantMessage } from '@/services/api/assistant';
import { platformApi } from '@/services/api/platform';
import { uploadImage } from '@/services/api/upload';
import {
  buildFlow,
  isPhone,
  parseAmount,
  widgetForStep,
  type FlowStepId,
  type FlowWidget,
} from '@/config/assistantFlow';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { useTenant } from '@/contexts/TenantContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { UpdateStoreSettingsRequest } from '@/types/api';
import {
  ColorsWidget,
  LinkWidget,
  TextWidget,
  UploadWidget,
  YesNoWidget,
} from './AssistantWidgets';

const STORAGE_KEY = 'troco_assistant_chat';
const MAX_INPUT = 1000;
const SETTINGS_KEY = ['store-settings', 'me'];

/** Entrée de la conversation : texte envoyé au modèle + éventuel outil affiché (jamais envoyé). */
type Entry = AssistantMessage & { widget?: FlowWidget };

/** Questions proposées selon l'écran ouvert (préfixe d'URL → clés de suggestions). */
const SUGGESTIONS: Record<string, AdminMessageKey[]> = {
  '/admin/dashboard': ['assistant.sug.dashboard1', 'assistant.sug.dashboard2'],
  '/admin/reglages': ['assistant.sug.settings1', 'assistant.sug.settings2'],
  '/admin/parametres': ['assistant.sug.appearance1', 'assistant.sug.appearance2'],
  '/admin/produits': ['assistant.sug.products1', 'assistant.sug.products2'],
  '/admin/commandes': ['assistant.sug.orders1'],
  '/admin/pages': ['assistant.sug.pages1'],
};
const DEFAULT_SUGGESTIONS: AdminMessageKey[] = ['assistant.sug.default1', 'assistant.sug.default2', 'assistant.sug.default3'];

function suggestionsFor(pathname: string): AdminMessageKey[] {
  const hit = Object.keys(SUGGESTIONS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return hit ? SUGGESTIONS[hit] : DEFAULT_SUGGESTIONS;
}

const ASK_KEY: Record<FlowStepId, AdminMessageKey> = {
  logo: 'assistant.flow.logo.ask',
  colors: 'assistant.flow.colors.ask',
  tagline: 'assistant.flow.tagline.ask',
  phone: 'assistant.flow.phone.ask',
  whatsapp: 'assistant.flow.whatsapp.ask',
  cod: 'assistant.flow.cod.ask',
  freeShipping: 'assistant.flow.shipping.ask',
  whatsappBusiness: 'assistant.flow.wab.ask',
};

function loadHistory(): Entry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is Entry =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    );
  } catch {
    return [];
  }
}

/** Les outils (widgets) ne sont pas conservés : une configuration interrompue se relance depuis le début. */
function saveHistory(entries: Entry[]) {
  try {
    const plain = entries.slice(-30).map(({ role, content }) => ({ role, content }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch {
    /* stockage indisponible : la conversation reste en mémoire */
  }
}

/** Transforme les adresses d'écrans admin (/admin/reglages) en liens cliquables. */
function linkify(text: string, onNavigate: () => void): ReactNode[] {
  return text.split(/(\/admin(?:\/[a-z0-9-]+)+)/g).map((part, i) =>
    /^\/admin(\/[a-z0-9-]+)+$/.test(part) ? (
      <Link
        key={i}
        to={part}
        onClick={onNavigate}
        className="font-medium text-primary underline underline-offset-2"
      >
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Assistant de configuration : bouton flottant + panneau de chat dans l'admin.
 * Il répond aux questions et peut mener une configuration guidée (il pose les questions et
 * affiche l'outil adapté). Les enregistrements passent par l'API existante, jamais par le modèle.
 */
export function AssistantChat() {
  const { pathname } = useLocation();
  const { t, locale, dir } = useAdminLocale();
  const { store, refresh: refreshTenant, loadFromAdminSession } = useTenant();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(loadHistory);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStepId | null>(null);
  const [busy, setBusy] = useState(false);
  const queue = useRef<FlowStepId[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: status } = useQuery({
    queryKey: ['assistant-status'],
    queryFn: assistantApi.status,
    staleTime: Infinity,
    retry: false,
  });

  const push = (...added: Entry[]) =>
    setEntries((prev) => {
      const next = [...prev, ...added];
      saveHistory(next);
      return next;
    });

  const clearWidgets = () => setEntries((prev) => prev.map((e) => (e.widget ? { ...e, widget: undefined } : e)));

  const chat = useMutation({
    mutationFn: (history: Entry[]) =>
      assistantApi.chat(
        history.map(({ role, content }) => ({ role, content })),
        pathname,
        locale,
        flowStep ?? undefined,
      ),
    onSuccess: ({ reply }) => push({ role: 'assistant', content: reply }),
    onError: (e: unknown) => {
      // apiRequest renvoie ce texte générique quand la réponse n'a pas de message exploitable
      // (ex. 504 HTML de nginx quand le modèle met trop de temps à répondre).
      const msg = e instanceof Error ? e.message : '';
      setError(!msg || msg === 'Une erreur est survenue' ? t('assistant.errorSlow') : msg);
    },
  });

  // Seul le dernier outil affiché reste actif (une question libre peut s'intercaler dans la conversation).
  let widgetIndex = -1;
  entries.forEach((e, i) => {
    if (e.widget) widgetIndex = i;
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' });
  }, [open, entries, chat.isPending]);

  if (!status?.enabled) return null;

  // ───────────── Configuration guidée ─────────────

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      setFlowStep(null);
      push({ role: 'assistant', content: t('assistant.flow.done') });
      return;
    }
    setFlowStep(next);
    push({ role: 'assistant', content: t(ASK_KEY[next]), widget: widgetForStep(next) });
  };

  const startFlow = async () => {
    setError(null);
    setBusy(true);
    try {
      const settings = await queryClient.fetchQuery({
        queryKey: SETTINGS_KEY,
        queryFn: () => platformApi.getMyStoreSettings(),
        staleTime: 0,
      });
      queue.current = buildFlow(settings, settings.planCode ?? store?.planCode);
      push(
        { role: 'user', content: t('assistant.flow.start') },
        { role: 'assistant', content: t('assistant.flow.intro') },
      );
      askNext();
    } catch {
      setError(t('assistant.flow.error'));
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async (payload: UpdateStoreSettingsRequest) => {
    const updated = await platformApi.updateMyStoreSettings(payload);
    queryClient.setQueryData(SETTINGS_KEY, updated);
    await refreshTenant();
    await loadFromAdminSession();
  };

  /** Enregistre la réponse puis passe à l'étape suivante ; en cas d'échec, redemande la même chose. */
  const answer = async (
    echo: string,
    retry: FlowWidget,
    save: () => Promise<void>,
    doneKey: AdminMessageKey,
  ) => {
    clearWidgets();
    push({ role: 'user', content: echo });
    setBusy(true);
    try {
      await save();
      push({ role: 'assistant', content: t(doneKey) });
      askNext();
    } catch {
      push({ role: 'assistant', content: t('assistant.flow.error'), widget: retry });
    } finally {
      setBusy(false);
    }
  };

  const skip = () => {
    clearWidgets();
    push({ role: 'user', content: t('assistant.flow.skip') });
    askNext();
  };

  const invalid = (widget: FlowWidget) => push({ role: 'assistant', content: t('assistant.flow.invalid'), widget });

  const onYes = (w: Extract<FlowWidget, { kind: 'yesno' }>) => {
    if (w.stepId === 'logo') {
      clearWidgets();
      push(
        { role: 'user', content: t('assistant.flow.yes') },
        { role: 'assistant', content: t('assistant.flow.logo.upload'), widget: { kind: 'upload', stepId: 'logo' } },
      );
    } else if (w.stepId === 'cod') {
      void answer(t('assistant.flow.yes'), w, () => saveSettings({ paymentCodEnabled: true }), 'assistant.flow.cod.done');
    } else if (w.stepId === 'whatsappBusiness') {
      clearWidgets();
      push(
        { role: 'user', content: t('assistant.flow.yes') },
        {
          role: 'assistant',
          content: t('assistant.flow.wab.hint'),
          widget: { kind: 'link', stepId: 'whatsappBusiness', href: '/admin/reglages' },
        },
      );
    }
  };

  const onText = (w: Extract<FlowWidget, { kind: 'text' }>, value: string) => {
    switch (w.stepId) {
      case 'tagline':
        return void answer(value, w, () => saveSettings({ tagline: value }), 'assistant.flow.saved');
      case 'phone':
        return isPhone(value)
          ? void answer(value, w, () => saveSettings({ contactPhone: value }), 'assistant.flow.saved')
          : invalid(w);
      case 'whatsapp':
        return isPhone(value)
          ? void answer(value, w, () => saveSettings({ contactWhatsapp: value }), 'assistant.flow.saved')
          : invalid(w);
      case 'freeShipping': {
        const amount = parseAmount(value);
        return amount !== null
          ? void answer(value, w, () => saveSettings({ freeShippingThreshold: amount }), 'assistant.flow.saved')
          : invalid(w);
      }
    }
  };

  const renderWidget = (w: FlowWidget): ReactNode => {
    switch (w.kind) {
      case 'yesno':
        return <YesNoWidget busy={busy} onYes={() => onYes(w)} onNo={skip} />;
      case 'upload':
        return (
          <UploadWidget
            busy={busy}
            onSkip={skip}
            onFile={(file) =>
              void answer(
                file.name,
                w,
                async () => saveSettings({ logoUrl: await uploadImage(file) }),
                'assistant.flow.logo.done',
              )
            }
          />
        );
      case 'colors':
        return (
          <ColorsWidget
            busy={busy}
            onSkip={skip}
            onApply={(primary, secondary) =>
              void answer(
                primary,
                w,
                () => saveSettings({ primaryColor: primary, secondaryColor: secondary }),
                'assistant.flow.colors.done',
              )
            }
          />
        );
      case 'text':
        return (
          <TextWidget
            key={`${w.stepId}-${entries.length}`}
            busy={busy}
            onSkip={skip}
            onSubmit={(value) => onText(w, value)}
            inputMode={w.stepId === 'phone' || w.stepId === 'whatsapp' ? 'tel' : w.stepId === 'freeShipping' ? 'decimal' : 'text'}
            placeholder={t(
              w.stepId === 'tagline'
                ? 'assistant.flow.tagline.placeholder'
                : w.stepId === 'freeShipping'
                  ? 'assistant.flow.shipping.placeholder'
                  : 'assistant.flow.phone.placeholder',
            )}
          />
        );
      case 'link':
        return <LinkWidget href={w.href} openLabel={t('assistant.flow.wab.open')} onContinue={() => { clearWidgets(); push({ role: 'user', content: t('assistant.flow.continue') }); askNext(); }} />;
    }
  };

  // ───────────── Conversation libre ─────────────

  const send = (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || chat.isPending) return;
    const next: Entry[] = [...entries, { role: 'user', content }];
    setEntries(next);
    saveHistory(next);
    setInput('');
    setError(null);
    chat.mutate(next);
  };

  const reset = () => {
    queue.current = [];
    setFlowStep(null);
    setEntries([]);
    setError(null);
    saveHistory([]);
  };

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('assistant.openAria')}
          className="fixed bottom-4 end-4 z-40 flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline">{t('assistant.fab')}</span>
        </button>
      ) : (
        <section
          role="dialog"
          aria-label={t('assistant.title')}
          dir={dir}
          className="fixed bottom-4 end-4 z-40 flex h-[min(34rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              {t('assistant.title')}
            </div>
            <div className="flex items-center gap-1">
              {entries.length > 0 ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={reset} aria-label={t('assistant.clear')} title={t('assistant.clear')}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} aria-label={t('assistant.close')}>
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm" aria-live="polite">
            {entries.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">{t('assistant.intro')}</p>
                <Button type="button" className="w-full justify-start" onClick={() => void startFlow()} disabled={busy}>
                  {busy ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : <Wand2 className="me-2 h-4 w-4" aria-hidden />}
                  {t('assistant.flow.start')}
                </Button>
                <div className="flex flex-col gap-2">
                  {suggestionsFor(pathname).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => send(t(key))}
                      className="rounded-lg border px-3 py-2 text-start text-sm transition hover:bg-primary/5"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              entries.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed',
                      m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}
                  >
                    {m.role === 'assistant' ? linkify(m.content, () => setOpen(false)) : m.content}
                    {i === widgetIndex && m.widget ? <div className="whitespace-normal">{renderWidget(m.widget)}</div> : null}
                  </div>
                </div>
              ))
            )}
            {chat.isPending ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t('assistant.thinking')}
              </div>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive">
                {error}
              </p>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-end gap-2 border-t p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={MAX_INPUT}
              rows={2}
              placeholder={t('assistant.placeholder')}
              aria-label={t('assistant.inputLabel')}
              className="min-h-[2.5rem] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || chat.isPending} aria-label={t('assistant.send')}>
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}

