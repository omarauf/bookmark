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

type Props = {
  isEmpty: boolean;
};

export function EmptyPosts({ isEmpty }: Props) {
  const navigate = useNavigate();

  if (!isEmpty) return null;

  const resetFilter = () => {
    navigate({ to: ".", search: undefined });
  };

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>No Posts Found</EmptyTitle>
        <EmptyDescription>
          We couldn't find any posts matching your criteria. Try adjusting your filters or check
          back later.
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
