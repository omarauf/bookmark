import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { LinkCard } from "../components/link-card";
import { LinkContextMenu } from "../components/link-context-menu";
import { LinkSkeletons } from "../components/link-skeleton";
import { SearchEmpty } from "../components/search-empty";

export function SearchResults() {
  const q = useSearch({ from: "/_authenticated/links/", select: (s) => s.q });

  const query = useInfiniteQuery(
    orpc.link.list.infiniteOptions({
      initialPageParam: 1,
      input: (page) => ({ q, page, perPage: 40 }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  if (query.isLoading) return <LinkSkeletons folderCount={0} linkCount={12} className="px-4" />;

  const flatItems = query.data?.pages.flatMap((page) => page.items) || [];

  const isEmpty = flatItems.length === 0 && !query.isLoading;

  return (
    <InfiniteScroll
      onLoadMore={query.fetchNextPage}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      isLoading={query.isLoading}
      className="p-4"
    >
      {!query.isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {flatItems.map((link) => (
            <LinkContextMenu key={link.id} item={{ type: "link", link }}>
              <LinkCard link={link} />
            </LinkContextMenu>
          ))}
        </div>
      )}

      {isEmpty && q && <SearchEmpty query={q} />}
    </InfiniteScroll>
  );
}
