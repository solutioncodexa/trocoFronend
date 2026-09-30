import type { StorePageBlockType } from '@/types/store-pages';

/** Miniature visuelle — le vendeur voit la forme du composant, pas un jargon technique. */
export default function BlockPalettePreview({ type }: { type: StorePageBlockType | string }) {
  switch (type) {
    case 'hero':
      return (
        <div className="relative h-14 overflow-hidden rounded-md bg-gradient-to-br from-stone-800 to-stone-500">
          <div className="absolute inset-y-0 left-2 flex w-[55%] flex-col justify-center gap-1">
            <div className="h-2 w-4/5 rounded-sm bg-white/90" />
            <div className="h-1.5 w-3/5 rounded-sm bg-white/55" />
            <div className="mt-0.5 h-2.5 w-10 rounded-sm bg-amber-400" />
          </div>
        </div>
      );
    case 'rich_text':
      return (
        <div className="flex h-14 flex-col justify-center gap-1 rounded-md bg-muted/60 px-2">
          <div className="h-2 w-1/2 rounded-sm bg-foreground/70" />
          <div className="h-1 w-full rounded-sm bg-foreground/25" />
          <div className="h-1 w-5/6 rounded-sm bg-foreground/25" />
          <div className="h-1 w-4/6 rounded-sm bg-foreground/25" />
        </div>
      );
    case 'products':
      return (
        <div className="grid h-14 grid-cols-3 gap-1 rounded-md bg-muted/40 p-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="aspect-square rounded-sm bg-stone-300" />
              <div className="h-1 rounded-sm bg-foreground/30" />
            </div>
          ))}
        </div>
      );
    case 'categories':
      return (
        <div className="grid h-14 grid-cols-2 gap-1 rounded-md bg-muted/40 p-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm bg-stone-300/90" />
          ))}
        </div>
      );
    case 'cta':
      return (
        <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-md bg-primary/15 px-2">
          <div className="h-1.5 w-3/5 rounded-sm bg-foreground/60" />
          <div className="h-2.5 w-12 rounded-sm bg-primary" />
        </div>
      );
    case 'image':
      return (
        <div className="flex h-14 items-center justify-center rounded-md bg-stone-200">
          <div className="h-8 w-10 rounded-sm border-2 border-dashed border-stone-400" />
        </div>
      );
    case 'faq':
      return (
        <div className="flex h-14 flex-col justify-center gap-1 rounded-md bg-muted/50 px-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-1.5 flex-1 rounded-sm bg-foreground/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
            </div>
          ))}
        </div>
      );
    case 'spacer':
      return (
        <div className="flex h-14 items-center justify-center rounded-md border border-dashed border-border bg-background">
          <div className="h-px w-10 bg-border" />
        </div>
      );
    case 'contact':
      return (
        <div className="flex h-14 flex-col justify-center gap-1 rounded-md bg-muted/50 px-3">
          <div className="h-1.5 w-2/5 rounded-sm bg-foreground/50" />
          <div className="h-2 rounded-sm border border-border bg-background" />
          <div className="h-2.5 w-12 self-end rounded-sm bg-primary/80" />
        </div>
      );
    case 'video':
      return (
        <div className="relative flex h-14 items-center justify-center rounded-md bg-stone-800">
          <div className="h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white/90 ml-0.5" />
        </div>
      );
    case 'testimonials':
      return (
        <div className="grid h-14 grid-cols-2 gap-1 rounded-md bg-muted/40 p-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col justify-center gap-0.5 rounded-sm bg-background px-1">
              <div className="h-1 w-full rounded-sm bg-foreground/20" />
              <div className="h-1 w-2/3 rounded-sm bg-foreground/35" />
            </div>
          ))}
        </div>
      );
    case 'countdown':
      return (
        <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-md bg-amber-500/15">
          <div className="h-1.5 w-2/5 rounded-sm bg-foreground/50" />
          <div className="flex gap-1">
            {['00', '12', '45'].map((t) => (
              <span
                key={t}
                className="rounded-sm bg-foreground/80 px-1 font-mono text-[9px] text-background"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case 'instagram':
      return (
        <div className="grid h-14 grid-cols-3 gap-0.5 rounded-md bg-muted/30 p-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[2px] bg-stone-300" />
          ))}
        </div>
      );
    case 'features':
      return (
        <div className="grid h-14 grid-cols-4 items-center gap-1 rounded-md bg-muted/40 px-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="h-4 w-4 rounded-full bg-primary/40" />
              <div className="h-1 w-full rounded-sm bg-foreground/30" />
              <div className="h-1 w-2/3 rounded-sm bg-foreground/15" />
            </div>
          ))}
        </div>
      );
    case 'newsletter':
      return (
        <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-md bg-muted/50 px-3">
          <div className="h-1.5 w-2/5 rounded-sm bg-foreground/50" />
          <div className="flex w-full gap-1">
            <div className="h-3 flex-1 rounded-sm border border-border bg-background" />
            <div className="h-3 w-8 rounded-sm bg-primary/80" />
          </div>
        </div>
      );
    case 'gallery':
      return (
        <div className="grid h-14 grid-cols-3 gap-0.5 rounded-md bg-muted/30 p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[2px] bg-stone-300" />
          ))}
        </div>
      );
    case 'split':
      return (
        <div className="grid h-14 grid-cols-2 gap-1.5 rounded-md bg-muted/40 p-1.5">
          <div className="rounded-sm bg-stone-300" />
          <div className="flex flex-col justify-center gap-1">
            <div className="h-1.5 w-4/5 rounded-sm bg-foreground/60" />
            <div className="h-1 w-full rounded-sm bg-foreground/25" />
            <div className="h-1 w-3/4 rounded-sm bg-foreground/25" />
          </div>
        </div>
      );
    case 'blog_posts':
      return (
        <div className="grid h-14 grid-cols-3 gap-1 rounded-md bg-muted/40 p-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-0.5 rounded-sm bg-background p-0.5">
              <div className="h-4 rounded-sm bg-stone-300" />
              <div className="h-1 rounded-sm bg-foreground/40" />
              <div className="h-1 w-2/3 rounded-sm bg-foreground/20" />
            </div>
          ))}
        </div>
      );
    case 'logos':
      return (
        <div className="flex h-14 items-center justify-center gap-2 rounded-md bg-muted/30 px-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-full rounded-sm bg-foreground/25" />
          ))}
        </div>
      );
    default:
      return <div className="h-14 rounded-md bg-muted" />;
  }
}
