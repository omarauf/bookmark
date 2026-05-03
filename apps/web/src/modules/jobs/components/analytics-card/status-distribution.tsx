import type { JobStatus } from "@workspace/contracts/job";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_COLORS } from "../../badges/job-status";
import { ChartCard } from "./chart-card";

type Props = {
  data: Record<JobStatus, number>;
};

export function StatusDistributionCard({ data }: Props) {
  const statusData = (Object.keys(STATUS_COLORS) as JobStatus[]).map((status) => ({
    name: status,
    value: data[status] ?? 0,
    color: STATUS_COLORS[status],
  }));

  return (
    <ChartCard title="Status Distribution">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {statusData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value: string) => (
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
