import type { Collection } from "@workspace/contracts/collection";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteCollectionDialog } from "./delete";
import { UpdateCollectionDialog } from "./update";

type Props = {
  collections: Collection[];
};

export function CollectionTable({ collections }: Props) {
  if (collections.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No collections found</p>
      </div>
    );
  }

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
