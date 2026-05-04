import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-none border-border/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
          <Layers className="h-3.5 w-3.5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
