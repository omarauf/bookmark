import { cn } from "@/lib/utils";
import { createKeys } from "@/utils/array";

type Props = {
  count?: number;
  className?: string;
};

export function TagSkeletons({ count = 10, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {createKeys(count).map((i) => (
        <TagCardSkeleton key={i} />
      ))}
    </div>
  );
}

function TagCardSkeleton() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border bg-card py-0 shadow-sm">
      {/* Left color accent placeholder */}
      <div className="absolute top-0 left-0 h-full w-1 animate-pulse bg-muted" />

      <div className="relative p-4 pl-5">
        {/* Top row: Tag name + actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {/* Colored dot placeholder */}
            <div className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-muted" />
            {/* Tag name placeholder */}
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>

          {/* Actions placeholder */}
          <div className="flex shrink-0 gap-1">
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Count placeholder */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
        </div>

        {/* Progress bar placeholder */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-1/2 animate-pulse rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}
