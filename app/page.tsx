"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  TrendingUp,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollection } from "@/components/collection/collection-provider";
import { LanguageDistribution } from "@/components/dashboard/language-distribution";
import { RarityDistribution } from "@/components/dashboard/rarity-distribution";
import { CollectionHighlights } from "@/components/dashboard/collection-highlights";

import {
  getTotalCards,
  getUniqueCards,
  getTotalInvested,
  getTotalEstimatedValue,
  getTotalProfit,
  getROI,
} from "@/lib/collection-stats";

export default function DashboardPage() {
  const { cards } = useCollection();

  const totalCards = getTotalCards(cards);
  const uniqueCards = getUniqueCards(cards);
  const totalInvested = getTotalInvested(cards);
  const totalValue = getTotalEstimatedValue(cards);
  const totalProfit = getTotalProfit(cards);
  const roi = getROI(cards);

  const isProfitPositive = totalProfit >= 0;

  const valueRatio =
    totalInvested > 0
      ? Math.min((totalValue / totalInvested) * 100, 100)
      : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-yellow-400">
            Collection Overview
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Bienvenue dans ta collection
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Vue d’ensemble de ton inventaire Pokémon.
          </p>
        </div>

        {/* Main statistics */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                <Layers className="h-4 w-4" />
                Cartes
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-white">
                {totalCards}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {uniqueCards} cartes uniques
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                <Wallet className="h-4 w-4" />
                Investissement
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-white">
                {totalInvested.toFixed(2)} €
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                montant total investi
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                <CircleDollarSign className="h-4 w-4" />
                Valeur
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-white">
                {totalValue.toFixed(2)} €
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                valeur estimée actuelle
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                <TrendingUp className="h-4 w-4" />
                Profit
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p
                className={`text-3xl font-bold ${totalProfit >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
                  }`}
              >
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toFixed(2)} €
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                profit potentiel
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <Card className="mt-4 overflow-hidden rounded-xl border-white/10 bg-[#111114]">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Financial Overview
                </CardTitle>

                <p className="mt-1 text-xs text-zinc-600">
                  Performance globale de ta collection
                </p>
              </div>

              <div
                className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs ${isProfitPositive
                  ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-400"
                  : "border-red-400/10 bg-red-400/5 text-red-400"
                  }`}
              >
                {isProfitPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}

                {isProfitPositive ? "+" : ""}
                {roi.toFixed(2)}%
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Current value */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  Valeur actuelle
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {totalValue.toFixed(2)} €
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  estimation de la collection
                </p>
              </div>

              {/* Invested */}
              <div className="md:border-l md:border-white/5 md:pl-6">
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  Total investi
                </p>

                <p className="mt-2 text-3xl font-bold text-zinc-300">
                  {totalInvested.toFixed(2)} €
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  coût d'acquisition
                </p>
              </div>

              {/* Profit */}
              <div className="md:border-l md:border-white/5 md:pl-6">
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  Profit potentiel
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${isProfitPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                    }`}
                >
                  {isProfitPositive ? "+" : ""}
                  {totalProfit.toFixed(2)} €
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  ROI de {roi.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Value progression */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Valeur vs investissement
                </span>

                <span className="text-xs font-medium text-zinc-400">
                  {totalValue.toFixed(2)} € / {totalInvested.toFixed(2)} €
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all ${isProfitPositive
                    ? "bg-emerald-400"
                    : "bg-red-400"
                    }`}
                  style={{
                    width: `${valueRatio}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-zinc-700">
                  Investissement
                </span>

                <span
                  className={`text-[10px] ${isProfitPositive
                    ? "text-emerald-400/70"
                    : "text-red-400/70"
                    }`}
                >
                  {isProfitPositive ? "+" : ""}
                  {totalProfit.toFixed(2)} € de différence
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection highlights */}
        <CollectionHighlights cards={cards} />

        {/* Collection distribution */}
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
          <LanguageDistribution cards={cards} />
          
          <RarityDistribution cards={cards} />
        </div>
      </div>
    </div>
  );
}