"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    Layers3,
    TrendingUp,
} from "lucide-react";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollection } from "@/components/collection/collection-provider";

import {
    AnalyticsChartControls,
    type ChartLimit,
} from "@/components/analytics/analytics-chart-controls";

import { SetValueChart } from "@/components/analytics/set-value-chart";
import { SetInvestmentChart } from "@/components/analytics/set-investment-chart";
import { SetProfitChart } from "@/components/analytics/set-profit-chart";

import { DuplicateDetection } from "@/components/analytics/duplicate-detection";

import {
    getDuplicateGroups,
    getDuplicateSummary,
} from "@/lib/duplicate-detection";

import {
    getSetStatistics,
    type SetStatistics,
} from "@/lib/collection-stats";

import {
    ProfitabilityOverview,
} from "@/components/analytics/profitability-overview";

import {
    getCardProfitabilities,
    getProfitabilitySummary,
} from "@/lib/profitability";

import { ProfitabilityChart } from "@/components/analytics/profitability-chart";
import { ProfitabilityDistributionChart } from "@/components/analytics/profitability-distribution-chart";

import {
    ProfitabilityChartControls,
    type ProfitabilityChartMode,
} from "@/components/analytics/profitability-chart-controls";

function formatCurrency(value: number) {
    return `${value.toFixed(2)} €`;
}

function formatPercent(value: number) {
    return `${value.toFixed(1)} %`;
}

export default function AnalyticsPage() {

    const [chartLimit, setChartLimit] = useState<ChartLimit>(10);

    const [profitabilityChartMode, setProfitabilityChartMode] =
        useState<ProfitabilityChartMode>("profit");

    const { cards } = useCollection();

    const statistics = getSetStatistics(cards);

    const totalInvested = statistics.reduce(
        (total, set) => total + set.invested,
        0
    );

    const totalValue = statistics.reduce(
        (total, set) => total + set.estimatedValue,
        0
    );

    const totalProfit = totalValue - totalInvested;

    const bestSet = [...statistics].sort(
        (a, b) => b.profit - a.profit
    )[0];

    const mostValuableSet = statistics[0];

    const chartStatistics = useMemo(() => {
        if (chartLimit === "all") {
            return statistics;
        }

        return statistics.slice(0, chartLimit);
    }, [statistics, chartLimit]);

    const duplicateGroups = useMemo(
        () => getDuplicateGroups(cards),
        [cards]
    );

    const profitabilities = useMemo(
        () => getCardProfitabilities(cards),
        [cards]
    );

    const profitabilitySummary = useMemo(
        () => getProfitabilitySummary(cards),
        [cards]
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                            <TrendingUp className="h-5 w-5 text-violet-400" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Analytics
                            </h1>

                            <p className="mt-1 text-sm text-zinc-500">
                                Analyse détaillée de ta collection par extension.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="rounded-xl border-white/10 bg-[#111114]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-500">
                                    Extensions
                                </p>

                                <Layers3 className="h-4 w-4 text-violet-400" />
                            </div>

                            <p className="mt-3 text-2xl font-bold text-white">
                                {statistics.length}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                extensions représentées
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-white/10 bg-[#111114]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-500">
                                    Investissement
                                </p>

                                <TrendingUp className="h-4 w-4 text-blue-400" />
                            </div>

                            <p className="mt-3 text-2xl font-bold text-white">
                                {formatCurrency(totalInvested)}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                montant total investi
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-white/10 bg-[#111114]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-500">
                                    Valeur estimée
                                </p>

                                <Layers3 className="h-4 w-4 text-yellow-400" />
                            </div>

                            <p className="mt-3 text-2xl font-bold text-white">
                                {formatCurrency(totalValue)}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                valeur actuelle estimée
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-white/10 bg-[#111114]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-500">
                                    Profit estimé
                                </p>

                                {totalProfit >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                                )}
                            </div>

                            <p
                                className={`mt-3 text-2xl font-bold ${totalProfit >= 0
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                    }`}
                            >
                                {totalProfit >= 0 ? "+" : ""}
                                {formatCurrency(totalProfit)}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                différence valeur / investissement
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Highlights */}
                {statistics.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-2">
                        <Card className="rounded-xl border-white/10 bg-[#111114]">
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-300">
                                    Extension la plus valorisée
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-end justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-lg font-semibold text-white">
                                            {mostValuableSet.set}
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            {mostValuableSet.totalCards} cartes ·{" "}
                                            {mostValuableSet.uniqueCards} références
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-lg font-bold text-white">
                                        {formatCurrency(
                                            mostValuableSet.estimatedValue
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border-white/10 bg-[#111114]">
                            <CardHeader>
                                <CardTitle className="text-sm text-zinc-300">
                                    Extension la plus rentable
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-end justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-lg font-semibold text-white">
                                            {bestSet.set}
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            ROI de {formatPercent(bestSet.roi)}
                                        </p>
                                    </div>

                                    <p
                                        className={`shrink-0 text-lg font-bold ${bestSet.profit >= 0
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {bestSet.profit >= 0 ? "+" : ""}
                                        {formatCurrency(bestSet.profit)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Charts */}
                {statistics.length > 0 && (
                    <section className="mt-4">
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-200">
                                    Analyse graphique
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Comparaison des performances de tes extensions
                                </p>
                            </div>

                            <AnalyticsChartControls
                                value={chartLimit}
                                onChange={setChartLimit}
                            />
                        </div>

                        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                            <SetValueChart statistics={chartStatistics} />

                            <SetInvestmentChart statistics={chartStatistics} />

                            <div className="lg:col-span-2">
                                <SetProfitChart statistics={chartStatistics} />
                            </div>
                        </div>
                    </section>
                )}

                <DuplicateDetection groups={duplicateGroups} />

                {/* Extension table */}
                <Card className="mt-4 rounded-xl border-white/10 bg-[#111114]">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-300">
                            Analyse par extension
                        </CardTitle>

                        <p className="text-xs text-zinc-600">
                            Vue détaillée de la performance de chaque extension.
                        </p>
                    </CardHeader>

                    <CardContent>
                        {statistics.length === 0 ? (
                            <div className="flex min-h-48 items-center justify-center">
                                <p className="text-sm text-zinc-600">
                                    Aucune donnée disponible.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[760px] text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-3 text-xs font-medium text-zinc-600">
                                                    Extension
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    Cartes
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    Références
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    Investi
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    Valeur
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    Profit
                                                </th>

                                                <th className="pb-3 text-right text-xs font-medium text-zinc-600">
                                                    ROI
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {statistics.map((set) => (
                                                <SetTableRow
                                                    key={set.set}
                                                    set={set}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile */}
                                <div className="space-y-3 md:hidden">
                                    {statistics.map((set) => (
                                        <div
                                            key={set.set}
                                            className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-white">
                                                        {set.set}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-zinc-600">
                                                        {set.totalCards} cartes ·{" "}
                                                        {set.uniqueCards} références
                                                    </p>
                                                </div>

                                                <p className="shrink-0 text-sm font-semibold text-white">
                                                    {formatCurrency(set.estimatedValue)}
                                                </p>
                                            </div>

                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                <MobileStat
                                                    label="Investi"
                                                    value={formatCurrency(set.invested)}
                                                />

                                                <MobileStat
                                                    label="Profit"
                                                    value={`${set.profit >= 0 ? "+" : ""
                                                        }${formatCurrency(set.profit)}`}
                                                    positive={set.profit >= 0}
                                                />

                                                <MobileStat
                                                    label="ROI"
                                                    value={formatPercent(set.roi)}
                                                    positive={set.roi >= 0}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
                <ProfitabilityOverview
                    summary={profitabilitySummary}
                    profitabilities={profitabilities}
                />

                <section className="mt-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-200">
                                Analyse graphique
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Visualisation de la répartition et des performances
                                potentielles de ta collection.
                            </p>
                        </div>

                        <ProfitabilityChartControls
                            value={profitabilityChartMode}
                            onChange={setProfitabilityChartMode}
                        />
                    </div>

                    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                        <ProfitabilityDistributionChart
                            summary={profitabilitySummary}
                        />

                        <ProfitabilityChart
                            profitabilities={profitabilities}
                            mode={profitabilityChartMode}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function SetTableRow({ set }: { set: SetStatistics }) {
    return (
        <tr className="border-b border-white/5 last:border-0">
            <td className="py-4">
                <p className="max-w-[220px] truncate text-sm font-medium text-zinc-300">
                    {set.set}
                </p>
            </td>

            <td className="py-4 text-right text-sm text-zinc-400">
                {set.totalCards}
            </td>

            <td className="py-4 text-right text-sm text-zinc-400">
                {set.uniqueCards}
            </td>

            <td className="py-4 text-right text-sm text-zinc-400">
                {formatCurrency(set.invested)}
            </td>

            <td className="py-4 text-right text-sm font-medium text-white">
                {formatCurrency(set.estimatedValue)}
            </td>

            <td
                className={`py-4 text-right text-sm font-medium ${set.profit >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                    }`}
            >
                {set.profit >= 0 ? "+" : ""}
                {formatCurrency(set.profit)}
            </td>

            <td
                className={`py-4 text-right text-sm font-medium ${set.roi >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                    }`}
            >
                {formatPercent(set.roi)}
            </td>
        </tr>
    );
}

function MobileStat({
    label,
    value,
    positive,
}: {
    label: string;
    value: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
            <p className="text-[10px] text-zinc-600">
                {label}
            </p>

            <p
                className={`mt-1 text-xs font-medium ${positive === undefined
                    ? "text-zinc-300"
                    : positive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}