"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SetStatistics } from "@/lib/collection-stats";

type SetProfitChartProps = {
  statistics: SetStatistics[];
};

export function SetProfitChart({
  statistics,
}: SetProfitChartProps) {
  const data = [...statistics]
    .sort((a, b) => b.profit - a.profit)
    .map((set) => ({
      name: set.set,
      profit: set.profit,
    }));

  return (
    <Card className="rounded-xl border-white/10 bg-[#111114]">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-300">
          Profit par extension
        </CardTitle>

        <p className="text-xs text-zinc-600">
          Extensions générant le plus de profit.
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 0,
                right: 16,
                bottom: 0,
                left: 8,
              }}
            >
              <XAxis
                type="number"
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

              <YAxis
                type="category"
                dataKey="name"
                width={100}
                stroke="#52525b"
                tick={{
                  fill: "#a1a1aa",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
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
                  `${Number(value) >= 0 ? "+" : ""}${Number(
                    value
                  ).toFixed(2)} €`,
                  "Profit",
                ]}
              />

              <ReferenceLine
                x={0}
                stroke="#52525b"
              />

              <Bar
                dataKey="profit"
                fill="#34d399"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}