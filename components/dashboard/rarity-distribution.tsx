"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Layers } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { PokemonCard } from "@/types/card";
import { getRarityBreakdown } from "@/lib/collection-stats";

type RarityDistributionProps = {
  cards: PokemonCard[];
};

export function RarityDistribution({
  cards,
}: RarityDistributionProps) {
  const breakdown = getRarityBreakdown(cards);

  const data = Object.entries(breakdown)
    .map(([rarity, quantity]) => ({
      rarity,
      quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <Card className="rounded-xl border-white/10 bg-[#111114]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
          <Layers className="h-4 w-4 text-violet-400" />
          Répartition par rareté
        </CardTitle>

        <p className="text-xs text-zinc-600">
          Nombre de cartes par niveau de rareté
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 12,
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
                />

                <YAxis
                  type="category"
                  dataKey="rarity"
                  width={85}
                  stroke="#52525b"
                  tick={{
                    fill: "#a1a1aa",
                    fontSize: 11,
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

                <Bar
                  dataKey="quantity"
                  fill="#a78bfa"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}