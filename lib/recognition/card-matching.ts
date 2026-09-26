import type { PokemonCard } from "@/types/card";

export type MatchConfidence =
    | "high"
    | "medium"
    | "low";

export type CardMatchCandidate = {
    card: PokemonCard;
    score: number;
    confidence: MatchConfidence;
    rank: number;
    scoreGap: number;
    reasons: string[];
};

export type CardMatchingResult = {
    normalizedText: string;
    detectedNumber: string | null;
    candidates: CardMatchCandidate[];
};

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9/ -]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeCardNumber(
    value: string
): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9/]/g, "")
        .replace(/o/g, "0");
}

function extractCardNumber(
    text: string
): string | null {
    const patterns = [
        /\b(\d{1,3}\s*\/\s*\d{1,3})\b/,
        /\b([a-z]{1,4}\s*\d{1,3}\s*\/\s*\d{1,3})\b/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);

        if (match?.[1]) {
            return normalizeCardNumber(
                match[1]
            );
        }
    }

    return null;
}

function levenshteinDistance(
    a: string,
    b: string
): number {
    const rows = a.length + 1;
    const columns = b.length + 1;

    const matrix: number[][] =
        Array.from(
            { length: rows },
            () =>
                Array<number>(
                    columns
                ).fill(0)
        );

    for (let i = 0; i < rows; i += 1) {
        matrix[i][0] = i;
    }

    for (let j = 0; j < columns; j += 1) {
        matrix[0][j] = j;
    }

    for (let i = 1; i < rows; i += 1) {
        for (
            let j = 1;
            j < columns;
            j += 1
        ) {
            const cost =
                a[i - 1] === b[j - 1]
                    ? 0
                    : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] +
                    cost
            );
        }
    }

    return matrix[rows - 1][columns - 1];
}

function stringSimilarity(
    a: string,
    b: string
): number {
    if (!a || !b) {
        return 0;
    }

    if (a === b) {
        return 1;
    }

    const distance =
        levenshteinDistance(a, b);

    const maxLength = Math.max(
        a.length,
        b.length
    );

    if (maxLength === 0) {
        return 1;
    }

    return 1 - distance / maxLength;
}

function scoreName(
    cardName: string,
    normalizedText: string
): {
    score: number;
    matched: boolean;
    fuzzy: boolean;
} {
    const normalizedName =
        normalizeText(cardName);

    if (!normalizedName) {
        return {
            score: 0,
            matched: false,
            fuzzy: false,
        };
    }

    if (
        normalizedText.includes(
            normalizedName
        )
    ) {
        return {
            score: 60,
            matched: true,
            fuzzy: false,
        };
    }

    const nameWords =
        normalizedName
            .split(" ")
            .filter(Boolean);

    const textWords =
        normalizedText
            .split(" ")
            .filter(Boolean);

    if (nameWords.length === 0) {
        return {
            score: 0,
            matched: false,
            fuzzy: false,
        };
    }

    const matchedWords =
        nameWords.filter((word) =>
            textWords.includes(word)
        );

    const exactRatio =
        matchedWords.length /
        nameWords.length;

    if (exactRatio >= 0.75) {
        return {
            score: 45,
            matched: true,
            fuzzy: false,
        };
    }

    if (exactRatio >= 0.5) {
        return {
            score: 30,
            matched: true,
            fuzzy: false,
        };
    }

    const fuzzyMatches =
        nameWords.filter((nameWord) =>
            textWords.some((textWord) => {
                const similarity =
                    stringSimilarity(
                        nameWord,
                        textWord
                    );

                if (
                    nameWord.length <= 4
                ) {
                    return (
                        similarity >= 0.75
                    );
                }

                return (
                    similarity >= 0.72
                );
            })
        );

    const fuzzyRatio =
        fuzzyMatches.length /
        nameWords.length;

    if (fuzzyRatio >= 0.75) {
        return {
            score: 45,
            matched: true,
            fuzzy: true,
        };
    }

    if (fuzzyRatio >= 0.5) {
        return {
            score: 30,
            matched: true,
            fuzzy: true,
        };
    }

    return {
        score: 0,
        matched: false,
        fuzzy: false,
    };
}

function scoreNumber(
    cardNumber: string,
    detectedNumber: string | null
): {
    score: number;
    matched: boolean;
    fuzzy: boolean;
} {
    if (!detectedNumber) {
        return {
            score: 0,
            matched: false,
            fuzzy: false,
        };
    }

    const normalizedCardNumber =
        normalizeCardNumber(cardNumber);

    const normalizedDetectedNumber =
        normalizeCardNumber(
            detectedNumber
        );

    if (
        normalizedCardNumber ===
        normalizedDetectedNumber
    ) {
        return {
            score: 40,
            matched: true,
            fuzzy: false,
        };
    }

    const cardNumberClean =
        normalizedCardNumber.replace(
            /\//g,
            ""
        );

    const detectedNumberClean =
        normalizedDetectedNumber.replace(
            /\//g,
            ""
        );

    const similarity =
        stringSimilarity(
            cardNumberClean,
            detectedNumberClean
        );

    if (similarity >= 0.85) {
        return {
            score: 32,
            matched: true,
            fuzzy: true,
        };
    }

    return {
        score: 0,
        matched: false,
        fuzzy: false,
    };
}

function scoreSet(
    cardSet: string,
    normalizedText: string
): {
    score: number;
    matched: boolean;
    fuzzy: boolean;
} {
    const normalizedSet =
        normalizeText(cardSet);

    if (
        !normalizedSet ||
        normalizedSet.length < 3
    ) {
        return {
            score: 0,
            matched: false,
            fuzzy: false,
        };
    }

    if (
        normalizedText.includes(
            normalizedSet
        )
    ) {
        return {
            score: 10,
            matched: true,
            fuzzy: false,
        };
    }

    const setWords =
        normalizedSet
            .split(" ")
            .filter(Boolean);

    const textWords =
        normalizedText
            .split(" ")
            .filter(Boolean);

    const fuzzyMatches =
        setWords.filter((setWord) =>
            textWords.some((textWord) => {
                const similarity =
                    stringSimilarity(
                        setWord,
                        textWord
                    );

                if (
                    setWord.length <= 4
                ) {
                    return (
                        similarity >= 0.8
                    );
                }

                return (
                    similarity >= 0.72
                );
            })
        );

    const ratio =
        fuzzyMatches.length /
        setWords.length;

    if (ratio >= 0.75) {
        return {
            score: 7,
            matched: true,
            fuzzy: true,
        };
    }

    return {
        score: 0,
        matched: false,
        fuzzy: false,
    };
}

function calculateConfidence(
    score: number,
    scoreGap: number,
    reasons: string[]
): MatchConfidence {
    const hasStrongSignal =
        reasons.some(
            (reason) =>
                reason ===
                    "Numéro détecté" ||
                reason === "Nom détecté"
        );

    if (
        score >= 85 &&
        scoreGap >= 15 &&
        hasStrongSignal
    ) {
        return "high";
    }

    if (
        score >= 65 &&
        scoreGap >= 8
    ) {
        return "medium";
    }

    return "low";
}

function applyAmbiguityPenalty(
    score: number,
    scoreGap: number
): number {
    if (scoreGap >= 20) {
        return score;
    }

    if (scoreGap >= 10) {
        return Math.max(
            0,
            score - 3
        );
    }

    if (scoreGap >= 5) {
        return Math.max(
            0,
            score - 8
        );
    }

    return Math.max(
        0,
        score - 15
    );
}

export function matchCards(
    ocrText: string,
    cards: PokemonCard[],
    limit = 5
): CardMatchingResult {
    const normalizedText =
        normalizeText(ocrText);

    const detectedNumber =
        extractCardNumber(
            normalizedText
        );

    if (!normalizedText) {
        return {
            normalizedText,
            detectedNumber,
            candidates: [],
        };
    }

    const rawCandidates =
        cards
            .map((card) => {
                const reasons: string[] = [];
                let score = 0;

                const nameMatch =
                    scoreName(
                        card.name,
                        normalizedText
                    );

                score += nameMatch.score;

                if (
                    nameMatch.matched
                ) {
                    reasons.push(
                        nameMatch.fuzzy
                            ? "Nom approximatif"
                            : "Nom détecté"
                    );
                }

                const numberMatch =
                    scoreNumber(
                        card.number,
                        detectedNumber
                    );

                score += numberMatch.score;

                if (
                    numberMatch.matched
                ) {
                    reasons.push(
                        numberMatch.fuzzy
                            ? "Numéro approximatif"
                            : "Numéro détecté"
                    );
                }

                const setMatch =
                    scoreSet(
                        card.set,
                        normalizedText
                    );

                score += setMatch.score;

                if (
                    setMatch.matched
                ) {
                    reasons.push(
                        setMatch.fuzzy
                            ? "Extension approximative"
                            : "Extension détectée"
                    );
                }

                return {
                    card,
                    score: Math.min(
                        score,
                        100
                    ),
                    reasons,
                };
            })
            .filter(
                (candidate) =>
                    candidate.score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            );

    const topCandidates =
        rawCandidates.slice(
            0,
            limit
        );

    const bestScore =
        topCandidates[0]?.score ?? 0;

    const rankedCandidates =
        topCandidates.map(
            (candidate, index) => {
                const nextCandidate =
                    topCandidates[
                        index + 1
                    ];

                const scoreGap =
                    nextCandidate
                        ? candidate.score -
                          nextCandidate.score
                        : candidate.score;

                const adjustedScore =
                    index === 0
                        ? applyAmbiguityPenalty(
                              candidate.score,
                              scoreGap
                          )
                        : candidate.score;

                const confidence =
                    calculateConfidence(
                        adjustedScore,
                        scoreGap,
                        candidate.reasons
                    );

                return {
                    ...candidate,
                    score: Math.min(
                        adjustedScore,
                        100
                    ),
                    confidence,
                    rank: index + 1,
                    scoreGap,
                };
            }
        );

    /**
     * Évite qu'un score isolé très faible
     * soit présenté comme une vraie détection.
     */
    const candidates =
        rankedCandidates.filter(
            (candidate) =>
                candidate.score >= 20 ||
                candidate.rank === 1 &&
                    candidate.score ===
                        bestScore
        );

    return {
        normalizedText,
        detectedNumber,
        candidates,
    };
}