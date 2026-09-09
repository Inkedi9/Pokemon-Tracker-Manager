"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  CardProfitability,
  ProfitabilitySummary,
} from "@/lib/profitability";

type ProfitabilityOverviewProps = {
  summary: ProfitabilitySummary;
  profitabilities: CardProfitability[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)} %`;
}

export function ProfitabilityOverview({
  summary,
  profitabilities,
}: ProfitabilityOverviewProps) {
  const topCards = profitabilities.slice(0, 5);

  const isProfitable = summary.totalProfit > 0;
  const isNeutral = summary.totalProfit === 0;

  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-emerald-400" />

          <h2 className="text-sm font-semibold text-zinc-200">
            Profitability Analysis
          </h2>

          <Badge
            variant="outline"
            className="border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
          >
            Potentiel
          </Badge>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Performance potentielle de ta collection basée sur la
          valeur estimée actuelle.
        </p>
      </div>

      {/* Main metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-600">
              <Wallet className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                Capital investi
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {formatCurrency(summary.totalInvested)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-600">
              <TrendingUp className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                Valeur actuelle
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {formatCurrency(summary.totalEstimatedValue)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-white/10 ${
            isProfitable
              ? "bg-emerald-400/[0.03]"
              : isNeutral
                ? "bg-white/[0.02]"
                : "bg-red-400/[0.03]"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-600">
              {isProfitable ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
              )}

              <span className="text-[10px] uppercase tracking-wider">
                Profit potentiel
              </span>
            </div>

            <p
              className={`mt-2 text-lg font-semibold ${
                isProfitable
                  ? "text-emerald-300"
                  : isNeutral
                    ? "text-zinc-100"
                    : "text-red-300"
              }`}
            >
              {formatCurrency(summary.totalProfit)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-zinc-600">
              <TrendingUp className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                ROI global
              </span>
            </div>

            <p
              className={`mt-2 text-lg font-semibold ${
                summary.roi > 0
                  ? "text-emerald-300"
                  : summary.roi < 0
                    ? "text-red-300"
                    : "text-zinc-100"
              }`}
            >
              {formatPercent(summary.roi)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance distribution */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Rentables
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {summary.profitableCards}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10">
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                En perte
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {summary.unprofitableCards}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
              <Coins className="h-4 w-4 text-zinc-500" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                À l'équilibre
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {summary.neutralCards}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best / worst */}
      {(summary.bestCard || summary.worstCard) && (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {summary.bestCard && (
            <Card className="border-emerald-400/10 bg-emerald-400/[0.02]">
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                  Meilleur profit
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {summary.bestCard.card.name}
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      {summary.bestCard.card.set} ·{" "}
                      {summary.bestCard.card.number}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-emerald-300">
                      +{formatCurrency(summary.bestCard.profit)}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      ROI {formatPercent(summary.bestCard.roi)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {summary.worstCard && (
            <Card className="border-red-400/10 bg-red-400/[0.02]">
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                  Plus grosse perte
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {summary.worstCard.card.name}
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      {summary.worstCard.card.set} ·{" "}
                      {summary.worstCard.card.number}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-red-300">
                      {formatCurrency(summary.worstCard.profit)}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      ROI {formatPercent(summary.worstCard.roi)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Top profitable cards */}
      {topCards.length > 0 && (
        <Card className="mt-3 border-white/10 bg-white/[0.02]">
          <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xs font-semibold text-zinc-200">
                  Cartes les plus rentables
                </CardTitle>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Classement par profit potentiel total.
                </p>
              </div>

              <Badge
                variant="outline"
                className="border-white/10 text-zinc-500"
              >
                Top {topCards.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {topCards.map((item, index) => (
                <div
                  key={item.card.id}
                  className="flex items-center gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/[0.02] text-[10px] font-medium text-zinc-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {item.card.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                      {item.card.set} · {item.card.number}
                      {" · "}
                      ×{item.card.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-xs font-semibold ${
                        item.profit >= 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {item.profit >= 0 ? "+" : ""}
                      {formatCurrency(item.profit)}
                    </p>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        item.roi >= 0
                          ? "text-emerald-400/70"
                          : "text-red-400/70"
                      }`}
                    >
                      {formatPercent(item.roi)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}