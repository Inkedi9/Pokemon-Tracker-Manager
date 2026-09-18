"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
    BarChart3,
    Coins,
    Languages,
    Layers3,
    TrendingUp,
    Wallet,
} from "lucide-react";

import {
    filterCollectionProgressSnapshots,
    getCollectionGrowthStats,
    type CollectionProgressRange,
    type CollectionProgressSnapshot,
} from "@/lib/collection-progress";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { ProgressLineChart } from "@/components/insights/progress-line-chart";

type ProgressMetric =
    | "cards"
    | "value"
    | "invested"
    | "sets"
    | "languages";

type CollectionProgressChartProps = {
    snapshots: CollectionProgressSnapshot[];
};

const METRICS: {
    id: ProgressMetric;
    label: string;
    icon: ReactNode;
}[] = [
    {
        id: "cards",
        label: "Cartes",
        icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
        id: "value",
        label: "Valeur",
        icon: <Coins className="h-3.5 w-3.5" />,
    },
    {
        id: "invested",
        label: "Investissement",
        icon: <Wallet className="h-3.5 w-3.5" />,
    },
    {
        id: "sets",
        label: "Extensions",
        icon: <Layers3 className="h-3.5 w-3.5" />,
    },
    {
        id: "languages",
        label: "Langues",
        icon: <Languages className="h-3.5 w-3.5" />,
    },
];

const RANGES: {
    id: CollectionProgressRange;
    label: string;
}[] = [
    {
        id: "7d",
        label: "7 jours",
    },
    {
        id: "30d",
        label: "30 jours",
    },
    {
        id: "90d",
        label: "90 jours",
    },
    {
        id: "all",
        label: "Tout",
    },
];

function getMetricValue(
    snapshot: CollectionProgressSnapshot,
    metric: ProgressMetric
) {
    switch (metric) {
        case "cards":
            return snapshot.totalCards;

        case "value":
            return snapshot.totalValue;

        case "invested":
            return snapshot.totalInvested;

        case "sets":
            return snapshot.totalSets;

        case "languages":
            return snapshot.totalLanguages;
    }
}

function formatValue(
    value: number,
    metric: ProgressMetric
) {
    if (
        metric === "value" ||
        metric === "invested"
    ) {
        return `${value.toFixed(2)} €`;
    }

    return value.toLocaleString("fr-FR");
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatGrowth(value: number) {
    if (value > 0) {
        return `+${value.toFixed(1)} %`;
    }

    if (value < 0) {
        return `${value.toFixed(1)} %`;
    }

    return "0 %";
}

function formatAbsolute(
    value: number,
    type: "number" | "currency"
) {
    if (type === "currency") {
        const sign = value > 0 ? "+" : "";
        return `${sign}${value.toFixed(2)} €`;
    }

    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toLocaleString("fr-FR")}`;
}

function GrowthStat({
    label,
    value,
    percentage,
    icon,
    currency = false,
}: {
    label: string;
    value: number;
    percentage: number;
    icon: ReactNode;
    currency?: boolean;
}) {
    const positive = value > 0;
    const negative = value < 0;

    return (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="text-zinc-500">
                        {icon}
                    </div>

                    <span className="truncate text-xs text-zinc-500">
                        {label}
                    </span>
                </div>

                <TrendingUp
                    className={`h-3.5 w-3.5 ${
                        positive
                            ? "text-emerald-400"
                            : negative
                              ? "rotate-180 text-red-400"
                              : "text-zinc-600"
                    }`}
                />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
                <span
                    className={`text-base font-semibold ${
                        positive
                            ? "text-emerald-400"
                            : negative
                              ? "text-red-400"
                              : "text-zinc-300"
                    }`}
                >
                    {formatAbsolute(
                        value,
                        currency ? "currency" : "number"
                    )}
                </span>

                <span className="text-[11px] text-zinc-600">
                    {formatGrowth(percentage)}
                </span>
            </div>
        </div>
    );
}

export function CollectionProgressChart({
    snapshots,
}: CollectionProgressChartProps) {
    const [metric, setMetric] =
        useState<ProgressMetric>("value");

    const [range, setRange] =
        useState<CollectionProgressRange>("all");

    const filteredSnapshots = useMemo(
        () =>
            filterCollectionProgressSnapshots(
                snapshots,
                range
            ),
        [snapshots, range]
    );

    const chartData = useMemo(
        () =>
            filteredSnapshots.map((snapshot) => ({
                id: snapshot.id,
                date: formatDate(snapshot.date),
                value: getMetricValue(
                    snapshot,
                    metric
                ),
            })),
        [filteredSnapshots, metric]
    );

    const growthStats = useMemo(
        () =>
            getCollectionGrowthStats(
                filteredSnapshots
            ),
        [filteredSnapshots]
    );

    const metricLabel =
        METRICS.find(
            (item) => item.id === metric
        )?.label ?? "Valeur";

    const rangeLabel =
        RANGES.find(
            (item) => item.id === range
        )?.label ?? "Tout";

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/5">
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-zinc-200">
                                    Progression de la collection
                                </h3>

                                <p className="text-xs text-zinc-600">
                                    Évolution historique de ta collection
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Time Range */}
                    <div>
                        <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                            Période
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {RANGES.map((item) => (
                                <Button
                                    key={item.id}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setRange(item.id)
                                    }
                                    className={`h-7 rounded-lg px-2.5 text-[11px] ${
                                        range === item.id
                                            ? "bg-white/[0.08] text-zinc-200"
                                            : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                                    }`}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Metric */}
                    <div>
                        <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                            Indicateur
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {METRICS.map((item) => (
                                <Button
                                    key={item.id}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setMetric(item.id)
                                    }
                                    className={`h-7 rounded-lg px-2.5 text-[11px] ${
                                        metric === item.id
                                            ? "bg-violet-400/10 text-violet-300"
                                            : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Growth statistics */}
                {growthStats && (
                    <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-medium text-zinc-300">
                                    Statistiques de croissance
                                </h4>

                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                    Évolution sur {rangeLabel.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                            <GrowthStat
                                label="Cartes"
                                value={
                                    growthStats.cards.absolute
                                }
                                percentage={
                                    growthStats.cards.percentage
                                }
                                icon={
                                    <BarChart3 className="h-3.5 w-3.5" />
                                }
                            />

                            <GrowthStat
                                label="Valeur"
                                value={
                                    growthStats.value.absolute
                                }
                                percentage={
                                    growthStats.value.percentage
                                }
                                currency
                                icon={
                                    <Coins className="h-3.5 w-3.5" />
                                }
                            />

                            <GrowthStat
                                label="Investissement"
                                value={
                                    growthStats.invested.absolute
                                }
                                percentage={
                                    growthStats.invested.percentage
                                }
                                currency
                                icon={
                                    <Wallet className="h-3.5 w-3.5" />
                                }
                            />

                            <GrowthStat
                                label="Extensions"
                                value={
                                    growthStats.sets.absolute
                                }
                                percentage={
                                    growthStats.sets.percentage
                                }
                                icon={
                                    <Layers3 className="h-3.5 w-3.5" />
                                }
                            />

                            <GrowthStat
                                label="Langues"
                                value={
                                    growthStats.languages.absolute
                                }
                                percentage={
                                    growthStats.languages.percentage
                                }
                                icon={
                                    <Languages className="h-3.5 w-3.5" />
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Chart */}
                <div className="mt-5">
                    {chartData.length < 2 ? (
                        <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-white/10 bg-[#111114]">
                            <div className="text-center">
                                <TrendingUp className="mx-auto h-6 w-6 text-zinc-700" />

                                <p className="mt-3 text-xs text-zinc-500">
                                    Pas encore assez de données
                                </p>

                                <p className="mt-1 max-w-xs text-[10px] text-zinc-700">
                                    Plusieurs snapshots sont nécessaires
                                    pour afficher une évolution.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-zinc-300">
                                        {metricLabel}
                                    </span>

                                    <span className="ml-2 text-[10px] text-zinc-600">
                                        {chartData.length} points
                                    </span>
                                </div>

                                <span className="text-[10px] text-zinc-600">
                                    {rangeLabel}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <div
                                    className="min-w-[620px]"
                                    style={{ height: 280 }}
                                >
                                    <ProgressLineChart
                                        data={chartData}
                                        metric={metric}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-600">
                                <span>
                                    {chartData[0].date}
                                </span>

                                <span className="font-medium text-zinc-400">
                                    {formatValue(
                                        chartData[
                                            chartData.length - 1
                                        ].value,
                                        metric
                                    )}
                                </span>

                                <span>
                                    {
                                        chartData[
                                            chartData.length - 1
                                        ].date
                                    }
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
