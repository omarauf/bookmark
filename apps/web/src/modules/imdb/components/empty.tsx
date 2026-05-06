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
import { cn } from "@/lib/utils";

type Props = {
  hasFilter?: boolean;
  className?: string;
};

export function EmptyImdb({ hasFilter, className }: Props) {
  const navigate = useNavigate();

  return (
    <Empty className={cn("border border-dashed", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>[ No IMDB Results Found ]</EmptyTitle>
        <EmptyDescription>
          {hasFilter
            ? "No IMDB results match your search. Try a different keyword."
            : "Get started by searching for your favorite movies or TV shows."}
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
