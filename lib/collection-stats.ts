import type { PokemonCard } from "@/types/card";

export function getTotalCards(cards: PokemonCard[]) {
  return cards.reduce((total, card) => {
    return total + card.quantity;
  }, 0);
}

export function getUniqueCards(cards: PokemonCard[]) {
  return cards.length;
}

export function getTotalInvested(cards: PokemonCard[]) {
  return cards.reduce((total, card) => {
    return total + card.purchasePrice * card.quantity;
  }, 0);
}

export function getTotalEstimatedValue(cards: PokemonCard[]) {
  return cards.reduce((total, card) => {
    return total + card.estimatedValue * card.quantity;
  }, 0);
}

export function getTotalProfit(cards: PokemonCard[]) {
  return getTotalEstimatedValue(cards) - getTotalInvested(cards);
}

export function getROI(cards: PokemonCard[]) {
  const invested = getTotalInvested(cards);

  if (invested === 0) {
    return 0;
  }

  const profit = getTotalProfit(cards);

  return (profit / invested) * 100;
}

export function getLanguageBreakdown(cards: PokemonCard[]) {
  return cards.reduce<Record<string, number>>((result, card) => {
    result[card.language] =
      (result[card.language] ?? 0) + card.quantity;

    return result;
  }, {});
}

export function getRarityBreakdown(cards: PokemonCard[]) {
  return cards.reduce<Record<string, number>>((result, card) => {
    result[card.rarity] =
      (result[card.rarity] ?? 0) + card.quantity;

    return result;
  }, {});
}

export type SetStatistics = {
  set: string;
  totalCards: number;
  uniqueCards: number;
  invested: number;
  estimatedValue: number;
  profit: number;
  roi: number;
};

export function getSetStatistics(
  cards: PokemonCard[]
): SetStatistics[] {
  const sets = cards.reduce<Record<string, SetStatistics>>(
    (result, card) => {
      if (!result[card.set]) {
        result[card.set] = {
          set: card.set,
          totalCards: 0,
          uniqueCards: 0,
          invested: 0,
          estimatedValue: 0,
          profit: 0,
          roi: 0,
        };
      }

      const current = result[card.set];

      current.totalCards += card.quantity;
      current.uniqueCards += 1;
      current.invested += card.purchasePrice * card.quantity;
      current.estimatedValue += card.estimatedValue * card.quantity;

      return result;
    },
    {}
  );

  return Object.values(sets)
    .map((set) => {
      set.profit = set.estimatedValue - set.invested;

      set.roi =
        set.invested > 0
          ? (set.profit / set.invested) * 100
          : 0;

      return set;
    })
    .sort((a, b) => b.estimatedValue - a.estimatedValue);
}