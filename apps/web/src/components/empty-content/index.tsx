import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ElementType;
  show: boolean;
  title?: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyContent({
  icon: Icon,
  title = "No data found",
  description = "There is currently no data to display.",
  action,
  show,
  className,
}: EmptyStateProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="mt-6 font-semibold text-xl">{title}</h3>
      {description && <p className="mt-2 text-muted-foreground text-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
