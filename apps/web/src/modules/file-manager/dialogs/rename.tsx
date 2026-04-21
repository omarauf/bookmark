import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useItems } from "../hooks/use-items";
import { useStore } from "../store";

type Props = {
  onClose: () => void;
};

export function RenameDialog({ onClose }: Props) {
  const queryClient = useQueryClient();
  const selectedItemIds = useStore((s) => s.selectedItems);
  const { getItemData } = useItems();

  const iterator = selectedItemIds.values();
  const first = iterator.next();

  const item = getItemData(first.value || "");
  const fileMutate = useMutation(orpc.file.rename.mutationOptions());
  const folderMutate = useMutation(orpc.folder.rename.mutationOptions());
  const formId = useId();
  const type = item?.type === "folder" ? "folder" : "file";

  const form = useAppForm({
    formId,
    defaultValues: item,
    onSubmit: async ({ value }) => {
      try {
        if (type === "folder") {
          await folderMutate.mutateAsync(value);
          await queryClient.invalidateQueries({ queryKey: orpc.folder.tree.key() });
        } else {
          await fileMutate.mutateAsync(value);
        }
        await queryClient.invalidateQueries({ queryKey: orpc.browse.list.key() });
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

  if (item === undefined) return null;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Rename {type === "folder" ? "Folder" : "File"}</DialogTitle>
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
