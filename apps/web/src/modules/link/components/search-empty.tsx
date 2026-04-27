import { useNavigate } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
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
  query: string;
  className?: string;
};

export function SearchEmpty({ query, className }: Props) {
  const navigate = useNavigate();

  return (
    <Empty className={cn("border border-dashed", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t find any links matching &quot;
          <span className="font-medium text-foreground">{query}</span>&quot;. Try a different search
          term.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: ".", search: undefined })}
        >
          Clear Search
        </Button>
      </EmptyContent>
    </Empty>
  );
}
