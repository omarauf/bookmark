import { useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyTags({ hasFilter }: { hasFilter: boolean }) {
  const navigate = useNavigate();

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>No Tags Found</EmptyTitle>
        <EmptyDescription>
          {hasFilter
            ? "No tags match your search. Try a different keyword."
            : "Get started by creating your first tag."}
        </EmptyDescription>
      </EmptyHeader>
      {hasFilter && (
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: ".", search: undefined })}
          >
            Clear Search
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
