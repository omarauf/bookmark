import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import type { Scrape } from "@workspace/contracts/scrape";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { orpc } from "@/integrations/orpc";

interface Props {
  scrapes: Row<Scrape>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteScrapesDialog({
  scrapes,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  open,
  defaultOpen,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.scrape.delete.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: orpc.scrape.list.key() });
        toast.success("Scrapes deleted successfully");
        onOpenChange?.(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onDelete = () => {
    deleteMutation.mutate({ id: scrapes.map((scrapeItem) => scrapeItem.id)[0] });
  };

  if (isDesktop) {
    return (
      <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {showTrigger ? (
          <DialogTrigger
            render={
              <Button variant="outline" size="sm">
                <Trash className="mr-2 size-4" aria-hidden="true" />
                Delete ({scrapes.length})
              </Button>
            }
          />
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{scrapes.length}</span>
              {scrapes.length === 1 ? " scrape" : " scrapes"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              aria-label="Delete selected rows"
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
    <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({scrapes.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{scrapes.length}</span>
            {scrapes.length === 1 ? " scrape" : " scrapes"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
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
