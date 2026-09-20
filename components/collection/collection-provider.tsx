"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { PokemonCard } from "@/types/card";
import initialCards from "@/data/cards.json";

type CollectionContextType = {
  cards: PokemonCard[];
  addCard: (card: PokemonCard) => void;
  updateCard: (card: PokemonCard) => void;
  deleteCard: (cardId: string) => void;
  deleteCards: (cardIds: string[]) => void;
  clearCollection: () => void;
};

const CollectionContext =
  createContext<CollectionContextType | null>(null);

const STORAGE_KEY = "pokemon-tracker-collection";

function loadCardsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored) as PokemonCard[];
    } catch {
      return initialCards as PokemonCard[];
    }
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialCards)
  );

  return initialCards as PokemonCard[];
}

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setCards(loadCardsFromStorage());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cards)
    );
  }, [cards, hydrated]);

  function addCard(card: PokemonCard) {
    setCards((current) => [...current, card]);
  }

  function updateCard(updatedCard: PokemonCard) {
    setCards((current) =>
      current.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  }

  function deleteCard(cardId: string) {
    setCards((current) =>
      current.filter((card) => card.id !== cardId)
    );
  }

  function deleteCards(cardIds: string[]) {
    const ids = new Set(cardIds);

    setCards((current) =>
      current.filter((card) => !ids.has(card.id))
    );
  }

  function clearCollection() {
    setCards([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <CollectionContext.Provider
      value={{
        cards,
        addCard,
        updateCard,
        deleteCard,
        deleteCards,
        clearCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);

  if (!context) {
    throw new Error(
      "useCollection doit être utilisé dans un CollectionProvider"
    );
  }

  return context;
}
