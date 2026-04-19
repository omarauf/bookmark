import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FolderTree } from "@workspace/contracts/file-manager";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";
import { useStore } from "../store";

type Props = {
  onClose: () => void;
  itemIds: string[];
};

export function MoveDialog({ onClose, itemIds }: Props) {
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const setSelectedItems = useStore((s) => s.setSelectedItems);

  const folderTreeQuery = useQuery(
    orpc.folder.tree.queryOptions({ input: {} as Record<string, never> }),
  );

  const moveFileMutation = useMutation(orpc.file.move.mutationOptions());
  const moveFolderMutation = useMutation(orpc.folder.move.mutationOptions());

  const handleMove = async () => {
    if (!selectedFolderId) return;

    try {
      await Promise.all(
        itemIds.map((id) =>
          moveFileMutation.mutateAsync({ id, folderId: selectedFolderId }).catch(() => {
            return moveFolderMutation.mutateAsync({ id, parentId: selectedFolderId });
          }),
        ),
      );
      setSelectedItems(new Set());
      queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
      queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
      onClose();
    } catch (error) {
      console.error("Failed to move items", error);
    }
  };

  const isPending = moveFileMutation.isPending || moveFolderMutation.isPending;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {itemIds.length === 1 ? "Move item" : `Move ${itemIds.length} items`}
        </DialogTitle>
        <DialogDescription>Select a destination folder</DialogDescription>
      </DialogHeader>

      <div className="max-h-64 overflow-auto rounded-md border p-2">
        {folderTreeQuery.data?.map((folder) => (
          <FolderTreeItem
            key={folder.id}
            folder={folder as FolderTree}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            itemIds={itemIds}
          />
        ))}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>

        <Button onClick={handleMove} disabled={!selectedFolderId || isPending}>
          {isPending ? "Moving..." : "Move"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

type FolderTreeItemProps = {
  folder: FolderTree;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  itemIds: string[];
  depth?: number;
};

function FolderTreeItem({
  folder,
  selectedFolderId,
  onSelect,
  itemIds,
  depth = 0,
}: FolderTreeItemProps) {
  const isSelected = selectedFolderId === folder.id;
  const isDisabled = itemIds.includes(folder.id);

  return (
    <>
      <button
        type="button"
        className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
          isSelected ? "bg-accent" : ""
        } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => !isDisabled && onSelect(folder.id)}
        disabled={isDisabled}
      >
        <span className="truncate">{folder.name}</span>
      </button>

      {folder.children?.map((child) => (
        <FolderTreeItem
          key={child.id}
          folder={child}
          selectedFolderId={selectedFolderId}
          onSelect={onSelect}
          itemIds={itemIds}
          depth={depth + 1}
        />
      ))}
    </>
  );
}
