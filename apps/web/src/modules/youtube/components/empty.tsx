import { useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  hasFilter?: boolean;
  className?: string;
};

export function EmptyYoutube({ hasFilter, className }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "gap-1 overflow-hidden border-border/50 border-dashed bg-transparent p-0 shadow-none",
        className,
      )}
    >
      {/* Poster Placeholder */}
      <div className="relative aspect-2/3 overflow-hidden bg-muted/50">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <CircleAlert className="h-10 w-10 text-muted-foreground/25" />
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
            Empty
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 p-2">
        <h3 className="font-medium text-foreground text-xs leading-tight">
          No Youtube Results Found
        </h3>

        <p className="text-[10px] text-muted-foreground leading-snug">
          {hasFilter
            ? "No results match your search. Try a different keyword."
            : "Get started by syncing youtube from your MyYoutubeList links."}
        </p>

        {hasFilter && (
          <Button
            variant="outline"
            size="sm"
            className="mt-1 h-7 w-full text-[10px]"
            onClick={() => navigate({ to: ".", search: undefined })}
          >
            Clear Search
          </Button>
        )}
      </div>
    </Card>
  );
}
