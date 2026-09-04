import type { PokemonCard } from "@/types/card";

const STORAGE_KEY = "pokemon-tracker-collection";

export function getCollection(): PokemonCard[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as PokemonCard[];
  } catch {
    console.error("Impossible de lire la collection.");

    return [];
  }
}

export function saveCollection(cards: PokemonCard[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function addCard(card: PokemonCard) {
  const collection = getCollection();

  const updatedCollection = [...collection, card];

  saveCollection(updatedCollection);

  return updatedCollection;
}

export function updateCard(updatedCard: PokemonCard) {
  const collection = getCollection();

  const updatedCollection = collection.map((card) =>
    card.id === updatedCard.id ? updatedCard : card
  );

  saveCollection(updatedCollection);

  return updatedCollection;
}

export function deleteCard(cardId: string) {
  const collection = getCollection();

  const updatedCollection = collection.filter(
    (card) => card.id !== cardId
  );

  saveCollection(updatedCollection);

  return updatedCollection;
}

export function clearCollection() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}