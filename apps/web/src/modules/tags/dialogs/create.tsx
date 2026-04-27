import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TagSchemas } from "@workspace/contracts/tag";
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";

export function CreateTagDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    orpc.tag.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.tag.list.key() });
        toast.success("Tag created successfully");
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      color: "#000000",
    } as z.infer<typeof TagSchemas.create.request>,
    validators: { onSubmit: TagSchemas.create.request },
    onSubmit: async ({ value }) => await mutateAsync(value),
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  const onOpenHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Create Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>Create a new tag with a name and color.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmitHandler}>
          <div className="grid gap-4 py-4">
            <form.AppField name="name">
              {(field) => <field.Input label="Name" placeholder="Enter tag name" />}
            </form.AppField>

            <form.AppField name="color">{(field) => <field.Color label="Color" />}</form.AppField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
