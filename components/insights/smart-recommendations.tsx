"use client";

import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Lightbulb,
} from "lucide-react";

import type {
    CollectionRecommendation,
    RecommendationLevel,
} from "@/lib/collection-recommendations";

import { Card, CardContent } from "@/components/ui/card";

type SmartRecommendationsProps = {
    recommendations: CollectionRecommendation[];
};

const LEVEL_CONFIG: Record<
    RecommendationLevel,
    {
        icon: typeof Info;
        label: string;
        iconClass: string;
        borderClass: string;
    }
> = {
    critical: {
        icon: AlertTriangle,
        label: "Priorité haute",
        iconClass: "text-red-400",
        borderClass: "border-red-400/10",
    },
    warning: {
        icon: AlertTriangle,
        label: "À améliorer",
        iconClass: "text-amber-400",
        borderClass: "border-amber-400/10",
    },
    info: {
        icon: Info,
        label: "Information",
        iconClass: "text-blue-400",
        borderClass: "border-blue-400/10",
    },
    positive: {
        icon: CheckCircle2,
        label: "Point positif",
        iconClass: "text-emerald-400",
        borderClass: "border-emerald-400/10",
    },
};

export function SmartRecommendations({
    recommendations,
}: SmartRecommendationsProps) {
    if (recommendations.length === 0) {
        return (
            <Card className="rounded-xl border-white/10 bg-[#111114]">
                <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/5">
                            <Lightbulb className="h-4 w-4 text-emerald-400" />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-zinc-200">
                                Smart Recommendations
                            </h3>

                            <p className="text-xs text-zinc-600">
                                Aucune recommandation pour le moment.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/5">
                        <Lightbulb className="h-4 w-4 text-violet-400" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-zinc-200">
                            Smart Recommendations
                        </h3>

                        <p className="mt-0.5 text-xs text-zinc-600">
                            Suggestions générées à partir des données de ta collection.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-2">
                    {recommendations.map((recommendation) => {
                        const config =
                            LEVEL_CONFIG[
                                recommendation.level
                            ];

                        const Icon = config.icon;

                        return (
                            <div
                                key={recommendation.id}
                                className={`rounded-lg border ${config.borderClass} bg-white/[0.02] p-3`}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon
                                        className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconClass}`}
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-xs font-medium text-zinc-200">
                                                {recommendation.title}
                                            </h4>

                                            <span
                                                className={`text-[9px] uppercase tracking-wider ${config.iconClass}`}
                                            >
                                                {config.label}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                                            {
                                                recommendation.description
                                            }
                                        </p>

                                        <div className="mt-2 rounded-lg bg-white/[0.02] px-2.5 py-2 text-[10px] text-zinc-600">
                                            <span className="font-medium text-zinc-500">
                                                Action :
                                            </span>{" "}
                                            {
                                                recommendation.action
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
