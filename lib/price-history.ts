import type {
    PokemonCard,
    PriceSnapshot,
} from "@/types/card";

import {
    getMarketPrice,
} from "@/lib/pricing";

export function getPriceHistory(
    card: PokemonCard
): PriceSnapshot[] {
    if (!Array.isArray(card.priceHistory)) {
        return [];
    }

    return [...card.priceHistory].sort(
        (a, b) =>
            new Date(a.recordedAt).getTime() -
            new Date(b.recordedAt).getTime()
    );
}

export function getLatestPriceSnapshot(
    card: PokemonCard
): PriceSnapshot | null {
    const history = getPriceHistory(card);

    if (history.length === 0) {
        return null;
    }

    return history[history.length - 1];
}

export function addPriceSnapshot(
    card: PokemonCard,
    snapshot: PriceSnapshot
): PokemonCard {
    const history = getPriceHistory(card);

    const latest =
        history[history.length - 1];

    if (
        latest &&
        latest.price === snapshot.price
    ) {
        return {
            ...card,
            priceHistory: history,
        };
    }

    return {
        ...card,
        priceHistory: [
            ...history,
            snapshot,
        ],
    };
}

export function createPriceSnapshot(
    card: PokemonCard
): PriceSnapshot | null {
    const marketPrice = getMarketPrice(card);

    if (marketPrice === null) {
        return null;
    }

    return {
        price: marketPrice,
        source: card.priceSource,
        recordedAt:
            card.priceUpdatedAt ??
            new Date().toISOString(),
    };
}

export function getPriceVariation(
    card: PokemonCard
): number | null {
    const history = getPriceHistory(card);

    if (history.length < 2) {
        return null;
    }

    const firstPrice = history[0].price;
    const latestPrice =
        history[history.length - 1].price;

    if (firstPrice <= 0) {
        return null;
    }

    return (
        ((latestPrice - firstPrice) /
            firstPrice) *
        100
    );
}

export function getLatestPriceVariation(
    card: PokemonCard
): number | null {
    const history = getPriceHistory(card);

    if (history.length < 2) {
        return null;
    }

    const previous =
        history[history.length - 2];

    const latest =
        history[history.length - 1];

    if (previous.price <= 0) {
        return null;
    }

    return (
        ((latest.price - previous.price) /
            previous.price) *
        100
    );
}

export function shouldRecordPriceSnapshot(
    card: PokemonCard
): boolean {
    const marketPrice = getMarketPrice(card);

    if (marketPrice === null) {
        return false;
    }

    const latest =
        getLatestPriceSnapshot(card);

    if (!latest) {
        return true;
    }

    return latest.price !== marketPrice;
}