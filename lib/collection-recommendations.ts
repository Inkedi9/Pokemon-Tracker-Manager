import type { PokemonCard } from "@/types/card";

export type RecommendationLevel =
    | "critical"
    | "warning"
    | "info"
    | "positive";

export type RecommendationCategory =
    | "data"
    | "organization"
    | "value"
    | "collection"
    | "diversity"
    | "progress";

export type CollectionRecommendation = {
    id: string;
    title: string;
    description: string;
    action: string;
    level: RecommendationLevel;
    category: RecommendationCategory;
};

export type CollectionRecommendations = {
    recommendations: CollectionRecommendation[];
    critical: number;
    warnings: number;
    informational: number;
    positive: number;
};

function countMissing(
    cards: PokemonCard[],
    getter: (card: PokemonCard) => boolean
) {
    return cards.filter(getter).length;
}

export function getCollectionRecommendations(
    cards: PokemonCard[]
): CollectionRecommendations {
    const recommendations: CollectionRecommendation[] = [];

    if (cards.length === 0) {
        return {
            recommendations: [],
            critical: 0,
            warnings: 0,
            informational: 0,
            positive: 0,
        };
    }

    // --------------------------------------------------
    // DATA QUALITY
    // --------------------------------------------------

    const cardsWithoutValue = countMissing(
        cards,
        (card) => card.estimatedValue <= 0
    );

    if (cardsWithoutValue > 0) {
        recommendations.push({
            id: "missing-estimated-values",
            title: "Complète les valeurs estimées",
            description: `${cardsWithoutValue} carte${cardsWithoutValue > 1 ? "s" : ""} n'a${cardsWithoutValue > 1 ? "nt" : " pas"} pas encore de valeur estimée.`,
            action: "Ajoute une valeur estimée pour améliorer tes analyses financières.",
            level: cardsWithoutValue >= 10
                ? "critical"
                : "warning",
            category: "data",
        });
    }

    const cardsWithoutLocation = countMissing(
        cards,
        (card) => !card.location?.trim()
    );

    if (cardsWithoutLocation > 0) {
        recommendations.push({
            id: "missing-locations",
            title: "Renseigne les emplacements",
            description: `${cardsWithoutLocation} carte${cardsWithoutLocation > 1 ? "s" : ""} n'a${cardsWithoutLocation > 1 ? "nt" : " pas"} pas d'emplacement.`,
            action: "Ajoute les emplacements pour mieux organiser ta collection physique.",
            level: cardsWithoutLocation >= 10
                ? "warning"
                : "info",
            category: "organization",
        });
    }

    const cardsWithoutNotes = countMissing(
        cards,
        (card) => !card.notes?.trim()
    );

    if (cardsWithoutNotes > cards.length * 0.8) {
        recommendations.push({
            id: "notes-usage",
            title: "Utilise davantage les notes",
            description: "La majorité de ta collection ne contient aucune note.",
            action: "Utilise les notes pour conserver des informations utiles sur tes cartes.",
            level: "info",
            category: "data",
        });
    }

    // --------------------------------------------------
    // COLLECTION STRUCTURE
    // --------------------------------------------------

    const totalQuantity = cards.reduce(
        (total, card) => total + card.quantity,
        0
    );

    const duplicatedQuantity = cards.filter(
        (card) => card.quantity > 1
    );

    if (duplicatedQuantity.length > 0) {
        const duplicatedUnits = duplicatedQuantity.reduce(
            (total, card) => total + (card.quantity - 1),
            0
        );

        recommendations.push({
            id: "duplicate-quantity",
            title: "Tu possèdes plusieurs exemplaires",
            description: `${duplicatedQuantity.length} référence${duplicatedQuantity.length > 1 ? "s" : ""} possède${duplicatedQuantity.length > 1 ? "nt" : ""} plusieurs exemplaires.`,
            action: `${duplicatedUnits} exemplaire${duplicatedUnits > 1 ? "s" : ""} supplémentaire${duplicatedUnits > 1 ? "s" : ""} pourrai${duplicatedUnits > 1 ? "ent" : "t"} être utilisé${duplicatedUnits > 1 ? "s" : ""} pour du trade ou une future vente.`,
            level: "info",
            category: "collection",
        });
    }

    // --------------------------------------------------
    // DIVERSITY
    // --------------------------------------------------

    const sets = new Set(
        cards
            .map((card) => card.set.trim())
            .filter(Boolean)
    );

    const languages = new Set(
        cards
            .map((card) => card.language)
            .filter(Boolean)
    );

    if (sets.size === 1 && cards.length >= 10) {
        recommendations.push({
            id: "single-set",
            title: "Collection concentrée sur une extension",
            description: "Toutes tes cartes appartiennent actuellement à une seule extension.",
            action: "Explorer d'autres extensions permettrait d'élargir la collection.",
            level: "info",
            category: "diversity",
        });
    }

    if (languages.size === 1 && cards.length >= 10) {
        recommendations.push({
            id: "single-language",
            title: "Une seule langue est représentée",
            description: "Ta collection contient actuellement une seule langue.",
            action: "Tu pourrais diversifier les langues si cela correspond à ton objectif de collection.",
            level: "info",
            category: "diversity",
        });
    }

    // --------------------------------------------------
    // VALUE
    // --------------------------------------------------

    const totalValue = cards.reduce(
        (total, card) =>
            total + card.estimatedValue * card.quantity,
        0
    );

    const totalInvested = cards.reduce(
        (total, card) =>
            total + card.purchasePrice * card.quantity,
        0
    );

    if (totalValue > 0 && totalInvested > 0) {
        const profit = totalValue - totalInvested;
        const roi = (profit / totalInvested) * 100;

        if (roi >= 20) {
            recommendations.push({
                id: "strong-roi",
                title: "Ta collection affiche une bonne valorisation",
                description: `La valeur estimée dépasse actuellement l'investissement de ${roi.toFixed(1)} %.`,
                action: "Continue à suivre cette évolution avec les snapshots de progression.",
                level: "positive",
                category: "value",
            });
        }

        if (roi < 0) {
            recommendations.push({
                id: "negative-roi",
                title: "La valeur estimée est inférieure à l'investissement",
                description: `L'écart actuel représente ${Math.abs(roi).toFixed(1)} % de l'investissement.`,
                action: "Surveille les cartes les plus déficitaires dans l'analyse de rentabilité.",
                level: "warning",
                category: "value",
            });
        }
    }

    // --------------------------------------------------
    // COLLECTION SIZE
    // --------------------------------------------------

    if (totalQuantity >= 100) {
        recommendations.push({
            id: "collection-milestone-100",
            title: "Cap des 100 cartes atteint",
            description: `Ta collection contient actuellement ${totalQuantity.toLocaleString("fr-FR")} cartes.`,
            action: "Continue à suivre tes objectifs pour structurer les prochaines étapes.",
            level: "positive",
            category: "progress",
        });
    }

    if (cards.length >= 50) {
        recommendations.push({
            id: "collection-mature",
            title: "Ta collection commence à devenir importante",
            description: `${cards.length} références différentes sont actuellement enregistrées.`,
            action: "Utilise les objectifs et les statistiques pour mieux orienter son évolution.",
            level: "positive",
            category: "collection",
        });
    }

    // --------------------------------------------------
    // SORTING
    // --------------------------------------------------

    const priority: Record<
        RecommendationLevel,
        number
    > = {
        critical: 0,
        warning: 1,
        info: 2,
        positive: 3,
    };

    recommendations.sort(
        (a, b) =>
            priority[a.level] -
            priority[b.level]
    );

    return {
        recommendations,
        critical: recommendations.filter(
            (item) => item.level === "critical"
        ).length,
        warnings: recommendations.filter(
            (item) => item.level === "warning"
        ).length,
        informational: recommendations.filter(
            (item) => item.level === "info"
        ).length,
        positive: recommendations.filter(
            (item) => item.level === "positive"
        ).length,
    };
}