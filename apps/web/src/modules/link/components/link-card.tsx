import type { Link } from "@workspace/contracts/link";
import { ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  link: Link;
  className?: string;
  onSelect?: (link: Link) => void;
};

export function LinkCard({ link, className, onSelect }: Props) {
  const domain = (() => {
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return link.url;
    }
  })();

  const favicon = link.preview?.favicons?.[0];
  const image = link.preview?.images?.[0];
  const title = link.caption || domain;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(link)}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      {!image && (
        <div className="flex aspect-video w-full items-center justify-center bg-muted/50">
          <Globe className="h-10 w-10 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-start gap-2">
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
              loading="lazy"
            />
          ) : (
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="line-clamp-2 font-medium text-sm leading-snug">{title}</span>
        </div>
        <p className="line-clamp-1 text-muted-foreground text-xs">{domain}</p>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 rounded-md bg-background/80 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
      >
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </a>
    </button>
  );
}
