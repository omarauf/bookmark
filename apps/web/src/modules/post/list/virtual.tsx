import { useVirtualizer } from "@tanstack/react-virtual";
import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useDisplaySettingsStore } from "../controls/store";
import { PostListCard } from "./card";

type Props = {
  posts: Post[];
  className?: string;
};

const CARD_MIN_WIDTH: Record<string, number> = { S: 130, M: 180, L: 230 };
const ESTIMATED_ROW_HEIGHT: Record<string, number> = { S: 180, M: 260, L: 380 };
const GAP = 16;

export function PostListVirtual({ posts, className }: Props) {
  const [openPostId, setOpenPostId] = useState<string>();
  const parentRef = useRef<HTMLDivElement>(null);

  const containerWidth = useContainerWidth(parentRef);

  const [cardSize, aspectRatio, showCardInfo] = useDisplaySettingsStore(
    useShallow((s) => [s.cardSize, s.aspectRatio, s.showCardInfo]),
  );

  const columnCount = useMemo(
    () => getColumnCount(cardSize, containerWidth),
    [cardSize, containerWidth],
  );
  const rowCount = useMemo(
    () => getRowCount(posts.length, columnCount),
    [posts.length, columnCount],
  );

  const estimatedRowHeight = useMemo(
    () => estimateRowHeight(cardSize, showCardInfo, aspectRatio),
    [cardSize, showCardInfo, aspectRatio],
  );

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef?.current ?? null,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
    debug: true,
  });

  const handleNavigation = useCallback(
    async (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!openPostId) return;

      const currentIndex = posts.findIndex((post) => post.id === openPostId);
      if (currentIndex === -1) return;

      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const targetIndex = currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < posts.length) {
        setOpenPostId(posts[targetIndex].id);
      }
    },
    [posts, openPostId],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);
    return () => {
      document.removeEventListener("keydown", handleNavigation);
    };
  }, [handleNavigation]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn("relative w-full", className)}
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualItems.map((virtualRow) => {
        const startIdx = virtualRow.index * columnCount;
        const rowPosts = posts.slice(startIdx, startIdx + columnCount);

        return (
          <div
            key={virtualRow.index}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className="absolute left-0 w-full"
            style={{ top: virtualRow.start }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: GAP,
                marginBottom: 16,
              }}
            >
              {rowPosts.map((post) => (
                <PostListCard
                  key={post.id}
                  post={post}
                  isOpen={openPostId === post.id}
                  onClick={(id) => setOpenPostId(id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function useContainerWidth(parentRef: React.RefObject<HTMLDivElement | null>) {
  const [containerWidth, setContainerWidth] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is a ref
  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return containerWidth;
}

function getColumnCount(cardSize: string, containerWidth: number) {
  const cardMinWidth = CARD_MIN_WIDTH[cardSize];

  if (containerWidth <= 0) return 1;

  return Math.max(1, Math.floor((containerWidth + GAP) / (cardMinWidth + GAP)));
}

function getRowCount(postsCount: number, columnCount: number) {
  return Math.ceil(postsCount / columnCount);
}

function estimateRowHeight(cardSize: string, showCardInfo: boolean, aspectRatio: string) {
  const base = ESTIMATED_ROW_HEIGHT[cardSize];
  const infoHeight = showCardInfo ? 40 : 0;
  const ratio = aspectRatio === "landscape" ? 0.5625 : aspectRatio === "portrait" ? 1.33 : 1;
  return Math.round(base * ratio + infoHeight);
}
