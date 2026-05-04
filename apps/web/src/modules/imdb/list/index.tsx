import { InfiniteScroll } from "@/components/infinite-scroll";
import { ImdbCard } from "../card";
import { EmptyImdb } from "../components/empty";
import { useImdbQuery } from "../hooks/use-imdb-query";

export function ImdbList() {
  const query = useImdbQuery();
  const flatItems = query.data?.pages.flatMap((page) => page.items) ?? [];
  const isEmpty = flatItems.length === 0 && !query.isLoading;

  return (
    <InfiniteScroll
      onLoadMore={query.fetchNextPage}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      isLoading={query.isLoading}
      className="gap-4 px-6 py-6"
    >
      {isEmpty ? (
        <EmptyImdb />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          }}
        >
          {flatItems.map((item) => (
            <ImdbCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
}
