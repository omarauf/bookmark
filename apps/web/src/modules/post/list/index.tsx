import { InfiniteScroll } from "@/components/infinite-scroll";
import { CARD_MIN_WIDTH } from "../card/constant";
import { EmptyPosts } from "../components/empty";
import { LoadingCards } from "../components/loading-cards";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { usePostNavigation } from "../controls/use-post-navigation";
import { usePostQuery } from "../hooks/use-post-query";
import { PostListCard } from "./post-list";

export function PostList() {
  const postQuery = usePostQuery();

  const flatItems = postQuery.data?.pages.flatMap((page) => page.items);
  usePostNavigation(flatItems);

  const cardSize = useDisplaySettingsStore((s) => s.cardSize);
  const cardMinWidth = CARD_MIN_WIDTH[cardSize];
  const isEmpty = flatItems?.length === 0 && !postQuery.isLoading;

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
          <PostListCard key={post.id} post={post} />
        ))}
      </div>

      {postQuery.isLoading && <LoadingCards count={45} />}

      <EmptyPosts isEmpty={isEmpty} />
    </InfiniteScroll>
  );
}
