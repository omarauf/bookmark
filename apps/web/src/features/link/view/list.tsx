import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { orpc } from "@/api/rpc";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { LinkDragOverlay } from "@/features/link/components/drag-overlay";
import { mainCenter } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";
import { DraggableLink } from "../components/draggable-link";
import { useGridClassName } from "../hooks/use-grid-style";
import { useSelectAll } from "../hooks/use-select-all";

export function ListLinkView() {
  const search = useSearch({ from: "/links/" });
  const { q, domain } = search;
  const infiniteQuery = useSuspenseInfiniteQuery(
    orpc.links.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ page: searchParams, limit: 50, q, domain }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const { gridClassName } = useGridClassName();

  const flatItems = infiniteQuery.data.pages.flatMap((page) => page.items);

  useSelectAll({ data: flatItems.map((l) => l.id) });

  const isEmpty = flatItems.length === 0;

  return (
    <div className={mainCenter}>
      <EmptyContent show={isEmpty} icon="lucide-link" />

      <InfiniteScroll
        onLoadMore={infiniteQuery.fetchNextPage}
        hasNextPage={infiniteQuery.hasNextPage}
        isFetchingNextPage={infiniteQuery.isFetchingNextPage}
      >
        <div className={gridClassName}>
          {flatItems.map((link) => (
            <DraggableLink key={link.id} link={link} />
          ))}
        </div>

        <div
          className={cn(
            "flex w-full items-center justify-center",
            !infiniteQuery.isFetchingNextPage && "hidden",
          )}
        >
          <Loader2 className="animate-spin" />
        </div>
      </InfiniteScroll>

      <LinkDragOverlay links={flatItems} />
    </div>
  );
}
