"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    ChartNoAxesCombined,
    Layers3,
    Languages,
    TrendingUp,
    Wallet,
} from "lucide-react";

import type {
    CollectionProgressChange,
    CollectionProgressSummary,
} from "@/lib/collection-progress";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

type CollectionProgressProps = {
    summary: CollectionProgressSummary | null;
};

type ProgressMetricProps = {
    label: string;
    value: string;
    change: CollectionProgressChange;
    icon: React.ReactNode;
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(new Date(date));
}

function formatPercentage(value: number) {
    const rounded =
        Math.round(value * 10) / 10;

    if (rounded > 0) {
        return `+${rounded}%`;
    }

    return `${rounded}%`;
}

function ProgressMetric({
    label,
    value,
    change,
    icon,
}: ProgressMetricProps) {
    const positive = change.absolute > 0;
    const negative = change.absolute < 0;

    return (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] text-zinc-600">
                        {label}
                    </p>

                    <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-200">
                        {value}
                    </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                    {icon}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
                {positive ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                ) : negative ? (
                    <ArrowDownRight className="h-3 w-3 text-red-400" />
                ) : null}

                <span
                    className={`text-[10px] font-medium ${
                        positive
                            ? "text-emerald-400"
                            : negative
                                ? "text-red-400"
                                : "text-zinc-600"
                    }`}
                >
                    {formatPercentage(
                        change.percentage
                    )}
                </span>

                <span className="text-[10px] text-zinc-600">
                    depuis le début
                </span>
            </div>
        </div>
    );
}

export function CollectionProgress({
    summary,
}: CollectionProgressProps) {
    if (!summary) {
        return (
            <Card className="rounded-xl border-white/10 bg-[#111114]">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <ChartNoAxesCombined className="h-4 w-4 text-blue-400" />

                                <h2 className="text-sm font-semibold text-zinc-200">
                                    Collection Progress
                                </h2>

                                <Badge
                                    variant="outline"
                                    className="border-white/10 bg-white/[0.02] text-[10px] text-zinc-500"
                                >
                                    M3.5
                                </Badge>
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                                Suis l&apos;évolution de ta collection dans le temps.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-white/10 bg-[#111114] p-6 text-center">
                        <TrendingUp className="mx-auto h-5 w-5 text-zinc-600" />

                        <p className="mt-2 text-xs font-medium text-zinc-400">
                            Pas encore de données historiques
                        </p>

                        <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
                            Les premières évolutions de ta collection
                            apparaîtront ici automatiquement.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const {
        current,
        cardsChange,
        valueChange,
        setsChange,
        languagesChange,
        snapshots,
    } = summary;

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ChartNoAxesCombined className="h-4 w-4 text-blue-400" />

                            <h2 className="text-sm font-semibold text-zinc-200">
                                Collection Progress
                            </h2>

                            <Badge
                                variant="outline"
                                className="border-white/10 bg-white/[0.02] text-[10px] text-zinc-500"
                            >
                                M3.5
                            </Badge>
                        </div>

                        <p className="mt-1 text-xs text-zinc-500">
                            Évolution de ta collection depuis le premier suivi.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                        <CalendarDays className="h-3 w-3" />

                        {formatDate(current.date)}
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ProgressMetric
                        label="Cartes"
                        value={current.totalCards.toLocaleString(
                            "fr-FR"
                        )}
                        change={cardsChange}
                        icon={
                            <ChartNoAxesCombined className="h-4 w-4 text-blue-400" />
                        }
                    />

                    <ProgressMetric
                        label="Valeur estimée"
                        value={`${current.totalValue.toFixed(2)} €`}
                        change={valueChange}
                        icon={
                            <Wallet className="h-4 w-4 text-emerald-400" />
                        }
                    />

                    <ProgressMetric
                        label="Extensions"
                        value={current.totalSets.toLocaleString(
                            "fr-FR"
                        )}
                        change={setsChange}
                        icon={
                            <Layers3 className="h-4 w-4 text-violet-400" />
                        }
                    />

                    <ProgressMetric
                        label="Langues"
                        value={current.totalLanguages.toLocaleString(
                            "fr-FR"
                        )}
                        change={languagesChange}
                        icon={
                            <Languages className="h-4 w-4 text-amber-400" />
                        }
                    />
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-600" />

                        <span className="text-[10px] text-zinc-500">
                            {snapshots.length} snapshot
                            {snapshots.length > 1
                                ? "s"
                                : ""}
                        </span>
                    </div>

                    <span className="text-[10px] text-zinc-600">
                        Investi :{" "}
                        {current.totalInvested.toFixed(2)} €
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
