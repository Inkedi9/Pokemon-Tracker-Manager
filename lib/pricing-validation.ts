import type {
    PokemonCard,
    PriceSource,
} from "@/types/card";

const VALID_PRICE_SOURCES: PriceSource[] = [
    "manual",
    "cardmarket",
    "tcgplayer",
    "ebay",
    "other",
];

export type PricingValidationResult = {
    valid: boolean;
    errors: string[];
    warnings: string[];
};

export function isValidPrice(
    value: unknown
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    );
}

export function isValidPriceSource(
    value: unknown
): value is PriceSource {
    return (
        typeof value === "string" &&
        VALID_PRICE_SOURCES.includes(
            value as PriceSource
        )
    );
}

export function isValidPriceDate(
    value: unknown
): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const timestamp = Date.parse(value);

    return Number.isFinite(timestamp);
}

export function validateCardPricing(
    card: PokemonCard
): PricingValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (
        card.marketPrice !== undefined &&
        !isValidPrice(card.marketPrice)
    ) {
        errors.push(
            "Le prix marché doit être un nombre positif ou nul."
        );
    }

    if (
        card.priceSource !== undefined &&
        !isValidPriceSource(card.priceSource)
    ) {
        errors.push(
            "La source du prix marché est invalide."
        );
    }

    if (
        card.priceUpdatedAt !== undefined &&
        !isValidPriceDate(card.priceUpdatedAt)
    ) {
        errors.push(
            "La date de mise à jour du prix est invalide."
        );
    }

    if (
        card.marketPrice !== undefined &&
        card.priceSource === undefined
    ) {
        warnings.push(
            "Un prix marché existe sans source renseignée."
        );
    }

    if (
        card.marketPrice !== undefined &&
        card.priceUpdatedAt === undefined
    ) {
        warnings.push(
            "Un prix marché existe sans date de mise à jour."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

export function normalizeMarketPrice(
    value: unknown
): number | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }

    const numericValue =
        typeof value === "number"
            ? value
            : Number(value);

    if (!Number.isFinite(numericValue)) {
        return undefined;
    }

    if (numericValue < 0) {
        return undefined;
    }

    return Math.round(
        numericValue * 100
    ) / 100;
}

export function normalizePriceDate(
    value: unknown
): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) {
        return undefined;
    }

    return new Date(timestamp).toISOString();
}

export function normalizePriceSource(
    value: unknown
): PriceSource | undefined {
    if (!isValidPriceSource(value)) {
        return undefined;
    }

    return value;
}

export function normalizeCardPricing(
    card: PokemonCard
): PokemonCard {
    const marketPrice =
        normalizeMarketPrice(card.marketPrice);

    const priceSource =
        normalizePriceSource(card.priceSource);

    const priceUpdatedAt =
        normalizePriceDate(card.priceUpdatedAt);

    return {
        ...card,

        marketPrice,
        priceSource,
        priceUpdatedAt,
    };
}