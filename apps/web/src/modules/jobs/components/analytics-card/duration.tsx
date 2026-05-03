import type { JobType } from "@workspace/contracts/job";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";

type Props = {
  data: {
    type: JobType;
    avgMs: number;
    minMs: number;
    maxMs: number;
    count: number;
  }[];
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}

export function AverageDuration({ data }: Props) {
  return (
    <ChartCard title="Average Duration by Type">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fontFamily: "monospace" }}
            tickFormatter={(v: number) => formatDuration(v)}
          />
          <YAxis
            dataKey="type"
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
            formatter={(value) => [formatDuration(Number(value)), "avg"]}
          />
          <Bar dataKey="avgMs" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
