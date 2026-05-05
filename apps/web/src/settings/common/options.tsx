import { cn } from "@/lib/utils";

type Option<T extends string | number> = {
  value: T;
  label: string;
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
            "flex items-center justify-center aspect-video rounded-md border border-border cursor-pointer transition-all duration-200",
            "hover:bg-muted hover:border-primary/50 hover:scale-[1.02]",
            "active:scale-[0.98]",
            value === item.value && "ring-2 ring-primary bg-muted",
          )}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
