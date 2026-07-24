import { Loader2 } from 'lucide-react';

/** Chargement des routes lazy (Suspense) */
const PageLoader = () => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background" role="status" aria-live="polite">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-soft">
      <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
    </div>
    <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Chargement…</p>
  </div>
);

export default PageLoader;
