import { useEffect, useRef } from "react";

type Props = {
  threshold?: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
  children: React.ReactNode;
};

export function InfiniteScroll({
  threshold = 500,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    const currentContainer = containerRef.current;

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        // observer.unobserve(currentContainer);
        observer.disconnect();
      }
    };
  }, [onLoadMore, isFetchingNextPage, hasNextPage, threshold]);

  useEffect(() => {
    const containerHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    if (containerHeight <= viewportHeight && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div>
      {children}
      <div ref={containerRef} className="h-1" />
    </div>
  );
}
