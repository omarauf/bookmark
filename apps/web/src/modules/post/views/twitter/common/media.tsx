import type { NormalizedMedia } from "@workspace/contracts/media";
import type { Post } from "@workspace/contracts/views/post";
import { staticFile } from "@/api/static-file";
import { cn } from "@/lib/utils";
import { useDisplaySettingsStore } from "@/modules/post/controls/display-setting-store";
import { useAutoPlay } from "@/modules/post/hooks/use-auto-play";

type Props = {
  media: Post["media"];
  className?: string;
};

export function TwitterMediaCard({ media, className }: Props) {
  if (media.length === 0) return null;

  if (media.length === 1) {
    const m = media[0];
    return (
      <RenderMedia
        media={m}
        className={cn(
          "mx-auto max-h-105 rounded-xl border bg-black object-cover",
          m.width / m.height > 1 ? "w-full" : "h-full",
          m.type === "image" && "mx-auto",
          className,
        )}
      />
    );
  }

  if (media.length === 2) {
    return (
      <div
        className={cn(
          "grid max-h-105 min-h-72.5 grid-cols-2 gap-0.5 overflow-hidden rounded-xl",
          className,
        )}
      >
        {media.map((m) => (
          <RenderMedia key={m.key} className="h-full w-full object-cover" media={m} />
        ))}
      </div>
    );
  }

  if (media.length === 3) {
    return (
      <div
        className={cn(
          "grid max-h-105 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl",
          className,
        )}
      >
        {media.map((m, i) => (
          <RenderMedia
            key={m.key}
            className={cn("h-full w-full object-cover", i === 0 && "row-span-2")}
            media={m}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid max-h-105 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl",
        className,
      )}
    >
      {media.map((m) => (
        <RenderMedia
          key={m.key}
          className="h-full w-full bg-black object-cover"
          style={{ aspectRatio: m.width / m.height }}
          media={m}
        />
      ))}
    </div>
  );
}

function RenderMedia({
  media,
  className,
  style,
}: {
  media: NormalizedMedia;
  className?: string;
  style?: React.CSSProperties;
}) {
  const autoPlay = useDisplaySettingsStore((s) => s.autoPlay);
  const videoRef = useAutoPlay(autoPlay);

  if (media.type === "video") {
    return (
      <video
        src={staticFile(media.key)}
        controls
        className={className}
        style={style}
        ref={videoRef}
      />
    );
  }

  return <img src={staticFile(media.key)} loading="lazy" className={className} style={style} />;
}

// function RenderMedia({ media, className }: { media: NormalizedMedia; className?: string }) {
//   const [isPlaying, setIsPlaying] = useState(true);

//   const aspectRatio = (media.height / media.width) * 100;

//   return (
//     <div
//       className={cn("relative w-full", className)}
//       style={{ aspectRatio: `${media.width}/${media.height}` }}
//     >
//       {/* IMAGE */}
//       {media.type === "image" && (
//         <img src={staticFile(media.key)} loading="lazy" className="h-full w-full object-cover" />
//       )}

//       {/* VIDEO */}
//       {media.type === "video" &&
//         (!isPlaying ? (
//           <div onClick={() => setIsPlaying(true)} className="cursor-pointer">
//             <img
//               src={staticFile(media.thumbnail)}
//               alt="video thumbnail"
//               className="h-full w-full object-cover"
//             />

//             {/* Play button */}
//             <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/60 p-3">
//               <Play className="fill-white" />
//             </div>
//           </div>
//         ) : (
//           <video
//             src={staticFile(media.key)}
//             controls
//             // autoPlay
//             className="h-full w-full bg-black object-cover"
//           />
//         ))}
//     </div>
//   );
// }
