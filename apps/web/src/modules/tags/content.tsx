import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { orpc } from "@/integrations/orpc";
import { TagCard } from "./components/card";
import { EmptyTags } from "./components/empty";
import { PopularTags } from "./components/popular";
import { TagSkeletons } from "./components/tag-skeleton";

type Props = {
  className?: string;
};

export function TagContent({ className }: Props) {
  const { search } = useSearch({ from: "/_authenticated/tags/" });

  const tagsQuery = useQuery(orpc.tag.list.queryOptions());
  const allTags = tagsQuery.data;

  const filteredTags = useMemo(() => {
    if (!search?.trim()) return allTags || [];
    const term = search?.trim().toLowerCase();
    return allTags?.filter((tag) => tag.name.toLowerCase().includes(term)) || [];
  }, [allTags, search]);

  const maxCount = useMemo(() => Math.max(1, ...filteredTags.map((t) => t.count)), [filteredTags]);

  if (tagsQuery.isLoading) {
    return <TagSkeletons className={className} />;
  }

  if (filteredTags.length === 0) {
    return <EmptyTags hasFilter={!!search?.trim().length} className={className} />;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredTags.map((tag) => (
          <TagCard key={tag.id} tag={tag} maxCount={maxCount} />
        ))}
      </div>

      <PopularTags search={search} filteredTags={filteredTags} className="mt-6" />
    </div>
  );
}
