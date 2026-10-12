import { useQueryClient } from "@tanstack/react-query";
import type { Post } from "@workspace/contracts/views/post";
import { orpc } from "@/integrations/orpc";
import { ItemUpdateForm } from "@/modules/common/form/update-item";

export function PostUpdateForm({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: orpc.post.list.key() });
  };

  return <ItemUpdateForm item={post} onSuccess={onSuccess} />;
}
