import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { FolderTree } from "@workspace/contracts/file-manager";
import { FolderIcon, FolderOpenIcon, Home, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TreeView } from "@/components/tree";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";
import { useStore } from "../store";

type MappedFolderTree = {
  value: string;
  label: string;
  children: MappedFolderTree[];
  disabled?: boolean;
};

function mapFolderTree(node: FolderTree, disabledIds: Set<string>): MappedFolderTree {
  return {
    value: node.id,
    label: node.name,
    disabled: disabledIds.has(node.id),
    children: (node.children ?? []).map((child) => mapFolderTree(child as FolderTree, disabledIds)),
  };
}

type Props = {
  onClose: () => void;
};

export function MoveDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const selectedItems = useStore((s) => s.selectedItems);
  const setSelectedItems = useStore((s) => s.setSelectedItems);
  const currentFolderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  const folderTreeQuery = useQuery(
    orpc.folder.tree.queryOptions({ input: {} as Record<string, never> }),
  );

  const moveMutation = useMutation(orpc.browse.move.mutationOptions());

  const selectedIds = [...selectedItems];
  const disabledIds = selectedItems;
  const treeData = (folderTreeQuery.data ?? []).map((folder) =>
    mapFolderTree(folder as FolderTree, disabledIds),
  );

  const isPending = moveMutation.isPending;

  const handleMove = async () => {
    try {
      await moveMutation.mutateAsync({
        itemIds: selectedIds,
        sourceFolderId: currentFolderId ?? undefined,
        targetFolderId: targetFolderId ?? undefined,
      });

      setSelectedItems(new Set());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() }),
        queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() }),
      ]);
      toast.success(selectedIds.length === 1 ? "Item moved" : `${selectedIds.length} items moved`);
      onClose();
    } catch (error) {
      toast.error(getError(error, "Failed to move items"));
    }
  };

  const isRootSelected = targetFolderId === null;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {selectedIds.length === 1 ? "Move item" : `Move ${selectedIds.length} items`}
        </DialogTitle>
        <DialogDescription>Choose a destination folder</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setTargetFolderId(null)}
          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
            isRootSelected
              ? "bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Root</span>
        </button>

        <ScrollArea className="h-64 rounded-md border">
          {folderTreeQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : treeData.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">No folders found</div>
          ) : (
            <TreeView
              data={treeData}
              value={targetFolderId ?? []}
              onPathChange={(path) => {
                const last = path.at(-1);
                if (last) setTargetFolderId(last);
              }}
              className="py-1"
              autoCollapse={false}
              syncOpenWithValue
              iconRender={({ expanded }) =>
                expanded ? (
                  <FolderOpenIcon className="h-4 w-4 shrink-0 text-amber-500" />
                ) : (
                  <FolderIcon className="h-4 w-4 shrink-0 text-amber-500" />
                )
              }
            />
          )}
        </ScrollArea>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>

        <Button onClick={handleMove} disabled={isPending}>
          {isPending ? "Moving..." : "Move here"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
