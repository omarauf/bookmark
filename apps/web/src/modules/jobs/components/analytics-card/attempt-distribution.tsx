import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";

type Props = {
  data: {
    attempts: number;
    count: number;
  }[];
};

export function AttemptDistribution({ data }: Props) {
  return (
    <ChartCard title="Attempt Distribution">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="attempts"
            tick={{ fontSize: 10, fontFamily: "monospace" }}
            label={{
              value: "Attempts",
              position: "insideBottom",
              offset: -2,
              style: { fontSize: 10, fontFamily: "monospace" },
            }}
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
          <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
