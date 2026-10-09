import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Instagram, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import {
  instagramImportApi,
  type InstagramAccountPost,
  type InstagramImportItem,
} from '@/services/api/instagramImport';

const STATUS_KEY = ['instagram-import', 'oauth-status'] as const;
const RETURN_PATH = '/admin/produits/instagram';

/**
 * Connexion du compte Instagram de la boutique (OAuth officiel, lecture seule) : liste ses posts et en fait des
 * brouillons. C'est la voie fiable : lire un lien public échoue le plus souvent, Instagram l'interdit sans connexion.
 */
const InstagramAccountPanel = ({ onImported }: { onImported: (items: InstagramImportItem[]) => void }) => {
  const { t } = useAdminLocale();
  const queryClient = useQueryClient();
  const [posts, setPosts] = useState<InstagramAccountPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const { data: status } = useQuery({ queryKey: STATUS_KEY, queryFn: instagramImportApi.oauthStatus });

  // Retour d'Instagram : ?instagram=connected|denied|error, puis on nettoie l'adresse.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('instagram');
    if (!result) return;
    setMessage({
      text: result === 'connected' ? t('ig.oauth.done') : result === 'denied' ? t('ig.oauth.denied') : t('ig.oauth.error'),
      error: result !== 'connected',
    });
    params.delete('instagram');
    const rest = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''));
    void queryClient.invalidateQueries({ queryKey: STATUS_KEY });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fail = (e: unknown) => setMessage({ text: e instanceof Error && e.message ? e.message : t('ig.oauth.error'), error: true });

  const connect = useMutation({
    mutationFn: () => instagramImportApi.oauthAuthorizeUrl(window.location.origin + RETURN_PATH),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: fail,
  });

  const disconnect = useMutation({
    mutationFn: instagramImportApi.oauthDisconnect,
    onSuccess: () => {
      setPosts([]);
      setCursor(null);
      setLoaded(false);
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: STATUS_KEY });
    },
    onError: fail,
  });

  const load = useMutation({
    mutationFn: (after: string | null) => instagramImportApi.accountPosts(after),
    onSuccess: (page, after) => {
      setPosts((prev) => (after ? [...prev, ...page.items] : page.items));
      setCursor(page.nextCursor);
      setLoaded(true);
      setMessage(null);
    },
    onError: fail,
  });

  const importSelected = useMutation({
    mutationFn: () => instagramImportApi.importAccountPosts([...selected]),
    onSuccess: (items) => {
      const done = new Set(items.filter((i) => i.result !== 'INVALID').map((i) => i.source));
      setPosts((prev) => prev.map((p) => (done.has(p.id) ? { ...p, imported: true } : p)));
      setSelected(new Set());
      onImported(items);
    },
    onError: fail,
  });

  const toggle = (id: string, on: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <Instagram className="h-4 w-4" aria-hidden />
          {t('ig.oauth.title')}
        </h2>
        {status?.connected ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{t('ig.oauth.connectedAs', { user: status.username ?? '' })}</span>
            <Button type="button" size="sm" variant="outline" disabled={disconnect.isPending} onClick={() => disconnect.mutate()}>
              {t('ig.oauth.disconnect')}
            </Button>
          </div>
        ) : null}
      </div>

      {status && !status.configured ? (
        <p className="text-sm text-muted-foreground">{t('ig.oauth.notConfigured')}</p>
      ) : null}

      {status?.configured && !status.connected ? (
        <>
          <p className="text-sm text-muted-foreground">{t('ig.oauth.hint')}</p>
          <Button type="button" onClick={() => connect.mutate()} disabled={connect.isPending}>
            {connect.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            {t('ig.oauth.connect')}
          </Button>
        </>
      ) : null}

      {status?.connected ? (
        <>
          {!loaded ? (
            <Button type="button" variant="outline" onClick={() => load.mutate(null)} disabled={load.isPending}>
              {load.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
              {t('ig.oauth.load')}
            </Button>
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('ig.oauth.empty')}</p>
          ) : (
            <>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {posts.map((p) => (
                  <li key={p.id} className="relative overflow-hidden rounded-lg border border-border bg-muted">
                    <label className={p.imported ? 'cursor-not-allowed' : 'cursor-pointer'}>
                      <div className="aspect-square">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.caption?.slice(0, 60) ?? ''}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className={`h-full w-full object-cover ${p.imported ? 'opacity-40' : ''}`}
                          />
                        ) : null}
                      </div>
                      {p.imported ? (
                        <span className="absolute inset-x-0 bottom-0 bg-background/80 px-1 py-0.5 text-center text-[11px]">
                          {t('ig.oauth.imported')}
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          aria-label={t('ig.oauth.select')}
                          checked={selected.has(p.id)}
                          onChange={(e) => toggle(p.id, e.target.checked)}
                          className="absolute start-1.5 top-1.5 h-4 w-4"
                        />
                      )}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" disabled={selected.size === 0 || importSelected.isPending} onClick={() => importSelected.mutate()}>
                  {importSelected.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : null}
                  {t('ig.oauth.import', { n: selected.size })}
                </Button>
                {cursor ? (
                  <Button type="button" variant="outline" disabled={load.isPending} onClick={() => load.mutate(cursor)}>
                    {t('ig.oauth.more')}
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </>
      ) : null}

      {message ? (
        <p role={message.error ? 'alert' : 'status'} className={`text-sm ${message.error ? 'font-medium text-destructive' : ''}`}>
          {message.text}
        </p>
      ) : null}
    </section>
  );
};

export default InstagramAccountPanel;
