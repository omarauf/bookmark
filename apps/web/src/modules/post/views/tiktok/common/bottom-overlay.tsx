import { cn } from "@/lib/utils";
import { Caption } from "./caption";
import { usePostContext } from "./context";

type Props = {
  className?: string;
  captionClassName?: string;
};

export function BottomOverlay({ className, captionClassName }: Props) {
  const { creator } = usePostContext();

  return (
    <div
      className={cn(
        "absolute right-0 bottom-0 left-0 z-20 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pb-6 text-white",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <a
          href={`https://www.tiktok.com/@${creator.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit font-semibold text-sm hover:underline"
        >
          @{creator.username}
        </a>
        <Caption className={captionClassName} />
      </div>
    </div>
  );
}
