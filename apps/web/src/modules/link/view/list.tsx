import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Link } from "lucide-react";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";

import { LinkDragOverlay } from "../components/drag-overlay";
import { DraggableLink } from "../components/draggable-link";
import { useGridClassName } from "../hooks/use-grid-style";
import { useSelectAll } from "../hooks/use-select-all";

export function ListLinkView() {
  const search = useSearch({ from: "/_authenticated/links/" });
  const { q, domain } = search;
  const infiniteQuery = useSuspenseInfiniteQuery(
    orpc.link.list.infiniteOptions({
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
    <div>
      <EmptyContent show={isEmpty} icon={Link} />

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
      </InfiniteScroll>

      <LinkDragOverlay links={flatItems} />
    </div>
  );
}
