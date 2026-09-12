"use client";

import {
  AlertTriangle,
  Layers3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  CollectionConcentration,
} from "@/lib/collection-concentration";

type ConcentrationOverviewProps = {
  concentration: CollectionConcentration;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)} %`;
}

function getConcentrationLevel(
  percentage: number
) {
  if (percentage >= 70) {
    return {
      label: "Très concentrée",
      description:
        "Une grande partie de la valeur repose sur quelques cartes.",
      className:
        "border-red-400/20 bg-red-400/5 text-red-300",
      icon: AlertTriangle,
    };
  }

  if (percentage >= 50) {
    return {
      label: "Concentrée",
      description:
        "Quelques cartes représentent une part importante de la valeur.",
      className:
        "border-amber-400/20 bg-amber-400/5 text-amber-300",
      icon: AlertTriangle,
    };
  }

  if (percentage >= 30) {
    return {
      label: "Modérée",
      description:
        "La valeur est répartie entre plusieurs cartes.",
      className:
        "border-violet-400/20 bg-violet-400/5 text-violet-300",
      icon: TrendingUp,
    };
  }

  return {
    label: "Diversifiée",
    description:
      "La valeur est relativement bien répartie.",
    className:
      "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
    icon: ShieldCheck,
  };
}

export function ConcentrationOverview({
  concentration,
}: ConcentrationOverviewProps) {
  const concentrationLevel =
    getConcentrationLevel(
      concentration.top5Percentage
    );

  const ConcentrationIcon =
    concentrationLevel.icon;

  const topSets =
    concentration.setDistribution.slice(0, 5);

  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-violet-400" />

          <h2 className="text-sm font-semibold text-zinc-200">
            Collection Concentration
          </h2>

          <Badge
            variant="outline"
            className="border-violet-400/20 bg-violet-400/5 text-violet-300"
          >
            Répartition
          </Badge>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Analyse de la concentration de la valeur de ta
          collection.
        </p>
      </div>

      {/* Concentration level */}
      <Card
        className={`border ${concentrationLevel.className}`}
      >
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-current/20 bg-black/10">
              <ConcentrationIcon className="h-4 w-4" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold">
                  Concentration : {concentrationLevel.label}
                </p>

                <Badge
                  variant="outline"
                  className="border-current/20 bg-black/10 text-[9px]"
                >
                  Top 5 · {formatPercent(concentration.top5Percentage)}
                </Badge>
              </div>

              <p className="mt-1 text-[11px] opacity-70">
                {concentrationLevel.description}
              </p>
            </div>
          </div>
          <div className="mt-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-current transition-all"
                style={{
                  width: `${Math.min(
                    concentration.top5Percentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top cards */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Top 1 carte
              </p>

              <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {formatPercent(
                concentration.top1Percentage
              )}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              {formatCurrency(
                concentration.top1Value
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Top 5 cartes
              </p>

              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {formatPercent(
                concentration.top5Percentage
              )}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              {formatCurrency(
                concentration.top5Value
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Top 10 cartes
              </p>

              <Layers3 className="h-3.5 w-3.5 text-blue-400" />
            </div>

            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {formatPercent(
                concentration.top10Percentage
              )}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              {formatCurrency(
                concentration.top10Value
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top card / top set */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {concentration.topCard && (
          <Card className="border-white/10 bg-white/[0.02]">
            <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
              <CardTitle className="text-xs font-semibold text-zinc-200">
                Carte dominante
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {concentration.topCard.card.name}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-600">
                    {concentration.topCard.card.set} ·{" "}
                    {concentration.topCard.card.number}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="shrink-0 border-violet-400/20 bg-violet-400/5 text-violet-300"
                >
                  {formatPercent(
                    concentration.topCard.percentage
                  )}
                </Badge>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Valeur totale
                  </p>

                  <p className="mt-1 text-xl font-semibold text-zinc-100">
                    {formatCurrency(
                      concentration.topCard.value
                    )}
                  </p>
                </div>

                <p className="text-[11px] text-zinc-600">
                  ×{concentration.topCard.card.quantity}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {concentration.topSet && (
          <Card className="border-white/10 bg-white/[0.02]">
            <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
              <CardTitle className="text-xs font-semibold text-zinc-200">
                Extension dominante
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {concentration.topSet.name}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-600">
                    Extension représentant la plus grosse part de
                    la valeur.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                >
                  {formatPercent(
                    concentration.topSet.percentage
                  )}
                </Badge>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Valeur
                  </p>

                  <p className="mt-1 text-xl font-semibold text-zinc-100">
                    {formatCurrency(
                      concentration.topSet.value
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Top 3 extensions
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-300">
                    {formatPercent(
                      concentration.top3SetPercentage
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Set distribution */}
      {topSets.length > 0 && (
        <Card className="mt-3 border-white/10 bg-white/[0.02]">
          <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xs font-semibold text-zinc-200">
                  Répartition par extension
                </CardTitle>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Les extensions représentant le plus de valeur.
                </p>
              </div>

              <Badge
                variant="outline"
                className="border-white/10 text-zinc-500"
              >
                Top {topSets.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {topSets.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/[0.02] text-[10px] font-medium text-zinc-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {item.name}
                    </p>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-violet-400/70 transition-all"
                        style={{
                          width: `${Math.min(
                            item.percentage,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-zinc-200">
                      {formatPercent(
                        item.percentage
                      )}
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      {formatCurrency(item.value)}
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