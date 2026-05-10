import { useQueryClient } from "@tanstack/react-query";
import { Grid3X3, List, Plus, Upload } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { RefreshButton } from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/integrations/orpc";
import { ThemeSwitch } from "@/theme/theme-switch";
import { useStore } from "../store";
import { FilesDropMenu } from "./drop-menu";

export function Toolbar() {
  const [viewMode, openDialog] = useStore(useShallow((s) => [s.viewMode, s.openDialog]));
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() }),
      queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() }),
    ]);
  };

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

        <RefreshButton onRefresh={onRefresh} />
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
