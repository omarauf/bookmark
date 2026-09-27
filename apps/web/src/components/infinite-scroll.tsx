import { Loader2Icon } from "lucide-react";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isRequestingRef = useRef(false);

  useEffect(() => {
    if (!isFetchingNextPage) {
      isRequestingRef.current = false;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;
    const container = root?.querySelector('[data-slot="scroll-area-viewport"]');
    if (!root || !sentinel || !container) return;

    const loadIfNearBottom = (viewportTop: number, viewportBottom: number) => {
      const sentinelRect = sentinel.getBoundingClientRect();
      const isNearBottom =
        sentinelRect.top <= viewportBottom + threshold &&
        sentinelRect.bottom >= viewportTop - threshold;

      if (
        isNearBottom &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoading &&
        !isRequestingRef.current
      ) {
        isRequestingRef.current = true;
        onLoadMore();
      }
    };

    const handleContainerScroll = () => {
      const containerRect = container.getBoundingClientRect();
      loadIfNearBottom(containerRect.top, containerRect.bottom);
    };

    const handleWindowScroll = () => {
      loadIfNearBottom(0, window.innerHeight);
    };

    container.addEventListener("scroll", handleContainerScroll, { passive: true });
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleContainerScroll);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [onLoadMore, isFetchingNextPage, hasNextPage, threshold, isLoading]);

  return (
    <ScrollArea
      ref={rootRef}
      className={cn("relative overflow-auto")}
      viewportProps={{ className }}
    >
      {children}

      <div
        className={cn(
          "mt-2 flex w-full items-center justify-center",
          !isFetchingNextPage && "hidden",
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>

      {!isLoading && <div ref={sentinelRef} className="h-1" />}
    </ScrollArea>
  );
}
