import type { CollectionProgressSnapshot } from "@/lib/collection-progress";

const STORAGE_KEY =
    "pokemon-tracker-collection-progress";

export function loadCollectionProgress(): CollectionProgressSnapshot[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed as CollectionProgressSnapshot[];
    } catch {
        return [];
    }
}

export function saveCollectionProgress(
    snapshots: CollectionProgressSnapshot[]
) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(snapshots)
    );
}

function hasSnapshotChanged(
    previous: CollectionProgressSnapshot,
    current: CollectionProgressSnapshot
) {
    return (
        previous.totalCards !== current.totalCards ||
        previous.uniqueCards !== current.uniqueCards ||
        previous.totalValue !== current.totalValue ||
        previous.totalInvested !== current.totalInvested ||
        previous.totalSets !== current.totalSets ||
        previous.totalLanguages !== current.totalLanguages
    );
}

export function addCollectionProgressSnapshot(
    snapshot: CollectionProgressSnapshot
) {
    const snapshots = loadCollectionProgress();

    const previous =
        snapshots[snapshots.length - 1];

    if (
        previous &&
        !hasSnapshotChanged(previous, snapshot)
    ) {
        return snapshots;
    }

    const updatedSnapshots = [
        ...snapshots,
        snapshot,
    ];

    saveCollectionProgress(updatedSnapshots);

    return updatedSnapshots;
}