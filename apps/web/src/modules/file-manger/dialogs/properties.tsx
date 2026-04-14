import { useShallow } from "zustand/shallow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useStore } from "../store";
import { formatDate, formatFileSize } from "../utils/file-utils";

export function PropertiesDialog() {
  const [open, item, onOpenChange] = useStore(
    useShallow((s) => [s.properties.open, s.properties.item, s.toggleProperties]),
  );

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Properties</DialogTitle>
          <DialogDescription>Details for "{item.name}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-muted-foreground text-sm">Name</div>
              <div className="text-sm">{item.name}</div>
            </div>

            <div>
              <div className="font-medium text-muted-foreground text-sm">Type</div>
              <div className="text-sm capitalize">{item.type}</div>
            </div>
          </div>

          <Separator />

          {item.type === "file" && item.size && (
            <div>
              <div className="font-medium text-muted-foreground text-sm">Size</div>
              <div className="text-sm">{formatFileSize(item.size)}</div>
            </div>
          )}

          <div>
            <div className="font-medium text-muted-foreground text-sm">Modified</div>
            <div className="text-sm">{formatDate(item.modifiedAt)}</div>
          </div>

          <div>
            <div className="font-medium text-muted-foreground text-sm">ID</div>
            <div className="font-mono text-xs">{item.id}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
