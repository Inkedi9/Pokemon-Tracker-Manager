"use client";

import { useMemo, useState, useEffect } from "react";

import {
    Bookmark,
    Layers3,
    Package,
    RotateCcw,
    Search,
    Trash2,
    Wallet,
    X,
    ArrowDownUp,
    Check,
    Pencil,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    CardCondition,
    CardLanguage,
    PokemonCard,
} from "@/types/card";

import { useCollection } from "@/components/collection/collection-provider";
import { AddCardDialog } from "@/components/collection/add-card-dialog";
import { CardItem } from "@/components/collection/card-item";

import {
    getTotalCards,
    getUniqueCards,
    getTotalEstimatedValue,
} from "@/lib/collection-stats";

import {
    getSavedViews,
    saveSavedViews,
    type SavedView,
} from "@/lib/saved-views";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

type AdvancedFilters = {
    minQuantity: string;
    maxQuantity: string;
    minPurchasePrice: string;
    maxPurchasePrice: string;
    minEstimatedValue: string;
    maxEstimatedValue: string;
    hasLocation: string;
    hasNotes: string;
    hasImage: string;
    hasEstimatedValue: string;
};

type BulkEditValues = {
    language: CardLanguage | "";
    rarity: string;
    condition: CardCondition | "";
    location: string;
};

type BulkAction = "edit" | "delete" | null;

export default function CollectionPage() {

    const {
        cards,
        deleteCard,
        deleteCards,
        updateCard,
    } = useCollection();

    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");
    const [rarity, setRarity] = useState("");
    const [condition, setCondition] = useState("");
    const [setFilter, setSetFilter] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
        minQuantity: "",
        maxQuantity: "",
        minPurchasePrice: "",
        maxPurchasePrice: "",
        minEstimatedValue: "",
        maxEstimatedValue: "",
        hasLocation: "",
        hasNotes: "",
        hasImage: "",
        hasEstimatedValue: "",
    });

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const [savedViews, setSavedViews] = useState<SavedView[]>([]);
    const [selectedSavedView, setSelectedSavedView] =
        useState<string>("");

    const [savedViewModified, setSavedViewModified] =
        useState(false);

    const [showSaveViewDialog, setShowSaveViewDialog] =
        useState(false);

    const [newViewName, setNewViewName] = useState("");

    const [selectedCardIds, setSelectedCardIds] =
        useState<string[]>([]);

    const [showBulkEditDialog, setShowBulkEditDialog] =
        useState(false);

    const [showBulkDeleteDialog, setShowBulkDeleteDialog] =
        useState(false);

    const [bulkEditValues, setBulkEditValues] =
        useState<BulkEditValues>({
            language: "",
            rarity: "",
            condition: "",
            location: "",
        });

    const totalCards = getTotalCards(cards);
    const uniqueCards = getUniqueCards(cards);
    const estimatedValue = getTotalEstimatedValue(cards);

    const extensions = useMemo(() => {
        return [...new Set(cards.map((card) => card.set))].sort();
    }, [cards]);

    const updateAdvancedFilter = (
        key: keyof AdvancedFilters,
        value: string
    ) => {
        setAdvancedFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    useEffect(() => {
        setSavedViews(getSavedViews());
    }, []);

    useEffect(() => {
        if (!selectedSavedView) {
            setSavedViewModified(false);
            return;
        }

        const activeView = savedViews.find(
            (view) => view.id === selectedSavedView
        );

        if (!activeView) {
            setSavedViewModified(false);
            return;
        }

        setSavedViewModified(isSavedViewModified(activeView));
    }, [
        selectedSavedView,
        savedViews,
        search,
        language,
        rarity,
        condition,
        setFilter,
        sortBy,
        advancedFilters,
    ]);

    useEffect(() => {
        setSelectedCardIds((current) =>
            current.filter((id) =>
                cards.some((card) => card.id === id)
            )
        );
    }, [cards]);

    const resetAdvancedFilters = () => {
        setAdvancedFilters({
            minQuantity: "",
            maxQuantity: "",
            minPurchasePrice: "",
            maxPurchasePrice: "",
            minEstimatedValue: "",
            maxEstimatedValue: "",
            hasLocation: "",
            hasNotes: "",
            hasImage: "",
            hasEstimatedValue: "",
        });
    };

    const hasAdvancedFilters = Object.values(advancedFilters).some(
        (value) => value !== ""
    );

    const filteredCards = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = cards.filter((card) => {
            const matchesSearch =
                !query ||
                card.name.toLowerCase().includes(query) ||
                card.set.toLowerCase().includes(query) ||
                card.number.toLowerCase().includes(query);

            const matchesLanguage =
                !language || card.language === language;

            const matchesRarity =
                !rarity || card.rarity === rarity;

            const matchesCondition =
                !condition || card.condition === condition;

            const matchesSet =
                !setFilter || card.set === setFilter;

            const minQuantity = Number(advancedFilters.minQuantity);
            const maxQuantity = Number(advancedFilters.maxQuantity);
            const minPurchasePrice = Number(
                advancedFilters.minPurchasePrice
            );
            const maxPurchasePrice = Number(
                advancedFilters.maxPurchasePrice
            );
            const minEstimatedValue = Number(
                advancedFilters.minEstimatedValue
            );
            const maxEstimatedValue = Number(
                advancedFilters.maxEstimatedValue
            );

            if (
                advancedFilters.minQuantity &&
                card.quantity < minQuantity
            ) {
                return false;
            }

            if (
                advancedFilters.maxQuantity &&
                card.quantity > maxQuantity
            ) {
                return false;
            }

            if (
                advancedFilters.minPurchasePrice &&
                card.purchasePrice < minPurchasePrice
            ) {
                return false;
            }

            if (
                advancedFilters.maxPurchasePrice &&
                card.purchasePrice > maxPurchasePrice
            ) {
                return false;
            }

            if (
                advancedFilters.minEstimatedValue &&
                card.estimatedValue < minEstimatedValue
            ) {
                return false;
            }

            if (
                advancedFilters.maxEstimatedValue &&
                card.estimatedValue > maxEstimatedValue
            ) {
                return false;
            }

            if (
                advancedFilters.hasLocation === "yes" &&
                !card.location?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasLocation === "no" &&
                card.location?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasNotes === "yes" &&
                !card.notes?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasNotes === "no" &&
                card.notes?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasImage === "yes" &&
                !card.image?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasImage === "no" &&
                card.image?.trim()
            ) {
                return false;
            }

            if (
                advancedFilters.hasEstimatedValue === "yes" &&
                card.estimatedValue <= 0
            ) {
                return false;
            }

            if (
                advancedFilters.hasEstimatedValue === "no" &&
                card.estimatedValue > 0
            ) {
                return false;
            }

            return (
                matchesSearch &&
                matchesLanguage &&
                matchesRarity &&
                matchesCondition &&
                matchesSet
            );
        });

        return [...result].sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return a.name.localeCompare(b.name);

                case "name-desc":
                    return b.name.localeCompare(a.name);

                case "value-asc":
                    return a.estimatedValue - b.estimatedValue;

                case "value-desc":
                    return b.estimatedValue - a.estimatedValue;

                case "set-asc":
                    return a.set.localeCompare(b.set);

                case "number-asc":
                    return a.number.localeCompare(
                        b.number,
                        undefined,
                        { numeric: true }
                    );

                case "recent":
                default:
                    return 0;
            }
        });
    }, [
        cards,
        search,
        language,
        rarity,
        condition,
        setFilter,
        sortBy,
        advancedFilters,
    ]);

    const hasActiveFilters =
        search !== "" ||
        language !== "" ||
        rarity !== "" ||
        condition !== "" ||
        setFilter !== "" ||
        hasAdvancedFilters;

    const activeFilters = [
        search.trim()
            ? {
                label: `Recherche : ${search.trim()}`,
                onRemove: () => setSearch(""),
            }
            : null,

        language
            ? {
                label: `Langue : ${language}`,
                onRemove: () => setLanguage(""),
            }
            : null,

        rarity
            ? {
                label: `Rareté : ${rarity}`,
                onRemove: () => setRarity(""),
            }
            : null,

        condition
            ? {
                label: `État : ${condition}`,
                onRemove: () => setCondition(""),
            }
            : null,

        setFilter
            ? {
                label: `Extension : ${setFilter}`,
                onRemove: () => setSetFilter(""),
            }
            : null,

        advancedFilters.minQuantity
            ? {
                label: `Quantité ≥ ${advancedFilters.minQuantity}`,
                onRemove: () =>
                    updateAdvancedFilter("minQuantity", ""),
            }
            : null,

        advancedFilters.maxQuantity
            ? {
                label: `Quantité ≤ ${advancedFilters.maxQuantity}`,
                onRemove: () =>
                    updateAdvancedFilter("maxQuantity", ""),
            }
            : null,

        advancedFilters.minPurchasePrice
            ? {
                label: `Achat ≥ ${advancedFilters.minPurchasePrice} €`,
                onRemove: () =>
                    updateAdvancedFilter("minPurchasePrice", ""),
            }
            : null,

        advancedFilters.maxPurchasePrice
            ? {
                label: `Achat ≤ ${advancedFilters.maxPurchasePrice} €`,
                onRemove: () =>
                    updateAdvancedFilter("maxPurchasePrice", ""),
            }
            : null,

        advancedFilters.minEstimatedValue
            ? {
                label: `Valeur ≥ ${advancedFilters.minEstimatedValue} €`,
                onRemove: () =>
                    updateAdvancedFilter("minEstimatedValue", ""),
            }
            : null,

        advancedFilters.maxEstimatedValue
            ? {
                label: `Valeur ≤ ${advancedFilters.maxEstimatedValue} €`,
                onRemove: () =>
                    updateAdvancedFilter("maxEstimatedValue", ""),
            }
            : null,

        advancedFilters.hasLocation
            ? {
                label:
                    advancedFilters.hasLocation === "yes"
                        ? "Avec localisation"
                        : "Sans localisation",
                onRemove: () =>
                    updateAdvancedFilter("hasLocation", ""),
            }
            : null,

        advancedFilters.hasNotes
            ? {
                label:
                    advancedFilters.hasNotes === "yes"
                        ? "Avec notes"
                        : "Sans notes",
                onRemove: () =>
                    updateAdvancedFilter("hasNotes", ""),
            }
            : null,

        advancedFilters.hasImage
            ? {
                label:
                    advancedFilters.hasImage === "yes"
                        ? "Avec image"
                        : "Sans image",
                onRemove: () =>
                    updateAdvancedFilter("hasImage", ""),
            }
            : null,

        advancedFilters.hasEstimatedValue
            ? {
                label:
                    advancedFilters.hasEstimatedValue === "yes"
                        ? "Avec valeur"
                        : "Sans valeur",
                onRemove: () =>
                    updateAdvancedFilter(
                        "hasEstimatedValue",
                        ""
                    ),
            }
            : null,
    ].filter(
        (
            filter
        ): filter is {
            label: string;
            onRemove: () => void;
        } => filter !== null
    );

    function resetFilters() {
        setSearch("");
        setLanguage("");
        setRarity("");
        setCondition("");
        setSetFilter("");
        resetAdvancedFilters();
    }

    function isSavedViewModified(view: SavedView) {
        return (
            view.search !== search ||
            view.language !== language ||
            view.rarity !== rarity ||
            view.condition !== condition ||
            view.setFilter !== setFilter ||
            view.sortBy !== sortBy ||
            JSON.stringify(view.advancedFilters) !==
            JSON.stringify(advancedFilters)
        );
    }

    function createSavedView(name: string) {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const newView: SavedView = {
            id: crypto.randomUUID(),
            name: trimmedName,

            search,

            language,
            rarity,
            condition,
            setFilter,

            advancedFilters: {
                ...advancedFilters,
            },

            sortBy,

            createdAt: new Date().toISOString(),
        };

        const updatedViews = [...savedViews, newView];

        setSavedViews(updatedViews);
        saveSavedViews(updatedViews);

        setSelectedSavedView(newView.id);

        setNewViewName("");
        setShowSaveViewDialog(false);
    }

    function applySavedView(view: SavedView) {
        setSearch(view.search);

        setLanguage(view.language);
        setRarity(view.rarity);
        setCondition(view.condition);
        setSetFilter(view.setFilter);

        setAdvancedFilters({
            ...view.advancedFilters,
        });

        setSortBy(view.sortBy as typeof sortBy);

        setSelectedSavedView(view.id);
        setSavedViewModified(false);
    }

    function deleteSavedView(id: string) {
        const updatedViews = savedViews.filter(
            (view) => view.id !== id
        );

        setSavedViews(updatedViews);
        saveSavedViews(updatedViews);

        if (selectedSavedView === id) {
            setSelectedSavedView("");
            setSavedViewModified(false);
        }
    }

    function updateSavedView() {
        if (!selectedSavedView) {
            return;
        }

        const updatedViews = savedViews.map((view) => {
            if (view.id !== selectedSavedView) {
                return view;
            }

            return {
                ...view,
                search,

                language,
                rarity,
                condition,
                setFilter,

                advancedFilters: {
                    ...advancedFilters,
                },

                sortBy,
            };
        });

        setSavedViews(updatedViews);
        saveSavedViews(updatedViews);
        setSavedViewModified(false);
    }

    function toggleCardSelection(cardId: string) {
        setSelectedCardIds((current) => {
            if (current.includes(cardId)) {
                return current.filter((id) => id !== cardId);
            }

            return [...current, cardId];
        });
    }

    function clearSelection() {
        setSelectedCardIds([]);
    }

    function confirmBulkDelete() {
        if (selectedCardIds.length === 0) return;

        const selectedCount = selectedCardIds.length;

        deleteCards(selectedCardIds);
        clearSelection();
        setActiveBulkAction(null);
        setShowBulkDeleteDialog(false);

        toast.success(
            `${selectedCount} ${selectedCount > 1 ? "cartes supprimées" : "carte supprimée"
            }`
        );
    }

    const allVisibleCardsSelected =
        filteredCards.length > 0 &&
        filteredCards.every((card) =>
            selectedCardIds.includes(card.id)
        );

    const someVisibleCardsSelected =
        filteredCards.some((card) =>
            selectedCardIds.includes(card.id)
        );

    function toggleSelectAllVisible() {
        if (allVisibleCardsSelected) {
            setSelectedCardIds((current) =>
                current.filter(
                    (id) =>
                        !filteredCards.some(
                            (card) => card.id === id
                        )
                )
            );

            return;
        }

        setSelectedCardIds((current) => {
            const ids = new Set(current);

            filteredCards.forEach((card) => {
                ids.add(card.id);
            });

            return Array.from(ids);
        });
    }

    function updateBulkEditValue(
        key: keyof BulkEditValues,
        value: string
    ) {
        setBulkEditValues((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function resetBulkEdit() {
        setBulkEditValues({
            language: "",
            rarity: "",
            condition: "",
            location: "",
        });

        setActiveBulkAction(null);
        setShowBulkEditDialog(false);
    }

    function handleBulkEdit() {
        if (selectedCardIds.length === 0) return;

        const selectedCount = selectedCardIds.length;

        const hasChanges = Object.values(bulkEditValues).some(
            (value) => value !== ""
        );

        if (!hasChanges) {
            toast.error("Aucune modification à appliquer");
            return;
        }

        cards
            .filter((card) => selectedCardIds.includes(card.id))
            .forEach((card) => {
                updateCard({
                    ...card,
                    language:
                        bulkEditValues.language !== ""
                            ? bulkEditValues.language
                            : card.language,
                    rarity:
                        bulkEditValues.rarity !== ""
                            ? bulkEditValues.rarity
                            : card.rarity,
                    condition:
                        bulkEditValues.condition !== ""
                            ? bulkEditValues.condition
                            : card.condition,
                    location:
                        bulkEditValues.location !== ""
                            ? bulkEditValues.location
                            : card.location,
                });
            });

        resetBulkEdit();
        clearSelection();

        toast.success(
            `${selectedCount} ${selectedCount > 1 ? "cartes modifiées" : "carte modifiée"
            }`
        );
    }

    const [activeBulkAction, setActiveBulkAction] =
        useState<BulkAction>(null);



    return (
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1600px] space-y-5">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400/80">
                                Collection
                            </p>

                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                                Mes cartes
                            </h2>

                            <p className="mt-2 max-w-xl text-xs text-zinc-500 sm:text-sm">
                                Gérez et suivez votre collection Pokémon.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <AddCardDialog />
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                    <Card className="rounded-xl border-white/10 bg-[#111114] p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                    Total cartes
                                </p>

                                <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                                    {totalCards}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/5">
                                <Package className="h-4 w-4 text-blue-400/80" />
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-white/10 bg-[#111114] p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                    Cartes uniques
                                </p>

                                <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                                    {uniqueCards}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/5">
                                <Layers3 className="h-4 w-4 text-violet-400/80" />
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-white/10 bg-[#111114] p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                    Valeur estimée
                                </p>

                                <p className="mt-2 text-xl font-semibold tracking-tight text-emerald-400 sm:text-2xl">
                                    {estimatedValue.toFixed(2)} €
                                </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/5">
                                <Wallet className="h-4 w-4 text-emerald-400/80" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Save View */}
                <Card className="rounded-xl border-white/10 bg-[#111114]">
                    <div className="p-4 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                                    <Bookmark className="h-4 w-4 text-violet-400" />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-mono text-sm font-semibold text-white">
                                            Saved Views
                                        </h2>

                                        {savedViews.length > 0 && (
                                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/45">
                                                {savedViews.length}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-white/40">
                                        Enregistrez vos recherches et filtres favoris.
                                    </p>
                                    {savedViews.length === 0 && (
                                        <p className="mt-2 font-mono text-[10px] text-white/25">
                                            Aucune vue enregistrée pour le moment.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                                <Select
                                    value={selectedSavedView}
                                    onValueChange={(value) => {
                                        if (value === "__none__") {
                                            setSelectedSavedView("");
                                            return;
                                        }

                                        const view = savedViews.find(
                                            (item) => item.id === value
                                        );

                                        if (view) {
                                            applySavedView(view);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full border-white/10 bg-white/[0.03] text-xs sm:w-[260px]">
                                        <SelectValue placeholder="Choisir une vue..." />
                                    </SelectTrigger>

                                    <SelectContent className="border-white/10 bg-[#111114]">
                                        {savedViews.length === 0 ? (
                                            <SelectItem
                                                value="__none__"
                                                disabled
                                            >
                                                Aucune vue enregistrée
                                            </SelectItem>
                                        ) : (
                                            savedViews.map((view) => (
                                                <SelectItem
                                                    key={view.id}
                                                    value={view.id}
                                                >
                                                    {view.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedSavedView && savedViewModified) {
                                            updateSavedView();
                                            return;
                                        }

                                        setNewViewName("");
                                        setShowSaveViewDialog(true);
                                    }}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-white/70 transition hover:border-violet-400/30 hover:bg-violet-400/5 hover:text-white"
                                >
                                    {selectedSavedView && savedViewModified ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                            Enregistrer les modifications
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="h-3.5 w-3.5" />
                                            Sauvegarder
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {selectedSavedView && (
                            <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${savedViewModified
                                                ? "bg-amber-400"
                                                : "bg-emerald-400"
                                                }`}
                                        />

                                        <span className="truncate font-mono text-[11px] text-white/50">
                                            Vue active :
                                        </span>

                                        <span className="truncate font-mono text-[11px] text-white/80">
                                            {
                                                savedViews.find(
                                                    (view) =>
                                                        view.id === selectedSavedView
                                                )?.name
                                            }
                                        </span>

                                        {savedViewModified && (
                                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/5 px-1.5 py-0.5 font-mono text-[9px] text-amber-400/80">
                                                <Pencil className="h-2.5 w-2.5" />
                                                modifiée
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        deleteSavedView(selectedSavedView);
                                    }}
                                    className="inline-flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-[11px] text-red-400/70 transition hover:bg-red-400/10 hover:text-red-400 sm:self-auto"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Supprimer la vue
                                </button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Search + filters */}
                <div className="mb-6 space-y-5 sm:space-y-6">
                    {/* Search */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Rechercher un Pokémon, une extension ou un numéro..."
                                className="h-11 rounded-xl border-white/10 bg-[#111114] pl-10 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-violet-400/30 focus:ring-1 focus:ring-violet-400/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-300"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111114] px-3.5 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/[0.04] hover:text-zinc-200"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="rounded-xl border border-white/10 bg-[#111114] p-3.5 sm:p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                    Filtres
                                </p>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Affinez votre collection
                                </p>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                                >
                                    Réinitialiser
                                </button>
                            )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Language */}
                            <Select
                                value={language}
                                onValueChange={(value) => setLanguage(value ?? "")}
                            >
                                <SelectTrigger
                                    className={`h-10 rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 transition-colors ${language
                                        ? "border-violet-400/20 text-zinc-100"
                                        : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Toutes les langues" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="FR">Français</SelectItem>
                                    <SelectItem value="EN">Anglais</SelectItem>
                                    <SelectItem value="JP">Japonais</SelectItem>
                                    <SelectItem value="KR">Coréen</SelectItem>
                                    <SelectItem value="DE">Allemand</SelectItem>
                                    <SelectItem value="ES">Espagnol</SelectItem>
                                    <SelectItem value="IT">Italien</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Rarity */}
                            <Select
                                value={rarity}
                                onValueChange={(value) => setRarity(value ?? "")}
                            >
                                <SelectTrigger
                                    className={`h-10 rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 transition-colors ${rarity
                                        ? "border-violet-400/20 text-zinc-100"
                                        : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Toutes les raretés" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Common">Commune</SelectItem>
                                    <SelectItem value="Uncommon">Peu commune</SelectItem>
                                    <SelectItem value="Rare">Rare</SelectItem>
                                    <SelectItem value="Holo Rare">Holo Rare</SelectItem>
                                    <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                                    <SelectItem value="Illustration Rare">
                                        Illustration Rare
                                    </SelectItem>
                                    <SelectItem value="Special Illustration Rare">
                                        Special Illustration Rare
                                    </SelectItem>
                                    <SelectItem value="Hyper Rare">Hyper Rare</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Condition */}
                            <Select
                                value={condition}
                                onValueChange={(value) => setCondition(value ?? "")}
                            >
                                <SelectTrigger
                                    className={`h-10 rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 transition-colors ${condition
                                        ? "border-violet-400/20 text-zinc-100"
                                        : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Tous les états" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="NM">NM — Near Mint</SelectItem>
                                    <SelectItem value="LP">LP — Lightly Played</SelectItem>
                                    <SelectItem value="MP">
                                        MP — Moderately Played
                                    </SelectItem>
                                    <SelectItem value="HP">HP — Heavily Played</SelectItem>
                                    <SelectItem value="DMG">DMG — Damaged</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Set */}
                            <Select
                                value={setFilter}
                                onValueChange={(value) => setSetFilter(value ?? "")}
                            >
                                <SelectTrigger
                                    className={`h-10 rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 transition-colors ${setFilter
                                        ? "border-violet-400/20 text-zinc-100"
                                        : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Toutes les extensions" />
                                </SelectTrigger>

                                <SelectContent>
                                    {extensions.map((extension) => (
                                        <SelectItem key={extension} value={extension}>
                                            {extension}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="mt-3 border-t border-white/5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedFilters((current) => !current)}
                                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.02]"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium text-zinc-400">
                                                Filtres avancés
                                            </p>

                                            {hasAdvancedFilters && (
                                                <span className="rounded-md border border-violet-400/10 bg-violet-400/5 px-1.5 py-0.5 text-[9px] font-medium text-violet-300/70">
                                                    Actifs
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-zinc-600">
                                            Quantité, prix, valeur et qualité des données
                                        </p>
                                    </div>

                                    <span className="text-[11px] text-zinc-600">
                                        {showAdvancedFilters ? "Masquer" : "Afficher"}
                                    </span>
                                </button>

                                {showAdvancedFilters && (
                                    <div className="mt-3 space-y-4 border-t border-white/5 pt-4">
                                        <div>
                                            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                                Quantité
                                            </p>

                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={advancedFilters.minQuantity}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "minQuantity",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Quantité min."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />

                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={advancedFilters.maxQuantity}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "maxQuantity",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Quantité max."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                                Prix d&apos;achat
                                            </p>

                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={advancedFilters.minPurchasePrice}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "minPurchasePrice",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Prix min."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />

                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={advancedFilters.maxPurchasePrice}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "maxPurchasePrice",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Prix max."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                                Valeur estimée
                                            </p>

                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={advancedFilters.minEstimatedValue}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "minEstimatedValue",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Valeur min."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />

                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={advancedFilters.maxEstimatedValue}
                                                    onChange={(event) =>
                                                        updateAdvancedFilter(
                                                            "maxEstimatedValue",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Valeur max."
                                                    className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                                                Qualité des données
                                            </p>

                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                <Select
                                                    value={advancedFilters.hasLocation}
                                                    onValueChange={(value) =>
                                                        updateAdvancedFilter("hasLocation", value ?? "")
                                                    }
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs">
                                                        <SelectValue placeholder="Localisation" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="yes">
                                                            Avec localisation
                                                        </SelectItem>
                                                        <SelectItem value="no">
                                                            Sans localisation
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={advancedFilters.hasNotes}
                                                    onValueChange={(value) =>
                                                        updateAdvancedFilter("hasNotes", value ?? "")
                                                    }
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs">
                                                        <SelectValue placeholder="Notes" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="yes">
                                                            Avec notes
                                                        </SelectItem>
                                                        <SelectItem value="no">
                                                            Sans notes
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={advancedFilters.hasImage}
                                                    onValueChange={(value) =>
                                                        updateAdvancedFilter("hasImage", value ?? "")
                                                    }
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs">
                                                        <SelectValue placeholder="Image" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="yes">
                                                            Avec image
                                                        </SelectItem>
                                                        <SelectItem value="no">
                                                            Sans image
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={advancedFilters.hasEstimatedValue}
                                                    onValueChange={(value) =>
                                                        updateAdvancedFilter(
                                                            "hasEstimatedValue",
                                                            value ?? ""
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-9 rounded-lg border-white/10 bg-white/[0.02] text-xs">
                                                        <SelectValue placeholder="Valeur estimée" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="yes">
                                                            Avec valeur
                                                        </SelectItem>
                                                        <SelectItem value="no">
                                                            Sans valeur
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results + sort */}
                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                {hasActiveFilters ? (
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-sm text-zinc-400">
                                            <span className="font-medium text-zinc-200">
                                                {filteredCards.length}
                                            </span>{" "}
                                            résultat
                                            {filteredCards.length > 1 ? "s" : ""}
                                        </p>

                                        <span className="text-zinc-700">·</span>

                                        <p className="text-xs text-zinc-600">
                                            sur {totalCards} cartes
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-400">
                                        <span className="font-medium text-zinc-200">
                                            {totalCards}
                                        </span>{" "}
                                        cartes
                                        <span className="mx-2 text-zinc-700">·</span>
                                        <span className="font-medium text-zinc-200">
                                            {uniqueCards}
                                        </span>{" "}
                                        uniques
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                {hasActiveFilters && (
                                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">
                                        {activeFilters.length} filtre
                                        {activeFilters.length > 1 ? "s" : ""} actif
                                        {activeFilters.length > 1 ? "s" : ""}
                                    </span>
                                )}

                                <div className="flex min-w-0 items-center gap-2">
                                    <ArrowDownUp className="h-3.5 w-3.5 shrink-0 text-zinc-600" />

                                    <Select
                                        value={sortBy}
                                        onValueChange={(value) =>
                                            setSortBy(value ?? "recent")
                                        }
                                    >
                                        <SelectTrigger className="h-9 w-full rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 transition-colors hover:bg-white/[0.04] sm:w-[200px]">
                                            <SelectValue placeholder="Trier par" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="recent">
                                                Ajout récent
                                            </SelectItem>

                                            <SelectItem value="name-asc">
                                                Nom A → Z
                                            </SelectItem>

                                            <SelectItem value="name-desc">
                                                Nom Z → A
                                            </SelectItem>

                                            <SelectItem value="value-desc">
                                                Valeur décroissante
                                            </SelectItem>

                                            <SelectItem value="value-asc">
                                                Valeur croissante
                                            </SelectItem>

                                            <SelectItem value="set-asc">
                                                Extension A → Z
                                            </SelectItem>

                                            <SelectItem value="number-asc">
                                                Numéro croissant
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                {activeFilters.map((filter) => (
                                    <button
                                        key={filter.label}
                                        type="button"
                                        onClick={filter.onRemove}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/10 bg-violet-400/5 px-2.5 py-1.5 text-[11px] text-violet-200/70 transition-colors hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-100"
                                    >
                                        {filter.label}

                                        <X className="h-3 w-3 text-violet-300/50" />
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Réinitialiser
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCardIds.length > 0 && (
                    <Card className="rounded-xl border-violet-400/20 bg-violet-400/[0.03]">
                        <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
                                    <Package className="h-4 w-4 text-violet-400" />
                                </div>

                                <div>
                                    <p className="font-mono text-xs font-medium text-white">
                                        {selectedCardIds.length} carte
                                        {selectedCardIds.length > 1 ? "s" : ""} sélectionnée
                                        {selectedCardIds.length > 1 ? "s" : ""}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/40">
                                        {selectedCardIds.length} sélectionnée
                                        {selectedCardIds.length > 1 ? "s" : ""}
                                        {filteredCards.length > 0 && (
                                            <>
                                                {" · "}
                                                {filteredCards.length} visible
                                                {filteredCards.length > 1 ? "s" : ""}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={toggleSelectAllVisible}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                                >
                                    <Check className="h-3 w-3" />

                                    {allVisibleCardsSelected
                                        ? "Désélectionner les visibles"
                                        : "Tout sélectionner"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveBulkAction("edit");
                                        setShowBulkEditDialog(true);
                                    }}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-400/5 px-2.5 text-[11px] font-medium text-violet-300 transition hover:bg-violet-400/10 hover:text-violet-200"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Modifier
                                </button>

                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
                                >
                                    <X className="h-3 w-3" />
                                    Effacer la sélection
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveBulkAction("delete");
                                        setShowBulkDeleteDialog(true);
                                    }}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/5 px-2.5 text-[11px] font-medium text-red-400/80 transition hover:bg-red-400/10 hover:text-red-400"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Collection */}
                {filteredCards.length > 0 ? (
                    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                isSelected={selectedCardIds.includes(card.id)}
                                onSelect={() => toggleCardSelection(card.id)}
                            />
                        ))}
                    </div>
                ) : cards.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-[#111114] px-5 py-14 text-center sm:px-8 sm:py-20">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/5">
                            <Package className="h-5 w-5 text-violet-400/70" />
                        </div>

                        <h3 className="mt-5 text-sm font-semibold text-zinc-100 sm:text-base">
                            Votre collection est vide
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500 sm:text-sm">
                            Commencez par ajouter votre première carte Pokémon pour construire votre collection.
                        </p>

                        <div className="mt-6">
                            <AddCardDialog />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-white/10 bg-[#111114] px-5 py-14 text-center sm:px-8 sm:py-20">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                            <Search className="h-5 w-5 text-zinc-600" />
                        </div>

                        <h3 className="mt-5 text-sm font-semibold text-zinc-100 sm:text-base">
                            Aucune carte trouvée
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500 sm:text-sm">
                            Aucune carte ne correspond aux critères de recherche ou aux filtres sélectionnés.
                        </p>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-zinc-200"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                )}
            </div>
            <Dialog
                open={showSaveViewDialog}
                onOpenChange={setShowSaveViewDialog}
            >
                <DialogContent className="border-white/10 bg-[#111114] text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-base">
                            Enregistrer la vue
                        </DialogTitle>

                        <DialogDescription className="text-sm text-white/50">
                            Enregistrez la recherche et les filtres actuellement
                            appliqués à votre collection.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="saved-view-name"
                                className="text-xs font-medium text-white/60"
                            >
                                Nom de la vue
                            </label>

                            <Input
                                id="saved-view-name"
                                value={newViewName}
                                onChange={(event) =>
                                    setNewViewName(event.target.value)
                                }
                                placeholder="Ex. Cartes premium"
                                className="border-white/10 bg-white/[0.03] font-mono text-sm"
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        newViewName.trim()
                                    ) {
                                        createSavedView(newViewName);
                                    }
                                }}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setNewViewName("");
                                    setShowSaveViewDialog(false);
                                }}
                                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                disabled={!newViewName.trim()}
                                onClick={() => createSavedView(newViewName)}
                                className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={showBulkEditDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        resetBulkEdit();
                    } else {
                        setShowBulkEditDialog(true);
                    }
                }}
            >
                <DialogContent className="border-white/10 bg-[#111114] text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            Modifier les cartes sélectionnées
                        </DialogTitle>

                        <DialogDescription className="text-zinc-500">
                            Modifie les propriétés communes de{" "}
                            {selectedCardIds.length}{" "}
                            {selectedCardIds.length > 1
                                ? "cartes"
                                : "carte"}
                            .
                            <br />
                            Les champs laissés vides resteront inchangés.
                        </DialogDescription>
                    </DialogHeader>

                    {Object.values(bulkEditValues).some(
                        (value) => value !== ""
                    ) && (
                            <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-white">
                                            Aperçu des modifications
                                        </p>

                                        <p className="mt-1 text-[11px] text-zinc-500">
                                            Ces modifications seront appliquées à{" "}
                                            {selectedCardIds.length}{" "}
                                            {selectedCardIds.length > 1
                                                ? "cartes"
                                                : "carte"}
                                            .
                                        </p>

                                        <div className="mt-3 space-y-2">
                                            {bulkEditValues.language !== "" && (
                                                <div className="flex items-center justify-between gap-4 text-xs">
                                                    <span className="text-zinc-500">
                                                        Langue
                                                    </span>

                                                    <span className="font-medium text-violet-300">
                                                        {bulkEditValues.language}
                                                    </span>
                                                </div>
                                            )}

                                            {bulkEditValues.rarity !== "" && (
                                                <div className="flex items-center justify-between gap-4 text-xs">
                                                    <span className="text-zinc-500">
                                                        Rareté
                                                    </span>

                                                    <span className="font-medium text-violet-300">
                                                        {bulkEditValues.rarity}
                                                    </span>
                                                </div>
                                            )}

                                            {bulkEditValues.condition !== "" && (
                                                <div className="flex items-center justify-between gap-4 text-xs">
                                                    <span className="text-zinc-500">
                                                        Condition
                                                    </span>

                                                    <span className="font-medium text-violet-300">
                                                        {bulkEditValues.condition}
                                                    </span>
                                                </div>
                                            )}

                                            {bulkEditValues.location !== "" && (
                                                <div className="flex items-center justify-between gap-4 text-xs">
                                                    <span className="text-zinc-500">
                                                        Localisation
                                                    </span>

                                                    <span className="font-medium text-violet-300">
                                                        {bulkEditValues.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="space-y-5 py-4">
                        {/* Langue */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-300">
                                Langue
                            </label>

                            <select
                                value={bulkEditValues.language}
                                onChange={(event) =>
                                    updateBulkEditValue(
                                        "language",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-lg border border-white/10 bg-[#18181b] px-3 text-sm text-white outline-none transition focus:border-violet-400/40"
                            >
                                <option value="">
                                    Ne pas modifier
                                </option>
                                <option value="Français">
                                    Français
                                </option>
                                <option value="Coréen">
                                    Coréen
                                </option>
                                <option value="Japonais">
                                    Japonais
                                </option>
                                <option value="Anglais">
                                    Anglais
                                </option>
                            </select>
                        </div>

                        {/* Rareté */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-300">
                                Rareté
                            </label>

                            <select
                                value={bulkEditValues.rarity}
                                onChange={(event) =>
                                    updateBulkEditValue(
                                        "rarity",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-lg border border-white/10 bg-[#18181b] px-3 text-sm text-white outline-none transition focus:border-violet-400/40"
                            >
                                <option value="">
                                    Ne pas modifier
                                </option>

                                <option value="Commune">
                                    Commune
                                </option>

                                <option value="Peu commune">
                                    Peu commune
                                </option>

                                <option value="Rare">
                                    Rare
                                </option>

                                <option value="Holo Rare">
                                    Holo Rare
                                </option>

                                <option value="Ultra Rare">
                                    Ultra Rare
                                </option>

                                <option value="Illustration Rare">
                                    Illustration Rare
                                </option>

                                <option value="Special Illustration Rare">
                                    Special Illustration Rare
                                </option>

                                <option value="Hyper Rare">
                                    Hyper Rare
                                </option>
                            </select>
                        </div>

                        {/* Condition */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-300">
                                Condition
                            </label>

                            <select
                                value={bulkEditValues.condition}
                                onChange={(event) =>
                                    updateBulkEditValue(
                                        "condition",
                                        event.target.value
                                    )
                                }
                                className="h-10 w-full rounded-lg border border-white/10 bg-[#18181b] px-3 text-sm text-white outline-none transition focus:border-violet-400/40"
                            >
                                <option value="">
                                    Ne pas modifier
                                </option>

                                <option value="Mint">
                                    Mint
                                </option>

                                <option value="Near Mint">
                                    Near Mint
                                </option>

                                <option value="Excellent">
                                    Excellent
                                </option>

                                <option value="Good">
                                    Good
                                </option>

                                <option value="Played">
                                    Played
                                </option>

                                <option value="Poor">
                                    Poor
                                </option>
                            </select>
                        </div>

                        {/* Localisation */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-300">
                                Localisation
                            </label>

                            <input
                                type="text"
                                value={bulkEditValues.location}
                                onChange={(event) =>
                                    updateBulkEditValue(
                                        "location",
                                        event.target.value
                                    )
                                }
                                placeholder="Ex. Classeur A"
                                className="h-10 w-full rounded-lg border border-white/10 bg-[#18181b] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/40"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={resetBulkEdit}
                            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            disabled={
                                !Object.values(bulkEditValues).some(
                                    (value) => value !== ""
                                )
                            }
                            onClick={handleBulkEdit}
                            className="h-9 rounded-lg bg-violet-500 px-3 text-xs font-medium text-white transition hover:bg-violet-400 disabled:pointer-events-none disabled:opacity-40"
                        >
                            Modifier {selectedCardIds.length}{" "}
                            {selectedCardIds.length > 1
                                ? "cartes"
                                : "carte"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={showBulkDeleteDialog}
                onOpenChange={(open) => {
                    setShowBulkDeleteDialog(open);

                    if (!open) {
                        setActiveBulkAction(null);
                    }
                }}
            >
                <DialogContent className="border-white/10 bg-[#111114] text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Supprimer les cartes sélectionnées ?
                        </DialogTitle>

                        <DialogDescription className="text-zinc-500">
                            Cette action va supprimer{" "}
                            <span className="font-medium text-zinc-300">
                                {selectedCardIds.length}{" "}
                                {selectedCardIds.length > 1
                                    ? "cartes"
                                    : "carte"}
                            </span>{" "}
                            de ta collection.
                            <br />
                            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                                Les cartes sélectionnées seront retirées de ta collection
                                locale. Cette action ne peut pas être annulée depuis
                                l'application.
                            </p>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-xl border border-red-400/15 bg-red-400/[0.04] p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
                                <Trash2 className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-red-300">
                                    Suppression définitive
                                </p>

                                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                                    Les cartes sélectionnées seront retirées
                                    de ta collection locale.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => {
                                setShowBulkDeleteDialog(false);
                                setActiveBulkAction(null);
                            }}
                            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            onClick={confirmBulkDelete}
                            className="h-9 rounded-lg bg-red-500/90 px-3 text-xs font-medium text-white transition hover:bg-red-500"
                        >
                            Supprimer{" "}
                            {selectedCardIds.length}{" "}
                            {selectedCardIds.length > 1
                                ? "cartes"
                                : "carte"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}