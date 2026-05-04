import type { JobType } from "@workspace/contracts/job";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";

type Props = {
  data: Record<JobType, number>;
};

export function JobByType({ data }: Props) {
  const typeData = Object.entries(data).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <ChartCard title="Jobs by Type">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={typeData} layout="vertical" margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fontFamily: "monospace" }} />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 10, fontFamily: "monospace" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          />
          <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
