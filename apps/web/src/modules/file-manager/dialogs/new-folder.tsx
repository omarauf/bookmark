import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type React from "react";
import { useId } from "react";
import { toast } from "sonner";
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
import { getError } from "@/utils/error";

type Props = {
  onClose: () => void;
};

export function NewFolderDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const formId = useId();

  const folderId = useSearch({ from: "/_authenticated/file-manager/", select: (s) => s.folderId });
  const createMutation = useMutation(orpc.folder.create.mutationOptions());

  const form = useAppForm({
    formId,
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({ name: value.name.trim(), parentId: folderId });
        await queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
        await queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
        onClose();
        toast.success("Folder created successfully");
      } catch (error) {
        const msg = getError(error, "An error occurred while creating the folder.");
        toast.error(msg);
      }
    },
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogDescription>Enter a name for the new folder</DialogDescription>
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
            <form.SubmitButton>Create</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
