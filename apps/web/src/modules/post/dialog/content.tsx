import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemSchemas } from "@workspace/contracts/item";
import type { Post } from "@workspace/contracts/post";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { orpc } from "@/integrations/orpc";
import { Action } from "./components/action";
import { Caption } from "./components/caption";
import { CollectionsForm } from "./components/collection";
import { CreatorProfile } from "./components/creator-profile";
import { Location } from "./components/location";
import { Media } from "./components/media";
import { Music } from "./components/music";
import { NoteForm } from "./components/notes";
import { OpenPost } from "./components/open-post";
import { Statistics } from "./components/stats";
import { TagForm } from "./components/tag";
import { PostContext } from "./utils/context";
import { formOpts } from "./utils/form-options";
import { postToUpdate } from "./utils/post-mapper";

type Props = {
  post: Post;
};

export function Content({ post }: Props) {
  const queryClient = useQueryClient();
  console.log("Form");

  const updateMutation = useMutation(
    orpc.item.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.post.list.key() });
        toast.success("Post updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    ...formOpts,
    defaultValues: postToUpdate(post),
    validators: { onChange: ItemSchemas.update.request },
    listeners: {
      onChange({ formApi }) {
        const values = formApi.state.values;
        updateMutation.mutateAsync(values);
      },
      onChangeDebounceMs: 1500,
    },
  });

  useEffect(() => form.reset(postToUpdate(post)), [form.reset, post]);

  return (
    <PostContext.Provider value={post}>
      <div className="flex w-fit">
        <Media className="h-full w-full object-cover" />
      </div>

      <div className="w-125">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <CreatorProfile />

            <OpenPost />
          </div>

          <Statistics />

          <Caption />

          <Location />

          <Music />

          {/*<RenderUserTags userTags={post.userTags} /> */}

          <TagForm form={form} />

          <Action username={post.creator.username} />

          <div className="grow" />

          <CollectionsForm form={form} />

          <NoteForm form={form} />
        </div>
      </div>
    </PostContext.Provider>
  );
}
