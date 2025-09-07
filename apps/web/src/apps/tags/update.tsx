import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type TagWithCount, type UpdateTag, UpdateTagSchema } from "@workspace/contracts/tag";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { useAppForm } from "@/components/tanstack-form";

type Props = {
  tag: TagWithCount;
};

export function UpdateTagDialog({ tag }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    orpc.tags.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.tags.list.key() });
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
    validators: { onChange: UpdateTagSchema },
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
            <form.AppField name="name">{(field) => <field.TextField label="Name" />}</form.AppField>
            <form.AppField name="color">
              {(field) => <field.TextField label="Color" />}
            </form.AppField>
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
