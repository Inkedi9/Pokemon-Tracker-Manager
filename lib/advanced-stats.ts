import type { PokemonCard } from "@/types/card";

export type AdvancedCollectionStats = {
  totalQuantity: number;
  uniqueCards: number;

  totalSets: number;
  totalLanguages: number;
  totalRarities: number;
  totalConditions: number;
  totalPokemon: number;

  averagePurchasePrice: number;
  averageEstimatedValue: number;
  averageQuantityPerEntry: number;

  mostExpensiveCard: PokemonCard | null;
  highestValueCard: PokemonCard | null;

  multiQuantityCards: number;
  cardsWithNotes: number;
  cardsWithLocation: number;
  cardsWithoutEstimatedValue: number;

  totalInvested: number;
  totalEstimatedValue: number;
};

function getCardInvested(card: PokemonCard) {
  return card.purchasePrice * card.quantity;
}

function getCardValue(card: PokemonCard) {
  return card.estimatedValue * card.quantity;
}

export function getAdvancedCollectionStats(
  cards: PokemonCard[]
): AdvancedCollectionStats {
  const totalQuantity = cards.reduce(
    (total, card) => total + card.quantity,
    0
  );

  const uniqueCards = cards.length;

  const totalInvested = cards.reduce(
    (total, card) => total + getCardInvested(card),
    0
  );

  const totalEstimatedValue = cards.reduce(
    (total, card) => total + getCardValue(card),
    0
  );

  const sets = new Set(
    cards
      .map((card) => card.set.trim())
      .filter(Boolean)
  );

  const languages = new Set(
    cards
      .map((card) => card.language)
      .filter(Boolean)
  );

  const rarities = new Set(
    cards
      .map((card) => card.rarity)
      .filter(Boolean)
  );

  const conditions = new Set(
    cards
      .map((card) => card.condition)
      .filter(Boolean)
  );

  const pokemon = new Set(
    cards
      .map((card) => card.name.trim().toLowerCase())
      .filter(Boolean)
  );

  const averagePurchasePrice =
    totalQuantity > 0
      ? totalInvested / totalQuantity
      : 0;

  const averageEstimatedValue =
    totalQuantity > 0
      ? totalEstimatedValue / totalQuantity
      : 0;

  const averageQuantityPerEntry =
    uniqueCards > 0
      ? totalQuantity / uniqueCards
      : 0;

  const sortedByPurchasePrice = [...cards].sort(
    (a, b) => b.purchasePrice - a.purchasePrice
  );

  const sortedByEstimatedValue = [...cards].sort(
    (a, b) => b.estimatedValue - a.estimatedValue
  );

  const multiQuantityCards = cards.filter(
    (card) => card.quantity > 1
  ).length;

  const cardsWithNotes = cards.filter(
    (card) => Boolean(card.notes?.trim())
  ).length;

  const cardsWithLocation = cards.filter(
    (card) => Boolean(card.location?.trim())
  ).length;

  const cardsWithoutEstimatedValue = cards.filter(
    (card) => card.estimatedValue <= 0
  ).length;

  return {
    totalQuantity,
    uniqueCards,

    totalSets: sets.size,
    totalLanguages: languages.size,
    totalRarities: rarities.size,
    totalConditions: conditions.size,
    totalPokemon: pokemon.size,

    averagePurchasePrice,
    averageEstimatedValue,
    averageQuantityPerEntry,

    mostExpensiveCard:
      sortedByPurchasePrice[0] ?? null,

    highestValueCard:
      sortedByEstimatedValue[0] ?? null,

    multiQuantityCards,
    cardsWithNotes,
    cardsWithLocation,
    cardsWithoutEstimatedValue,

    totalInvested,
    totalEstimatedValue,
  };
}