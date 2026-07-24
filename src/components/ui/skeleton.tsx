import type * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-skeleton-pulse rounded-xl bg-muted/80", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
