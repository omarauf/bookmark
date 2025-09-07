import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { orpc } from "@/api/rpc";
import { EmptyContent } from "@/components/empty-content";
import { LinkDragOverlay } from "@/features/link/components/drag-overlay";
import { LinkGrid } from "@/features/link/components/link-grids";
import { mainCenter } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";
import { DroppableFolder } from "../components/draggable-folder";
import { LinkDragContext } from "../context/drag-context";
import { useGridClassName } from "../hooks/use-grid-style";
import { useSelectAll } from "../hooks/use-select-all";

export function TreeLinkView() {
  const search = useSearch({ from: "/links/" });
  const { path, q } = search;

  const query = useSuspenseQuery(
    orpc.links.tree.queryOptions({
      input: { path, q },
    }),
  );

  const { gridClassName } = useGridClassName();

  const { folders, links } = query.data;

  const isEmpty = folders.length === 0 && links.length === 0;

  useSelectAll({ data: links.map((l) => l.id) });

  return (
    <LinkDragContext>
      {/* Folders */}
      <div className={mainCenter}>
        {folders.length > 0 && (
          <div className={cn(gridClassName, "mb-6")}>
            {folders.map((f) => (
              <DroppableFolder key={f.path} path={f.path} />
            ))}
          </div>
        )}

        <EmptyContent show={isEmpty} icon="lucide-link" />
      </div>

      <LinkGrid links={links} className={cn(mainCenter, gridClassName)} />

      <LinkDragOverlay links={links} />
    </LinkDragContext>
  );
}
