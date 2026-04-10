import { useShallow } from "zustand/react/shallow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CARD_MIN_WIDTH } from "../card/constant";
import { useDisplaySettingsStore } from "../controls/display-setting-store";

type Props = {
  count: number;
};

export function LoadingCards({ count }: Props) {
  const [aspectRatio, showCardInfo, cardSize] = useDisplaySettingsStore(
    useShallow((s) => [s.aspectRatio, s.showCardInfo, s.cardSize]),
  );

  const cardMinWidth = CARD_MIN_WIDTH[cardSize];

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "overflow-hidden rounded-xl",
            { S: "rounded-sm", M: "rounded-md", L: "rounded-lg" }[cardSize],
          )}
        >
          <div
            className={cn(
              "bg-muted",
              {
                landscape: "aspect-video",
                square: "aspect-square",
                portrait: "aspect-3/4",
              }[aspectRatio],
            )}
          />

          {showCardInfo && (
            <div className="flex flex-row items-center justify-between bg-sidebar px-1 py-2">
              <Skeleton className="h-8 w-8 rounded-full bg-muted" />
              <Skeleton className="h-4 w-18 rounded bg-muted" />
            </div>
          )}
        </Skeleton>
      ))}
    </div>
  );
}
