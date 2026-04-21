import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";
import { useStore } from "../store";

export function useClipboardPaste() {
  const queryClient = useQueryClient();
  const moveMutation = useMutation(orpc.browse.move.mutationOptions());

  const targetFolderId = useSearch({
    from: "/_authenticated/file-manager/",
    select: (s) => s.folderId,
  });

  const handlePaste = async () => {
    const { clipboard, clearClipboard, clearSelection } = useStore.getState();

    if (!clipboard || clipboard.itemIds.size === 0) return;

    const itemIds = [...clipboard.itemIds];
    const sourceFolderId = clipboard.sourceFolderId;
    if (sourceFolderId === targetFolderId) {
      toast.error("Items are already in this folder");
      return;
    }

    try {
      await moveMutation.mutateAsync({ itemIds, sourceFolderId, targetFolderId });
      clearClipboard();
      clearSelection();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() }),
        queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() }),
      ]);
      toast.success(itemIds.length === 1 ? "Item moved" : `${itemIds.length} items moved`);
    } catch (error) {
      toast.error(getError(error, "Failed to move items"));
    }
  };

  return { handlePaste };
}
