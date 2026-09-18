import type { PokemonCard } from "@/types/card";

export type IntelligenceLevel =
    | "positive"
    | "info"
    | "warning"
    | "danger";

export type IntelligencePriority =
    | "critical"
    | "high"
    | "medium"
    | "low";

export type IntelligenceCategory =
    | "data"
    | "organization"
    | "collection"
    | "diversity";

export type IntelligenceInsight = {
    id: string;
    title: string;
    description: string;
    action: string;
    level: IntelligenceLevel;
    priority: IntelligencePriority;
    category: IntelligenceCategory;
};

export type CollectionIntelligence = {
    score: number;

    insights: IntelligenceInsight[];

    strengths: number;
    warnings: number;
    critical: number;

    dataQuality: number;
    organizationScore: number;
    diversityScore: number;
};

function getCardValue(card: PokemonCard) {
    return card.estimatedValue * card.quantity;
}

function getPriorityWeight(priority: IntelligencePriority) {
    switch (priority) {
        case "critical":
            return 4;

        case "high":
            return 3;

        case "medium":
            return 2;

        case "low":
        default:
            return 1;
    }
}

function sortInsights(
    insights: IntelligenceInsight[]
) {
    return [...insights].sort((a, b) => {
        const priorityDifference =
            getPriorityWeight(b.priority) -
            getPriorityWeight(a.priority);

        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        const levelWeight = {
            danger: 4,
            warning: 3,
            info: 2,
            positive: 1,
        };

        return levelWeight[b.level] - levelWeight[a.level];
    });
}

export function getCollectionIntelligence(
    cards: PokemonCard[]
): CollectionIntelligence {
    if (cards.length === 0) {
        return {
            score: 0,
            insights: [],
            strengths: 0,
            warnings: 0,
            critical: 0,
            dataQuality: 0,
            organizationScore: 0,
            diversityScore: 0,
        };
    }

    const insights: IntelligenceInsight[] = [];

    const totalValue = cards.reduce(
        (total, card) => total + getCardValue(card),
        0
    );

    const cardsWithoutValue = cards.filter(
        (card) => card.estimatedValue <= 0
    );

    const cardsWithoutLocation = cards.filter(
        (card) => !card.location?.trim()
    );

    const cardsWithNotes = cards.filter(
        (card) => Boolean(card.notes?.trim())
    );

    const multiQuantityCards = cards.filter(
        (card) => card.quantity > 1
    );

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

    const rarities = new Set(
        cards
            .map((card) => card.rarity)
            .filter(Boolean)
    );

    const conditions = new Set(
        cards
            .map((card) => card.condition)
            .filter(Boolean)
    );

    /*
     * ---------------------------------------------------------
     * DATA QUALITY
     * ---------------------------------------------------------
     */

    const valueCompleteness =
        1 - cardsWithoutValue.length / cards.length;

    const notesCompleteness =
        cardsWithNotes.length / cards.length;

    const dataQuality =
        Math.round(
            (
                valueCompleteness * 70 +
                notesCompleteness * 30
            )
        );

    if (totalValue > 0) {
        insights.push({
            id: "collection-valued",
            title: "Collection valorisée",
            description:
                "Ta collection possède actuellement une valeur estimée exploitable.",
            action:
                "Maintenir les valeurs estimées à jour.",
            level: "positive",
            priority: "low",
            category: "data",
        });
    } else {
        insights.push({
            id: "collection-no-value",
            title: "Aucune valeur exploitable",
            description:
                "Aucune carte ne possède actuellement une valeur estimée supérieure à zéro.",
            action:
                "Commencer par renseigner la valeur estimée des cartes principales.",
            level: "danger",
            priority: "critical",
            category: "data",
        });
    }

    if (cardsWithoutValue.length > 0) {
        const percentage =
            (cardsWithoutValue.length / cards.length) * 100;

        if (percentage >= 50) {
            insights.push({
                id: "missing-values-high",
                title: "Nombreuses valeurs manquantes",
                description:
                    `${cardsWithoutValue.length} cartes sur ${cards.length} n'ont pas encore de valeur estimée.`,
                action:
                    "Prioriser l'estimation des cartes ayant la plus forte valeur potentielle.",
                level: "danger",
                priority: "critical",
                category: "data",
            });
        } else if (percentage >= 20) {
            insights.push({
                id: "missing-values-medium",
                title: "Valeurs partiellement renseignées",
                description:
                    `${cardsWithoutValue.length} cartes n'ont pas encore de valeur estimée.`,
                action:
                    "Compléter progressivement les valeurs manquantes.",
                level: "warning",
                priority: "high",
                category: "data",
            });
        } else {
            insights.push({
                id: "missing-values-low",
                title: "Quelques valeurs manquantes",
                description:
                    `${cardsWithoutValue.length} cartes n'ont pas encore de valeur estimée.`,
                action:
                    "Compléter les dernières valeurs manquantes.",
                level: "info",
                priority: "medium",
                category: "data",
            });
        }
    } else {
        insights.push({
            id: "all-values",
            title: "Valeurs complètes",
            description:
                "Toutes les cartes possèdent une valeur estimée.",
            action:
                "Continuer à maintenir les estimations à jour.",
            level: "positive",
            priority: "low",
            category: "data",
        });
    }

    /*
     * ---------------------------------------------------------
     * ORGANIZATION
     * ---------------------------------------------------------
     */

    const locationCompleteness =
        1 - cardsWithoutLocation.length / cards.length;

    const organizationScore =
        Math.round(locationCompleteness * 100);

    if (cardsWithoutLocation.length === 0) {
        insights.push({
            id: "locations-complete",
            title: "Stock entièrement localisé",
            description:
                "Toutes les cartes disposent d'un emplacement.",
            action:
                "Conserver cette organisation lors des prochaines acquisitions.",
            level: "positive",
            priority: "low",
            category: "organization",
        });
    } else {
        const percentage =
            (cardsWithoutLocation.length / cards.length) * 100;

        if (percentage >= 50) {
            insights.push({
                id: "locations-critical",
                title: "Stock difficile à localiser",
                description:
                    `${cardsWithoutLocation.length} cartes n'ont pas encore d'emplacement renseigné.`,
                action:
                    "Renseigner les emplacements pour faciliter la gestion physique de la collection.",
                level: "warning",
                priority: "high",
                category: "organization",
            });
        } else {
            insights.push({
                id: "locations-missing",
                title: "Quelques emplacements manquants",
                description:
                    `${cardsWithoutLocation.length} cartes n'ont pas encore d'emplacement renseigné.`,
                action:
                    "Compléter les emplacements manquants.",
                level: "info",
                priority: "medium",
                category: "organization",
            });
        }
    }

    /*
     * ---------------------------------------------------------
     * COLLECTION STRUCTURE
     * ---------------------------------------------------------
     */

    if (multiQuantityCards.length > 0) {
        insights.push({
            id: "multi-quantity",
            title: "Exemplaires multiples",
            description:
                `${multiQuantityCards.length} références possèdent plusieurs exemplaires.`,
            action:
                "Vérifier si les doublons sont destinés à la collection, à l'échange ou à la revente.",
            level: "info",
            priority: "low",
            category: "collection",
        });
    }

    if (sets.size >= 5) {
        insights.push({
            id: "set-diversity",
            title: "Bonne diversité d'extensions",
            description:
                `Ta collection couvre actuellement ${sets.size} extensions différentes.`,
            action:
                "Continuer à diversifier uniquement si cela correspond à ta stratégie de collection.",
            level: "positive",
            priority: "low",
            category: "diversity",
        });
    } else if (sets.size === 1) {
        insights.push({
            id: "single-set",
            title: "Collection concentrée sur une extension",
            description:
                "Toutes tes cartes appartiennent actuellement à une seule extension.",
            action:
                "Explorer d'autres extensions si tu souhaites diversifier ta collection.",
            level: "info",
            priority: "low",
            category: "diversity",
        });
    }

    if (languages.size >= 2) {
        insights.push({
            id: "multi-language",
            title: "Collection multilingue",
            description:
                `Ta collection contient ${languages.size} langues différentes.`,
            action:
                "Conserver les langues séparées dans tes analyses de valeur.",
            level: "positive",
            priority: "low",
            category: "diversity",
        });
    }

    if (rarities.size >= 4) {
        insights.push({
            id: "rarity-diversity",
            title: "Bonne diversité de raretés",
            description:
                `Ta collection couvre ${rarities.size} catégories de rareté.`,
            action:
                "Continuer à suivre la répartition des raretés.",
            level: "positive",
            priority: "low",
            category: "diversity",
        });
    }

    if (conditions.size >= 3) {
        insights.push({
            id: "condition-diversity",
            title: "Plusieurs états représentés",
            description:
                `Ta collection contient ${conditions.size} états différents.`,
            action:
                "Vérifier que les conditions sont renseignées de manière cohérente.",
            level: "info",
            priority: "low",
            category: "collection",
        });
    }

    /*
     * ---------------------------------------------------------
     * DOCUMENTATION
     * ---------------------------------------------------------
     */

    if (cardsWithNotes.length === cards.length) {
        insights.push({
            id: "notes-complete",
            title: "Documentation complète",
            description:
                "Toutes les cartes possèdent des notes.",
            action:
                "Conserver les informations importantes lors des modifications.",
            level: "positive",
            priority: "low",
            category: "data",
        });
    } else if (cardsWithNotes.length === 0 && cards.length >= 5) {
        insights.push({
            id: "notes-empty",
            title: "Collection peu documentée",
            description:
                "Aucune carte ne possède actuellement de notes.",
            action:
                "Ajouter des notes uniquement lorsque des informations spécifiques doivent être conservées.",
            level: "info",
            priority: "low",
            category: "data",
        });
    }

    /*
     * ---------------------------------------------------------
     * SCORE GLOBAL
     * ---------------------------------------------------------
     *
     * Le score représente la qualité opérationnelle de la
     * collection, pas sa valeur financière.
     */

    const setDiversityScore = Math.min(
        sets.size * 3,
        15
    );

    const languageDiversityScore = Math.min(
        languages.size * 5,
        10
    );

    const diversityScore =
        setDiversityScore +
        languageDiversityScore;

    let score = 0;

    const valueScore =
        valueCompleteness * 50;

    const locationScore =
        locationCompleteness * 25;

    score =
        valueScore +
        locationScore +
        diversityScore;

    score = Math.round(
        Math.max(0, Math.min(100, score))
    );

    /*
     * ---------------------------------------------------------
     * COUNTERS
     * ---------------------------------------------------------
     */

    const sortedInsights =
        sortInsights(insights);

    const strengths =
        sortedInsights.filter(
            (insight) =>
                insight.level === "positive"
        ).length;

    const warnings =
        sortedInsights.filter(
            (insight) =>
                insight.level === "warning" ||
                insight.level === "info"
        ).length;

    const critical =
        sortedInsights.filter(
            (insight) =>
                insight.level === "danger"
        ).length;

    return {
        score,
        insights: sortedInsights,
        strengths,
        warnings,
        critical,
        dataQuality,
        organizationScore,
        diversityScore: Math.round(diversityScore),
    };
}