"use client";

import { useMemo, useState } from "react";
import {
    Layers3,
    Package,
    RotateCcw,
    Search,
    Wallet,
    X,
    ArrowDownUp,
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

import { useCollection } from "@/components/collection/collection-provider";
import { AddCardDialog } from "@/components/collection/add-card-dialog";
import { CardItem } from "@/components/collection/card-item";

import {
    getTotalCards,
    getUniqueCards,
    getTotalEstimatedValue,
} from "@/lib/collection-stats";

export default function CollectionPage() {
    const { cards } = useCollection();

    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");
    const [rarity, setRarity] = useState("");
    const [condition, setCondition] = useState("");
    const [setFilter, setSetFilter] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    const totalCards = getTotalCards(cards);
    const uniqueCards = getUniqueCards(cards);
    const estimatedValue = getTotalEstimatedValue(cards);

    const extensions = useMemo(() => {
        return [...new Set(cards.map((card) => card.set))].sort();
    }, [cards]);

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
    ]);

    const hasActiveFilters =
        search !== "" ||
        language !== "" ||
        rarity !== "" ||
        condition !== "" ||
        setFilter !== "";

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
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-yellow-400">
                            Collection
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Mes cartes
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            Gérez et suivez votre collection Pokémon.
                        </p>
                    </div>

                    <AddCardDialog />
                </div>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card className="border-white/10 bg-[#111114] p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                Total cartes
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {totalCards}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10">
                            <Package className="h-5 w-5 text-yellow-400" />
                        </div>
                    </div>
                </Card>

                <Card className="border-white/10 bg-[#111114] p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                Cartes uniques
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {uniqueCards}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/10">
                            <Layers3 className="h-5 w-5 text-violet-400" />
                        </div>
                    </div>
                </Card>

                <Card className="border-white/10 bg-[#111114] p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                                Valeur estimée
                            </p>

                            <p className="mt-2 text-2xl font-bold text-emerald-400">
                                {estimatedValue.toFixed(2)} €
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
                            <Wallet className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search + filters */}
            <div className="mb-6 space-y-3">
                {/* Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Rechercher un Pokémon, une extension ou un numéro..."
                            className="h-10 border-white/10 bg-[#111114] pl-10 text-white placeholder:text-zinc-600"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-[#111114] px-3 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Language */}
                    <Select
                        value={language}
                        onValueChange={(value) =>
                            setLanguage(value ?? "")
                        }
                    >
                        <SelectTrigger className="border-white/10 bg-[#111114] text-white">
                            <SelectValue placeholder="Toutes les langues" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="FR">
                                Français
                            </SelectItem>

                            <SelectItem value="EN">
                                Anglais
                            </SelectItem>

                            <SelectItem value="JP">
                                Japonais
                            </SelectItem>

                            <SelectItem value="KR">
                                Coréen
                            </SelectItem>

                            <SelectItem value="DE">
                                Allemand
                            </SelectItem>

                            <SelectItem value="ES">
                                Espagnol
                            </SelectItem>

                            <SelectItem value="IT">
                                Italien
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Rarity */}
                    <Select
                        value={rarity}
                        onValueChange={(value) =>
                            setRarity(value ?? "")
                        }
                    >
                        <SelectTrigger className="border-white/10 bg-[#111114] text-white">
                            <SelectValue placeholder="Toutes les raretés" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Common">
                                Commune
                            </SelectItem>

                            <SelectItem value="Uncommon">
                                Peu commune
                            </SelectItem>

                            <SelectItem value="Rare">
                                Rare
                            </SelectItem>

                            <SelectItem value="Holo Rare">
                                Holo Rare
                            </SelectItem>

                            <SelectItem value="Ultra Rare">
                                Ultra Rare
                            </SelectItem>

                            <SelectItem value="Illustration Rare">
                                Illustration Rare
                            </SelectItem>

                            <SelectItem value="Special Illustration Rare">
                                Special Illustration Rare
                            </SelectItem>

                            <SelectItem value="Hyper Rare">
                                Hyper Rare
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Condition */}
                    <Select
                        value={condition}
                        onValueChange={(value) =>
                            setCondition(value ?? "")
                        }
                    >
                        <SelectTrigger className="border-white/10 bg-[#111114] text-white">
                            <SelectValue placeholder="Tous les états" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="NM">
                                NM — Near Mint
                            </SelectItem>

                            <SelectItem value="LP">
                                LP — Lightly Played
                            </SelectItem>

                            <SelectItem value="MP">
                                MP — Moderately Played
                            </SelectItem>

                            <SelectItem value="HP">
                                HP — Heavily Played
                            </SelectItem>

                            <SelectItem value="DMG">
                                DMG — Damaged
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Set */}
                    <Select
                        value={setFilter}
                        onValueChange={(value) =>
                            setSetFilter(value ?? "")
                        }
                    >
                        <SelectTrigger className="border-white/10 bg-[#111114] text-white">
                            <SelectValue placeholder="Toutes les extensions" />
                        </SelectTrigger>

                        <SelectContent>
                            {extensions.map((extension) => (
                                <SelectItem
                                    key={extension}
                                    value={extension}
                                >
                                    {extension}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Results count */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-500">
                            {hasActiveFilters ? (
                                <>
                                    <span className="text-zinc-300">
                                        {filteredCards.length}
                                    </span>{" "}
                                    résultat{filteredCards.length > 1 ? "s" : ""}
                                </>
                            ) : (
                                <>
                                    <span className="text-zinc-300">
                                        {totalCards}
                                    </span>{" "}
                                    cartes ·{" "}
                                    <span className="text-zinc-300">
                                        {uniqueCards}
                                    </span>{" "}
                                    uniques
                                </>
                            )}
                        </p>
                        <Select
                            value={sortBy}
                            onValueChange={(value) =>
                                setSortBy(value ?? "recent")
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[210px] border-white/10 bg-[#111114] text-xs text-white">
                                <div className="flex items-center gap-2">
                                    <ArrowDownUp className="h-3.5 w-3.5 text-zinc-500" />

                                    <SelectValue placeholder="Trier par" />
                                </div>
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

                        {hasActiveFilters && (
                            <span className="text-xs text-zinc-600">
                                {activeFilters.length} filtre
                                {activeFilters.length > 1 ? "s" : ""} actif
                                {activeFilters.length > 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {activeFilters.map((filter) => (
                                <button
                                    key={filter.label}
                                    type="button"
                                    onClick={filter.onRemove}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                                >
                                    {filter.label}
                                    <X className="h-3 w-3" />
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-600 transition-colors hover:text-zinc-300"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Réinitialiser
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Collection */}
            {filteredCards.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCards.map((card) => (
                        <CardItem key={card.id} card={card} />
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#111114] px-6 py-16 text-center">
                    <Package className="mx-auto h-8 w-8 text-zinc-700" />

                    <h3 className="mt-4 font-semibold text-white">
                        Votre collection est vide
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600">
                        Commencez par ajouter votre première carte Pokémon.
                    </p>

                    <div className="mt-6">
                        <AddCardDialog />
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#111114] px-6 py-16 text-center">
                    <Search className="mx-auto h-8 w-8 text-zinc-700" />

                    <h3 className="mt-4 font-semibold text-white">
                        Aucune carte trouvée
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600">
                        Aucune carte ne correspond aux critères sélectionnés.
                    </p>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}