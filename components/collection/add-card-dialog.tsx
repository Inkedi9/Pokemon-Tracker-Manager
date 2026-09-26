"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useCollection } from "@/components/collection/collection-provider";

import type {
    CardAutoFillData,
} from "@/lib/recognition/card-autofill";

import type {
    CardCondition,
    CardLanguage,
    PokemonCard,
} from "@/types/card";

import {
    normalizeMarketPrice,
    normalizePriceSource,
} from "@/lib/pricing-validation";

import {
    addPriceSnapshot,
    createPriceSnapshot,
} from "@/lib/price-history";

const initialForm = {
    name: "",
    set: "",
    number: "",
    language: "",
    rarity: "",
    condition: "",
    quantity: "1",
    purchasePrice: "",
    estimatedValue: "",
    marketPrice: "",
    priceSource: "none",
    location: "",
    notes: "",
};

type AddCardDialogProps = {
    initialData?: CardAutoFillData | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: (card: PokemonCard) => void;
};

export function AddCardDialog({
    initialData,
    open: controlledOpen,
    onOpenChange,
    onSuccess,
}: AddCardDialogProps = {}) {
    const { addCard } = useCollection();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");

    const [internalOpen, setInternalOpen] =
        useState(false);

    const isControlled =
        controlledOpen !== undefined;

    const open = isControlled
        ? controlledOpen
        : internalOpen;

    function updateField(
        field: keyof typeof form,
        value: string | null
    ) {
        setForm((current) => ({
            ...current,
            [field]: value ?? "",
        }));

        setError("");
    }

    function resetForm() {
        setForm(initialForm);
        setError("");
    }

    useEffect(() => {
        if (!open || !initialData) {
            return;
        }

        setForm({
            ...initialForm,
            name: initialData.name,
            set: initialData.set,
            number: initialData.number,
            language: initialData.language,
            rarity: initialData.rarity,
        });

        setError("");
    }, [open, initialData]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.name.trim()) {
            setError("Le nom du Pokémon est obligatoire.");
            return;
        }

        if (!form.set.trim()) {
            setError("L'extension est obligatoire.");
            return;
        }

        if (!form.number.trim()) {
            setError("Le numéro de carte est obligatoire.");
            return;
        }

        if (!form.language) {
            setError("La langue est obligatoire.");
            return;
        }

        if (!form.rarity) {
            setError("La rareté est obligatoire.");
            return;
        }

        if (!form.condition) {
            setError("L'état de la carte est obligatoire.");
            return;
        }

        const quantity = Number(form.quantity);
        const purchasePrice = Number(form.purchasePrice);
        const estimatedValue = Number(form.estimatedValue);

        const marketPrice =
            form.marketPrice.trim() === ""
                ? undefined
                : normalizeMarketPrice(form.marketPrice);

        const priceSource =
            form.priceSource === "none"
                ? undefined
                : normalizePriceSource(form.priceSource);

        if (!Number.isInteger(quantity) || quantity < 1) {
            setError("La quantité doit être un nombre entier supérieur à 0.");
            return;
        }

        if (Number.isNaN(purchasePrice) || purchasePrice < 0) {
            setError("Le prix d'achat doit être supérieur ou égal à 0.");
            return;
        }

        if (Number.isNaN(estimatedValue) || estimatedValue < 0) {
            setError("La valeur estimée doit être supérieure ou égale à 0.");
            return;
        }

        if (
            form.marketPrice.trim() !== "" &&
            marketPrice === undefined
        ) {
            setError(
                "Le prix marché doit être un nombre supérieur ou égal à 0."
            );
            return;
        }

        const newCard: PokemonCard = {
            id: crypto.randomUUID(),

            name: form.name.trim(),
            set: form.set.trim(),
            number: form.number.trim(),

            language: form.language as CardLanguage,
            rarity: form.rarity,

            quantity,
            condition: form.condition as CardCondition,

            purchasePrice,
            estimatedValue,

            ...(marketPrice !== undefined
                ? {
                    marketPrice,
                    priceSource,
                    priceUpdatedAt: new Date().toISOString(),
                }
                : {}),

            location: form.location.trim(),
            notes: form.notes.trim(),
        };

        const cardWithHistory =
            createPriceSnapshot(newCard);

        const finalCard =
            cardWithHistory
                ? addPriceSnapshot(
                    newCard,
                    cardWithHistory
                )
                : newCard;

        addCard(finalCard);

        toast.success("Carte ajoutée", {
            description: `${newCard.name} a été ajoutée à ta collection.`,
        });

        onSuccess?.(newCard);
        handleDialogOpenChange(false);
    }

    function handleDialogOpenChange(
        value: boolean
    ) {
        if (!isControlled) {
            setInternalOpen(value);
        }

        onOpenChange?.(value);

        if (!value) {
            resetForm();
        }
    }

    function handleOpenChange(value: boolean) {
        handleDialogOpenChange(value);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleDialogOpenChange}
        >
            {!isControlled && (
                <DialogTrigger>
                    <Button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-yellow-300"
                    >
                        Ajouter une carte
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#111114] text-white sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Ajouter une carte
                    </DialogTitle>

                    <DialogDescription className="text-zinc-500">
                        Ajoute les informations de ta carte Pokémon.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        {/* Informations principales */}

                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Informations principales
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du Pokémon</Label>

                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(event) =>
                                            updateField("name", event.target.value)
                                        }
                                        placeholder="Ex : Pikachu"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="set">Extension</Label>

                                    <Input
                                        id="set"
                                        value={form.set}
                                        onChange={(event) =>
                                            updateField("set", event.target.value)
                                        }
                                        placeholder="Ex : Écarlate & Violet"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="number">Numéro</Label>

                                    <Input
                                        id="number"
                                        value={form.number}
                                        onChange={(event) =>
                                            updateField("number", event.target.value)
                                        }
                                        placeholder="Ex : 025/198"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Langue</Label>

                                    <Select
                                        value={form.language}
                                        onValueChange={(value) =>
                                            updateField("language", value)
                                        }
                                    >
                                        <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                            <SelectValue placeholder="Sélectionner" />
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
                                </div>

                                <div className="space-y-2">
                                    <Label>Rareté</Label>

                                    <Select
                                        value={form.rarity}
                                        onValueChange={(value) =>
                                            updateField("rarity", value)
                                        }
                                    >
                                        <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="Common">Commune</SelectItem>
                                            <SelectItem value="Uncommon">
                                                Peu commune
                                            </SelectItem>
                                            <SelectItem value="Rare">Rare</SelectItem>
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
                                </div>

                                <div className="space-y-2">
                                    <Label>État</Label>

                                    <Select
                                        value={form.condition}
                                        onValueChange={(value) =>
                                            updateField("condition", value)
                                        }
                                    >
                                        <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                            <SelectValue placeholder="Sélectionner" />
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
                                </div>
                            </div>
                        </div>

                        {/* Valeur */}

                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Valeur & quantité
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantité</Label>

                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={form.quantity}
                                        onChange={(event) =>
                                            updateField("quantity", event.target.value)
                                        }
                                        className="border-white/10 bg-white/5 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purchasePrice">
                                        Prix d&apos;achat (€)
                                    </Label>

                                    <Input
                                        id="purchasePrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.purchasePrice}
                                        onChange={(event) =>
                                            updateField(
                                                "purchasePrice",
                                                event.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estimatedValue">
                                        Valeur estimée (€)
                                    </Label>

                                    <Input
                                        id="estimatedValue"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.estimatedValue}
                                        onChange={(event) =>
                                            updateField(
                                                "estimatedValue",
                                                event.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marketPrice">
                                        Prix marché (€)
                                    </Label>

                                    <Input
                                        id="marketPrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.marketPrice}
                                        onChange={(event) =>
                                            updateField(
                                                "marketPrice",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Optionnel"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label>Source du prix marché</Label>

                                    <Select
                                        value={form.priceSource}
                                        onValueChange={(value) =>
                                            updateField("priceSource", value)
                                        }
                                    >
                                        <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                            <SelectValue placeholder="Sélectionner une source" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="none">
                                                Aucune source
                                            </SelectItem>

                                            <SelectItem value="manual">
                                                Saisie manuelle
                                            </SelectItem>

                                            <SelectItem value="cardmarket">
                                                Cardmarket
                                            </SelectItem>

                                            <SelectItem value="tcgplayer">
                                                TCGplayer
                                            </SelectItem>

                                            <SelectItem value="ebay">
                                                eBay
                                            </SelectItem>

                                            <SelectItem value="other">
                                                Autre
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Organisation */}

                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Organisation
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        Emplacement
                                    </Label>

                                    <Input
                                        id="location"
                                        value={form.location}
                                        onChange={(event) =>
                                            updateField("location", event.target.value)
                                        }
                                        placeholder="Ex : Classeur 01 · Page 12"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>

                                    <Textarea
                                        id="notes"
                                        value={form.notes}
                                        onChange={(event) =>
                                            updateField("notes", event.target.value)
                                        }
                                        placeholder="Informations supplémentaires..."
                                        className="min-h-[90px] resize-none border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Erreur */}

                        {error && (
                            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Actions */}

                        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleOpenChange(false)}
                                className="text-zinc-400 hover:bg-white/5 hover:text-white"
                            >
                                Annuler
                            </Button>

                            <Button
                                type="submit"
                                className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter la carte
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
