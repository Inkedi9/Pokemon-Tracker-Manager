"use client";

import {
    Database,
    Layers3,
    Sparkles,
    Languages,
    Package,
    Wallet,
    BrainCircuit,
    Target,
    TrendingUp,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useCollection } from "@/components/collection/collection-provider";
import {
    getCollectionIntelligence,
} from "@/lib/collection-intelligence";

import { Card, CardContent } from "@/components/ui/card";

import { SmartRecommendations } from "@/components/insights/smart-recommendations";
import { getCollectionRecommendations } from "@/lib/collection-recommendations";

import {
    getCollectionGoalsSummary,
    type CollectionGoal,
} from "@/lib/collection-goals";

import {
    loadCollectionGoals,
    saveCollectionGoals,
} from "@/lib/collection-goals-storage";

import { CollectionGoals } from "@/components/insights/collection-goals";

import {
    createCollectionSnapshot,
    getCollectionProgressSummary,
    type CollectionProgressSnapshot,
} from "@/lib/collection-progress";

import {
    addCollectionProgressSnapshot,
    loadCollectionProgress,
} from "@/lib/collection-progress-storage";

import { CollectionProgress } from "@/components/insights/collection-progress";
import { CollectionProgressChart } from "@/components/insights/collection-progress-chart";

import { getMissingDataSummary } from "@/lib/missing-data-intelligence";
import { MissingDataIntelligence } from "@/components/insights/missing-data-intelligence";
import { CollectionHealthBreakdown } from "@/components/insights/collection-health-breakdown";
import { CollectionHealthCard } from "@/components/insights/collection-health-card";

type CollectionOverviewProps = {
    cards: ReturnType<typeof useCollection>["cards"];
};

function CollectionOverview({
    cards,
}: CollectionOverviewProps) {
    const totalCards = cards.reduce(
        (total, card) => total + card.quantity,
        0
    );

    const uniqueCards = cards.length;

    const totalValue = cards.reduce(
        (total, card) =>
            total + card.estimatedValue * card.quantity,
        0
    );

    const totalInvested = cards.reduce(
        (total, card) =>
            total + card.purchasePrice * card.quantity,
        0
    );

    const sets = new Set(
        cards.map((card) => card.set).filter(Boolean)
    ).size;

    const languages = new Set(
        cards.map((card) => card.language).filter(Boolean)
    ).size;

    const items = [
        {
            label: "Cartes",
            value: totalCards,
            icon: Package,
        },
        {
            label: "Références",
            value: uniqueCards,
            icon: Layers3,
        },
        {
            label: "Valeur estimée",
            value: `${totalValue.toFixed(2)} €`,
            icon: Wallet,
        },
        {
            label: "Sets",
            value: sets,
            icon: Layers3,
        },
        {
            label: "Langues",
            value: languages,
            icon: Languages,
        },
        {
            label: "Investi",
            value: `${totalInvested.toFixed(2)} €`,
            icon: Wallet,
        },
    ];

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={item.label}
                        className="rounded-xl border-white/10 bg-[#111114]"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500">
                                        {item.label}
                                    </p>

                        <p className="mt-1 text-2xl font-bold text-zinc-100">
                            {item.value}
                        </p>
                                </div>

                                <Icon className="h-4 w-4 text-violet-400" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    label,
    badge,
    description,
}: {
    icon: typeof BrainCircuit;
    label: string;
    badge: string;
    description?: string;
}) {
    return (
        <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-violet-400" />
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-zinc-200">
                            {label}
                        </h2>

                        <span className="rounded-md border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                            {badge}
                        </span>
                    </div>

                    {description && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function DiversityOverview({
    cards,
}: {
    cards: ReturnType<typeof useCollection>["cards"];
}) {
    const sets = new Set(
        cards
            .map((card) => card.set)
            .filter(Boolean)
    ).size;

    const languages = new Set(
        cards
            .map((card) => card.language)
            .filter(Boolean)
    ).size;

    const rarities = new Set(
        cards
            .map((card) => card.rarity)
            .filter(Boolean)
    ).size;

    const conditions = new Set(
        cards
            .map((card) => card.condition)
            .filter(Boolean)
    ).size;

    const stats = [
        {
            label: "Sets",
            value: sets,
            icon: Layers3,
        },
        {
            label: "Langues",
            value: languages,
            icon: Languages,
        },
        {
            label: "Raretés",
            value: rarities,
            icon: Sparkles,
        },
        {
            label: "États",
            value: conditions,
            icon: Database,
        },
    ];

    return (
        <Card className="rounded-xl border-white/10 bg-[#111114]">
            <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/5">
                                    <Icon className="h-4 w-4 text-violet-400" />
                                </div>

                                <div>
                                    <p className="text-[11px] text-zinc-500">
                                        {stat.label}
                                    </p>

                                    <p className="text-sm font-semibold text-zinc-100">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function IntelligenceDashboard() {
    const { cards } = useCollection();

    const intelligence = getCollectionIntelligence(cards);

    const recommendations = useMemo(
        () => getCollectionRecommendations(cards),
        [cards]
    );

    const [goals, setGoals] = useState<CollectionGoal[]>(
        () => loadCollectionGoals()
    );

    const goalsSummary = useMemo(
        () => getCollectionGoalsSummary(cards, goals),
        [cards, goals]
    );

    function updateGoal(
        id: string,
        updates: Partial<CollectionGoal>
    ) {
        setGoals((currentGoals) => {
            const updatedGoals = currentGoals.map((goal) =>
                goal.id === id
                    ? { ...goal, ...updates }
                    : goal
            );

            saveCollectionGoals(updatedGoals);

            return updatedGoals;
        });
    }

    const [progressSnapshots, setProgressSnapshots] = useState<
        CollectionProgressSnapshot[]
    >(() => loadCollectionProgress());

    useEffect(() => {
        if (!cards.length) {
            return;
        }

        const timerId = window.setTimeout(() => {
            const snapshot = createCollectionSnapshot(cards);
            const updatedSnapshots =
                addCollectionProgressSnapshot(snapshot);

            setProgressSnapshots(updatedSnapshots);
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [cards]);

    const progressSummary = useMemo(
        () => getCollectionProgressSummary(progressSnapshots),
        [progressSnapshots]
    );

    const missingDataSummary = useMemo(
        () => getMissingDataSummary(cards),
        [cards]
    );

    return (
    <div className="space-y-5">
        {/* Overview */}
        <section>
            <SectionHeader
                icon={BrainCircuit}
                label="Collection Overview"
                badge="OVERVIEW"
                description="Vue instantanée des indicateurs principaux de ta collection."
            />

            <CollectionOverview cards={cards} />
        </section>

        {/* Intelligence */}
        <section>
            <SectionHeader
                icon={BrainCircuit}
                label="Collection Intelligence"
                badge="CORE"
                description="Évaluation globale de la qualité et de la structure de ta collection."
            />

            <CollectionHealthCard
                intelligence={intelligence}
            />

            <div className="mt-3">
                <CollectionHealthBreakdown
                    intelligence={intelligence}
                />
            </div>
        </section>

        {/* Diversity */}
        <section>
            <SectionHeader
                icon={Layers3}
                label="Collection Diversity"
                badge="DIVERSITY"
                description="Répartition de ta collection par sets, langues, raretés et états."
            />

            <DiversityOverview cards={cards} />
        </section>

        {/* Recommendations */}
        <section>
            <SectionHeader
                icon={Sparkles}
                label="Smart Recommendations"
                badge="AI"
                description="Actions générées à partir de l&apos;état actuel de ta collection."
            />

            <SmartRecommendations
                recommendations={
                    recommendations.recommendations
                }
            />
        </section>

        {/* Goals */}
        <section>
            <SectionHeader
                icon={Target}
                label="Collection Goals"
                badge="GOALS"
                description="Objectifs configurés et progression actuelle."
            />

            <CollectionGoals
                goals={goals}
                progress={goalsSummary.goals}
                onUpdateGoal={updateGoal}
            />
        </section>

        {/* Progress */}
        <section>
            <SectionHeader
                icon={TrendingUp}
                label="Collection Progress"
                badge="TRACKING"
                description="Évolution de ta collection dans le temps."
            />

            <CollectionProgress
                summary={progressSummary}
            />

            <div className="mt-3">
                <CollectionProgressChart
                    snapshots={progressSnapshots}
                />
            </div>
        </section>

        {/* Data Quality */}
        <section>
            <SectionHeader
                icon={Database}
                label="Data Quality"
                badge="DATA"
                description="Complétude et qualité des informations enregistrées."
            />

            <MissingDataIntelligence
                summary={missingDataSummary}
            />
        </section>
    </div>
);
}
