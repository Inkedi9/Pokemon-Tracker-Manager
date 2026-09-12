"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CardConcentration } from "@/lib/collection-concentration";

type ConcentrationCardChartProps = {
  cards: CardConcentration[];
};

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

export function ConcentrationCardChart({
  cards,
}: ConcentrationCardChartProps) {
  const data = cards.slice(0, 10).map((item) => ({
    name:
      item.card.name.length > 18
        ? `${item.card.name.slice(0, 18)}…`
        : item.card.name,
    percentage: Number(item.percentage.toFixed(1)),
    value: Number(item.value.toFixed(2)),
  }));

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div>
        <h3 className="text-xs font-semibold text-zinc-200">
          Concentration par carte
        </h3>

        <p className="mt-1 text-[11px] text-zinc-600">
          Part de la valeur totale représentée par les cartes les
          plus importantes.
        </p>
      </div>

      <div className="mt-4 h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 15,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              horizontal={false}
            />

            <XAxis
              type="number"
              domain={[0, "auto"]}
              tick={{
                fill: "#52525b",
                fontSize: 10,
              }}
              tickFormatter={(value) =>
                formatPercent(Number(value))
              }
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{
                fill: "#71717a",
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
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(value, name) => {
                if (name === "percentage") {
                  return [
                    formatPercent(Number(value)),
                    "Part",
                  ];
                }

                return [
                  formatCurrency(Number(value)),
                  "Valeur",
                ];
              }}
            />

            <Bar
              dataKey="percentage"
              fill="#a78bfa"
              radius={[0, 4, 4, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}