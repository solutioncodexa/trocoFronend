import { cn } from '@/lib/utils';
import type {
  CartDensityKey,
  CartEmptyStyleKey,
  CheckoutLayoutKey,
  CheckoutSummaryPositionKey,
  FooterLayoutKey,
  FormsLayoutKey,
  HeaderLayoutKey,
  HeroStyleKey,
  ProductGalleryLayoutKey,
  ShopFilterLayoutKey,
} from '@/config/storeAppearance';

/** Mini wireframe pour choisir un layout hero (style Shopify). */
export function HeroLayoutSketch({
  style,
  className,
}: {
  style: HeroStyleKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/30 p-1.5',
        className,
      )}
      aria-hidden
    >
      {style === 'fullbleed' ? (
        <div className="relative flex h-14 items-end rounded-sm bg-gradient-to-br from-sky-500/50 to-emerald-500/30 p-1.5">
          <div className="space-y-0.5">
            <div className="h-1 w-10 rounded-full bg-white/90" />
            <div className="h-1 w-14 rounded-full bg-white/70" />
            <div className="mt-1 h-2 w-8 rounded-sm bg-white" />
          </div>
        </div>
      ) : null}
      {style === 'split' ? (
        <div className="grid h-14 grid-cols-2 gap-1">
          <div className="flex flex-col justify-center gap-0.5 p-1">
            <div className="h-1 w-8 rounded-full bg-foreground/70" />
            <div className="h-1 w-12 rounded-full bg-foreground/40" />
            <div className="mt-1 h-2 w-7 rounded-sm bg-sky-500/80" />
          </div>
          <div className="rounded-sm bg-gradient-to-br from-sky-500/40 to-muted" />
        </div>
      ) : null}
      {style === 'minimal' ? (
        <div className="flex h-14 flex-col items-center justify-center gap-1">
          <div className="h-1 w-6 rounded-full bg-sky-600/70" />
          <div className="h-1.5 w-16 rounded-full bg-foreground/70" />
          <div className="mt-0.5 h-2 w-8 rounded-sm bg-sky-500/70" />
        </div>
      ) : null}
      {style === 'banner' ? (
        <div className="flex h-14 flex-col justify-end">
          <div className="flex h-8 items-center gap-2 rounded-sm bg-gradient-to-r from-sky-500/35 to-transparent px-1.5">
            <div className="space-y-0.5">
              <div className="h-1 w-14 rounded-full bg-foreground/60" />
              <div className="h-2 w-7 rounded-sm bg-sky-500/80" />
            </div>
          </div>
        </div>
      ) : null}
      {style === 'stacked' ? (
        <div className="flex h-14 flex-col gap-1">
          <div className="h-7 rounded-sm bg-gradient-to-br from-sky-500/45 to-muted" />
          <div className="flex flex-col items-center gap-0.5 px-2">
            <div className="h-1 w-12 rounded-full bg-foreground/60" />
            <div className="h-1.5 w-6 rounded-sm bg-sky-500/80" />
          </div>
        </div>
      ) : null}
      {style === 'overlay' ? (
        <div className="relative flex h-14 items-center justify-center rounded-sm bg-gradient-to-br from-sky-600/55 to-emerald-600/35">
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative space-y-0.5 text-center">
            <div className="mx-auto h-1 w-10 rounded-full bg-white/90" />
            <div className="mx-auto h-1 w-14 rounded-full bg-white/70" />
            <div className="mx-auto mt-1 h-2 w-8 rounded-sm bg-white" />
          </div>
        </div>
      ) : null}
      {style === 'asymmetric' ? (
        <div className="relative h-14">
          <div className="absolute right-0 top-0 h-12 w-[55%] rounded-sm bg-gradient-to-br from-sky-500/40 to-muted" />
          <div className="absolute bottom-0 left-0 space-y-0.5 p-1">
            <div className="h-1 w-10 rounded-full bg-foreground/70" />
            <div className="h-1 w-14 rounded-full bg-foreground/40" />
            <div className="mt-1 h-2 w-7 rounded-sm bg-sky-500/80" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Mini wireframe pour disposition footer. */
export function FooterLayoutSketch({
  layout,
  className,
}: {
  layout: FooterLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'default' ? (
        <div className="grid h-12 grid-cols-3 gap-1.5">
          <div className="space-y-1">
            <div className="h-1.5 w-8 rounded-full bg-foreground/60" />
            <div className="h-1 w-10 rounded-full bg-foreground/25" />
            <div className="h-1 w-6 rounded-full bg-foreground/20" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-6 rounded-full bg-foreground/50" />
            <div className="h-1 w-8 rounded-full bg-foreground/20" />
            <div className="h-1 w-7 rounded-full bg-foreground/20" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-7 rounded-full bg-foreground/50" />
            <div className="h-3 rounded-sm border border-border/80 bg-background/80" />
          </div>
        </div>
      ) : null}
      {layout === 'compact' ? (
        <div className="flex h-12 items-center gap-2">
          <div className="h-1.5 w-8 rounded-full bg-foreground/55" />
          <div className="h-1 flex-1 rounded-full bg-foreground/20" />
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-foreground/30" />
            <div className="h-2 w-2 rounded-full bg-foreground/30" />
          </div>
        </div>
      ) : null}
      {layout === 'links_only' ? (
        <div className="grid h-12 grid-cols-2 gap-3 px-1">
          <div className="space-y-1 self-center">
            <div className="h-1 w-8 rounded-full bg-foreground/45" />
            <div className="h-1 w-10 rounded-full bg-foreground/20" />
            <div className="h-1 w-7 rounded-full bg-foreground/20" />
          </div>
          <div className="space-y-1 self-center">
            <div className="h-1 w-8 rounded-full bg-foreground/45" />
            <div className="h-1 w-9 rounded-full bg-foreground/20" />
            <div className="h-1 w-6 rounded-full bg-foreground/20" />
          </div>
        </div>
      ) : null}
      {layout === 'centered' ? (
        <div className="flex h-12 flex-col items-center justify-center gap-1">
          <div className="h-1.5 w-10 rounded-full bg-foreground/55" />
          <div className="flex gap-1.5">
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-foreground/30" />
            <div className="h-2 w-2 rounded-full bg-foreground/30" />
          </div>
        </div>
      ) : null}
      {layout === 'stacked' ? (
        <div className="flex h-12 flex-col justify-center gap-1 px-1">
          <div className="h-1.5 w-12 rounded-full bg-foreground/55" />
          <div className="h-1 w-full rounded-full bg-foreground/20" />
          <div className="h-1 w-[80%] rounded-full bg-foreground/20" />
          <div className="h-1 w-[60%] rounded-full bg-foreground/20" />
        </div>
      ) : null}
    </div>
  );
}

export function HeaderLayoutSketch({
  layout,
  className,
}: {
  layout: HeaderLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'inline' ? (
        <div className="flex h-10 items-center justify-between gap-2 px-1">
          <div className="h-2.5 w-8 rounded-sm bg-foreground/50" />
          <div className="flex gap-1">
            <div className="h-1 w-5 rounded-full bg-foreground/25" />
            <div className="h-1 w-5 rounded-full bg-foreground/25" />
            <div className="h-1 w-5 rounded-full bg-foreground/25" />
          </div>
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-sky-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-sky-500/50" />
          </div>
        </div>
      ) : null}
      {layout === 'centered' ? (
        <div className="flex h-12 flex-col items-center justify-center gap-1.5">
          <div className="h-2.5 w-10 rounded-sm bg-foreground/50" />
          <div className="flex gap-1.5">
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
            <div className="h-1 w-6 rounded-full bg-foreground/25" />
          </div>
        </div>
      ) : null}
      {layout === 'stacked' ? (
        <div className="flex h-12 flex-col justify-center gap-1 px-1">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-8 rounded-sm bg-foreground/50" />
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-sky-500/50" />
              <div className="h-2 w-2 rounded-full bg-sky-500/50" />
            </div>
          </div>
          <div className="h-2 w-full rounded-sm bg-foreground/15" />
        </div>
      ) : null}
    </div>
  );
}

export function CartDensitySketch({
  density,
  className,
}: {
  density: CartDensityKey;
  className?: string;
}) {
  const gap = density === 'compact' ? 'gap-0.5' : density === 'spacious' ? 'gap-2' : 'gap-1';
  const pad = density === 'compact' ? 'p-1' : density === 'spacious' ? 'p-2' : 'p-1.5';
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25',
        pad,
        className,
      )}
      aria-hidden
    >
      <div className={cn('flex flex-col', gap)}>
        {[0, 1].map((i) => (
          <div key={i} className={cn('flex items-center gap-1.5 rounded-sm border border-border/50 bg-background', pad)}>
            <div className="h-5 w-5 shrink-0 rounded-sm bg-sky-500/30" />
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="h-1 w-[70%] rounded-full bg-foreground/40" />
              <div className="h-1 w-[40%] rounded-full bg-foreground/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CartEmptySketch({
  style,
  className,
}: {
  style: CartEmptyStyleKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-border/70',
        style === 'branded' ? 'bg-sky-500/15' : 'bg-muted/25',
        className,
      )}
      aria-hidden
    >
      {style === 'illustrated' ? (
        <div className="h-4 w-8 rounded-sm bg-gradient-to-br from-sky-500/40 to-muted" />
      ) : (
        <div className="h-3 w-3 rounded-full border-2 border-foreground/30" />
      )}
      <div className="h-1 w-10 rounded-full bg-foreground/40" />
      <div className="h-2 w-8 rounded-sm bg-sky-500/70" />
    </div>
  );
}

export function CheckoutLayoutSketch({
  layout,
  className,
}: {
  layout: CheckoutLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'single' ? (
        <div className="grid h-14 grid-cols-3 gap-1">
          <div className="col-span-2 space-y-1 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="h-1 w-[80%] rounded-full bg-foreground/20" />
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="mt-1 h-2 w-full rounded-sm bg-sky-500/70" />
          </div>
          <div className="space-y-1 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/30" />
            <div className="h-1 w-[70%] rounded-full bg-foreground/20" />
          </div>
        </div>
      ) : (
        <div className="flex h-14 flex-col gap-1">
          <div className="flex gap-1 px-1">
            <div className="h-1.5 flex-1 rounded-full bg-sky-500/80" />
            <div className="h-1.5 flex-1 rounded-full bg-foreground/15" />
          </div>
          <div className="flex-1 space-y-1 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="h-1 w-[75%] rounded-full bg-foreground/20" />
            <div className="mt-auto h-2 w-full rounded-sm bg-sky-500/70" />
          </div>
        </div>
      )}
    </div>
  );
}

export function CheckoutSummaryPositionSketch({
  position,
  className,
}: {
  position: CheckoutSummaryPositionKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {position === 'bottom' ? (
        <div className="flex h-14 flex-col gap-1">
          <div className="flex-1 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/20" />
            <div className="mt-1 h-1 w-[70%] rounded-full bg-foreground/15" />
          </div>
          <div className="h-5 rounded-sm border border-sky-500/40 bg-sky-500/15 p-1">
            <div className="h-1 w-1/2 rounded-full bg-sky-600/70" />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'grid h-14 gap-1',
            position === 'left' ? 'grid-cols-[1fr_2fr]' : 'grid-cols-[2fr_1fr]',
          )}
        >
          {position === 'left' ? (
            <>
              <div className="rounded-sm border border-sky-500/40 bg-sky-500/15 p-1">
                <div className="h-1 w-full rounded-full bg-sky-600/70" />
              </div>
              <div className="rounded-sm border border-border/50 bg-background p-1">
                <div className="h-1 w-full rounded-full bg-foreground/20" />
              </div>
            </>
          ) : (
            <>
              <div className="rounded-sm border border-border/50 bg-background p-1">
                <div className="h-1 w-full rounded-full bg-foreground/20" />
              </div>
              <div className="rounded-sm border border-sky-500/40 bg-sky-500/15 p-1">
                <div className="h-1 w-full rounded-full bg-sky-600/70" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ShopFilterLayoutSketch({
  layout,
  className,
}: {
  layout: ShopFilterLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'top' ? (
        <div className="flex h-14 flex-col gap-1">
          <div className="flex h-3 gap-0.5 rounded-sm border border-sky-500/40 bg-sky-500/15 p-0.5">
            <div className="h-full flex-1 rounded-[1px] bg-sky-600/50" />
            <div className="h-full flex-1 rounded-[1px] bg-sky-600/30" />
            <div className="h-full flex-1 rounded-[1px] bg-sky-600/30" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-sm bg-background border border-border/50" />
            ))}
          </div>
        </div>
      ) : layout === 'drawer' ? (
        <div className="relative flex h-14 gap-1">
          <div className="absolute inset-y-1 left-1 z-10 w-5 rounded-sm border border-sky-500/50 bg-sky-500/20" />
          <div className="ml-2 grid flex-1 grid-cols-3 gap-0.5 opacity-50">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-sm bg-background border border-border/50" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid h-14 grid-cols-[1fr_2fr] gap-1">
          <div className="space-y-0.5 rounded-sm border border-sky-500/40 bg-sky-500/15 p-1">
            <div className="h-1 w-full rounded-full bg-sky-600/60" />
            <div className="h-1 w-[70%] rounded-full bg-sky-600/40" />
            <div className="h-1 w-[85%] rounded-full bg-sky-600/40" />
          </div>
          <div className="grid grid-cols-2 gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm bg-background border border-border/50" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductGallerySketch({
  layout,
  className,
}: {
  layout: ProductGalleryLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'stacked' ? (
        <div className="flex h-14 flex-col gap-0.5">
          <div className="flex-1 rounded-sm bg-sky-500/35" />
          <div className="flex-1 rounded-sm bg-sky-500/25" />
          <div className="h-2 rounded-sm border border-border/50 bg-background" />
        </div>
      ) : layout === 'bottom_thumbs' ? (
        <div className="flex h-14 flex-col gap-0.5">
          <div className="flex-1 rounded-sm bg-sky-500/35" />
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2.5 flex-1 rounded-[1px] bg-sky-500/25" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid h-14 grid-cols-[1fr_3fr] gap-0.5">
          <div className="flex flex-col gap-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 rounded-[1px] bg-sky-500/25" />
            ))}
          </div>
          <div className="rounded-sm bg-sky-500/35" />
        </div>
      )}
    </div>
  );
}

export function FormsLayoutSketch({
  layout,
  className,
}: {
  layout: FormsLayoutKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border/70 bg-muted/25 p-1.5',
        className,
      )}
      aria-hidden
    >
      {layout === 'centered' ? (
        <div className="mx-auto flex h-14 w-[70%] flex-col gap-1 rounded-sm border border-border/50 bg-background p-1">
          <div className="h-1 w-full rounded-full bg-foreground/25" />
          <div className="h-1 w-[80%] rounded-full bg-foreground/20" />
          <div className="mt-auto h-2 w-full rounded-sm bg-sky-500/70" />
        </div>
      ) : layout === 'stacked' ? (
        <div className="flex h-14 flex-col gap-1">
          <div className="h-4 rounded-sm border border-sky-500/40 bg-sky-500/15 p-0.5">
            <div className="h-1 w-1/2 rounded-full bg-sky-600/60" />
          </div>
          <div className="flex-1 space-y-0.5 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="h-2 w-full rounded-sm bg-sky-500/70" />
          </div>
        </div>
      ) : (
        <div className="grid h-14 grid-cols-2 gap-1">
          <div className="space-y-0.5 rounded-sm border border-border/50 bg-background p-1">
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="h-1 w-[75%] rounded-full bg-foreground/20" />
            <div className="mt-1 h-2 w-full rounded-sm bg-sky-500/70" />
          </div>
          <div className="rounded-sm border border-sky-500/40 bg-sky-500/15 p-1">
            <div className="h-1 w-full rounded-full bg-sky-600/60" />
            <div className="mt-1 h-1 w-[60%] rounded-full bg-sky-600/40" />
          </div>
        </div>
      )}
    </div>
  );
}
