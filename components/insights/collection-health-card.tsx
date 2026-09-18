"use client";

import {
    AlertTriangle,
    CheckCircle2,
    CircleAlert,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import type {
    CollectionIntelligence,
    IntelligenceInsight,
} from "@/lib/collection-intelligence";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type CollectionHealthCardProps = {
    intelligence: CollectionIntelligence;
};

function getScoreLabel(score: number) {
    if (score >= 90) {
        return "Excellente santé";
    }

    if (score >= 75) {
        return "Bonne santé";
    }

    if (score >= 50) {
        return "À améliorer";
    }

    return "Attention requise";
}

function getScoreColor(score: number) {
    if (score >= 90) {
        return "text-emerald-400";
    }

    if (score >= 75) {
        return "text-blue-400";
    }

    if (score >= 50) {
        return "text-amber-400";
    }

    return "text-red-400";
}

function getInsightIcon(level: IntelligenceInsight["level"]) {
    switch (level) {
        case "positive":
            return (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            );

        case "warning":
            return (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            );

        case "danger":
            return (
                <CircleAlert className="h-4 w-4 shrink-0 text-red-400" />
            );

        case "info":
        default:
            return (
                <Sparkles className="h-4 w-4 shrink-0 text-blue-400" />
            );
    }
}

function getInsightBackground(level: IntelligenceInsight["level"]) {
    switch (level) {
        case "positive":
            return "border-emerald-400/10 bg-emerald-400/[0.03]";

        case "warning":
            return "border-amber-400/10 bg-amber-400/[0.03]";

        case "danger":
            return "border-red-400/10 bg-red-400/[0.03]";

        case "info":
        default:
            return "border-blue-400/10 bg-blue-400/[0.03]";
    }
}

export function CollectionHealthCard({
    intelligence,
}: CollectionHealthCardProps) {
    const scoreColor = getScoreColor(intelligence.score);
    const scoreLabel = getScoreLabel(intelligence.score);

    const visibleInsights = intelligence.insights.slice(0, 4);

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/5">
                                <ShieldCheck className="h-4 w-4 text-violet-400" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-semibold text-zinc-200">
                                        Collection Health
                                    </h2>

                                    <Badge
                                        variant="outline"
                                        className="border-white/10 bg-white/[0.02] text-[10px] text-zinc-500"
                                    >
                                        Intelligence
                                    </Badge>
                                </div>

                                <p className="mt-1 text-xs text-zinc-500">
                                    État général de ta collection et de ses
                                    données.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score */}
                <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative flex h-32 w-32 items-center justify-center">
                            {/* Progress ring */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `conic-gradient(currentColor ${intelligence.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                                }}
                            />

                            <div className="absolute inset-[5px] rounded-full bg-[#111114]" />

                            <div className="relative flex flex-col items-center">
                                <span
                                    className={`text-2xl font-bold tracking-tight ${scoreColor}`}
                                >
                                    {intelligence.score}
                                </span>

                                <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                                    / 100
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="mb-3">
                            <p
                                className={`text-base font-semibold ${scoreColor}`}
                            >
                                {scoreLabel}
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                Score basé sur la qualité des données,
                                l&apos;organisation et la structure actuelle de ta
                                collection.
                            </p>
                        </div>

                        {/* Counters */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

                                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                                        Points forts
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-semibold text-zinc-200">
                                    {intelligence.strengths}
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />

                                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                                        À surveiller
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-semibold text-zinc-200">
                                    {intelligence.warnings}
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                                <div className="flex items-center gap-2">
                                    <CircleAlert className="h-3.5 w-3.5 text-red-400" />

                                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                                        Critiques
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-semibold text-zinc-200">
                                    {intelligence.critical}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                {visibleInsights.length > 0 && (
                    <div className="mt-5 border-t border-white/5 pt-5">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-semibold text-zinc-300">
                                    Intelligence Insights
                                </h3>

                                <p className="mt-0.5 text-[11px] text-zinc-600">
                                    Principaux éléments détectés.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2 lg:grid-cols-2">
                            {visibleInsights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`rounded-lg border p-3 ${getInsightBackground(
                                        insight.level
                                    )}`}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5">
                                            {getInsightIcon(insight.level)}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-zinc-300">
                                                {insight.title}
                                            </p>

                                            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                                                {insight.description}
                                            </p>

                                            <p className="mt-2 text-[10px] font-medium text-zinc-400">
                                                → {insight.action}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
