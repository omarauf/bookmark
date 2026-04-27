import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
  loader: async ({ context: { orpc, queryClient } }) => {
    await queryClient.ensureQueryData(orpc.tag.list.queryOptions({ input: {} }));
    return;
  },
});

function Dashboard() {
  const tagsQuery = useSuspenseQuery(orpc.tag.list.queryOptions({ input: {} }));
  const tags = tagsQuery.data;

  const totalItems = tags.reduce((sum, t) => sum + t.count, 0);
  const topTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <Main>
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tags and bookmarks</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{tags.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Tagged Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Most Used Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {topTags[0] ? (
                <span style={{ color: topTags[0].color }}>#{topTags[0].name}</span>
              ) : (
                "—"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-xl">Tags</h2>
        <Link to="/tags" className="font-medium text-primary text-sm hover:underline">
          View all
        </Link>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tags.map((tag) => (
            <Card key={tag.id} className="py-0 transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="font-medium text-xs"
                    style={{ backgroundColor: tag.color }}
                  >
                    #{tag.name}
                  </Badge>
                  <span className="text-muted-foreground text-sm">{tag.count}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((tag.count / Math.max(...tags.map((t) => t.count))) * 100, 100)}%`,
                      backgroundColor: tag.color,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-0">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No tags yet</h3>
            <p className="text-muted-foreground">
              Create tags to organize your bookmarks. Go to the{" "}
              <Link to="/tags" className="text-primary hover:underline">
                Tags page
              </Link>{" "}
              to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-semibold text-xl">Top Tags</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer px-3 py-1 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                style={{ borderColor: tag.color }}
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
