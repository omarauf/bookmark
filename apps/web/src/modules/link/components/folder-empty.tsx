import { Globe } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyFolder() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Globe />
        </EmptyMedia>
        <EmptyTitle>No links here</EmptyTitle>
        <EmptyDescription>
          This folder is empty. Navigate to a different folder or add some bookmarks.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
