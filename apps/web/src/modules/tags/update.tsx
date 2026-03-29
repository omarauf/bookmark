import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Tag, TagSchemas, type UpdateTag } from "@workspace/contracts/tag";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/integrations/orpc";

type Props = {
  tag: Tag;
};

export function UpdateTagDialog({ tag }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    orpc.tag.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.tag.list.key() });
        toast.success("Tag updated successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: tag as UpdateTag,
    validators: { onChange: TagSchemas.update.request },
    onSubmit: ({ value }) => updateMutation.mutate(value),
  });

  const openHandler = () => {
    form.reset(tag);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={openHandler}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Pencil size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Tag</DialogTitle>
            <DialogDescription>Update tag with a name and color.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.AppField name="name">{(field) => <field.Input label="Name" />}</form.AppField>
            <form.AppField name="color">{(field) => <field.Input label="Color" />}</form.AppField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form.AppForm>
              <form.SubmitButton>Update</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
