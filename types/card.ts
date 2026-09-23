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

export type PriceSource =
    | "manual"
    | "cardmarket"
    | "tcgplayer"
    | "ebay"
    | "other";

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

    marketPrice?: number;
    priceSource?: PriceSource;
    priceUpdatedAt?: string;
    priceHistory?: PriceSnapshot[];

    image?: string;
    location?: string;
    notes?: string;
};

export type PriceSnapshot = {
    price: number;
    source?: PriceSource;
    recordedAt: string;
};