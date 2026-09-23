import type { PokemonCard } from "@/types/card";

/**
 * Retourne le prix marché unitaire d'une carte.
 * Si aucun prix marché n'est disponible, retourne null.
 */
export function getMarketPrice(
    card: PokemonCard
): number | null {
    if (
        typeof card.marketPrice !== "number" ||
        !Number.isFinite(card.marketPrice) ||
        card.marketPrice < 0
    ) {
        return null;
    }

    return card.marketPrice;
}

/**
 * Calcule la valeur marché totale d'une carte
 * en prenant en compte sa quantité.
 */
export function getMarketValue(
    card: PokemonCard
): number {
    const marketPrice = getMarketPrice(card);

    if (marketPrice === null) {
        return 0;
    }

    return marketPrice * card.quantity;
}

/**
 * Calcule le montant total investi dans une carte.
 */
export function getInvestmentValue(
    card: PokemonCard
): number {
    return Math.max(0, card.purchasePrice) * card.quantity;
}

/**
 * Calcule le profit / perte latent(e)
 * par rapport au prix d'achat.
 */
export function getUnrealizedProfit(
    card: PokemonCard
): number | null {
    const marketPrice = getMarketPrice(card);

    if (marketPrice === null) {
        return null;
    }

    return getMarketValue(card) - getInvestmentValue(card);
}

/**
 * Calcule le ROI latent en pourcentage.
 *
 * Exemple :
 * investissement = 100 €
 * valeur marché = 125 €
 * ROI = +25 %
 */
export function getUnrealizedROI(
    card: PokemonCard
): number | null {
    const investment = getInvestmentValue(card);
    const profit = getUnrealizedProfit(card);

    if (
        investment <= 0 ||
        profit === null
    ) {
        return null;
    }

    return (profit / investment) * 100;
}

export function getCollectionMarketValue(
    cards: PokemonCard[]
): number {
    return cards.reduce(
        (total, card) =>
            total + getMarketValue(card),
        0
    );
}

export function getCollectionInvestmentValue(
    cards: PokemonCard[]
): number {
    return cards.reduce(
        (total, card) =>
            total + getInvestmentValue(card),
        0
    );
}

export function getCollectionUnrealizedProfit(
    cards: PokemonCard[]
): number {
    return cards.reduce(
        (total, card) =>
            total + (getUnrealizedProfit(card) ?? 0),
        0
    );
}

export function getCollectionUnrealizedROI(
    cards: PokemonCard[]
): number | null {
    const investment =
        getCollectionInvestmentValue(cards);

    if (investment <= 0) {
        return null;
    }

    const profit =
        getCollectionUnrealizedProfit(cards);

    return (profit / investment) * 100;
}

export function getPricedCardCount(
    cards: PokemonCard[]
): number {
    return cards.filter(
        (card) => getMarketPrice(card) !== null
    ).length;
}

export function getUnpricedCardCount(
    cards: PokemonCard[]
): number {
    return cards.filter(
        (card) => getMarketPrice(card) === null
    ).length;
}

export function getPricingCoverage(
    cards: PokemonCard[]
): number {
    if (cards.length === 0) {
        return 0;
    }

    const pricedCards =
        getPricedCardCount(cards);

    return (pricedCards / cards.length) * 100;
}

export function hasMarketPrice(
    card: PokemonCard
): boolean {
    return getMarketPrice(card) !== null;
}

export function getMarketPriceDifference(
    card: PokemonCard
): number | null {
    const marketPrice = getMarketPrice(card);

    if (marketPrice === null) {
        return null;
    }

    return marketPrice - card.purchasePrice;
}

export function getMarketPriceDifferencePercent(
    card: PokemonCard
): number | null {
    const difference =
        getMarketPriceDifference(card);

    if (difference === null) {
        return null;
    }

    if (card.purchasePrice <= 0) {
        return null;
    }

    return (
        difference /
        card.purchasePrice
    ) * 100;
}

export function getPricedCards(
    cards: PokemonCard[]
): PokemonCard[] {
    return cards.filter(hasMarketPrice);
}

export function getUnpricedCards(
    cards: PokemonCard[]
): PokemonCard[] {
    return cards.filter(
        (card) => !hasMarketPrice(card)
    );
}

export function getPricedCardQuantity(
    cards: PokemonCard[]
): number {
    return cards.reduce(
        (total, card) => {
            if (!hasMarketPrice(card)) {
                return total;
            }

            return total + card.quantity;
        },
        0
    );
}

export function getUnpricedCardQuantity(
    cards: PokemonCard[]
): number {
    return cards.reduce(
        (total, card) => {
            if (hasMarketPrice(card)) {
                return total;
            }

            return total + card.quantity;
        },
        0
    );
}

export function getMarketValueCoverage(
    cards: PokemonCard[]
): number {
    const totalInvestment =
        getCollectionInvestmentValue(cards);

    if (totalInvestment <= 0) {
        return 0;
    }

    const pricedCards =
        getPricedCards(cards);

    const pricedInvestment =
        getCollectionInvestmentValue(
            pricedCards
        );

    return (
        pricedInvestment /
        totalInvestment
    ) * 100;
}

export function getPricedMarketValue(
    cards: PokemonCard[]
): number {
    return getCollectionMarketValue(
        getPricedCards(cards)
    );
}

export function getPricedInvestmentValue(
    cards: PokemonCard[]
): number {
    return getCollectionInvestmentValue(
        getPricedCards(cards)
    );
}

export function getPricedUnrealizedProfit(
    cards: PokemonCard[]
): number {
    return getCollectionUnrealizedProfit(
        getPricedCards(cards)
    );
}

export type CollectionMarketSummary = {
    marketValue: number;
    investmentValue: number;
    unrealizedProfit: number;
    unrealizedROI: number | null;

    pricedEntries: number;
    unpricedEntries: number;

    pricedQuantity: number;
    unpricedQuantity: number;

    pricingCoverage: number;
    marketValueCoverage: number;
};

export function getCollectionMarketSummary(
    cards: PokemonCard[]
): CollectionMarketSummary {
    return {
        marketValue:
            getCollectionMarketValue(cards),

        investmentValue:
            getCollectionInvestmentValue(cards),

        unrealizedProfit:
            getCollectionUnrealizedProfit(cards),

        unrealizedROI:
            getCollectionUnrealizedROI(cards),

        pricedEntries:
            getPricedCardCount(cards),

        unpricedEntries:
            getUnpricedCardCount(cards),

        pricedQuantity:
            getPricedCardQuantity(cards),

        unpricedQuantity:
            getUnpricedCardQuantity(cards),

        pricingCoverage:
            getPricingCoverage(cards),

        marketValueCoverage:
            getMarketValueCoverage(cards),
    };
}