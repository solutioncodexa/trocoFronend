import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assistantApi, type AssistantMessage } from '@/services/api/assistant';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';

const STORAGE_KEY = 'troco_assistant_chat';
const MAX_INPUT = 1000;

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

function loadHistory(): AssistantMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is AssistantMessage =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    );
  } catch {
    return [];
  }
}

function saveHistory(messages: AssistantMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
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
 * Conseiller en lecture seule — il explique, le commerçant agit.
 */
export function AssistantChat() {
  const { pathname } = useLocation();
  const { t, locale, dir } = useAdminLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: status } = useQuery({
    queryKey: ['assistant-status'],
    queryFn: assistantApi.status,
    staleTime: Infinity,
    retry: false,
  });

  const chat = useMutation({
    mutationFn: (history: AssistantMessage[]) => assistantApi.chat(history, pathname, locale),
    onSuccess: ({ reply }, history) => {
      const next: AssistantMessage[] = [...history, { role: 'assistant', content: reply }];
      setMessages(next);
      saveHistory(next);
    },
    onError: (e: unknown) => {
      // apiRequest renvoie ce texte générique quand la réponse n'a pas de message exploitable
      // (ex. 504 HTML de nginx quand le modèle met trop de temps à répondre).
      const msg = e instanceof Error ? e.message : '';
      setError(!msg || msg === 'Une erreur est survenue' ? t('assistant.errorSlow') : msg);
    },
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' });
  }, [open, messages, chat.isPending]);

  if (!status?.enabled) return null;

  const send = (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || chat.isPending) return;
    const next: AssistantMessage[] = [...messages, { role: 'user', content }];
    setMessages(next);
    saveHistory(next);
    setInput('');
    setError(null);
    chat.mutate(next);
  };

  const reset = () => {
    setMessages([]);
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
              {messages.length > 0 ? (
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
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">{t('assistant.intro')}</p>
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
              messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed',
                      m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}
                  >
                    {m.role === 'assistant' ? linkify(m.content, () => setOpen(false)) : m.content}
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
