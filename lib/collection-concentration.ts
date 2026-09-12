import type { PokemonCard } from "@/types/card";

export type ConcentrationItem = {
  name: string;
  value: number;
  percentage: number;
};

export type CardConcentration = {
  card: PokemonCard;
  value: number;
  percentage: number;
};

export type CollectionConcentration = {
  totalValue: number;

  topCard: CardConcentration | null;

  top1Value: number;
  top1Percentage: number;

  top5Value: number;
  top5Percentage: number;

  top10Value: number;
  top10Percentage: number;

  setDistribution: ConcentrationItem[];

  topSet: ConcentrationItem | null;

  top1SetPercentage: number;
  top3SetPercentage: number;
  top5SetPercentage: number;
};

function getCardValue(card: PokemonCard) {
  return card.estimatedValue * card.quantity;
}

function getPercentage(
  value: number,
  total: number
) {
  return total > 0
    ? (value / total) * 100
    : 0;
}

function getTopValue(
  cards: CardConcentration[],
  limit: number
) {
  return cards
    .slice(0, limit)
    .reduce(
      (total, item) => total + item.value,
      0
    );
}

export function getCollectionConcentration(
  cards: PokemonCard[]
): CollectionConcentration {
  const totalValue = cards.reduce(
    (total, card) => total + getCardValue(card),
    0
  );

  const cardConcentration: CardConcentration[] = cards
    .map((card) => {
      const value = getCardValue(card);

      return {
        card,
        value,
        percentage: getPercentage(
          value,
          totalValue
        ),
      };
    })
    .sort((a, b) => b.value - a.value);

  const top1Value = getTopValue(
    cardConcentration,
    1
  );

  const top5Value = getTopValue(
    cardConcentration,
    5
  );

  const top10Value = getTopValue(
    cardConcentration,
    10
  );

  const setValues = cards.reduce<
    Record<string, number>
  >((result, card) => {
    const set = card.set.trim() || "Sans extension";

    result[set] =
      (result[set] ?? 0) + getCardValue(card);

    return result;
  }, {});

  const setDistribution: ConcentrationItem[] =
    Object.entries(setValues)
      .map(([name, value]) => ({
        name,
        value,
        percentage: getPercentage(
          value,
          totalValue
        ),
      }))
      .sort((a, b) => b.value - a.value);

  const topSet =
    setDistribution.length > 0
      ? setDistribution[0]
      : null;

  const top1SetPercentage = getPercentage(
    setDistribution
      .slice(0, 1)
      .reduce(
        (total, item) => total + item.value,
        0
      ),
    totalValue
  );

  const top3SetPercentage = getPercentage(
    setDistribution
      .slice(0, 3)
      .reduce(
        (total, item) => total + item.value,
        0
      ),
    totalValue
  );

  const top5SetPercentage = getPercentage(
    setDistribution
      .slice(0, 5)
      .reduce(
        (total, item) => total + item.value,
        0
      ),
    totalValue
  );

  return {
    totalValue,

    topCard:
      cardConcentration.length > 0
        ? cardConcentration[0]
        : null,

    top1Value,
    top1Percentage: getPercentage(
      top1Value,
      totalValue
    ),

    top5Value,
    top5Percentage: getPercentage(
      top5Value,
      totalValue
    ),

    top10Value,
    top10Percentage: getPercentage(
      top10Value,
      totalValue
    ),

    setDistribution,

    topSet,

    top1SetPercentage,
    top3SetPercentage,
    top5SetPercentage,
  };
}

export function getCardConcentration(
  cards: PokemonCard[]
): CardConcentration[] {
  const totalValue = cards.reduce(
    (total, card) => total + getCardValue(card),
    0
  );

  return cards
    .map((card) => {
      const value = getCardValue(card);

      return {
        card,
        value,
        percentage: getPercentage(
          value,
          totalValue
        ),
      };
    })
    .sort((a, b) => b.value - a.value);
}