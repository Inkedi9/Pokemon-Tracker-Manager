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
  clearCollection: () => void;
};

const CollectionContext =
  createContext<CollectionContextType | null>(null);

const STORAGE_KEY = "pokemon-tracker-collection";

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setCards(JSON.parse(stored) as PokemonCard[]);
      } catch {
        setCards(initialCards as PokemonCard[]);
      }
    } else {
      setCards(initialCards as PokemonCard[]);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialCards)
      );
    }

    setHydrated(true);
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