"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SetStatistics } from "@/lib/collection-stats";

type SetInvestmentChartProps = {
  statistics: SetStatistics[];
};

export function SetInvestmentChart({
  statistics,
}: SetInvestmentChartProps) {
  const data = statistics.map((set) => ({
    name: set.set,
    invested: set.invested,
    value: set.estimatedValue,
  }));

  return (
    <Card className="rounded-xl border-white/10 bg-[#111114]">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-300">
          Investissement vs valeur
        </CardTitle>

        <p className="text-xs text-zinc-600">
          Comparaison entre ton investissement et la
          valeur estimée.
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
                formatter={(value, name) => [
                  `${Number(value).toFixed(2)} €`,
                  name === "invested"
                    ? "Investi"
                    : "Valeur",
                ]}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "11px",
                  color: "#71717a",
                }}
                formatter={(value) =>
                  value === "invested"
                    ? "Investi"
                    : "Valeur"
                }
              />

              <Bar
                dataKey="invested"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />

              <Bar
                dataKey="value"
                fill="#a78bfa"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}