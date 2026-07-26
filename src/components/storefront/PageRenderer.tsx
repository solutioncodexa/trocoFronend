import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatPrice';
import { productsApi, categoriesApi } from '@/services/api';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { getImageUrl } from '@/services/api/upload';
import { storePagesApi } from '@/services/api/storePages';
import { storeLeadsApi } from '@/services/api/storeLeads';
import type { StoreLeadType } from '@/types/store-leads';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import type { StorePage, StorePageBlock } from '@/types/store-pages';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function cfg(block: StorePageBlock) {
  return (block.config ?? {}) as Record<string, unknown>;
}

function str(v: unknown, fallback = '') {
  return typeof v === 'string' ? v : fallback;
}

function num(v: unknown, fallback: number) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function visibilityClass(block: StorePageBlock) {
  const m = block.visibleMobile !== false;
  const d = block.visibleDesktop !== false;
  if (m && d) return '';
  if (!m && !d) return 'hidden';
  if (!m) return 'hidden md:block';
  return 'md:hidden';
}

function trackMeta(page: StorePage): Record<string, unknown> | undefined {
  const v = page.abVariant?.toUpperCase();
  if (v === 'A' || v === 'B') return { abVariant: v };
  return undefined;
}

function trackCta(pageId: number | undefined, label: string, href: string, page?: StorePage) {
  const meta: Record<string, unknown> = { label, href };
  const ab = page?.abVariant?.toUpperCase();
  if (ab === 'A' || ab === 'B') meta.abVariant = ab;
  void storePagesApi.track({
    pageId,
    eventType: 'cta_click',
    path: window.location.pathname,
    meta,
  });
}

export function PageRenderer({ page }: { page: StorePage }) {
  const blocks = useMemo(
    () => [...(page.blocks ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [page.blocks],
  );

  const firstHeroIndex = useMemo(() => blocks.findIndex((b) => b.type === 'hero'), [blocks]);
  const firstHeroUrl = useMemo(() => {
    if (firstHeroIndex < 0) return null;
    const raw = str(cfg(blocks[firstHeroIndex]).imageUrl);
    return raw ? getImageUrl(raw) : null;
  }, [blocks, firstHeroIndex]);
  usePreloadImage(firstHeroUrl);

  useEffect(() => {
    if (!page.id) return;
    const meta = trackMeta(page);
    void storePagesApi.track({
      pageId: page.id,
      eventType: 'view',
      path: window.location.pathname,
      ...(meta ? { meta } : {}),
    });
  }, [page.id, page.abVariant]);

  return (
    <div className="store-page-builder">
      {blocks.map((block, i) => (
        <div key={block.id ?? `${block.type}-${i}`} className={visibilityClass(block)}>
          <BlockView
            block={block}
            page={page}
            pageId={page.id}
            isLcpHero={i === firstHeroIndex}
          />
        </div>
      ))}
      {blocks.length === 0 ? (
        <div className="mx-auto max-w-xl px-4 py-20 text-center text-muted-foreground">
          Cette page n’a pas encore de composants.
        </div>
      ) : null}
    </div>
  );
}

function BlockView({
  block,
  page,
  pageId,
  isLcpHero,
}: {
  block: StorePageBlock;
  page: StorePage;
  pageId?: number;
  isLcpHero?: boolean;
}) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} page={page} pageId={pageId} priority={!!isLcpHero} />;
    case 'rich_text':
      return <RichTextBlock block={block} />;
    case 'products':
      return <ProductsBlock block={block} />;
    case 'categories':
      return <CategoriesBlock block={block} />;
    case 'cta':
      return <CtaBlock block={block} page={page} pageId={pageId} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'faq':
      return <FaqBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    case 'contact':
      return <ContactBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'testimonials':
      return <TestimonialsBlock block={block} />;
    case 'countdown':
      return <CountdownBlock block={block} page={page} pageId={pageId} />;
    case 'instagram':
      return <InstagramBlock block={block} />;
    default:
      return null;
  }
}

function HeroBlock({
  block,
  page,
  pageId,
  priority,
}: {
  block: StorePageBlock;
  page: StorePage;
  pageId?: number;
  priority?: boolean;
}) {
  const { to } = useStorefrontPath();
  const c = cfg(block);
  const imageUrl = str(c.imageUrl);
  const href = str(c.ctaHref, '/boutique');

  return (
    <section className="relative min-h-[min(70dvh,560px)] overflow-hidden">
      {imageUrl ? (
        <img
          src={getImageUrl(imageUrl)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 20% 20%, hsl(var(--primary) / 0.28), transparent 55%), linear-gradient(165deg, hsl(var(--background)), hsl(var(--muted)))',
          }}
        />
      )}
      {imageUrl ? (
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      ) : null}
      <div className="relative mx-auto flex min-h-[min(70dvh,560px)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {str(c.headline, 'Bienvenue')}
        </h1>
        <p className="mt-4 max-w-lg text-muted-foreground">{str(c.subtext)}</p>
        {str(c.ctaLabel) ? (
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              onClick={() => trackCta(pageId, str(c.ctaLabel), href, page)}
            >
              <Link to={to(href)}>{str(c.ctaLabel)}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RichTextBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {str(c.title) ? (
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{str(c.title)}</h2>
      ) : null}
      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">{str(c.body)}</p>
    </section>
  );
}

function ProductsBlock({ block }: { block: StorePageBlock }) {
  const { to } = useStorefrontPath();
  const c = cfg(block);
  const limit = num(c.limit, 8);
  const { data } = useQuery({
    queryKey: ['products', 'page-block', limit],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: limit }),
    ...staticCatalogQueryOptions,
  });
  const products = mapProductListItemListToProducts(data?.content ?? []).slice(0, limit);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{str(c.title, 'Produits')}</h2>
        <Link to={to('/boutique')} className="text-sm font-medium text-primary hover:underline">
          Tout voir
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link key={p.id} to={to(`/produit/${p.id}`)} className="group block">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img
                src={p.images[0]}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 font-display font-semibold">{p.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CategoriesBlock({ block }: { block: StorePageBlock }) {
  const { to } = useStorefrontPath();
  const c = cfg(block);
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'page-block'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });
  const roots = categories.filter((x) => !x.parentId).slice(0, 8);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">{str(c.title, 'Catégories')}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roots.map((cat) => (
          <Link
            key={cat.id}
            to={to(`/boutique?category=${encodeURIComponent(cat.slug)}`)}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
          >
            {cat.heroImageUrl ? (
              <img
                src={getImageUrl(cat.heroImageUrl)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="font-display text-lg font-semibold">{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CtaBlock({
  block,
  page,
  pageId,
}: {
  block: StorePageBlock;
  page: StorePage;
  pageId?: number;
}) {
  const { to } = useStorefrontPath();
  const c = cfg(block);
  const href = str(c.ctaHref, '/contact');
  return (
    <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{str(c.title)}</h2>
          <p className="mt-2 text-primary-foreground/85">{str(c.body)}</p>
        </div>
        {str(c.ctaLabel) ? (
          <Button
            size="lg"
            variant="secondary"
            asChild
            onClick={() => trackCta(pageId, str(c.ctaLabel), href, page)}
          >
            <Link to={to(href)}>{str(c.ctaLabel)}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function ImageBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const imageUrl = str(c.imageUrl);
  if (!imageUrl) return null;
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <img
        src={getImageUrl(imageUrl)}
        alt={str(c.alt)}
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl object-cover"
      />
      {str(c.caption) ? (
        <p className="mt-3 text-center text-sm text-muted-foreground">{str(c.caption)}</p>
      ) : null}
    </section>
  );
}

function FaqBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const items = Array.isArray(c.items) ? (c.items as { q?: string; a?: string }[]) : [];
  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h2 className="mb-6 font-display text-2xl font-bold">{str(c.title, 'FAQ')}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer font-display font-semibold">{item.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SpacerBlock({ block }: { block: StorePageBlock }) {
  const size = str(cfg(block).size, 'md');
  return (
    <div
      className={cn(
        size === 'sm' && 'h-6',
        size === 'lg' && 'h-24',
        (size === 'md' || !['sm', 'lg'].includes(size)) && 'h-12',
      )}
      aria-hidden
    />
  );
}

function ContactBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const rawType = str(c.leadType, 'lead');
  const leadType = (['newsletter', 'lead', 'devis'].includes(rawType) ? rawType : 'lead') as StoreLeadType;
  const isNewsletter = leadType === 'newsletter';
  const isDevis = leadType === 'devis';
  const [submitting, setSubmitting] = useState(false);

  return (
    <section className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h2 className="font-display text-2xl font-bold">{str(c.title, 'Contact')}</h2>
      <p className="mt-2 text-muted-foreground">{str(c.body)}</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get('email') ?? '').trim();
          const fullName = String(fd.get('fullName') ?? '').trim();
          const phone = String(fd.get('phone') ?? '').trim();
          const message = String(fd.get('message') ?? '').trim();
          if (!email && !isNewsletter) {
            toast.error('Email requis');
            return;
          }
          if (isNewsletter && !email) {
            toast.error('Email requis');
            return;
          }
          setSubmitting(true);
          void storeLeadsApi
            .submitPublic({
              leadType,
              fullName: fullName || undefined,
              email: email || undefined,
              phone: phone || undefined,
              message: message || undefined,
              sourcePath: window.location.pathname,
            })
            .then(() => {
              toast.success(
                isNewsletter
                  ? 'Inscription enregistrée'
                  : isDevis
                    ? 'Demande de devis envoyée'
                    : 'Message envoyé',
              );
              e.currentTarget.reset();
            })
            .catch(() => toast.error('Envoi impossible, réessayez plus tard'))
            .finally(() => setSubmitting(false));
        }}
      >
        {!isNewsletter ? (
          <input
            name="fullName"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            placeholder="Nom"
            required={!isNewsletter}
          />
        ) : null}
        <input
          name="email"
          type="email"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
          placeholder="Email"
          required
        />
        {isDevis ? (
          <input
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            placeholder="Téléphone"
          />
        ) : null}
        {!isNewsletter ? (
          <textarea
            name="message"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            rows={4}
            placeholder={isDevis ? 'Décrivez votre projet…' : 'Message'}
            required={leadType === 'lead'}
          />
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting
            ? 'Envoi…'
            : isNewsletter
              ? "S'inscrire"
              : isDevis
                ? 'Demander un devis'
                : 'Envoyer'}
        </Button>
      </form>
    </section>
  );
}

function embedUrl(raw: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  if (/\.(mp4|webm)(\?|$)/i.test(raw)) return raw;
  return null;
}

function VideoBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const url = str(c.url);
  const embed = embedUrl(url);
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      {str(c.title) ? (
        <h2 className="mb-6 text-center font-display text-2xl font-bold">{str(c.title)}</h2>
      ) : null}
      {embed && embed.includes('embed') ? (
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe title={str(c.title, 'Vidéo')} src={embed} className="h-full w-full" allowFullScreen />
        </div>
      ) : embed ? (
        <video src={embed} controls className="w-full rounded-2xl" />
      ) : (
        <p className="text-center text-sm text-muted-foreground">URL vidéo invalide</p>
      )}
    </section>
  );
}

function TestimonialsBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const items = Array.isArray(c.items)
    ? (c.items as { name?: string; text?: string; role?: string }[])
    : [];
  return (
    <section className="bg-muted/30 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">{str(c.title, 'Témoignages')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <blockquote key={i} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">“{item.text}”</p>
              <footer className="mt-4 font-display text-sm font-semibold">
                {item.name}
                {item.role ? (
                  <span className="font-normal text-muted-foreground"> — {item.role}</span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountdownBlock({
  block,
  page,
  pageId,
}: {
  block: StorePageBlock;
  page: StorePage;
  pageId?: number;
}) {
  const { to } = useStorefrontPath();
  const c = cfg(block);
  const endsAt = str(c.endsAt);
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });

  useEffect(() => {
    const tick = () => {
      const end = new Date(endsAt).getTime();
      const diff = end - Date.now();
      if (!Number.isFinite(end) || diff <= 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0, done: true });
        return;
      }
      const s = Math.floor(diff / 1000);
      setLeft({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
        done: false,
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const href = str(c.ctaHref, '/boutique');
  return (
    <section className="border-y border-border bg-card px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold">{str(c.title, 'Offre limitée')}</h2>
        <p className="mt-2 text-muted-foreground">{str(c.subtitle)}</p>
        <div className="mt-6 flex justify-center gap-3 font-display text-2xl font-bold sm:gap-4 sm:text-3xl">
          {[
            ['J', left.d],
            ['H', left.h],
            ['M', left.m],
            ['S', left.s],
          ].map(([label, val]) => (
            <div key={String(label)} className="min-w-[4rem] rounded-xl border border-border bg-background px-3 py-2">
              <div>{String(val).padStart(2, '0')}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
        {left.done ? (
          <p className="mt-4 text-sm text-muted-foreground">Offre terminée</p>
        ) : str(c.ctaLabel) ? (
          <Button
            className="mt-6"
            asChild
            onClick={() => trackCta(pageId, str(c.ctaLabel), href, page)}
          >
            <Link to={to(href)}>{str(c.ctaLabel)}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function InstagramBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const images = Array.isArray(c.images) ? (c.images as string[]).filter(Boolean) : [];
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold">{str(c.title, 'Instagram')}</h2>
        {str(c.handle) ? (
          <p className="mt-1 text-sm text-muted-foreground">@{str(c.handle)}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-xl bg-muted">
            <img src={getImageUrl(src)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
