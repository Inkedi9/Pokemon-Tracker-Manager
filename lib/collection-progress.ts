import type { PokemonCard } from "@/types/card";

export type CollectionProgressSnapshot = {
    id: string;
    date: string;

    totalCards: number;
    uniqueCards: number;

    totalValue: number;
    totalInvested: number;

    totalSets: number;
    totalLanguages: number;
};

export type CollectionProgressChange = {
    current: number;
    previous: number;
    absolute: number;
    percentage: number;
};

export type CollectionProgressSummary = {
    snapshots: CollectionProgressSnapshot[];

    current: CollectionProgressSnapshot;
    first: CollectionProgressSnapshot;

    cardsChange: CollectionProgressChange;
    valueChange: CollectionProgressChange;
    investedChange: CollectionProgressChange;
    setsChange: CollectionProgressChange;
    languagesChange: CollectionProgressChange;
};

function calculateChange(
    current: number,
    previous: number
): CollectionProgressChange {
    const absolute = current - previous;

    const percentage =
        previous === 0
            ? current > 0
                ? 100
                : 0
            : (absolute / previous) * 100;

    return {
        current,
        previous,
        absolute,
        percentage,
    };
}

export function createCollectionSnapshot(
    cards: PokemonCard[]
): CollectionProgressSnapshot {
    const totalCards = cards.reduce(
        (total, card) => total + card.quantity,
        0
    );

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

    const totalSets = new Set(
        cards
            .map((card) => card.set.trim())
            .filter(Boolean)
    ).size;

    const totalLanguages = new Set(
        cards
            .map((card) => card.language)
            .filter(Boolean)
    ).size;

    return {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),

        totalCards,
        uniqueCards: cards.length,

        totalValue,
        totalInvested,

        totalSets,
        totalLanguages,
    };
}

export function getCollectionProgressSummary(
    snapshots: CollectionProgressSnapshot[]
): CollectionProgressSummary | null {
    if (snapshots.length === 0) {
        return null;
    }

    const sortedSnapshots = [...snapshots].sort(
        (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
    );

    const first = sortedSnapshots[0];
    const current =
        sortedSnapshots[sortedSnapshots.length - 1];

    return {
        snapshots: sortedSnapshots,

        current,
        first,

        cardsChange: calculateChange(
            current.totalCards,
            first.totalCards
        ),

        valueChange: calculateChange(
            current.totalValue,
            first.totalValue
        ),

        investedChange: calculateChange(
            current.totalInvested,
            first.totalInvested
        ),

        setsChange: calculateChange(
            current.totalSets,
            first.totalSets
        ),

        languagesChange: calculateChange(
            current.totalLanguages,
            first.totalLanguages
        ),
    };
}

export type CollectionProgressRange =
    | "7d"
    | "30d"
    | "90d"
    | "all";

export function filterCollectionProgressSnapshots(
    snapshots: CollectionProgressSnapshot[],
    range: CollectionProgressRange
) {
    if (range === "all") {
        return snapshots;
    }

    const now = Date.now();

    const rangeMs =
        range === "7d"
            ? 7 * 24 * 60 * 60 * 1000
            : range === "30d"
              ? 30 * 24 * 60 * 60 * 1000
              : 90 * 24 * 60 * 60 * 1000;

    const cutoff = now - rangeMs;

    return snapshots.filter(
        (snapshot) =>
            new Date(snapshot.date).getTime() >= cutoff
    );
}

export type CollectionGrowthStats = {
    cards: CollectionProgressChange;
    value: CollectionProgressChange;
    invested: CollectionProgressChange;
    sets: CollectionProgressChange;
    languages: CollectionProgressChange;
};

export function getCollectionGrowthStats(
    snapshots: CollectionProgressSnapshot[]
): CollectionGrowthStats | null {
    if (snapshots.length < 2) {
        return null;
    }

    const sortedSnapshots = [...snapshots].sort(
        (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
    );

    const first = sortedSnapshots[0];
    const current =
        sortedSnapshots[sortedSnapshots.length - 1];

    return {
        cards: calculateChange(
            current.totalCards,
            first.totalCards
        ),

        value: calculateChange(
            current.totalValue,
            first.totalValue
        ),

        invested: calculateChange(
            current.totalInvested,
            first.totalInvested
        ),

        sets: calculateChange(
            current.totalSets,
            first.totalSets
        ),

        languages: calculateChange(
            current.totalLanguages,
            first.totalLanguages
        ),
    };
}