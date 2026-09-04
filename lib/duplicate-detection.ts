import type { PokemonCard } from "@/types/card";

export type DuplicateGroup = {
  key: string;
  cards: PokemonCard[];
  totalQuantity: number;
  totalInvested: number;
  totalEstimatedValue: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getDuplicateKey(card: PokemonCard) {
  return [
    normalize(card.name),
    normalize(card.set),
    normalize(card.number),
    card.language,
  ].join("|");
}

export function getDuplicateGroups(
  cards: PokemonCard[]
): DuplicateGroup[] {
  const groups = cards.reduce<Record<string, PokemonCard[]>>(
    (result, card) => {
      const key = getDuplicateKey(card);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(card);

      return result;
    },
    {}
  );

  return Object.entries(groups)
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({
      key,
      cards: group,
      totalQuantity: group.reduce(
        (total, card) => total + card.quantity,
        0
      ),
      totalInvested: group.reduce(
        (total, card) => total + card.purchasePrice * card.quantity,
        0
      ),
      totalEstimatedValue: group.reduce(
        (total, card) => total + card.estimatedValue * card.quantity,
        0
      ),
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export type DuplicateSummary = {
  duplicateGroups: number;
  duplicatedEntries: number;
  duplicatedQuantity: number;
};

export function getDuplicateSummary(
  cards: PokemonCard[]
): DuplicateSummary {
  const groups = getDuplicateGroups(cards);

  const duplicatedEntries = groups.reduce(
    (total, group) => total + group.cards.length,
    0
  );

  const duplicatedQuantity = groups.reduce(
    (total, group) => total + group.totalQuantity,
    0
  );

  return {
    duplicateGroups: groups.length,
    duplicatedEntries,
    duplicatedQuantity,
  };
}