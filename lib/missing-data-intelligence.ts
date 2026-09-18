import type { PokemonCard } from "@/types/card";

export type MissingDataField =
    | "name"
    | "set"
    | "number"
    | "language"
    | "rarity"
    | "condition"
    | "location"
    | "estimatedValue"
    | "image"
    | "notes";

export type MissingDataPriority =
    | "critical"
    | "high"
    | "medium"
    | "low";

export type MissingDataItem = {
    card: PokemonCard;
    missingFields: MissingDataField[];
    priority: MissingDataPriority;
    completeness: number;
};

export type MissingDataSummary = {
    totalCards: number;
    completeCards: number;
    incompleteCards: number;
    totalMissingFields: number;
    completionRate: number;
    byField: Record<MissingDataField, number>;
    items: MissingDataItem[];
};

const ALL_FIELDS: MissingDataField[] = [
    "name",
    "set",
    "number",
    "language",
    "rarity",
    "condition",
    "location",
    "estimatedValue",
    "image",
    "notes",
];

const ESSENTIAL_FIELDS: MissingDataField[] = [
    "name",
    "set",
    "number",
    "language",
    "rarity",
    "condition",
    "location",
    "estimatedValue",
];

function isFieldMissing(
    card: PokemonCard,
    field: MissingDataField
) {
    switch (field) {
        case "name":
            return !card.name?.trim();

        case "set":
            return !card.set?.trim();

        case "number":
            return !card.number?.trim();

        case "language":
            return !card.language;

        case "rarity":
            return !card.rarity;

        case "condition":
            return !card.condition;

        case "location":
            return !card.location?.trim();

        case "estimatedValue":
            return card.estimatedValue <= 0;

        case "image":
            return !card.image?.trim();

        case "notes":
            return !card.notes?.trim();

        default:
            return false;
    }
}

function getPriority(
    missingFields: MissingDataField[]
): MissingDataPriority {
    const essentialMissing = missingFields.filter((field) =>
        ESSENTIAL_FIELDS.includes(field)
    );

    if (essentialMissing.length >= 3) {
        return "critical";
    }

    if (essentialMissing.length >= 1) {
        return "high";
    }

    if (missingFields.length >= 2) {
        return "medium";
    }

    return "low";
}

function getCompleteness(
    missingFields: MissingDataField[]
) {
    return Math.round(
        ((ALL_FIELDS.length - missingFields.length) /
            ALL_FIELDS.length) *
            100
    );
}

export function getMissingDataSummary(
    cards: PokemonCard[]
): MissingDataSummary {
    const byField: Record<MissingDataField, number> = {
        name: 0,
        set: 0,
        number: 0,
        language: 0,
        rarity: 0,
        condition: 0,
        location: 0,
        estimatedValue: 0,
        image: 0,
        notes: 0,
    };

    const items: MissingDataItem[] = [];

    for (const card of cards) {
        const missingFields = ALL_FIELDS.filter((field) =>
            isFieldMissing(card, field)
        );

        for (const field of missingFields) {
            byField[field]++;
        }

        if (missingFields.length > 0) {
            items.push({
                card,
                missingFields,
                priority: getPriority(missingFields),
                completeness: getCompleteness(missingFields),
            });
        }
    }

    const completeCards =
        cards.length - items.length;

    const totalMissingFields = Object.values(byField).reduce(
        (total, count) => total + count,
        0
    );

    const completionRate =
        cards.length === 0
            ? 0
            : Math.round(
                  (completeCards / cards.length) * 100
              );

    const priorityWeight: Record<
        MissingDataPriority,
        number
    > = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
    };

    items.sort(
        (a, b) =>
            priorityWeight[b.priority] -
                priorityWeight[a.priority] ||
            a.completeness - b.completeness
    );

    return {
        totalCards: cards.length,
        completeCards,
        incompleteCards: items.length,
        totalMissingFields,
        completionRate,
        byField,
        items,
    };
}