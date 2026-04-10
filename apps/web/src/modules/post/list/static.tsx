import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { usePostNavigation } from "../controls/use-post-navigation";
import { PostListCard } from "./card";

export function PostList() {
  const search = useSearch({ from: "/_authenticated/instagram/" });

  const postQuery = useInfiniteQuery(
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

  const flatItems = postQuery.data?.pages.flatMap((page) => page.items);
  const { openPostId, setOpenPostId } = usePostNavigation(flatItems);

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);
  const cardMinWidth = CARD_MIN_WIDTH[cardSize];

  return (
    <InfiniteScroll
      onLoadMore={postQuery.fetchNextPage}
      hasNextPage={postQuery.hasNextPage}
      isFetchingNextPage={postQuery.isFetchingNextPage}
      isLoading={postQuery.isLoading}
      className="gap-4 px-4"
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
        }}
      >
        {flatItems?.map((post) => (
          <PostListCard
            key={post.id}
            post={post}
            isOpen={openPostId === post.id}
            onClick={(id) => setOpenPostId(id)}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
