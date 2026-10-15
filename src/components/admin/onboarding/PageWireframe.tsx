import type { ReactNode } from 'react';
import type { StorePageBlock } from '@/types/store-pages';

const bar = 'block h-1 rounded-full bg-foreground/25';
const fill = 'block rounded-[3px] bg-primary/20';

/** Un petit dessin par type de bloc, pour reconnaître un modèle de page d'un coup d'œil. */
const SHAPES: Record<string, () => ReactNode> = {
  hero: () => (
    <span className="flex h-6 flex-col justify-end gap-1 rounded-[3px] bg-primary p-1">
      <span className="block h-1 w-1/2 rounded-full bg-white/90" />
      <span className="block h-1 w-1/4 rounded-full bg-white/60" />
    </span>
  ),
  products: () => (
    <span className="grid grid-cols-4 gap-0.5">
      {[0, 1, 2, 3].map((i) => <span key={i} className={`${fill} h-3.5`} />)}
    </span>
  ),
  categories: () => (
    <span className="grid grid-cols-3 gap-0.5">
      {[0, 1, 2].map((i) => <span key={i} className={`${fill} h-2.5`} />)}
    </span>
  ),
  gallery: () => (
    <span className="grid grid-cols-3 gap-0.5">
      {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className={`${fill} h-2`} />)}
    </span>
  ),
  split: () => (
    <span className="grid grid-cols-2 items-center gap-1">
      <span className={`${fill} h-5`} />
      <span className="flex flex-col gap-0.5"><span className={bar} /><span className={`${bar} w-2/3`} /></span>
    </span>
  ),
  features: () => (
    <span className="grid grid-cols-3 gap-1">
      {[0, 1, 2].map((i) => <span key={i} className="flex flex-col items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-primary/50" /><span className={`${bar} w-full`} /></span>)}
    </span>
  ),
  testimonials: () => (
    <span className="grid grid-cols-2 gap-0.5">
      {[0, 1].map((i) => <span key={i} className="flex flex-col gap-0.5 rounded-[3px] border border-foreground/15 p-0.5"><span className={bar} /><span className={`${bar} w-1/2`} /></span>)}
    </span>
  ),
  faq: () => (
    <span className="flex flex-col gap-0.5">
      {[0, 1, 2].map((i) => <span key={i} className="flex items-center justify-between border-b border-foreground/15 pb-0.5"><span className={`${bar} w-1/2`} /><span className="h-1 w-1 rounded-full bg-foreground/30" /></span>)}
    </span>
  ),
  cta: () => (
    <span className="flex flex-col items-center gap-1 rounded-[3px] bg-primary/10 py-1.5">
      <span className={`${bar} w-1/2`} />
      <span className="block h-1.5 w-1/4 rounded-full bg-primary" />
    </span>
  ),
  newsletter: () => (
    <span className="flex items-center gap-0.5 rounded-[3px] bg-primary/10 p-1">
      <span className="h-1.5 flex-1 rounded-full bg-background" />
      <span className="block h-1.5 w-1/5 rounded-full bg-primary" />
    </span>
  ),
  contact: () => (
    <span className="flex flex-col gap-0.5">
      <span className="block h-1.5 rounded-[2px] border border-foreground/20" />
      <span className="block h-1.5 rounded-[2px] border border-foreground/20" />
      <span className="block h-1.5 w-1/3 rounded-full bg-primary" />
    </span>
  ),
  countdown: () => (
    <span className="grid grid-cols-4 gap-0.5">
      {[0, 1, 2, 3].map((i) => <span key={i} className="block h-2.5 rounded-[2px] bg-foreground/80" />)}
    </span>
  ),
  image: () => <span className={`${fill} h-5`} />,
  rich_text: () => (
    <span className="flex flex-col gap-0.5"><span className={bar} /><span className={bar} /><span className={`${bar} w-2/3`} /></span>
  ),
  blog_posts: () => (
    <span className="grid grid-cols-3 gap-0.5">
      {[0, 1, 2].map((i) => <span key={i} className="flex flex-col gap-0.5"><span className={`${fill} h-2`} /><span className={bar} /></span>)}
    </span>
  ),
};

/** Vignette filaire d'un modèle de page, construite à partir de ses vrais blocs. */
export function PageWireframe({ blocks }: { blocks: StorePageBlock[] }) {
  const ordered = [...blocks].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).filter((b) => b.type !== 'spacer');
  return (
    <span aria-hidden className="flex h-24 w-16 shrink-0 flex-col gap-1.5 overflow-hidden rounded-md border border-border bg-background p-1.5">
      {ordered.slice(0, 5).map((b, i) => {
        const Shape = SHAPES[b.type] ?? SHAPES.rich_text;
        return <Shape key={i} />;
      })}
    </span>
  );
}
