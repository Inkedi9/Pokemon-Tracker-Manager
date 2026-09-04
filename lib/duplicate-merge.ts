import type { PokemonCard } from "@/types/card";

export type MergeResult = {
  mergedCard: PokemonCard;
  removedIds: string[];
};

function mergeUniqueValues(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function mergeNotes(cards: PokemonCard[]) {
  const notes = mergeUniqueValues(
    cards
      .map((card) => card.notes ?? "")
      .flatMap((value) => value.split("\n"))
  );

  return notes.join("\n");
}

function mergeLocations(cards: PokemonCard[]) {
  return mergeUniqueValues(
    cards.map((card) => card.location ?? "")
  ).join(" / ");
}

function getWeightedAverage(
  cards: PokemonCard[],
  getValue: (card: PokemonCard) => number
) {
  const totalQuantity = cards.reduce(
    (total, card) => total + card.quantity,
    0
  );

  if (totalQuantity <= 0) {
    return 0;
  }

  const weightedTotal = cards.reduce(
    (total, card) =>
      total + getValue(card) * card.quantity,
    0
  );

  return weightedTotal / totalQuantity;
}

export function mergeDuplicateCards(
  cards: PokemonCard[],
  primaryId?: string
): MergeResult | null {
  if (cards.length < 2) {
    return null;
  }

  const primaryCard =
    cards.find((card) => card.id === primaryId) ??
    cards[0];

  if (!primaryCard) {
    return null;
  }

  const totalQuantity = cards.reduce(
    (total, card) => total + card.quantity,
    0
  );

  const totalInvested = cards.reduce(
    (total, card) =>
      total + card.purchasePrice * card.quantity,
    0
  );

  const averageEstimatedValue = getWeightedAverage(
    cards,
    (card) => card.estimatedValue
  );

  const mergedCard: PokemonCard = {
    ...primaryCard,

    quantity: totalQuantity,

    purchasePrice:
      totalQuantity > 0
        ? totalInvested / totalQuantity
        : 0,

    estimatedValue: averageEstimatedValue,

    // On conserve la condition de l'entrée principale.
    condition: primaryCard.condition,

    location: mergeLocations(cards),

    notes: mergeNotes(cards),
  };

  const removedIds = cards
    .filter((card) => card.id !== primaryCard.id)
    .map((card) => card.id);

  return {
    mergedCard,
    removedIds,
  };
}