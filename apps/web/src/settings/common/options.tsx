import { cn } from "@/lib/utils";

type Option<T extends string | number> = {
  value: T;
  label: string;
  className?: string;
};

type OptionsProps<T extends string | number> = {
  items: readonly Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: number;
  className?: string;
};

export function Options<T extends string | number>({
  items,
  value,
  onChange,
  className,
}: OptionsProps<T>) {
  return (
    <div className={cn("grid w-full gap-4", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            "flex aspect-video cursor-pointer items-center justify-center rounded-md border border-border transition-all duration-200",
            "hover:scale-[1.02] hover:border-primary/50 hover:bg-muted",
            "active:scale-[0.98]",
            value === item.value && "bg-muted ring-2 ring-primary",
            item.className,
          )}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
