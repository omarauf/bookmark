type Props = {
  folderCount?: number;
  linkCount?: number;
};

export function LinkSkeletons({ folderCount = 10, linkCount = 13 }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: folderCount }).map((_, i) => (
          <FolderCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: linkCount }).map((_, i) => (
          <LinkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function LinkCardSkeleton() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      {/* Image / Preview */}
      <div className="aspect-video w-full animate-pulse bg-muted" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start gap-2">
          {/* Favicon */}
          <div className="h-4 w-4 shrink-0 animate-pulse rounded-sm bg-muted" />

          {/* Title lines */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Domain */}
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
      </div>

      {/* External link icon placeholder */}
      <div className="absolute top-2 right-2 h-6 w-6 animate-pulse rounded-md bg-muted/80" />
    </div>
  );
}

function FolderCardSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
      {/* Folder icon placeholder */}
      <div className="h-8 w-8 animate-pulse rounded bg-muted" />

      {/* Name lines */}
      <div className="flex w-full flex-col items-center gap-1">
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
