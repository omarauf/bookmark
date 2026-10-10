import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { cn } from "cn";
import { Download, ExternalLink, RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/integrations/orpc";
import { getError } from "@/utils/error";
import { YoutubeDownloadDialog } from "../dialogs/download";

type Props = {
  youtube: Youtube;
  className?: string;
};

const mediaActionClassName =
  "size-7 border-white/20 bg-black/80 text-white shadow-sm hover:bg-black/90 hover:text-white";

export function YoutubeMediaActions({ youtube, className }: Props) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const queryClient = useQueryClient();

  const refreshMutation = useMutation(
    orpc.youtube.refresh.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.youtube.list.key() });
        toast.success("Details refreshed");
      },
      onError: (error) => toast.error(getError(error, "Could not refresh details")),
    }),
  );

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={mediaActionClassName}
                onClick={() => refreshMutation.mutate({ id: youtube.id })}
                disabled={refreshMutation.isPending}
              />
            }
          >
            <RotateCw className={refreshMutation.isPending ? "animate-spin" : undefined} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh details</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className={mediaActionClassName}
                onClick={() => setDownloadOpen(true)}
              />
            }
          >
            <Download />
          </TooltipTrigger>
          <TooltipContent side="bottom">Download video</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <a
                href={youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-xs" }),
                  mediaActionClassName,
                )}
              />
            }
          >
            <ExternalLink />
          </TooltipTrigger>
          <TooltipContent side="bottom">Open on YouTube</TooltipContent>
        </Tooltip>
      </div>

      <YoutubeDownloadDialog youtube={youtube} open={downloadOpen} onOpenChange={setDownloadOpen} />
    </>
  );
}
