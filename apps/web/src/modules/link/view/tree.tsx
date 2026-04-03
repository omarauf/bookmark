import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Link } from "lucide-react";
import { EmptyContent } from "@/components/empty-content";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { LinkDragOverlay } from "../components/drag-overlay";
import { DroppableFolder } from "../components/draggable-folder";
import { LinkGrid } from "../components/link-grids";
import { LinkDragContext } from "../context/drag-context";
import { useGridClassName } from "../hooks/use-grid-style";
import { useSelectAll } from "../hooks/use-select-all";

export function TreeLinkView() {
  const search = useSearch({ from: "/_authenticated/links/" });
  const { path, q } = search;

  const query = useSuspenseQuery(
    orpc.link.tree.queryOptions({
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
      <div>
        {folders.length > 0 && (
          <div className={cn(gridClassName, "mb-6")}>
            {folders.map((f) => (
              <DroppableFolder key={f.path} path={f.path} />
            ))}
          </div>
        )}

        <EmptyContent show={isEmpty} icon={Link} />
      </div>

      <LinkGrid links={links} className={gridClassName} />

      <LinkDragOverlay links={links} />
    </LinkDragContext>
  );
}
