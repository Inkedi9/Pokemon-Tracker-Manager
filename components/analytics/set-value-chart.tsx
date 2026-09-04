"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SetStatistics } from "@/lib/collection-stats";

type SetValueChartProps = {
  statistics: SetStatistics[];
};

export function SetValueChart({
  statistics,
}: SetValueChartProps) {
  const data = statistics.map((set) => ({
    name: set.set,
    value: set.estimatedValue,
  }));

  return (
    <Card className="rounded-xl border-white/10 bg-[#111114]">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-300">
          Valeur par extension
        </CardTitle>

        <p className="text-xs text-zinc-600">
          Valeur estimée de chaque extension.
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 8,
                right: 12,
                bottom: 8,
                left: 0,
              }}
            >
              <XAxis
                dataKey="name"
                stroke="#52525b"
                tick={{
                  fill: "#71717a",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />

              <YAxis
                stroke="#52525b"
                tick={{
                  fill: "#71717a",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `${value} €`
                }
              />

              <Tooltip
                cursor={{
                  fill: "rgba(255,255,255,0.03)",
                }}
                contentStyle={{
                  backgroundColor: "#111114",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{
                  color: "#fff",
                }}
                formatter={(value) => [
                  `${Number(value).toFixed(2)} €`,
                  "Valeur",
                ]}
              />

              <Bar
                dataKey="value"
                fill="#a78bfa"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}