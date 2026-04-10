import { LoaderIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  threshold?: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function InfiniteScroll({
  threshold = 500,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  isLoading = false,
  children,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // IntersectionObserver for scroll-based infinite loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: container,
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, isFetchingNextPage, hasNextPage, threshold, isLoading]);

  // Initial load: only check once after initial data is loaded
  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasInitializedRef.current || isLoading || isFetchingNextPage) return;

    const containerHeight = container.scrollHeight;
    const containerClientHeight = container.clientHeight;

    // Only trigger initial load if container is not full and we have a next page
    if (containerHeight <= containerClientHeight && hasNextPage) {
      hasInitializedRef.current = true;
      onLoadMore();
    } else {
      // Mark as initialized even if we don't need to load more
      hasInitializedRef.current = true;
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, onLoadMore]);
  // <ScrollArea className="h-full">

  return (
    <ScrollArea ref={containerRef} className={cn("relative overflow-auto", className)}>
      {children}

      <div
        className={cn(
          "mt-4 flex w-full items-center justify-center",
          !isFetchingNextPage && "hidden",
        )}
      >
        <LoaderIcon className="animate-spin" />
      </div>

      {!isLoading && <div ref={sentinelRef} className="h-1" />}
    </ScrollArea>
  );
}
