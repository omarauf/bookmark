import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TwitterIcon } from "@/assets/icons";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { TwitterCard } from "@/modules/twitter/card";

export const Route = createFileRoute("/_authenticated/posts/twitter")({
  component: Twitter,
});

function Twitter() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, limit: 30, platform: "twitter" }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = postQuery.data.pages.flatMap((page) => page.items);
  const total = postQuery.data.pages[0]?.total ?? 0;

  return (
    <Main className="flex h-full flex-col p-0">
      <Header className="border-border/50 border-b">
        <div className="flex items-center gap-3">
          <TwitterIcon className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-medium text-lg tracking-tight">Twitter</h1>
          <span className="text-[10px] text-muted-foreground/60">{total.toLocaleString()}</span>
        </div>
      </Header>

      <InfiniteScroll
        onLoadMore={postQuery.fetchNextPage}
        hasNextPage={postQuery.hasNextPage}
        isFetchingNextPage={postQuery.isFetchingNextPage}
        isLoading={postQuery.isLoading}
        className="flex flex-1 justify-center overflow-y-auto px-4 pt-4"
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(500px, 1fr))`,
          }}
        >
          {flatItems.map((post) => (
            <TwitterCard key={post.id} post={post} />
          ))}
        </div>

        <EmptyContent show={!flatItems.length && !postQuery.isLoading} />
      </InfiniteScroll>
    </Main>
  );
}
