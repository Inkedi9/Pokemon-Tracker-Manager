import type { PokemonCard } from "@/types/card";

export type CardProfitability = {
  card: PokemonCard;

  invested: number;
  estimatedValue: number;
  profit: number;
  roi: number;
};

export type ProfitabilitySummary = {
  totalInvested: number;
  totalEstimatedValue: number;
  totalProfit: number;
  roi: number;

  profitableCards: number;
  unprofitableCards: number;
  neutralCards: number;

  bestCard: CardProfitability | null;
  worstCard: CardProfitability | null;
};

function getCardProfitability(
  card: PokemonCard
): CardProfitability {
  const invested = card.purchasePrice * card.quantity;

  const estimatedValue =
    card.estimatedValue * card.quantity;

  const profit = estimatedValue - invested;

  const roi =
    invested > 0
      ? (profit / invested) * 100
      : 0;

  return {
    card,
    invested,
    estimatedValue,
    profit,
    roi,
  };
}

export function getCardProfitabilities(
  cards: PokemonCard[]
): CardProfitability[] {
  return cards
    .map(getCardProfitability)
    .sort((a, b) => b.profit - a.profit);
}

export function getProfitabilitySummary(
  cards: PokemonCard[]
): ProfitabilitySummary {
  const profitabilities = getCardProfitabilities(cards);

  const totalInvested = profitabilities.reduce(
    (total, item) => total + item.invested,
    0
  );

  const totalEstimatedValue = profitabilities.reduce(
    (total, item) => total + item.estimatedValue,
    0
  );

  const totalProfit =
    totalEstimatedValue - totalInvested;

  const roi =
    totalInvested > 0
      ? (totalProfit / totalInvested) * 100
      : 0;

  const profitableCards = profitabilities.filter(
    (item) => item.profit > 0
  ).length;

  const unprofitableCards = profitabilities.filter(
    (item) => item.profit < 0
  ).length;

  const neutralCards = profitabilities.filter(
    (item) => item.profit === 0
  ).length;

  const bestCard =
    profitabilities.length > 0
      ? profitabilities[0]
      : null;

  const worstCard =
    profitabilities.length > 0
      ? profitabilities[profitabilities.length - 1]
      : null;

  return {
    totalInvested,
    totalEstimatedValue,
    totalProfit,
    roi,

    profitableCards,
    unprofitableCards,
    neutralCards,

    bestCard,
    worstCard,
  };
}