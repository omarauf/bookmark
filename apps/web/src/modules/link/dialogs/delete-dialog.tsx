import { Loader, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDeleteLinks } from "../hooks/use-link-mutations";

interface DeleteLinksDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  linkIds: string[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteLinksDialog({
  linkIds,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteLinksDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const deleteMutation = useDeleteLinks();

  const onDelete = () => {
    deleteMutation.mutate(
      { ids: linkIds },
      {
        onSuccess: () => {
          props.onOpenChange?.(false);
          onSuccess?.();
        },
      },
    );
  };

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({linkIds.length})
          </Button>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{linkIds.length}</span>
              {linkIds.length === 1 ? " link" : " links"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected links"
              variant="destructive"
              onClick={onDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <Button variant="outline" size="sm">
          <Trash className="mr-2 size-4" aria-hidden="true" />
          Delete ({linkIds.length})
        </Button>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{linkIds.length}</span>
            {linkIds.length === 1 ? " link" : " links"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected links"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
