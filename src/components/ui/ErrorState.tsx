import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Impossible de charger ces données. Réessayez dans un instant.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("state-panel animate-fade-in border-destructive/25 bg-destructive/5", className)} role="alert">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-6 gap-2" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      ) : null}
    </div>
  );
}
