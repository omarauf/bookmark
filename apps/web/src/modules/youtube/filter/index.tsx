import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/integrations/orpc";

export function YoutubeFilter() {
  const search = useSearch({ from: "/_authenticated/youtube/" });
  const navigate = useNavigate({ from: "/youtube/" });

  const syncMutation = useMutation(orpc.youtube.sync.mutationOptions());

  const setFilter = (key: string, value: string | undefined | number | boolean) => {
    void navigate({
      search: (prev) => ({ ...prev, [key]: value, page: 1 }),
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-border/50 border-b px-6 py-3">
      <div className="relative min-w-50 max-w-sm flex-1">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search youtube..."
          value={search.q ?? ""}
          onChange={(e) => setFilter("q", e.target.value || undefined)}
          className="h-8 border-border/50 pl-8 text-xs"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 border-border/50 text-[10px]"
        onClick={() => {
          syncMutation.mutate(undefined, {
            onSuccess: () => toast.success("Youtube sync queued"),
            onError: () => toast.error("Failed to queue sync"),
          });
        }}
        disabled={syncMutation.isPending}
      >
        <RotateCcw className="mr-1.5 h-3 w-3" />
        Sync
      </Button>
    </div>
  );
}
