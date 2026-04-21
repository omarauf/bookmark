import { MoreHorizontal } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "../store";

export function FilesDropMenu() {
  const [selectedCount, openDialog] = useStore(
    useShallow((s) => [s.selectedItems.size, s.openDialog]),
  );

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">{selectedCount} selected</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled title="Coming soon">
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog({ type: "move" })}>
            Move to...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openDialog({ type: "rename" })}
            disabled={selectedCount > 1}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => openDialog({ type: "delete" })}
          >
            Delete {selectedCount > 1 ? `${selectedCount} items` : ""}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
