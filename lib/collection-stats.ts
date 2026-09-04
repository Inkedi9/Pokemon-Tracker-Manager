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