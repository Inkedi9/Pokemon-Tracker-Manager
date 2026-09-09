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

import type {
  CardProfitability,
} from "@/lib/profitability";

import type {
  ProfitabilityChartMode,
} from "@/components/analytics/profitability-chart-controls";

type ProfitabilityChartProps = {
  profitabilities: CardProfitability[];
  mode: ProfitabilityChartMode;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)} %`;
}

function getChartTitle(mode: ProfitabilityChartMode) {
  switch (mode) {
    case "roi":
      return "Top cartes par ROI";

    case "loss":
      return "Top cartes en perte";

    default:
      return "Top cartes par profit";
  }
}

function getChartDescription(
  mode: ProfitabilityChartMode
) {
  switch (mode) {
    case "roi":
      return "Les cartes affichant le meilleur rendement potentiel.";

    case "loss":
      return "Les cartes présentant les pertes potentielles les plus importantes.";

    default:
      return "Les cartes générant le plus de profit potentiel.";
  }
}

export function ProfitabilityChart({
  profitabilities,
  mode,
}: ProfitabilityChartProps) {
  const sorted = [...profitabilities];

  if (mode === "roi") {
    sorted.sort((a, b) => b.roi - a.roi);
  }

  if (mode === "loss") {
    sorted.sort((a, b) => a.profit - b.profit);
  }

  if (mode === "profit") {
    sorted.sort((a, b) => b.profit - a.profit);
  }

  const filtered = sorted.filter((item) => {
    if (mode === "loss") {
      return item.profit < 0;
    }

    if (mode === "roi") {
      return item.invested > 0;
    }

    return item.profit > 0;
  });

  const data = filtered.slice(0, 10).map((item) => ({
    name:
      item.card.name.length > 18
        ? `${item.card.name.slice(0, 18)}…`
        : item.card.name,

    value:
      mode === "roi"
        ? Number(item.roi.toFixed(1))
        : Number(item.profit.toFixed(2)),
  }));

  const isEmpty = data.length === 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div>
        <h3 className="text-xs font-semibold text-zinc-200">
          {getChartTitle(mode)}
        </h3>

        <p className="mt-1 text-[11px] text-zinc-600">
          {getChartDescription(mode)}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex h-[340px] items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-zinc-500">
              Aucune donnée à afficher.
            </p>

            <p className="mt-1 text-[10px] text-zinc-700">
              Modifie le mode d'analyse pour voir d'autres résultats.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 h-[340px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                tick={{
                  fill: "#52525b",
                  fontSize: 10,
                }}
                tickFormatter={(value) =>
                  mode === "roi"
                    ? formatPercent(Number(value))
                    : formatCurrency(Number(value))
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
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value) => [
                  mode === "roi"
                    ? formatPercent(Number(value))
                    : formatCurrency(Number(value)),
                  mode === "roi"
                    ? "ROI"
                    : "Profit",
                ]}
              />

              <Bar
                dataKey="value"
                fill={
                  mode === "loss"
                    ? "#f87171"
                    : mode === "roi"
                      ? "#a78bfa"
                      : "#34d399"
                }
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}