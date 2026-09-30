import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Gift,
  Headset,
  Heart,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeBlogApi } from '@/services/api/storeBlog';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useStoreLang } from '@/hooks/useStoreLang';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import type { StorePageBlock } from '@/types/store-pages';
import {
  alignClass,
  buttonInlineStyle,
  buttonSizeProp,
  columnsClass,
  maxWidthClass,
  mediaRadiusClass,
  paddingYClass,
  readBlockStyle,
  sectionInlineStyle,
} from '@/components/admin/page-builder/blockAppearance';
import { MOCK_INSTAGRAM } from '@/components/admin/page-builder/previewMocks';

/** Icônes proposées dans le bloc « Avantages » (clé stockée dans la config). */
export const FEATURE_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  truck: { label: 'Livraison', Icon: Truck },
  shield: { label: 'Sécurité', Icon: ShieldCheck },
  refresh: { label: 'Retours', Icon: RefreshCw },
  headset: { label: 'Support', Icon: Headset },
  gift: { label: 'Cadeau', Icon: Gift },
  sparkles: { label: 'Qualité', Icon: Sparkles },
  heart: { label: 'Coup de cœur', Icon: Heart },
  clock: { label: 'Rapidité', Icon: Clock },
};

function cfg(block: StorePageBlock) {
  return (block.config ?? {}) as Record<string, unknown>;
}

function str(v: unknown, fallback = '') {
  return typeof v === 'string' ? v : fallback;
}

function num(v: unknown, fallback: number) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function sectionClass(style: ReturnType<typeof readBlockStyle>, narrow?: 'md' | 'sm') {
  const maxWidth = narrow && style.maxWidth === 'lg' ? narrow : style.maxWidth;
  return cn('mx-auto px-4 sm:px-6', maxWidthClass(maxWidth), paddingYClass(style.paddingY), alignClass(style.align));
}

function SectionTitle({ title, textColor }: { title: string; textColor: string }) {
  if (!title) return null;
  return (
    <h2
      className="font-display text-2xl font-bold sm:text-3xl"
      style={textColor ? { color: textColor } : undefined}
    >
      {title}
    </h2>
  );
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

/** Bouton de lien : interne (avec préfixe démo) ou externe. */
function LinkButton({
  href,
  label,
  style,
}: {
  href: string;
  label: string;
  style: ReturnType<typeof readBlockStyle>;
}) {
  const { to } = useStorefrontPath();
  return (
    <Button
      asChild
      size={buttonSizeProp(style.buttonSize)}
      variant={style.buttonColor ? 'default' : 'secondary'}
      style={buttonInlineStyle(style.buttonColor)}
    >
      {isExternal(href) ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link to={to(href || '/')}>{label}</Link>
      )}
    </Button>
  );
}

export function FeaturesBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const style = readBlockStyle(c);
  const items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
  if (items.length === 0) return null;

  return (
    <section className={sectionClass(style)} style={sectionInlineStyle(style)}>
      <SectionTitle title={str(c.title)} textColor={style.textColor} />
      <ul className={cn('grid grid-cols-1 gap-8', columnsClass(style.columns), str(c.title) && 'mt-8')}>
        {items.map((item, i) => {
          const Icon = (FEATURE_ICONS[str(item.icon)] ?? FEATURE_ICONS.sparkles).Icon;
          return (
            <li key={i} className={cn('flex flex-col gap-3', alignClass(style.align))}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="font-display text-base font-semibold">{str(item.title)}</p>
                {str(item.text) ? (
                  <p
                    className={cn('mt-1 text-sm', !style.textColor && 'text-muted-foreground')}
                    style={style.textColor ? { color: style.textColor, opacity: 0.85 } : undefined}
                  >
                    {str(item.text)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function GalleryBlock({
  block,
  usePreviewMocks = false,
}: {
  block: StorePageBlock;
  usePreviewMocks?: boolean;
}) {
  const c = cfg(block);
  const style = readBlockStyle(c);
  let images = strList(c.images).filter(Boolean).map((u) => getImageUrl(u));
  if (images.length === 0 && usePreviewMocks) images = MOCK_INSTAGRAM.slice(0, 6);
  if (images.length === 0) return null;

  return (
    <section className={sectionClass(style)} style={sectionInlineStyle(style)}>
      <SectionTitle title={str(c.title)} textColor={style.textColor} />
      <div className={cn('grid grid-cols-2 gap-3', columnsClass(style.columns), str(c.title) && 'mt-6')}>
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={str(c.title) ? `${str(c.title)} ${i + 1}` : ''}
            loading="lazy"
            decoding="async"
            className={cn('aspect-square w-full object-cover', mediaRadiusClass(style.mediaRadius))}
          />
        ))}
      </div>
    </section>
  );
}

export function SplitBlock({ block }: { block: StorePageBlock }) {
  const c = cfg(block);
  const style = readBlockStyle(c);
  const imageUrl = str(c.imageUrl);
  const imageRight = str(c.imagePosition) === 'right';
  const ctaLabel = str(c.ctaLabel);

  return (
    <section className={sectionClass(style)} style={sectionInlineStyle(style)}>
      <div className={cn('grid items-center gap-8 md:grid-cols-2 md:gap-12', !imageUrl && 'md:grid-cols-1')}>
        {imageUrl ? (
          <img
            src={getImageUrl(imageUrl)}
            alt={str(c.title)}
            loading="lazy"
            decoding="async"
            className={cn(
              'aspect-[4/3] w-full object-cover',
              mediaRadiusClass(style.mediaRadius),
              imageRight && 'md:order-2',
            )}
          />
        ) : null}
        <div className="flex flex-col gap-4">
          <SectionTitle title={str(c.title)} textColor={style.textColor} />
          {str(c.body) ? (
            <p
              className={cn('whitespace-pre-wrap leading-relaxed', !style.textColor && 'text-muted-foreground')}
              style={style.textColor ? { color: style.textColor, opacity: 0.9 } : undefined}
            >
              {str(c.body)}
            </p>
          ) : null}
          {ctaLabel ? (
            <div>
              <LinkButton href={str(c.ctaHref, '/boutique')} label={ctaLabel} style={style} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function LogosBlock({
  block,
  usePreviewMocks = false,
}: {
  block: StorePageBlock;
  usePreviewMocks?: boolean;
}) {
  const c = cfg(block);
  const style = readBlockStyle(c);
  let images = strList(c.images).filter(Boolean).map((u) => getImageUrl(u));
  if (images.length === 0 && usePreviewMocks) images = MOCK_INSTAGRAM.slice(0, 4);
  if (images.length === 0) return null;

  return (
    <section className={sectionClass(style)} style={sectionInlineStyle(style)}>
      <SectionTitle title={str(c.title)} textColor={style.textColor} />
      <div className={cn('flex flex-wrap items-center gap-x-10 gap-y-6', str(c.title) && 'mt-6', justifyFor(style.align))}>
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-10 w-auto max-w-[9rem] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-12"
          />
        ))}
      </div>
    </section>
  );
}

function justifyFor(align: ReturnType<typeof readBlockStyle>['align']) {
  if (align === 'center') return 'justify-center';
  if (align === 'right') return 'justify-end';
  return 'justify-start';
}

export function BlogPostsBlock({
  block,
  usePreviewMocks = false,
}: {
  block: StorePageBlock;
  usePreviewMocks?: boolean;
}) {
  const c = cfg(block);
  const style = readBlockStyle(c);
  const { lang } = useStoreLang();
  const { to } = useStorefrontPath();
  const { t, locale } = useLocale();
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-GB' : 'fr-MA';
  const limit = Math.max(1, Math.min(num(c.limit, 3), 6));

  const { data: posts = [] } = useQuery({
    queryKey: ['store-blog', 'public', lang],
    queryFn: () => storeBlogApi.listPublic(lang),
    ...staticCatalogQueryOptions,
  });

  const shown = posts.slice(0, limit);
  if (shown.length === 0 && !usePreviewMocks) return null;

  return (
    <section className={sectionClass(style)} style={sectionInlineStyle(style)}>
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title={str(c.title)} textColor={style.textColor} />
        <Link to={to('/blog')} className="shrink-0 text-sm font-medium text-primary hover:underline">
          {t('seeAll')}
        </Link>
      </div>
      <div className="mt-6 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
        {shown.length > 0
          ? shown.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                {post.coverUrl ? (
                  <img
                    src={getImageUrl(post.coverUrl)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <div className="p-5">
                  {post.createdAt ? (
                    <time className="text-xs uppercase tracking-wider text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString(dateLocale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  ) : null}
                  <h3 className="mt-1 font-display text-lg font-semibold">
                    <Link className="hover:text-primary" to={to(`/blog/${post.slug}`)}>
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  ) : null}
                </div>
              </article>
            ))
          : [0, 1, 2].map((i) => (
              <article key={i} className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30">
                <div className="aspect-[16/10] w-full bg-muted" />
                <div className="space-y-2 p-5">
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
