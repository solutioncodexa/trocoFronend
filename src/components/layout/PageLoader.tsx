import { Loader2 } from 'lucide-react';

/** Chargement des routes lazy (Suspense) */
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-background">
    <Loader2 className="w-10 h-10 animate-spin text-primary" aria-hidden />
    <p className="text-xs uppercase tracking-widest text-muted-foreground">Chargement…</p>
  </div>
);

export default PageLoader;
