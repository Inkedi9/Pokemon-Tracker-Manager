"use client";

import {
    AlertTriangle,
    CheckCircle2,
    CircleAlert,
    Database,
    ImageIcon,
    MapPin,
    StickyNote,
    Tag,
} from "lucide-react";

import type {
    MissingDataField,
    MissingDataPriority,
    MissingDataSummary,
} from "@/lib/missing-data-intelligence";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type MissingDataIntelligenceProps = {
    summary: MissingDataSummary;
};

function getPriorityLabel(
    priority: MissingDataPriority
) {
    switch (priority) {
        case "critical":
            return "Critical";

        case "high":
            return "High";

        case "medium":
            return "Medium";

        case "low":
        default:
            return "Low";
    }
}

function getPriorityColor(
    priority: MissingDataPriority
) {
    switch (priority) {
        case "critical":
            return "border-red-400/20 bg-red-400/5 text-red-300";

        case "high":
            return "border-amber-400/20 bg-amber-400/5 text-amber-300";

        case "medium":
            return "border-blue-400/20 bg-blue-400/5 text-blue-300";

        case "low":
        default:
            return "border-zinc-400/20 bg-zinc-400/5 text-zinc-300";
    }
}

function getFieldLabel(
    field: MissingDataField
) {
    switch (field) {
        case "name":
            return "Nom";

        case "set":
            return "Extension";

        case "number":
            return "Numéro";

        case "language":
            return "Langue";

        case "rarity":
            return "Rareté";

        case "condition":
            return "État";

        case "location":
            return "Emplacement";

        case "estimatedValue":
            return "Valeur estimée";

        case "image":
            return "Image";

        case "notes":
            return "Notes";
    }
}

function getFieldIcon(
    field: MissingDataField
) {
    switch (field) {
        case "location":
            return (
                <MapPin className="h-3 w-3" />
            );

        case "estimatedValue":
            return (
                <Database className="h-3 w-3" />
            );

        case "image":
            return (
                <ImageIcon className="h-3 w-3" />
            );

        case "notes":
            return (
                <StickyNote className="h-3 w-3" />
            );

        default:
            return (
                <Tag className="h-3 w-3" />
            );
    }
}

export function MissingDataIntelligence({
    summary,
}: MissingDataIntelligenceProps) {
    const visibleItems = summary.items.slice(0, 8);

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4 sm:p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-400" />

                            <h2 className="text-sm font-semibold text-zinc-200">
                                Missing Data Intelligence
                            </h2>

                            <Badge
                                variant="outline"
                                className="border-white/10 bg-white/[0.02] text-[10px] text-zinc-500"
                            >
                                M3.3
                            </Badge>
                        </div>

                        <p className="mt-1 text-xs text-zinc-500">
                            Identifie les cartes et les informations
                            qui doivent encore être complétées.
                        </p>
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                        {summary.incompleteCards === 0 ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                            <CircleAlert className="h-5 w-5 text-amber-400" />
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Complétude
                        </p>

                        <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-200">
                            {summary.completionRate}%
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            À compléter
                        </p>

                        <p className="mt-1 text-xl font-semibold tracking-tight text-amber-400">
                            {summary.incompleteCards}
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            cartes
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Champs manquants
                        </p>

                        <p className="mt-1 text-xl font-semibold tracking-tight text-blue-400">
                            {summary.totalMissingFields}
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">
                            Progression des données
                        </span>

                        <span className="text-[10px] font-medium text-zinc-400">
                            {summary.completionRate}%
                        </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                            className="h-full rounded-full bg-blue-400 transition-all"
                            style={{
                                width: `${summary.completionRate}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Missing fields */}
                <div className="mt-5">
                    <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />

                        <p className="text-xs font-medium text-zinc-300">
                            Champs les plus incomplets
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {(
                            Object.entries(summary.byField) as [
                                MissingDataField,
                                number
                            ][]
                        )
                            .filter(([, count]) => count > 0)
                            .sort(
                                ([, a], [, b]) =>
                                    b - a
                            )
                            .slice(0, 6)
                            .map(([field, count]) => (
                                <div
                                    key={field}
                                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                                >
                                    <div className="flex min-w-0 items-center gap-2 text-zinc-400">
                                        {getFieldIcon(field)}

                                        <span className="truncate text-[11px]">
                                            {getFieldLabel(field)}
                                        </span>
                                    </div>

                                    <span className="ml-2 shrink-0 text-[11px] font-semibold text-zinc-300">
                                        {count}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Cards */}
                {visibleItems.length > 0 ? (
                    <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-medium text-zinc-300">
                                Cartes à compléter
                            </p>

                            <span className="text-[10px] text-zinc-600">
                                {visibleItems.length} affichées
                            </span>
                        </div>

                        <div className="space-y-2">
                            {visibleItems.map((item) => (
                                <div
                                    key={item.card.id}
                                    className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-zinc-200">
                                                {item.card.name}
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-zinc-600">
                                                {item.card.set} · #
                                                {item.card.number}
                                            </p>
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className={`shrink-0 text-[9px] ${getPriorityColor(
                                                item.priority
                                            )}`}
                                        >
                                            {getPriorityLabel(
                                                item.priority
                                            )}
                                        </Badge>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {item.missingFields.map(
                                            (field) => (
                                                <span
                                                    key={field}
                                                    className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[9px] text-zinc-500"
                                                >
                                                    {getFieldLabel(
                                                        field
                                                    )}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[9px] text-zinc-600">
                                            Complétude
                                        </span>

                                        <span className="text-[10px] font-medium text-zinc-400">
                                            {item.completeness}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111114] p-4">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                        <div>
                            <p className="text-xs font-medium text-emerald-300">
                                Collection complète
                            </p>

                            <p className="mt-0.5 text-[10px] text-zinc-500">
                                Aucune donnée manquante détectée.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
