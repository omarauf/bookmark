import { Card } from "@/components/ui/card";

type Props = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
};

export function MetricCard({ label, value, icon, accent }: Props) {
  return (
    <Card className="flex flex-col gap-2 border border-border/50 bg-transparent p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-3xl tracking-tighter ${accent ?? "text-foreground"}`}>{value}</span>
    </Card>
  );
}
