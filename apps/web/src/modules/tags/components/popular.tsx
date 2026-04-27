import type { Tag } from "@workspace/contracts/tag";
import { Badge } from "@/components/ui/badge";

type Props = {
  search?: string;
  filteredTags: (Tag & { count: number })[];
  className?: string;
};

export function PopularTags({ search, filteredTags, className }: Props) {
  if (!search?.trim() && filteredTags.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="mb-4 font-semibold text-xl">Most Popular Tags</h2>
      <div className="flex flex-wrap gap-2">
        {filteredTags
          .slice()
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
          .map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="cursor-pointer px-3 py-1 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              #{tag.name} ({tag.count})
            </Badge>
          ))}
      </div>
    </div>
  );
}
