import type { Post } from "@workspace/contracts/post";
import { staticFile } from "@/api/static-file";
import { cn } from "@/lib/utils";

type Props = {
  media: Post["media"];
  className?: string;
};

export function TwitterMediaCard({ media, className }: Props) {
  if (media.length === 0) return null;

  if (media.length === 1) {
    const m = media[0];
    return (
      <img
        className={cn(
          "max-h-105 rounded-2xl border bg-black object-cover",
          m.width / m.height > 1 ? "w-full" : "h-full",
          m.type === "image" && "mx-auto",
          className,
        )}
        src={staticFile(m.type === "image" ? m.key : m.thumbnail)}
        alt="media-0"
      />
    );
  }

  if (media.length === 2) {
    return (
      <div
        className={cn(
          "grid h-full max-h-105 min-h-72.5 grid-cols-2 gap-0.5 overflow-hidden rounded-2xl",
          className,
        )}
      >
        {media.map((m, i) => (
          <img
            key={m.key}
            className="h-full w-full object-cover"
            src={staticFile(m.type === "image" ? m.key : m.thumbnail)}
            alt={`media-${i}`}
          />
        ))}
      </div>
    );
  }

  if (media.length === 3) {
    return (
      <div
        className={cn(
          "grid max-h-105 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl",
          className,
        )}
      >
        {media.map((m, i) => (
          <img
            key={m.key}
            className={cn("h-full w-full object-cover", i === 0 && "row-span-2")}
            src={staticFile(m.type === "image" ? m.key : m.thumbnail)}
            alt={`media-${i}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid max-h-105 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl",
        className,
      )}
    >
      {media.map((m, i) => (
        <img
          key={m.key}
          className="h-full w-full bg-black object-cover"
          style={{ aspectRatio: m.width / m.height }}
          src={staticFile(m.type === "image" ? m.key : m.thumbnail)}
          alt={`media-${i}`}
        />
      ))}
    </div>
  );
}
