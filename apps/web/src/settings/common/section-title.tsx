import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
};

export function SectionTitle({ title, showReset = false, onReset, className }: Props) {
  return (
    <div
      className={cn(
        "mb-2 flex items-center gap-2 font-semibold text-muted-foreground text-sm",
        className,
      )}
    >
      {title}
      {showReset && onReset && (
        <Button size="icon" variant="secondary" className="size-4 rounded-full" onClick={onReset}>
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}
