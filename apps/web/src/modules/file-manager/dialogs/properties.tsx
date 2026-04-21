import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { fSize } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import { useItems } from "../hooks/use-items";
import { useStore } from "../store";

export function PropertiesDialog() {
  const selectedItems = useStore((s) => s.selectedItems);
  const { getItemData } = useItems();

  const firstId = selectedItems.values().next().value;
  const item = firstId ? getItemData(firstId) : undefined;
  const isFolder = item?.type === "folder";

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Properties</DialogTitle>
        <DialogDescription>Details for "{item?.name}"</DialogDescription>
      </DialogHeader>

      {!item ? (
        <div className="py-6 text-center text-muted-foreground text-sm">No item selected</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-muted-foreground text-sm">Name</div>
              <div className="text-sm">{item.name}</div>
            </div>

            <div>
              <div className="font-medium text-muted-foreground text-sm">Type</div>
              <div className="text-sm">{isFolder ? "Folder" : item.type}</div>
            </div>
          </div>

          <Separator />

          {"size" in item && item.size != null && (
            <div>
              <div className="font-medium text-muted-foreground text-sm">Size</div>
              <div className="text-sm">{fSize(item.size)}</div>
            </div>
          )}

          <div>
            <div className="font-medium text-muted-foreground text-sm">Created At</div>
            <div className="text-sm">{fDate(item.createdAt)}</div>
          </div>

          <div>
            <div className="font-medium text-muted-foreground text-sm">ID</div>
            <div className="font-mono text-xs">{item.id}</div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
