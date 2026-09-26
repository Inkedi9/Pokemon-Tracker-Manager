"use client";

import {
    Camera,
    ImagePlus,
    RefreshCw,
    ScanSearch,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    recognizeCardText,
} from "@/lib/recognition/card-recognition";

import {
    createAutoFillData,
} from "@/lib/recognition/card-autofill";

import type {
    CardMatchCandidate,
} from "@/lib/recognition/card-matching";

import {
    matchCards,
} from "@/lib/recognition/card-matching";

import {
    useCollection,
} from "@/components/collection/collection-provider";

import { AddCardDialog } from "@/components/collection/add-card-dialog";

import type {
    PokemonCard,
} from "@/types/card";

import { toast } from "sonner";

type ImageValidation = {
    valid: boolean;
    error: string | null;
    width: number | null;
    height: number | null;
};

type RecognitionStatus =
    | "idle"
    | "processing"
    | "success"
    | "error";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_IMAGE_WIDTH = 300;
const MIN_IMAGE_HEIGHT = 300;

export function ScannerPage() {

    const router = useRouter();

    const { cards } = useCollection();

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const [imageUrl, setImageUrl] =
        useState<string | null>(null);

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [validation, setValidation] =
        useState<ImageValidation>({
            valid: false,
            error: null,
            width: null,
            height: null,
        });

    const [isValidating, setIsValidating] =
        useState(false);

    const [recognitionStatus, setRecognitionStatus] =
        useState<RecognitionStatus>("idle");

    const [recognitionText, setRecognitionText] =
        useState("");

    const [recognitionConfidence, setRecognitionConfidence] =
        useState<number | null>(null);

    const [recognitionError, setRecognitionError] =
        useState<string | null>(null);

    const [matchCandidates, setMatchCandidates] =
        useState<CardMatchCandidate[]>([]);

    const [selectedCandidate, setSelectedCandidate] =
        useState<CardMatchCandidate | null>(null);

    const [autoFillData, setAutoFillData] =
        useState<
            ReturnType<typeof createAutoFillData> | null
        >(null);

    const [addDialogOpen, setAddDialogOpen] =
        useState(false);

    const imageUrlRef = useRef<string | null>(null);

    async function handleSelectImage(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setIsValidating(true);
        setRecognitionStatus("idle");
        setRecognitionText("");
        setRecognitionConfidence(null);
        setRecognitionError(null);
        setMatchCandidates([]);
        setSelectedCandidate(null);
        setAutoFillData(null);

        setValidation({
            valid: false,
            error: null,
            width: null,
            height: null,
        });

        if (
            ![
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(file.type)
        ) {
            setValidation({
                valid: false,
                error:
                    "Format non supporté. Utilisez JPG, PNG ou WEBP.",
                width: null,
                height: null,
            });

            setIsValidating(false);
            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setValidation({
                valid: false,
                error:
                    "L'image est trop volumineuse. La taille maximale est de 10 MB.",
                width: null,
                height: null,
            });

            setIsValidating(false);
            event.target.value = "";
            return;
        }

        const nextImageUrl =
            URL.createObjectURL(file);

        const image =
            new Image();

        image.onload = () => {
            const width = image.naturalWidth;
            const height = image.naturalHeight;

            if (
                width < MIN_IMAGE_WIDTH ||
                height < MIN_IMAGE_HEIGHT
            ) {
                URL.revokeObjectURL(
                    nextImageUrl
                );

                setValidation({
                    valid: false,
                    error:
                        "L'image est trop petite. Utilisez une image d'au moins 300 × 300 px.",
                    width,
                    height,
                });

                setIsValidating(false);
                event.target.value = "";
                return;
            }

            setSelectedFile(file);
            setImageUrl((current) => {
                if (current) {
                    URL.revokeObjectURL(current);
                }

                return nextImageUrl;
            });

            imageUrlRef.current = nextImageUrl;

            setValidation({
                valid: true,
                error: null,
                width,
                height,
            });

            setIsValidating(false);
        };

        image.onerror = () => {
            URL.revokeObjectURL(
                nextImageUrl
            );

            setValidation({
                valid: false,
                error:
                    "Impossible de lire cette image.",
                width: null,
                height: null,
            });

            setIsValidating(false);
        };

        image.src = nextImageUrl;

        event.target.value = "";
    }

    function handleOpenFilePicker() {
        fileInputRef.current?.click();
    }

    function handleRemoveImage() {
        setImageUrl((current) => {
            if (current) {
                URL.revokeObjectURL(current);
            }

            return null;
        });

        imageUrlRef.current = null;

        setSelectedFile(null);

        setValidation({
            valid: false,
            error: null,
            width: null,
            height: null,
        });

        setRecognitionStatus("idle");
        setRecognitionText("");
        setRecognitionConfidence(null);
        setRecognitionError(null);
        setMatchCandidates([]);
        setSelectedCandidate(null);
        setAutoFillData(null);
    }

    async function handleAnalyze() {
        if (
            !imageUrl ||
            !validation.valid
        ) {
            return;
        }

        setRecognitionStatus("processing");
        setRecognitionText("");
        setRecognitionConfidence(null);
        setRecognitionError(null);
        setMatchCandidates([]);
        setSelectedCandidate(null);
        setAutoFillData(null);

        try {
            const result =
                await recognizeCardText(
                    imageUrl,
                    "eng"
                );

            setRecognitionText(
                result.text
            );

            setRecognitionConfidence(
                result.confidence
            );

            const matchingResult =
                matchCards(
                    result.text,
                    cards
                );

            setMatchCandidates(
                matchingResult.candidates
            );

            const bestCandidate =
                matchingResult.candidates[0] ??
                null;

            setSelectedCandidate(
                bestCandidate
            );

            setRecognitionStatus(
                "success"
            );
        } catch (error) {
            console.error(
                "Card recognition failed:",
                error
            );

            setRecognitionError(
                "Impossible d'analyser cette image. Réessayez avec une photo plus nette."
            );

            setRecognitionStatus(
                "error"
            );
        }
    }

    function handleAutoFill(
        candidate: CardMatchCandidate
    ) {
        const data =
            createAutoFillData(candidate);

        setSelectedCandidate(candidate);
        setAutoFillData(data);
        setAddDialogOpen(true);
    }

    function handleCardAdded(card: PokemonCard) {
        setAddDialogOpen(false);
        setAutoFillData(null);
        setSelectedCandidate(null);
        setMatchCandidates([]);
        setRecognitionText("");
        setRecognitionConfidence(null);

        toast.success("Carte ajoutée à la collection", {
            description: `${card.name} a été ajoutée avec succès.`,
        });

        router.push("/collection");
    }

    useEffect(() => {
        return () => {
            if (imageUrlRef.current) {
                URL.revokeObjectURL(
                    imageUrlRef.current
                );
            }
        };
    }, []);

    return (
        <div className="space-y-8">
            <AddCardDialog
                open={addDialogOpen}
                onOpenChange={(value) => {
                    setAddDialogOpen(value);

                    if (!value) {
                        setAutoFillData(null);
                    }
                }}
                initialData={autoFillData}
                onSuccess={handleCardAdded}
            />
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <ScanSearch className="h-4 w-4 text-zinc-400" />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            Scanner
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">
                            Identifiez rapidement une carte Pokémon.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-3xl">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        capture="environment"
                        onChange={handleSelectImage}
                        className="hidden"
                    />

                    {!imageUrl ? (
                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                                <Camera className="h-6 w-6 text-zinc-500" />
                            </div>

                            <h2 className="mt-5 text-base font-semibold text-zinc-200">
                                Scanner une carte
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                                Prenez une photo ou importez une image
                                de votre carte Pokémon pour commencer
                                l'identification.
                            </p>

                            <button
                                type="button"
                                onClick={handleOpenFilePicker}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                            >
                                <ImagePlus className="h-4 w-4" />
                                Importer une image
                            </button>

                            <p className="mt-4 text-[11px] text-zinc-700">
                                JPG, PNG ou WEBP
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                <img
                                    src={imageUrl}
                                    alt="Carte Pokémon sélectionnée"
                                    className="mx-auto max-h-[560px] w-auto max-w-full object-contain"
                                />
                                <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-zinc-300">
                                            {selectedFile?.name ?? "Image sélectionnée"}
                                        </p>

                                        {validation.width !== null &&
                                            validation.height !== null && (
                                                <p className="mt-1 text-[11px] text-zinc-600">
                                                    {validation.width} ×{" "}
                                                    {validation.height} px
                                                </p>
                                            )}
                                    </div>

                                    {selectedFile && (
                                        <p className="font-mono text-[11px] text-zinc-600">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    )}
                                </div>
                                {isValidating && (
                                    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                                        <p className="text-xs text-zinc-500">
                                            Vérification de l'image…
                                        </p>
                                    </div>
                                )}

                                {!isValidating &&
                                    validation.valid && (
                                        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3">
                                            <p className="text-xs font-medium text-emerald-300">
                                                Image valide
                                            </p>

                                            <p className="mt-1 text-[11px] text-emerald-400/60">
                                                Cette image peut être analysée.
                                            </p>
                                        </div>
                                    )}

                                {!isValidating &&
                                    validation.error && (
                                        <div className="rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3">
                                            <p className="text-xs font-medium text-red-300">
                                                Image invalide
                                            </p>

                                            <p className="mt-1 text-[11px] text-red-400/70">
                                                {validation.error}
                                            </p>
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={handleOpenFilePicker}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Changer l'image
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-red-400/20 hover:bg-red-400/5 hover:text-red-300"
                                    >
                                        <X className="h-4 w-4" />
                                        Supprimer
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            !validation.valid ||
                                            isValidating ||
                                            recognitionStatus === "processing"
                                        }
                                        onClick={handleAnalyze}
                                        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${validation.valid
                                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:border-emerald-400/30 hover:bg-emerald-400/15"
                                            : "cursor-not-allowed border-emerald-400/10 bg-emerald-400/5 text-emerald-400/40"
                                            }`}
                                    >
                                        {recognitionStatus === "processing" ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Analyse en cours…
                                            </>
                                        ) : (
                                            <>
                                                <ScanSearch className="h-4 w-4" />
                                                Analyser la carte
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {recognitionStatus === "processing" && (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4">
                                    <p className="text-sm font-medium text-zinc-300">
                                        Analyse de la carte…
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        Le moteur recherche les informations
                                        textuelles présentes sur la carte.
                                    </p>
                                </div>
                            )}
                            {recognitionStatus === "success" && (
                                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-emerald-300">
                                                Analyse terminée
                                            </p>

                                            <p className="mt-1 text-xs text-emerald-400/60">
                                                Texte détecté par le moteur OCR.
                                            </p>
                                        </div>

                                        {recognitionConfidence !== null && (
                                            <span className="shrink-0 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
                                                {recognitionConfidence.toFixed(0)} %
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                                        <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs leading-6 text-zinc-400">
                                            {recognitionText || "Aucun texte détecté."}
                                        </pre>
                                    </div>
                                </div>
                            )}
                            {recognitionStatus === "success" &&
                                matchCandidates.length === 0 && (
                                    <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
                                        <p className="text-sm font-medium text-amber-300">
                                            Aucune carte correspondante trouvée
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-amber-400/60">
                                            Le texte a bien été analysé, mais aucune
                                            carte de ta collection ne correspond suffisamment
                                            au résultat.
                                        </p>
                                    </div>
                                )}
                            {matchCandidates.length > 0 && (
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">
                                                Cartes correspondantes
                                            </p>

                                            <p className="mt-1 text-xs text-zinc-600">
                                                Sélectionnez une correspondance pour
                                                préremplir les informations.
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-500">
                                            {matchCandidates.length}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {matchCandidates.map(
                                            (candidate) => {
                                                const isSelected =
                                                    selectedCandidate?.card.id ===
                                                    candidate.card.id;

                                                const confidenceLabel =
                                                    candidate.confidence ===
                                                        "high"
                                                        ? "Élevée"
                                                        : candidate.confidence ===
                                                            "medium"
                                                            ? "Moyenne"
                                                            : "Faible";

                                                return (
                                                    <div
                                                        key={candidate.card.id}
                                                        className={`rounded-xl border p-3 transition-colors ${isSelected
                                                                ? "border-violet-400/40 bg-violet-400/[0.07] shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                                                                : "border-white/5 bg-black/10 hover:border-white/10 hover:bg-white/[0.03]"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-medium text-zinc-200">
                                                                        {candidate.card.name}
                                                                    </span>

                                                                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                                                                        #{candidate.card.number}
                                                                    </span>

                                                                    <span
                                                                        className={`rounded-full border px-2 py-0.5 text-[10px] ${candidate.confidence ===
                                                                            "high"
                                                                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                                                            : candidate.confidence ===
                                                                                "medium"
                                                                                ? "border-amber-400/20 bg-amber-400/5 text-amber-300"
                                                                                : "border-white/10 bg-white/[0.03] text-zinc-500"
                                                                            }`}
                                                                    >
                                                                        Confiance{" "}
                                                                        {
                                                                            confidenceLabel
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <p className="mt-1 text-xs text-zinc-600">
                                                                    {candidate.card.set}
                                                                </p>

                                                                {candidate.reasons.length >
                                                                    0 && (
                                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                                            {candidate.reasons.map(
                                                                                (
                                                                                    reason
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            reason
                                                                                        }
                                                                                        className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 text-[10px] text-zinc-600"
                                                                                    >
                                                                                        {
                                                                                            reason
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>

                                                            <div className="flex shrink-0 items-center gap-2">
                                                                <span className="font-mono text-sm font-semibold text-zinc-300">
                                                                    {
                                                                        candidate.score
                                                                    }
                                                                    %
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleAutoFill(
                                                                            candidate
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/15"
                                                                >
                                                                    Préremplir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                            {autoFillData && (
                                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-emerald-300">
                                                Données prêtes
                                            </p>

                                            <p className="mt-1 text-xs text-emerald-400/60">
                                                Les informations détectées peuvent
                                                maintenant être utilisées pour le formulaire.
                                            </p>
                                        </div>

                                        {selectedCandidate && (
                                            <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
                                                {selectedCandidate.score} %
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                        <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                                Nom
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-300">
                                                {autoFillData.name}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                                Extension
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-300">
                                                {autoFillData.set}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                                Numéro
                                            </p>

                                            <p className="mt-1 font-mono text-sm text-zinc-300">
                                                {autoFillData.number}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                                Langue
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-300">
                                                {autoFillData.language}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {recognitionStatus === "error" && (
                                <div className="rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-4">
                                    <p className="text-sm font-medium text-red-300">
                                        Analyse impossible
                                    </p>

                                    <p className="mt-1 text-xs text-red-400/70">
                                        {recognitionError}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}