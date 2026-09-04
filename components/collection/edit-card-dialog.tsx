"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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

type EditCardDialogProps = {
  card: PokemonCard;
};

export function EditCardDialog({
  card,
}: EditCardDialogProps) {
  const { updateCard } = useCollection();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
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
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
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
    });

    setError("");
  }, [open, card]);

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

      location: form.location.trim(),
      notes: form.notes.trim(),
    };

    updateCard(updatedCard);

    toast.success("Carte modifiée", {
      description: `${updatedCard.name} a été mise à jour.`,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

              <div className="grid gap-4 sm:grid-cols-3">
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
                    Prix d'achat (€)
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
              </div>
            </div>

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