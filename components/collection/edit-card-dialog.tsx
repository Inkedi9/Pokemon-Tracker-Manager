"use client";

import { useState } from "react";
import { Pencil, History, } from "lucide-react";
import { toast } from "sonner";

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

import { useCollection } from "@/components/collection/collection-provider";

import type {
  CardCondition,
  CardLanguage,
  PokemonCard,
} from "@/types/card";

import {
  getMarketPrice,
  getMarketValue,
  getUnrealizedProfit,
  getUnrealizedROI,
} from "@/lib/pricing";

import {
  getLatestPriceVariation,
  getPriceHistory,
  getPriceVariation,
} from "@/lib/price-history";

import {
  normalizeMarketPrice,
  normalizePriceSource,
} from "@/lib/pricing-validation";

import { PriceHistoryChart } from "@/components/collection/price-history-chart";

type EditCardDialogProps = {
  card: PokemonCard;
};

function getCardForm(card: PokemonCard) {
  return {
    name: card.name,
    set: card.set,
    number: card.number,
    language: card.language,
    rarity: card.rarity,
    condition: card.condition,
    quantity: String(card.quantity),
    purchasePrice: String(card.purchasePrice),
    estimatedValue: String(card.estimatedValue),
    location: card.location ?? "",
    notes: card.notes ?? "",
    marketPrice:
      card.marketPrice !== undefined
        ? String(card.marketPrice)
        : "",

    priceSource: card.priceSource ?? "none",
  };
}

export function EditCardDialog({
  card,
}: EditCardDialogProps) {
  const { updateCard } = useCollection();

  const marketPrice = getMarketPrice(card);
  const marketValue = getMarketValue(card);
  const unrealizedProfit = getUnrealizedProfit(card);
  const unrealizedROI = getUnrealizedROI(card);

  const priceHistory = getPriceHistory(card);

  const priceVariation =
    getPriceVariation(card);

  const latestPriceVariation =
    getLatestPriceVariation(card);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState(() => getCardForm(card));

  const [error, setError] = useState("");

  function handleOpenChange(value: boolean) {
    if (value) {
      setForm(getCardForm(card));
    }

    setError("");
    setOpen(value);
  }

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

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
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
      setError(
        "La quantité doit être un nombre entier supérieur à 0."
      );
      return;
    }

    if (Number.isNaN(purchasePrice) || purchasePrice < 0) {
      setError(
        "Le prix d'achat doit être supérieur ou égal à 0."
      );
      return;
    }

    if (
      Number.isNaN(estimatedValue) ||
      estimatedValue < 0
    ) {
      setError(
        "La valeur estimée doit être supérieure ou égale à 0."
      );
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

    const previousMarketPrice = card.marketPrice;

    const marketPriceChanged =
      previousMarketPrice !== marketPrice;

    const updatedCard: PokemonCard = {
      ...card,

      name: form.name.trim(),
      set: form.set.trim(),
      number: form.number.trim(),

      language: form.language as CardLanguage,
      rarity: form.rarity,

      quantity,
      condition: form.condition as CardCondition,

      purchasePrice,
      estimatedValue,

      marketPrice,

      priceSource:
        marketPrice !== undefined
          ? priceSource
          : undefined,

      priceUpdatedAt:
        marketPrice === undefined
          ? undefined
          : marketPriceChanged
            ? new Date().toISOString()
            : card.priceUpdatedAt,

      location: form.location.trim(),
      notes: form.notes.trim(),
    };

    updateCard(updatedCard);

    toast.success("Carte modifiée", {
      description: `${updatedCard.name} a été mise à jour.`,
    });

    setOpen(false);
  }

  function formatPriceHistoryDate(
    value: string
  ): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function getPriceSourceLabel(
    source: PokemonCard["priceSource"]
  ): string {
    switch (source) {
      case "manual":
        return "Manuel";

      case "cardmarket":
        return "Cardmarket";

      case "tcgplayer":
        return "TCGplayer";

      case "ebay":
        return "eBay";

      case "other":
        return "Autre";

      default:
        return "Inconnue";
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex-1 gap-2 text-zinc-400 hover:bg-white/5 hover:text-white inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors">
        <Pencil className="h-3.5 w-3.5" />
        Modifier
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#111114] text-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Modifier la carte
          </DialogTitle>

          <DialogDescription className="text-zinc-500">
            Modifie les informations de ta carte Pokémon.
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
                  <Label htmlFor={`edit-name-${card.id}`}>
                    Nom du Pokémon
                  </Label>

                  <Input
                    id={`edit-name-${card.id}`}
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-set-${card.id}`}>
                    Extension
                  </Label>

                  <Input
                    id={`edit-set-${card.id}`}
                    value={form.set}
                    onChange={(event) =>
                      updateField(
                        "set",
                        event.target.value
                      )
                    }
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-number-${card.id}`}>
                    Numéro
                  </Label>

                  <Input
                    id={`edit-number-${card.id}`}
                    value={form.number}
                    onChange={(event) =>
                      updateField(
                        "number",
                        event.target.value
                      )
                    }
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>

                {/* Langue */}
                <div className="space-y-2">
                  <Label>Langue</Label>

                  <Select
                    value={form.language}
                    onValueChange={(value) =>
                      updateField("language", value)
                    }
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
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
                </div>

                {/* Rareté */}
                <div className="space-y-2">
                  <Label>Rareté</Label>

                  <Select
                    value={form.rarity}
                    onValueChange={(value) =>
                      updateField("rarity", value)
                    }
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
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
                </div>

                {/* Etat */}
                <div className="space-y-2">
                  <Label>État</Label>

                  <Select
                    value={form.condition}
                    onValueChange={(value) =>
                      updateField("condition", value)
                    }
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
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
                  <Label htmlFor={`edit-quantity-${card.id}`}>
                    Quantité
                  </Label>

                  <Input
                    id={`edit-quantity-${card.id}`}
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={(event) =>
                      updateField(
                        "quantity",
                        event.target.value
                      )
                    }
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`edit-purchase-${card.id}`}
                  >
                    Prix d&apos;achat (€)
                  </Label>

                  <Input
                    id={`edit-purchase-${card.id}`}
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
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`edit-estimated-${card.id}`}
                  >
                    Valeur estimée (€)
                  </Label>

                  <Input
                    id={`edit-estimated-${card.id}`}
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
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-market-price-${card.id}`}>
                    Prix marché (€)
                  </Label>

                  <Input
                    id={`edit-market-price-${card.id}`}
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

                  <p className="text-[10px] text-zinc-600">
                    Le prix marché est exprimé par exemplaire.
                  </p>

                  <Select
                    value={form.priceSource}
                    onValueChange={(value) =>
                      updateField("priceSource", value)
                    }
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                      <SelectValue />
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

            {/* Market Pricing */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Market Pricing
              </p>

              <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.02] p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Prix marché */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                      Prix marché
                    </p>

                    <p className="mt-1 text-lg font-semibold text-violet-300">
                      {marketPrice === null
                        ? "—"
                        : `${marketPrice.toFixed(2)} €`}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      prix unitaire
                    </p>
                  </div>

                  {/* Valeur marché */}
                  <div className="sm:border-l sm:border-white/5 sm:pl-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                      Valeur marché
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      {marketPrice === null
                        ? "—"
                        : `${marketValue.toFixed(2)} €`}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      {card.quantity} × prix marché
                    </p>
                  </div>

                  {/* P/L latent */}
                  <div className="lg:border-l lg:border-white/5 lg:pl-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                      P/L latent
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${unrealizedProfit === null
                        ? "text-zinc-500"
                        : unrealizedProfit >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                        }`}
                    >
                      {unrealizedProfit === null
                        ? "—"
                        : `${unrealizedProfit >= 0 ? "+" : ""}${unrealizedProfit.toFixed(2)} €`}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      vs prix d'achat
                    </p>
                  </div>

                  {/* ROI */}
                  <div className="sm:border-l sm:border-white/5 sm:pl-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                      ROI marché
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${unrealizedROI === null
                        ? "text-zinc-500"
                        : unrealizedROI >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                        }`}
                    >
                      {unrealizedROI === null
                        ? "—"
                        : `${unrealizedROI >= 0 ? "+" : ""}${unrealizedROI.toFixed(2)}%`}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      performance marché
                    </p>
                  </div>
                </div>

                {/* Source / date */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/5 pt-3">
                  <span className="text-[10px] text-zinc-700">
                    Source :{" "}
                    <span className="text-zinc-500">
                      {card.priceSource ?? "Non renseignée"}
                    </span>
                  </span>

                  <span className="text-[10px] text-zinc-700">
                    Mise à jour :{" "}
                    <span className="text-zinc-500">
                      {card.priceUpdatedAt
                        ? new Date(card.priceUpdatedAt).toLocaleDateString("fr-FR")
                        : "Non renseignée"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Historique des prix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {priceHistory.length > 0 && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                    {priceHistory.length}{" "}
                    {priceHistory.length > 1
                      ? "relevés"
                      : "relevé"}
                  </span>
                )}
              </div>
              {/* Graphique pleine largeur */}
              {priceHistory.length >= 2 && (
                <PriceHistoryChart
                  history={priceHistory}
                />
              )}

              {priceHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center">
                  <History className="mx-auto mb-2 h-5 w-5 text-zinc-700" />

                  <p className="text-sm text-zinc-500">
                    Aucun historique de prix.
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    Un historique sera créé dès qu'un prix marché sera enregistré.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {priceHistory
                    .slice()
                    .reverse()
                    .map((snapshot, index) => {
                      const isLatest = index === 0;

                      return (
                        <div
                          key={`${snapshot.recordedAt}-${snapshot.price}-${index}`}
                          className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${isLatest
                            ? "border-white/10 bg-white/[0.04]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                            }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-zinc-200">
                                {formatPriceHistoryDate(
                                  snapshot.recordedAt
                                )}
                              </p>

                              {isLatest && (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                  Actuel
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-zinc-600">
                              {getPriceSourceLabel(
                                snapshot.source
                              )}
                            </p>
                          </div>

                          <p className="shrink-0 font-mono text-sm font-semibold text-white">
                            {snapshot.price.toFixed(2)} €
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {priceHistory.length >= 2 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10">
                  <p className="text-xs text-zinc-600">
                    Depuis le premier relevé
                  </p>

                  <p
                    className={`mt-1 font-mono text-sm font-semibold ${priceVariation !== null &&
                      priceVariation >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                      }`}
                  >
                    {priceVariation !== null
                      ? `${priceVariation >= 0
                        ? "+"
                        : ""
                      }${priceVariation.toFixed(2)} %`
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10">
                  <p className="text-xs text-zinc-600">
                    Depuis le dernier relevé
                  </p>

                  <p
                    className={`mt-1 font-mono text-sm font-semibold ${latestPriceVariation !== null &&
                      latestPriceVariation >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                      }`}
                  >
                    {latestPriceVariation !== null
                      ? `${latestPriceVariation >= 0
                        ? "+"
                        : ""
                      }${latestPriceVariation.toFixed(2)} %`
                      : "—"}
                  </p>
                </div>
              </div>
            )}

            {/* Organisation */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Organisation
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-location-${card.id}`}>
                    Emplacement
                  </Label>

                  <Input
                    id={`edit-location-${card.id}`}
                    value={form.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value
                      )
                    }
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-notes-${card.id}`}>
                    Notes
                  </Label>

                  <Textarea
                    id={`edit-notes-${card.id}`}
                    value={form.notes}
                    onChange={(event) =>
                      updateField(
                        "notes",
                        event.target.value
                      )
                    }
                    className="min-h-[90px] resize-none border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
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
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300"
              >
                <Pencil className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
