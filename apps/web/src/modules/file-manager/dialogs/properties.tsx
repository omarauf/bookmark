import { useQuery } from "@tanstack/react-query";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/integrations/orpc";
import { fDate } from "@/utils/format-time";
import { formatFileSize } from "../utils/file-utils";

type Props = {
  onClose: () => void;
  itemId?: string;
};

export function PropertiesDialog({ itemId }: Props) {
  const query = useQuery(
    orpc.file.get.queryOptions({ input: { id: itemId || "" }, enabled: !!itemId }),
  );

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Properties</DialogTitle>
        <DialogDescription>Details for "{query.data?.name}"</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium text-muted-foreground text-sm">Name</div>
            <div className="text-sm">{query.data?.name}</div>
          </div>

          <div>
            <div className="font-medium text-muted-foreground text-sm">Type</div>
            <div className="text-sm capitalize">{query.data?.type}</div>
          </div>
        </div>

        <Separator />

        {query.data?.size && (
          <div>
            <div className="font-medium text-muted-foreground text-sm">Size</div>
            <div className="text-sm">{formatFileSize(query.data?.size)}</div>
          </div>
        )}

        <div>
          <div className="font-medium text-muted-foreground text-sm">Created At</div>
          <div className="text-sm">{fDate(query.data?.createdAt)}</div>
        </div>

        <div>
          <div className="font-medium text-muted-foreground text-sm">ID</div>
          <div className="font-mono text-xs">{query.data?.id}</div>
        </div>
      </div>
    </DialogContent>
  );
}
