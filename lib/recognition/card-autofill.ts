import type { PokemonCard } from "@/types/card";

import type {
    CardMatchCandidate,
} from "@/lib/recognition/card-matching";

export type CardAutoFillData = {
    name: string;
    set: string;
    number: string;
    language: PokemonCard["language"];
    rarity: string;
};

export function createAutoFillData(
    candidate: CardMatchCandidate
): CardAutoFillData {
    return {
        name: candidate.card.name,
        set: candidate.card.set,
        number: candidate.card.number,
        language: candidate.card.language,
        rarity: candidate.card.rarity,
    };
}