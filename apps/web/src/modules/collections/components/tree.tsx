import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TreeView } from "@/components/tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateCollectionDialog } from "../dialogs/create";
import { useCollection } from "../hooks/use-ad-categories";
import { filterCollectionTree } from "../utils";

type Props = {
  className?: string;
};

export function CollectionTree({ className }: Props) {
  const [search, setSearch] = useState("");
  const defaultPath = useSearch({ strict: false, select: (s) => s.collectionPath || "" });
  const { data, onClickHandler, pathArray, currentNode } = useCollection({
    defaultPath,
    depth: 100,
  });
  const filteredData = useMemo(() => filterCollectionTree(data, search), [data, search]);
  const query = search.trim();

  const navigate = useNavigate();

  const onClick = (value: string[]) => {
    const lastValue = value[value.length - 1];
    navigate({ to: ".", search: (s) => ({ ...s, collectionPath: lastValue }) });
    onClickHandler(lastValue);
  };

  return (
    <div className={cn("flex min-h-0 w-full flex-col overflow-hidden bg-background", className)}>
      <div className="flex shrink-0 items-center justify-between px-3 pt-2">
        <h3 className="font-bold text-sm">Collections</h3>

        <CreateCollectionDialog
          parentId={currentNode?.id}
          render={
            <Button size="icon" variant="ghost">
              <Plus />
            </Button>
          }
        />
      </div>

      <div className="shrink-0 px-3 pt-2">
        <Input
          type="search"
          aria-label="Search collections"
          placeholder="Search collections..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {query && filteredData.length === 0 ? (
        <p role="status" className="py-6 text-center text-sm">
          No matching collections.
        </p>
      ) : (
        <TreeView
          key={query}
          data={filteredData}
          value={pathArray}
          onPathChange={onClick}
          className="pt-1"
          autoCollapse={false}
          defaultOpenLevel={query ? -1 : 1}
        />
      )}
    </div>
  );
}
