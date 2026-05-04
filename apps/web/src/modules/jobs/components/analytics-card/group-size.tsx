import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./chart-card";

type Props = {
  data: {
    name: string;
    count: number;
  }[];
};

export function GroupSize({ data }: Props) {
  return (
    <ChartCard title="Top Groups by Size">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fontFamily: "monospace" }} />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
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
          <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
