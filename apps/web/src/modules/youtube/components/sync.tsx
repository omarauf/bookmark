import { useMutation } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

export function SyncButton() {
  const [open, setOpen] = useState(false);
  const syncMutation = useMutation(
    orpc.youtube.sync.mutationOptions({
      onSuccess: () => {
        setOpen(false);
        toast.success("YouTube sync queued");
      },
      onError: () => toast.error("Failed to queue sync"),
    }),
  );

  const onOpenChange = (nextOpen: boolean) => {
    if (!syncMutation.isPending) setOpen(nextOpen);
  };

  const onClickSync = () => {
    if (!syncMutation.isPending) syncMutation.mutate(undefined);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="ml-auto"
            disabled={syncMutation.isPending}
          />
        }
      >
        <RotateCcw data-icon="inline-start" />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-black text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Sync YouTube bookmarks?</AlertDialogTitle>
          <AlertDialogDescription render={<div />} className="flex flex-col gap-3">
            <p>
              This creates a background job that scans your saved Chrome bookmarks for new YouTube
              videos. It queues a details-fetch job for each new video and adds it to your library.
            </p>
            <p>After a successful import, the source bookmark is replaced with a YouTube item.</p>
            <p>Existing videos are skipped. Video downloads remain a separate action.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={syncMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClickSync} disabled={syncMutation.isPending}>
            {syncMutation.isPending ? "Creating job..." : "Create sync job"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
