import { Grid3X3, List, Plus, Upload } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitch } from "@/theme/theme-switch";
import { useStore } from "../store";
import { FilesDropMenu } from "./drop-menu";
import { RefreshButton } from "./refresh-button";

export function Toolbar() {
  const [viewMode, openDialog] = useStore(useShallow((s) => [s.viewMode, s.openDialog]));

  return (
    <div className="flex items-center gap-2 border-border border-b bg-card p-3">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDialog({ type: "newFolder" })}
          className="h-8"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Folder
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDialog({ type: "upload" })}
          className="h-8"
        >
          <Upload className="mr-1 h-4 w-4" />
          Upload
        </Button>
        <RefreshButton />
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={useStore.getState().handleViewModeToggle}
          className="h-8"
          aria-label="Grid view"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>

        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={useStore.getState().handleViewModeToggle}
          className="h-8"
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      <ThemeSwitch />

      <FilesDropMenu />
    </div>
  );
}
