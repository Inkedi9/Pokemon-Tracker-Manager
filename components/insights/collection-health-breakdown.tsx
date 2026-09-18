"use client";

import {
    Database,
    Layers3,
    MapPin,
    Sparkles,
} from "lucide-react";

import type { CollectionIntelligence } from "@/lib/collection-intelligence";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type CollectionHealthBreakdownProps = {
    intelligence: CollectionIntelligence;
};

type HealthMetricProps = {
    label: string;
    description: string;
    score: number;
    icon: React.ReactNode;
};

function getScoreLabel(score: number) {
    if (score >= 90) {
        return "Excellent";
    }

    if (score >= 75) {
        return "Bon";
    }

    if (score >= 50) {
        return "À améliorer";
    }

    return "Faible";
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

function getProgressColor(score: number) {
    if (score >= 90) {
        return "bg-emerald-400";
    }

    if (score >= 75) {
        return "bg-blue-400";
    }

    if (score >= 50) {
        return "bg-amber-400";
    }

    return "bg-red-400";
}

function HealthMetric({
    label,
    description,
    score,
    icon,
}: HealthMetricProps) {
    const scoreColor = getScoreColor(score);
    const progressColor = getProgressColor(score);

    return (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-300">
                            {label}
                        </p>

                        <p className="mt-0.5 text-[10px] text-zinc-600">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <p
                        className={`text-lg font-semibold tracking-tight ${scoreColor}`}
                    >
                        {score}
                    </p>

                    <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                        / 100
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                        className={`h-full rounded-full transition-all ${progressColor}`}
                        style={{
                            width: `${score}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-medium ${scoreColor}`}>
                    {getScoreLabel(score)}
                </span>

                <span className="text-[10px] text-zinc-600">
                    {score}%
                </span>
            </div>
        </div>
    );
}

export function CollectionHealthBreakdown({
    intelligence,
}: CollectionHealthBreakdownProps) {
    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-violet-400" />

                            <h2 className="text-sm font-semibold text-zinc-200">
                                Health Breakdown
                            </h2>

                            <Badge
                                variant="outline"
                                className="border-violet-400/20 bg-violet-400/5 text-[10px] text-violet-300"
                            >
                                M3
                            </Badge>
                        </div>

                        <p className="mt-1 text-xs text-zinc-500">
                            Analyse détaillée des principaux facteurs de santé
                            de ta collection.
                        </p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-3 md:grid-cols-3">
                    <HealthMetric
                        label="Data Quality"
                        description="Complétude des données"
                        score={intelligence.dataQuality}
                        icon={
                            <Database className="h-4 w-4 text-blue-400" />
                        }
                    />

                    <HealthMetric
                        label="Organization"
                        description="Gestion du stock"
                        score={intelligence.organizationScore}
                        icon={
                            <MapPin className="h-4 w-4 text-emerald-400" />
                        }
                    />

                    <HealthMetric
                        label="Diversity"
                        description="Variété de la collection"
                        score={intelligence.diversityScore}
                        icon={
                            <Layers3 className="h-4 w-4 text-violet-400" />
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}