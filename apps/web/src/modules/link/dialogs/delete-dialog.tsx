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

interface DeleteLinksDialogProps {
  linkIds: string[];
  showTrigger?: boolean;
  onSuccess?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteLinksDialog({
  linkIds,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  open,
  defaultOpen,
}: DeleteLinksDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <DesktopDeleteLinksDialog
        linkIds={linkIds}
        showTrigger={showTrigger}
        onSuccess={onSuccess}
        onOpenChange={onOpenChange}
        open={open}
        defaultOpen={defaultOpen}
      />
    );
  }

  return (
    <MobileDeleteLinksDialog
      linkIds={linkIds}
      showTrigger={showTrigger}
      onSuccess={onSuccess}
      onOpenChange={onOpenChange}
      open={open}
      defaultOpen={defaultOpen}
    />
  );
}

function DesktopDeleteLinksDialog({
  linkIds,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  open,
  defaultOpen,
}: DeleteLinksDialogProps) {
  const deleteMutation = useDeleteLinks();

  const onDelete = () => {
    deleteMutation.mutate(
      { ids: linkIds },
      {
        onSuccess: () => {
          onOpenChange?.(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
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
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
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

function MobileDeleteLinksDialog({
  linkIds,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  open,
  defaultOpen,
}: DeleteLinksDialogProps) {
  const deleteMutation = useDeleteLinks();

  const onDelete = () => {
    deleteMutation.mutate(
      { ids: linkIds },
      {
        onSuccess: () => {
          onOpenChange?.(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
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
