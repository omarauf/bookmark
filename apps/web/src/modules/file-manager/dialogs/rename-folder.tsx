import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BrowseItem } from "@workspace/contracts/file-manager";
import type React from "react";
import { useEffect, useId } from "react";
import { useAppForm } from "@/components/form";
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

type Props = {
  onClose: () => void;
  item: BrowseItem;
};

export function RenameFolderDialog({ onClose, item }: Props) {
  const queryClient = useQueryClient();

  const mutate = useMutation(orpc.folder.rename.mutationOptions());
  const formId = useId();

  const form = useAppForm({
    formId,
    defaultValues: item,
    onSubmit: async ({ value }) => {
      try {
        await mutate.mutateAsync(value);
        queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
        queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
        onClose();
      } catch (error) {
        console.error("Rename failed:", error);
      }
    },
  });

  useEffect(() => form.reset(item), [form.reset, item]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogDescription>Enter a new name</DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmitHandler}>
        <form.AppField name="name">
          {(field) => <field.Input placeholder="Enter name..." />}
        </form.AppField>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <form.AppForm>
            <form.SubmitButton>Rename</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
