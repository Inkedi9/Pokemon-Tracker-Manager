"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { ProfitabilitySummary } from "@/lib/profitability";

type ProfitabilityDistributionChartProps = {
  summary: ProfitabilitySummary;
};

const COLORS = ["#34d399", "#f87171", "#71717a"];

export function ProfitabilityDistributionChart({
  summary,
}: ProfitabilityDistributionChartProps) {
  const data = [
    {
      name: "Rentables",
      value: summary.profitableCards,
    },
    {
      name: "En perte",
      value: summary.unprofitableCards,
    },
    {
      name: "À l'équilibre",
      value: summary.neutralCards,
    },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div>
        <h3 className="text-xs font-semibold text-zinc-200">
          Distribution de la rentabilité
        </h3>

        <p className="mt-1 text-[11px] text-zinc-600">
          Répartition des cartes selon leur profit potentiel.
        </p>
      </div>

      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(value, name) => [
                value,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="rounded-lg border border-white/5 bg-black/10 p-2.5 text-center"
          >
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <span className="text-[10px] text-zinc-600">
                {item.name}
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}