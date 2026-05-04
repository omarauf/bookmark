import type { JobStatus } from "@workspace/contracts/job";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STATUS_COLORS } from "../../badges/job-status";
import { ChartCard } from "./chart-card";

type Props = {
  data: Record<JobStatus, number>[];
};

export function JobOverTime({ data }: Props) {
  return (
    <ChartCard title="Jobs Over Time (30 Days)">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fontFamily: "monospace" }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 10, fontFamily: "monospace" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {value}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke={STATUS_COLORS.completed}
            fill={STATUS_COLORS.completed}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="failed"
            stackId="1"
            stroke={STATUS_COLORS.failed}
            fill={STATUS_COLORS.failed}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="processing"
            stackId="1"
            stroke={STATUS_COLORS.processing}
            fill={STATUS_COLORS.processing}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="pending"
            stackId="1"
            stroke={STATUS_COLORS.pending}
            fill={STATUS_COLORS.pending}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
