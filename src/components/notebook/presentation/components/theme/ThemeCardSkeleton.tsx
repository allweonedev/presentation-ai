import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton component for theme cards
 */
export function ThemeCardSkeleton() {
  return (
    <div className="relative h-44 rounded-xl border border-border bg-card/50 p-2">
      <Skeleton className="h-28 w-full rounded-lg" />
      <div className="mt-2 space-y-1.5 px-1">
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-2.5 w-2/5" />
      </div>
    </div>
  );
}
