import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assistantApi, type AssistantMessage } from '@/services/api/assistant';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'troco_assistant_chat';
const MAX_INPUT = 1000;

/** Questions proposées selon l'écran ouvert (préfixe d'URL → suggestions). */
const SUGGESTIONS: Record<string, string[]> = {
  '/admin/dashboard': ['Par où commencer pour ouvrir ma boutique ?', 'Que me reste-t-il à configurer ?'],
  '/admin/reglages': ['Comment activer le paiement à la livraison ?', 'Comment fixer un seuil de livraison gratuite ?'],
  '/admin/parametres': ['Comment changer les couleurs de ma boutique ?', 'Comment changer de style ?'],
  '/admin/produits': ['Comment ajouter mon premier produit ?', 'Comment apparaître sur Google ?'],
  '/admin/commandes': ['Comment prévenir un client que sa commande est expédiée ?'],
  '/admin/pages': ['Comment créer une page À propos ?'],
};
const DEFAULT_SUGGESTIONS = ['Comment changer mon logo ?', 'Comment configurer les paiements ?', 'Comment ajouter un produit ?'];

function suggestionsFor(pathname: string): string[] {
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
    mutationFn: (history: AssistantMessage[]) => assistantApi.chat(history, pathname),
    onSuccess: ({ reply }, history) => {
      const next: AssistantMessage[] = [...history, { role: 'assistant', content: reply }];
      setMessages(next);
      saveHistory(next);
    },
    onError: (e: unknown) => {
      setError(e instanceof Error ? e.message : 'L’assistant est momentanément indisponible.');
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
          aria-label="Ouvrir l’assistant de configuration"
          className="fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline">Besoin d’aide ?</span>
        </button>
      ) : (
        <section
          role="dialog"
          aria-label="Assistant de configuration"
          className="fixed bottom-4 right-4 z-40 flex h-[min(34rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              Assistant de configuration
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={reset} aria-label="Effacer la conversation" title="Effacer la conversation">
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} aria-label="Fermer l’assistant">
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm" aria-live="polite">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Posez-moi une question sur la configuration de votre boutique. Je vous explique comment faire, étape par étape.
                </p>
                <div className="flex flex-col gap-2">
                  {suggestionsFor(pathname).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-lg border px-3 py-2 text-left text-sm transition hover:bg-primary/5"
                    >
                      {q}
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
                L’assistant réfléchit…
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
              placeholder="Votre question…"
              aria-label="Votre question"
              className="min-h-[2.5rem] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || chat.isPending} aria-label="Envoyer">
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}
