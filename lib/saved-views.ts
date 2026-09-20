export type SavedView = {
    id: string;
    name: string;

    search: string;

    language: string;
    rarity: string;
    condition: string;
    setFilter: string;

    advancedFilters: {
        minQuantity: string;
        maxQuantity: string;
        minPurchasePrice: string;
        maxPurchasePrice: string;
        minEstimatedValue: string;
        maxEstimatedValue: string;
        hasLocation: string;
        hasNotes: string;
        hasImage: string;
        hasEstimatedValue: string;
    };

    sortBy: string;

    createdAt: string;
};

const SAVED_VIEWS_STORAGE_KEY = "pokemon-tracker-saved-views";

export function getSavedViews(): SavedView[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored = localStorage.getItem(
            SAVED_VIEWS_STORAGE_KEY
        );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveSavedViews(views: SavedView[]) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        SAVED_VIEWS_STORAGE_KEY,
        JSON.stringify(views)
    );
}