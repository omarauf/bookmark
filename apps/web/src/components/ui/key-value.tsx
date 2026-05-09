import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  values?: string[];
  className?: string;
};

export function KeyValue({ icon, label, value, values, className }: Props) {
  const displayValues = values ?? (value ? [value] : []);
  //   if (displayValues.length === 0) return null;
  const isEmpty = displayValues.length === 0;

  return (
    <div className={cn("p-4", className)}>
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground/60">
        {icon}
        <span className="text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {displayValues.map((v) => (
          <span key={v} className="text-[11px] text-foreground/80">
            {v}
          </span>
        ))}

        {isEmpty && <span className="text-[11px] text-foreground/50">—</span>}
      </div>
    </div>
  );
}
