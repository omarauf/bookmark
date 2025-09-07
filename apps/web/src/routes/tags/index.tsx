import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListTagSchema } from "@workspace/contracts/tag";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Hash, Search, Tag, TrendingUp } from "lucide-react";
import { orpc } from "@/api/rpc";
import { UpdateTagDialog } from "@/apps/tags/update";

export const Route = createFileRoute("/tags/")({
  component: Tags,
  validateSearch: ListTagSchema,
  loaderDeps: ({ search: { name, sortBy } }) => ({ name, sortBy }),
  loader: async ({ context: { orpc, queryClient }, deps: { name, sortBy } }) => {
    await Promise.all([
      queryClient.ensureQueryData(orpc.tags.list.queryOptions({ input: { name, sortBy } })),
      queryClient.ensureQueryData(orpc.posts.insights.queryOptions()),
    ]);
    return;
  },
});

function Tags() {
  const { name, sortBy } = Route.useSearch();
  const navigate = Route.useNavigate();

  const tagsQuery = useSuspenseQuery(orpc.tags.list.queryOptions({ input: { name, sortBy } }));
  const postsInsightsQuery = useSuspenseQuery(orpc.posts.insights.queryOptions());

  const totalTags = tagsQuery.data.length;
  const totalBookmarks = postsInsightsQuery.data;
  const averageBookmarksPerTag = Math.round(totalBookmarks / totalTags);

  const handleTagClick = (tagId: string) => {
    navigate({ to: "/instagram", search: { tags: [tagId] } });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-3xl">All Tags</h1>
            <p className="text-muted-foreground">Organize and explore your bookmarks by tags</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="py-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-bold text-2xl">{totalTags}</p>
                  <p className="text-muted-foreground text-sm">Total Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-bold text-2xl">{postsInsightsQuery.data}</p>
                  <p className="text-muted-foreground text-sm">Total Bookmarks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-bold text-2xl">{averageBookmarksPerTag}</p>
                  <p className="text-muted-foreground text-sm">Avg per Tag</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={name}
            onChange={(e) => navigate({ search: { name: e.target.value } })}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "count" ? "default" : "outline"}
            size="sm"
            onClick={() => navigate({ search: { name, sortBy: "count" } })}
          >
            Sort by Count
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => navigate({ search: { name, sortBy: "name" } })}
          >
            Sort by Name
          </Button>
        </div>
      </div>

      {/* Tags Grid */}
      {tagsQuery.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tagsQuery.data.map((tag) => (
            <Card key={tag.id} className="py-0 transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    aria-hidden="true"
                    className="group min-w-0 flex-1 cursor-pointer"
                    onClick={() => handleTagClick(tag.id)}
                  >
                    <Badge
                      variant="secondary"
                      className={
                        "font-medium text-xs transition-transform duration-200 group-hover:scale-105"
                      }
                      style={{ backgroundColor: tag.color }}
                    >
                      #{tag.name}
                    </Badge>
                  </div>
                  <UpdateTagDialog tag={tag} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {tag.count} bookmark{tag.count !== 1 ? "s" : ""}
                  </span>
                  <div className="ml-3 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-300"
                      style={{
                        width: `${Math.min((tag.count / Math.max(...tagsQuery.data.map((t) => t.count))) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-0">
          <CardContent className="p-8 text-center">
            <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No tags found</h3>
            <p className="text-muted-foreground">
              {name ? `No tags match "${name}"` : "No tags available"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular Tags Section */}
      {name === "" && (
        <div className="mt-12">
          <h2 className="mb-4 font-semibold text-xl">Most Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tagsQuery.data.slice(0, 10).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer px-3 py-1 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleTagClick(tag.name)}
              >
                #{tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
