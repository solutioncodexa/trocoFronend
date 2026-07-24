import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  className?: string;
  rows?: number;
  label?: string;
}

export function LoadingState({ className, rows = 3, label = "Chargement…" }: LoadingStateProps) {
  return (
    <div className={cn("space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-soft", className)} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full", i === 0 && "w-2/3", i === rows - 1 && "w-5/6")} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-soft", className)}>
      <Skeleton className="mb-4 aspect-[4/5] w-full rounded-xl" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-4 h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}
