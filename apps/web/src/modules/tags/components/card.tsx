import type { Tag } from "@workspace/contracts/tag";
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteTagDialog } from "@/modules/tags/dialogs/delete";
import { UpdateTagDialog } from "@/modules/tags/dialogs/update";

type Props = {
  tag: Tag & { count: number };
  maxCount: number;
};

export function TagCard({ tag, maxCount }: Props) {
  return (
    <Card
      key={tag.id}
      className="group relative cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Left color accent */}
      <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: tag.color }} />

      <CardContent className="relative p-4 pl-5">
        {/* Top row: Tag name + actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="truncate font-bold text-lg">#{tag.name}</span>
            </div>
          </div>

          {/* Actions - visible on hover */}
          <div className="flex shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <UpdateTagDialog tag={tag} />
            <DeleteTagDialog tag={tag} />
          </div>
        </div>

        {/* Count */}
        <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-sm">
          <Bookmark className="h-3.5 w-3.5" />
          <span>
            {tag.count} bookmark{tag.count !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar using tag color */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((tag.count / maxCount) * 100, 100)}%`,
              backgroundColor: tag.color,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
