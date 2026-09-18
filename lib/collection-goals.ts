import type { PokemonCard } from "@/types/card";

export type CollectionGoalType =
    | "cards"
    | "value"
    | "sets"
    | "languages";

export type CollectionGoal = {
    id: string;
    type: CollectionGoalType;
    target: number;
    enabled: boolean;
};

export type CollectionGoalProgress = {
    goal: CollectionGoal;
    current: number;
    progress: number;
    remaining: number;
    completed: boolean;
};

export type CollectionGoalsSummary = {
    goals: CollectionGoalProgress[];
    activeGoals: number;
    completedGoals: number;
};

export const DEFAULT_COLLECTION_GOALS: CollectionGoal[] = [
    {
        id: "cards",
        type: "cards",
        target: 100,
        enabled: true,
    },
    {
        id: "value",
        type: "value",
        target: 500,
        enabled: false,
    },
    {
        id: "sets",
        type: "sets",
        target: 10,
        enabled: false,
    },
    {
        id: "languages",
        type: "languages",
        target: 2,
        enabled: false,
    },
];

export function getGoalLabel(
    type: CollectionGoalType
) {
    switch (type) {
        case "cards":
            return "Nombre de cartes";

        case "value":
            return "Valeur estimée";

        case "sets":
            return "Extensions";

        case "languages":
            return "Langues";
    }
}

export function getGoalUnit(
    type: CollectionGoalType
) {
    switch (type) {
        case "cards":
            return "cartes";

        case "value":
            return "€";

        case "sets":
            return "extensions";

        case "languages":
            return "langues";
    }
}

function getCurrentValue(
    cards: PokemonCard[],
    type: CollectionGoalType
) {
    switch (type) {
        case "cards":
            return cards.reduce(
                (total, card) =>
                    total + card.quantity,
                0
            );

        case "value":
            return cards.reduce(
                (total, card) =>
                    total +
                    card.estimatedValue *
                        card.quantity,
                0
            );

        case "sets":
            return new Set(
                cards
                    .map((card) =>
                        card.set.trim()
                    )
                    .filter(Boolean)
            ).size;

        case "languages":
            return new Set(
                cards
                    .map((card) => card.language)
                    .filter(Boolean)
            ).size;
    }
}

export function getCollectionGoalsSummary(
    cards: PokemonCard[],
    goals: CollectionGoal[]
): CollectionGoalsSummary {
    const activeGoals = goals.filter(
        (goal) => goal.enabled && goal.target > 0
    );

    const progressGoals = activeGoals.map(
        (goal) => {
            const current = getCurrentValue(
                cards,
                goal.type
            );

            const progress = Math.round(
                Math.min(
                    100,
                    (current / goal.target) * 100
                )
            );

            const remaining = Math.max(
                0,
                goal.target - current
            );

            return {
                goal,
                current,
                progress,
                remaining,
                completed:
                    current >= goal.target,
            };
        }
    );

    return {
        goals: progressGoals,
        activeGoals: progressGoals.length,
        completedGoals:
            progressGoals.filter(
                (goal) => goal.completed
            ).length,
    };
}