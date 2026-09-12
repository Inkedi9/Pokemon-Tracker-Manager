"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { ConcentrationItem } from "@/lib/collection-concentration";

type ConcentrationSetChartProps = {
  sets: ConcentrationItem[];
};

const COLORS = [
  "#a78bfa",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
];

function formatPercent(value: number) {
  return `${value.toFixed(1)} %`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ConcentrationSetChart({
  sets,
}: ConcentrationSetChartProps) {
  const data = sets.slice(0, 5);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div>
        <h3 className="text-xs font-semibold text-zinc-200">
          Concentration par extension
        </h3>

        <p className="mt-1 text-[11px] text-zinc-600">
          Répartition de la valeur entre les extensions principales.
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
              innerRadius={62}
              outerRadius={92}
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
                formatCurrency(Number(value)),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length],
              }}
            />

            <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-500">
              {item.name}
            </span>

            <span className="text-[10px] font-medium text-zinc-300">
              {formatPercent(item.percentage)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}