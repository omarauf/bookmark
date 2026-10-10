import { useKeyHold } from "@tanstack/react-hotkeys";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ListYoutube } from "@workspace/contracts/views/youtube";
import { Eye, Pencil, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orpc } from "@/integrations/orpc";

const sortOptions = [
  { value: "createdAt", label: "Recently added" },
  { value: "publishedAt", label: "Newest published" },
  { value: "views", label: "Most viewed" },
  { value: "duration", label: "Shortest first" },
] satisfies { value: NonNullable<ListYoutube["sortBy"]>; label: string }[];

export function YoutubeFilter() {
  const updateMode = useKeyHold("Control");
  const search = useSearch({ from: "/_authenticated/youtube/" });
  const navigate = useNavigate({ from: "/youtube/" });

  const syncMutation = useMutation(orpc.youtube.sync.mutationOptions());

  const setFilter = <K extends "q" | "downloadStatus" | "sortBy">(
    key: K,
    value: ListYoutube[K],
  ) => {
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

      <Tabs
        value={search.downloadStatus ?? "both"}
        onValueChange={(value) =>
          setFilter(
            "downloadStatus",
            value === "downloaded" || value === "not_downloaded" ? value : undefined,
          )
        }
      >
        <TabsList aria-label="Download status">
          <TabsTrigger value="both">Both</TabsTrigger>
          <TabsTrigger value="downloaded">Downloaded</TabsTrigger>
          <TabsTrigger value="not_downloaded">Not downloaded</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select
        items={sortOptions}
        value={search.sortBy ?? "createdAt"}
        onValueChange={(value) => {
          if (value) setFilter("sortBy", value === "createdAt" ? undefined : value);
        }}
      >
        <SelectTrigger aria-label="Sort videos">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        className="ml-auto h-8 border-border/50 text-[10px]"
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

      <Badge
        variant={updateMode ? "default" : "secondary"}
        className="aspect-square h-full rounded-md"
      >
        {updateMode ? <Pencil /> : <Eye />}
      </Badge>
    </div>
  );
}
