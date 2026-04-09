import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/store";
import { PostListCard } from "./card";

type Props = {
  posts: Post[];
  className?: string;
};

const GAP = 16;

export function PostListVirtualWindow({ posts, className }: Props) {
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

  const estimatedColumnWidth = useMemo(
    () => getColumnWidth(containerWidth, columnCount),
    [containerWidth, columnCount],
  );

  const estimatedRowHeight = useMemo(
    () => getRowHeight(estimatedColumnWidth, showCardInfo, aspectRatio),
    [estimatedColumnWidth, showCardInfo, aspectRatio],
  );

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

  const handlePostClick = useCallback((id: string | undefined) => {
    setOpenPostId(id);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);
    return () => {
      document.removeEventListener("keydown", handleNavigation);
    };
  }, [handleNavigation]);

  const cellProps = useMemo<CellData>(
    () => ({
      posts,
      columnCount,
      openPostId,
      onPostClick: handlePostClick,
    }),
    [posts, columnCount, openPostId, handlePostClick],
  );

  return (
    <div ref={parentRef} className={cn("relative w-full overflow-hidden", className)}>
      <List
        rowComponent={PostListCell}
        rowCount={rowCount}
        rowHeight={estimatedRowHeight}
        rowProps={cellProps}
      />
    </div>
  );
}

type CellData = {
  posts: Post[];
  columnCount: number;
  openPostId: string | undefined;
  onPostClick: (id: string | undefined) => void;
};

function PostListCell({
  index,
  style,
  columnCount,
  posts,
  openPostId,
  onPostClick,
}: RowComponentProps<CellData>) {
  const startIdx = index * columnCount;
  const rowPosts = posts.slice(startIdx, startIdx + columnCount);

  return (
    <div
      className="grid"
      style={{
        ...style,
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: GAP,
        // marginBottom: 16,
        paddingBottom: GAP,
      }}
    >
      {rowPosts.map((post) => (
        <PostListCard
          key={post.id}
          post={post}
          isOpen={openPostId === post.id}
          onClick={onPostClick}
        />
      ))}
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

function getColumnWidth(containerWidth: number, columnCount: number) {
  if (columnCount <= 0) return containerWidth;

  // this get the post width
  // const totalGapWidth = 0 * (columnCount - 1);
  // const availableWidth = containerWidth - totalGapWidth;

  // this get the column width (post width + gap)
  const availableWidth = containerWidth;

  return Math.floor(availableWidth / columnCount);
}

function getRowHeight(columnWith: number, showCardInfo: boolean, aspectRatio: string) {
  const ratio = aspectRatio === "landscape" ? 0.5625 : aspectRatio === "portrait" ? 1.33 : 1;

  const cardHeight = Math.round(columnWith * ratio);
  const infoHeight = showCardInfo ? 40 : 0;
  const estimatedHeight = cardHeight + infoHeight;

  return estimatedHeight;
}
