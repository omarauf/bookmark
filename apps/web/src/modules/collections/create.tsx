import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionSchemas } from "@workspace/contracts/collection";
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
import { ParentSelector } from "./form/parent-selector";
import { CollectionPreview } from "./form/preview";

type Props = {
  parentId?: string;
};

export function CreateCollectionDialog({ parentId }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    orpc.collection.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.collection.all.key() });
        toast.success("Collection created successfully");
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      parentId: parentId || null,
      slug: "",
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      color: "#000000",
      label: "",
    } as z.infer<typeof CollectionSchemas.create.request>,
    validators: { onSubmit: CollectionSchemas.create.request },
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
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl border-none shadow-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>Fill in the details to create a new collection.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmitHandler} className="flex flex-col">
          <div className="custom-scrollbar grid max-h-[60vh] grid-cols-1 gap-5 overflow-y-auto md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <ParentSelector form={form} fields={{ parentId: "parentId", type: "type" }} />
            </div>

            <form.AppField name="label">
              {(field) => <field.Input label="Label" placeholder="Enter collection label" />}
            </form.AppField>

            <form.AppField name="color">{(field) => <field.Color label="Color" />}</form.AppField>

            <div className="col-span-1 md:col-span-2">
              <form.AppField name="slug">
                {(field) => (
                  <field.Input label="Slug (Optional)" placeholder="auto-generated-from-name" />
                )}
              </form.AppField>
            </div>

            <div className="col-span-1 md:col-span-2">
              <form.Subscribe
                selector={(s) => ({
                  parentId: s.values.parentId,
                  slug: s.values.slug,
                  label: s.values.label,
                })}
              >
                {(value) => <CollectionPreview {...value} />}
              </form.Subscribe>
            </div>
          </div>

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
    </Dialog>
  );
}
