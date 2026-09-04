"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

import type { PokemonCard } from "@/types/card";
import { getLanguageBreakdown } from "@/lib/collection-stats";

type LanguageDistributionProps = {
  cards: PokemonCard[];
};

const LANGUAGE_COLORS: Record<string, string> = {
  FR: "#f59e0b",
  EN: "#3b82f6",
  JP: "#ef4444",
  KR: "#8b5cf6",
  DE: "#22c55e",
  ES: "#ec4899",
  IT: "#06b6d4",
};

export function LanguageDistribution({
  cards,
}: LanguageDistributionProps) {
  const breakdown = getLanguageBreakdown(cards);

  const data = Object.entries(breakdown).map(
    ([language, quantity]) => ({
      language,
      quantity,
    })
  );

  const total = data.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Card className="rounded-xl border-white/10 bg-[#111114]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Répartition par langue
        </CardTitle>

        <p className="text-xs text-zinc-600">
          Distribution de ta collection par langue
        </p>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-zinc-600">
              Aucune carte dans la collection.
            </p>
          </div>
        ) : (
          <div className="grid items-center gap-6 md:grid-cols-2">
            {/* Chart */}
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="quantity"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.language}
                        fill={
                          LANGUAGE_COLORS[entry.language] ??
                          "#71717a"
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111114",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${value} cartes`,
                      "Quantité",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {total}
                </span>

                <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                  cartes
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {data.map((item) => {
                const percentage =
                  total > 0
                    ? (item.quantity / total) * 100
                    : 0;

                const color =
                  LANGUAGE_COLORS[item.language] ??
                  "#71717a";

                return (
                  <div
                    key={item.language}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: color,
                        }}
                      />

                      <span className="text-sm font-medium text-zinc-300">
                        {item.language}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {item.quantity}
                      </p>

                      <p className="text-[10px] text-zinc-600">
                        {percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}