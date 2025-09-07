import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/api/rpc";

export function LinkPreview({ id }: { id: string }) {
  const { data, error, isLoading } = useQuery(orpc.links.preview.queryOptions({ input: { id } }));
  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading preview...</p>;
  }

  if (error || !data) {
    return <p className="text-destructive text-sm">Failed to load preview.</p>;
  }

  return (
    <div className="w-80 space-y-2">
      {data.images?.[0] && (
        <img
          src={data.images[0]}
          alt={data.title || "Link image"}
          className="h-40 w-full rounded-md object-cover"
        />
      )}

      <div className="space-y-1">
        <p className="line-clamp-1 font-medium text-sm leading-tight">{data.title || data.url}</p>

        <p className="line-clamp-2 text-muted-foreground text-sm">{data.description}</p>

        <div className="mt-2 flex items-center gap-2">
          {data.favicons?.[0] && <img src={data.favicons[0]} alt="favicon" className="h-4 w-4" />}
          <span className="line-clamp-1 text-muted-foreground text-xs">
            {data.siteName || data.url ? new URL(data.url).hostname : id}
          </span>
        </div>
      </div>
    </div>
  );
}
