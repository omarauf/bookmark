import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/integrations/orpc";
import { EmptyCollections } from "./components/empty";
import { DeleteCollectionDialog } from "./dialogs/delete";
import { UpdateCollectionDialog } from "./dialogs/update";

export function CollectionTable() {
  const { search } = useSearch({ from: "/_authenticated/collections/" });
  const query = useQuery(orpc.collection.all.queryOptions({ input: { search } }));

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  const collections = query.data;

  if (!collections) {
    return <div>Error: No collections found.</div>;
  }

  if (collections.length === 0) return <EmptyCollections />;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Path</TableHead>
            <TableHead className="w-25">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id} className="group">
              <TableCell className="font-medium">
                <span style={{ paddingLeft: `${(collection.level - 1) * 20}px` }}>
                  {collection.level > 1 && "└─ "}
                  {collection.label}
                </span>
              </TableCell>
              <TableCell>
                <div className="h-4 w-12 rounded" style={{ backgroundColor: collection.color }} />
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {collection.level}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-muted-foreground text-xs">
                {collection.slug}
              </TableCell>
              <TableCell className="font-mono text-muted-foreground text-xs">
                {collection.path}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <UpdateCollectionDialog collection={collection} />
                  <DeleteCollectionDialog collection={collection} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
