"use client";

import {
    BarChart3,
    Boxes,
    Languages,
    Layers3,
    MapPin,
    Package,
    Sparkles,
    Tag,
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
    AdvancedCollectionStats,
} from "@/lib/advanced-stats";

type AdvancedCollectionStatsProps = {
    stats: AdvancedCollectionStats;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
    }).format(value);
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 1,
    }).format(value);
}

export function AdvancedCollectionStats({
    stats,
}: AdvancedCollectionStatsProps) {
    return (
        <section className="mt-6 w-full">
            {/* Header */}
            <div className="mb-3">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-400" />

                    <h2 className="text-sm font-semibold text-zinc-200">
                        Advanced Collection Stats
                    </h2>

                    <Badge
                        variant="outline"
                        className="border-blue-400/20 bg-blue-400/5 text-blue-300"
                    >
                        Structure
                    </Badge>
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                    Vue détaillée de la structure et de la composition de ta
                    collection.
                </p>
            </div>

            {/* Collection volume */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Package className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Exemplaires
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {stats.totalQuantity}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Boxes className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Pokémon différents
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {stats.totalPokemon}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Layers3 className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Extensions
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {stats.totalSets}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Languages className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Langues
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {stats.totalLanguages}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Average values */}
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Wallet className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Achat moyen
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {formatCurrency(
                                stats.averagePurchasePrice
                            )}
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            par exemplaire
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <TrendingUp className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Valeur moyenne
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {formatCurrency(
                                stats.averageEstimatedValue
                            )}
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            par exemplaire
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Package className="h-3.5 w-3.5" />

                            <span className="text-[10px] uppercase tracking-wider">
                                Quantité moyenne
                            </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {formatNumber(
                                stats.averageQuantityPerEntry
                            )}
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            exemplaires par entrée
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Collection diversity */}
            <Card className="mt-3 border-white/10 bg-white/[0.02]">
                <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
                    <CardTitle className="text-xs font-semibold text-zinc-200">
                        Diversité de la collection
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <Tag className="h-3.5 w-3.5" />

                                <span className="text-[10px] uppercase tracking-wider">
                                    Raretés
                                </span>
                            </div>

                            <p className="mt-2 text-lg font-semibold text-zinc-200">
                                {stats.totalRarities}
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <Sparkles className="h-3.5 w-3.5" />

                                <span className="text-[10px] uppercase tracking-wider">
                                    Conditions
                                </span>
                            </div>

                            <p className="mt-2 text-lg font-semibold text-zinc-200">
                                {stats.totalConditions}
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <Package className="h-3.5 w-3.5" />

                                <span className="text-[10px] uppercase tracking-wider">
                                    Avec doublons
                                </span>
                            </div>

                            <p className="mt-2 text-lg font-semibold text-zinc-200">
                                {stats.multiQuantityCards}
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <MapPin className="h-3.5 w-3.5" />

                                <span className="text-[10px] uppercase tracking-wider">
                                    Avec emplacement
                                </span>
                            </div>

                            <p className="mt-2 text-lg font-semibold text-zinc-200">
                                {stats.cardsWithLocation}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data quality */}
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/[0.02]">
                    <CardContent className="p-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Cartes avec notes
                        </p>

                        <p className="mt-2 text-lg font-semibold text-zinc-100">
                            {stats.cardsWithNotes}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-600">
                            Entrées contenant au moins une note personnelle.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-400/10 bg-amber-400/[0.02]">
                    <CardContent className="p-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Sans valeur estimée
                        </p>

                        <p className="mt-2 text-lg font-semibold text-amber-300">
                            {stats.cardsWithoutEstimatedValue}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-600">
                            Entrées dont la valeur estimée est actuellement nulle.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Highest value */}
            {(stats.mostExpensiveCard ||
                stats.highestValueCard) && (
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        {stats.mostExpensiveCard && (
                            <Card className="border-white/10 bg-white/[0.02]">
                                <CardContent className="p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                        Achat unitaire le plus élevé
                                    </p>

                                    <p className="mt-2 truncate text-sm font-semibold text-zinc-100">
                                        {stats.mostExpensiveCard.name}
                                    </p>

                                    <p className="mt-1 text-[11px] text-zinc-600">
                                        {stats.mostExpensiveCard.set} ·{" "}
                                        {stats.mostExpensiveCard.number}
                                    </p>

                                    <p className="mt-3 text-lg font-semibold text-zinc-200">
                                        {formatCurrency(
                                            stats.mostExpensiveCard.purchasePrice
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {stats.highestValueCard && (
                            <Card className="border-emerald-400/10 bg-emerald-400/[0.02]">
                                <CardContent className="p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                        Valeur unitaire la plus élevée
                                    </p>

                                    <p className="mt-2 truncate text-sm font-semibold text-zinc-100">
                                        {stats.highestValueCard.name}
                                    </p>

                                    <p className="mt-1 text-[11px] text-zinc-600">
                                        {stats.highestValueCard.set} ·{" "}
                                        {stats.highestValueCard.number}
                                    </p>

                                    <p className="mt-3 text-lg font-semibold text-emerald-300">
                                        {formatCurrency(
                                            stats.highestValueCard.estimatedValue
                                        )}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
        </section>
    );
}