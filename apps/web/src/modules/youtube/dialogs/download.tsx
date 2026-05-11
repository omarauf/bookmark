import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { Youtube } from "@workspace/contracts/views/youtube";
import { AudioLines, Download, Film, HardDrive, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/integrations/orpc";
import { fData } from "@/utils/format-number";

type Props = {
  youtube: Youtube;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function YoutubeDownloadDialog({ youtube, open, onOpenChange }: Props) {
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);

  const formatsQuery = useQuery(
    orpc.youtube.listFormats.queryOptions({ input: { id: youtube.id }, enabled: open }),
  );

  const downloadMutation = useMutation(orpc.youtube.download.mutationOptions());

  const formats = formatsQuery.data?.formats ?? [];

  // Prefer formats with both video and audio, then video-only
  const sortedFormats = [...formats].sort((a, b) => {
    const aScore = (a.hasVideo ? 2 : 0) + (a.hasAudio ? 1 : 0);
    const bScore = (b.hasVideo ? 2 : 0) + (b.hasAudio ? 1 : 0);
    if (bScore !== aScore) return bScore - aScore;
    const aRes = parseInt(a.resolution, 10) || 0;
    const bRes = parseInt(b.resolution, 10) || 0;
    return bRes - aRes;
  });

  const handleDownload = () => {
    if (!selectedFormatId) return;

    downloadMutation.mutate(
      { id: youtube.id, formatId: selectedFormatId },
      {
        onSuccess: ({ jobId }) => {
          toast.success(
            <div className="flex flex-col gap-1">
              <span>Upload queued for processing.</span>
              <Link
                to="/jobs/$id"
                params={{ id: jobId }}
                className="text-primary text-xs underline"
              >
                View job {jobId.slice(0, 8)}…
              </Link>
            </div>,
          );
          onOpenChange(false);
          setSelectedFormatId(null);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to queue download";
          toast.error(message);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-auto max-h-[85vh] w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background p-0 shadow-2xl sm:max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-border/50 border-b p-5 text-left">
          <DialogTitle className="font-semibold text-foreground text-sm">
            Download Video
          </DialogTitle>
          <DialogDescription className="text-[10px] text-muted-foreground">
            {youtube.caption ?? youtube.externalId}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {formatsQuery.isLoading ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-12">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Loading formats...</span>
            </div>
          ) : formatsQuery.isError ? (
            <div className="flex flex-1 items-center justify-center py-12 text-[11px] text-muted-foreground">
              Failed to load formats
            </div>
          ) : sortedFormats.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12 text-[11px] text-muted-foreground">
              No formats available
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10" />
                    <TableHead className="text-[10px] uppercase tracking-wider">Quality</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Ext</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Size</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Codecs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFormats.map((format) => (
                    <TableRow
                      key={format.formatId}
                      data-state={selectedFormatId === format.formatId ? "selected" : undefined}
                      className="cursor-pointer"
                      onClick={() => setSelectedFormatId(format.formatId)}
                    >
                      <TableCell className="py-1.5">
                        <div
                          className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                            selectedFormatId === format.formatId
                              ? "border-foreground bg-foreground"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {selectedFormatId === format.formatId && (
                            <div className="h-1.5 w-1.5 rounded-full bg-background" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {format.hasVideo && <Film className="h-3 w-3 text-muted-foreground/60" />}
                          <span>{format.qualityLabel || format.resolution}</span>
                          {format.hasAudio && format.hasVideo && (
                            <span className="rounded-sm bg-muted/60 px-1 py-0 text-[9px] text-muted-foreground">
                              audio
                            </span>
                          )}
                          {!format.hasAudio && format.hasVideo && (
                            <span className="flex items-center gap-0.5 rounded-sm bg-emerald-500/10 px-1 py-0 text-[9px] text-emerald-600">
                              <AudioLines className="h-2.5 w-2.5" />
                              audio auto-merged
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 text-[11px] text-muted-foreground uppercase">
                        {format.ext}
                      </TableCell>
                      <TableCell className="py-1.5 text-[11px] text-muted-foreground">
                        {format.filesize ? (
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {fData(format.filesize)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="py-1.5 text-[10px] text-muted-foreground/70">
                        <span className="inline-block max-w-35 truncate">
                          {format.vcodec !== "unknown" ? format.vcodec : "—"}
                          {format.acodec !== "unknown" && format.hasAudio
                            ? ` / ${format.acodec}`
                            : ""}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>

        {sortedFormats.some((f) => f.hasVideo && !f.hasAudio) && (
          <div className="flex items-center gap-1.5 border-border/50 border-t px-5 py-2 text-[10px] text-muted-foreground/70">
            <AudioLines className="h-3 w-3 text-emerald-500" />
            <span>
              Video-only formats will be automatically merged with the best available audio stream.
            </span>
          </div>
        )}

        <DialogFooter className="border-border/50 border-t p-5">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs"
            disabled={!selectedFormatId || downloadMutation.isPending}
            onClick={handleDownload}
          >
            {downloadMutation.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Queuing...
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3 w-3" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
