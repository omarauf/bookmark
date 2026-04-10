import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { Post } from "@workspace/contracts/post";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { useShallow } from "zustand/react/shallow";
import { orpc } from "@/integrations/orpc";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { PostListCard } from "../list/post-list";

const GAP = 16;
const LOAD_MORE_THRESHOLD = 5;

export function PostListVirtualWindow() {
  const [openPostId, setOpenPostId] = useState<string>();
  const parentRef = useRef<HTMLDivElement>(null);
  const search = useSearch({ from: "/_authenticated/instagram/virtual-window" });
  const postQuery = useSuspenseInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({
        ...search,
        page: searchParams,
        perPage: 65,
        platform: "instagram",
      }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const posts = postQuery.data.pages.flatMap((page) => page.items);

  const { width: containerWidth, height: containerHeight } = useContainerSize(parentRef);

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

  const handleRowsRendered = useCallback(
    (
      { stopIndex }: { startIndex: number; stopIndex: number },
      _allRows: { startIndex: number; stopIndex: number },
    ) => {
      if (
        stopIndex >= rowCount - LOAD_MORE_THRESHOLD &&
        postQuery.hasNextPage &&
        !postQuery.isFetchingNextPage
      ) {
        postQuery.fetchNextPage();
      }
    },
    [rowCount, postQuery.hasNextPage, postQuery.isFetchingNextPage, postQuery.fetchNextPage],
  );

  return (
    <div ref={parentRef} className="h-full w-full">
      {containerHeight > 0 && containerWidth > 0 && (
        <List
          style={{ height: containerHeight, width: containerWidth }}
          rowComponent={PostListCell}
          rowCount={rowCount}
          rowHeight={estimatedRowHeight}
          rowProps={cellProps}
          onRowsRendered={handleRowsRendered}
        />
      )}
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

function useContainerSize(parentRef: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is a ref
  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return size;
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
