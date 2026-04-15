import { Grid3X3, List, MoreHorizontal, Plus, RefreshCw, Upload } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitch } from "@/theme/theme-switch";
import { useStore } from "../store";

export function Toolbar() {
  const [viewMode, selectedCount, onViewModeToggle] = useStore(
    useShallow((s) => [s.viewMode, s.selectedItems.size, s.handleViewModeToggle]),
  );

  return (
    <div className="flex items-center gap-2 border-border border-b bg-card p-3">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            /* TODO: Implement new folder */
          }}
          className="h-8"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Folder
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            /* TODO: Implement upload */
          }}
          className="h-8"
        >
          <Upload className="mr-1 h-4 w-4" />
          Upload
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            /* TODO: Implement refresh */
          }}
          className="h-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <div />
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={onViewModeToggle}
          className="h-8"
          aria-label="Grid view"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>

        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={onViewModeToggle}
          className="h-8"
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      <ThemeSwitch />

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{selectedCount} selected</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Move</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
