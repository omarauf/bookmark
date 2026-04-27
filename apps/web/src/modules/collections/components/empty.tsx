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

export function EmptyCollections() {
  const navigate = useNavigate();

  const resetFilter = () => {
    navigate({ to: ".", search: undefined });
  };

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>No Collections Found</EmptyTitle>
        <EmptyDescription>
          We couldn't find any collections matching your criteria. Try adjusting your filters or
          check back later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={resetFilter}>
          Reset Filter
        </Button>
      </EmptyContent>
    </Empty>
  );
}
