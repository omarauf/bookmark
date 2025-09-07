import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PopulatedInstagramPost } from "@workspace/contracts/instagram/post";
import { type UpdatePost, UpdatePostSchema } from "@workspace/contracts/post";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { type Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { useAppForm } from "@/components/tanstack-form";
import { Action } from "./action";
import { RenderCaption } from "./caption";
import { CollectionsForm } from "./collection";
import { RenderContent } from "./content";
import { RenderLocation } from "./location";
import { RenderMusic } from "./music";
import { NoteForm } from "./notes";
import { RenderStats } from "./stats";
import { TagForm } from "./tag";
import { UserProfile } from "./user-profile";
import { RenderUserTags } from "./user-tags";

type SubmitRef = { submit: () => Promise<void> };

type Props = {
  posts: PopulatedInstagramPost[];
  selectedPostId?: string;
  onPostChange: (postId: string | undefined) => void;
};

export function PostDialog({ posts, selectedPostId, onPostChange }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const selectedPostRef = useRef<SubmitRef>(null);

  const selectedPost = posts.find((post) => post.postId === selectedPostId);
  const isOpen = !!selectedPost && !isClosing;

  const handleOpenChange = (open: boolean) => {
    if (!open && selectedPost) {
      // Start closing animation
      setIsClosing(true);
    }
    // Don't call onPostChange immediately, wait for animation
  };

  const handleAnimationEnd = async () => {
    if (isClosing) {
      setIsClosing(false);
      // Submit form before closing
      await selectedPostRef.current?.submit();
      onPostChange(undefined);
    }
  };

  const handleNavigation = useCallback(
    async (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!selectedPostId) return;

      const currentIndex = posts.findIndex((post) => post.postId === selectedPostId);
      if (currentIndex === -1) return;

      // Submit current form before navigating
      await selectedPostRef.current?.submit();

      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const targetIndex = currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < posts.length) {
        onPostChange(posts[targetIndex].postId);
      }
    },
    [posts, selectedPostId, onPostChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleNavigation);
    return () => {
      document.removeEventListener("keydown", handleNavigation);
    };
  }, [handleNavigation, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {selectedPost && (
        <DialogContent
          className="pointer-events-none flex h-[95%] w-max max-w-full flex-row sm:max-w-full"
          onAnimationEnd={handleAnimationEnd}
        >
          <DialogForm post={selectedPost} ref={selectedPostRef} />
        </DialogContent>
      )}
    </Dialog>
  );
}

/* -------------------------------------------------------------------------------------------------------- */

type DialogFormProps = {
  post: PopulatedInstagramPost;
  ref?: Ref<SubmitRef>;
};

function DialogForm({ post, ref }: DialogFormProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    orpc.posts.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.instagramPosts.list.key() });
        toast.success("Post updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: postToUpdate(post),
    validators: { onChange: UpdatePostSchema },

    onSubmit: async ({ value, formApi }) => {
      if (!formApi.state.isDirty) return;
      updateMutation.mutateAsync(value);
    },
  });

  useEffect(() => form.reset(postToUpdate(post)), [form.reset, post]);

  useImperativeHandle(ref, () => ({
    async submit() {
      await form.handleSubmit();
    },
  }));

  return (
    <>
      {/* <form
      
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      > */}

      <DialogDescription autoFocus tabIndex={0} className="sr-only">
        Instagram post content
      </DialogDescription>

      <div className="flex w-fit">
        <RenderContent post={post} className="h-full w-full object-cover" />
      </div>

      <div className="w-[500px]">
        <div className="flex h-full flex-col gap-4">
          <UserProfile creator={post.creator} />

          <RenderStats post={post} />

          <RenderCaption caption={post.caption} />

          <RenderLocation location={post.location} />

          <RenderMusic music={post.music} />

          <RenderUserTags userTags={post.userTags} />

          <TagForm form={form} />

          <Action username={post.creator.username} />

          <div className="flex-grow" />

          <CollectionsForm form={form} />

          <NoteForm form={form} />

          <DialogFooter>
            <Button variant="outline" onClick={form.handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        </div>
      </div>
      {/* </form> */}
    </>
  );
}

function postToUpdate(post: PopulatedInstagramPost): UpdatePost {
  return {
    id: post.id,
    note: post.note,
    rate: post.rate,
    tags: post.tags.map((t) => t.id),
    collections: post.collections.map((c) => c.id),
    favorite: post.favorite,
  };
}
