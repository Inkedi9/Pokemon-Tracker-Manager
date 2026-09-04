export type CardLanguage =
    | "FR"
    | "EN"
    | "JP"
    | "KR"
    | "DE"
    | "ES"
    | "IT";

export type CardCondition =
    | "NM"
    | "LP"
    | "MP"
    | "HP"
    | "DMG";

export type PokemonCard = {
    id: string;

    name: string;
    set: string;
    number: string;

    language: CardLanguage;
    rarity: string;

    quantity: number;
    condition: CardCondition;

    purchasePrice: number;
    estimatedValue: number;

    image?: string;
    location?: string;
    notes?: string;
};