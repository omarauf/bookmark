import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { EmptyTags } from "@/modules/tags/components/empty";
import { CreateTagDialog } from "@/modules/tags/dialogs/create";
import { DeleteTagDialog } from "@/modules/tags/dialogs/delete";
import { UpdateTagDialog } from "@/modules/tags/update";

export const Route = createFileRoute("/_authenticated/tags/")({
  component: Tags,
  loader: async ({ context: { orpc, queryClient } }) => {
    await queryClient.ensureQueryData(orpc.tag.list.queryOptions({ input: {} }));
    return;
  },
});

function Tags() {
  const [search, setSearch] = useState("");

  const tagsQuery = useSuspenseQuery(orpc.tag.list.queryOptions({ input: {} }));
  const allTags = tagsQuery.data;

  const filteredTags = useMemo(() => {
    if (!search.trim()) return allTags;
    const term = search.trim().toLowerCase();
    return allTags.filter((tag) => tag.name.toLowerCase().includes(term));
  }, [allTags, search]);

  const maxCount = useMemo(() => Math.max(1, ...filteredTags.map((t) => t.count)), [filteredTags]);

  const handleTagClick = () => {
    // navigate({ to: "/instagram", search: { tags: [tagId] } });
  };

  return (
    <Main>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-3xl">All Tags</h1>
              <p className="text-muted-foreground">Organize and explore your bookmarks by tags</p>
            </div>
          </div>
          <CreateTagDialog />
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tags Grid */}
      {filteredTags.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredTags.map((tag) => (
            <Card key={tag.id} className="py-0 transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    aria-hidden="true"
                    className="group min-w-0 flex-1 cursor-pointer"
                    onClick={() => handleTagClick()}
                  >
                    <Badge
                      variant="secondary"
                      className="font-medium text-xs transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: tag.color }}
                    >
                      #{tag.name}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <UpdateTagDialog tag={tag} />
                    <DeleteTagDialog tag={tag} />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {tag.count} bookmark{tag.count !== 1 ? "s" : ""}
                  </span>
                  <div className="ml-3 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-300"
                      style={{
                        width: `${Math.min((tag.count / maxCount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyTags hasFilter={search.trim().length > 0} />
      )}

      {/* Popular Tags Section */}
      {search === "" && filteredTags.length > 0 && (
        <div className="mt-12">
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
                  onClick={() => handleTagClick()}
                >
                  #{tag.name} ({tag.count})
                </Badge>
              ))}
          </div>
        </div>
      )}
    </Main>
  );
}
