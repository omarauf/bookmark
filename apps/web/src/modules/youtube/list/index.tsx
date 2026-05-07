import { InfiniteScroll } from "@/components/infinite-scroll";
import { YoutubeCard } from "../card";
import { EmptyYoutube } from "../components/empty";
import { useYoutubeQuery } from "../hooks/use-youtube-query";

export function YoutubeList() {
  const query = useYoutubeQuery();
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
        <EmptyYoutube />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          }}
        >
          {flatItems.map((item) => (
            <YoutubeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
}
