import { Link } from "@tanstack/react-router";
import type { CollectionWithCount } from "@workspace/contracts/collection";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CreateUpdateCollection } from "./create-update";
import { DeleteCollection } from "./delete";

type Props = {
  collection: CollectionWithCount;
};

export function CollectionCard({ collection }: Props) {
  return (
    <Card key={collection.id} className="gap-4 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: collection.color }}
              aria-hidden="true"
            />
            <CardTitle className="text-xl">{collection.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{collection.count || 0}</Badge>
            <CreateUpdateCollection collection={collection} />
            <DeleteCollection collection={collection} />
          </div>
        </div>
        <CardDescription>
          {collection.count || 0} {collection.count === 1 ? "post" : "posts"} in this collection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Color: <code className="rounded bg-muted px-1 py-0.5 text-xs">{collection.color}</code>
          </div>
          <Link
            to="/instagram"
            search={{ collections: [collection.id] }}
            className="font-medium text-sm underline underline-offset-4"
          >
            View all
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
