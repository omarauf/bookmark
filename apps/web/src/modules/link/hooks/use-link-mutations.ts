import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/integrations/orpc";

export function useDeleteLinks() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.link.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.domains.key() });
      },
    }),
  );
}

export function useMoveLinks() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.link.move.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.folderTree.key() });
      },
    }),
  );
}

export function useFetchPreviews() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.link.fetchPreviews.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
      },
    }),
  );
}

export function useRefreshPreview() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.link.fetchPreview.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.link.tree.key() });
        void queryClient.invalidateQueries({ queryKey: orpc.link.list.key() });
      },
    }),
  );
}
