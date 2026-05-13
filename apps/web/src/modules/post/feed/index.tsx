import { InfiniteScroll } from "@/components/infinite-scroll";
import { EmptyPosts } from "../components/empty";
import { LoadingCards } from "../components/loading-cards";
import { useDisplaySettingsStore } from "../controls/display-setting-store";
import { usePostNavigation } from "../controls/use-post-navigation";
import { usePostQuery } from "../hooks/use-post-query";
import { PostGridFeed } from "./grid";
import { PostListFeed } from "./list";

export function PostFeed() {
  const postQuery = usePostQuery();

  const flatItems = postQuery.data?.pages.flatMap((page) => page.items);
  usePostNavigation(flatItems);

  const layout = useDisplaySettingsStore((s) => s.layout);
  const isEmpty = flatItems?.length === 0 && !postQuery.isLoading;

  return (
    <InfiniteScroll
      onLoadMore={postQuery.fetchNextPage}
      hasNextPage={postQuery.hasNextPage}
      isFetchingNextPage={postQuery.isFetchingNextPage}
      isLoading={postQuery.isLoading}
      className="gap-4 px-4"
    >
      {layout === "grid" ? <PostGridFeed posts={flatItems} /> : <PostListFeed posts={flatItems} />}

      {postQuery.isLoading && <LoadingCards count={45} />}

      <EmptyPosts isEmpty={isEmpty} />
    </InfiniteScroll>
  );
}
