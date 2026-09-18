import {
    DEFAULT_COLLECTION_GOALS,
    type CollectionGoal,
} from "@/lib/collection-goals";

const STORAGE_KEY =
    "pokemon-tracker-collection-goals";

export function loadCollectionGoals() {
    if (typeof window === "undefined") {
        return DEFAULT_COLLECTION_GOALS;
    }

    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return DEFAULT_COLLECTION_GOALS;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return DEFAULT_COLLECTION_GOALS;
        }

        return parsed as CollectionGoal[];
    } catch {
        return DEFAULT_COLLECTION_GOALS;
    }
}

export function saveCollectionGoals(
    goals: CollectionGoal[]
) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(goals)
    );
}