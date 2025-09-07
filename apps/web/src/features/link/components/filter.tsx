import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import {
  ChevronDownIcon,
  DeleteIcon,
  FilterIcon,
  MoveIcon,
  SearchIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { orpc } from "@/api/rpc";
import { DebounceInput } from "@/components/form/denounced-input";
import { XSelect } from "@/components/form/select";
import { XToggleGroup } from "@/components/form/toggle-group";
import { LinksDeleteDialog } from "../dialogs/deletes";
import { LinksMoveDialog } from "../dialogs/moves";
import { useLinkDragStore } from "../hooks/store";
import { getFilterType } from "../utils";

interface LinkFilterProps {
  className?: string;
}

export function LinkFilter({ className }: LinkFilterProps) {
  const search = useSearch({ from: "/links/" });
  const navigate = useNavigate({ from: "/links" });
  const [dialog, setDialog] = useState<"delete" | "tag" | "move">();
  const [selectedLinksCount, clearSelection] = useLinkDragStore(
    useShallow((s) => [s.selectedIds.size, s.clearSelection]),
  );

  const domainQuery = useQuery(orpc.links.domains.queryOptions());

  const clearFilters = useCallback(() => {
    navigate({ search: { ...search, q: undefined, domain: undefined } });
    clearSelection();
  }, [search, clearSelection, navigate]);

  const setFilter = useCallback(
    (filter: Partial<typeof search>) => {
      navigate({ search: { ...search, ...filter } });
      clearSelection();
    },
    [search, navigate, clearSelection],
  );

  return (
    <div className={cn("flex w-full items-center gap-4 rounded-lg border bg-card p-4", className)}>
      {/* Filter Icon and Label */}
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <FilterIcon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4">
        {/* Search Input */}
        <div className="relative max-w-[300px] flex-1">
          <div className="-translate-y-1/2 absolute top-1/2 left-3">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <DebounceInput
            placeholder="Search links by name..."
            className="pl-10"
            value={search.q || ""}
            onChange={(v) => setFilter({ q: v })}
          />
        </div>

        {/* Domain Filter */}
        <XSelect
          value={search.domain || ""}
          onChange={(v) => setFilter({ domain: v })}
          placeholder="Filter by domain"
          options={
            domainQuery.data?.slice(0, 20).map((d) => ({ value: d.domain, label: d.domain })) || []
          }
          clearable
          className="min-w-[180px]"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <XToggleGroup
          value={search.view}
          onChange={(v) => setFilter({ view: v })}
          options={[
            { value: "grid", label: "", icon: "lucide-grid" },
            { value: "list", label: "", icon: "lucide-list" },
          ]}
        />

        {/* Bulk Actions Dropdown - Only visible when links are selected */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <span className="mr-2">{selectedLinksCount} selected</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setDialog("move")}>
              <MoveIcon className="mr-2 h-4 w-4" />
              Move to Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialog("tag")}>
              <TagIcon className="mr-2 h-4 w-4" />
              Add Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDialog("delete")}
              className="text-destructive focus:text-destructive"
            >
              <DeleteIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={getFilterType(search) === "tree"}
          onClick={clearFilters}
          className="h-9"
        >
          <XIcon className="mr-1 h-4 w-4" />
          Clear
        </Button>

        <LinksDeleteDialog open={dialog === "delete"} onClose={() => setDialog(undefined)} />
        <LinksMoveDialog open={dialog === "move"} onClose={() => setDialog(undefined)} />

        {/* <Button variant="outline" size="sm" onClick={() => setSelection(new Set())} className="h-9">
          <Scan className="mr-1 h-4 w-4" />
          Select All
        </Button> */}
      </div>
    </div>
  );
}
