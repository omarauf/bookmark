import { InfiniteScroll } from "@/components/infinite-scroll";
import { AnimeCard } from "../card";
import { EmptyAnime } from "../components/empty";
import { useAnimeQuery } from "../hooks/use-anime-query";

export function AnimeList() {
  const query = useAnimeQuery();
  const flatItems = query.data?.pages.flatMap((page) => page.items) ?? [];
  const isEmpty = flatItems.length === 0 && !query.isLoading;

  if (isEmpty) return <EmptyAnime />;

  return (
    <InfiniteScroll
      onLoadMore={query.fetchNextPage}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      isLoading={query.isLoading}
      className="px-6 py-4"
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {flatItems.map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
